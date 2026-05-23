"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Bot,
  Boxes,
  CalendarX2,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Copy,
  ExternalLink,
  Globe,
  Lock,
  Megaphone,
  MessageCircle,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Users,
  Video,
  Zap,
  Clock,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { runAgentAction } from "./actions";

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  barbershopName: string | null;
  barbershopSlug: string | null;
  lostClientsCount: number;
  todayAppointmentsCount: number;
  activeBarbersCount: number;
};

// ─── Agent types ──────────────────────────────────────────────────────────────

type AgentStatus = "active" | "beta" | "coming_soon";
type AgentPlan   = "starter" | "growth" | "premium";
type AgentPhase  = "copilot" | "semi-auto" | "autonomous";

type Agent = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  status: AgentStatus;
  plan: AgentPlan;
  phase: AgentPhase;
  accentColor: string;
  accentBg: string;
  metrics?: { label: string; value: string }[];
  preview?: string;
  previewLabel?: string;
  runnable?: boolean;
  liveMetricLabel?: string;
};

const AGENTS: Agent[] = [
  {
    id: "resenas",
    name: "Reseñas IA",
    tagline: "Más reseñas en Google, sin pedirlas tú",
    description: "Genera la solicitud de reseña perfecta al terminar cada cita y responde críticas negativas con tono profesional.",
    icon: Star,
    status: "active",
    plan: "starter",
    phase: "copilot",
    accentColor: "text-yellow-700",
    accentBg: "bg-yellow-50",
    metrics: [
      { label: "Solicitudes generadas", value: "—" },
      { label: "Tiempo ahorrado/semana", value: "≈ 2h" },
    ],
    previewLabel: "Mensaje de solicitud listo para enviar",
    preview: "Hola [Nombre] 💈 Gracias por tu visita en [Barbería]. Si tienes 1 minuto, tu reseña nos ayuda mucho: [link Google]. ¡Hasta pronto!",
    runnable: true,
    liveMetricLabel: "Solicitudes generadas",
  },
  {
    id: "retencion",
    name: "Retención IA",
    tagline: "Recupera el 30% de tus clientes perdidos",
    description: "Detecta clientes que llevan más de 30 días sin volver y genera un mensaje de WhatsApp personalizado y listo para enviar.",
    icon: RotateCcw,
    status: "active",
    plan: "growth",
    phase: "copilot",
    accentColor: "text-amber-700",
    accentBg: "bg-amber-50",
    metrics: [
      { label: "Clientes en riesgo", value: "—" },
      { label: "Tasa recuperación", value: "≈ 30%" },
    ],
    previewLabel: "Mensaje de recuperación personalizado",
    preview: "Hola [Nombre] 👋 Te echamos de menos en [Barbería]. ¿Te apetece un corte esta semana? Reserva aquí: [link]. Solo 2 min.",
    runnable: true,
    liveMetricLabel: "Clientes en riesgo",
  },
  {
    id: "huecos",
    name: "Huecos Libres IA",
    tagline: "Convierte huecos en ingresos hoy mismo",
    description: "Detecta horas vacías en tu agenda, calcula el ingreso perdido y genera el copy para Instagram Stories y WhatsApp.",
    icon: CalendarX2,
    status: "active",
    plan: "growth",
    phase: "copilot",
    accentColor: "text-blue-700",
    accentBg: "bg-blue-50",
    metrics: [
      { label: "Huecos detectados hoy", value: "—" },
      { label: "Ingreso potencial", value: "—" },
    ],
    previewLabel: "Copy para WhatsApp o Stories",
    preview: "🪒 Hoy quedan 2 huecos en [Barbería]. ¿Te lo reservo? Elige hora aquí → [link]. Responde este mensaje o entra directamente.",
    runnable: true,
    liveMetricLabel: "Huecos detectados hoy",
  },
  {
    id: "marketing",
    name: "Marketing Studio IA",
    tagline: "Plan de contenido semanal en 10 segundos",
    description: "Analiza tus datos reales y genera posts, stories y mensajes de WhatsApp listos para publicar esta semana.",
    icon: Megaphone,
    status: "active",
    plan: "growth",
    phase: "copilot",
    accentColor: "text-pink-700",
    accentBg: "bg-pink-50",
    metrics: [
      { label: "Posts generados", value: "—" },
      { label: "Canales cubiertos", value: "3" },
    ],
  },
  {
    id: "recepcionista",
    name: "Recepcionista IA WhatsApp",
    tagline: "Responde clientes 24/7, sin intervención",
    description: "Responde automáticamente a preguntas de disponibilidad en WhatsApp e Instagram. Consulta horarios y dirige al link de reservas.",
    icon: Bot,
    status: "beta",
    plan: "premium",
    phase: "semi-auto",
    accentColor: "text-emerald-700",
    accentBg: "bg-emerald-50",
    metrics: [
      { label: "Mensajes respondidos", value: "0" },
      { label: "Reservas creadas", value: "0" },
      { label: "Escalados a humano", value: "0" },
      { label: "Tiempo ahorrado/mes", value: "—" },
    ],
  },
  {
    id: "seo",
    name: "Presencia Local IA",
    tagline: "Aparece en 'barbería cerca de mí'",
    description: "Audita tu perfil de Google Business, detecta huecos y genera los textos que debes publicar cada semana para mejorar tu posición.",
    icon: Globe,
    status: "coming_soon",
    plan: "growth",
    phase: "copilot",
    accentColor: "text-indigo-700",
    accentBg: "bg-indigo-50",
  },
  {
    id: "caja",
    name: "Caja & Inventario IA",
    tagline: "Detecta ventas perdidas y productos bajos",
    description: "Analiza tu caja diaria, detecta productos con stock bajo, oportunidades de upsell y genera el resumen del día automáticamente.",
    icon: Banknote,
    status: "coming_soon",
    plan: "premium",
    phase: "copilot",
    accentColor: "text-[#C9922A]",
    accentBg: "bg-[#C9922A]/10",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business IA",
    tagline: "Tu barbería abierta 24h en WhatsApp",
    description: "Gestiona respuestas automáticas de confirmación, recordatorios de cita y campañas de retención directamente desde WhatsApp Business.",
    icon: MessageCircle,
    status: "coming_soon",
    plan: "premium",
    phase: "semi-auto",
    accentColor: "text-emerald-700",
    accentBg: "bg-emerald-50",
  },
];

