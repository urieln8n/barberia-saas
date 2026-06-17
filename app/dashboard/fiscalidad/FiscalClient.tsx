"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calculator,
  AlertTriangle,
  Clock,
  Download,
} from "lucide-react";

type Payment = { amount: number | string; created_at: string };
type Expense = { amount: number | string; category: string; expense_date: string };
type Props   = { payments: Payment[]; expenses: Expense[]; year: number };

type QuarterDef = {
  q:        number;
  label:    string;
  period:   string;
  months:   number[];
  deadline: string;
  nextYear: boolean;
};

const QUARTERS: QuarterDef[] = [
  { q: 1, label: "T1", period: "Ene – Mar", months: [1,2,3],   deadline: "20 de abril",   nextYear: false },
  { q: 2, label: "T2", period: "Abr – Jun", months: [4,5,6],   deadline: "20 de julio",   nextYear: false },
  { q: 3, label: "T3", period: "Jul – Sep", months: [7,8,9],   deadline: "20 de octubre", nextYear: false },
  { q: 4, label: "T4", period: "Oct – Dic", months: [10,11,12],deadline: "30 de enero",   nextYear: true  },
];

function computeQuarter(payments: Payment[], expenses: Expense[], months: number[]) {
  const inMonths = (m: number) => months.includes(m);

  const qPayments = payments.filter(p =>
    inMonths(new Date(p.created_at).getMonth() + 1)
  );
  const qExpenses = expenses.filter(e =>
    inMonths(new Date(e.expense_date + "T00:00:00").getMonth() + 1)
  );

  const ingresos = qPayments.reduce((s, p) => s + Number(p.amount), 0);
  const gastos   = qExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const beneficio = ingresos - gastos;

  // IVA: asumimos precios con IVA 21% incluido
  const ivaRepercutido = ingresos * 21 / 121;

  // Nómina no lleva IVA; resto de categorías: 21% incluido
  const gastosConIva = qExpenses
    .filter(e => e.category !== "nomina")
    .reduce((s, e) => s + Number(e.amount), 0);
  const ivaSoportado = gastosConIva * 21 / 121;

  const ivaNeto = ivaRepercutido - ivaSoportado;
  const irpf    = Math.max(0, beneficio) * 0.20;

  return { ingresos, gastos, beneficio, ivaRepercutido, ivaSoportado, ivaNeto, irpf };
}

