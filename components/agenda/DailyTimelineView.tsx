"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus, Clock, Zap } from "lucide-react";
import { formatTime, timeToMinutes } from "@/src/lib/agenda/agenda-utils";
import type { AgendaAppointment, FreeSlot } from "@/src/lib/agenda/types";
import { AppointmentCard } from "./AppointmentCard";
import { FreeSlotCard } from "./FreeSlotCard";

const TIMELINE_START = 9; // 09:00
const TIMELINE_END = 20; // 20:00
const CELL_HEIGHT = 64; // px per hour

function minutesToTop(timeStr: string): number {
  const mins = timeToMinutes(formatTime(timeStr));
  const offset = mins - TIMELINE_START * 60;
  return Math.max(0, (offset / 60) * CELL_HEIGHT);
}

function durationToHeight(start: string, end: string | null, durationMin: number): number {
  if (end) {
    const diff = timeToMinutes(formatTime(end)) - timeToMinutes(formatTime(start));
    return Math.max(48, (Math.min(diff, 120) / 60) * CELL_HEIGHT);
  }
  return Math.max(48, (Math.min(durationMin, 120) / 60) * CELL_HEIGHT);
}

const HOURS = Array.from(
  { length: TIMELINE_END - TIMELINE_START },
  (_, i) => TIMELINE_START + i,
);

type Props = {
  dateISO: string;
  appointments: AgendaAppointment[];
  freeSlots: FreeSlot[];
  onAppointmentClick: (a: AgendaAppointment) => void;
  onNewAppointment: () => void;
};

export function DailyTimelineView({
  dateISO,
  appointments,
  freeSlots,
  onAppointmentClick,
  onNewAppointment,
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  const dayAppointments = appointments
    .filter((a) => a.appointment_date === dateISO)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  const daySlots = freeSlots
    .filter((s) => s.date === dateISO)
    .slice(0, 8);

  const totalHeight = (TIMELINE_END - TIMELINE_START) * CELL_HEIGHT;

  const isEmpty = dayAppointments.length === 0 && daySlots.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#D5A84C]">
            Vista día
          </p>
          <p className="text-xs text-[#080A0F]/50">
            {dayAppointments.length} cita{dayAppointments.length !== 1 ? "s" : ""} ·{" "}
            {daySlots.length} hueco{daySlots.length !== 1 ? "s" : ""} libre{daySlots.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onNewAppointment}
          className="flex items-center gap-1.5 rounded-2xl bg-[#080A0F] px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-[#1a1d26] active:scale-95"
        >
          <Plus size={13} />
          Nueva reserva
        </button>
      </div>

      {/* Timeline grid */}
      <div className="relative overflow-hidden rounded-2xl border border-[#080A0F]/8 bg-white shadow-sm">
        <div className="flex">
          {/* Hour labels */}
          <div
            className="shrink-0 border-r border-[#080A0F]/6"
            style={{ width: 56, height: totalHeight }}
          >
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end pr-2 pt-1"
                style={{ height: CELL_HEIGHT }}
              >
                <span className="text-[10px] font-bold text-[#080A0F]/35">
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
                className="absolute inset-x-0 border-t border-[#080A0F]/5"
                style={{ top: i * CELL_HEIGHT }}
              />
            ))}

            {/* Half-hour lines */}
            {HOURS.map((h, i) => (
              <div
                key={`half-${h}`}
                className="absolute inset-x-0 border-t border-[#080A0F]/[0.03]"
                style={{ top: i * CELL_HEIGHT + CELL_HEIGHT / 2 }}
              />
            ))}

            {/* Free slot hints */}
            {daySlots.map((slot) => {
              const top = minutesToTop(slot.start_time);
              const height = durationToHeight(slot.start_time, slot.end_time, 45);
              return (
                <div
                  key={slot.id}
                  className="absolute left-0 right-3 rounded-xl border border-dashed border-[#D5A84C]/30 bg-[#D5A84C]/5 px-2"
                  style={{ top: top + 2, height: height - 4 }}
                >
                  <div className="flex items-center gap-1 pt-1">
                    <Zap size={10} className="text-[#D5A84C]" />
                    <span className="text-[9px] font-black text-[#B8892A]">
                      {formatTime(slot.start_time)} · {slot.barber?.name ?? "Libre"}
                    </span>
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
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className="absolute left-1 right-1"
                  style={{ top: top + 2, height: height - 4 }}
                >
                  <div className="h-full overflow-hidden rounded-xl shadow-sm">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#080A0F]/10 bg-[#F8F8F6]">
              <Clock size={20} className="text-[#080A0F]/30" />
            </div>
            <div className="text-center">
              <p className="font-black text-[#080A0F]">Día sin citas</p>
              <p className="mt-1 text-xs text-[#080A0F]/50">
                Cuando entren reservas, aparecerán aquí en timeline vertical.
              </p>
            </div>
            <button
              type="button"
              onClick={onNewAppointment}
              className="mt-1 flex items-center gap-1.5 rounded-2xl border border-[#080A0F]/12 bg-[#F8F8F6] px-4 py-2 text-xs font-black text-[#080A0F]/70 transition hover:bg-[#D5A84C]/8 hover:text-[#080A0F]"
            >
              <Plus size={12} /> Crear cita
            </button>
          </div>
        )}
      </div>

      {/* Mobile compact list fallback (shown when grid is too narrow) */}
      {dayAppointments.length > 0 && (
        <div className="block md:hidden space-y-2 pt-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#080A0F]/40">
            Lista del día
          </p>
          {dayAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onClick={onAppointmentClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
