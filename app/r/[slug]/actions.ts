"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { assertCanCreateBooking, getBarbershopPlanUsage } from "@/src/lib/plans/limits";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";

const ACTIVE_STATUSES = ["scheduled", "confirmed"] as const;

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
  serviceId?: string | null;
  barberId: string | null;
  date: string;
};

type BarberRow = {
  id: string;
  name?: string | null;
};

type ServiceRow = {
  duration_minutes: number | null;
};

type AppointmentAvailabilityRow = {
  start_time: string;
  end_time: string | null;
  barber_id: string | null;
};

type AppointmentConflictRow = {
  start_time: string;
  end_time: string | null;
  barber_id: string | null;
};

function normalizeTime(time: string | null | undefined) {
  if (!time) return "";
  return time.slice(0, 5);
}

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

function timesOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string | null
) {
  const start = normalizeTime(existingStart);
  const end = normalizeTime(existingEnd) || addMinutesToTime(start, 30);

  return newStart < end && newEnd > start;
}

async function findAvailableBarber({
  supabase,
  barbershopId,
  date,
  time,
  durationMinutes,
}: {
  supabase: ReturnType<typeof createServiceRoleClient>;
  barbershopId: string;
  date: string;
  time: string;
  durationMinutes: number;
}) {
  const { data: barbersData, error: barbersError } = await supabase
    .from("barbers")
    .select("id, name")
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .order("name", { ascending: true });

  if (barbersError) {
    return {
      barberId: null as string | null,
      error: barbersError.message,
    };
  }

  const activeBarbers = (barbersData ?? []) as BarberRow[];

  if (activeBarbers.length === 0) {
    return {
      barberId: null as string | null,
      error: "Esta barbería no tiene barberos activos.",
    };
  }

  const activeBarberIds = activeBarbers.map((barber) => barber.id);

  const { data: appointmentsData, error: appointmentsError } = await supabase
    .from("appointments")
    .select("start_time, end_time, barber_id")
    .eq("barbershop_id", barbershopId)
    .eq("appointment_date", date)
    .in("status", ACTIVE_STATUSES)
    .in("barber_id", activeBarberIds);

  if (appointmentsError) {
    return {
      barberId: null as string | null,
      error: appointmentsError.message,
    };
  }

  const appointments = (appointmentsData ?? []) as AppointmentConflictRow[];
  const requestedStart = normalizeTime(time);
  const requestedEnd = addMinutesToTime(requestedStart, durationMinutes);
  const busyBarberIds = new Set<string>();

  for (const appointment of appointments) {
    if (!appointment.barber_id) continue;

    if (
      timesOverlap(
        requestedStart,
        requestedEnd,
        appointment.start_time,
        appointment.end_time
      )
    ) {
      busyBarberIds.add(appointment.barber_id);
    }
  }

  const availableBarber = activeBarbers.find(
    (barber) => !busyBarberIds.has(barber.id)
  );

  return {
    barberId: availableBarber?.id ?? null,
    error: availableBarber
      ? null
      : "Esta hora ya no está disponible. Elige otra.",
  };
}

export async function getUnavailableSlots(
  input: AvailabilityInput
): Promise<{ unavailableSlots: string[]; error: string | null }> {
  const supabase = createServiceRoleClient();

  const barbershopId = input.barbershopId?.trim();
  const serviceId = input.serviceId?.trim();
  const date = input.date?.trim();
  let barberId =
    input.barberId && input.barberId !== "any" && input.barberId.trim() !== ""
      ? input.barberId.trim()
      : null;

  if (!barbershopId || !date) {
    return {
      unavailableSlots: [],
      error: null,
    };
  }

  let durationMinutes = 30;

  if (serviceId) {
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", serviceId)
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .maybeSingle();

    const service = serviceData as ServiceRow | null;

    if (serviceError || !service) {
      return {
        unavailableSlots: [],
        error: "Servicio no disponible.",
      };
    }

    durationMinutes = service.duration_minutes ?? 30;
  }

  if (barberId) {
    const { data: appointmentsData, error } = await supabase
      .from("appointments")
      .select("start_time, end_time, barber_id")
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

    const appointments = (appointmentsData ?? []) as AppointmentConflictRow[];

    return {
      unavailableSlots: generateTimeSlots()
        .map((slot) => slot.time)
        .filter((slot) => {
          const slotEnd = addMinutesToTime(slot, durationMinutes);

          return appointments.some((appointment) =>
            timesOverlap(slot, slotEnd, appointment.start_time, appointment.end_time)
          );
        }),
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
    .select("start_time, end_time, barber_id")
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

  const unavailableSlots = generateTimeSlots()
    .map((slot) => slot.time)
    .filter((slot) => {
      const slotEnd = addMinutesToTime(slot, durationMinutes);
      const busyBarberIds = new Set<string>();

      for (const appointment of appointments) {
        if (!appointment.barber_id) continue;

        if (
          timesOverlap(
            slot,
            slotEnd,
            appointment.start_time,
            appointment.end_time
          )
        ) {
          busyBarberIds.add(appointment.barber_id);
        }
      }

      return busyBarberIds.size >= activeBarbers.length;
    });

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

  let barberId =
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

  const usage = await getBarbershopPlanUsage(supabase, barbershopId);
  const limitError = assertCanCreateBooking(usage);
  if (limitError) {
    return {
      error: limitError,
    };
  }

  if (!barberId) {
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("duration_minutes")
      .eq("id", serviceId)
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .maybeSingle();

    const service = serviceData as ServiceRow | null;

    if (serviceError || !service) {
      return {
        error: "Servicio no disponible.",
      };
    }

    const available = await findAvailableBarber({
      supabase,
      barbershopId,
      date,
      time,
      durationMinutes: service.duration_minutes ?? 30,
    });

    if (available.error || !available.barberId) {
      return {
        error:
          available.error ?? "Esta hora ya no está disponible. Elige otra.",
      };
    }

    barberId = available.barberId;
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
