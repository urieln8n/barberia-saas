"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, Clock, Users, Zap } from "lucide-react";
import { formatTime, timeToMinutes } from "@/src/lib/agenda/agenda-utils";
import {
  isCurrentDay,
  getCurrentTimePosition,
  formatNowLabel,
} from "@/src/lib/agenda/time-position";
import type { AgendaAppointment, AgendaBarber, AgendaService, FreeSlot } from "@/src/lib/agenda/types";
import { AppointmentCard } from "./AppointmentCard";
import { FreeSlotCard } from "./FreeSlotCard";

const TIMELINE_START = 9;
const TIMELINE_END = 20;
const CELL_HEIGHT = 72; // slightly taller rows for premium feel

function minutesToTop(timeStr: string): number {
  const mins = timeToMinutes(formatTime(timeStr));
  const offset = mins - TIMELINE_START * 60;
  return Math.max(0, (offset / 60) * CELL_HEIGHT);
}

function durationToHeight(start: string, end: string | null, durationMin: number): number {
  if (end) {
    const diff = timeToMinutes(formatTime(end)) - timeToMinutes(formatTime(start));
    return Math.max(52, (Math.min(diff, 120) / 60) * CELL_HEIGHT);
  }
  return Math.max(52, (Math.min(durationMin, 120) / 60) * CELL_HEIGHT);
}

const HOURS = Array.from(
  { length: TIMELINE_END - TIMELINE_START },
  (_, i) => TIMELINE_START + i,
);

type Props = {
  dateISO: string;
  appointments: AgendaAppointment[];
  freeSlots: FreeSlot[];
  barbers?: AgendaBarber[];
  services?: AgendaService[];
  selectedBarberName?: string | null;
  onAppointmentClick: (a: AgendaAppointment) => void;
  onFreeSlotBook?: (slot: FreeSlot) => void;
  onNewAppointment: () => void;
};

