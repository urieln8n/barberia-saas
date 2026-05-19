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
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9922A]/20 bg-[#C9922A]/10 px-3 py-1 text-xs font-black text-[#C9922A]">
              <Rocket size={12} />
              Activación
            </div>
            <span className="text-sm font-bold text-[#080A0F]">
              {doneCount}/{items.length} pasos completados
            </span>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#C9922A] transition-colors hover:text-[#8A641F]"
          >
            Ver pasos <ChevronDown size={13} />
          </button>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#C9922A] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {percent === 100 ? (
          <p className="mt-2 text-xs font-bold text-emerald-600">
            ¡Configuración completa! Tu barbería está lista para recibir reservas.
          </p>
        ) : nextItem ? (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-neutral-500">Siguiente:</span>
            <Link href={nextItem.href} className="text-xs font-bold text-[#C9922A] hover:underline">
              {nextItem.label} →
            </Link>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="section-band overflow-hidden">
      {compact && (
        <div className="flex justify-end px-5 pt-4 md:px-6">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="flex items-center gap-1 text-xs font-bold text-neutral-400 transition-colors hover:text-neutral-600"
          >
            Colapsar <ChevronUp size={13} />
          </button>
        </div>
      )}
      <div className="grid gap-5 p-5 md:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C9922A]/20 bg-[#C9922A]/10 px-3 py-1 text-xs font-black text-[#C9922A]">
            <Rocket size={14} />
            Activación
          </div>
          <h2 className="mt-3 text-2xl font-black text-[#080A0F] md:text-3xl">
            Tu barbería está al {percent}% lista para vender citas online.
          </h2>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[#C9922A]" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Completa los pasos básicos para lanzar reservas online con QR, servicios, equipo y primeras acciones de marketing.
          </p>
          {nextItem && (
            <Link href={nextItem.href} className="btn-dark mt-5">
              Continuar: {nextItem.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-slate-300 hover:bg-white"
            >
              <div className="flex items-start gap-3">
                {item.done ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                ) : (
                  <Circle size={18} className="mt-0.5 shrink-0 text-slate-300" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800">{item.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p>
                  <span className="mt-2 inline-flex text-xs font-black text-[#C9922A]">
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
