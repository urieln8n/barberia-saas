import { generateTimeSlots, overlaps } from "@/src/lib/booking/time-slots";

const ACTIVE_STATUSES = ["pending", "scheduled", "confirmed"];

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
  status: "full" | "almost_full" | "available" | "needs_bookings";
  suggestedMessage: string;
};

function normalizeTime(time?: string | null) {
  return time ? time.slice(0, 5) : "";
}

function addMinutesToTime(time: string, minutesToAdd: number) {
  const [hoursRaw, minutesRaw] = time.split(":");
  const date = new Date();
  date.setHours(Number(hoursRaw), Number(minutesRaw), 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);

  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

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
  startHour = 9,
  endHour = 20,
  intervalMinutes = 30,
}: {
  barbers: BarberAvailabilityBarber[];
  appointments: BarberAvailabilityAppointment[];
  todayIso: string;
  startHour?: number;
  endHour?: number;
  intervalMinutes?: number;
}): BarberAvailabilityItem[] {
  const slots = generateTimeSlots(startHour, endHour, intervalMinutes)
    .map((slot) => slot.time)
    .filter((time) => !isPastSlot(time, todayIso));

  return barbers
    .map((barber) => {
      const activeAppointments = appointments.filter(
        (appointment) =>
          appointment.barber_id === barber.id &&
          ACTIVE_STATUSES.includes(appointment.status ?? "")
      );

      const freeSlots = slots.filter((slot) => {
        const slotEnd = addMinutesToTime(slot, intervalMinutes);

        return !activeAppointments.some((appointment) => {
          const start = normalizeTime(appointment.start_time);
          if (!start) return false;

          const end = normalizeTime(appointment.end_time) || addMinutesToTime(start, intervalMinutes);

          return overlaps(slot, slotEnd, start, end);
        });
      });

      const status = getStatus(activeAppointments.length, freeSlots.length, slots.length);

      return {
        barberId: barber.id,
        barberName: barber.name,
        appointmentsToday: activeAppointments.length,
        freeSlots,
        nextAvailableSlot: freeSlots[0] ?? null,
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
