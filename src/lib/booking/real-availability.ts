import { generateTimeSlots } from "@/src/lib/booking/time-slots";

export const PUBLIC_BOOKING_FALLBACK_START_HOUR = 10;
export const PUBLIC_BOOKING_FALLBACK_END_HOUR = 20;
export const PUBLIC_BOOKING_SLOT_INTERVAL_MINUTES = 30;

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

function normalizeTime(time: string | null | undefined) {
  return time ? time.slice(0, 5) : "";
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  const [hoursRaw, minutesRaw] = time.split(":");
  const date = new Date();
  date.setHours(Number(hoursRaw), Number(minutesRaw), 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

function timesOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string
) {
  return newStart < existingEnd && newEnd > existingStart;
}

function getWeekday(date: string) {
  return new Date(`${date}T00:00:00`).getDay();
}

function getFallbackSlots(durationMinutes: number) {
  return generateTimeSlots(
    PUBLIC_BOOKING_FALLBACK_START_HOUR,
    PUBLIC_BOOKING_FALLBACK_END_HOUR,
    PUBLIC_BOOKING_SLOT_INTERVAL_MINUTES
  )
    .map((slot) => slot.time)
    .filter(
      (slot) =>
        addMinutesToTime(slot, durationMinutes) <=
        `${String(PUBLIC_BOOKING_FALLBACK_END_HOUR).padStart(2, "0")}:00`
    );
}

function minutesFromTime(time: string) {
  const [hoursRaw, minutesRaw] = normalizeTime(time).split(":");
  return Number(hoursRaw) * 60 + Number(minutesRaw);
}

function timeFromMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getScheduleSlots(schedule: ScheduleWindow, durationMinutes: number) {
  const slots: string[] = [];
  const start = minutesFromTime(schedule.start_time);
  const end = minutesFromTime(schedule.end_time);

  for (
    let current = start;
    current + durationMinutes <= end;
    current += PUBLIC_BOOKING_SLOT_INTERVAL_MINUTES
  ) {
    slots.push(timeFromMinutes(current));
  }

  return slots;
}

function isSlotInsideSchedule(
  slot: string,
  slotEnd: string,
  schedule: ScheduleWindow
) {
  return (
    schedule.active !== false &&
    slot >= normalizeTime(schedule.start_time) &&
    slotEnd <= normalizeTime(schedule.end_time)
  );
}

function getBlockingClosure(
  slot: string,
  slotEnd: string,
  closures: ClosureWindow[]
) {
  return closures.find((closure) => {
    if (!closure.start_time || !closure.end_time) return true;

    return timesOverlap(
      slot,
      slotEnd,
      normalizeTime(closure.start_time),
      normalizeTime(closure.end_time)
    );
  });
}

function getBusyBarberIds({
  slot,
  slotEnd,
  appointments,
  fallbackDurationMinutes,
}: {
  slot: string;
  slotEnd: string;
  appointments: AppointmentWindow[];
  fallbackDurationMinutes: number;
}) {
  const busy = new Set<string>();

  for (const appointment of appointments) {
    if (!appointment.barber_id || !appointment.start_time) continue;

    const start = normalizeTime(appointment.start_time);
    const end =
      normalizeTime(appointment.end_time) ||
      addMinutesToTime(start, fallbackDurationMinutes);

    if (timesOverlap(slot, slotEnd, start, end)) {
      busy.add(appointment.barber_id);
    }
  }

  return busy;
}

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
  const relevantBarberIds = selectedBarberId
    ? activeBarberIds.filter((id) => id === selectedBarberId)
    : activeBarberIds;
  const weekday = getWeekday(date);
  const activeSchedules = schedules.filter(
    (schedule) =>
      schedule.active !== false &&
      schedule.weekday === weekday &&
      relevantBarberIds.includes(schedule.barber_id)
  );
  const usesFallbackSchedule = schedules.length === 0;
  const allSlots = usesFallbackSchedule
    ? getFallbackSlots(durationMinutes)
    : Array.from(
        new Set(
          activeSchedules.flatMap((schedule) =>
            getScheduleSlots(schedule, durationMinutes)
              .filter((slot) =>
                isSlotInsideSchedule(
                  slot,
                  addMinutesToTime(slot, durationMinutes),
                  schedule
                )
              )
          )
        )
      ).sort();

  const availableSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutesToTime(slot, durationMinutes);
    if (getBlockingClosure(slot, slotEnd, closures)) return false;

    const busyBarberIds = getBusyBarberIds({
      slot,
      slotEnd,
      appointments,
      fallbackDurationMinutes: durationMinutes,
    });

    if (usesFallbackSchedule) {
      return relevantBarberIds.some((barberId) => !busyBarberIds.has(barberId));
    }

    return activeSchedules.some(
      (schedule) =>
        isSlotInsideSchedule(slot, slotEnd, schedule) &&
        !busyBarberIds.has(schedule.barber_id)
    );
  });

  const unavailableSlots = allSlots.filter(
    (slot) => !availableSlots.includes(slot)
  );
  const fullDayClosure = closures.find(
    (closure) => !closure.start_time && !closure.end_time
  );

  return {
    availableSlots,
    unavailableSlots,
    allSlots,
    closedReason: fullDayClosure?.reason || (fullDayClosure ? "Cerrado" : null),
    usesFallbackSchedule,
  };
}

export function isSlotAvailableForBooking(args: Parameters<typeof buildRealAvailability>[0] & {
  time: string;
}) {
  const availability = buildRealAvailability(args);
  return availability.availableSlots.includes(normalizeTime(args.time));
}
