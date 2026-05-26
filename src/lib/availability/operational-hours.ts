import { BLOCKING_STATUSES } from "@/src/lib/appointments/check-availability";
import { BARBERIA_TIMEZONE, getTodayInMadrid } from "@/src/lib/date-time";

export { getTodayInMadrid };

export const DEFAULT_OPERATIONAL_START_TIME = "09:00";
export const DEFAULT_OPERATIONAL_END_TIME = "20:00";
export const DEFAULT_BOOKING_SLOT_INTERVAL_MINUTES = 30;
export const DEFAULT_FREE_BLOCK_INTERVAL_MINUTES = 15;

export type AvailabilitySchedule = {
  barber_id: string;
  weekday: number;
  start_time: string | null;
  end_time: string | null;
  active?: boolean | null;
};

export type AvailabilityAppointment = {
  barber_id: string | null;
  start_time: string | null;
  end_time: string | null;
  status?: string | null;
};

export type AvailabilityClosure = {
  closure_date?: string | null;
  start_time: string | null;
  end_time: string | null;
  reason?: string | null;
};

export type AvailabilityBlock = {
  barberId: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  usesFallbackSchedule: boolean;
};

export type ScheduleWindow = {
  barberId: string;
  startTime: string;
  endTime: string;
  usesFallbackSchedule: boolean;
};

export function normalizeTime(time?: string | null) {
  return time ? time.slice(0, 5) : "";
}

export function timeToMinutes(time: string) {
  const [hoursRaw, minutesRaw] = normalizeTime(time).split(":");
  return Number(hoursRaw) * 60 + Number(minutesRaw);
}

export function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number) {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

export function timesOverlap(
  newStart: string,
  newEnd: string,
  existingStart: string,
  existingEnd: string,
) {
  return newStart < existingEnd && newEnd > existingStart;
}

export function roundUpToInterval(minutes: number, interval: number) {
  return Math.ceil(minutes / interval) * interval;
}

export function getWeekday(dateISO: string) {
  return new Date(`${dateISO}T00:00:00`).getDay();
}

export function getMadridNowMinutes() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BARBERIA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return hour * 60 + minute;
}

export function getScheduleWindowForBarber({
  dateISO,
  barberId,
  schedules,
  fallbackStartTime = DEFAULT_OPERATIONAL_START_TIME,
  fallbackEndTime = DEFAULT_OPERATIONAL_END_TIME,
}: {
  dateISO: string;
  barberId: string;
  schedules: AvailabilitySchedule[];
  fallbackStartTime?: string;
  fallbackEndTime?: string;
}): ScheduleWindow {
  const weekday = getWeekday(dateISO);
  const schedule = schedules.find(
    (item) =>
      item.barber_id === barberId &&
      item.weekday === weekday &&
      item.active !== false,
  );

  return {
    barberId,
    startTime: normalizeTime(schedule?.start_time) || fallbackStartTime,
    endTime: normalizeTime(schedule?.end_time) || fallbackEndTime,
    usesFallbackSchedule: !schedule,
  };
}

function appointmentBlocksSlot(
  appointment: AvailabilityAppointment,
  blockingStatuses: readonly string[],
) {
  if (!appointment.start_time || !appointment.barber_id) return false;
  if (!("status" in appointment) || appointment.status == null) return true;
  return blockingStatuses.includes(appointment.status);
}

