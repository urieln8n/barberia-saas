import Link from "next/link";
import { ArrowRight, Bot, CalendarSearch, Sparkles } from "lucide-react";
import type { AgendaRecommendation } from "@/src/lib/agenda/types";

type Props = {
  recommendation: AgendaRecommendation;
};

const TONES = {
  gold: "border-[#D5A84C]/25 bg-[#D5A84C]/10 text-[#8A641F]",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
};

export function AgendaRecommendedAction({ recommendation }: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className={`rounded-2xl border p-5 shadow-sm lg:col-span-1 ${TONES[recommendation.tone]}`}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-current/20 bg-white/70">
            <CalendarSearch size={18} />
          </div>
          <div>
            <p className="font-black text-slate-950">{recommendation.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">{recommendation.description}</p>
          </div>
        </div>
        <Link
          href={recommendation.href}
          className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
        >
          {recommendation.cta} <ArrowRight size={14} />
        </Link>
      </article>

      <article className="rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white text-violet-700">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-black text-slate-950">Agente de Huecos Libres</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Detecta horas vacias y prepara campanas para llenar tu agenda.
            </p>
            <p className="mt-3 inline-flex rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-black text-violet-700">
              Proximamente · Premium IA
            </p>
          </div>
        </div>
        <Link href="/dashboard/agents" className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 text-sm font-black text-violet-800 transition hover:bg-violet-100">
          Ver agentes IA <ArrowRight size={14} />
        </Link>
      </article>

      <article className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-200 bg-white text-sky-700">
            <Bot size={18} />
          </div>
          <div>
            <p className="font-black text-slate-950">Recepcionista IA</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Pronto podra responder clientes, consultar disponibilidad y crear reservas automaticamente.
            </p>
            <p className="mt-3 inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-black text-sky-700">
              Beta / Proximamente
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
