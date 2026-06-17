"use client";

import Link from "next/link";
import {
  Calendar,
  CalendarClock,
  CalendarPlus,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Gift,
  MessageCircle,
  Scissors,
  UserX,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="text-right text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function AppointmentDetailsPanel({
  appointment,
  updating,
  onClose,
  onStatusChange,
  loyaltyHint = null,
}: Props) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(appointment?.appointment_date ?? "");
  const [rescheduleTime, setRescheduleTime] = useState(appointment?.start_time?.slice(0, 5) ?? "");
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!appointment) return null;

  const duration = getAppointmentDuration(appointment);
  const phone = appointment.client?.phone;
  const waPhone = phone?.replace(/\D/g, "");
  const waLink = waPhone ? `https://wa.me/${waPhone}` : null;
  const isTerminated = ["completed", "cancelled", "no_show"].includes(appointment.status);
  const visitCount = appointment.client?.visit_count ?? 0;
  const isNewClient = visitCount <= 1;
  const price = appointment.service?.price;

  function handleReschedule() {
    if (!rescheduleDate || !rescheduleTime) {
      setRescheduleError("Selecciona fecha y hora.");
      return;
    }
    setRescheduleError(null);
    startTransition(async () => {
      const result = await rescheduleAppointment(appointment!.id, rescheduleDate, rescheduleTime);
      if ("error" in result && result.error) {
        setRescheduleError(result.error);
      } else {
        setRescheduleOpen(false);
        router.refresh();
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar panel"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden border-l border-slate-200 bg-white shadow-2xl">

        {/* Header */}
        <div className="shrink-0 border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9922A]">
                Cita · {appointment.appointment_date}
              </p>
              <h2 className="mt-1.5 text-xl font-black text-slate-900">
                {appointment.client?.name ?? "Cliente sin nombre"}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <p className="text-sm text-slate-500">
                  {formatTime(appointment.start_time)} · {duration} min
                </p>
                {isNewClient && (
                  <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/[0.08] px-2 py-0.5 text-[10px] font-black text-[#D4AF37]">
                    Nuevo cliente
                  </span>
                )}
                {visitCount > 5 && !isNewClient && (
                  <span className="rounded-full border border-[#C9922A]/30 bg-[#C9922A]/8 px-2 py-0.5 text-[10px] font-black text-[#C9922A]">
                    VIP · {visitCount} visitas
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Service + barber */}
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-[#C9922A]">
                <Scissors size={20} />
              </div>
              <div>
                <p className="font-black text-slate-900">
                  {appointment.service?.name ?? "Servicio no definido"}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {appointment.barber?.name ?? "Sin barbero"} · {duration} min
                  {price ? ` · ${price}€` : ""}
                </p>
              </div>
              {price ? (
                <div className="ml-auto text-right">
                  <p className="text-xs text-slate-400">Precio</p>
                  <p className="text-xl font-black text-emerald-600">{price}€</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Client info */}
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Cliente</p>
            <div className="mt-3">
              <DataRow label="Teléfono" value={phone ?? "No disponible"} />
              <DataRow
                label="Visitas"
                value={visitCount > 0 ? `${visitCount} visita${visitCount !== 1 ? "s" : ""}` : "Primera visita"}
              />
              <DataRow label="Estado" value={getStatusLabel(appointment.status)} />
              {appointment.notes ? (
                <div className="pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Notas</p>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600">{appointment.notes}</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Insight */}
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Insight</p>
            <div className="mt-3 rounded-xl border border-[#C9922A]/20 bg-[#C9922A]/5 p-4">
              <p className="text-sm font-black text-slate-900">{getPrimaryClientInsight(appointment)}</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                {appointment.service?.name
                  ? `Revisa si encaja barba, tratamiento o producto después de ${appointment.service.name}.`
                  : "Completa servicio y cliente para generar mejores recomendaciones."}
              </p>
            </div>
          </div>

          {/* Reagendar form */}
          {rescheduleOpen && (
            <div className="border-b border-slate-100 px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Reagendar cita</p>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Fecha</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-[#C9922A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-500">Hora</label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    step="900"
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-[#C9922A] focus:outline-none"
                  />
                </div>
                {rescheduleError && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                    {rescheduleError}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReschedule}
                    disabled={isPending}
                    className="flex-1 rounded-xl bg-[#C9922A] px-4 py-2.5 text-xs font-black text-white transition hover:bg-[#b87e24] disabled:opacity-50"
                  >
                    {isPending ? "Guardando…" : "Confirmar reagendado"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRescheduleOpen(false); setRescheduleError(null); }}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loyalty */}
          {appointment.client?.id && (
            <div className="border-b border-slate-100 px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Fidelización</p>
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <Gift size={14} className="text-amber-500" />
                  <p className="text-sm font-black text-slate-900">
                    {loyaltyHint
                      ? loyaltyHint.stamps >= loyaltyHint.required
                        ? "Recompensa lista"
                        : `${loyaltyHint.stamps}/${loyaltyHint.required} sellos`
                      : "Añadir sello al completar"}
                  </p>
                </div>
                {loyaltyHint && (
                  <p className="mt-1.5 text-xs leading-5 text-slate-500">
                    {loyaltyHint.stamps >= loyaltyHint.required
                      ? loyaltyHint.rewardDescription ?? "Recompensa pendiente. Recuérdasela al cliente."
                      : loyaltyHint.required - loyaltyHint.stamps === 1
                      ? "Le falta 1 sello para su recompensa."
                      : `Le faltan ${loyaltyHint.required - loyaltyHint.stamps} sellos.`}
                  </p>
                )}
                <Link
                  href={`/dashboard/clientes/${appointment.client.id}`}
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-black text-amber-600 hover:underline"
                >
                  Ver tarjeta del cliente →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Actions — pinned bottom */}
        <div className="shrink-0 space-y-2 border-t border-slate-100 px-6 py-4">

          {/* ── Acción principal: Completar ── */}
          {!isTerminated && (
            <button
              type="button"
              disabled={updating === appointment.id || appointment.status === "completed"}
              onClick={() => onStatusChange(appointment.id, "completed")}
              className="flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl bg-slate-900 px-4 py-3.5 transition hover:bg-slate-700 disabled:opacity-30"
            >
              <span className="flex items-center gap-2 text-sm font-black text-white">
                <CalendarClock size={15} /> Marcar como completada
              </span>
              <span className="text-[10px] font-medium text-white/40">
                Añade sello de fidelización automáticamente
              </span>
            </button>
          )}

          {/* ── Confirmar (si aún no está confirmada) ── */}
          {!isTerminated && appointment.status !== "confirmed" && (
            <button
              type="button"
              disabled={updating === appointment.id}
              onClick={() => onStatusChange(appointment.id, "confirmed")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-black text-white transition hover:bg-emerald-600 disabled:opacity-30"
            >
              <CheckCircle size={14} /> Confirmar cita
            </button>
          )}

          {/* ── Acciones secundarias ── */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/caja"
              onClick={onClose}
              className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <CreditCard size={13} /> Cobrar
            </Link>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 text-xs font-bold text-slate-300"
              >
                <MessageCircle size={13} /> WhatsApp
              </button>
            )}
            {!isTerminated && (
              <button
                type="button"
                disabled={updating === appointment.id}
                onClick={() => onStatusChange(appointment.id, "no_show")}
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-30"
              >
                <UserX size={13} /> No vino
              </button>
            )}
            {!isTerminated && (
              <button
                type="button"
                disabled={updating === appointment.id}
                onClick={() => onStatusChange(appointment.id, "cancelled")}
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 text-xs font-bold text-red-500 transition hover:bg-red-100 disabled:opacity-30"
              >
                Cancelar
              </button>
            )}
          </div>

          {!isTerminated && (
            <button
              type="button"
              onClick={() => { setRescheduleOpen((v) => !v); setRescheduleError(null); }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <Calendar size={12} />
              {rescheduleOpen ? "Cerrar reagendar" : "Reagendar cita"}
            </button>
          )}

          {appointment.client?.id && (
            <Link
              href={`/dashboard/agenda?view=day&clientId=${appointment.client.id}&serviceId=${appointment.service?.id ?? ""}`}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-black text-emerald-700 transition hover:bg-emerald-100"
            >
              <CalendarPlus size={12} />
              Crear próxima cita
            </Link>
          )}

          {appointment.client?.id && (
            <Link
              href={`/dashboard/clientes/${appointment.client.id}`}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9922A]/25 bg-[#C9922A]/6 px-4 py-2.5 text-xs font-black text-[#C9922A] transition hover:bg-[#C9922A]/12"
            >
              <ExternalLink size={12} />
              Ver ficha completa del cliente
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
