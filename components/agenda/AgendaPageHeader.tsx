import Link from "next/link";
import { CalendarDays, Filter, Plus, Search, Sparkles } from "lucide-react";

type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onNewAppointment: () => void;
};

export function AgendaPageHeader({ selectedDate, onDateChange, onNewAppointment }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5A84C]/30 bg-[#D5A84C]/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#8A641F]">
            <Sparkles size={13} />
            Agenda premium
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Agenda Visual Pro
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Ve citas, huecos y barberos en un panel claro. Analiza tu agenda por colores, prioridades y oportunidades de venta.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => onDateChange(event.target.value)}
            className="min-h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#D5A84C] focus:bg-white"
          />
          <button
            type="button"
            onClick={() => onDateChange(new Date().toISOString().slice(0, 10))}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <CalendarDays size={15} /> Hoy
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <Search size={15} /> Vista semanal
          </button>
          <Link
            href="/dashboard/marketing"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <Sparkles size={15} /> Ver huecos
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <Filter size={15} /> Filtros
          </button>
          <button
            type="button"
            onClick={onNewAppointment}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus size={16} /> Nueva reserva
          </button>
        </div>
      </div>
    </section>
  );
}
