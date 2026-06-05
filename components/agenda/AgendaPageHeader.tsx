"use client";

import { CalendarDays, Filter, Plus, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onNewAppointment: () => void;
};

export function AgendaPageHeader({ selectedDate, onDateChange, onNewAppointment }: Props) {
  const today = new Date().toISOString().slice(0, 10);

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="min-h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#D4AF37] focus:bg-white"
        aria-label="Seleccionar fecha"
      />
      <button
        type="button"
        onClick={() => onDateChange(today)}
        className="btn-outline btn-sm"
      >
        <CalendarDays size={14} /> Hoy
      </button>
      <button
        type="button"
        className="btn-outline btn-sm"
        aria-label="Vista semanal"
      >
        <Search size={14} /> Semana
      </button>
      <Link href="/dashboard/marketing" className="btn-outline btn-sm">
        <Sparkles size={14} /> Huecos
      </Link>
      <button
        type="button"
        className="btn-outline btn-sm"
        aria-label="Filtros"
      >
        <Filter size={14} /> Filtros
      </button>
      <button
        type="button"
        onClick={onNewAppointment}
        className="btn-dark btn-sm"
      >
        <Plus size={15} /> Nueva reserva
      </button>
    </div>
  );

  return (
    <PageHeader
      section="Agenda premium"
      title="Agenda"
      description="Gestiona reservas, huecos y disponibilidad de tu equipo."
      action={actions}
      variant="compact"
    />
  );
}
