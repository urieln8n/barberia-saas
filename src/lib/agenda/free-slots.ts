import { generateTimeSlots, overlaps } from "@/src/lib/booking/time-slots";
import { addMinutesToTime, formatTime, timeToMinutes } from "./agenda-utils";
import type { AgendaAppointment, AgendaBarber, AgendaDay, AgendaSchedule, FreeSlot } from "./types";

const DEFAULT_START_HOUR = 9;
const DEFAULT_END_HOUR = 18;
const DEFAULT_DURATION = 45;

function getDaySchedule(dayISO: string, barber: AgendaBarber, schedules: AgendaSchedule[]) {
  const weekday = new Date(`${dayISO}T00:00:00`).getDay();
  const schedule = schedules.find((item) => item.barber_id === barber.id && item.weekday === weekday && item.active);

  return {
    start: formatTime(schedule?.start_time ?? `${String(DEFAULT_START_HOUR).padStart(2, "0")}:00`),
    end: formatTime(schedule?.end_time ?? `${String(DEFAULT_END_HOUR).padStart(2, "0")}:00`),
  };
}

export function detectFreeSlots({
  days,
  appointments,
  barbers,
  schedules,
  durationMinutes = DEFAULT_DURATION,
  maxPerDay = 3,
}: {
  days: AgendaDay[];
  appointments: AgendaAppointment[];
  barbers: AgendaBarber[];
  schedules: AgendaSchedule[];
  durationMinutes?: number;
  maxPerDay?: number;
}): FreeSlot[] {
  if (barbers.length === 0) return [];

  const freeSlots: FreeSlot[] = [];

  for (const day of days) {
    let dayCount = 0;

    for (const barber of barbers) {
      if (dayCount >= maxPerDay) break;

      const schedule = getDaySchedule(day.iso, barber, schedules);
      const startHour = Math.floor(timeToMinutes(schedule.start) / 60);
      const endHour = Math.ceil(timeToMinutes(schedule.end) / 60);
      const slots = generateTimeSlots(startHour, endHour, durationMinutes);
      const barberAppointments = appointments.filter((appointment) =>
        appointment.appointment_date === day.iso &&
        appointment.barber?.id === barber.id &&
        !["cancelled", "no_show"].includes(appointment.status),
      );

      for (const slot of slots) {
        if (dayCount >= maxPerDay) break;

        const slotEnd = addMinutesToTime(slot.time, durationMinutes);
        const insideSchedule = timeToMinutes(slot.time) >= timeToMinutes(schedule.start) &&
          timeToMinutes(slotEnd) <= timeToMinutes(schedule.end);

        if (!insideSchedule) continue;

        const hasConflict = barberAppointments.some((appointment) =>
          overlaps(
            `${slot.time}:00`.slice(0, 8),
            `${slotEnd}:00`.slice(0, 8),
            appointment.start_time,
            appointment.end_time ?? addMinutesToTime(appointment.start_time, appointment.service?.duration_minutes ?? durationMinutes),
          ),
        );

        if (!hasConflict) {
          freeSlots.push({
            id: `${day.iso}-${barber.id}-${slot.time}`,
            date: day.iso,
            start_time: slot.time,
            end_time: slotEnd,
            barber,
            reason: "Disponible",
          });
          dayCount += 1;
        }
      }
    }
  }

  return freeSlots;
}
