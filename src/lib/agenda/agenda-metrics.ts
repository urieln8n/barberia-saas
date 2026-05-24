import { getTodayISO, isActiveAppointment } from "./agenda-utils";
import type { AgendaAppointment, AgendaMetrics, AgendaRecommendation, FreeSlot } from "./types";

export function calculateAgendaMetrics(
  appointments: AgendaAppointment[],
  freeSlots: FreeSlot[],
): AgendaMetrics {
  const today = getTodayISO();
  const todayAppointments = appointments.filter((appointment) => appointment.appointment_date === today);
  const activeAppointments = appointments.filter(isActiveAppointment);

  return {
    todayAppointments: todayAppointments.length,
    weekAppointments: activeAppointments.length,
    estimatedRevenue: activeAppointments.reduce((sum, appointment) => {
      if (["cancelled", "no_show"].includes(appointment.status)) return sum;
      return sum + Number(appointment.service?.price ?? 0);
    }, 0),
    freeSlots: freeSlots.length,
    pendingAppointments: appointments.filter((appointment) =>
      ["pending", "scheduled"].includes(appointment.status),
    ).length,
    newClients: appointments.filter((appointment) => (appointment.client?.visit_count ?? 0) <= 1).length,
    completedAppointments: appointments.filter((appointment) => appointment.status === "completed").length,
    cancelledAppointments: appointments.filter((appointment) =>
      ["cancelled", "no_show"].includes(appointment.status),
    ).length,
  };
}

export function buildAgendaRecommendation(
  metrics: AgendaMetrics,
  appointments: AgendaAppointment[],
  freeSlots: FreeSlot[],
): AgendaRecommendation {
  if (metrics.pendingAppointments > 0) {
    return {
      title: "Hay citas pendientes por confirmar",
      description: `Tienes ${metrics.pendingAppointments} citas pendientes. Prioriza confirmarlas para reducir huecos de ultima hora.`,
      cta: "Revisar pendientes",
      href: "/dashboard/agenda",
      tone: "gold",
    };
  }

  if (freeSlots.length >= 3) {
    return {
      title: `Tienes ${freeSlots.length} huecos libres esta semana`,
      description: "Prepara una campana rapida desde Marketing Studio para llenar horas con baja ocupacion.",
      cta: "Preparar campana",
      href: "/dashboard/marketing",
      tone: "green",
    };
  }

  const today = getTodayISO();
  const todayAppointments = appointments.filter((appointment) => appointment.appointment_date === today);
  if (todayAppointments.length === 0) {
    return {
      title: "Hoy esta muy tranquilo",
      description: "Activa una promocion ligera o comparte tu link de reservas para mover la agenda de hoy.",
      cta: "Ver QR publico",
      href: "/dashboard/qr",
      tone: "blue",
    };
  }

  return {
    title: "Agenda bajo control",
    description: "La semana tiene citas activas y pocos huecos criticos. Revisa servicios top para detectar oportunidades de upsell.",
    cta: "Ver clientes",
    href: "/dashboard/clientes",
    tone: "gold",
  };
}
