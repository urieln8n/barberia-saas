"use client";

import { CalendarPlus, Euro, TrendingUp } from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import { formatTime, isActiveAppointment, timeToMinutes } from "@/src/lib/agenda/agenda-utils";
import { getMadridNow, getCurrentTimeHHMM } from "@/src/lib/agenda/time-position";
import type { AgendaAppointment, AgendaDay, AgendaService, FreeSlot } from "@/src/lib/agenda/types";
import { AppointmentCard } from "./AppointmentCard";
import { FreeSlotCard } from "./FreeSlotCard";

const BUSINESS_MINUTES = 11 * 60; // 09:00–20:00

type Props = {
  days: AgendaDay[];
  appointments: AgendaAppointment[];
  freeSlots: FreeSlot[];
  services?: AgendaService[];
  selectedDay: string;
  onSelectedDayChange: (day: string) => void;
  onAppointmentClick: (appointment: AgendaAppointment) => void;
  onFreeSlotBook?: (slot: FreeSlot) => void;
  onEmptySlotClick?: (day: string, hour: string) => void;
};

function getHour(time: string) {
  return formatTime(time).slice(0, 2);
}

function getVisibleHours(appointments: AgendaAppointment[], freeSlots: FreeSlot[]) {
  const starts = [
    9 * 60,
    ...appointments.map((a) => timeToMinutes(formatTime(a.start_time))),
    ...freeSlots.map((s) => timeToMinutes(formatTime(s.start_time))),
  ];
  const ends = [
    20 * 60,
    ...appointments.map((a) => timeToMinutes(formatTime(a.end_time ?? a.start_time))),
    ...freeSlots.map((s) => timeToMinutes(formatTime(s.end_time))),
  ];
  const startHour = Math.max(0, Math.floor(Math.min(...starts) / 60));
  const endHour = Math.min(24, Math.ceil(Math.max(...ends) / 60));
  return generateTimeSlots(startHour, endHour, 60).map((s) => s.time);
}

function getCurrentMinuteOffset(hour: string): { pct: number; label: string } | null {
  const now = getMadridNow();
  if (now.getHours() !== Number(getHour(hour))) return null;
  return { pct: (now.getMinutes() / 60) * 100, label: `Ahora · ${getCurrentTimeHHMM()}` };
}

function isPastCell(dayIso: string, hour: string): boolean {
  const now = getMadridNow();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (dayIso < todayIso) return true;
  if (dayIso > todayIso) return false;
  return Number(getHour(hour)) < now.getHours();
}

function getDayOccupancyPct(appts: AgendaAppointment[]): number {
  const active = appts.filter(isActiveAppointment);
  const mins = active.reduce((s, a) => s + (a.service?.duration_minutes ?? 30), 0);
  return Math.min(100, Math.round((mins / BUSINESS_MINUTES) * 100));
}

