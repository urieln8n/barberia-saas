"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { assertCanCreateBooking, getBarbershopPlanUsage } from "@/src/lib/plans/limits";
import { checkSlotAvailability } from "@/src/lib/appointments/check-availability";

type ExistingAppointmentRow = {
  id: string;
  barber_id: string;
  service_id: string;
  status: string;
};

type BarberRow = {
  id: string;
  name: string | null;
};

type ServiceRow = {
  id: string;
  duration_minutes: number | null;
};

type ClientRow = {
  id: string;
};

function addMinutesToTime(time: string, minutesToAdd: number) {
  const [hoursRaw, minutesRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
}

async function getLoggedBarbershopId() {
  const authClient = await createServerClient();

  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user) {
    return {
      error: "Debes iniciar sesión.",
      barbershopId: null as string | null,
    };
  }

  const barbershopId = await getCurrentBarbershopId(authClient, user.id);

  if (!barbershopId) {
    return {
      error: "No se encontró la barbería actual.",
      barbershopId: null as string | null,
    };
  }

  return {
    error: null,
    barbershopId,
  };
}

async function findAvailableBarber({
  supabase,
  barbershopId,
  appointmentDate,
  startTime,
  endTime,
}: {
  supabase: ReturnType<typeof createServiceRoleClient>;
  barbershopId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
}) {
  const { data: barbersData, error } = await supabase
    .from("barbers")
    .select("id, name")
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .order("name", { ascending: true });

  if (error) {
    return {
      error: error.message,
      barberId: null as string | null,
    };
  }

  const barbers = (barbersData ?? []) as BarberRow[];

  for (const barber of barbers) {
    const check = await checkSlotAvailability({
      supabase,
      barbershopId,
      barberId: barber.id,
      appointmentDate,
      startTime,
      endTime,
    });

    if (check.available) {
      return {
        error: null,
        barberId: barber.id,
      };
    }
  }

  return {
    error: "Esta hora ya no está disponible. Elige otra.",
    barberId: null as string | null,
  };
}

export async function createAppointment(formData: FormData) {
  const { error: authError, barbershopId } = await getLoggedBarbershopId();

  if (authError || !barbershopId) {
    return { error: authError ?? "No se pudo validar la barbería." };
  }

  const supabase = createServiceRoleClient();

  const usage = await getBarbershopPlanUsage(supabase, barbershopId);
  const limitError = assertCanCreateBooking(usage);
  if (limitError) return { error: limitError };

  const clientId = String(formData.get("client_id") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const barberIdRaw = String(formData.get("barber_id") ?? "").trim();
  const appointmentDate = String(formData.get("appointment_date") ?? "").trim();
  const startTime = String(formData.get("start_time") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!clientId || !serviceId || !appointmentDate || !startTime) {
    return { error: "Completa cliente, servicio, fecha y hora." };
  }

  const { data: serviceData, error: serviceError } = await supabase
    .from("services")
    .select("id, duration_minutes")
    .eq("id", serviceId)
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .maybeSingle();

  const service = serviceData as ServiceRow | null;

  if (serviceError || !service) {
    return { error: "Servicio no disponible." };
  }

  const { data: clientData, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  const client = clientData as ClientRow | null;

  if (clientError || !client) {
    return { error: "Cliente no válido para esta barbería." };
  }

  const endTime = addMinutesToTime(startTime, service.duration_minutes ?? 30);
  let barberId: string | null = barberIdRaw || null;

  if (barberId) {
    const { data: barberData, error: barberError } = await supabase
      .from("barbers")
      .select("id")
      .eq("id", barberId)
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .maybeSingle();

    const barber = barberData as BarberRow | null;

    if (barberError || !barber) {
      return { error: "Barbero no disponible." };
    }

    // Interval-based overlap check (includes pending, scheduled, confirmed)
    const check = await checkSlotAvailability({
      supabase,
      barbershopId,
      barberId,
      appointmentDate,
      startTime,
      endTime,
    });

    if (!check.available) {
      return { error: check.reason };
    }
  } else {
    const available = await findAvailableBarber({
      supabase,
      barbershopId,
      appointmentDate,
      startTime,
      endTime,
    });

    if (available.error || !available.barberId) {
      return {
        error: available.error ?? "No hay barberos disponibles para esa hora.",
      };
    }

    barberId = available.barberId;
  }

  const { error: insertError } = await supabase.from("appointments").insert({
    barbershop_id: barbershopId,
    client_id: clientId,
    service_id: serviceId,
    barber_id: barberId,
    appointment_date: appointmentDate,
    start_time: startTime,
    end_time: endTime,
    status: "scheduled",
    notes: notes || null,
  });

  if (insertError) {
    const message = insertError.message.toLowerCase();

    if (
      message.includes("unique_active_barber_appointment_slot") ||
      message.includes("duplicate")
    ) {
      return { error: "Esta hora ya no está disponible. Elige otra." };
    }

    return { error: insertError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/clientes");

  return { success: true };
}

export async function rescheduleAppointment(
  id: string,
  appointmentDate: string,
  startTime: string,
) {
  const { error: authError, barbershopId } = await getLoggedBarbershopId();
  if (authError || !barbershopId) {
    return { error: authError ?? "No se pudo validar la barbería." };
  }

  const supabase = createServiceRoleClient();

  const { data: existingData, error: fetchError } = await supabase
    .from("appointments")
    .select("id, barber_id, service_id, status")
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  const existing = existingData as ExistingAppointmentRow | null;

  if (fetchError || !existing) {
    return { error: "Cita no encontrada." };
  }

  if (["completed", "cancelled", "no_show"].includes(existing.status)) {
    return { error: "No se puede reagendar una cita ya finalizada." };
  }

  const { data: serviceData } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", existing.service_id)
    .maybeSingle();

  const duration = (serviceData as { duration_minutes: number | null } | null)?.duration_minutes ?? 30;
  const endTime = addMinutesToTime(startTime, duration);

  const check = await checkSlotAvailability({
    supabase,
    barbershopId,
    barberId: existing.barber_id,
    appointmentDate,
    startTime,
    endTime,
    excludeAppointmentId: id,
  });

  if (!check.available) {
    return { error: check.reason };
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update({
      appointment_date: appointmentDate,
      start_time: startTime,
      end_time: endTime,
    })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");

  return { success: true };
}

type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";

export async function updateAppointmentStatus(id: string, status: string) {
  const allowedStatus: AppointmentStatus[] = [
    "scheduled",
    "confirmed",
    "completed",
    "cancelled",
    "no_show",
  ];

  if (!allowedStatus.includes(status as AppointmentStatus)) {
    return { error: "Estado no válido." };
  }

  const { error: authError, barbershopId } = await getLoggedBarbershopId();

  if (authError || !barbershopId) {
    return { error: authError ?? "No se pudo validar la barbería." };
  }

  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("appointments")
    .update({ status: status as AppointmentStatus })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/clientes");

  return { success: true };
}
