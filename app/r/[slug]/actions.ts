"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { BLOCKING_STATUSES } from "@/src/lib/appointments/check-availability";
import { assertCanCreateBooking, getBarbershopPlanUsage } from "@/src/lib/plans/limits";
import {
  buildRealAvailability,
  isSlotAvailableForBooking,
  type AppointmentWindow,
  type ClosureWindow,
  type ScheduleWindow,
} from "@/src/lib/booking/real-availability";
import {
  buildAppointmentCreatedPayload,
  createAutomationEvent,
} from "@/src/lib/automation/events";

const ACTIVE_STATUSES = BLOCKING_STATUSES;
const ACTIVE_STATUS_QUERY_VALUES = [...BLOCKING_STATUSES] as unknown as [
  "scheduled",
  "confirmed",
];
const BOOKING_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const BOOKING_RATE_LIMIT_MAX_BY_IP = 8;
const BOOKING_RATE_LIMIT_MAX_BY_PHONE = 3;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const bookingRateLimits = new Map<string, RateLimitBucket>();

type BookingInput = {
  barbershopId: string;
  serviceId: string;
  barberId: string | null;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  privacyAccepted?: boolean;
  website?: string;
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

const bookingInputSchema = z.object({
  barbershopId: z.string().trim().uuid("Barbería no válida."),
  serviceId: z.string().trim().uuid("Servicio no válido."),
  barberId: z
    .string()
    .trim()
    .uuid("Barbero no válido.")
    .nullable()
    .optional()
    .or(z.literal("any")),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida."),
  time: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}$/, "Hora no válida."),
  name: z
    .string()
    .trim()
    .min(2, "Añade tu nombre completo.")
    .max(80, "El nombre es demasiado largo."),
  phone: z
    .string()
    .trim()
    .min(6, "Añade un teléfono válido.")
    .max(25, "El teléfono es demasiado largo.")
    .regex(/^[+\d\s().-]+$/, "Añade un teléfono válido."),
  email: z
    .string()
    .trim()
    .email("Añade un email válido.")
    .max(120, "El email es demasiado largo.")
    .optional()
    .or(z.literal("")),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad." }),
  }),
  website: z.string().trim().max(0, "No se pudo crear la reserva."),
});

function normalizeTime(time: string | null | undefined) {
  if (!time) return "";
  return time.slice(0, 5);
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function getClientIp() {
  const requestHeaders = headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    realIp?.trim() ||
    "unknown"
  );
}

function checkRateLimit(key: string, maxAttempts: number) {
  const now = Date.now();
  const existing = bookingRateLimits.get(key);

  if (!existing || existing.resetAt <= now) {
    bookingRateLimits.set(key, {
      count: 1,
      resetAt: now + BOOKING_RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (existing.count >= maxAttempts) {
    return false;
  }

  existing.count += 1;
  return true;
}

function pruneRateLimits() {
  const now = Date.now();

  for (const [key, bucket] of bookingRateLimits.entries()) {
    if (bucket.resetAt <= now) {
      bookingRateLimits.delete(key);
    }
  }
}

function isFutureOrToday(date: string) {
  const today = new Date();
  const currentIso = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return date >= currentIso;
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
    .in("status", ACTIVE_STATUS_QUERY_VALUES)
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
): Promise<{
  unavailableSlots: string[];
  allSlots: string[];
  closedReason: string | null;
  usesFallbackSchedule: boolean;
  error: string | null;
}> {
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
      allSlots: [],
      closedReason: null,
      usesFallbackSchedule: true,
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
        allSlots: [],
        closedReason: null,
        usesFallbackSchedule: true,
        error: "Servicio no disponible.",
      };
    }

    durationMinutes = service.duration_minutes ?? 30;
  }

  let barbersQuery = supabase
    .from("barbers")
    .select("id, name")
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .order("name", { ascending: true });

  if (barberId) {
    barbersQuery = barbersQuery.eq("id", barberId);
  }

  const { data: barbersData, error: barbersError } = await barbersQuery;

  if (barbersError) {
    return {
      unavailableSlots: [],
      allSlots: [],
      closedReason: null,
      usesFallbackSchedule: true,
      error: barbersError.message,
    };
  }

  const activeBarbers = (barbersData ?? []) as BarberRow[];

  if (activeBarbers.length === 0) {
    return {
      unavailableSlots: [],
      allSlots: [],
      closedReason: null,
      usesFallbackSchedule: true,
      error: "Esta barbería no tiene barberos activos.",
    };
  }

  const activeBarberIds = activeBarbers.map((barber) => barber.id);

  const { data: appointmentsData, error: appointmentsError } = await supabase
    .from("appointments")
    .select("start_time, end_time, barber_id")
    .eq("barbershop_id", barbershopId)
    .eq("appointment_date", date)
        .in("status", ACTIVE_STATUS_QUERY_VALUES)
    .in("barber_id", activeBarberIds);

  if (appointmentsError) {
    return {
      unavailableSlots: [],
      allSlots: [],
      closedReason: null,
      usesFallbackSchedule: true,
      error: appointmentsError.message,
    };
  }

  const [
    { data: schedulesData, error: schedulesError },
    { data: closuresData, error: closuresError },
  ] = await Promise.all([
    supabase
      .from("barber_schedules")
      .select("barber_id, weekday, start_time, end_time, active")
      .eq("barbershop_id", barbershopId)
      .eq("active", true),
    supabase
      .from("barbershop_closures")
      .select("closure_date, start_time, end_time, reason")
      .eq("barbershop_id", barbershopId)
      .eq("closure_date", date),
  ]);

  if (schedulesError || closuresError) {
    return {
      unavailableSlots: [],
      allSlots: [],
      closedReason: null,
      usesFallbackSchedule: true,
      error:
        schedulesError?.message ??
        closuresError?.message ??
        "No se pudo comprobar la disponibilidad.",
    };
  }

  const availability = buildRealAvailability({
    activeBarberIds,
    selectedBarberId: barberId,
    date,
    durationMinutes,
    schedules: (schedulesData ?? []) as ScheduleWindow[],
    closures: (closuresData ?? []) as ClosureWindow[],
    appointments: (appointmentsData ?? []) as AppointmentWindow[],
  });

  return {
    unavailableSlots: availability.unavailableSlots,
    allSlots: availability.allSlots,
    closedReason: availability.closedReason,
    usesFallbackSchedule: availability.usesFallbackSchedule,
    error: null,
  };
}

