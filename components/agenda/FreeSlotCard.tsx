"use client";

import Link from "next/link";
import { CalendarPlus, Clock, Megaphone, Sparkles } from "lucide-react";
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

  // Potential income: lowest price among fitting services (conservative estimate)
  const potentialIncome = fittingServices.length > 0
    ? Math.min(...fittingServices.map((s) => s.price).filter((p) => p > 0))
    : null;

  return (
    <article
      className={`rounded-xl border p-3 text-emerald-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isNow
          ? "border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-[#D4AF37]/10 ring-2 ring-emerald-200/70"
          : "border-emerald-200 bg-emerald-50/80"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
              Hueco libre
            </span>
            {isNow ? (
              <span className="rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                Ahora
              </span>
            ) : null}
            {potentialIncome !== null && potentialIncome > 0 && !compact ? (
              <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-[10px] font-black text-emerald-700">
                ~{potentialIncome} € potencial
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm font-black text-slate-950">
            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
          </p>
          <p className="mt-1 text-xs font-semibold text-emerald-800">
            {slot.barber?.name ?? "Equipo"} disponible
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
            <Clock size={12} /> {duration} min libres
          </p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
          <Sparkles size={14} />
        </div>
      </div>

      {fittingServices.length > 0 && !compact ? (
        <p className="mt-2 line-clamp-1 text-[11px] font-semibold text-emerald-700">
          Caben: {fittingServices.map((service) => service.name).join(", ")}
        </p>
      ) : null}

      {onBook ? (
        <button
          type="button"
          onClick={() => onBook(slot)}
          className={`mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg px-3 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 ${
            isNow ? "bg-[#0F3D5E] hover:bg-[#0A2F49]" : "bg-slate-950 hover:bg-slate-800"
          }`}
        >
          <CalendarPlus size={13} />
          {compact ? "+ Reservar" : "Reservar ahora"}
        </button>
      ) : null}

      {!compact ? (
        <Link
          href="/dashboard/marketing"
          onClick={onPromote}
          className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 text-xs font-black text-emerald-800 transition hover:bg-emerald-100"
        >
          <Megaphone size={13} /> Promocionar hueco
        </Link>
      ) : null}
    </article>
  );
}
