import {
  DEFAULT_BOOKING_SLOT_INTERVAL_MINUTES,
  DEFAULT_OPERATIONAL_END_TIME,
  DEFAULT_OPERATIONAL_START_TIME,
  buildBookableSlots,
  normalizeTime,
} from "@/src/lib/availability/operational-hours";

export const PUBLIC_BOOKING_FALLBACK_START_HOUR = Number(DEFAULT_OPERATIONAL_START_TIME.slice(0, 2));
export const PUBLIC_BOOKING_FALLBACK_END_HOUR = Number(DEFAULT_OPERATIONAL_END_TIME.slice(0, 2));
export const PUBLIC_BOOKING_SLOT_INTERVAL_MINUTES = DEFAULT_BOOKING_SLOT_INTERVAL_MINUTES;

export type ScheduleWindow = {
  barber_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  active?: boolean | null;
};

export type ClosureWindow = {
  closure_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
};

export type AppointmentWindow = {
  barber_id: string | null;
  start_time: string | null;
  end_time: string | null;
};

export type RealAvailabilityResult = {
  availableSlots: string[];
  unavailableSlots: string[];
  allSlots: string[];
  closedReason: string | null;
  usesFallbackSchedule: boolean;
};

export function buildRealAvailability({
  activeBarberIds,
  selectedBarberId,
  date,
  durationMinutes,
  schedules,
  closures,
  appointments,
}: {
  activeBarberIds: string[];
  selectedBarberId: string | null;
  date: string;
  durationMinutes: number;
  schedules: ScheduleWindow[];
  closures: ClosureWindow[];
  appointments: AppointmentWindow[];
}): RealAvailabilityResult {
  return buildBookableSlots({
    activeBarberIds,
    selectedBarberId,
    dateISO: date,
    durationMinutes,
    schedules,
    closures,
    appointments,
    intervalMinutes: PUBLIC_BOOKING_SLOT_INTERVAL_MINUTES,
  });
}

export function isSlotAvailableForBooking(args: Parameters<typeof buildRealAvailability>[0] & {
  time: string;
}) {
  const availability = buildRealAvailability(args);
  return availability.availableSlots.includes(normalizeTime(args.time));
}