export async function createPublicBooking(
  input: BookingInput
): Promise<{ error: string | null }> {
  const supabase = createServiceRoleClient();
  const parsed = bookingInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message ?? "Revisa los datos de la reserva.",
    };
  }

  const barbershopId = parsed.data.barbershopId;
  const serviceId = parsed.data.serviceId;
  const date = parsed.data.date;
  const time = parsed.data.time;
  const name = parsed.data.name;
  const phone = parsed.data.phone;
  const normalizedPhone = normalizePhone(phone);

  let barberId =
    parsed.data.barberId && parsed.data.barberId !== "any"
      ? parsed.data.barberId
      : null;

  if (!isFutureOrToday(date)) {
    return {
      error: "Elige una fecha futura.",
    };
  }

  pruneRateLimits();

  const clientIp = getClientIp();
  const ipAllowed = checkRateLimit(
    `ip:${barbershopId}:${clientIp}`,
    BOOKING_RATE_LIMIT_MAX_BY_IP
  );
  const phoneAllowed = checkRateLimit(
    `phone:${barbershopId}:${normalizedPhone}`,
    BOOKING_RATE_LIMIT_MAX_BY_PHONE
  );

  if (!ipAllowed || !phoneAllowed) {
    return {
      error:
        "Hemos recibido demasiados intentos de reserva. Inténtalo más tarde o contacta con la barbería.",
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

  const durationMinutes = service.duration_minutes ?? 30;

  const { data: barbersData, error: barbersError } = await supabase
    .from("barbers")
    .select("id, name")
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .order("name", { ascending: true });

  if (barbersError) {
    return {
      error: "No se pudo comprobar el equipo disponible.",
    };
  }

  const activeBarbers = (barbersData ?? []) as BarberRow[];
  const activeBarberIds = activeBarbers.map((barber) => barber.id);

  if (activeBarberIds.length === 0) {
    return {
      error: "Esta barbería no tiene barberos activos.",
    };
  }

  if (barberId && !activeBarberIds.includes(barberId)) {
    return {
      error: "Barbero no disponible.",
    };
  }

  const [
    { data: appointmentsData, error: appointmentsError },
    { data: schedulesData, error: schedulesError },
    { data: closuresData, error: closuresError },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("start_time, end_time, barber_id")
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", date)
      .in("status", ACTIVE_STATUS_QUERY_VALUES)
      .in("barber_id", activeBarberIds),
    supabase
      .from("barber_schedules")
      .select("barber_id, weekday, start_time, end_time, active")
      .eq("barbershop_id", barbershopId)
      .eq("active", true),
    supabase
      .from("barbershop_closures")
      .select("closure_date, start_time, end_time, reason")
      .eq("barbershop_id", barbershopId)
      .eq("closure_date", date),
  ]);

  if (appointmentsError || schedulesError || closuresError) {
    return {
      error: "No se pudo comprobar la disponibilidad. Inténtalo de nuevo.",
    };
  }

  const schedules = (schedulesData ?? []) as ScheduleWindow[];
  const closures = (closuresData ?? []) as ClosureWindow[];
  const appointments = (appointmentsData ?? []) as AppointmentWindow[];

  if (barberId) {
    const isAvailable = isSlotAvailableForBooking({
      activeBarberIds,
      selectedBarberId: barberId,
      date,
      time,
      durationMinutes,
      schedules,
      closures,
      appointments,
    });

    if (!isAvailable) {
      return {
        error: "Esta hora ya no está disponible. Elige otra.",
      };
    }
  } else {
    const availableBarber = activeBarbers.find((barber) =>
      isSlotAvailableForBooking({
        activeBarberIds,
        selectedBarberId: barber.id,
        date,
        time,
        durationMinutes,
        schedules,
        closures,
        appointments,
      })
    );

    if (!availableBarber) {
      return {
        error: "Esta hora ya no está disponible. Elige otra.",
      };
    }

    barberId = availableBarber.id;
  }

  const { data: appointmentId, error: bookingError } = await supabase.rpc("create_booking_safe", {
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

  if (appointmentId) {
    await createAutomationEvent({
      supabase,
      barbershopId,
      eventType: "appointment_created",
      idempotencyKey: `appointment_created:${appointmentId}`,
      payload: buildAppointmentCreatedPayload({
        appointmentId,
        barbershopId,
        barbershopSlug: barbershop.slug,
        serviceId,
        barberId,
        clientName: name,
        clientPhone: phone,
        appointmentDate: date,
        startTime: time,
      }),
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/clientes");
  revalidatePath(`/r/${barbershop.slug}`);

  return {
    error: null,
  };
}
