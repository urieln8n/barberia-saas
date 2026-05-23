"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  Boxes,
  CalendarX2,
  ChevronRight,
  Check,
  Copy,
  Globe,
  Lock,
  Megaphone,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Star,
  Bot,
  Zap,
  ArrowRight,
  Play,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentPhase = "copilot" | "semi-auto" | "autonomous";
type AgentPlan = "starter" | "growth" | "premium";
type AgentStatus = "active" | "coming_soon";

type AgentDef = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  phase: AgentPhase;
  plan: AgentPlan;
  status: AgentStatus;
  stat?: string;
  statLabel?: string;
  accentColor: string;
  accentBg: string;
  previewLabel?: string;
  preview?: string;
};

// ─── Agent definitions ────────────────────────────────────────────────────────

const AGENTS: AgentDef[] = [
  {
    id: "retencion",
    name: "Retención IA",
    tagline: "Recupera clientes en riesgo",
    description: "Detecta clientes sin visita en +30 días y genera el WhatsApp listo para enviar. Un mensaje recupera el 30% de ellos.",
    icon: RotateCcw,
    phase: "copilot",
    plan: "growth",
    status: "active",
    stat: "0",
    statLabel: "clientes en riesgo hoy",
    accentColor: "text-amber-700",
    accentBg: "bg-amber-50",
    previewLabel: "Mensaje generado",
    preview: 'Hola [Nombre] 👋 Te echamos de menos. Llevamos 35 días sin verte. ¿Te apetece un corte esta semana? Reserva aquí: tu-barberia.com/reservas',
  },
  {
    id: "huecos",
    name: "Huecos Libres IA",
    tagline: "Convierte huecos en ingresos",
    description: "Detecta huecos libres hoy, calcula el ingreso perdido y genera el texto para Instagram Stories y WhatsApp.",
    icon: CalendarX2,
    phase: "copilot",
    plan: "growth",
    status: "active",
    stat: "—",
    statLabel: "huecos libres hoy",
    accentColor: "text-blue-700",
    accentBg: "bg-blue-50",
    previewLabel: "Copy para stories",
    preview: '🪒 Hoy quedan 2 huecos libres. ¿Te lo reservo? Pincha en bio para elegir hora → tu-barberia.com/reservas',
  },
  {
    id: "resenas",
    name: "Reseñas IA",
    tagline: "Más reseñas en Google, automático",
    description: "Genera solicitudes de reseña personalizadas al terminar el corte y respuestas profesionales a críticas negativas.",
    icon: Star,
    phase: "copilot",
    plan: "starter",
    status: "active",
    stat: "—",
    statLabel: "citas completadas hoy",
    accentColor: "text-yellow-700",
    accentBg: "bg-yellow-50",
    previewLabel: "Mensaje de solicitud",
    preview: 'Hola [Nombre]! Gracias por tu visita en [Barbería] 💈 Si tienes un minuto, nos ayudarías mucho dejando tu reseña: [link Google]',
  },
  {
    id: "marketing",
    name: "Marketing Studio IA",
    tagline: "Plan de contenido semanal",
    description: "Analiza tus datos y genera un plan de contenido completo para Instagram, WhatsApp y Google Business sin esfuerzo.",
    icon: Megaphone,
    phase: "copilot",
    plan: "growth",
    status: "active",
    stat: "7",
    statLabel: "posts generados esta semana",
    accentColor: "text-pink-700",
    accentBg: "bg-pink-50",
    previewLabel: "Plan de esta semana",
    preview: 'Lunes: Post corte destacado • Martes: Story hueco libre • Miércoles: Reseña cliente • Jueves: Tip de cuidado barba • Viernes: Oferta fin de semana',
  },
  {
    id: "recepcionista",
    name: "Recepcionista IA",
    tagline: "Responde consultas 24/7",
    description: "Responde a '¿Tenéis hueco?' en WhatsApp e Instagram y dirige al link de reservas. Cero tiempo perdido.",
    icon: Bot,
    phase: "semi-auto",
    plan: "growth",
    status: "coming_soon",
    accentColor: "text-emerald-700",
    accentBg: "bg-emerald-50",
  },
  {
    id: "seo",
    name: "Presencia Local IA",
    tagline: "Aparece en 'barbería cerca de mí'",
    description: "Audita tu perfil de Google Business, detecta huecos y genera los textos para publicar cada semana.",
    icon: Globe,
    phase: "copilot",
    plan: "growth",
    status: "coming_soon",
    accentColor: "text-indigo-700",
    accentBg: "bg-indigo-50",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business IA",
    tagline: "Tu barbería abierta 24 horas",
    description: "Gestiona respuestas automáticas en WhatsApp Business para disponibilidad, confirmaciones y recordatorios.",
    icon: MessageCircle,
    phase: "semi-auto",
    plan: "premium",
    status: "coming_soon",
    accentColor: "text-emerald-700",
    accentBg: "bg-emerald-50",
  },
  {
    id: "caja",
    name: "Finanzas IA",
    tagline: "Cierra el día con un resumen claro",
    description: "Genera el resumen diario de caja, identifica días y horas más rentables y sugiere cambios operativos.",
    icon: Banknote,
    phase: "copilot",
    plan: "premium",
    status: "coming_soon",
    accentColor: "text-[#C9922A]",
    accentBg: "bg-[#C9922A]/10",
  },
  {
    id: "inventario",
    name: "Inventario IA",
    tagline: "Nunca te quedes sin producto",
    description: "Monitoriza el stock, predice cuándo se agotarán los productos más usados y genera el pedido de reposición.",
    icon: Boxes,
    phase: "copilot",
    plan: "premium",
    status: "coming_soon",
    accentColor: "text-slate-700",
    accentBg: "bg-slate-100",
  },
];

