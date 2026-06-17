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

  const remainingSlots = freeSlots.filter((s) => {
    if (s.date !== today) return false;
    const m = Number(s.start_time.slice(0, 2)) * 60 + Number(s.start_time.slice(3, 5));
    return m >= nowMin;
  }).length;

  const upcomingCount = appointments.filter((a) => {
    if (a.appointment_date !== today) return false;
    if (!["scheduled", "confirmed", "pending"].includes(a.status)) return false;
    const m = Number(a.start_time.slice(0, 2)) * 60 + Number(a.start_time.slice(3, 5));
    return m > nowMin && m <= nowMin + 120;
  }).length;

  let recommendedText = "";
  let recommendedHref = `/dashboard/agenda?view=day&date=${today}`;
  if (nextSlot) {
    recommendedText = `Llenar ${nextSlot.start_time.slice(0, 5)}`;
  } else if (nextAppt) {
    const mins = Number(nextAppt.start_time.slice(0, 2)) * 60 + Number(nextAppt.start_time.slice(3, 5)) - nowMin;
    recommendedText = mins <= 15 ? `Cita en ${mins} min` : `Ver ${nextAppt.client?.name ?? "cita"}`;
  } else {
    recommendedText = "Compartir QR";
    recommendedHref = "/dashboard/qr";
  }

  if (!nextAppt && !nextSlot) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex">
        {/* Live time indicator */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-0.5 border-r border-slate-200 bg-slate-50 px-4 py-3.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#22C55E]" />
          <Clock size={12} className="mt-1 text-[#C9922A]/70" />
          <p className="text-[13px] font-black tabular-nums text-[#C9922A]">{timeLabel}</p>
          <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">Ahora</p>
        </div>

        {/* Event items */}
        <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-3">
          {nextAppt && (
            <div className="flex items-center gap-2 text-[11px]">
              <CalendarClock size={11} className="shrink-0 text-slate-400" />
              <span className="font-semibold text-slate-500">Próxima:</span>
              <span className="font-black text-slate-900">
                {nextAppt.start_time.slice(0, 5)} · {nextAppt.client?.name ?? "Cliente"}
              </span>
              {nextAppt.barber && (
                <span className="hidden text-slate-400 sm:inline">· {nextAppt.barber.name}</span>
              )}
              {nextAppt.service && (
                <span className="hidden text-slate-400 lg:inline">· {nextAppt.service.name}</span>
              )}
            </div>
          )}

          {nextSlot && (
            <div className="flex items-center gap-2 text-[11px]">
              <Zap size={11} className="shrink-0 text-emerald-500" />
              <span className="font-semibold text-emerald-600">Hueco:</span>
              <span className="font-black text-slate-900">{nextSlot.start_time.slice(0, 5)}</span>
              {nextSlot.barber && (
                <span className="hidden text-slate-400 sm:inline">· {nextSlot.barber.name}</span>
              )}
              {remainingSlots > 1 && (
                <span className="text-emerald-500">· {remainingSlots} hoy</span>
              )}
            </div>
          )}

          {upcomingCount > 0 && (
            <div className="hidden items-center gap-1.5 text-[11px] lg:flex">
              <TrendingUp size={11} className="text-[#D4AF37]" />
              <span className="font-semibold text-[#D4AF37]">
                {upcomingCount} cita{upcomingCount !== 1 ? "s" : ""} próximas 2h
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="hidden shrink-0 items-center border-l border-slate-200 px-4 sm:flex">
          <Link
            href={recommendedHref}
            className="flex items-center gap-1.5 rounded-xl border border-[#C9922A]/25 bg-[#C9922A]/8 px-3 py-2 text-[10px] font-black text-[#C9922A] transition hover:bg-[#C9922A]/14"
          >
            {recommendedText}
            <ArrowRight size={9} />
          </Link>
        </div>
      </div>
    </div>
  );
}