export function buildAvailabilityBlocks({
  dateISO,
  barberIds,
  schedules,
  appointments,
  minDurationMinutes,
  includePastSlots = false,
  intervalMinutes = DEFAULT_FREE_BLOCK_INTERVAL_MINUTES,
  blockingStatuses = BLOCKING_STATUSES,
}: {
  dateISO: string;
  barberIds: string[];
  schedules: AvailabilitySchedule[];
  appointments: AvailabilityAppointment[];
  minDurationMinutes: number;
  includePastSlots?: boolean;
  intervalMinutes?: number;
  blockingStatuses?: readonly string[];
}) {
  const today = getTodayInMadrid();
  const nowMinutes = getMadridNowMinutes();
  const blocks: AvailabilityBlock[] = [];

  if (!includePastSlots && dateISO < today) return blocks;

  for (const barberId of barberIds) {
    const schedule = getScheduleWindowForBarber({ dateISO, barberId, schedules });
    const scheduleStart = timeToMinutes(schedule.startTime);
    const scheduleEnd = timeToMinutes(schedule.endTime);
    const dayStart =
      !includePastSlots && dateISO === today
        ? Math.max(scheduleStart, roundUpToInterval(nowMinutes, intervalMinutes))
        : scheduleStart;

    if (scheduleEnd - dayStart < minDurationMinutes) continue;

    const blockingAppointments = appointments
      .filter(
        (appointment) =>
          appointment.barber_id === barberId &&
          appointmentBlocksSlot(appointment, blockingStatuses),
      )
      .map((appointment) => {
        const start = timeToMinutes(normalizeTime(appointment.start_time));
        const end = appointment.end_time
          ? timeToMinutes(normalizeTime(appointment.end_time))
          : start + minDurationMinutes;

        return {
          start: Math.max(scheduleStart, start),
          end: Math.min(scheduleEnd, end),
        };
      })
      .filter((appointment) => appointment.end > dayStart && appointment.start < scheduleEnd)
      .sort((a, b) => a.start - b.start);

    let cursor = dayStart;

    for (const appointment of blockingAppointments) {
      const gapStart = cursor;
      const gapEnd = Math.min(appointment.start, scheduleEnd);

      if (gapEnd - gapStart >= minDurationMinutes) {
        blocks.push({
          barberId,
          startTime: minutesToTime(gapStart),
          endTime: minutesToTime(gapEnd),
          durationMinutes: gapEnd - gapStart,
          usesFallbackSchedule: schedule.usesFallbackSchedule,
        });
      }

      cursor = Math.max(cursor, appointment.end);
    }

    if (scheduleEnd - cursor >= minDurationMinutes) {
      blocks.push({
        barberId,
        startTime: minutesToTime(cursor),
        endTime: minutesToTime(scheduleEnd),
        durationMinutes: scheduleEnd - cursor,
        usesFallbackSchedule: schedule.usesFallbackSchedule,
      });
    }
  }

  return blocks.sort((a, b) => {
    const timeDiff = a.startTime.localeCompare(b.startTime);
    if (timeDiff !== 0) return timeDiff;
    return a.barberId.localeCompare(b.barberId);
  });
}

export function buildBookableSlots({
  dateISO,
  activeBarberIds,
  selectedBarberId,
  durationMinutes,
  schedules,
  closures,
  appointments,
  intervalMinutes = DEFAULT_BOOKING_SLOT_INTERVAL_MINUTES,
}: {
  dateISO: string;
  activeBarberIds: string[];
  selectedBarberId: string | null;
  durationMinutes: number;
  schedules: AvailabilitySchedule[];
  closures: AvailabilityClosure[];
  appointments: AvailabilityAppointment[];
  intervalMinutes?: number;
}) {
  const relevantBarberIds = selectedBarberId
    ? activeBarberIds.filter((id) => id === selectedBarberId)
    : activeBarberIds;
  const fullDayClosure = closures.find(
    (closure) => !closure.start_time && !closure.end_time,
  );
  const usesFallbackSchedule = schedules.length === 0;
  const scheduleWindows = relevantBarberIds.map((barberId) =>
    getScheduleWindowForBarber({ dateISO, barberId, schedules }),
  );
  const allSlots = Array.from(
    new Set(
      scheduleWindows.flatMap((schedule) => {
        const slots: string[] = [];
        const start = timeToMinutes(schedule.startTime);
        const end = timeToMinutes(schedule.endTime);

        for (let cursor = start; cursor + durationMinutes <= end; cursor += intervalMinutes) {
          slots.push(minutesToTime(cursor));
        }

        return slots;
      }),
    ),
  ).sort();

  const availableSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutesToTime(slot, durationMinutes);
    const closure = closures.find((item) => {
      if (!item.start_time || !item.end_time) return true;
      return timesOverlap(
        slot,
        slotEnd,
        normalizeTime(item.start_time),
        normalizeTime(item.end_time),
      );
    });

    if (closure) return false;

    return scheduleWindows.some((schedule) => {
      if (slot < schedule.startTime || slotEnd > schedule.endTime) return false;

      return !appointments.some((appointment) => {
        if (appointment.barber_id !== schedule.barberId || !appointment.start_time) {
          return false;
        }

        const start = normalizeTime(appointment.start_time);
        const end = normalizeTime(appointment.end_time) || addMinutesToTime(start, durationMinutes);

        return timesOverlap(slot, slotEnd, start, end);
      });
    });
  });

  return {
    availableSlots,
    unavailableSlots: allSlots.filter((slot) => !availableSlots.includes(slot)),
    allSlots,
    closedReason: fullDayClosure?.reason || (fullDayClosure ? "Cerrado" : null),
    usesFallbackSchedule,
  };
}
