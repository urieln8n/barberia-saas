"use client";

import type { AgendaBarber } from "@/src/lib/agenda/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  barbers: AgendaBarber[];
};

export function BarberFilterSelect({ value, onChange, barbers }: Props) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-200 hover:border-slate-300"
    >
      <option value="">Por barbero</option>
      {barbers.map((barber) => (
        <option key={barber.id} value={barber.id}>
          {barber.name}
        </option>
      ))}
    </select>
  );
}
