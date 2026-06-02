"use client";

import { CalendarDays, Clock, Grid3X3, LayoutGrid, Lightbulb } from "lucide-react";
import type { AgendaView } from "@/src/lib/agenda/types";

const VIEWS: {
  id: AgendaView;
  label: string;
  shortLabel: string;
  Icon: React.ElementType;
}[] = [
  { id: "day", label: "Día", shortLabel: "Día", Icon: Clock },
  { id: "week", label: "Semana", shortLabel: "Sem.", Icon: CalendarDays },
  { id: "month", label: "Mes", shortLabel: "Mes", Icon: Grid3X3 },
  { id: "barbers", label: "Barberos", shortLabel: "Barb.", Icon: LayoutGrid },
  { id: "opportunities", label: "Oportunidades", shortLabel: "Oport.", Icon: Lightbulb },
];

type Props = {
  current: AgendaView;
  onChange: (view: AgendaView) => void;
};

export function AgendaViewSwitcher({ current, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Cambiar vista de agenda"
      className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-100 p-1"
    >
      {VIEWS.map(({ id, label, shortLabel, Icon }) => {
        const isActive = current === id;
        return (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`
              relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2
              text-xs font-bold transition-all duration-150
              ${isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
              }
            `}
          >
            <Icon
              size={12}
              aria-hidden="true"
            />
            <span className="hidden sm:block">{label}</span>
            <span className="block sm:hidden">{shortLabel}</span>

            {id === "opportunities" && !isActive && (
              <span
                aria-hidden="true"
                className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#22C55E]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
