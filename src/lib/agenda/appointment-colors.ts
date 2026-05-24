import type { AgendaStatus } from "./types";

type AppointmentColor = {
  label: string;
  card: string;
  badge: string;
  dot: string;
};

export const APPOINTMENT_COLORS: Record<string, AppointmentColor> = {
  confirmed: {
    label: "Confirmada",
    card: "border-emerald-200 bg-emerald-50 text-emerald-950",
    badge: "border-emerald-200 bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
  },
  scheduled: {
    label: "Pendiente",
    card: "border-amber-200 bg-amber-50 text-amber-950",
    badge: "border-amber-200 bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
  },
  pending: {
    label: "Pendiente",
    card: "border-amber-200 bg-amber-50 text-amber-950",
    badge: "border-amber-200 bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Completada",
    card: "border-slate-200 bg-slate-100 text-slate-800",
    badge: "border-slate-200 bg-slate-200 text-slate-700",
    dot: "bg-slate-500",
  },
  cancelled: {
    label: "Cancelada",
    card: "border-rose-200 bg-rose-50 text-rose-950 opacity-75",
    badge: "border-rose-200 bg-rose-100 text-rose-800",
    dot: "bg-rose-500",
  },
  no_show: {
    label: "No aparecio",
    card: "border-red-200 bg-red-50 text-red-950",
    badge: "border-red-200 bg-red-100 text-red-800",
    dot: "bg-red-500",
  },
  rescheduled: {
    label: "Reprogramada",
    card: "border-red-200 bg-red-50 text-red-950",
    badge: "border-red-200 bg-red-100 text-red-800",
    dot: "bg-red-500",
  },
  blocked: {
    label: "Bloque interno",
    card: "border-violet-200 bg-violet-50 text-violet-950",
    badge: "border-violet-200 bg-violet-100 text-violet-800",
    dot: "bg-violet-500",
  },
  new_client: {
    label: "Nuevo cliente",
    card: "border-sky-200 bg-sky-50 text-sky-950",
    badge: "border-sky-200 bg-sky-100 text-sky-800",
    dot: "bg-sky-500",
  },
};

export function getAppointmentColor(status: AgendaStatus, isNewClient = false) {
  if (isNewClient && !["completed", "cancelled", "no_show"].includes(status)) {
    return APPOINTMENT_COLORS.new_client;
  }

  return APPOINTMENT_COLORS[status] ?? APPOINTMENT_COLORS.scheduled;
}

export function getStatusLabel(status: AgendaStatus) {
  return (APPOINTMENT_COLORS[status] ?? APPOINTMENT_COLORS.scheduled).label;
}
