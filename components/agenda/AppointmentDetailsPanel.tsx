"use client";

import Link from "next/link";
import { CalendarClock, CreditCard, MessageCircle, RotateCw, Star, X } from "lucide-react";
import { formatTime, getAppointmentDuration, getPrimaryClientInsight } from "@/src/lib/agenda/agenda-utils";
import { getStatusLabel } from "@/src/lib/agenda/appointment-colors";
import type { AgendaAppointment } from "@/src/lib/agenda/types";

type Props = {
  appointment: AgendaAppointment | null;
  updating: string | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
};

const quickActions = [
  { label: "Reagendar", icon: RotateCw, disabled: true },
  { label: "Cobrar en caja", icon: CreditCard, href: "/dashboard/caja" },
  { label: "WhatsApp", icon: MessageCircle, disabled: true },
  { label: "Pedir resena", icon: Star, disabled: true },
];

export function AppointmentDetailsPanel({ appointment, updating, onClose, onStatusChange }: Props) {
  if (!appointment) return null;

  const duration = getAppointmentDuration(appointment);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm">
      <button type="button" aria-label="Cerrar panel" className="absolute inset-0" onClick={onClose} />
      <aside className="relative h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#8A641F]">Detalle de cita</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              {appointment.client?.name ?? "Cliente sin nombre"}
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {appointment.appointment_date} · {formatTime(appointment.start_time)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {[
            ["Telefono", appointment.client?.phone ?? "No disponible"],
            ["Servicio", appointment.service?.name ?? "Servicio no definido"],
            ["Barbero", appointment.barber?.name ?? "Sin barbero"],
            ["Duracion", `${duration} min`],
            ["Precio", appointment.service?.price ? `${appointment.service.price} EUR estimado` : "No disponible"],
            ["Estado", getStatusLabel(appointment.status)],
            ["Notas", appointment.notes || "Sin notas"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Insight del cliente</p>
          <p className="mt-2 font-black text-slate-950">{getPrimaryClientInsight(appointment)}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {appointment.service?.name
              ? `Posible upsell: revisa si encaja barba, tratamiento facial o producto despues de ${appointment.service.name}.`
              : "Completa servicio y cliente para generar mejores recomendaciones."}
          </p>
        </section>

        <div className="mt-5 grid gap-2">
          <button
            type="button"
            disabled={updating === appointment.id || appointment.status === "completed"}
            onClick={() => onStatusChange(appointment.id, "completed")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            <CalendarClock size={15} /> Marcar completada
          </button>
          <button
            type="button"
            disabled={updating === appointment.id || appointment.status === "cancelled"}
            onClick={() => onStatusChange(appointment.id, "cancelled")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-black text-rose-800 transition hover:bg-rose-100 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {quickActions.map(({ label, icon: Icon, href, disabled }) =>
            href && !disabled ? (
              <Link
                key={label}
                href={href}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Icon size={14} /> {label}
              </Link>
            ) : (
              <button
                key={label}
                type="button"
                disabled
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-400"
              >
                <Icon size={14} /> {label}
              </button>
            ),
          )}
        </div>
      </aside>
    </div>
  );
}
