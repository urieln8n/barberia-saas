"use server";

import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

type BookingInput = {
  barbershopId: string;
  serviceId: string;
  barberId: string | null;
  date: string;
  time: string;
  name: string;
  phone: string;
};

export async function createPublicBooking(input: BookingInput): Promise<{ error: string | null }> {
  const supabase = createServiceRoleClient();

  // Validate service belongs to this barbershop and is active
  const { data: service } = await supabase
    .from("services")
    .select("id, duration_minutes")
    .eq("id", input.serviceId)
    .eq("barbershop_id", input.barbershopId)
    .eq("active", true)
    .single();

  if (!service) return { error: "Servicio no válido" };

  // Validate barber belongs to this barbershop (if a specific one was chosen)
  const barberId = input.barberId === "any" ? null : input.barberId;

  if (barberId) {
    const { data: barber } = await supabase
      .from("barbers")
      .select("id")
      .eq("id", barberId)
      .eq("barbershop_id", input.barbershopId)
      .eq("active", true)
      .single();

    if (!barber) return { error: "Barbero no válido" };
  }

  const endTime = addMinutes(input.time, service.duration_minutes);

  // Anti-double-booking: check overlapping slot for same barber
  if (barberId) {
    const { data: conflicts } = await supabase
      .from("appointments")
      .select("id")
      .eq("barbershop_id", input.barbershopId)
      .eq("barber_id", barberId)
      .eq("appointment_date", input.date)
      .not("status", "in", '("cancelled","no_show")')
      .lt("start_time", endTime)
      .gt("end_time", input.time)
      .limit(1);

    if (conflicts && conflicts.length > 0) {
      return { error: "Ese horario ya no está disponible. Elige otra hora." };
    }
  }

  // Find or create client by phone within this barbershop
  let clientId: string;

  const { data: existing } = await supabase
    .from("clients")
    .select("id")
    .eq("barbershop_id", input.barbershopId)
    .eq("phone", input.phone.trim())
    .maybeSingle();

  if (existing) {
    clientId = existing.id;
  } else {
    const { data: created, error: clientError } = await supabase
      .from("clients")
      .insert({
        barbershop_id: input.barbershopId,
        name: input.name.trim(),
        phone: input.phone.trim(),
      })
      .select("id")
      .single();

    if (clientError || !created) return { error: "Error al registrar cliente. Inténtalo de nuevo." };
    clientId = created.id;
  }

  // Create the appointment
  const { error: apptError } = await supabase
    .from("appointments")
    .insert({
      barbershop_id: input.barbershopId,
      client_id: clientId,
      service_id: input.serviceId,
      barber_id: barberId,
      appointment_date: input.date,
      start_time: input.time,
      end_time: endTime,
      status: "pending",
      source: "public_booking",
    });

  if (apptError) return { error: "Error al crear la cita. Inténtalo de nuevo." };

  return { error: null };
}
