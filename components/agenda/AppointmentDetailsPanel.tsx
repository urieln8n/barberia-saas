"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CalendarClock, CalendarPlus, CheckCircle, CreditCard, ExternalLink, Gift, Loader2, MessageCircle, RotateCw, Star, UserX, X } from "lucide-react";
import { formatTime, getAppointmentDuration, getPrimaryClientInsight } from "@/src/lib/agenda/agenda-utils";
import { getStatusLabel } from "@/src/lib/agenda/appointment-colors";
import { rescheduleAppointment } from "@/app/dashboard/agenda/actions";
import type { AgendaAppointment } from "@/src/lib/agenda/types";

type LoyaltyHint = {
  stamps: number;
  required: number;
  rewardDescription?: string | null;
};

type Props = {
  appointment: AgendaAppointment | null;
  updating: string | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  loyaltyHint?: LoyaltyHint | null;
};

export function AppointmentDetailsPanel({ appointment, updating, onClose, onStatusChange, loyaltyHint = null }: Props) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!appointment) return null;

  const duration = getAppointmentDuration(appointment);
  const phone = appointment.client?.phone;
  const waPhone = phone?.replace(/\D/g, "");
  const waLink = waPhone ? `https://wa.me/${waPhone}` : null;
  const isTerminated = ["completed", "cancelled", "no_show"].includes(appointment.status);

  function handleReschedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const date = data.get("date") as string;
    const time = data.get("time") as string;
    if (!date || !time) return;
    setRescheduleError("");
    startTransition(async () => {
      const result = await rescheduleAppointment(appointment!.id, date, time);
      if (result.error) {
        setRescheduleError(result.error);
      } else {
        setShowReschedule(false);
        onClose();
      }
    });
  }

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
          {/* Phone — clickable tel: link */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Teléfono</p>
            {phone ? (
              <a href={`tel:${phone}`} className="mt-1 block text-sm font-bold text-blue-600 underline underline-offset-2">
                {phone}
              </a>
            ) : (
              <p className="mt-1 text-sm font-bold text-slate-950">No disponible</p>
            )}
          </div>

          {[
            ["Servicio", appointment.service?.name ?? "Servicio no definido"],
            ["Barbero", appointment.barber?.name ?? "Sin barbero"],
            ["Duración", `${duration} min`],
            ["Precio", appointment.service?.price ? `${appointment.service.price} EUR estimado` : "No disponible"],
            ["Estado", getStatusLabel(appointment.status)],
            ...(appointment.client?.visit_count
              ? [["Visitas", `${appointment.client.visit_count} visita${appointment.client.visit_count !== 1 ? "s" : ""}`]]
              : []),
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

        {/* Loyalty hint */}
        {appointment.client?.id && (() => {
          if (loyaltyHint) {
            const remaining = loyaltyHint.required - loyaltyHint.stamps;
            const hasReward = loyaltyHint.stamps >= loyaltyHint.required;
            return (
              <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-amber-700">
                  <Gift size={12} /> Fidelización
                </p>
                <p className="mt-2 font-black text-slate-950">
                  {hasReward
                    ? `Recompensa lista 🎁`
                    : `${loyaltyHint.stamps}/${loyaltyHint.required} sellos`}
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  {hasReward
                    ? `${loyaltyHint.rewardDescription ?? "El cliente tiene una recompensa pendiente"}. Recuérdale al cerrar la cita.`
                    : remaining === 1
                    ? `Le falta 1 sello para conseguir su recompensa. Si completas esta cita, añade el sello desde la ficha.`
                    : `Le faltan ${remaining} sellos para la recompensa. Añade sello al completar.`}
                </p>
                <Link
                  href={`/dashboard/clientes/${appointment.client!.id}`}
                  className="mt-3 inline-flex text-xs font-black text-amber-700 hover:underline"
                  onClick={onClose}
                >
                  Ver tarjeta del cliente →
                </Link>
              </section>
            );
          }
          return (
            <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-amber-700">
                <Gift size={12} /> Fidelización
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Añade un sello de fidelización al completar esta cita.
              </p>
              <Link
                href={`/dashboard/clientes/${appointment.client!.id}`}
                className="mt-2 inline-flex text-xs font-black text-amber-700 hover:underline"
                onClick={onClose}
              >
                Ver tarjeta de puntos →
              </Link>
            </section>
          );
        })()}

        {/* Status action buttons */}
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            disabled={updating === appointment.id || appointment.status === "confirmed" || isTerminated}
            onClick={() => onStatusChange(appointment.id, "confirmed")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-40"
          >
            <CheckCircle size={15} /> Confirmar
          </button>
          <button
            type="button"
            disabled={updating === appointment.id || appointment.status === "completed"}
            onClick={() => onStatusChange(appointment.id, "completed")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-40"
          >
            <CalendarClock size={15} /> Marcar completada
          </button>
          <button
            type="button"
            disabled={updating === appointment.id || appointment.status === "no_show" || appointment.status === "completed"}
            onClick={() => onStatusChange(appointment.id, "no_show")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm font-black text-orange-800 transition hover:bg-orange-100 disabled:opacity-40"
          >
            <UserX size={15} /> No se presentó
          </button>
          <button
            type="button"
            disabled={updating === appointment.id || appointment.status === "cancelled"}
            onClick={() => onStatusChange(appointment.id, "cancelled")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-black text-rose-800 transition hover:bg-rose-100 disabled:opacity-40"
          >
            Cancelar
          </button>
        </div>

        {/* Quick actions */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href="/dashboard/caja"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition hover:bg-slate-50"
          >
            <CreditCard size={14} /> Cobrar en caja
          </Link>

          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-800 transition hover:bg-emerald-100"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-400"
            >
              <MessageCircle size={14} /> WhatsApp
            </button>
          )}

          <button
            type="button"
            disabled={isTerminated}
            onClick={() => { setShowReschedule((v) => !v); setRescheduleError(""); }}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-black transition ${
              isTerminated
                ? "border-slate-200 bg-slate-50 text-slate-400"
                : showReschedule
                ? "border-violet-300 bg-violet-50 text-violet-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <RotateCw size={14} /> Reagendar
          </button>
          <button
            type="button"
            disabled
            title="Disponible próximamente"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-black text-slate-400"
          >
            <Star size={14} /> Pedir reseña
          </button>
        </div>

        {/* Inline reschedule form */}
        {showReschedule && !isTerminated && (
          <form
            onSubmit={handleReschedule}
            className="mt-3 rounded-2xl border border-violet-200 bg-violet-50 p-4"
          >
            <p className="mb-3 text-xs font-black uppercase tracking-wide text-violet-700">Nueva fecha y hora</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[11px] font-black text-slate-500">Fecha</label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={appointment.appointment_date}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-black text-slate-500">Hora</label>
                <input
                  type="time"
                  name="time"
                  required
                  defaultValue={appointment.start_time.slice(0, 5)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            </div>
            {rescheduleError && (
              <p className="mt-2 text-xs font-bold text-rose-600">{rescheduleError}</p>
            )}
            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-black text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {isPending ? <Loader2 size={13} className="animate-spin" /> : <RotateCw size={13} />}
                Confirmar reagenda
              </button>
              <button
                type="button"
                onClick={() => setShowReschedule(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-black text-slate-600 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Crear próxima cita */}
        {appointment.client?.id && (
          <Link
            href={`/dashboard/agenda?view=day&clientId=${appointment.client.id}&serviceId=${appointment.service?.id ?? ""}`}
            onClick={onClose}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"
          >
            <CalendarPlus size={14} />
            Crear próxima cita
          </Link>
        )}

        {/* Ver cliente completo */}
        {appointment.client?.id ? (
          <Link
            href={`/dashboard/clientes/${appointment.client.id}`}
            onClick={onClose}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/8 px-4 py-3 text-sm font-black text-[#8A641F] transition hover:bg-[#D4AF37]/15"
          >
            <ExternalLink size={14} />
            Ver ficha completa del cliente
          </Link>
        ) : null}
      </aside>
    </div>
  );
}
