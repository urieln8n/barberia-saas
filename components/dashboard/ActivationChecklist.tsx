import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Rocket } from "lucide-react";

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
};

export function ActivationChecklist({ percent, items }: ActivationChecklistProps) {
  const nextItem = items.find((item) => !item.done);

  return (
    <section className="section-band overflow-hidden">
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
