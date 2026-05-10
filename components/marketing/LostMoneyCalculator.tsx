"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

function toMonthly(value: number) {
  return Math.max(0, Math.round(value));
}

export function LostMoneyCalculator() {
  const [averageTicket, setAverageTicket] = useState(22);
  const [noShowsPerWeek, setNoShowsPerWeek] = useState(4);
  const [emptySlotsPerWeek, setEmptySlotsPerWeek] = useState(6);
  const [lostClientsPerMonth, setLostClientsPerMonth] = useState(8);

  const monthlyLoss = useMemo(() => {
    const weeklyLoss = (noShowsPerWeek + emptySlotsPerWeek) * averageTicket * 4;
    const dormantClientLoss = lostClientsPerMonth * averageTicket * 1.5;
    return toMonthly(weeklyLoss + dormantClientLoss);
  }, [averageTicket, noShowsPerWeek, emptySlotsPerWeek, lostClientsPerMonth]);

  const fields = [
    {
      id: "average-ticket",
      label: "Precio medio del corte",
      suffix: "€",
      value: averageTicket,
      min: 8,
      max: 80,
      onChange: setAverageTicket,
    },
    {
      id: "no-shows",
      label: "No-shows por semana",
      suffix: "",
      value: noShowsPerWeek,
      min: 0,
      max: 30,
      onChange: setNoShowsPerWeek,
    },
    {
      id: "empty-slots",
      label: "Huecos vacíos por semana",
      suffix: "",
      value: emptySlotsPerWeek,
      min: 0,
      max: 50,
      onChange: setEmptySlotsPerWeek,
    },
    {
      id: "lost-clients",
      label: "Clientes que no vuelven al mes",
      suffix: "",
      value: lostClientsPerMonth,
      min: 0,
      max: 80,
      onChange: setLostClientsPerMonth,
    },
  ];

  return (
    <section id="calculadora" className="px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-[32px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="metric-icon bg-[#C9922A]/10 text-[#C9922A]">
            <Calculator size={18} />
          </div>
          <p className="section-kicker mt-6">Calculadora de ahorro para tu barbería</p>
          <h2 className="mt-3 text-3xl font-black leading-tight text-[#080A0F] md:text-5xl">
            ¿Cuánto dinero se escapa por huecos vacíos y citas que no aparecen?
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-500">
            No es una promesa de ingresos. Es una estimación rápida para ver el coste aproximado de no tener reservas ordenadas, recordatorios y clientes controlados.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-[#F7FAFC] p-5 md:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.id} htmlFor={field.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <span className="text-sm font-black text-slate-800">{field.label}</span>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    id={field.id}
                    type="range"
                    min={field.min}
                    max={field.max}
                    value={field.value}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                    className="w-full accent-[#C9922A]"
                  />
                  <span className="min-w-14 rounded-xl bg-slate-100 px-3 py-2 text-center text-sm font-black text-[#080A0F]">
                    {field.value}
                    {field.suffix}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] border border-[#C9922A]/20 bg-[#080A0F] p-5 text-white">
            <p className="text-xs font-black uppercase text-[#D5A84C]">Pérdida aproximada</p>
            <p className="mt-2 text-5xl font-black leading-none">{monthlyLoss.toLocaleString("es-ES")} €/mes</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Con una agenda online, QR, confirmaciones y clientes identificados puedes atacar parte de esa fuga con más control.
            </p>
            <PrimaryButton href="/login" variant="gold" className="mt-5 min-h-12 w-full sm:w-auto">
              Quiero reducir huecos vacíos <ArrowRight size={16} />
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
