"use client";

import { Clock, Euro, Scissors, User } from "lucide-react";
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

  return (
    <button
      type="button"
      onClick={() => onClick(appointment)}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-xl border p-3 pl-[13px] text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.30)] ${color.card}`}
    >
      {/* Left status strip */}
      <span
        className={`absolute inset-y-[6px] left-[3px] w-[3px] rounded-full ${color.dot}`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-black leading-tight text-slate-900">
            {appointment.client?.name ?? "Cliente sin nombre"}
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
            {appointment.service?.name ?? "Servicio no definido"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black ${color.badge}`}
        >
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-500">
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {formatTime(appointment.start_time)} · {duration} min
        </span>
        <span className="flex items-center gap-1 truncate">
          <User size={10} />
          {appointment.barber?.name ?? "Sin barbero"}
        </span>
        {!compact && price ? (
          <span className="flex items-center gap-1 text-[#C9922A]">
            <Euro size={10} />
            {price}€
          </span>
        ) : null}
        {!compact && appointment.source && appointment.source !== "dashboard" ? (
          <span className="flex items-center gap-1 truncate">
            <Scissors size={10} />
            {appointment.source}
          </span>
        ) : null}
      </div>
    </button>
  );
}
