import type { AgendaAppointment, FreeSlot } from "@/src/lib/agenda/types";
import {
  getMadridNow,
  getMadridTodayISO,
  getMinutesFromStartOfDay,
} from "@/src/lib/agenda/time-position";

export type NotificationType =
  | "upcoming_appointment"
  | "free_slot"
  | "pending_booking"
  | "cancellation"
  | "no_show"
  | "empty_day";

export type NotificationPriority = "high" | "medium" | "info";

export type AgendaNotification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  time?: string;
};

function apptMinutes(timeStr: string): number {
  return Number(timeStr.slice(0, 2)) * 60 + Number(timeStr.slice(3, 5));
}

export function getAgendaNotifications({
  appointments,
  freeSlots,
  selectedDate,
}: {
  appointments: AgendaAppointment[];
  freeSlots: FreeSlot[];
  selectedDate: string;
}): AgendaNotification[] {
  const notifications: AgendaNotification[] = [];
  const now = getMadridNow();
  const today = getMadridTodayISO();
  const nowMin = getMinutesFromStartOfDay(now);
  const isViewingToday = selectedDate === today;

  // 1. Upcoming appointments within 30 min — high priority
  if (isViewingToday) {
    const upcoming = appointments
      .filter((a) => {
        if (a.appointment_date !== today) return false;
        if (!["scheduled", "confirmed", "pending"].includes(a.status)) return false;
        const m = apptMinutes(a.start_time);
        return m > nowMin && m <= nowMin + 30;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

    for (const appt of upcoming) {
      const diffMin = apptMinutes(appt.start_time) - nowMin;
      const barberPart = appt.barber ? ` · ${appt.barber.name}` : "";
      notifications.push({
        id: `upcoming-${appt.id}`,
        type: "upcoming_appointment",
        priority: "high",
        title: `Cita en ${diffMin} min`,
        description: `${appt.client?.name ?? "Cliente"} · ${appt.service?.name ?? "Servicio"} · ${appt.start_time.slice(0, 5)}${barberPart}`,
        actionLabel: "Ver en agenda",
        actionHref: `/dashboard/agenda?view=day&date=${today}`,
        time: appt.start_time.slice(0, 5),
      });
    }
  }

  // 2. Free slots within next 2 hours — medium priority
  if (isViewingToday) {
    const soonSlots = freeSlots
      .filter((s) => {
        if (s.date !== today) return false;
        const m = apptMinutes(s.start_time);
        return m >= nowMin && m <= nowMin + 120;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
      .slice(0, 2);

    for (const slot of soonSlots) {
      const dur =
        apptMinutes(slot.end_time) - apptMinutes(slot.start_time);
      const barberPart = slot.barber ? ` · ${slot.barber.name}` : "";
      notifications.push({
        id: `slot-${slot.id}`,
        type: "free_slot",
        priority: "medium",
        title: `Hueco libre a las ${slot.start_time.slice(0, 5)}`,
        description: `${dur} min disponibles${barberPart}. ¿Quieres llenarlo?`,
        actionLabel: "Reservar ahora",
        actionHref: `/dashboard/agenda?view=day&date=${today}`,
        time: slot.start_time.slice(0, 5),
      });
    }
  }

  // 3. Pending bookings today — medium priority
  const pendingToday = appointments.filter(
    (a) => a.appointment_date === today && a.status === "pending",
  );
  if (pendingToday.length > 0) {
    const plural = pendingToday.length !== 1;
    notifications.push({
      id: "pending-today",
      type: "pending_booking",
      priority: "medium",
      title: `${pendingToday.length} reserva${plural ? "s" : ""} pendiente${plural ? "s" : ""}`,
      description: `${plural ? `${pendingToday.length} citas esperan` : "Una cita espera"} confirmación para hoy.`,
      actionLabel: "Confirmar",
      actionHref: `/dashboard/agenda?view=day&date=${today}`,
    });
  }

  // 4. No-shows today — medium priority
  const noShowsToday = appointments.filter(
    (a) => a.appointment_date === today && a.status === "no_show",
  );
  if (noShowsToday.length > 0) {
    const names = noShowsToday
      .map((a) => a.client?.name ?? "Cliente")
      .slice(0, 2)
      .join(", ");
    notifications.push({
      id: "no-shows-today",
      type: "no_show",
      priority: "medium",
      title: `${noShowsToday.length} no-show${noShowsToday.length !== 1 ? "s" : ""} hoy`,
      description: `${names}${noShowsToday.length > 2 ? " y más" : ""} no se presentó.`,
      actionLabel: "Ver agenda",
      actionHref: `/dashboard/agenda?view=day&date=${today}`,
    });
  }

  // 5. Cancellations today — medium priority
  const cancelledToday = appointments.filter(
    (a) => a.appointment_date === today && a.status === "cancelled",
  );
  if (cancelledToday.length > 0) {
    const plural = cancelledToday.length !== 1;
    notifications.push({
      id: "cancellations-today",
      type: "cancellation",
      priority: "medium",
      title: `${cancelledToday.length} cita${plural ? "s" : ""} cancelada${plural ? "s" : ""} hoy`,
      description: `Puedes intentar llenar ${plural ? "esos huecos" : "ese hueco"} con otra reserva.`,
      actionLabel: "Ver agenda",
      actionHref: `/dashboard/agenda?view=day&date=${today}`,
    });
  }

  // 6. Empty day during business hours — info
  if (isViewingToday) {
    const activeToday = appointments.filter(
      (a) =>
        a.appointment_date === today &&
        ["scheduled", "confirmed"].includes(a.status),
    );
    const h = now.getHours();
    if (activeToday.length === 0 && h >= 9 && h < 20) {
      notifications.push({
        id: "empty-day",
        type: "empty_day",
        priority: "info",
        title: "Sin citas activas hoy",
        description:
          "Puedes compartir tu link de reservas o crear una cita manual.",
        actionLabel: "Ver QR",
        actionHref: "/dashboard/qr",
      });
    }
  }

  return notifications;
}
