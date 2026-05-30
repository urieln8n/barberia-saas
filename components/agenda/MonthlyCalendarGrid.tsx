"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, Scissors, TrendingDown, TrendingUp } from "lucide-react";
import type { MonthDay, MonthData } from "@/src/lib/agenda/types";

const DAY_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function money(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function occupancyBarColor(level: MonthDay["occupancyLevel"]) {
  switch (level) {
    case "high":   return "bg-emerald-500";
    case "medium": return "bg-[#D4AF37]";
    case "low":    return "bg-amber-400";
    default:       return "bg-transparent";
  }
}

function occupancyBarWidth(level: MonthDay["occupancyLevel"]) {
  switch (level) {
    case "high":   return "w-full";
    case "medium": return "w-2/3";
    case "low":    return "w-1/3";
    default:       return "w-0";
  }
}

function cellBaseBg(
  level: MonthDay["occupancyLevel"],
  isCurrentMonth: boolean,
  isToday: boolean,
) {
  if (!isCurrentMonth) return "bg-[#F4F3F0]";
  if (isToday) return "bg-[#D4AF37]/6";
  switch (level) {
    case "high":   return "bg-emerald-50/50";
    case "medium": return "bg-amber-50/30";
    case "low":    return "bg-rose-50/20";
    default:       return "bg-white";
  }
}

function appointmentBadgeStyle(level: MonthDay["occupancyLevel"]) {
  switch (level) {
    case "high":   return "bg-emerald-100 text-emerald-700";
    case "medium": return "bg-[#D4AF37]/15 text-[#8A641F]";
    case "low":    return "bg-amber-100 text-amber-700";
    default:       return "bg-[#080A0F]/6 text-[#080A0F]/50";
  }
}

function chunkWeeks(days: MonthDay[]): MonthDay[][] {
  const weeks: MonthDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

type Props = {
  monthData: MonthData;
  onDayClick: (iso: string) => void;
};

export function MonthlyCalendarGrid({ monthData, onDayClick }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { monthDays, totalAppointments, totalRevenue, bestDay } = monthData;

  const currentMonthDays = monthDays.filter((d) => d.isCurrentMonth);
  const emptyDays = currentMonthDays.filter((d) => d.occupancyLevel === "empty").length;

  const firstCurrentDay = currentMonthDays[0];
  const monthLabel = firstCurrentDay
    ? new Date(`${firstCurrentDay.iso}T00:00:00`).toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      })
    : "";

  const weeks = chunkWeeks(monthDays);

  return (
    <div className="flex flex-col gap-4">
      {/* Month label + badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black capitalize tracking-tight text-[#080A0F]">
          {monthLabel}
        </h2>
        <span className="rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/8 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#8A641F]">
          Vista Mes
        </span>
      </div>

      {/* 4 summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {/* Citas del mes */}
        <div className="rounded-2xl border border-[#080A0F]/8 bg-white p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5">
            <Scissors size={11} className="text-[#080A0F]/35" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#080A0F]/40">
              Citas del mes
            </p>
          </div>
          <p className="text-3xl font-black text-[#080A0F]">{totalAppointments}</p>
        </div>

        {/* Ingresos estimados */}
        <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5">
            <TrendingUp size={11} className="text-[#B88917]/70" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#B88917]/70">
              Ingresos est.
            </p>
          </div>
          <p className="text-3xl font-black text-[#080A0F]">{money(totalRevenue)}</p>
        </div>

        {/* Mejor día */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5">
            <CalendarCheck size={11} className="text-emerald-600/70" />
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">
              Mejor día
            </p>
          </div>
          <p className="text-xl font-black capitalize text-emerald-700">
            {bestDay
              ? new Date(`${bestDay.iso}T00:00:00`).toLocaleDateString("es-ES", {
                  weekday: "short",
                  day: "numeric",
                })
              : "—"}
          </p>
          {bestDay && (
            <p className="mt-0.5 text-[10px] text-emerald-600/70">
              {bestDay.appointmentCount} citas · {money(bestDay.estimatedRevenue)}
            </p>
          )}
        </div>

        {/* Días sin citas */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5">
            <TrendingDown size={11} className="text-rose-400/70" />
            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400/70">
              Días sin citas
            </p>
          </div>
          <p className="text-3xl font-black text-[#080A0F]">{emptyDays}</p>
          <p className="mt-0.5 text-[10px] text-rose-400/70">hueco de llenado</p>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-2xl border border-[#080A0F]/8 bg-white shadow-sm">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b border-[#080A0F]/8 bg-[#F5F3EE]">
          {DAY_HEADERS.map((d) => (
            <div
              key={d}
              className="p-2.5 text-center text-[10px] font-black uppercase tracking-wider text-[#080A0F]/40"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Week rows */}
        {weeks.map((week, weekIdx) => (
          <div
            key={weekIdx}
            className="grid grid-cols-7 border-b border-[#080A0F]/5 last:border-b-0"
          >
            {week.map((day, dayIdx) => {
              const globalIdx = weekIdx * 7 + dayIdx;
              const isClickable = day.isCurrentMonth;
              const Tag = isClickable ? "button" : "div";

              return (
                <motion.div
                  key={day.iso}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: globalIdx * 0.007 }}
                  className="border-r border-[#080A0F]/5 last:border-r-0"
                >
                  <Tag
                    {...(isClickable
                      ? {
                          type: "button" as const,
                          onClick: () => onDayClick(day.iso),
                        }
                      : {})}
                    className={[
                      "group relative flex min-h-[80px] w-full flex-col p-2 text-left transition-all duration-150 md:min-h-[92px]",
                      cellBaseBg(day.occupancyLevel, day.isCurrentMonth, day.isToday),
                      isClickable
                        ? "cursor-pointer hover:ring-2 hover:ring-inset hover:ring-[#D4AF37]/30 hover:bg-[#D4AF37]/5"
                        : "cursor-default",
                      day.isToday
                        ? "ring-2 ring-inset ring-[#D4AF37]/55"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {/* Day number */}
                    <div className="flex items-center gap-1">
                      <span
                        className={[
                          "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black",
                          day.isToday
                            ? "bg-[#D4AF37] text-white shadow-[0_2px_8px_rgba(212,175,55,0.45)]"
                            : "",
                          !day.isCurrentMonth
                            ? "text-[#080A0F]/20"
                            : "text-[#080A0F]",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {day.dayNumber}
                      </span>
                      {day.isToday && (
                        <span className="rounded-full bg-[#D4AF37]/15 px-1.5 py-px text-[8px] font-black uppercase tracking-wide text-[#8A641F]">
                          Hoy
                        </span>
                      )}
                    </div>

                    {/* Appointments content */}
                    {day.isCurrentMonth && day.appointmentCount > 0 && (
                      <div className="mt-1.5 flex flex-col gap-0.5">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-black ${appointmentBadgeStyle(day.occupancyLevel)}`}
                        >
                          {day.appointmentCount} cita
                          {day.appointmentCount !== 1 ? "s" : ""}
                        </span>
                        {day.estimatedRevenue > 0 && (
                          <span className="pl-0.5 text-[9px] font-bold text-[#080A0F]/45">
                            ~{money(day.estimatedRevenue)}
                          </span>
                        )}
                        {day.newClients > 0 && (
                          <span className="flex items-center gap-0.5">
                            {Array.from({
                              length: Math.min(day.newClients, 3),
                            }).map((_, i) => (
                              <span
                                key={i}
                                className="h-1 w-1 rounded-full bg-sky-400"
                                title="Cliente nuevo"
                              />
                            ))}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Free day */}
                    {day.isCurrentMonth && day.appointmentCount === 0 && (
                      <div className="mt-1.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-600 ring-1 ring-emerald-100">
                        Día libre
                      </div>
                    )}

                    {/* Hover "ver día" hint */}
                    {isClickable && (
                      <span className="absolute bottom-2 right-2 hidden text-[8px] font-black text-[#D4AF37]/70 group-hover:block">
                        ver día →
                      </span>
                    )}

                    {/* Occupancy bar at bottom */}
                    {day.isCurrentMonth && (
                      <div className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-[#080A0F]/4">
                        <div
                          className={`h-full transition-all duration-500 ${occupancyBarColor(day.occupancyLevel)} ${occupancyBarWidth(day.occupancyLevel)}`}
                        />
                      </div>
                    )}
                  </Tag>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Día activo
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/8 px-2.5 py-1 text-[10px] font-black text-[#8A641F]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          Día medio
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Día flojo
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-black text-sky-600">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          Clientes nuevos
        </span>
        <span className="ml-auto text-[9px] font-bold text-[#080A0F]/30">
          Clic en un día para ver detalle
        </span>
      </div>
    </div>
  );
}
