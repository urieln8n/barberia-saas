"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, Clock, TrendingUp, Zap } from "lucide-react";
import {
  getCurrentTimeHHMM,
  getMadridNow,
  getMadridTodayISO,
  getMinutesFromStartOfDay,
} from "@/src/lib/agenda/time-position";
import type { AgendaAppointment, FreeSlot } from "@/src/lib/agenda/types";

type Props = {
  appointments: AgendaAppointment[];
  freeSlots: FreeSlot[];
  dateISO: string;
};

export function AgendaNowCard({ appointments, freeSlots, dateISO }: Props) {
  const [timeLabel, setTimeLabel] = useState(getCurrentTimeHHMM);

  useEffect(() => {
    const id = setInterval(() => setTimeLabel(getCurrentTimeHHMM()), 60_000);
    return () => clearInterval(id);
  }, []);

  const today = getMadridTodayISO();
  if (dateISO !== today) return null;

  const now = getMadridNow();
  const nowMin = getMinutesFromStartOfDay(now);

  const nextAppt =
    appointments
      .filter((a) => {
        if (a.appointment_date !== today) return false;
        if (!["scheduled", "confirmed", "pending"].includes(a.status)) return false;
        const m = Number(a.start_time.slice(0, 2)) * 60 + Number(a.start_time.slice(3, 5));
        return m > nowMin;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0] ?? null;

  const nextSlot =
    freeSlots
      .filter((s) => {
        if (s.date !== today) return false;
        const m = Number(s.start_time.slice(0, 2)) * 60 + Number(s.start_time.slice(3, 5));
        return m >= nowMin;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0] ?? null;

  // Remaining free slots count
  const remainingSlots = freeSlots.filter((s) => {
    if (s.date !== today) return false;
    const m = Number(s.start_time.slice(0, 2)) * 60 + Number(s.start_time.slice(3, 5));
    return m >= nowMin;
  }).length;

  // Upcoming appointments in next 2h
  const upcomingCount = appointments.filter((a) => {
    if (a.appointment_date !== today) return false;
    if (!["scheduled", "confirmed", "pending"].includes(a.status)) return false;
    const m = Number(a.start_time.slice(0, 2)) * 60 + Number(a.start_time.slice(3, 5));
    return m > nowMin && m <= nowMin + 120;
  }).length;

  // Smart recommended action
  let recommendedText = "";
  let recommendedHref = `/dashboard/agenda?view=day&date=${today}`;
  if (nextSlot) {
    recommendedText = `Llenar hueco ${nextSlot.start_time.slice(0, 5)}`;
  } else if (nextAppt) {
    const minsToNext =
      Number(nextAppt.start_time.slice(0, 2)) * 60 +
      Number(nextAppt.start_time.slice(3, 5)) -
      nowMin;
    recommendedText =
      minsToNext <= 15
        ? `Cita en ${minsToNext} min`
        : `Ver cita de ${nextAppt.client?.name ?? "cliente"}`;
  } else {
    recommendedText = "Compartir link";
    recommendedHref = "/dashboard/qr";
  }

  if (!nextAppt && !nextSlot) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-white shadow-sm">
      <div className="flex">
        {/* Time pill */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-0.5 border-r border-[#D4AF37]/15 bg-[#D4AF37]/8 px-4 py-3.5">
          <Clock size={13} className="text-[#B88917]" />
          <p className="text-[13px] font-black tabular-nums text-[#8A641F]">{timeLabel}</p>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[#B88917]/70">Ahora</p>
        </div>

        {/* Event items */}
        <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-3">
          {nextAppt ? (
            <div className="flex items-center gap-2 text-[11px]">
              <CalendarClock size={12} className="shrink-0 text-slate-400" />
              <span className="font-bold text-slate-500">Próxima:</span>
              <span className="font-black text-slate-950">
                {nextAppt.start_time.slice(0, 5)} · {nextAppt.client?.name ?? "Cliente"}
              </span>
              {nextAppt.barber && (
                <span className="hidden text-slate-400 sm:inline">· {nextAppt.barber.name}</span>
              )}
              {nextAppt.service && (
                <span className="hidden text-slate-400 lg:inline">· {nextAppt.service.name}</span>
              )}
            </div>
          ) : null}

          {nextSlot ? (
            <div className="flex items-center gap-2 text-[11px]">
              <Zap size={12} className="shrink-0 text-emerald-500" />
              <span className="font-bold text-emerald-700">Hueco libre:</span>
              <span className="font-black text-slate-950">{nextSlot.start_time.slice(0, 5)}</span>
              {nextSlot.barber && (
                <span className="hidden text-slate-400 sm:inline">· {nextSlot.barber.name}</span>
              )}
              {remainingSlots > 1 && (
                <span className="text-emerald-600">· {remainingSlots} huecos hoy</span>
              )}
            </div>
          ) : null}

          {upcomingCount > 0 ? (
            <div className="hidden items-center gap-1.5 text-[11px] lg:flex">
              <TrendingUp size={12} className="text-sky-500" />
              <span className="font-bold text-sky-600">
                {upcomingCount} cita{upcomingCount !== 1 ? "s" : ""} próximas 2h
              </span>
            </div>
          ) : null}
        </div>

        {/* Recommended action chip */}
        <div className="hidden shrink-0 items-center border-l border-slate-100 px-4 sm:flex">
          <Link
            href={recommendedHref}
            className="flex items-center gap-1.5 rounded-xl bg-[#D4AF37]/10 px-3 py-2 text-[10px] font-black text-[#8A641F] transition hover:bg-[#D4AF37]/20"
          >
            {recommendedText}
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
}
