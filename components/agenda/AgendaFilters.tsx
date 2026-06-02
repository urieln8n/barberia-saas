"use client";

import type { AgendaBarber, AgendaService } from "@/src/lib/agenda/types";
import { BarberFilterSelect } from "./BarberFilterSelect";
import { ServiceFilterSelect } from "./ServiceFilterSelect";

export type AgendaFilter =
  | "all"
  | "confirmed"
  | "scheduled"
  | "new"
  | "completed"
  | "cancelled"
  | "free";

const FILTERS: { id: AgendaFilter; label: string; dot?: string }[] = [
  { id: "all", label: "Todos" },
  { id: "confirmed", label: "Confirmadas", dot: "bg-[#22C55E]" },
  { id: "scheduled", label: "Pendientes", dot: "bg-[#F59E0B]" },
  { id: "new", label: "Nuevos clientes", dot: "bg-[#3B82F6]" },
  { id: "completed", label: "Completadas", dot: "bg-[#555]" },
  { id: "cancelled", label: "Canceladas", dot: "bg-[#EF4444]" },
  { id: "free", label: "Solo huecos libres", dot: "bg-[#22C55E]" },
];

type Props = {
  activeFilter: AgendaFilter;
  onFilterChange: (filter: AgendaFilter) => void;
  selectedBarber: string;
  selectedService: string;
  onBarberChange: (barberId: string) => void;
  onServiceChange: (serviceId: string) => void;
  barbers: AgendaBarber[];
  services: AgendaService[];
};

export function AgendaFilters({
  activeFilter,
  onFilterChange,
  selectedBarber,
  selectedService,
  onBarberChange,
  onServiceChange,
  barbers,
  services,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                activeFilter === filter.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              {filter.dot && (
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${filter.dot}`} />
              )}
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:w-[380px]">
          <BarberFilterSelect value={selectedBarber} onChange={onBarberChange} barbers={barbers} />
          <ServiceFilterSelect value={selectedService} onChange={onServiceChange} services={services} />
        </div>
      </div>
    </section>
  );
}