export function FiscalClient({ payments, expenses, year }: Props) {
  const currentMonth = new Date().getMonth() + 1;
  const currentQ     = Math.ceil(currentMonth / 3);
  const [selectedQ, setSelectedQ] = useState(currentQ);

  const quarter = QUARTERS[selectedQ - 1];
  const d       = computeQuarter(payments, expenses, quarter.months);
  const deadlineYear = quarter.nextYear ? year + 1 : year;

  const fmt    = (n: number) => n.toFixed(0);
  const fmtDec = (n: number) => n.toFixed(2);

  type Row = { label: string; value: number; note: string; indent?: boolean; highlight?: boolean };

  const rows: Row[] = [
    { label: "Ingresos del trimestre",             value: d.ingresos,         note: "Total pagos cobrados en el período" },
    { label: "IVA repercutido est. (21%)",          value: d.ivaRepercutido,   note: "IVA incluido en tus ingresos", indent: true },
    { label: "Base imponible ingresos",             value: d.ingresos - d.ivaRepercutido, note: "Ingresos sin IVA", indent: true },
    { label: "Gastos del trimestre",                value: d.gastos,           note: "Total gastos registrados" },
    { label: "IVA soportado est. (21%)",            value: d.ivaSoportado,     note: "IVA en gastos (excl. nómina)", indent: true },
    { label: "IVA neto a declarar est. — Mod. 303", value: d.ivaNeto,          note: "IVA repercutido − IVA soportado", highlight: true },
    { label: "Beneficio estimado",                  value: d.beneficio,        note: "Ingresos − Gastos totales" },
    { label: "IRPF fraccionado est. — Mod. 130",   value: d.irpf,             note: "20% del beneficio positivo trimestral", highlight: true },
  ];

  return (
    <>
      {/* ── Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-white/50">Panel de control</p>
          <h1 className="text-4xl font-black text-white">Fiscalidad</h1>
        </div>
        <button
          disabled
          className="flex cursor-not-allowed items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/30"
        >
          <Download size={16} />
          Resumen orientativo
        </button>
      </div>

      {/* ── Disclaimer ── */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] px-5 py-4">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />
        <p className="text-sm leading-6 text-amber-300">
          <span className="font-black">Datos orientativos.</span>{" "}
          Calculados a partir de tus registros asumiendo estimación directa simplificada
          e IVA tipo general (21%). No constituyen asesoramiento fiscal ni sustituyen a tu
          gestor. Consulta siempre con un profesional antes de presentar cualquier declaración.
        </p>
      </div>

      {/* ── Selector trimestre ── */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" className="flex gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1.5">
          {QUARTERS.map(({ q, label }) => (
            <button
              key={q}
              type="button"
              role="tab"
              aria-selected={selectedQ === q}
              onClick={() => setSelectedQ(q)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition ${
                selectedQ === q
                  ? "bg-white text-[#09090B]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {label}
              {q === currentQ && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
        </div>
        <p className="text-sm text-white/50">
          {quarter.period} · {year} · Plazo: {quarter.deadline}
          {quarter.nextYear ? ` de ${deadlineYear}` : ""}
        </p>
      </div>

      {/* ── KPI cards ── */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Ingresos</p>
          <p className="mt-3 text-3xl font-black text-white">{fmt(d.ingresos)} €</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp size={11} /> Pagos cobrados
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Gastos</p>
          <p className="mt-3 text-3xl font-black text-white">{fmt(d.gastos)} €</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-amber-400">
            <TrendingDown size={11} /> Gastos registrados
          </p>
        </div>

        <div className={`rounded-2xl border p-5 ${
          d.beneficio >= 0 ? "border-emerald-500/20 bg-emerald-500/[0.08]" : "border-red-500/20 bg-red-500/[0.08]"
        }`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Beneficio est.</p>
          <p className={`mt-3 text-3xl font-black ${d.beneficio >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {d.beneficio >= 0 ? "+" : ""}{fmt(d.beneficio)} €
          </p>
          <p className={`mt-1 flex items-center gap-1 text-xs ${d.beneficio >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            <Wallet size={11} /> Este trimestre
          </p>
        </div>

        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.08] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">IVA neto est.</p>
          <p className="mt-3 text-3xl font-black text-orange-400">{fmt(d.ivaNeto)} €</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-orange-400">
            <Calculator size={11} /> Repercutido − soportado
          </p>
        </div>
      </div>

      {/* ── Desglose fiscal ── */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E1C]">
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-black text-white">Estimación fiscal del trimestre</h2>
          <p className="mt-0.5 text-xs text-white/40">
            Precios con IVA incluido al 21% · Estimación directa simplificada
          </p>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {rows.map(({ label, value, note, indent, highlight }) => (
            <div
              key={label}
              className={`flex items-center justify-between gap-4 px-6 py-3.5 ${highlight ? "bg-white/[0.04]" : ""}`}
            >
              <div className={indent ? "pl-5" : ""}>
                <p className={`text-sm ${highlight ? "font-black text-white" : "font-semibold text-white/70"}`}>
                  {label}
                </p>
                <p className="text-xs text-white/40">{note}</p>
              </div>
              <p className={`shrink-0 font-black ${highlight ? "text-base text-white" : "text-sm text-white/80"}`}>
                {fmtDec(value)} €
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recordatorio de modelos ── */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E1C]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-6 py-4">
          <Clock size={16} className="text-white/30" />
          <div>
            <h2 className="font-black text-white">Recordatorios de modelos</h2>
            <p className="text-xs text-white/40">Solo aplica si eres autónomo en estimación directa</p>
          </div>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {[
            { model: "Mod. 303", name: "IVA trimestral",         period: quarter.period },
            { model: "Mod. 130", name: "IRPF pago fraccionado",  period: quarter.period },
          ].map(({ model, name, period }) => (
            <div key={model} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-xs font-black text-white/70">
                  {model}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-white/40">Trimestre {selectedQ} · {period}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white/60">{quarter.deadline}</p>
                <p className="text-xs text-white/40">{deadlineYear}</p>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4 bg-white/[0.03] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-16 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-black text-white/50">
                Mod. 390
              </div>
              <div>
                <p className="text-sm font-semibold text-white/60">Resumen anual IVA</p>
                <p className="text-xs text-white/40">Anual · Todo el año {year}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-white/40">30 de enero</p>
              <p className="text-xs text-white/40">{year + 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Resumen gestor ── */}
      <div className="mt-4 rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.02] p-6 text-center">
        <Download size={22} className="mx-auto text-white/20" />
        <p className="mt-2 font-black text-white/40">Resumen para tu gestor</p>
        <p className="mt-1 text-sm text-white/40">
          Usa el desglose de esta pantalla como base para revisar el trimestre con tu asesor fiscal.
        </p>
        <button
          disabled
          className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-2xl bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-white/30"
        >
          <Download size={14} />
          Exportacion asistida
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-white/30">
        Estimación orientativa · Datos de tus registros · Consulta siempre con tu gestor fiscal
      </p>
    </>
  );
}
