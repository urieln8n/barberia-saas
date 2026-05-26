"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, Clock, Zap } from "lucide-react";
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
        if (!["scheduled", "confirmed", "pending"].includes(a.status))
          return false;
        const m =
          Number(a.start_time.slice(0, 2)) * 60 +
          Number(a.start_time.slice(3, 5));
        return m > nowMin;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0] ?? null;

  const nextSlot =
    freeSlots
      .filter((s) => {
        if (s.date !== today) return false;
        const m =
          Number(s.start_time.slice(0, 2)) * 60 +
          Number(s.start_time.slice(3, 5));
        return m >= nowMin;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0] ?? null;

  if (!nextAppt && !nextSlot) return null;

  return (
    <div className="flex overflow-hidden rounded-2xl border border-[#D5A84C]/25 bg-white shadow-sm">
      {/* Time pill */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-0.5 bg-[#D5A84C]/8 px-4 py-3">
        <Clock size={13} className="text-[#B8892A]" />
        <p className="text-[11px] font-black text-[#8A641F]">{timeLabel}</p>
        <p className="text-[9px] font-bold uppercase tracking-wide text-[#B8892A]/70">
          Ahora
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-3">
        {nextAppt && (
          <div className="flex items-center gap-2 text-[11px]">
            <CalendarClock size={12} className="shrink-0 text-slate-400" />
            <span className="font-bold text-slate-500">Próxima:</span>
            <span className="font-black text-slate-950">
              {nextAppt.start_time.slice(0, 5)} ·{" "}
              {nextAppt.client?.name ?? "Cliente"}
            </span>
            {nextAppt.service && (
              <span className="hidden text-slate-400 sm:inline">
                · {nextAppt.service.name}
              </span>
            )}
          </div>
        )}

        {nextSlot && (
          <div className="flex items-center gap-2 text-[11px]">
            <Zap size={12} className="shrink-0 text-emerald-500" />
            <span className="font-bold text-emerald-700">Hueco:</span>
            <span className="font-black text-slate-950">
              {nextSlot.start_time.slice(0, 5)}
            </span>
            {nextSlot.barber && (
              <span className="hidden text-slate-400 sm:inline">
                · {nextSlot.barber.name}
              </span>
            )}
            <Link
              href={`/dashboard/agenda?view=day&date=${today}`}
              className="flex items-center gap-1 rounded-lg bg-emerald-700 px-2 py-0.5 text-[10px] font-black text-white transition hover:bg-emerald-800"
            >
              Reservar <ArrowRight size={9} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
