"use client";

import { CalendarPlus } from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import { formatTime, timeToMinutes } from "@/src/lib/agenda/agenda-utils";
import { getMadridNow, getCurrentTimeHHMM } from "@/src/lib/agenda/time-position";
import type { AgendaAppointment, AgendaDay, AgendaService, FreeSlot } from "@/src/lib/agenda/types";
import { AppointmentCard } from "./AppointmentCard";
import { FreeSlotCard } from "./FreeSlotCard";

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
    ...appointments.map((appointment) => timeToMinutes(formatTime(appointment.start_time))),
    ...freeSlots.map((slot) => timeToMinutes(formatTime(slot.start_time))),
  ];
  const ends = [
    20 * 60,
    ...appointments.map((appointment) => timeToMinutes(formatTime(appointment.end_time ?? appointment.start_time))),
    ...freeSlots.map((slot) => timeToMinutes(formatTime(slot.end_time))),
  ];

  const startHour = Math.max(0, Math.floor(Math.min(...starts) / 60));
  const endHour = Math.min(24, Math.ceil(Math.max(...ends) / 60));

  return generateTimeSlots(startHour, endHour, 60).map((slot) => slot.time);
}

function getCurrentMinuteOffset(hour: string): { pct: number; label: string } | null {
  const now = getMadridNow();
  const currentHour = now.getHours();
  const rowHour = Number(getHour(hour));
  if (currentHour !== rowHour) return null;
  return {
    pct: (now.getMinutes() / 60) * 100,
    label: `Ahora · ${getCurrentTimeHHMM()}`,
  };
}

