"use client";

import { getAppointmentColor, getStatusLabel } from "@/src/lib/agenda/appointment-colors";
import { formatTime, getAppointmentDuration } from "@/src/lib/agenda/agenda-utils";
import type { AgendaAppointment } from "@/src/lib/agenda/types";

type Props = {
  appointment: AgendaAppointment;
  compact?: boolean;
  onClick: (appointment: AgendaAppointment) => void;
};

export function AppointmentCard({ appointment, compact = false, onClick }: Props) {
  const isNewClient = (appointment.client?.visit_count ?? 0) <= 1;
  const color = getAppointmentColor(appointment.status, isNewClient);
  const duration = getAppointmentDuration(appointment);
  const price = appointment.service?.price;

  // Citas terminales: opacidad reducida
  const isTerminal = ["cancelled", "no_show", "completed"].includes(appointment.status);

  return (
    <button
      type="button"
      onClick={() => onClick(appointment)}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-150 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] ${
        isTerminal ? "opacity-60" : ""
      }`}
    >
      {/* Left color strip — 4px, color por estado */}
      <span
        className={`absolute inset-y-0 left-0 w-[4px] rounded-l-xl ${color.dot}`}
        aria-hidden="true"
      />

      <div className="pl-4 pr-3 py-2.5">
        {/* Fila 1: nombre + badge de estado */}
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[13px] font-black leading-tight text-slate-900">
            {appointment.client?.name ?? "Cliente sin nombre"}
          </p>
          <span
            className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-black ${color.badge}`}
          >
            {getStatusLabel(appointment.status)}
          </span>
        </div>

        {/* Fila 2: servicio + precio */}
        <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500">
          {appointment.service?.name ?? "Servicio"}
          {price && !compact ? (
            <span className="ml-1 font-bold text-[#C9922A]">· {price}€</span>
          ) : null}
        </p>

        {/* Fila 3: hora + duración + barbero (solo si no es compact) */}
        {!compact && (
          <div className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
            <span>{formatTime(appointment.start_time)}</span>
            <span>·</span>
            <span>{duration} min</span>
            {appointment.barber?.name && (
              <>
                <span>·</span>
                <span className="truncate">{appointment.barber.name}</span>
              </>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
