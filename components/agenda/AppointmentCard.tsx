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

  return (
    <button
      type="button"
      onClick={() => onClick(appointment)}
      className={`relative w-full overflow-hidden rounded-xl border p-3 pl-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${color.card}`}
    >
      {/* Status strip — left edge color indicator */}
      <span className={`absolute inset-y-0 left-0 w-[3px] ${color.dot}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-black leading-tight">
            {appointment.client?.name ?? "Cliente sin nombre"}
          </p>
          <p className="mt-1 truncate text-xs font-bold opacity-80">
            {appointment.service?.name ?? "Servicio no definido"}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black ${color.badge}`}>
          {getStatusLabel(appointment.status)}
        </span>
      </div>

      <div className={`mt-2 grid gap-1 text-[11px] font-bold opacity-80 ${compact ? "" : "sm:grid-cols-2"}`}>
        <span className="flex items-center gap-1">
          <Clock size={11} /> {formatTime(appointment.start_time)} · {duration} min
        </span>
        <span className="flex items-center gap-1 truncate">
          <User size={11} /> {appointment.barber?.name ?? "Sin barbero"}
        </span>
        {!compact && appointment.service?.price ? (
          <span className="flex items-center gap-1">
            <Euro size={11} /> {appointment.service.price} estimado
          </span>
        ) : null}
        {!compact ? (
          <span className="flex items-center gap-1 truncate">
            <Scissors size={11} /> {appointment.source ?? "dashboard"}
          </span>
        ) : null}
      </div>
    </button>
  );
}