function isPastCell(dayIso: string, hour: string): boolean {
  const now = getMadridNow();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (dayIso < todayIso) return true;
  if (dayIso > todayIso) return false;
  return Number(getHour(hour)) < now.getHours();
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
  const selectedDaySlots = freeSlots.filter((slot) => slot.date === selectedDay);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-950">Calendario semanal</h2>
            <p className="text-sm font-medium text-slate-500">
              Verde = disponible · Clic en celda para reservar.
            </p>
          </div>
          <div className="hidden items-center gap-3 text-xs font-bold sm:flex">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Libre
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-800" />
              Cita
            </span>
            <span className="flex items-center gap-1.5 text-[#B8892A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D5A84C]" />
              Hueco
            </span>
          </div>
        </div>
      </div>

      {/* ── MOBILE: day tabs + vertical list ── */}
      <div className="block md:hidden">
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-3">
          {days.map((day) => (
            <button
              key={day.iso}
              type="button"
              onClick={() => onSelectedDayChange(day.iso)}
              className={`min-w-[72px] rounded-xl border px-3 py-2 text-center transition ${
                selectedDay === day.iso
                  ? "border-slate-950 bg-slate-950 text-white"
                  : day.isToday
                  ? "border-[#D5A84C] bg-[#D5A84C]/10 text-[#B8892A]"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <span className="block text-[11px] font-black uppercase">{day.shortLabel}</span>
              <span className="block text-lg font-black">{day.dayNumber}</span>
            </button>
          ))}
        </div>

        <div className="space-y-3 p-4">
          {selectedDayAppointments.length === 0 && selectedDaySlots.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-5 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <CalendarPlus size={18} className="text-emerald-600" />
              </div>
              <p className="font-black text-emerald-800">Día disponible</p>
              <p className="mt-1 text-sm text-emerald-700/70">
                Sin reservas. Crea una cita o comparte el link para recibir reservas online.
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
        <div className="min-w-[980px]">
          {/* Header row */}
          <div className="grid grid-cols-[76px_repeat(7,minmax(128px,1fr))] border-b border-slate-200">
            <div className="bg-slate-50 p-3 text-xs font-black uppercase tracking-wide text-slate-500">
              Hora
            </div>
            {days.map((day) => {
              const dayAppts = appointments.filter((a) => a.appointment_date === day.iso);
              const daySlots = freeSlots.filter((slot) => slot.date === day.iso);
              return (
                <div
                  key={day.iso}
                  className={`border-l border-slate-200 p-3 ${day.isToday ? "bg-[#D5A84C]/10" : "bg-slate-50"}`}
                >
                  {day.isToday && (
                    <span className="mb-1 inline-block rounded-full bg-[#D5A84C] px-2 py-px text-[9px] font-black uppercase tracking-widest text-white">
                      Hoy
                    </span>
                  )}
                  <p className={`text-xs font-black uppercase tracking-wide ${day.isToday ? "text-[#B8892A]" : "text-slate-500"}`}>
                    {day.label}
                  </p>
                  <p className={`mt-1 text-xl font-black ${day.isToday ? "text-[#B8892A]" : "text-slate-950"}`}>
                    {day.dayNumber}
                  </p>
                  {/* Day occupancy summary */}
                  <div className="mt-1.5 flex gap-1">
                    {dayAppts.length > 0 && (
                      <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[9px] font-black text-white">
                        {dayAppts.length} citas
                      </span>
                    )}
                    {daySlots.length > 0 && (
                      <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                        {daySlots.length} libres
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time rows */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid min-h-[120px] grid-cols-[76px_repeat(7,minmax(128px,1fr))] border-b border-slate-100 last:border-b-0"
            >
              {/* Hour label */}
              <div className="flex flex-col items-center justify-start bg-slate-50 p-3">
                <span className="text-xs font-black text-slate-500">{hour}</span>
              </div>

              {/* Day cells */}
              {days.map((day) => {
                const hourAppointments = appointments.filter(
                  (a) => a.appointment_date === day.iso && getHour(a.start_time) === getHour(hour),
                );
                const hourSlots = freeSlots.filter(
                  (slot) => slot.date === day.iso && getHour(slot.start_time) === getHour(hour),
                );
                const isEmpty = hourAppointments.length === 0 && hourSlots.length === 0;
                const nowOffset = day.isToday ? getCurrentMinuteOffset(hour) : null;

                return (
                  <div
                    key={`${day.iso}-${hour}`}
                    className={`relative space-y-1.5 border-l border-slate-100 p-1.5 transition-colors duration-100 ${
                      isEmpty && day.isToday ? "bg-emerald-50/20" : ""
                    }`}
                  >
                    {/* "Ahora" line with time label */}
                    {nowOffset !== null ? (
                      <div
                        className="pointer-events-none absolute inset-x-0 z-20 flex items-center gap-0"
                        style={{ top: `${nowOffset.pct}%` }}
                      >
                        <span className="ml-0.5 h-2 w-2 shrink-0 rounded-full bg-[#D5A84C] shadow-[0_0_0_2px_rgba(213,168,76,0.25)]" />
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-[#D5A84C] to-[#D5A84C]/20" />
                        <span className="mr-1 rounded-full bg-[#D5A84C] px-1.5 py-px text-[9px] font-black text-white shadow-sm">
                          {nowOffset.label}
                        </span>
                      </div>
                    ) : null}

                    {/* Appointments */}
                    {hourAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        compact
                        onClick={onAppointmentClick}
                      />
                    ))}

                    {/* Detected free slots */}
                    {hourSlots.map((slot) => (
                      <FreeSlotCard
                        key={slot.id}
                        slot={slot}
                        services={services}
                        compact
                        onBook={onFreeSlotBook}
                      />
                    ))}

                    {/* Empty cell → green "Disponible" or greyed-out past */}
                    {isEmpty ? (
                      isPastCell(day.iso, hour) ? (
                        <div className="flex w-full flex-col items-center justify-center gap-1 rounded-lg px-2 py-3 text-center">
                          <span className="text-[9px] font-black uppercase tracking-wide text-slate-300">
                            Pasado
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onEmptySlotClick?.(day.iso, hour)}
                          aria-label={`Reservar hueco a las ${hour} — ${day.label} ${day.dayNumber}`}
                          className="group flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-emerald-200/80 bg-emerald-50/50 px-2 py-3 text-center transition-colors duration-150 hover:border-emerald-300 hover:bg-emerald-100/70 active:scale-[0.98]"
                        >
                          <CalendarPlus
                            size={14}
                            className="text-emerald-400 transition-colors group-hover:text-emerald-600"
                          />
                          <span className="text-[9px] font-black uppercase tracking-wide text-emerald-500 group-hover:text-emerald-700">
                            Disponible
                          </span>
                        </button>
                      )
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
