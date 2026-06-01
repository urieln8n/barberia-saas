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
    card: "border-[#22C55E]/25 bg-[#22C55E]/[0.08] text-white hover:bg-[#22C55E]/[0.12]",
    badge: "border-[#22C55E]/40 bg-[#22C55E]/[0.15] text-[#22C55E]",
    dot: "bg-[#22C55E]",
  },
  scheduled: {
    label: "Programada",
    card: "border-[#F59E0B]/25 bg-[#F59E0B]/[0.08] text-white hover:bg-[#F59E0B]/[0.12]",
    badge: "border-[#F59E0B]/40 bg-[#F59E0B]/[0.15] text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
  },
  pending: {
    label: "Pendiente",
    card: "border-[#F59E0B]/25 bg-[#F59E0B]/[0.08] text-white hover:bg-[#F59E0B]/[0.12]",
    badge: "border-[#F59E0B]/40 bg-[#F59E0B]/[0.15] text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
  },
  completed: {
    label: "Completada",
    card: "border-[#333] bg-[#161616] text-[#888] hover:bg-[#1a1a1a]",
    badge: "border-[#333] bg-[#1a1a1a] text-[#666]",
    dot: "bg-[#555]",
  },
  cancelled: {
    label: "Cancelada",
    card: "border-[#EF4444]/20 bg-[#EF4444]/[0.06] text-[#888] hover:bg-[#EF4444]/[0.10] opacity-60",
    badge: "border-[#EF4444]/30 bg-[#EF4444]/[0.10] text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
  no_show: {
    label: "No se presentó",
    card: "border-[#EF4444]/25 bg-[#EF4444]/[0.08] text-white hover:bg-[#EF4444]/[0.12]",
    badge: "border-[#EF4444]/40 bg-[#EF4444]/[0.15] text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
  rescheduled: {
    label: "Reprogramada",
    card: "border-[#8B5CF6]/25 bg-[#8B5CF6]/[0.08] text-white hover:bg-[#8B5CF6]/[0.12]",
    badge: "border-[#8B5CF6]/40 bg-[#8B5CF6]/[0.15] text-[#8B5CF6]",
    dot: "bg-[#8B5CF6]",
  },
  blocked: {
    label: "Bloqueado",
    card: "border-[#8B5CF6]/25 bg-[#8B5CF6]/[0.08] text-white hover:bg-[#8B5CF6]/[0.12]",
    badge: "border-[#8B5CF6]/40 bg-[#8B5CF6]/[0.15] text-[#8B5CF6]",
    dot: "bg-[#8B5CF6]",
  },
  new_client: {
    label: "Nuevo cliente",
    card: "border-[#3B82F6]/25 bg-[#3B82F6]/[0.08] text-white hover:bg-[#3B82F6]/[0.12]",
    badge: "border-[#3B82F6]/40 bg-[#3B82F6]/[0.15] text-[#3B82F6]",
    dot: "bg-[#3B82F6]",
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
