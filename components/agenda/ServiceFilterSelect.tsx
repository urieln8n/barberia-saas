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
      className="min-h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#D4AF37] focus:bg-white"
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
