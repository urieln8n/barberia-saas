"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, ChevronDown, ChevronUp, Clock, Users, Zap } from "lucide-react";
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
const TIMELINE_END   = 20;
const CELL_HEIGHT    = 56;

function minutesToTop(timeStr: string): number {
  const mins   = timeToMinutes(formatTime(timeStr));
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

function groupConsecutiveFreeSlots(slots: FreeSlot[]): FreeSlot[] {
  if (slots.length === 0) return [];
  const byBarber: Record<string, FreeSlot[]> = {};
  for (const slot of slots) {
    const key = slot.barber?.id ?? "none";
    if (!byBarber[key]) byBarber[key] = [];
    byBarber[key].push(slot);
  }
  const grouped: FreeSlot[] = [];
  for (const barberSlots of Object.values(byBarber)) {
    const sorted = [...barberSlots].sort((a, b) => a.start_time.localeCompare(b.start_time));
    let current = { ...sorted[0] };
    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];
      const currentEndMins  = timeToMinutes(formatTime(current.end_time));
      const nextStartMins   = timeToMinutes(formatTime(next.start_time));
      if (nextStartMins - currentEndMins <= 5) {
        current = { ...current, end_time: next.end_time };
      } else {
        grouped.push(current);
        current = { ...next };
      }
    }
    grouped.push(current);
  }
  return grouped;
}