export function DailyTimelineView({
  dateISO,
  appointments,
  freeSlots,
  barbers = [],
  services = [],
  selectedBarberName,
  onAppointmentClick,
  onFreeSlotBook,
  onNewAppointment,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const nowLineRef = useRef<HTMLDivElement>(null);

  const [nowState, setNowState] = useState<{ percent: number | null; label: string }>(() => ({
    percent: isCurrentDay(dateISO) ? getCurrentTimePosition(TIMELINE_START, TIMELINE_END) : null,
    label: formatNowLabel(),
  }));

  useEffect(() => {
    if (!isCurrentDay(dateISO)) {
      setNowState({ percent: null, label: formatNowLabel() });
      return;
    }
    const update = () =>
      setNowState({
        percent: getCurrentTimePosition(TIMELINE_START, TIMELINE_END),
        label: formatNowLabel(),
      });
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [dateISO]);

  useEffect(() => {
    if (!nowLineRef.current || nowState.percent === null) return;
    const t = setTimeout(() => {
      nowLineRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }, 350);
    return () => clearTimeout(t);
  }, [nowState.percent, prefersReducedMotion]);

  const dayAppointments = appointments
    .filter((a) => a.appointment_date === dateISO)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const daySlots = freeSlots
    .filter((s) => s.date === dateISO)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const totalHeight = (TIMELINE_END - TIMELINE_START) * CELL_HEIGHT;
  const isEmpty = dayAppointments.length === 0 && daySlots.length === 0;

  const estimatedRevenue = dayAppointments.reduce(
    (sum, a) => sum + Number(a.service?.price ?? 0),
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Mini KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#555]">Reservas</p>
          <p className="mt-1.5 text-2xl font-black text-white">{dayAppointments.length}</p>
        </div>
        <div className="rounded-2xl border border-[#22C55E]/20 bg-[#22C55E]/[0.06] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#22C55E]/70">Huecos libres</p>
          <p className="mt-1.5 text-2xl font-black text-[#22C55E]">{daySlots.length}</p>
        </div>
        <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37]/70">
            {selectedBarberName ? "Barbero" : "Equipo"}
          </p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Users size={16} className="text-[#D4AF37]" />
            <p className="text-2xl font-black text-[#D4AF37]">
              {selectedBarberName ? 1 : barbers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
            Vista día · {selectedBarberName ?? "Todo el equipo"}
          </p>
          <p className="mt-0.5 text-xs text-[#666]">
            {dayAppointments.length} cita{dayAppointments.length !== 1 ? "s" : ""}
            {estimatedRevenue > 0 ? ` · ${estimatedRevenue}€ previstos` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onNewAppointment}
          className="flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] px-3.5 py-2 text-xs font-black text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.15] active:scale-95"
        >
          <CalendarPlus size={13} />
          Nueva reserva
        </button>
      </div>

      {/* Timeline */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.40)]">
        <div className="flex">
          {/* Hour labels */}
          <div
            className="shrink-0 border-r border-[#1e1e1e]"
            style={{ width: 56, height: totalHeight }}
          >
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end pr-2.5 pt-1.5"
                style={{ height: CELL_HEIGHT }}
              >
                <span className="text-[10px] font-bold tabular-nums text-[#444]">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Event area */}
          <div className="relative flex-1" style={{ height: totalHeight }}>
            {/* Hour grid lines */}
            {HOURS.map((h, i) => (
              <div
                key={h}
                className="absolute inset-x-0 border-t border-[#1e1e1e]"
                style={{ top: i * CELL_HEIGHT }}
              />
            ))}

            {/* Half-hour lines */}
            {HOURS.map((h, i) => (
              <div
                key={`half-${h}`}
                className="absolute inset-x-0 border-t border-[#161616]"
                style={{ top: i * CELL_HEIGHT + CELL_HEIGHT / 2 }}
              />
            ))}

            {/* "Ahora" line — premium gold */}
            {nowState.percent !== null && (
              <div
                ref={nowLineRef}
                className="pointer-events-none absolute inset-x-0 z-20 flex items-center gap-0"
                style={{ top: Math.round(nowState.percent * totalHeight) - 1 }}
              >
                <span className="ml-1 mr-1.5 h-3 w-3 shrink-0 rounded-full bg-[#D4AF37] shadow-[0_0_0_3px_rgba(212,175,55,0.20),0_0_10px_rgba(212,175,55,0.40)]" />
                <div className="h-[1.5px] flex-1 bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/60 to-transparent" />
                <span className="mr-2 shrink-0 rounded-full bg-[#D4AF37] px-2.5 py-1 text-[9px] font-black text-[#070707] shadow-sm">
                  {nowState.label}
                </span>
              </div>
            )}

            {/* Free slots */}
            {daySlots.map((slot) => {
              const top = minutesToTop(slot.start_time);
              const height = durationToHeight(slot.start_time, slot.end_time, 45);
              return (
                <div
                  key={slot.id}
                  className="absolute left-1 right-2 overflow-hidden rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/[0.06]"
                  style={{ top: top + 2, height: height - 4 }}
                >
                  <div className="flex h-full items-center justify-between gap-2 px-3">
                    <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-black text-[#22C55E]">
                      <Zap size={10} className="shrink-0" />
                      {formatTime(slot.start_time)} · {slot.barber?.name ?? "Hueco libre"}
                    </span>
                    {onFreeSlotBook ? (
                      <button
                        type="button"
                        onClick={() => onFreeSlotBook(slot)}
                        className="shrink-0 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/[0.12] px-2.5 py-1 text-[9px] font-black text-[#22C55E] transition hover:bg-[#22C55E]/[0.20]"
                      >
                        + Reservar
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* Appointment cards */}
            {dayAppointments.map((appt, idx) => {
              const top = minutesToTop(appt.start_time);
              const height = durationToHeight(
                appt.start_time,
                appt.end_time,
                appt.service?.duration_minutes ?? 30,
              );
              return (
                <motion.div
                  key={appt.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.035 }}
                  className="absolute left-1 right-1"
                  style={{ top: top + 2, height: height - 4 }}
                >
                  <div className="h-full overflow-hidden rounded-xl">
                    <AppointmentCard
                      appointment={appt}
                      compact={height < 72}
                      onClick={onAppointmentClick}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#111111] text-[#444]">
              <Clock size={22} />
            </div>
            <div className="text-center">
              <p className="font-black text-white">Día disponible</p>
              <p className="mt-1.5 text-xs leading-6 text-[#666]">
                Crea la primera cita o comparte tu link para recibir reservas online.
              </p>
            </div>
            <button
              type="button"
              onClick={onNewAppointment}
              className="flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] px-4 py-2 text-xs font-black text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.15]"
            >
              <CalendarPlus size={12} /> Crear primera cita
            </button>
          </div>
        )}
      </div>

      {/* Mobile list */}
      {(dayAppointments.length > 0 || daySlots.length > 0) && (
        <div className="block md:hidden space-y-2 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#555]">
            Lista del día
          </p>

          {nowState.percent !== null && (
            <div className="flex items-center gap-2 py-1">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.5)]" />
              <span className="h-px flex-1 bg-[#D4AF37]/20" />
              <span className="rounded-full bg-[#D4AF37] px-2 py-px text-[9px] font-black text-[#070707]">
                {nowState.label}
              </span>
            </div>
          )}

          {dayAppointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} onClick={onAppointmentClick} />
          ))}
          {daySlots.map((slot) => (
            <FreeSlotCard key={slot.id} slot={slot} services={services} onBook={onFreeSlotBook} />
          ))}
        </div>
      )}
    </div>
  );
}
