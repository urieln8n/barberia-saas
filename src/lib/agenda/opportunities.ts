import { getTodayISO } from "./agenda-utils";
import type {
  AgendaAppointment,
  AgendaMetrics,
  AgendaOpportunity,
  BarberWorkload,
  FreeSlot,
} from "./types";

let _idCounter = 0;
function uid(type: AgendaOpportunity["type"]) {
  return `opp-${type}-${++_idCounter}`;
}

export function detectOpportunities(
  metrics: AgendaMetrics,
  appointments: AgendaAppointment[],
  freeSlots: FreeSlot[],
  barberWorkloads: BarberWorkload[],
): AgendaOpportunity[] {
  _idCounter = 0;
  const opportunities: AgendaOpportunity[] = [];
  const today = getTodayISO();

  // 1. Citas pendientes por confirmar
  if (metrics.pendingAppointments > 0) {
    opportunities.push({
      id: uid("pending"),
      type: "pending",
      title: `${metrics.pendingAppointments} cita${metrics.pendingAppointments > 1 ? "s" : ""} por confirmar`,
      description:
        "Confirmarlas reduce el riesgo de huecos de última hora y mejora la puntualidad del cliente.",
      impact: "Reduce no-shows hasta un 30%",
      cta: "Ver pendientes",
      href: "/dashboard/agenda?view=day",
      tone: "gold",
    });
  }

  // 2. Muchos huecos libres esta semana
  if (freeSlots.length >= 4) {
    opportunities.push({
      id: uid("free_slots"),
      type: "free_slots",
      title: `${freeSlots.length} huecos libres esta semana`,
      description:
        "Prepara una campaña rápida de WhatsApp o Instagram para llenar esas horas vacías.",
      impact: `Potencial ~€${freeSlots.length * 35} adicionales`,
      cta: "Preparar campaña",
      href: "/dashboard/marketing",
      tone: "green",
    });
  }

  // 3. Clientes nuevos sin seguimiento
  if (metrics.newClients >= 2) {
    opportunities.push({
      id: uid("new_client"),
      type: "new_client",
      title: `${metrics.newClients} clientes nuevos esta semana`,
      description:
        "Los clientes que regresan en los primeros 30 días tienen 3x más probabilidad de volverse regulares.",
      impact: "Aumenta retención de nuevos clientes",
      cta: "Ver clientes",
      href: "/dashboard/clientes",
      tone: "blue",
    });
  }

  // 4. Clientes completados que podrían dejar reseña
  const completed = appointments.filter(
    (a) => a.status === "completed" && a.appointment_date === today,
  );
  if (completed.length >= 2) {
    opportunities.push({
      id: uid("review"),
      type: "review",
      title: `${completed.length} citas completadas hoy — pide reseña`,
      description:
        "Las reseñas en Google aumentan la visibilidad y generan reservas orgánicas nuevas.",
      impact: "+4.5★ atrae 20% más clientes nuevos",
      cta: "Ver Agentes IA",
      href: "/dashboard/agentes",
      tone: "gold",
    });
  }

  // 5. Barbero con baja ocupación
  const lowBarbers = barberWorkloads.filter((b) => b.isLowOccupancy);
  for (const bw of lowBarbers.slice(0, 2)) {
    opportunities.push({
      id: uid("low_barber"),
      type: "low_barber",
      title: `${bw.barber.name} tiene baja ocupación (${bw.occupancyPct}%)`,
      description:
        "Considera promocionar sus huecos específicamente o asignarle más servicios populares.",
      impact: `Libera ~${bw.freeSlots} huecos productivos`,
      cta: "Ver barbero",
      href: "/dashboard/agenda?view=barbers",
      tone: "red",
    });
  }

  // 6. Día de hoy con muy pocas citas
  const todayAppts = appointments.filter(
    (a) =>
      a.appointment_date === today &&
      !["cancelled", "no_show"].includes(a.status),
  );
  if (todayAppts.length === 0) {
    opportunities.push({
      id: uid("low_day"),
      type: "low_day",
      title: "Hoy está completamente libre",
      description:
        "Activa una promoción flash o comparte tu QR en Instagram Stories para generar reservas hoy.",
      impact: "Actuar hoy puede llenar 2-3 huecos",
      cta: "Ver Lounge y QR",
      href: "/dashboard/lounge",
      tone: "red",
    });
  }

  // 7. Oportunidad Lounge (si hay pocas interacciones digitales)
  if (metrics.weekAppointments > 3) {
    opportunities.push({
      id: uid("lounge"),
      type: "lounge",
      title: "Activa el Lounge para tus clientes en sala de espera",
      description:
        "El módulo Lounge muestra tus servicios y promociones mientras el cliente espera, generando upsell pasivo.",
      impact: "Upsell +€15–30 por visita en promedio",
      cta: "Configurar Lounge",
      href: "/dashboard/lounge",
      tone: "blue",
    });
  }

  // 8. Oportunidad Marketing Studio
  if (freeSlots.length >= 2 || metrics.cancelledAppointments >= 1) {
    opportunities.push({
      id: uid("marketing"),
      type: "marketing",
      title: "Lanza una campaña para recuperar clientes",
      description:
        "Marketing Studio detecta clientes que no han vuelto en 30+ días y te ayuda a prepararles un mensaje.",
      impact: "Recuperar 1 cliente = ~€40 de ingreso",
      cta: "Abrir Marketing Studio",
      href: "/dashboard/marketing",
      tone: "green",
    });
  }

  return opportunities;
}
