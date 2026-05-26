import { buildAvailabilityBlocks } from "@/src/lib/availability/operational-hours";
import type { AgendaAppointment, AgendaBarber, AgendaDay, AgendaSchedule, FreeSlot } from "./types";

const DEFAULT_DURATION = 30;

export function detectFreeSlots({
  days,
  appointments,
  barbers,
  schedules,
  durationMinutes = DEFAULT_DURATION,
}: {
  days: AgendaDay[];
  appointments: AgendaAppointment[];
  barbers: AgendaBarber[];
  schedules: AgendaSchedule[];
  durationMinutes?: number;
}): FreeSlot[] {
  if (barbers.length === 0) return [];

  const freeSlots: FreeSlot[] = [];
  const barbersById = new Map(barbers.map((barber) => [barber.id, barber]));

  for (const day of days) {
    const blocks = buildAvailabilityBlocks({
      dateISO: day.iso,
      barberIds: barbers.map((barber) => barber.id),
      schedules,
      appointments: appointments
        .filter((appointment) => appointment.appointment_date === day.iso)
        .map((appointment) => ({
          barber_id: appointment.barber?.id ?? null,
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          status: appointment.status,
        })),
      minDurationMinutes: durationMinutes,
    });

    for (const block of blocks) {
      const barber = barbersById.get(block.barberId) ?? null;
      if (barber) {
        freeSlots.push({
          id: `${day.iso}-${block.barberId}-${block.startTime}`,
          date: day.iso,
          start_time: block.startTime,
          end_time: block.endTime,
          barber,
          reason: "Disponible",
        });
      }
    }
  }

  return freeSlots.sort((a, b) => {
    const dateDiff = a.date.localeCompare(b.date);
    if (dateDiff !== 0) return dateDiff;

    const timeDiff = a.start_time.localeCompare(b.start_time);
    if (timeDiff !== 0) return timeDiff;

    return (a.barber?.name ?? "").localeCompare(b.barber?.name ?? "");
  });
}
