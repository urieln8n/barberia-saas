"use client";

import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import { formatTime } from "@/src/lib/agenda/agenda-utils";
import type { AgendaAppointment, AgendaDay, FreeSlot } from "@/src/lib/agenda/types";
import { AppointmentCard } from "./AppointmentCard";
import { FreeSlotCard } from "./FreeSlotCard";

type Props = {
  days: AgendaDay[];
  appointments: AgendaAppointment[];
  freeSlots: FreeSlot[];
  selectedDay: string;
  onSelectedDayChange: (day: string) => void;
  onAppointmentClick: (appointment: AgendaAppointment) => void;
};

const HOURS = generateTimeSlots(9, 19, 60).map((slot) => slot.time);

function getHour(time: string) {
  return formatTime(time).slice(0, 2);
}

export function WeeklyCalendarGrid({
  days,
  appointments,
  freeSlots,
  selectedDay,
  onSelectedDayChange,
  onAppointmentClick,
}: Props) {
  const selectedDayAppointments = appointments.filter((appointment) => appointment.appointment_date === selectedDay);
  const selectedDaySlots = freeSlots.filter((slot) => slot.date === selectedDay).slice(0, 6);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-950">Calendario semanal</h2>
            <p className="text-sm font-medium text-slate-500">Columnas por dia, filas por hora y huecos utiles visibles.</p>
          </div>
        </div>
      </div>

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
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
              <p className="font-black text-slate-900">Dia sin citas visibles</p>
              <p className="mt-1 text-sm text-slate-500">Cuando entren reservas, apareceran aqui en timeline vertical.</p>
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
            <FreeSlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[76px_repeat(7,minmax(128px,1fr))] border-b border-slate-200">
            <div className="bg-slate-50 p-3 text-xs font-black uppercase tracking-wide text-slate-500">Hora</div>
            {days.map((day) => (
              <div key={day.iso} className={`border-l border-slate-200 p-3 ${day.isToday ? "bg-[#D5A84C]/10" : "bg-slate-50"}`}>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">{day.label}</p>
                <p className="mt-1 text-xl font-black text-slate-950">{day.dayNumber}</p>
              </div>
            ))}
          </div>

          {HOURS.map((hour) => (
            <div key={hour} className="grid min-h-[132px] grid-cols-[76px_repeat(7,minmax(128px,1fr))] border-b border-slate-100 last:border-b-0">
              <div className="bg-slate-50 p-3 text-xs font-black text-slate-500">{hour}</div>
              {days.map((day) => {
                const hourAppointments = appointments.filter(
                  (appointment) => appointment.appointment_date === day.iso && getHour(appointment.start_time) === getHour(hour),
                );
                const hourSlots = freeSlots.filter(
                  (slot) => slot.date === day.iso && getHour(slot.start_time) === getHour(hour),
                ).slice(0, 1);

                return (
                  <div key={`${day.iso}-${hour}`} className="space-y-2 border-l border-slate-100 p-2">
                    {hourAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        compact
                        onClick={onAppointmentClick}
                      />
                    ))}
                    {hourSlots.map((slot) => (
                      <FreeSlotCard key={slot.id} slot={slot} compact />
                    ))}
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
