import Link from "next/link";
import { ArrowRight, Bot, Lightbulb, Sparkles } from "lucide-react";
import type { AgendaRecommendation } from "@/src/lib/agenda/types";

type Props = {
  recommendation: AgendaRecommendation;
};

const TONE_COLORS = {
  gold: "border-[#C9922A]/20 bg-[#C9922A]/6 text-[#C9922A]",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-red-200 bg-red-50 text-red-600",
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
            <p className="font-black text-slate-900">{recommendation.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{recommendation.description}</p>
          </div>
        </div>
        <Link
          href={recommendation.href}
          className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-xl bg-[#D4AF37] px-4 text-xs font-black text-[#070707] transition hover:bg-[#F4D03F]"
        >
          {recommendation.cta} <ArrowRight size={12} />
        </Link>
      </article>

      {/* Agent 1 */}
      <article className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-100 text-violet-600">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="font-black text-slate-900">Agente de Huecos Libres</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Detecta horas vacías y prepara campañas para llenar tu agenda.
            </p>
            <span className="mt-2 inline-block rounded-full border border-violet-200 bg-violet-100 px-2.5 py-0.5 text-[10px] font-black text-violet-700">
              Premium IA · Próximamente
            </span>
          </div>
        </div>
        <Link
          href="/dashboard/agents"
          className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-xl border border-violet-200 bg-violet-100 px-4 text-xs font-black text-violet-700 transition hover:bg-violet-200"
        >
          Ver agentes IA <ArrowRight size={12} />
        </Link>
      </article>

      {/* Agent 2 */}
      <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-100 text-blue-600">
            <Bot size={16} />
          </div>
          <div>
            <p className="font-black text-slate-900">Recepcionista IA</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Responde clientes, consulta disponibilidad y crea reservas automáticamente.
            </p>
            <span className="mt-2 inline-block rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-[10px] font-black text-blue-700">
              Beta · Próximamente
            </span>
          </div>
        </div>
      </article>
    </section>
  );
}
