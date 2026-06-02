"use client";

import type { AgendaService } from "@/src/lib/agenda/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  services: AgendaService[];
};

export function ServiceFilterSelect({ value, onChange, services }: Props) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200 hover:border-slate-300"
    >
      <option value="">Por servicio</option>
      {services.map((service) => (
        <option key={service.id} value={service.id}>
          {service.name}
        </option>
      ))}
    </select>
  );
}
