"use client";

import Link from "next/link";
import {
  CalendarClock,
  CheckCircle,
  CreditCard,
  Euro,
  ExternalLink,
  Gift,
  MessageCircle,
  Phone,
  RotateCw,
  Scissors,
  Star,
  UserX,
  X,
} from "lucide-react";
import { formatTime, getAppointmentDuration, getPrimaryClientInsight } from "@/src/lib/agenda/agenda-utils";
import { getStatusLabel } from "@/src/lib/agenda/appointment-colors";
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
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#1e1e1e] last:border-0">
      <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#555]">{label}</p>
      <p className="text-right text-sm font-bold text-white">{value}</p>
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
  if (!appointment) return null;

  const duration = getAppointmentDuration(appointment);
  const phone = appointment.client?.phone;
  const waPhone = phone?.replace(/\D/g, "");
  const waLink = waPhone ? `https://wa.me/${waPhone}` : null;
  const isTerminated = ["completed", "cancelled", "no_show"].includes(appointment.status);
  const visitCount = appointment.client?.visit_count ?? 0;
  const isNewClient = visitCount <= 1;
  const price = appointment.service?.price;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Cerrar panel"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="relative flex h-full w-full max-w-[420px] flex-col overflow-hidden border-l border-[#2a2a2a] bg-[#0a0a0a] shadow-2xl">
        {/* Header */}
        <div className="shrink-0 border-b border-[#1e1e1e] px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                Cita · {appointment.appointment_date}
              </p>
              <h2 className="mt-1.5 text-xl font-black text-white">
                {appointment.client?.name ?? "Cliente sin nombre"}
              </h2>
              <div className="mt-1.5 flex items-center gap-3">
                <p className="text-sm text-[#888]">
                  {formatTime(appointment.start_time)} · {duration} min
                </p>
                {isNewClient && (
                  <span className="rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/[0.12] px-2 py-0.5 text-[10px] font-black text-[#3B82F6]">
                    Nuevo cliente
                  </span>
                )}
                {visitCount > 5 && !isNewClient && (
                  <span className="rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/[0.12] px-2 py-0.5 text-[10px] font-black text-[#D4AF37]">
                    VIP · {visitCount} visitas
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#111] text-[#666] transition hover:border-[#333] hover:text-white"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Service + barber hero */}
          <div className="border-b border-[#1e1e1e] px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#111] text-[#D4AF37]">
                <Scissors size={20} />
              </div>
              <div>
                <p className="font-black text-white">
                  {appointment.service?.name ?? "Servicio no definido"}
                </p>
                <p className="mt-0.5 text-sm text-[#888]">
                  {appointment.barber?.name ?? "Sin barbero"} · {duration} min
                  {price ? ` · ${price}€` : ""}
                </p>
              </div>
              {price ? (
                <div className="ml-auto text-right">
                  <p className="text-xs text-[#666]">Precio</p>
                  <p className="text-xl font-black text-[#22C55E]">{price}€</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Client info */}
          <div className="border-b border-[#1e1e1e] px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#555]">Cliente</p>
            <div className="mt-3">
              <DataRow label="Teléfono" value={phone ?? "No disponible"} />
              <DataRow
                label="Visitas"
                value={visitCount > 0 ? `${visitCount} visita${visitCount !== 1 ? "s" : ""}` : "Primera visita"}
              />
              <DataRow label="Estado" value={getStatusLabel(appointment.status)} />
              {appointment.notes ? (
                <div className="pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#555]">Notas</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#888]">{appointment.notes}</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Business insight */}
          <div className="border-b border-[#1e1e1e] px-6 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#555]">Insight</p>
            <div className="mt-3 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] p-4">
              <p className="text-sm font-black text-white">{getPrimaryClientInsight(appointment)}</p>
              <p className="mt-1.5 text-xs leading-5 text-[#888]">
                {appointment.service?.name
                  ? `Revisa si encaja barba, tratamiento o producto después de ${appointment.service.name}.`
                  : "Completa servicio y cliente para generar mejores recomendaciones."}
              </p>
            </div>
          </div>

          {/* Loyalty */}
          {appointment.client?.id && (
            <div className="border-b border-[#1e1e1e] px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#555]">Fidelización</p>
              <div className="mt-3 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/[0.06] p-4">
                <div className="flex items-center gap-2">
                  <Gift size={14} className="text-[#F59E0B]" />
                  <p className="text-sm font-black text-white">
                    {loyaltyHint
                      ? loyaltyHint.stamps >= loyaltyHint.required
                        ? "Recompensa lista 🎁"
                        : `${loyaltyHint.stamps}/${loyaltyHint.required} sellos`
                      : "Añadir sello al completar"}
                  </p>
                </div>
                {loyaltyHint && (
                  <p className="mt-1.5 text-xs leading-5 text-[#888]">
                    {loyaltyHint.stamps >= loyaltyHint.required
                      ? loyaltyHint.rewardDescription ?? "Recompensa pendiente. Recuérdasela al cliente."
                      : loyaltyHint.required - loyaltyHint.stamps === 1
                      ? "¡Le falta 1 sello para su recompensa!"
                      : `Le faltan ${loyaltyHint.required - loyaltyHint.stamps} sellos.`}
                  </p>
                )}
                <Link
                  href={`/dashboard/clientes/${appointment.client.id}`}
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#F59E0B] hover:underline"
                >
                  Ver tarjeta del cliente →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Actions — pinned bottom */}
        <div className="shrink-0 border-t border-[#1e1e1e] px-6 py-4 space-y-2">
          {/* Status actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={updating === appointment.id || appointment.status === "confirmed" || isTerminated}
              onClick={() => onStatusChange(appointment.id, "confirmed")}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#22C55E] px-3 text-xs font-black text-[#070707] transition hover:bg-[#16a34a] disabled:opacity-30"
            >
              <CheckCircle size={13} /> Confirmar
            </button>
            <button
              type="button"
              disabled={updating === appointment.id || appointment.status === "completed"}
              onClick={() => onStatusChange(appointment.id, "completed")}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#111] border border-[#2a2a2a] px-3 text-xs font-black text-white transition hover:bg-[#1a1a1a] disabled:opacity-30"
            >
              <CalendarClock size={13} /> Completar
            </button>
            <button
              type="button"
              disabled={updating === appointment.id || appointment.status === "no_show" || appointment.status === "completed"}
              onClick={() => onStatusChange(appointment.id, "no_show")}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/[0.08] px-3 text-xs font-black text-[#F59E0B] transition hover:bg-[#F59E0B]/[0.15] disabled:opacity-30"
            >
              <UserX size={13} /> No apareció
            </button>
            <button
              type="button"
              disabled={updating === appointment.id || appointment.status === "cancelled"}
              onClick={() => onStatusChange(appointment.id, "cancelled")}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-[#EF4444]/25 bg-[#EF4444]/[0.08] px-3 text-xs font-black text-[#EF4444] transition hover:bg-[#EF4444]/[0.15] disabled:opacity-30"
            >
              Cancelar
            </button>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/caja"
              onClick={onClose}
              className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-[#2a2a2a] bg-[#111] px-3 text-xs font-bold text-[#888] transition hover:border-[#333] hover:text-white"
            >
              <CreditCard size={13} /> Cobrar
            </Link>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-[#25D366]/25 bg-[#25D366]/[0.08] px-3 text-xs font-bold text-[#25D366] transition hover:bg-[#25D366]/[0.15]"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] px-3 text-xs font-bold text-[#444]"
              >
                <MessageCircle size={13} /> WhatsApp
              </button>
            )}
          </div>

          {/* Ver cliente */}
          {appointment.client?.id && (
            <Link
              href={`/dashboard/clientes/${appointment.client.id}`}
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] px-4 py-2.5 text-xs font-black text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.12]"
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
