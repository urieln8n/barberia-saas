"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Circle, Rocket } from "lucide-react";

export type ActivationChecklistItem = {
  label: string;
  href: string;
  done: boolean;
  description: string;
  actionLabel: string;
};

type ActivationChecklistProps = {
  percent: number;
  items: ActivationChecklistItem[];
  compact?: boolean;
};

export function ActivationChecklist({ percent, items, compact = false }: ActivationChecklistProps) {
  const [expanded, setExpanded] = useState(false);
  const nextItem = items.find((item) => !item.done);
  const doneCount = items.filter((item) => item.done).length;

  if (compact && !expanded) {
    return (
      <section className="relative overflow-hidden rounded-[20px] border border-[#2A2A38] bg-gradient-to-b from-[#242440] to-[#1A1A30] p-5 shadow-[0_1px_16px_rgba(0,0,0,0.45)] md:p-6">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.10] px-3 py-1 text-xs font-black text-[#D4AF37]">
              <Rocket size={12} />
              Activación
            </div>
            <span className="text-sm font-bold text-white/80">
              {doneCount}/{items.length} pasos completados
            </span>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#D4AF37] transition-colors hover:text-[#F5D060]"
          >
            Ver pasos <ChevronDown size={13} />
          </button>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1E1E24]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D060] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {percent === 100 ? (
          <p className="mt-2 text-xs font-bold text-emerald-400">
            ¡Configuración completa! Tu barbería está lista para recibir reservas.
          </p>
        ) : nextItem ? (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-white/45">Siguiente:</span>
            <Link href={nextItem.href} className="text-xs font-bold text-[#D4AF37] hover:text-[#F5D060]">
              {nextItem.label} →
            </Link>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[20px] border border-[#2A2A38] bg-gradient-to-b from-[#242440] to-[#1A1A30] shadow-[0_1px_16px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      {compact && (
        <div className="flex justify-end px-5 pt-4 md:px-6">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="flex items-center gap-1 text-xs font-bold text-white/40 transition-colors hover:text-white/65"
          >
            Colapsar <ChevronUp size={13} />
          </button>
        </div>
      )}
      <div className="grid gap-5 p-5 md:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/[0.10] px-3 py-1 text-xs font-black text-[#D4AF37]">
            <Rocket size={14} />
            Activación
          </div>
          <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
            Tu barbería está al{" "}
            <span style={{ background: "linear-gradient(135deg, #F5D060, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {percent}%
            </span>{" "}
            lista para vender citas online.
          </h2>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#1E1E24]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D060] transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Completa los pasos básicos para lanzar reservas online con QR, servicios, equipo y primeras acciones de marketing.
          </p>
          {nextItem && (
            <Link
              href={nextItem.href}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-2xl bg-[#D4AF37] px-5 text-sm font-black text-[#09090B] shadow-[0_2px_8px_rgba(212,175,55,0.30)] transition hover:-translate-y-px hover:bg-[#F5D060] active:scale-[0.98]"
            >
              Continuar: {nextItem.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-[#2A2A38] bg-[#0E0E14] p-3 transition-colors hover:border-[#36364A] hover:bg-[#131320]"
            >
              <div className="flex items-start gap-3">
                {item.done ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
                ) : (
                  <Circle size={18} className="mt-0.5 shrink-0 text-white/25" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-black text-white">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-white/45">{item.description}</p>
                  <span className="mt-2 inline-flex text-xs font-black text-[#D4AF37]">
                    {item.done ? "Revisar" : item.actionLabel}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