// ─── Badge helpers ─────────────────────────────────────────────────────────────

const PHASE_LABELS: Record<AgentPhase, { label: string; className: string }> = {
  copilot:    { label: "Copiloto",  className: "bg-blue-50 text-blue-700 border-blue-100" },
  "semi-auto":{ label: "Semi-auto", className: "bg-amber-50 text-amber-700 border-amber-100" },
  autonomous: { label: "Autónomo",  className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
};

const PLAN_LABELS: Record<AgentPlan, { label: string; className: string }> = {
  starter: { label: "Starter",    className: "bg-slate-50 text-slate-600 border-slate-200" },
  growth:  { label: "Growth",     className: "bg-blue-50 text-blue-700 border-blue-100" },
  premium: { label: "Premium IA", className: "bg-[#C9922A]/10 text-[#8A641F] border-[#C9922A]/20" },
};

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${className}`}>
      {children}
    </span>
  );
}

// ─── Phase roadmap bar ─────────────────────────────────────────────────────────

const PHASES = [
  { key: "copilot",    label: "Fase 1 · Copiloto",   sub: "Genera y sugiere",   done: true  },
  { key: "semi-auto",  label: "Fase 2 · Semi-auto",  sub: "Aprueba y ejecuta",  done: false },
  { key: "autonomous", label: "Fase 3 · Autónomo",   sub: "Actúa solo 24/7",    done: false },
];

function PhaseRoadmap() {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="label-section mb-4">Roadmap de agentes</p>
      <div className="flex items-start gap-0">
        {PHASES.map((phase, i) => (
          <div key={phase.key} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  phase.done
                    ? "border-[#C9922A] bg-[#C9922A]"
                    : "border-slate-200 bg-white"
                }`}
              >
                {phase.done
                  ? <CheckCircle2 size={16} className="text-white" />
                  : <Circle size={14} className="text-slate-300" />
                }
              </div>
              {i < PHASES.length - 1 && (
                <div className={`h-0.5 flex-1 ${phase.done ? "bg-[#C9922A]/30" : "bg-slate-100"}`} />
              )}
            </div>
            <div className="mt-2 text-center">
              <p className={`text-xs font-black ${phase.done ? "text-slate-900" : "text-slate-400"}`}>
                {phase.label}
              </p>
              <p className="text-[11px] text-slate-400">{phase.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Active agent card ────────────────────────────────────────────────────────

function ActiveAgentCard({ agent }: { agent: AgentDef }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const Icon = agent.icon;
  const phase = PHASE_LABELS[agent.phase];
  const plan = PLAN_LABELS[agent.plan];

  function handleCopy() {
    if (!agent.preview) return;
    navigator.clipboard.writeText(agent.preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <div className="group flex flex-col rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">

      {/* Top accent strip */}
      <div className={`h-1 w-full rounded-t-[24px] ${agent.accentBg.replace("bg-", "bg-")} opacity-60`} />

      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${agent.accentBg}`}>
          <Icon size={20} className={agent.accentColor} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-sm font-black text-slate-900">{agent.name}</h3>
            <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Activo
            </span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-[#C9922A]">{agent.tagline}</p>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">{agent.description}</p>
        </div>
      </div>

      {/* Stat */}
      {agent.stat !== undefined && (
        <div className="mx-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-xl font-black text-slate-900">{agent.stat}</p>
            <p className="text-xs font-medium text-slate-500">{agent.statLabel}</p>
          </div>
          <Zap size={16} className={agent.accentColor} />
        </div>
      )}

      {/* Preview */}
      {agent.preview && (
        <div className="mx-5 mt-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left transition-colors hover:border-slate-200 hover:bg-white"
          >
            <span className="text-xs font-semibold text-slate-600">{agent.previewLabel}</span>
            <ChevronRight
              size={13}
              className={`text-slate-400 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
            />
          </button>
          {expanded && (
            <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs leading-5 text-slate-700">{agent.preview}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-2 flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {copied
                  ? <><Check size={12} className="text-emerald-600" /> Copiado</>
                  : <><Copy size={12} /> Copiar mensaje</>
                }
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-3 pt-3">
        <div className="flex gap-1.5">
          <Badge className={phase.className}>{phase.label}</Badge>
          <Badge className={plan.className}>{plan.label}</Badge>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex cursor-pointer items-center gap-1 text-xs font-bold text-[#C9922A] transition-colors hover:text-[#8A641F]"
        >
          {expanded ? "Ocultar" : "Ver acción"}
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Coming soon agent card ───────────────────────────────────────────────────

function ComingSoonCard({ agent }: { agent: AgentDef }) {
  const Icon = agent.icon;
  const plan = PLAN_LABELS[agent.plan];
  const phase = PHASE_LABELS[agent.phase];

  return (
    <div className="flex flex-col rounded-[24px] border border-slate-100 bg-slate-50/60 shadow-none transition-colors hover:border-slate-200 hover:bg-white">
      <div className="flex items-start gap-3 p-5 pb-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-100 ${agent.accentBg} opacity-50`}>
          <Icon size={18} className={agent.accentColor} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-sm font-black text-slate-500">{agent.name}</h3>
            <Badge className="border-slate-200 bg-white text-slate-400">
              Próximamente
            </Badge>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-slate-400">{agent.tagline}</p>
          <p className="mt-1.5 text-xs leading-5 text-slate-400">{agent.description}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <div className="flex gap-1.5">
          <Badge className={phase.className + " opacity-60"}>{phase.label}</Badge>
          <Badge className={plan.className + " opacity-60"}>{plan.label}</Badge>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
          <Lock size={11} /> {plan.label}
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentsClient() {
  const activeAgents = AGENTS.filter((a) => a.status === "active");
  const comingSoonAgents = AGENTS.filter((a) => a.status === "coming_soon");

  return (
    <div className="space-y-6">

      <PageHeader
        eyebrow="Agentes IA"
        title="Centro de Agentes IA"
        description="Tus agentes analizan datos reales de tu barbería y generan acciones de alto impacto. Actívalos, revisa sus sugerencias y ejecuta con un clic."
      />

      {/* Hero banner AaaS */}
      <div className="relative overflow-hidden rounded-[24px] border border-[#D5A84C]/20 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_60%,#111827_100%)] p-6 shadow-sm">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#C9922A]/30 bg-[#C9922A]/10">
              <Sparkles size={22} className="text-[#C9922A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-black uppercase tracking-widest text-[#D4AF66]">
                  Agents as a Service
                </p>
                <span className="rounded-full bg-[#C9922A]/20 px-2 py-0.5 text-[10px] font-black uppercase text-[#C9922A]">
                  Fase 1 activa
                </span>
              </div>
              <h2 className="mt-1 text-lg font-black text-white">
                {activeAgents.length} agentes trabajando por ti
              </h2>
              <p className="mt-1 max-w-lg text-sm leading-6 text-white/60">
                Cada agente accede a tus datos reales de Supabase — citas, clientes, caja, servicios —
                y genera acciones de alto impacto listas para ejecutar.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <Link
              href="/dashboard/ia"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
            >
              <Bot size={15} /> IA del Dueño
            </Link>
          </div>
        </div>
        {/* decorative glow */}
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#C9922A]/5 blur-3xl" />
      </div>

      {/* Phase roadmap */}
      <PhaseRoadmap />

      {/* Active agents */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="label-section">Disponibles ahora</p>
            <h2 className="section-heading mt-0.5">Agentes activos</h2>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {activeAgents.length} activos
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {activeAgents.map((agent) => (
            <ActiveAgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="label-section">En desarrollo</p>
            <h2 className="section-heading mt-0.5">Próximos agentes</h2>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
            {comingSoonAgents.length} en roadmap
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoonAgents.map((agent) => (
            <ComingSoonCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-black text-slate-900">¿Qué agente necesita tu barbería?</h3>
          <p className="mt-1 text-sm text-slate-500">
            Cuéntanos tu caso de uso y lo añadimos al roadmap. Los primeros en reportar acceden antes al beta.
          </p>
        </div>
        <Link href="/dashboard/whatsapp" className="btn-dark shrink-0 cursor-pointer">
          <Play size={14} /> Solicitar agente
        </Link>
      </div>

    </div>
  );
}
