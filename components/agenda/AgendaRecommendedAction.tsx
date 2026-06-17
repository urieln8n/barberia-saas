import Link from "next/link";
import { ArrowRight, Bot, Lightbulb, Sparkles } from "lucide-react";
import type { AgendaRecommendation } from "@/src/lib/agenda/types";

type Props = {
  recommendation: AgendaRecommendation;
};

const TONE_COLORS = {
  gold:  "border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] text-[#D4AF37]",
  blue:  "border-violet-500/25 bg-violet-500/[0.08] text-violet-400",
  green: "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400",
  red:   "border-red-500/25 bg-red-500/[0.08] text-red-400",
};

export function AgendaRecommendedAction({ recommendation }: Props) {
  const toneClass = TONE_COLORS[recommendation.tone] ?? TONE_COLORS.gold;

  return (
    <section className="grid gap-3 lg:grid-cols-3">
      {/* Main recommendation */}
      <article className={`rounded-2xl border p-5 lg:col-span-1 ${toneClass}`}>
        <div className="flex items-start gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${toneClass}`}>
            <Lightbulb size={16} />
          </div>
          <div>
            <p className="font-black text-white">{recommendation.title}</p>
            <p className="mt-1 text-xs leading-5 text-white/50">{recommendation.description}</p>
          </div>
        </div>
        <Link
          href={recommendation.href}
          className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-xl bg-[#D4AF37] px-4 text-xs font-black text-[#070707] transition hover:bg-[#F4D03F]"
        >
          {recommendation.cta} <ArrowRight size={12} />
        </Link>
      </article>

      {/* Agent 1 — Huecos Libres */}
      <article className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/[0.12] text-violet-400">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="font-black text-white">Agente de Huecos Libres</p>
            <p className="mt-1 text-xs leading-5 text-white/50">
              Detecta horas vacías y prepara campañas para llenar tu agenda.
            </p>
            <span className="mt-2 inline-block rounded-full border border-violet-500/25 bg-violet-500/[0.10] px-2.5 py-0.5 text-[10px] font-black text-violet-400">
              Premium IA · Próximamente
            </span>
          </div>
        </div>
        <Link
          href="/dashboard/agents"
          className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/[0.10] px-4 text-xs font-black text-violet-400 transition hover:bg-violet-500/[0.18]"
        >
          Ver agentes IA <ArrowRight size={12} />
        </Link>
      </article>

      {/* Agent 2 — Recepcionista IA */}
      <article className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.06] text-white/60">
            <Bot size={16} />
          </div>
          <div>
            <p className="font-black text-white">Recepcionista IA</p>
            <p className="mt-1 text-xs leading-5 text-white/50">
              Responde clientes, consulta disponibilidad y crea reservas automáticamente.
            </p>
            <span className="mt-2 inline-block rounded-full border border-white/[0.10] bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-black text-white/40">
              Beta · Próximamente
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
