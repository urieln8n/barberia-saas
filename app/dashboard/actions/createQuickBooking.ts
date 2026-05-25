"use server"

import { createClient as createServerClient } from "@/src/lib/supabase/server"
import { createServiceRoleClient } from "@/src/lib/supabase/service-role"
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current"
import { checkSlotAvailability } from "@/src/lib/appointments/check-availability"
import { revalidatePath } from "next/cache"

type QuickBookingInput = {
  customerName: string
  customerPhone: string
  customerEmail?: string
  serviceId: string
  barberId: string
  appointmentDate: string  // YYYY-MM-DD
  appointmentTime: string  // HH:MM
  notes?: string
  paymentStatus?: "pending" | "paid"
}

type QuickBookingResult =
  | { success: true; appointmentId: string }
  | { success: false; error: string }

function addMinutesToTime(time: string, minutesToAdd: number): string {
  const [hoursRaw, minutesRaw] = time.split(":")
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  date.setMinutes(date.getMinutes() + minutesToAdd)
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}:00`
}

export async function createQuickBooking(
  input: QuickBookingInput
): Promise<QuickBookingResult> {
  // 1. Validate required fields server-side
  const customerName = input.customerName?.trim()
  const customerPhone = input.customerPhone?.trim()
  const serviceId = input.serviceId?.trim()
  const barberId = input.barberId?.trim()
  const appointmentDate = input.appointmentDate?.trim()
  const appointmentTime = input.appointmentTime?.trim()

  if (!customerName) return { success: false, error: "El nombre del cliente es obligatorio." }
  if (!customerPhone) return { success: false, error: "El teléfono del cliente es obligatorio." }
  if (!serviceId) return { success: false, error: "Debes seleccionar un servicio." }
  if (!barberId) return { success: false, error: "Debes seleccionar un barbero." }
  if (!appointmentDate) return { success: false, error: "La fecha es obligatoria." }
  if (!appointmentTime) return { success: false, error: "La hora es obligatoria." }

  // Basic date/time format validation
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  const timeRegex = /^\d{2}:\d{2}$/
  if (!dateRegex.test(appointmentDate)) return { success: false, error: "Formato de fecha no válido." }
  if (!timeRegex.test(appointmentTime)) return { success: false, error: "Formato de hora no válido." }

  // 2. Get authenticated client + resolve barbershop_id from session (NEVER from client input)
  const authClient = await createServerClient()
  const {
    data: { user },
    error: userError,
  } = await authClient.auth.getUser()

  if (userError || !user) {
    return { success: false, error: "Debes iniciar sesión para crear citas." }
  }

  const barbershopId = await getCurrentBarbershopId(authClient, user.id)

  if (!barbershopId) {
    return { success: false, error: "No se encontró la barbería. Completa el onboarding." }
  }

  // Use service role client for DB writes (bypasses RLS safely since we validated barbershop_id from session)
  const supabase = createServiceRoleClient()

  // 3. Validate service belongs to this barbershop
  const { data: serviceData, error: serviceError } = await supabase
    .from("services")
    .select("id, duration_minutes, price")
    .eq("id", serviceId)
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .maybeSingle()

  if (serviceError || !serviceData) {
    return { success: false, error: "El servicio seleccionado no está disponible." }
  }

  // 4. Validate barber belongs to this barbershop
  const { data: barberData, error: barberError } = await supabase
    .from("barbers")
    .select("id")
    .eq("id", barberId)
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .maybeSingle()

  if (barberError || !barberData) {
    return { success: false, error: "El barbero seleccionado no está disponible." }
  }

  // 5. Check for double booking conflict — interval-based, not exact-match
  const startTimeFormatted = appointmentTime.length === 5 ? `${appointmentTime}:00` : appointmentTime
  const endTimeForCheck = addMinutesToTime(appointmentTime, serviceData.duration_minutes ?? 30)

  const availabilityCheck = await checkSlotAvailability({
    supabase,
    barbershopId,
    barberId,
    appointmentDate,
    startTime: startTimeFormatted,
    endTime: endTimeForCheck,
  })

  if (!availabilityCheck.available) {
    return { success: false, error: availabilityCheck.reason }
  }

  // 6. Find or create client by phone + barbershop_id
  const { data: existingClient, error: clientSearchError } = await supabase
    .from("clients")
    .select("id")
    .eq("barbershop_id", barbershopId)
    .eq("phone", customerPhone)
    .maybeSingle()

  if (clientSearchError) {
    return { success: false, error: "Error al buscar el cliente. Intenta de nuevo." }
  }

  let clientId: string

  if (existingClient) {
    clientId = existingClient.id
  } else {
    // Create new client
    const { data: newClient, error: createClientError } = await supabase
      .from("clients")
      .insert({
        barbershop_id: barbershopId,
        name: customerName,
        phone: customerPhone,
        email: input.customerEmail?.trim() || null,
      })
      .select("id")
      .single()

    if (createClientError || !newClient) {
      return { success: false, error: "No se pudo crear el cliente. Intenta de nuevo." }
    }

    clientId = newClient.id
  }

  // 7. Calculate end time from service duration
  const endTime = addMinutesToTime(appointmentTime, serviceData.duration_minutes ?? 30)

  // 8. Create the appointment
  const { data: appointment, error: insertError } = await supabase
    .from("appointments")
    .insert({
      barbershop_id: barbershopId,
      client_id: clientId,
      barber_id: barberId,
      service_id: serviceId,
      appointment_date: appointmentDate,
      start_time: startTimeFormatted,
      end_time: endTime,
      status: "scheduled",
      source: "dashboard",
      notes: input.notes?.trim() || null,
    })
    .select("id")
    .single()

  if (insertError || !appointment) {
    // Detect known constraint violations without leaking raw error messages
    const msg = insertError?.message?.toLowerCase() ?? ""
    if (msg.includes("unique") || msg.includes("duplicate") || msg.includes("conflict")) {
      return { success: false, error: "Esta hora ya no está disponible. Elige otra." }
    }
    return { success: false, error: "No se pudo crear la cita. Intenta de nuevo." }
  }

  // Revalidate dashboard and agenda paths
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agenda")
  revalidatePath("/dashboard/clientes")

  return { success: true, appointmentId: appointment.id }
}
