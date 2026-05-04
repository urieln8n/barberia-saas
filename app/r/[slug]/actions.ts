"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

const ACTIVE_STATUSES = ["pending", "scheduled", "confirmed"];

type BookingInput = {
  barbershopId: string;
  serviceId: string;
  barberId: string | null;
  date: string;
  time: string;
  name: string;
  phone: string;
};

type AvailabilityInput = {
  barbershopId: string;
  barberId: string | null;
  date: string;
};

type BarberRow = {
  id: string;
  name?: string | null;
};

type AppointmentAvailabilityRow = {
  start_time: string;
  barber_id: string | null;
};

function normalizeTime(time: string | null | undefined) {
  if (!time) return "";
  return time.slice(0, 5);
}

export async function getUnavailableSlots(
  input: AvailabilityInput
): Promise<{ unavailableSlots: string[]; error: string | null }> {
  const supabase = createServiceRoleClient();

  const barbershopId = input.barbershopId?.trim();
  const date = input.date?.trim();
  const barberId =
    input.barberId && input.barberId !== "any" && input.barberId.trim() !== ""
      ? input.barberId.trim()
      : null;

  if (!barbershopId || !date) {
    return {
      unavailableSlots: [],
      error: null,
    };
  }

  if (barberId) {
    const { data: appointmentsData, error } = await supabase
      .from("appointments")
      .select("start_time")
      .eq("barbershop_id", barbershopId)
      .eq("barber_id", barberId)
      .eq("appointment_date", date)
      .in("status", ACTIVE_STATUSES);

    if (error) {
      return {
        unavailableSlots: [],
        error: error.message,
      };
    }

    const appointments = (appointmentsData ?? []) as { start_time: string }[];

    return {
      unavailableSlots: Array.from(
        new Set(appointments.map((item) => normalizeTime(item.start_time)))
      ),
      error: null,
    };
  }

  const { data: barbersData, error: barbersError } = await supabase
    .from("barbers")
    .select("id, name")
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .order("name", { ascending: true });

  if (barbersError) {
    return {
      unavailableSlots: [],
      error: barbersError.message,
    };
  }

  const activeBarbers = (barbersData ?? []) as BarberRow[];

  if (activeBarbers.length === 0) {
    return {
      unavailableSlots: [],
      error: "Esta barbería no tiene barberos activos.",
    };
  }

  const activeBarberIds = activeBarbers.map((barber) => barber.id);

  const { data: appointmentsData, error: appointmentsError } = await supabase
    .from("appointments")
    .select("start_time, barber_id")
    .eq("barbershop_id", barbershopId)
    .eq("appointment_date", date)
    .in("status", ACTIVE_STATUSES)
    .in("barber_id", activeBarberIds);

  if (appointmentsError) {
    return {
      unavailableSlots: [],
      error: appointmentsError.message,
    };
  }

  const appointments = (appointmentsData ?? []) as AppointmentAvailabilityRow[];

  const busyByTime = new Map<string, Set<string>>();

  for (const appointment of appointments) {
    if (!appointment.barber_id) continue;

    const time = normalizeTime(appointment.start_time);
    if (!time) continue;

    if (!busyByTime.has(time)) {
      busyByTime.set(time, new Set<string>());
    }

    busyByTime.get(time)?.add(appointment.barber_id);
  }

  const unavailableSlots: string[] = [];

  for (const [time, busyBarbers] of busyByTime.entries()) {
    if (busyBarbers.size >= activeBarbers.length) {
      unavailableSlots.push(time);
    }
  }

  return {
    unavailableSlots: unavailableSlots.sort(),
    error: null,
  };
}

export async function createPublicBooking(
  input: BookingInput
): Promise<{ error: string | null }> {
  const supabase = createServiceRoleClient();

  const barbershopId = input.barbershopId?.trim();
  const serviceId = input.serviceId?.trim();
  const date = input.date?.trim();
  const time = input.time?.trim();
  const name = input.name?.trim();
  const phone = input.phone?.trim();

  const barberId =
    input.barberId && input.barberId !== "any" && input.barberId.trim() !== ""
      ? input.barberId.trim()
      : null;

  if (!barbershopId || !serviceId || !date || !time || !name || !phone) {
    return {
      error: "Completa todos los campos obligatorios.",
    };
  }

  const { data: barbershop, error: barbershopError } = await supabase
    .from("barbershops")
    .select("id, slug, public_booking_enabled")
    .eq("id", barbershopId)
    .maybeSingle();

  if (barbershopError || !barbershop) {
    return {
      error: "Barbería no encontrada.",
    };
  }

  if (barbershop.public_booking_enabled === false) {
    return {
      error: "Las reservas online no están activas para esta barbería.",
    };
  }

  const { error: bookingError } = await supabase.rpc("create_booking_safe", {
    p_slug: barbershop.slug,
    p_service_id: serviceId,
    p_barber_id: barberId,
    p_client_name: name,
    p_client_phone: phone,
    p_appointment_date: date,
    p_start_time: time,
    p_notes: null,
  });

  if (bookingError) {
    const message = bookingError.message || "";

    if (
      message.includes("unique_active_barber_appointment_slot") ||
      message.toLowerCase().includes("duplicate") ||
      message.toLowerCase().includes("already exists") ||
      message.includes("Esta hora ya no está disponible")
    ) {
      return {
        error: "Esta hora ya no está disponible. Elige otra.",
      };
    }

    if (
      message.includes("Barbero no disponible") ||
      message.includes("Servicio no disponible") ||
      message.includes("Barbería no encontrada")
    ) {
      return {
        error: message,
      };
    }

    return {
      error: "No se pudo crear la reserva. Inténtalo de nuevo.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/clientes");
  revalidatePath(`/r/${barbershop.slug}`);

  return {
    error: null,
  };
}