// ─── Badge helpers ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AgentStatus, { label: string; dot: boolean; className: string }> = {
  active:      { label: "Activo",       dot: true,  className: "border-emerald-100 bg-emerald-50 text-emerald-700" },
  beta:        { label: "Beta",         dot: false, className: "border-amber-100 bg-amber-50 text-amber-700" },
  coming_soon: { label: "Próximamente", dot: false, className: "border-slate-200 bg-slate-50 text-slate-500" },
};

const PLAN_CONFIG: Record<AgentPlan, { label: string; className: string }> = {
  starter: { label: "Starter",    className: "border-slate-200 bg-slate-50 text-slate-600" },
  growth:  { label: "Growth",     className: "border-blue-100 bg-blue-50 text-blue-700" },
  premium: { label: "Premium IA", className: "border-[#C9922A]/20 bg-[#C9922A]/10 text-[#8A641F]" },
};

function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${className}`}>
      {children}
    </span>
  );
}

// ─── Value metrics bar ────────────────────────────────────────────────────────

function ValueMetric({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 bg-white px-4 py-4 text-center shadow-sm">
      <Icon size={16} className="text-[#C9922A]" />
      <p className="text-lg font-black text-slate-900">{value}</p>
      <p className="text-xs font-bold text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "BarberíaOS detecta oportunidades",
    sub: "Analiza tu agenda, clientes, caja y servicios en tiempo real.",
    icon: Zap,
  },
  {
    step: "02",
    title: "El agente prepara la acción",
    sub: "Genera el mensaje, la campaña o el informe listo para ejecutar.",
    icon: Bot,
  },
  {
    step: "03",
    title: "El dueño aprueba con un clic",
    sub: "Tú controlas lo que se envía. El agente no actúa sin tu OK.",
    icon: Check,
  },
  {
    step: "04",
    title: "El sistema mide resultados",
    sub: "Clientes recuperados, reservas generadas, tiempo ahorrado.",
    icon: TrendingUp,
  },
];

// ─── Phase roadmap ─────────────────────────────────────────────────────────────

const PHASES = [
  { label: "Fase 1 · Copiloto",  sub: "Genera y sugiere",  done: true  },
  { label: "Fase 2 · Semi-auto", sub: "Aprueba y ejecuta", done: false },
  { label: "Fase 3 · Autónomo",  sub: "Actúa solo 24/7",   done: false },
];

// ─── Agent Card ───────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: Agent }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [livePreview, setLivePreview] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const Icon = agent.icon;
  const status = STATUS_CONFIG[agent.status];
  const plan = PLAN_CONFIG[agent.plan];
  const isLocked = agent.status === "coming_soon";
  const displayPreview = livePreview ?? agent.preview;

  function handleCopy() {
    if (!displayPreview) return;
    navigator.clipboard.writeText(displayPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  async function handleRun() {
    setRunning(true);
    setRunError(null);
    try {
      const result = await runAgentAction(agent.id);
      if (result.ok && result.preview) {
        setLivePreview(result.preview);
        setLiveCount(result.count ?? null);
        setExpanded(true);
      } else {
        setRunError(result.error ?? "Error desconocido.");
      }
    } catch {
      setRunError("Error ejecutando el agente.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div
      className={`flex flex-col rounded-[24px] border bg-white shadow-sm transition-all duration-200 ${
        isLocked
          ? "border-slate-100 opacity-65 hover:opacity-80"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Accent line top */}
      {!isLocked && (
        <div className={`h-0.5 w-full rounded-t-[24px] ${agent.accentBg}`} />
      )}

      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            isLocked ? "border border-slate-100 bg-slate-50" : agent.accentBg
          }`}
        >
          <Icon size={19} className={isLocked ? "text-slate-300" : agent.accentColor} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className={`text-sm font-black ${isLocked ? "text-slate-400" : "text-slate-900"}`}>
              {agent.name}
            </h3>
            <Pill className={status.className}>
              {status.dot && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              )}
              {status.label}
            </Pill>
          </div>
          <p className={`mt-0.5 text-xs font-semibold ${isLocked ? "text-slate-400" : "text-[#C9922A]"}`}>
            {agent.tagline}
          </p>
          <p className={`mt-1.5 text-xs leading-5 ${isLocked ? "text-slate-400" : "text-slate-500"}`}>
            {agent.description}
          </p>
        </div>
      </div>

      {/* Metrics (active/beta only) */}
      {!isLocked && agent.metrics && agent.metrics.length > 0 && (
        <div className="mx-5 grid grid-cols-2 gap-2 pb-3">
          {agent.metrics.map((m) => {
            const isLiveMetric = agent.liveMetricLabel && m.label === agent.liveMetricLabel;
            const displayValue = isLiveMetric && liveCount !== null ? String(liveCount) : m.value;
            const isHighlighted = isLiveMetric && liveCount !== null && liveCount > 0;
            return (
              <div
                key={m.label}
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-center"
              >
                <p className={`text-sm font-black ${isHighlighted ? "text-amber-700" : "text-slate-900"}`}>
                  {displayValue}
                </p>
                <p className="text-[10px] font-medium text-slate-500">{m.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Run error */}
      {runError && (
        <p className="mx-5 mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{runError}</p>
      )}

      {/* Preview expandible */}
      {!isLocked && displayPreview && (
        <div className="mx-5 pb-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-600 transition-colors hover:border-slate-200 hover:bg-white"
          >
            {livePreview ? "Mensaje generado · listo para copiar" : (agent.previewLabel ?? "Ver ejemplo")}
            <ChevronRight
              size={13}
              className={`text-slate-400 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
            />
          </button>
          {expanded && (
            <div className={`mt-2 rounded-2xl border p-3 ${livePreview ? "border-amber-100 bg-amber-50" : "border-slate-100 bg-slate-50"}`}>
              <p className="text-xs leading-5 text-slate-700">{displayPreview}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="mt-2 flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                {copied
                  ? <><Check size={12} className="text-emerald-600" /> Copiado</>
                  : <><Copy size={12} /> Copiar</>
                }
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <div className="flex gap-1.5">
          <Pill className={plan.className}>{plan.label}</Pill>
        </div>
        {isLocked ? (
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Lock size={10} /> Próximamente
          </span>
        ) : agent.runnable ? (
          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#C9922A]/30 bg-[#C9922A]/10 px-3 py-1.5 text-xs font-black text-[#8A641F] transition-colors hover:bg-[#C9922A]/20 disabled:cursor-wait disabled:opacity-60"
          >
            {running ? (
              <><Zap size={12} className="animate-pulse" /> Ejecutando...</>
            ) : livePreview ? (
              <><Check size={12} className="text-emerald-600" /> Listo · Re-ejecutar</>
            ) : (
              <><Play size={12} /> Ejecutar agente</>
            )}
          </button>
        ) : displayPreview ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex cursor-pointer items-center gap-1 text-xs font-bold text-[#C9922A] transition-colors hover:text-[#8A641F]"
          >
            {expanded ? "Ocultar" : "Ver acción"} <ArrowRight size={12} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentsClient({
  barbershopName,
  lostClientsCount,
  todayAppointmentsCount,
  activeBarbersCount,
}: Props) {
  const activeAgents   = AGENTS.filter((a) => a.status === "active");
  const betaAgents     = AGENTS.filter((a) => a.status === "beta");
  const comingSoon     = AGENTS.filter((a) => a.status === "coming_soon");

  const hasLostClients = lostClientsCount > 0;
  const hasTodayAppts  = todayAppointmentsCount > 0;
  const hasBarbers     = activeBarbersCount > 0;

  const recommendations = [
    hasLostClients && {
      icon: RotateCcw,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      title: `${lostClientsCount} clientes sin volver en +30 días`,
      body: "Activa el Agente Retención y genera sus mensajes de WhatsApp en segundos. El 30% vuelve con un mensaje bien redactado.",
      cta: "Activar Retención IA",
      scroll: "retencion",
    },
    !hasTodayAppts && hasBarbers && {
      icon: CalendarX2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      title: "Huecos libres detectados en tu agenda",
      body: "El Agente Huecos Libres genera el copy de Instagram Stories y WhatsApp en 10 segundos. Un post puede llenar tu tarde.",
      cta: "Ver Agente Huecos",
      scroll: "huecos",
    },
    {
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      title: "Activa el Agente Reseñas después de cada cita",
      body: "Las reseñas de Google determinan si te encuentran o te ignoran. Un mensaje bien redactado tarda 10 segundos.",
      cta: "Ver Agente Reseñas",
      scroll: "resenas",
    },
    {
      icon: Bot,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      title: "Conecta WhatsApp para automatizar respuestas",
      body: "El Agente Recepcionista IA responde '¿Tenéis hueco?' 24 horas al día sin que toques el teléfono. Disponible en Premium IA.",
      cta: "Ver Premium IA",
      scroll: "premium",
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    title: string;
    body: string;
    cta: string;
    scroll: string;
  }[];

  return (
    <div className="space-y-8">

      <PageHeader
        eyebrow="Agents as a Service"
        title="Agentes IA para hacer crecer tu barbería"
        description={`Tus agentes trabajan mientras tú cortas${barbershopName ? ` en ${barbershopName}` : ""}: responden clientes, llenan huecos, piden reseñas y recuperan citas perdidas.`}
        action={
          <div className="flex flex-wrap gap-2">
            <a
              href="#premium"
              className="btn-dark cursor-pointer"
            >
              <Sparkles size={15} /> Activar Premium IA
            </a>
            <a href="#como-funciona" className="btn-outline cursor-pointer">
              Ver cómo funciona
            </a>
          </div>
        }
      />

      {/* Badge AaaS */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D5A84C]/30 bg-[#C9922A]/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#8A641F]">
          <Sparkles size={11} className="text-[#C9922A]" />
          Nuevo · Agents as a Service
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Fase 1 activa
        </span>
      </div>

      {/* ── Value metrics ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <ValueMetric
          icon={Clock}
          label="Tiempo ahorrado"
          value="≈ 4h"
          sub="por semana estimado"
        />
        <ValueMetric
          icon={CalendarX2}
          label="Huecos detectados"
          value={hasBarbers ? "Activo" : "—"}
          sub="configura barberos"
        />
        <ValueMetric
          icon={RotateCcw}
          label="Clientes recuperables"
          value={lostClientsCount > 0 ? String(lostClientsCount) : "—"}
          sub="+30 días sin visita"
        />
        <ValueMetric
          icon={Star}
          label="Reseñas pendientes"
          value={todayAppointmentsCount > 0 ? String(todayAppointmentsCount) : "—"}
          sub="citas de hoy"
        />
        <ValueMetric
          icon={TrendingUp}
          label="Agentes activos"
          value={String(activeAgents.length)}
          sub={`de ${AGENTS.length} disponibles`}
        />
      </div>

      {/* ── Próxima acción recomendada ───────────────────────────────────── */}
      <section>
        <p className="label-section mb-3">Inteligencia operativa</p>
        <h2 className="section-heading mb-4">Próxima acción recomendada</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {recommendations.slice(0, 4).map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.title}
                className={`flex items-start gap-3 rounded-2xl border ${rec.border} ${rec.bg} p-4`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/60 ${rec.color}`}>
                  <Icon size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-slate-900">{rec.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{rec.body}</p>
                  <a
                    href={`#${rec.scroll}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-700 underline"
                  >
                    {rec.cta} <ArrowRight size={11} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Active agents ────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="label-section">Disponibles ahora</p>
            <h2 className="section-heading mt-0.5">Agentes activos</h2>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {activeAgents.length} listos
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {activeAgents.map((agent) => (
            <div key={agent.id} id={agent.id}>
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Beta agents ──────────────────────────────────────────────────── */}
      {betaAgents.length > 0 && (
        <section>
          <div className="mb-4">
            <p className="label-section">Acceso anticipado</p>
            <h2 className="section-heading mt-0.5">En beta privada</h2>
            <p className="section-subtext">Disponibles para clientes Premium IA. Acceso anticipado limitado.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {betaAgents.map((agent) => (
              <div key={agent.id} id={agent.id}>
                <AgentCard agent={agent} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Coming soon ──────────────────────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <p className="label-section">En construcción</p>
          <h2 className="section-heading mt-0.5">Próximos agentes</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoon.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* ── Cómo funciona ────────────────────────────────────────────────── */}
      <section id="como-funciona" className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="label-section mb-1">Transparencia total</p>
        <h2 className="section-heading">Cómo funcionan los agentes</h2>
        <p className="section-subtext mb-6">
          Tú siempre controlas lo que se envía. Nunca actúa sin tu aprobación.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#C9922A]/20 bg-[#C9922A]/10 text-xs font-black text-[#C9922A]">
                    {step.step}
                  </span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                  <Icon size={16} className="text-slate-600" />
                </div>
                <p className="text-sm font-black text-slate-900">{step.title}</p>
                <p className="text-xs leading-5 text-slate-500">{step.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Phase roadmap ────────────────────────────────────────────────── */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="label-section mb-4">Roadmap de autonomía</p>
        <div className="flex items-start">
          {PHASES.map((phase, i) => (
            <div key={phase.label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    phase.done
                      ? "border-[#C9922A] bg-[#C9922A]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {phase.done
                    ? <CheckCircle2 size={15} className="text-white" />
                    : <Circle size={13} className="text-slate-300" />
                  }
                </div>
                {i < PHASES.length - 1 && (
                  <div className={`h-0.5 flex-1 ${phase.done ? "bg-[#C9922A]/30" : "bg-slate-100"}`} />
                )}
              </div>
              <div className="mt-2 px-1 text-center">
                <p className={`text-xs font-black ${phase.done ? "text-slate-900" : "text-slate-400"}`}>
                  {phase.label}
                </p>
                <p className="text-[11px] text-slate-400">{phase.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Premium IA Upsell ────────────────────────────────────────────── */}
      <section id="premium">
        <div
          className="relative overflow-hidden rounded-[28px] border border-[#D5A84C]/25 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_60%,#111827_100%)] p-6 shadow-sm lg:p-8"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#C9922A]/8 blur-3xl" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#C9922A]" />
                <p className="text-xs font-black uppercase tracking-widest text-[#D4AF66]">
                  Premium IA
                </p>
              </div>
              <h2 className="mt-2 text-2xl font-black text-white">
                Tu barbería en piloto automático
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
                Empleados digitales que trabajan 24/7 por tu barbería. Sin comisión. Con clientes propios. Con agentes IA.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  "Recepcionista IA WhatsApp 24/7",
                  "Reseñas automáticas post-cita",
                  "Retención de clientes perdidos",
                  "Huecos libres → campañas automáticas",
                  "Reporte diario de negocio",
                  "Dashboard de agentes y métricas",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckCircle2 size={14} className="shrink-0 text-[#C9922A]" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center lg:min-w-[200px]">
              <p className="text-3xl font-black text-white">149€</p>
              <p className="text-xs text-white/50">/mes · sin permanencia</p>
              <Link
                href="/dashboard/whatsapp"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#C9922A]/30 bg-[#C9922A] px-4 py-3 text-sm font-black text-white transition-colors hover:bg-[#B07820]"
              >
                <Play size={14} /> Solicitar activación
              </Link>
              <p className="text-[11px] text-white/30">Sin coste de activación</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Andrés Video Studio — Ecosistema ─────────────────────────────── */}
      <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
            <Video size={20} className="text-slate-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-black text-slate-900">Andrés Video Studio</h3>
              <Pill className="border-slate-200 bg-slate-50 text-slate-500">
                Suite premium futura
              </Pill>
              <Pill className="border-violet-100 bg-violet-50 text-violet-700">
                Ecosistema Andrés AI
              </Pill>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Crea guiones, vídeos y contenido premium para negocios locales. Una suite especializada
              para barberías que quieren crecer con contenido de alto nivel en redes sociales.
              Parte del ecosistema de agencias de inteligencia artificial de Andrés Rendón.
            </p>
            <a
              href="#"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-slate-700"
            >
              <ExternalLink size={12} /> Más información próximamente
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
