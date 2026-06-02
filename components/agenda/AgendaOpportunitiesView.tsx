"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, Lightbulb, Megaphone, QrCode, Star, Users, Zap } from "lucide-react";
import type { AgendaOpportunity } from "@/src/lib/agenda/types";

const TONE_STYLES = {
  gold: {
    card: "border-[#D4AF37]/25 bg-[#D4AF37]/5",
    icon: "bg-[#D4AF37]/12 text-[#B88917]",
    badge: "bg-[#D4AF37]/15 text-[#8A641F]",
    cta: "border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#8A641F] hover:bg-[#D4AF37]/20",
  },
  blue: {
    card: "border-[#38BDF8]/25 bg-[#38BDF8]/5",
    icon: "bg-[#38BDF8]/12 text-[#0284c7]",
    badge: "bg-[#38BDF8]/15 text-[#0369a1]",
    cta: "border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#0369a1] hover:bg-[#38BDF8]/20",
  },
  green: {
    card: "border-emerald-200 bg-emerald-50/50",
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    cta: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  red: {
    card: "border-red-200 bg-red-50/40",
    icon: "bg-red-100 text-red-500",
    badge: "bg-red-100 text-red-600",
    cta: "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  },
} as const;

const TYPE_ICONS: Record<AgendaOpportunity["type"], React.ElementType> = {
  free_slots: Zap,
  low_day: Zap,
  low_barber: Users,
  pending: Star,
  review: Star,
  new_client: Users,
  lounge: QrCode,
  marketing: Megaphone,
};

type CardProps = {
  opportunity: AgendaOpportunity;
  index: number;
};

function OpportunityCard({ opportunity, index }: CardProps) {
  const prefersReducedMotion = useReducedMotion();
  const styles = TONE_STYLES[opportunity.tone];
  const Icon = TYPE_ICONS[opportunity.type];

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06 }}
      className={`flex flex-col gap-3 rounded-2xl border p-5 ${styles.card}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}>
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-[#080A0F] leading-tight">{opportunity.title}</h3>
          <p className="mt-1 text-xs leading-5 text-[#080A0F]/60">
            {opportunity.description}
          </p>
        </div>
      </div>

      {/* Impact badge */}
      <div className={`self-start rounded-full px-2.5 py-0.5 text-[10px] font-black ${styles.badge}`}>
        ↑ {opportunity.impact}
      </div>

      {/* CTA */}
      <a
        href={opportunity.href}
        className={`
          flex items-center gap-1.5 self-start rounded-xl border px-3 py-2
          text-xs font-black transition-all duration-150 active:scale-95
          ${styles.cta}
        `}
      >
        {opportunity.cta}
        <ArrowRight size={11} />
      </a>
    </motion.div>
  );
}

type Props = {
  opportunities: AgendaOpportunity[];
};

export function AgendaOpportunitiesView({ opportunities }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">
          Oportunidades
        </p>
        <h2 className="mt-1 text-xl font-black text-[#080A0F]">
          Tu agenda detecta oportunidades para vender más
        </h2>
        <p className="mt-1 text-sm text-[#080A0F]/55">
          Análisis basado en citas, huecos y comportamiento de clientes.
          Sin automatizar nada — solo señales para que tomes acción.
        </p>
      </div>

      {/* Opportunities */}
      {opportunities.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#080A0F]/12 bg-white p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <Lightbulb size={20} className="text-emerald-500" />
          </div>
          <div>
            <p className="font-black text-[#080A0F]">Todo bajo control</p>
            <p className="mt-1 text-sm text-[#080A0F]/50">
              No hay oportunidades urgentes esta semana. ¡Buen trabajo!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((opp, i) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={i} />
          ))}
        </div>
      )}

      {/* AaaS hint */}
      <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#FDFAF3] p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
            <Bot size={16} className="text-[#C9922A]" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#C9922A]">
              Agentes IA — próximamente
            </p>
            <h3 className="mt-0.5 font-black text-slate-900">
              El Agente de Huecos Libres actuará en base a estas señales
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">
              Cuando des aprobación, el agente podrá contactar clientes, preparar campañas
              y llenar huecos automáticamente. Hoy solo detecta. Mañana actúa.
            </p>
            <a
              href="/dashboard/agentes"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-black text-[#C9922A] transition hover:bg-[#D4AF37]/18"
            >
              Ver Agentes IA <ArrowRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
