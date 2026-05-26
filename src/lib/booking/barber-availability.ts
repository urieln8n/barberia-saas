import { BLOCKING_STATUSES } from "@/src/lib/appointments/check-availability";
import {
  DEFAULT_BOOKING_SLOT_INTERVAL_MINUTES,
  DEFAULT_OPERATIONAL_END_TIME,
  DEFAULT_OPERATIONAL_START_TIME,
  addMinutesToTime,
  normalizeTime,
  timesOverlap,
} from "@/src/lib/availability/operational-hours";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";

const ACTIVE_STATUSES = BLOCKING_STATUSES;

export type BarberAvailabilityBarber = {
  id: string;
  name: string;
};

export type BarberAvailabilityAppointment = {
  barber_id: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
};

export type BarberAvailabilityItem = {
  barberId: string;
  barberName: string;
  appointmentsToday: number;
  freeSlots: string[];
  nextAvailableSlot: string | null;
  totalSlots: number;
  occupiedSlots: number;
  occupancyPercent: number;
  workingWindowLabel: string;
  usesFallbackSchedule: boolean;
  status: "full" | "almost_full" | "available" | "needs_bookings";
  suggestedMessage: string;
};

function isPastSlot(time: string, todayIso: string) {
  const now = new Date();
  const currentIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (todayIso !== currentIso) return false;

  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return time <= currentTime;
}

function getStatus(
  appointmentsToday: number,
  freeSlots: number,
  totalSlots: number
): BarberAvailabilityItem["status"] {
  if (freeSlots === 0) return "full";
  if (freeSlots <= 2) return "almost_full";
  if (appointmentsToday <= 1 || freeSlots / Math.max(totalSlots, 1) >= 0.55) {
    return "needs_bookings";
  }
  return "available";
}

function buildSuggestedMessage(barberName: string, freeSlots: string[]) {
  const visibleSlots = freeSlots.slice(0, 3);

  if (visibleSlots.length === 0) {
    return `Hoy la agenda de ${barberName} esta completa. Escribenos para reservar otro dia.`;
  }

  return `Hoy tenemos huecos disponibles con ${barberName} a las ${visibleSlots.join(", ")}. Reserva tu corte ahora.`;
}

export function buildTodayBarberAvailability({
  barbers,
  appointments,
  todayIso,
  startHour = Number(DEFAULT_OPERATIONAL_START_TIME.slice(0, 2)),
  endHour = Number(DEFAULT_OPERATIONAL_END_TIME.slice(0, 2)),
  intervalMinutes = DEFAULT_BOOKING_SLOT_INTERVAL_MINUTES,
}: {
  barbers: BarberAvailabilityBarber[];
  appointments: BarberAvailabilityAppointment[];
  todayIso: string;
  startHour?: number;
  endHour?: number;
  intervalMinutes?: number;
}): BarberAvailabilityItem[] {
  // Fallback operativo hasta que exista una tabla formal de horarios por barbero.
  // La agenda publica ya usa start/end por cita; aqui solo se define la ventana de analitica.
  const slots = generateTimeSlots(startHour, endHour, intervalMinutes)
    .map((slot) => slot.time)
    .filter((time) => !isPastSlot(time, todayIso));

  return barbers
    .map((barber) => {
      const activeAppointments = appointments.filter(
        (appointment) =>
          appointment.barber_id === barber.id &&
          (ACTIVE_STATUSES as readonly string[]).includes(appointment.status ?? "")
      );

      const freeSlots = slots.filter((slot) => {
        const slotEnd = addMinutesToTime(slot, intervalMinutes);

        return !activeAppointments.some((appointment) => {
          const start = normalizeTime(appointment.start_time);
          if (!start) return false;

          const end = normalizeTime(appointment.end_time) || addMinutesToTime(start, intervalMinutes);

          return timesOverlap(slot, slotEnd, start, end);
        });
      });

      const status = getStatus(activeAppointments.length, freeSlots.length, slots.length);
      const occupiedSlots = Math.max(slots.length - freeSlots.length, 0);
      const occupancyPercent =
        slots.length > 0 ? Math.round((occupiedSlots / slots.length) * 100) : 0;

      return {
        barberId: barber.id,
        barberName: barber.name,
        appointmentsToday: activeAppointments.length,
        freeSlots,
        nextAvailableSlot: freeSlots[0] ?? null,
        totalSlots: slots.length,
        occupiedSlots,
        occupancyPercent,
        workingWindowLabel: `${String(startHour).padStart(2, "0")}:00-${String(endHour).padStart(2, "0")}:00`,
        usesFallbackSchedule: true,
        status,
        suggestedMessage: buildSuggestedMessage(barber.name, freeSlots),
      };
    })
    .sort((a, b) => {
      if (a.status === "needs_bookings" && b.status !== "needs_bookings") return -1;
      if (b.status === "needs_bookings" && a.status !== "needs_bookings") return 1;
      return b.freeSlots.length - a.freeSlots.length;
    });
}
