"use client";

import Link from "next/link";
import { CalendarPlus, Clock, Megaphone, Zap } from "lucide-react";
import { formatTime, timeToMinutes } from "@/src/lib/agenda/agenda-utils";
import type { AgendaService, FreeSlot } from "@/src/lib/agenda/types";

type Props = {
  slot: FreeSlot;
  services?: AgendaService[];
  compact?: boolean;
  onBook?: (slot: FreeSlot) => void;
  onPromote?: () => void;
};

function getSlotDuration(slot: FreeSlot) {
  return Math.max(15, timeToMinutes(formatTime(slot.end_time)) - timeToMinutes(formatTime(slot.start_time)));
}

function getMadridNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
}

function isSlotNow(slot: FreeSlot) {
  const madridNow = getMadridNow();
  const today = `${madridNow.getFullYear()}-${String(madridNow.getMonth() + 1).padStart(2, "0")}-${String(madridNow.getDate()).padStart(2, "0")}`;
  if (slot.date !== today) return false;
  const nowMinutes = madridNow.getHours() * 60 + madridNow.getMinutes();
  const startMinutes = timeToMinutes(formatTime(slot.start_time));
  const endMinutes = timeToMinutes(formatTime(slot.end_time));
  return nowMinutes >= startMinutes - 15 && nowMinutes < endMinutes;
}

export function FreeSlotCard({ slot, services = [], compact = false, onBook, onPromote }: Props) {
  const duration = getSlotDuration(slot);
  const isNow = isSlotNow(slot);
  const fittingServices = services
    .filter((service) => service.duration_minutes <= duration)
    .slice(0, compact ? 1 : 2);

  const potentialIncome = fittingServices.length > 0
    ? Math.min(...fittingServices.map((s) => s.price).filter((p) => p > 0))
    : null;

  const barberName = slot.barber?.name ?? "Equipo";

  return (
    <article
      className={`rounded-xl border p-3 transition hover:-translate-y-0.5 hover:shadow-md ${
        isNow
          ? "border-[#D4AF37]/40 bg-gradient-to-br from-[#D4AF37]/8 via-white/5 to-transparent ring-1 ring-[#D4AF37]/20 shadow-[0_4px_20px_rgba(212,175,55,0.15)]"
          : "border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.09)]"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
            isNow
              ? "bg-[#D4AF37] text-white"
              : "bg-slate-100 text-slate-600"
          }`}>
            {isNow ? "Ahora · Hueco libre" : "Hueco libre"}
          </span>
          {potentialIncome !== null && potentialIncome > 0 && !compact ? (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-600">
              ~{potentialIncome} €
            </span>
          ) : null}
        </div>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
          isNow ? "bg-[#D4AF37]/15 text-[#D4AF37]" : "bg-slate-100 text-slate-500"
        }`}>
          <Zap size={13} />
        </div>
      </div>

      {/* Time + barber */}
      <p className="mt-2 text-sm font-black text-slate-900 tabular-nums">
        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-slate-500">
        {barberName} disponible
      </p>
      <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-slate-400">
        <Clock size={11} />
        {duration} min libres
      </p>

      {/* Fitting services */}
      {fittingServices.length > 0 && !compact ? (
        <p className="mt-2 line-clamp-1 text-[10px] text-slate-400">
          Caben: {fittingServices.map((s) => s.name).join(", ")}
        </p>
      ) : null}

      {/* CTA */}
      {onBook ? (
        <button
          type="button"
          onClick={() => onBook(slot)}
          className={`mt-3 inline-flex min-h-[34px] w-full items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-black text-white transition hover:-translate-y-0.5 active:scale-[0.98] ${
            isNow
              ? "bg-[#D4AF37] shadow-[0_4px_14px_rgba(212,175,55,0.30)] hover:bg-[#C9922A]"
              : "bg-slate-900 hover:bg-slate-700"
          }`}
        >
          <CalendarPlus size={12} />
          {compact ? "+ Reservar" : "Reservar ahora"}
        </button>
      ) : null}

      {!compact && onPromote ? (
        <Link
          href="/dashboard/marketing"
          onClick={onPromote}
          className="mt-2 inline-flex min-h-[32px] w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[10px] font-black text-slate-600 transition hover:bg-slate-100"
        >
          <Megaphone size={11} /> Promocionar hueco
        </Link>
      ) : null}
    </article>
  );
}