function money(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function WeeklyCalendarGrid({
  days,
  appointments,
  freeSlots,
  services = [],
  selectedDay,
  onSelectedDayChange,
  onAppointmentClick,
  onFreeSlotBook,
  onEmptySlotClick,
}: Props) {
  const hours = getVisibleHours(appointments, freeSlots);
  const selectedDayAppointments = appointments.filter((a) => a.appointment_date === selectedDay);
  const selectedDaySlots = freeSlots.filter((s) => s.date === selectedDay);

  // Weekly totals
  const weekRevenue = appointments
    .filter(isActiveAppointment)
    .reduce((s, a) => s + (a.service?.price ?? 0), 0);
  const weekAppointments = appointments.filter(isActiveAppointment).length;
  const weekFreeSlots = freeSlots.length;

  // Week date range label
  const weekRangeLabel =
    days.length > 0
      ? (() => {
          const first = days[0];
          const last = days[days.length - 1];
          const lastDate = new Date(`${last.iso}T00:00:00`);
          const month = lastDate.toLocaleDateString("es-ES", { month: "long" });
          return `${first.dayNumber} — ${last.dayNumber} ${month}`;
        })()
      : "";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ── Header ── */}
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#C9922A]">
              Vista semana
            </p>
            <h2 className="mt-0.5 text-lg font-black text-slate-900">
              Agenda semanal
            </h2>
            {weekRangeLabel && (
              <p className="mt-0.5 text-xs font-semibold text-slate-400">{weekRangeLabel}</p>
            )}
          </div>

          {/* Weekly summary chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm">
              <TrendingUp size={12} className="text-slate-400" />
              <span className="text-[11px] font-black tabular-nums text-slate-900">
                {weekAppointments}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">reservas</span>
            </div>
            {weekRevenue > 0 && (
              <div className="flex items-center gap-1.5 rounded-xl border border-[#C9922A]/25 bg-[#C9922A]/8 px-3 py-1.5 shadow-sm">
                <Euro size={12} className="text-[#C9922A]" />
                <span className="text-[11px] font-black tabular-nums text-[#8A641F]">
                  {money(weekRevenue)}
                </span>
                <span className="text-[11px] font-semibold text-[#C9922A]/70">estimado</span>
              </div>
            )}
            {weekFreeSlots > 0 && (
              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                <CalendarPlus size={12} className="text-emerald-500" />
                <span className="text-[11px] font-black tabular-nums text-emerald-700">
                  {weekFreeSlots}
                </span>
                <span className="text-[11px] font-semibold text-emerald-500/70">huecos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE: day tabs + vertical list ── */}
      <div className="block md:hidden">
        <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200 p-3">
          {days.map((day) => {
            const dayAppts = appointments.filter((a) => a.appointment_date === day.iso);
            const activeCount = dayAppts.filter(isActiveAppointment).length;
            const isSelected = selectedDay === day.iso;
            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => onSelectedDayChange(day.iso)}
                className={`relative min-w-[68px] rounded-2xl border px-2.5 py-2.5 text-center transition-all ${
                  isSelected
                    ? "border-[#D4AF37]/40 bg-[#D4AF37] text-[#070707] shadow-sm"
                    : day.isToday
                    ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#B88917]"
                    : "border-[#1e1e1e] bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <span className="block text-[10px] font-black uppercase tracking-wide">
                  {day.shortLabel}
                </span>
                <span className="mt-0.5 block text-[18px] font-black leading-none">{day.dayNumber}</span>
                {activeCount > 0 && (
                  <span
                    className={`mt-1 inline-block rounded-full px-1.5 py-px text-[9px] font-black ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#D4AF37]/20 text-[#D4AF37]"
                    }`}
                  >
                    {activeCount}
                  </span>
                )}
                {day.isToday && !isSelected && (
                  <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D4AF37]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-3 p-4">
          {selectedDayAppointments.length === 0 && selectedDaySlots.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <CalendarPlus size={18} className="text-emerald-500" />
              </div>
              <p className="font-black text-slate-900">Día disponible</p>
              <p className="mt-1 text-sm text-emerald-600">
                Sin reservas. Crea una cita para llenar este día.
              </p>
            </div>
          ) : null}

          {selectedDayAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onClick={onAppointmentClick}
            />
          ))}

          {selectedDaySlots.map((slot) => (
            <FreeSlotCard
              key={slot.id}
              slot={slot}
              services={services}
              onBook={onFreeSlotBook}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP: 7-column time grid ── */}
      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[1000px]">

          {/* Column headers */}
          <div className="grid grid-cols-[72px_repeat(7,minmax(132px,1fr))] border-b border-slate-200">
            <div className="flex items-center justify-center bg-slate-50 p-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Hora
              </span>
            </div>

            {days.map((day) => {
              const dayAppts = appointments.filter((a) => a.appointment_date === day.iso);
              const daySlots = freeSlots.filter((s) => s.date === day.iso);
              const activeAppts = dayAppts.filter(isActiveAppointment);
              const dayRevenue = activeAppts.reduce((s, a) => s + (a.service?.price ?? 0), 0);
              const occupancyPct = getDayOccupancyPct(dayAppts);

              return (
                <div
                  key={day.iso}
                  onClick={() => onSelectedDayChange(day.iso)}
                  className={`relative cursor-pointer border-l border-slate-200 p-3 transition-colors hover:bg-slate-50 ${
                    day.isToday ? "bg-[#C9922A]/5" : "bg-white"
                  }`}
                >
                  {day.isToday && (
                    <span className="mb-1.5 inline-block rounded-full bg-[#C9922A] px-2 py-px text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                      Hoy
                    </span>
                  )}
                  <p className={`text-[11px] font-black uppercase tracking-wide ${
                    day.isToday ? "text-[#C9922A]" : "text-slate-400"
                  }`}>
                    {day.label}
                  </p>
                  <p className={`mt-0.5 text-2xl font-black tabular-nums leading-none ${
                    day.isToday ? "text-[#8A641F]" : "text-slate-900"
                  }`}>
                    {day.dayNumber}
                  </p>

                  {/* Day summary */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {activeAppts.length > 0 && (
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-600">
                        {activeAppts.length} cita{activeAppts.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {dayRevenue > 0 && (
                      <span className="rounded-full border border-[#C9922A]/30 bg-[#C9922A]/10 px-1.5 py-0.5 text-[9px] font-black text-[#8A641F]">
                        ~{money(dayRevenue)}
                      </span>
                    )}
                    {daySlots.length > 0 && activeAppts.length === 0 && (
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black text-emerald-700">
                        {daySlots.length} libre{daySlots.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Occupancy bar */}
                  <div className="absolute inset-x-0 bottom-0 h-[3px] bg-slate-100">
                    <div
                      className={`h-full transition-all ${
                        occupancyPct >= 70 ? "bg-emerald-500"
                        : occupancyPct >= 40 ? "bg-[#C9922A]"
                        : occupancyPct > 0 ? "bg-amber-300"
                        : ""
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time rows */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid min-h-[148px] grid-cols-[72px_repeat(7,minmax(132px,1fr))] border-b border-slate-100 last:border-b-0"
            >
              {/* Hour label */}
              <div className="flex items-start justify-end bg-slate-50 px-3 pt-2">
                <span className="text-[11px] font-black tabular-nums text-slate-400">{hour}</span>
              </div>

              {/* Day cells */}
              {days.map((day) => {
                const hourAppts = appointments.filter(
                  (a) => a.appointment_date === day.iso && getHour(a.start_time) === getHour(hour),
                );
                const hourSlots = freeSlots.filter(
                  (s) => s.date === day.iso && getHour(s.start_time) === getHour(hour),
                );
                const isEmpty = hourAppts.length === 0 && hourSlots.length === 0;
                const nowOffset = day.isToday ? getCurrentMinuteOffset(hour) : null;
                const past = isPastCell(day.iso, hour);

                return (
                  <div
                    key={`${day.iso}-${hour}`}
                    className={`relative space-y-1.5 border-l border-slate-100 p-1.5 ${
                      day.isToday && !past ? "bg-[#D4AF37]/[0.025]" : ""
                    }`}
                  >
                    {/* "Ahora" line */}
                    {nowOffset !== null ? (
                      <div
                        className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                        style={{ top: `${nowOffset.pct}%` }}
                      >
                        <span className="ml-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#D4AF37] shadow-[0_0_0_3px_rgba(212,175,55,0.22)]" />
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37]/15 shadow-[0_1px_4px_rgba(212,175,55,0.30)]" />
                        <span className="mr-1 shrink-0 rounded-full bg-[#D4AF37] px-2 py-px text-[9px] font-black text-white shadow-sm">
                          {nowOffset.label}
                        </span>
                      </div>
                    ) : null}

                    {/* Appointments */}
                    {hourAppts.map((appt) => (
                      <AppointmentCard
                        key={appt.id}
                        appointment={appt}
                        compact
                        onClick={onAppointmentClick}
                      />
                    ))}

                    {/* Free slots */}
                    {hourSlots.map((slot) => (
                      <FreeSlotCard
                        key={slot.id}
                        slot={slot}
                        services={services}
                        compact
                        onBook={onFreeSlotBook}
                      />
                    ))}

                    {/* Empty cell — invisible until hover */}
                    {isEmpty && !past && (
                      <button
                        type="button"
                        onClick={() => onEmptySlotClick?.(day.iso, hour)}
                        aria-label={`Crear cita a las ${hour} — ${day.label} ${day.dayNumber}`}
                        className="group flex min-h-[120px] w-full items-center justify-center rounded-xl transition-colors hover:bg-slate-50/80 active:bg-slate-100/60"
                      >
                        <span className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <CalendarPlus size={11} className="text-slate-400" />
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                            {hour}
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Footer summary */}
          <div className="grid grid-cols-[72px_repeat(7,minmax(132px,1fr))] border-t border-[#1e1e1e] bg-[#0f0f0f]">
            <div className="p-3" />
            {days.map((day) => {
              const dayAppts = appointments.filter((a) => a.appointment_date === day.iso);
              const active = dayAppts.filter(isActiveAppointment);
              const rev = active.reduce((s, a) => s + (a.service?.price ?? 0), 0);
              const slots = freeSlots.filter((s) => s.date === day.iso).length;
              return (
                <div key={day.iso} className="border-l border-[#1a1a1a] px-3 py-2">
                  {active.length > 0 ? (
                    <p className="text-[10px] font-black text-[#666]">
                      {active.length} cita{active.length !== 1 ? "s" : ""}
                      {rev > 0 ? ` · ${money(rev)}` : ""}
                    </p>
                  ) : (
                    <p className="text-[10px] font-semibold text-[#444]">Sin reservas</p>
                  )}
                  {slots > 0 && (
                    <p className="text-[10px] font-semibold text-[#22C55E]">
                      {slots} hueco{slots !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
