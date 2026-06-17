"use client";

import { getAppointmentColor, getStatusLabel } from "@/src/lib/agenda/appointment-colors";
import { formatTime, getAppointmentDuration } from "@/src/lib/agenda/agenda-utils";
import type { AgendaAppointment } from "@/src/lib/agenda/types";

type Props = {
  appointment: AgendaAppointment;
  compact?: boolean;
  onClick: (appointment: AgendaAppointment) => void;
};

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Color de fondo del avatar según estado
const AVATAR_BG: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100 text-amber-700",
  pending:   "bg-amber-100 text-amber-700",
  completed: "bg-slate-100 text-slate-500",
  cancelled: "bg-red-100 text-red-400",
  no_show:   "bg-red-100 text-red-500",
  rescheduled:"bg-violet-100 text-violet-600",
  new_client: "bg-[#D4AF37]/[0.12] text-[#D4AF37]",
};

export function AppointmentCard({ appointment, compact = false, onClick }: Props) {
  const isNewClient  = (appointment.client?.visit_count ?? 0) <= 1;
  const color        = getAppointmentColor(appointment.status, isNewClient);
  const duration     = getAppointmentDuration(appointment);
  const price        = appointment.service?.price;
  const isTerminal   = ["cancelled", "no_show", "completed"].includes(appointment.status);
  const avatarCls    = AVATAR_BG[isNewClient && !isTerminal ? "new_client" : appointment.status] ?? AVATAR_BG.scheduled;
  const initials     = getInitials(appointment.client?.name);

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => onClick(appointment)}
        className={`group relative w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-[0_1px_4px_rgba(0,0,0,0.09)] transition-all duration-150 hover:shadow-[0_4px_14px_rgba(0,0,0,0.13)] ${
          isTerminal ? "opacity-50" : ""
        }`}
      >
        <span className={`absolute inset-y-0 left-0 w-[3px] ${color.dot}`} aria-hidden="true" />
        <div className="flex min-w-0 items-center gap-2 px-2.5 py-1.5 pl-[14px]">
          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-black ${avatarCls}`}>
            {initials}
          </div>
          <p className="min-w-0 flex-1 truncate text-[11px] font-black text-slate-900">
            {appointment.client?.name ?? "Cliente"}
          </p>
          {price ? (
            <span className="shrink-0 text-[9px] font-black text-[#D4AF37]">{price}€</span>
          ) : null}
          <span className={`shrink-0 rounded-full border px-1 py-px text-[8px] font-black ${color.badge}`}>
            {getStatusLabel(appointment.status)}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick(appointment)}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-[0_2px_10px_rgba(0,0,0,0.09)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.14)] active:scale-[0.99] ${
        isTerminal ? "opacity-50" : ""
      }`}
    >
      {/* Franja izquierda — 4px, altura completa */}
      <span className={`absolute inset-y-0 left-0 w-[4px] ${color.dot}`} aria-hidden="true" />

      <div className="flex gap-3 py-3 pl-5 pr-3">
        {/* Avatar initials */}
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-black ${avatarCls}`}>
          {initials}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Fila 1: nombre + badge */}
          <div className="flex items-start justify-between gap-1.5">
            <p className="truncate text-[13px] font-black leading-tight text-slate-900">
              {appointment.client?.name ?? "Cliente sin nombre"}
            </p>
            <span className={`shrink-0 rounded-full border px-1.5 py-px text-[9px] font-black ${color.badge}`}>
              {getStatusLabel(appointment.status)}
            </span>
          </div>

          {/* Fila 2: servicio */}
          <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">
            {appointment.service?.name ?? "Servicio no definido"}
          </p>

          {/* Fila 3: hora · duración · barbero · precio */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-400">
            <span className="font-bold tabular-nums">{formatTime(appointment.start_time)}</span>
            <span>·</span>
            <span>{duration} min</span>
            {appointment.barber?.name && (
              <>
                <span>·</span>
                <span className="truncate font-semibold">{appointment.barber.name}</span>
              </>
            )}
            {price ? (
              <>
                <span>·</span>
                <span className="font-black text-[#D4AF37]">{price}€</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}
