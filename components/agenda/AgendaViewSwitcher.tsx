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
  {
    id: "opportunities",
    label: "Oportunidades",
    shortLabel: "Oport.",
    Icon: Lightbulb,
  },
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
      className="flex items-center rounded-2xl border border-[#080A0F]/10 bg-white p-1 shadow-sm"
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
              relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2
              text-xs font-black transition-all duration-150
              ${
                isActive
                  ? "bg-[#080A0F] text-white shadow-sm"
                  : "text-[#080A0F]/50 hover:bg-[#080A0F]/5 hover:text-[#080A0F]/80"
              }
            `}
          >
            <Icon
              size={13}
              className={isActive ? "text-[#D4AF37]" : ""}
              aria-hidden="true"
            />
            {/* Full label on md+, short on mobile */}
            <span className="hidden sm:block">{label}</span>
            <span className="block sm:hidden">{shortLabel}</span>

            {/* Gold dot indicator for opportunities */}
            {id === "opportunities" && !isActive && (
              <span
                aria-hidden="true"
                className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#D4AF37]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
