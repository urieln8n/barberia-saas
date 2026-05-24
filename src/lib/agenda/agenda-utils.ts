import type { AgendaAppointment, AgendaDay } from "./types";

export function toISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayISO() {
  return toISODate(new Date());
}

export function getWeekStart(dateISO: string) {
  const date = new Date(`${dateISO}T00:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return toISODate(date);
}

export function getWeekDays(dateISO: string): AgendaDay[] {
  const start = new Date(`${getWeekStart(dateISO)}T00:00:00`);
  const today = getTodayISO();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = toISODate(date);

    return {
      iso,
      label: date.toLocaleDateString("es-ES", { weekday: "long" }),
      shortLabel: date.toLocaleDateString("es-ES", { weekday: "short" }),
      dayNumber: String(date.getDate()),
      isToday: iso === today,
    };
  });
}

export function addMinutesToTime(time: string, minutesToAdd: number) {
  const [hoursRaw, minutesRaw] = time.split(":");
  const date = new Date();
  date.setHours(Number(hoursRaw), Number(minutesRaw), 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function timeToMinutes(time: string) {
  const [hoursRaw, minutesRaw] = time.split(":");
  return Number(hoursRaw) * 60 + Number(minutesRaw);
}

export function formatTime(time?: string | null) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

export function getAppointmentDuration(appointment: AgendaAppointment) {
  if (appointment.end_time) {
    return Math.max(15, timeToMinutes(appointment.end_time) - timeToMinutes(appointment.start_time));
  }

  return appointment.service?.duration_minutes ?? 30;
}

export function isActiveAppointment(appointment: AgendaAppointment) {
  return !["cancelled", "no_show"].includes(appointment.status);
}

export function getPrimaryClientInsight(appointment: AgendaAppointment) {
  const visits = appointment.client?.visit_count ?? 0;

  if (!appointment.client) return "Cliente sin ficha completa";
  if (visits <= 1) return "Cliente nuevo";
  if (visits >= 5) return "Cliente frecuente";
  if (appointment.status === "completed") return "Buen candidato para reseña";

  return "Cliente con historial activo";
}
