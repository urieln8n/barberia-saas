"use client";

import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";
import type { AgendaView } from "@/src/lib/agenda/types";
import {
  toISODate,
  getTodayISO,
  getWeekStart,
} from "@/src/lib/agenda/agenda-utils";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

function getWeekEnd(weekStartISO: string): string {
  const d = new Date(`${weekStartISO}T00:00:00`);
  d.setDate(d.getDate() + 6);
  return toISODate(d);
}

function buildTitle(view: AgendaView, dateISO: string): string {
  const date = formatDate(dateISO);

  switch (view) {
    case "day":
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    case "week": {
      const weekStart = getWeekStart(dateISO);
      const weekEnd = getWeekEnd(weekStart);
      const start = formatDate(weekStart);
      const end = formatDate(weekEnd);
      const startDay = start.getDate();
      const endDay = end.getDate();
      const endMonth = end.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });
      if (start.getMonth() === end.getMonth()) {
        return `${startDay} – ${endDay} de ${endMonth}`;
      }
      const startMonth = start.toLocaleDateString("es-ES", { month: "long" });
      return `${startDay} de ${startMonth} – ${endDay} de ${endMonth}`;
    }

    case "month":
      return date.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });

    case "barbers":
      return "Carga por barbero";

    case "opportunities":
      return "Oportunidades detectadas";

    default:
      return "";
  }
}

function navigate(view: AgendaView, dateISO: string, direction: 1 | -1): string {
  const date = formatDate(dateISO);

  switch (view) {
    case "day": {
      date.setDate(date.getDate() + direction);
      return toISODate(date);
    }
    case "week": {
      date.setDate(date.getDate() + direction * 7);
      return toISODate(date);
    }
    case "month": {
      date.setMonth(date.getMonth() + direction);
      date.setDate(1);
      return toISODate(date);
    }
    default:
      return dateISO;
  }
}

const showNav = (view: AgendaView) =>
  ["day", "week", "month"].includes(view);

type Props = {
  view: AgendaView;
  dateISO: string;
  onDateChange: (date: string) => void;
};

export function AgendaDateNavigator({ view, dateISO, onDateChange }: Props) {
  const today = getTodayISO();
  const isToday =
    view === "day"
      ? dateISO === today
      : view === "week"
        ? getWeekStart(dateISO) === getWeekStart(today)
        : view === "month"
          ? dateISO.slice(0, 7) === today.slice(0, 7)
          : true;

  const title = buildTitle(view, dateISO);

  return (
    <div className="flex items-center gap-2">
      {showNav(view) && (
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => onDateChange(navigate(view, dateISO, -1))}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#080A0F]/10 bg-white text-[#080A0F]/60 shadow-sm transition hover:border-[#080A0F]/20 hover:bg-[#F8F8F6] hover:text-[#080A0F] active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div className="flex flex-col">
        <span className="text-sm font-black capitalize text-[#080A0F] md:text-base">
          {title}
        </span>
      </div>

      {showNav(view) && (
        <>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => onDateChange(navigate(view, dateISO, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#080A0F]/10 bg-white text-[#080A0F]/60 shadow-sm transition hover:border-[#080A0F]/20 hover:bg-[#F8F8F6] hover:text-[#080A0F] active:scale-95"
          >
            <ChevronRight size={16} />
          </button>

          {!isToday && (
            <button
              type="button"
              onClick={() => onDateChange(today)}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-[#D5A84C]/30 bg-[#D5A84C]/8 px-3 text-xs font-black text-[#B8892A] transition hover:bg-[#D5A84C]/15 active:scale-95"
            >
              <CalendarCheck size={12} />
              Hoy
            </button>
          )}
        </>
      )}
    </div>
  );
}
