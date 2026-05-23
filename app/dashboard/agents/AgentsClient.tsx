"use client";

import { useState } from "react";
import {
  Bot,
  Banknote,
  Boxes,
  CalendarX2,
  Globe,
  Megaphone,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Star,
  Zap,
  ChevronRight,
  Copy,
  Check,
  Lock,
  Play,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

// ─── Types ───────────────────────────────────────────────────────────────────

type AgentPhase = "copilot" | "semi-auto" | "autonomous";
type AgentPlan = "starter" | "growth" | "premium";
type AgentStatus = "active" | "inactive" | "coming_soon";

type AgentDef = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  phase: AgentPhase;
  plan: AgentPlan;
  status: AgentStatus;
  stat?: string;
  statLabel?: string;
  color: string;
  bgColor: string;
  preview?: string;
};

// ─── Agent registry ──────────────────────────────────────────────────────────

const AGENTS: AgentDef[] = [
  {
    id: "retencion",
    name: "Retención IA",
    description: "Detecta clientes en riesgo y genera mensajes de WhatsApp personalizados para recuperarlos antes de que se vayan.",
    icon: RotateCcw,
    phase: "copilot",
    plan: "growth",
    status: "active",
    stat: "0",
    statLabel: "clientes en riesgo",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    preview: "Hola [Nombre] 👋 Te echamos de menos. Llevamos 35 días sin verte. ¿Te apetece un corte esta semana? Reserva aquí: tu-barberia.com/r/slug",
  },
  {
    id: "huecos",
    name: "Huecos Libres IA",
    description: "Detecta huecos en la agenda de hoy y genera el copy para Instagram Stories y WhatsApp listo para compartir.",
    icon: CalendarX2,
    phase: "copilot",
    plan: "growth",
    status: "active",
    stat: "—",
    statLabel: "huecos hoy",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    preview: "🪒 Hoy quedan 2 huecos libres en [Barbería]. ¿Te lo pongo? Reserva ahora → tu-barberia.com/r/slug",
  },
  {
    id: "resenas",
    name: "Reseñas IA",
    description: "Genera solicitudes de reseña personalizadas al final del corte y respuestas profesionales a reseñas negativas.",
    icon: Star,
    phase: "copilot",
    plan: "starter",
    status: "active",
    stat: "—",
    statLabel: "citas completadas hoy",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    preview: "Hola [Nombre]! Gracias por tu visita hoy en [Barbería] 💈 Si tienes un minuto, nos ayudarías mucho dejando tu reseña aquí: [link Google]",
  },
  {
    id: "recepcionista",
    name: "Recepcionista IA",
    description: "Responde automáticamente a preguntas de disponibilidad en WhatsApp e Instagram y dirige al link de reservas.",
    icon: Bot,
    phase: "semi-auto",
    plan: "growth",
    status: "coming_soon",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  {
    id: "marketing",
    name: "Marketing Studio IA",
    description: "Analiza tus datos y genera un plan de contenido semanal para Instagram, WhatsApp y Google Business.",
    icon: Megaphone,
    phase: "copilot",
    plan: "growth",
    status: "active",
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    preview: "Plan de contenido generado para la semana del 26 mayo: Lunes — Post de corte favorito de la semana. Miércoles — Story de hueco libre. Viernes — Reseña de cliente destacado.",
  },
  {
    id: "caja",
    name: "Caja & Finanzas IA",
    description: "Genera el resumen diario de caja con análisis de tendencias e identifica los días y horas más rentables.",
    icon: Banknote,
    phase: "copilot",
    plan: "premium",
    status: "coming_soon",
    color: "text-[#C9922A]",
    bgColor: "bg-[#C9922A]/10",
  },
  {
    id: "seo",
    name: "SEO & Presencia Local IA",
    description: "Audita tu perfil de Google Business y genera textos para publicar semanalmente y mejorar tu posición local.",
    icon: Globe,
    phase: "copilot",
    plan: "growth",
    status: "coming_soon",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business IA",
    description: "Gestiona respuestas automáticas de WhatsApp Business para consultas, confirmaciones y recordatorios de cita.",
    icon: MessageCircle,
    phase: "semi-auto",
    plan: "premium",
    status: "coming_soon",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
  {
    id: "inventario",
    name: "Inventario & Ventas IA",
    description: "Monitoriza el stock, predice cuándo se agotarán los productos y genera el pedido de reposición automáticamente.",
    icon: Boxes,
    phase: "copilot",
    plan: "premium",
    status: "coming_soon",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
  },
];

// ─── Phase badge ──────────────────────────────────────────────────────────────

const phaseMeta: Record<AgentPhase, { label: string; color: string }> = {
  copilot: { label: "Copiloto", color: "bg-blue-50 text-blue-700 border-blue-100" },
  "semi-auto": { label: "Semi-auto", color: "bg-amber-50 text-amber-700 border-amber-100" },
  autonomous: { label: "Autónomo", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
};

const planMeta: Record<AgentPlan, { label: string; color: string }> = {
  starter: { label: "Starter", color: "bg-slate-50 text-slate-600 border-slate-200" },
  growth: { label: "Growth", color: "bg-blue-50 text-blue-700 border-blue-100" },
  premium: { label: "Premium", color: "bg-[#C9922A]/10 text-[#8A641F] border-[#C9922A]/20" },
};

// ─── Agent card ───────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: AgentDef }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const Icon = agent.icon;
  const phase = phaseMeta[agent.phase];
  const plan = planMeta[agent.plan];
  const isLocked = agent.status === "coming_soon";

  function copyPreview() {
    if (!agent.preview) return;
    navigator.clipboard.writeText(agent.preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`group flex flex-col rounded-[24px] border bg-white shadow-sm transition-all duration-200 ${
        isLocked
          ? "border-slate-200 opacity-70"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Card header */}
      <div className="flex items-start gap-4 p-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${agent.bgColor}`}
        >
          <Icon size={20} className={agent.color} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-slate-900">{agent.name}</h3>
            {isLocked && (
              <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <Lock size={9} /> Próximamente
              </span>
            )}
            {!isLocked && (
              <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Activo
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-5 text-slate-500">{agent.description}</p>
        </div>
      </div>

      {/* Stats row */}
      {agent.stat !== undefined && !isLocked && (
        <div className="mx-5 mb-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-2xl font-black text-slate-900">{agent.stat}</p>
            <p className="text-xs font-medium text-slate-500">{agent.statLabel}</p>
          </div>
          <Zap size={18} className={agent.color} />
        </div>
      )}

      {/* Preview text */}
      {agent.preview && !isLocked && expanded && (
        <div className="mx-5 mb-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-700">{agent.preview}</p>
          </div>
          <button
            type="button"
            onClick={copyPreview}
            className="mt-2 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            {copied ? "Copiado" : "Copiar mensaje"}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <div className="flex gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${phase.color}`}
          >
            {phase.label}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${plan.color}`}
          >
            {plan.label}
          </span>
        </div>

        {!isLocked && agent.preview && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-bold text-[#C9922A] transition-colors hover:text-[#8A641F]"
          >
            {expanded ? "Ocultar" : "Ver acción"}
            <ChevronRight
              size={13}
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        )}

        {isLocked && (
          <span className="text-xs font-medium text-slate-400">
            Disponible en {plan.label}
          </span>
        )}
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
        description="Tus agentes trabajan mientras tú cortas. Actívalos, revisa sus sugerencias y ejecuta acciones con un clic."
      />

      {/* Intro banner */}
      <div className="flex items-start gap-4 rounded-[24px] border border-[#D5A84C]/25 bg-[linear-gradient(135deg,#111827_0%,#1e293b_100%)] p-5 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#C9922A]/30 bg-[#C9922A]/10">
          <Sparkles size={18} className="text-[#C9922A]" />
        </div>
        <div>
          <p className="font-black text-white">Sistema operativo con IA</p>
          <p className="mt-1 text-sm leading-6 text-white/60">
            BarberíaOS tiene acceso a todos tus datos (citas, clientes, caja, servicios) y los usa para
            generar acciones de alto impacto. En Fase 1, los agentes te dan el texto listo para copiar.
            En Fase 2-3, actúan solos con tu aprobación.
          </p>
        </div>
      </div>

      {/* Active agents */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="label-section">Disponibles ahora</p>
            <h2 className="section-heading mt-0.5">Agentes activos</h2>
          </div>
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {activeAgents.length} agentes
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div>
        <div className="mb-4">
          <p className="label-section">En desarrollo</p>
          <h2 className="section-heading mt-0.5">Próximamente</h2>
          <p className="section-subtext">
            Agentes en construcción. Actívate en lista de espera para acceder antes.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoonAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Roadmap CTA */}
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-black text-slate-900">
              ¿Quieres un agente específico para tu barbería?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Comparte tu caso de uso y lo añadimos al roadmap. Los primeros en reportar
              acceden antes al beta.
            </p>
          </div>
          <a
            href="/dashboard/whatsapp"
            className="btn-dark shrink-0"
          >
            <Play size={14} /> Solicitar agente
          </a>
        </div>
      </div>
    </div>
  );
}
