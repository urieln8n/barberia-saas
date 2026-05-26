"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { MonthDay, MonthData } from "@/src/lib/agenda/types";

const DAY_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function occupancyStyle(level: MonthDay["occupancyLevel"], isCurrentMonth: boolean) {
  if (!isCurrentMonth) return "bg-[#F8F8F6] text-[#080A0F]/20";
  switch (level) {
    case "high":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "medium":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "low":
      return "bg-red-50 text-red-600 ring-1 ring-red-200/60";
    default:
      return "bg-white text-[#080A0F]/40";
  }
}

function occupancyDot(level: MonthDay["occupancyLevel"]) {
  switch (level) {
    case "high":
      return "bg-emerald-500";
    case "medium":
      return "bg-amber-400";
    case "low":
      return "bg-red-400";
    default:
      return "bg-[#080A0F]/15";
  }
}

function money(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

type Props = {
  monthData: MonthData;
  onDayClick: (iso: string) => void;
};

export function MonthlyCalendarGrid({ monthData, onDayClick }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { monthDays, totalAppointments, totalRevenue, bestDay } = monthData;

  return (
    <div className="flex flex-col gap-4">
      {/* Month summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#080A0F]/8 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#080A0F]/40">
            Citas del mes
          </p>
          <p className="mt-1.5 text-3xl font-black text-[#080A0F]">
            {totalAppointments}
          </p>
        </div>
        <div className="rounded-2xl border border-[#D5A84C]/20 bg-[#D5A84C]/5 p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#B8892A]/70">
            Ingresos estimados
          </p>
          <p className="mt-1.5 text-3xl font-black text-[#080A0F]">
            {money(totalRevenue)}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">
            Mejor día
          </p>
          <p className="mt-1.5 text-xl font-black text-emerald-700">
            {bestDay
              ? new Date(`${bestDay.iso}T00:00:00`).toLocaleDateString(
                  "es-ES",
                  { weekday: "short", day: "numeric" },
                )
              : "—"}
          </p>
          {bestDay && (
            <p className="text-[10px] text-emerald-600/70">
              {bestDay.appointmentCount} citas
            </p>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-2xl border border-[#080A0F]/8 bg-white shadow-sm">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[#080A0F]/8 bg-[#F8F8F6]">
          {DAY_HEADERS.map((d) => (
            <div
              key={d}
              className="p-2 text-center text-[10px] font-black uppercase text-[#080A0F]/40"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {monthDays.map((day, idx) => {
            const isClickable = day.isCurrentMonth;
            const Tag = isClickable ? "button" : "div";

            return (
              <motion.div
                key={day.iso}
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: idx * 0.008 }}
              >
                <Tag
                  {...(isClickable
                    ? {
                        type: "button" as const,
                        onClick: () => onDayClick(day.iso),
                      }
                    : {})}
                  className={`
                    group relative flex min-h-[72px] w-full flex-col border-b border-r border-[#080A0F]/5 p-2 text-left
                    transition-all duration-150
                    ${isClickable ? "cursor-pointer hover:bg-[#F8F8F6] hover:shadow-sm" : "cursor-default"}
                    ${day.isToday ? "bg-[#D5A84C]/4 ring-2 ring-inset ring-[#D5A84C]/60" : ""}
                  `}
                >
                  {/* Day number */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`
                        flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black
                        ${day.isToday ? "bg-[#D5A84C] text-[#080A0F] shadow-[0_2px_8px_rgba(213,168,76,0.40)]" : ""}
                        ${!day.isCurrentMonth ? "text-[#080A0F]/20" : "text-[#080A0F]"}
                      `}
                    >
                      {day.dayNumber}
                    </span>
                    {day.isToday && (
                      <span className="rounded-full bg-[#D5A84C]/15 px-1.5 py-px text-[8px] font-black uppercase tracking-wide text-[#8A641F]">
                        Hoy
                      </span>
                    )}
                  </div>

                  {/* Activity indicators */}
                  {day.isCurrentMonth && day.appointmentCount > 0 && (
                    <div className="mt-1.5 flex flex-col gap-0.5">
                      {/* Count + revenue */}
                      <div
                        className={`
                          rounded-lg px-1.5 py-0.5 text-[9px] font-black
                          ${occupancyStyle(day.occupancyLevel, true)}
                        `}
                      >
                        {day.appointmentCount} cita{day.appointmentCount !== 1 ? "s" : ""}
                      </div>
                      {day.estimatedRevenue > 0 && (
                        <span className="pl-0.5 text-[9px] font-bold text-[#080A0F]/40">
                          ~{money(day.estimatedRevenue)}
                        </span>
                      )}
                    </div>
                  )}

                  {day.isCurrentMonth && day.appointmentCount === 0 && (
                    <div className="mt-1.5 rounded-lg bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-700 ring-1 ring-emerald-100">
                      Dia libre
                    </div>
                  )}

                  {/* Dot row for new clients */}
                  {day.isCurrentMonth && day.newClients > 0 && (
                    <div className="mt-1 flex items-center gap-0.5">
                      {Array.from({ length: Math.min(day.newClients, 3) }).map(
                        (_, i) => (
                          <span
                            key={i}
                            className="h-1 w-1 rounded-full bg-[#38BDF8]"
                            title="Cliente nuevo"
                          />
                        ),
                      )}
                    </div>
                  )}

                  {/* Hover: "ver día" hint */}
                  {isClickable && (
                    <span className="absolute bottom-1 right-1.5 hidden text-[8px] font-black text-[#D5A84C] group-hover:block">
                      ver dia
                    </span>
                  )}
                </Tag>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-[#080A0F]/50">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Día activo
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Día medio
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-400" /> Día flojo
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#38BDF8]" /> Clientes nuevos
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-[#D5A84C]" /> Hoy
        </span>
        <span className="ml-auto text-[9px] text-[#080A0F]/35">
          Haz clic en un día activo para ver en detalle
        </span>
      </div>
    </div>
  );
}
