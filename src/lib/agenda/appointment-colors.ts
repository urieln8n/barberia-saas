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
    card: "border-emerald-200 bg-emerald-50 text-slate-900 hover:bg-emerald-100",
    badge: "border-emerald-300 bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  scheduled: {
    label: "Programada",
    card: "border-amber-200 bg-amber-50 text-slate-900 hover:bg-amber-100",
    badge: "border-amber-300 bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  pending: {
    label: "Pendiente",
    card: "border-amber-200 bg-amber-50 text-slate-900 hover:bg-amber-100",
    badge: "border-amber-300 bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  completed: {
    label: "Completada",
    card: "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100",
    badge: "border-slate-300 bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
  },
  cancelled: {
    label: "Cancelada",
    card: "border-red-200 bg-red-50 text-slate-500 hover:bg-red-100 opacity-60",
    badge: "border-red-200 bg-red-100 text-red-600",
    dot: "bg-red-400",
  },
  no_show: {
    label: "No se presentó",
    card: "border-red-200 bg-red-50 text-slate-900 hover:bg-red-100",
    badge: "border-red-200 bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
  rescheduled: {
    label: "Reprogramada",
    card: "border-violet-200 bg-violet-50 text-slate-900 hover:bg-violet-100",
    badge: "border-violet-200 bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
  },
  blocked: {
    label: "Bloqueado",
    card: "border-violet-200 bg-violet-50 text-slate-900 hover:bg-violet-100",
    badge: "border-violet-200 bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
  },
  new_client: {
    label: "Nuevo cliente",
    card: "border-blue-200 bg-blue-50 text-slate-900 hover:bg-blue-100",
    badge: "border-blue-200 bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
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
