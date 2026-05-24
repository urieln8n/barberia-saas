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
      className="min-h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#D5A84C] focus:bg-white"
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
