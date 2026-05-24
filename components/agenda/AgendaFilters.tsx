"use client";

import type { AgendaBarber, AgendaService } from "@/src/lib/agenda/types";
import { BarberFilterSelect } from "./BarberFilterSelect";
import { ServiceFilterSelect } from "./ServiceFilterSelect";

export type AgendaFilter = "all" | "confirmed" | "scheduled" | "new" | "completed" | "cancelled" | "free";

const FILTERS: { id: AgendaFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "confirmed", label: "Confirmadas" },
  { id: "scheduled", label: "Pendientes" },
  { id: "new", label: "Nuevos clientes" },
  { id: "completed", label: "Completadas" },
  { id: "cancelled", label: "Canceladas" },
  { id: "free", label: "Solo huecos libres" },
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
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-black transition ${
                activeFilter === filter.id
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:text-slate-950"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:w-[420px]">
          <BarberFilterSelect value={selectedBarber} onChange={onBarberChange} barbers={barbers} />
          <ServiceFilterSelect value={selectedService} onChange={onServiceChange} services={services} />
        </div>
      </div>
    </section>
  );
}