// Calcular minutos desde medianoche para una cadena HH:MM o HH:MM:SS
function timeStrToMinutes(t: string): number {
  return timeToMinutes(formatTime(t));
}

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
  const isToday    = isCurrentDay(dateISO);

  const [nowState, setNowState] = useState<{ percent: number | null; label: string; nowMins: number }>(() => {
    const now = new Date();
    return {
      percent: isToday ? getCurrentTimePosition(TIMELINE_START, TIMELINE_END) : null,
      label:   formatNowLabel(),
      nowMins: now.getHours() * 60 + now.getMinutes(),
    };
  });

  // Estado: mostrar horas pasadas o colapsarlas
  const [showPastHours, setShowPastHours] = useState(false);

  useEffect(() => {
    if (!isToday) {
      setNowState((s) => ({ ...s, percent: null }));
      return;
    }
    const update = () => {
      const now = new Date();
      setNowState({
        percent: getCurrentTimePosition(TIMELINE_START, TIMELINE_END),
        label:   formatNowLabel(),
        nowMins: now.getHours() * 60 + now.getMinutes(),
      });
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearTimeout(id);
  }, [isToday, dateISO]);

  // Scroll a la línea "Ahora" al cargar
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

  // ── Separar pasadas vs futuras ──────────────────────────────────────────────

  const nowMins = nowState.nowMins;

  // Huecos: filtrar pasados completamente si es hoy y no showPastHours
  const activeFutureSlots = isToday
    ? daySlots.filter((s) => timeStrToMinutes(s.end_time) > nowMins)
    : daySlots;
  const activePastSlots = isToday
    ? daySlots.filter((s) => timeStrToMinutes(s.end_time) <= nowMins)
    : [];

  // Citas pasadas: end_time < now (o si no hay end_time, start_time < now - 30min)
  const pastAppts = isToday
    ? dayAppointments.filter((a) => {
        const endMins = a.end_time
          ? timeStrToMinutes(a.end_time)
          : timeStrToMinutes(a.start_time) + (a.service?.duration_minutes ?? 30);
        return endMins < nowMins;
      })
    : [];

  // Citas futuras o en curso
  const futureAppts = isToday
    ? dayAppointments.filter((a) => {
        const endMins = a.end_time
          ? timeStrToMinutes(a.end_time)
          : timeStrToMinutes(a.start_time) + (a.service?.duration_minutes ?? 30);
        return endMins >= nowMins;
      })
    : dayAppointments;

  // Si no es hoy, mostrar todo
  const visibleAppts = (!isToday || showPastHours) ? dayAppointments : futureAppts;
  const visibleSlots = (!isToday || showPastHours) ? daySlots : activeFutureSlots;

  const groupedDaySlots = groupConsecutiveFreeSlots(visibleSlots);

  // Posición pixel de "ahora" en el timeline
  const nowPixels = isToday && nowState.percent !== null
    ? Math.round(nowState.percent * (TIMELINE_END - TIMELINE_START) * CELL_HEIGHT)
    : null;

  const totalHeight    = (TIMELINE_END - TIMELINE_START) * CELL_HEIGHT;
  const isEmpty        = dayAppointments.length === 0 && daySlots.length === 0;

  // KPIs — mostrar datos futuros/activos cuando es hoy
  const displayAppts   = isToday ? futureAppts : dayAppointments;
  const displaySlots   = isToday ? activeFutureSlots : daySlots;
  const estimatedRevenue = displayAppts.reduce((sum, a) => sum + Number(a.service?.price ?? 0), 0);

  // Resumen de horas anteriores
  const pastRevenue    = pastAppts.reduce((sum, a) => sum + Number(a.service?.price ?? 0), 0);
  const pastCompleted  = pastAppts.filter((a) => a.status === "completed").length;
  const pastPending    = pastAppts.filter((a) => ["scheduled", "confirmed", "pending"].includes(a.status)).length;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Mini KPIs ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-300 bg-[#FEFCF9] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            {isToday ? "Restantes" : "Reservas"}
          </p>
          <p className="mt-1.5 text-2xl font-black text-slate-900">{displayAppts.length}</p>
          {isToday && pastAppts.length > 0 && (
            <p className="mt-0.5 text-[10px] text-slate-400">{pastAppts.length} completadas</p>
          )}
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">
            {isToday ? "Huecos futuros" : "Huecos libres"}
          </p>
          <p className="mt-1.5 text-2xl font-black text-emerald-700">{groupConsecutiveFreeSlots(displaySlots).length}</p>
          <p className="mt-0.5 text-[10px] text-emerald-600">
            {groupConsecutiveFreeSlots(displaySlots).length > 0 ? "disponibles ahora" : "Agenda completa"}
          </p>
        </div>
        <div className="rounded-2xl border border-[#C9922A]/20 bg-[#C9922A]/5 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9922A]/80">
            {isToday ? "Pendiente" : (selectedBarberName ? "Barbero" : "Equipo")}
          </p>
          {isToday ? (
            <>
              <p className="mt-1.5 text-2xl font-black text-[#8A641F]">
                {estimatedRevenue > 0 ? `${estimatedRevenue}€` : "—"}
              </p>
              <p className="mt-0.5 text-[10px] text-[#C9922A]/70">estimado</p>
            </>
          ) : (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Users size={16} className="text-[#C9922A]" />
              <p className="text-2xl font-black text-[#8A641F]">
                {selectedBarberName ? 1 : barbers.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9922A]">
            Vista día · {selectedBarberName ?? "Todo el equipo"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {isToday
              ? `${futureAppts.length} cita${futureAppts.length !== 1 ? "s" : ""} restante${futureAppts.length !== 1 ? "s" : ""}`
              : `${dayAppointments.length} cita${dayAppointments.length !== 1 ? "s" : ""}`}
            {estimatedRevenue > 0 ? ` · ${estimatedRevenue}€ estimados` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle horas pasadas */}
          {isToday && pastAppts.length + activePastSlots.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPastHours((v) => !v)}
              className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-[11px] font-black transition active:scale-95 ${
                showPastHours
                  ? "border-slate-300 bg-slate-100 text-slate-700"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {showPastHours ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showPastHours ? "Ocultar pasadas" : `${pastAppts.length} horas anteriores`}
            </button>
          )}
          <button
            type="button"
            onClick={onNewAppointment}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 active:scale-95"
          >
            <CalendarPlus size={13} />
            Nueva reserva
          </button>
        </div>
      </div>

      {/* ── Alerta: citas pasadas sin cerrar ── */}
      {isToday && pastPending > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
          <p className="flex-1 text-xs font-semibold text-amber-800">
            {pastPending} cita{pastPending !== 1 ? "s" : ""} pasada{pastPending !== 1 ? "s" : ""} sin cerrar — márcalas como completadas o no-show.
          </p>
          <button
            type="button"
            onClick={() => setShowPastHours(true)}
            className="shrink-0 rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700 transition hover:bg-amber-200"
          >
            Ver
          </button>
        </div>
      )}

      {/* ── Timeline ── */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-300 bg-[#FEFCF8] shadow-[0_2px_16px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="flex">
          {/* Hour labels */}
          <div
            className="shrink-0 border-r border-slate-300 bg-[#EDE9DF]"
            style={{ width: 56, height: totalHeight }}
          >
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end pr-2.5 pt-1.5"
                style={{ height: CELL_HEIGHT }}
              >
                <span className={`text-xs font-black tabular-nums ${
                  isToday && h * 60 < nowMins ? "text-slate-400" : "text-slate-700"
                }`}>
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
                className="absolute inset-x-0 border-t border-slate-300"
                style={{ top: i * CELL_HEIGHT }}
              />
            ))}
            {/* Half-hour lines */}
            {HOURS.map((h, i) => (
              <div
                key={`half-${h}`}
                className="absolute inset-x-0 border-t border-slate-200"
                style={{ top: i * CELL_HEIGHT + CELL_HEIGHT / 2 }}
              />
            ))}

            {/* Overlay de horas pasadas — cubre el área antes de "Ahora" */}
            {isToday && !showPastHours && nowPixels !== null && nowPixels > 16 && (
              <div
                className="absolute inset-x-0 top-0 z-10 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-t-xl"
                style={{ height: nowPixels - 2 }}
              >
                {/* Fondo con textura sutil */}
                <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-[1px]" />
                {/* Patrón de líneas diagonales muy sutil */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(148,163,184,0.15) 8px, rgba(148,163,184,0.15) 9px)",
                  }}
                />
                {/* Contenido del overlay */}
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  {pastAppts.length > 0 ? (
                    <>
                      <p className="text-[11px] font-black text-slate-500">
                        {pastAppts.length} cita{pastAppts.length !== 1 ? "s" : ""} anteriores
                        {pastRevenue > 0 ? ` · ${pastRevenue}€` : ""}
                      </p>
                      {pastCompleted > 0 && (
                        <p className="text-[10px] text-slate-400">
                          {pastCompleted} completada{pastCompleted !== 1 ? "s" : ""}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPastHours(true)}
                        className="mt-1 flex items-center gap-1 rounded-xl border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-black text-slate-600 shadow-sm transition hover:border-slate-300 active:scale-95"
                      >
                        <ChevronDown size={11} /> Ver historial
                      </button>
                    </>
                  ) : nowPixels > 32 ? (
                    <p className="text-[11px] font-semibold text-slate-400">
                      Sin reservas en horas anteriores
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            {/* Línea "Ahora" — gold */}
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

            {/* Free slots (solo futuros si es hoy + no showPastHours) */}
            {groupedDaySlots.map((slot) => {
              const top    = minutesToTop(slot.start_time);
              const height = durationToHeight(slot.start_time, slot.end_time, 45);
              const durationMins =
                timeToMinutes(formatTime(slot.end_time)) -
                timeToMinutes(formatTime(slot.start_time));
              return (
                <div
                  key={`${slot.id}-grouped`}
                  className="absolute left-1 right-2 overflow-hidden rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70"
                  style={{ top: top + 1, height: Math.max(28, height - 2) }}
                >
                  <div className="flex h-full items-center justify-between gap-2 px-2.5">
                    <span className="flex min-w-0 items-center gap-1 truncate text-[10px] font-semibold text-emerald-700">
                      <Zap size={9} className="shrink-0 text-emerald-500" />
                      {slot.barber?.name ?? "Libre"} · {durationMins}min
                    </span>
                    {onFreeSlotBook && height > 36 ? (
                      <button
                        type="button"
                        onClick={() => onFreeSlotBook(slot)}
                        className="shrink-0 rounded-md border border-emerald-200 bg-white px-2 py-0.5 text-[9px] font-black text-emerald-700 transition hover:bg-emerald-50 active:scale-95"
                      >
                        + Reservar
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* Appointment cards */}
            {visibleAppts.map((appt, idx) => {
              const top    = minutesToTop(appt.start_time);
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-300">
              <Clock size={22} />
            </div>
            <div className="text-center">
              <p className="font-black text-slate-900">Día disponible</p>
              <p className="mt-1.5 text-xs leading-6 text-slate-500">
                Crea la primera cita o comparte tu link para recibir reservas online.
              </p>
            </div>
            <button
              type="button"
              onClick={onNewAppointment}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
              <CalendarPlus size={12} /> Crear primera cita
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile list ── */}
      {(dayAppointments.length > 0 || daySlots.length > 0) && (
        <div className="block space-y-2 pt-1 md:hidden">
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

          {visibleAppts.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} onClick={onAppointmentClick} />
          ))}
          {visibleSlots.map((slot) => (
            <FreeSlotCard key={slot.id} slot={slot} services={services} onBook={onFreeSlotBook} />
          ))}

          {/* Toggle en mobile */}
          {isToday && !showPastHours && pastAppts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPastHours(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-black text-slate-500 transition hover:border-slate-300"
            >
              <ChevronDown size={13} />
              Ver {pastAppts.length} cita{pastAppts.length !== 1 ? "s" : ""} anteriores
            </button>
          )}
          {isToday && showPastHours && pastAppts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPastHours(false)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-black text-slate-500 transition hover:border-slate-300"
            >
              <ChevronUp size={13} />
              Ocultar horas anteriores
            </button>
          )}
        </div>
      )}
    </div>
  );
}
