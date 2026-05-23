"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Globe,
  Info,
  Loader2,
  LockKeyhole,
  MessageCircle,
  MonitorSmartphone,
  QrCode,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type {
  ShieldCategoryScores,
  ShieldCommercialCta,
  ShieldIssue,
  ShieldRecommendation,
  ShieldSignal,
} from "@/src/lib/audit/shield-result";

type CheckStatus = "ok" | "warn" | "error";

type AuditCheck = {
  name: string;
  status: CheckStatus;
  detail: string;
  recommendation?: string;
};

type AuditResult = {
  audit_id: string;
  url: string;
  score: number;
  category_scores?: ShieldCategoryScores;
  detected_signals?: ShieldSignal[];
  issues?: ShieldIssue[];
  recommendations?: ShieldRecommendation[];
  recommended_cta?: ShieldCommercialCta;
  security: AuditCheck[];
  seo: AuditCheck[];
  conversion: AuditCheck[];
  barberiaos: AuditCheck[];
  customer_conversion?: AuditCheck[];
  summary: AuditCheck[];
};

export type AuditHistoryEntry = {
  id: string;
  website_url: string;
  score: number | null;
  status: string;
  created_at: string;
  report: (Partial<AuditResult> & Record<string, unknown>) | null;
};

type Phase = "idle" | "loading" | "done" | "error" | "maintenance";
type AlertTone = "info" | "success" | "warning" | "error";
type ManualReviewStatus = "idle" | "saving" | "saved" | "error";

const SHIELD_SIGNALS = [
  {
    title: "Seguridad básica",
    description: "HTTPS, cabeceras visibles y señales de navegación segura.",
    icon: ShieldCheck,
  },
  {
    title: "SEO visible",
    description: "Título, descripción, estructura pública y metadatos clave.",
    icon: Search,
  },
  {
    title: "Reserva online",
    description: "Botones de reserva, WhatsApp y caminos claros hacia cita.",
    icon: TrendingUp,
  },
  {
    title: "Confianza móvil",
    description: "Señales de credibilidad que ayudan desde el primer vistazo.",
    icon: MonitorSmartphone,
  },
  {
    title: "Conversión a clientes",
    description: "Prioridades para convertir visitas en citas y clientes recurrentes.",
    icon: BarChart3,
  },
] as const;

const CATEGORY_SCORE_META: Record<keyof ShieldCategoryScores, { label: string; icon: LucideIcon; description: string }> = {
  security_basic: {
    label: "Seguridad básica",
    icon: ShieldCheck,
    description: "HTTPS y señales públicas de navegación segura.",
  },
  seo_visible: {
    label: "SEO visible",
    icon: Search,
    description: "Título, descripción y señales para búsquedas locales.",
  },
  online_booking: {
    label: "Reserva online",
    icon: CalendarCheck,
    description: "Camino claro para reservar o pedir cita.",
  },
  mobile_trust: {
    label: "Confianza móvil",
    icon: MonitorSmartphone,
    description: "Credibilidad visible desde el primer vistazo.",
  },
  customer_conversion: {
    label: "Conversión a clientes",
    icon: BarChart3,
    description: "Reservas, seguimiento y activación comercial.",
  },
};

const EMPTY_RECOMMENDATIONS = [
  "Resumen ejecutivo de confianza digital",
  "Puntos visibles que frenan reservas",
  "Prioridades de mejora para convertir mejor",
] as const;

const CLIENT_DEFAULT_RECOMMENDATIONS: ShieldRecommendation[] = [
  {
    id: "booking-button",
    title: "Añade botón de reserva visible",
    detail: "Haz que reservar sea la acción principal desde móvil.",
    priority: "alta",
    category: "online_booking",
  },
  {
    id: "whatsapp-direct",
    title: "Añade WhatsApp directo",
    detail: "Reduce fricción para clientes que quieren preguntar o reservar ahora.",
    priority: "alta",
    category: "online_booking",
  },
  {
    id: "barberiaos-qr",
    title: "Activa QR de reservas BarberíaOS",
    detail: "Conecta escaparate, mostrador, Instagram y Google con tu agenda.",
    priority: "alta",
    category: "customer_conversion",
  },
];

function scoreTheme(score: number | null) {
  if (score === null) {
    return {
      stroke: "#94A3B8",
      text: "text-slate-500",
      label: "Pendiente",
      bg: "bg-slate-50 border-slate-200",
    };
  }
  if (score >= 80) return { stroke: "#10B981", text: "text-emerald-600", label: "Fuerte", bg: "bg-emerald-50 border-emerald-200" };
  if (score >= 60) return { stroke: "#D5A84C", text: "text-amber-600", label: "Mejorable", bg: "bg-amber-50 border-amber-200" };
  if (score >= 40) return { stroke: "#F97316", text: "text-orange-600", label: "Atención", bg: "bg-orange-50 border-orange-200" };
  return { stroke: "#EF4444", text: "text-red-600", label: "Revisar", bg: "bg-red-50 border-red-200" };
}

function normalizePublicUrl(value: string): URL | null {
  try {
    const parsed = new URL(value.trim());
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isObviouslyInternalHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") return true;
  if (/^10\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
  if (/^169\.254\./.test(host)) return true;
  return false;
}

export function ShieldScoreCard({ score }: { score: number | null }) {
  const safeScore = score ?? 0;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (safeScore / 100) * circ;
  const theme = scoreTheme(score);

  return (
    <div className="flex flex-col items-center gap-2 rounded-[24px] border border-slate-200 bg-[#FAFBFF] px-5 py-6">
      <svg width="136" height="136" viewBox="0 0 136 136" aria-label={`Puntuación Shield: ${safeScore} de 100`}>
        <circle cx="68" cy="68" r={r} fill="none" stroke="#EEF3F8" strokeWidth="12" />
        <circle
          cx="68"
          cy="68"
          r={r}
          fill="none"
          stroke={theme.stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 68 68)"
        />
        <text x="68" y="63" textAnchor="middle" fontSize="32" fontWeight="900" fill="#080A0F">
          {score ?? "--"}
        </text>
        <text x="68" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#94A3B8">
          Shield
        </text>
      </svg>
      <span className={`rounded-full border px-3 py-1 text-xs font-black ${theme.text} ${theme.bg}`}>
        {theme.label}
      </span>
    </div>
  );
}

export function AuditSignalCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
          <Icon size={17} className="text-[#C9922A]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-black text-[#080A0F]">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  );
}

function scoreFromChecks(checks: AuditCheck[] | undefined) {
  if (!checks || checks.length === 0) return 55;
  const total = checks.reduce((sum, check) => {
    if (check.status === "ok") return sum + 100;
    if (check.status === "warn") return sum + 65;
    return sum + 25;
  }, 0);

  return Math.round(total / checks.length);
}

function getCategoryScores(result: AuditResult): ShieldCategoryScores {
  return result.category_scores ?? {
    security_basic: scoreFromChecks(result.security),
    seo_visible: scoreFromChecks(result.seo),
    online_booking: scoreFromChecks(result.conversion),
    mobile_trust: scoreFromChecks(result.barberiaos),
    customer_conversion: scoreFromChecks(result.customer_conversion ?? result.conversion),
  };
}

function CategoryScoreGrid({ scores }: { scores: ShieldCategoryScores }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {(Object.keys(CATEGORY_SCORE_META) as Array<keyof ShieldCategoryScores>).map((key) => {
        const meta = CATEGORY_SCORE_META[key];
        const Icon = meta.icon;
        const score = scores[key];
        const theme = scoreTheme(score);

        return (
          <div key={key} className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                <Icon size={16} className="text-[#C9922A]" />
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-xs font-black ${theme.text} ${theme.bg}`}>
                {score}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-black text-[#080A0F]">{meta.label}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">{meta.description}</p>
          </div>
        );
      })}
    </div>
  );
}

export function AuditRecommendationCard({
  check,
}: {
  check: AuditCheck;
}) {
  const [open, setOpen] = useState(false);
  const cfg = CHECK_STYLE[check.status] ?? CHECK_STYLE.warn;
  const Icon = cfg.icon;

  return (
    <div className={`rounded-2xl border px-4 py-3 ${cfg.bg} ${cfg.border}`}>
      <div className="flex items-start gap-3">
        <Icon size={15} className={`mt-0.5 shrink-0 ${cfg.color}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-[#080A0F]">{check.name}</p>
            <span className={`rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">{check.detail}</p>
          {check.recommendation && (
            <>
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#8A641F] hover:underline"
              >
                {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {open ? "Ocultar prioridad" : "Ver prioridad"}
              </button>
              {open && (
                <p className="mt-2 border-l-2 border-[#C9922A]/35 pl-3 text-xs leading-5 text-slate-700">
                  {check.recommendation}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuditStatusAlert({
  tone = "info",
  title,
  children,
  action,
}: {
  tone?: AlertTone;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const cfg = ALERT_STYLE[tone];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${cfg.shell}`}>
      <Icon size={16} className={`mt-0.5 shrink-0 ${cfg.iconColor}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-black ${cfg.title}`}>{title}</p>
        <div className="mt-1 text-xs leading-5 text-slate-600">{children}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}

const CHECK_STYLE: Record<CheckStatus, { icon: LucideIcon; color: string; bg: string; border: string; label: string }> = {
  ok: { icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Correcto" },
  warn: { icon: AlertTriangle, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", label: "Mejora" },
  error: { icon: Info, color: "text-red-700", bg: "bg-red-50", border: "border-red-200", label: "Atención" },
};

const ALERT_STYLE: Record<AlertTone, { icon: LucideIcon; iconColor: string; shell: string; title: string }> = {
  info: {
    icon: ShieldCheck,
    iconColor: "text-[#C9922A]",
    shell: "border-[#C9922A]/20 bg-[#C9922A]/5",
    title: "text-[#080A0F]",
  },
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    shell: "border-emerald-200 bg-emerald-50",
    title: "text-emerald-800",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    shell: "border-amber-200 bg-amber-50",
    title: "text-amber-800",
  },
  error: {
    icon: Info,
    iconColor: "text-red-600",
    shell: "border-red-200 bg-red-50",
    title: "text-red-800",
  },
};

type CategoryKey = "security" | "seo" | "conversion" | "barberiaos" | "customer_conversion";

const CATEGORY_META: Record<CategoryKey, { label: string; icon: LucideIcon; description: string }> = {
  security: { label: "Seguridad básica", icon: LockKeyhole, description: "HTTPS, TLS y cabeceras públicas." },
  seo: { label: "SEO visible", icon: Search, description: "Metadatos y señales que entiende Google." },
  conversion: { label: "Reserva online", icon: TrendingUp, description: "Rutas claras hacia reserva, WhatsApp o contacto." },
  barberiaos: { label: "Confianza móvil", icon: MonitorSmartphone, description: "Señales para decidir rápido desde el móvil." },
  customer_conversion: { label: "Conversión a clientes", icon: BarChart3, description: "Acciones que convierten visitas en citas reales." },
};

function CategorySection({ categoryKey, checks }: { categoryKey: CategoryKey; checks: AuditCheck[] }) {
  const meta = CATEGORY_META[categoryKey];
  const Icon = meta.icon;
  const counts = {
    error: checks.filter((check) => check.status === "error").length,
    warn: checks.filter((check) => check.status === "warn").length,
    ok: checks.filter((check) => check.status === "ok").length,
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Icon size={16} className="text-[#C9922A]" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-[#080A0F]">{meta.label}</h3>
            {counts.error > 0 && <Pill tone="error">{counts.error} atención</Pill>}
            {counts.warn > 0 && <Pill tone="warning">{counts.warn} mejora</Pill>}
            {counts.ok > 0 && <Pill tone="success">{counts.ok} correcto</Pill>}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{meta.description}</p>
        </div>
      </div>

      {checks.length > 0 ? (
        <div className="space-y-2">
          {checks.map((check, index) => (
            <AuditRecommendationCard key={`${check.name}-${index}`} check={check} />
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-slate-500">Sin datos para esta señal.</p>
      )}
    </div>
  );
}

function Pill({ tone, children }: { tone: "success" | "warning" | "error"; children: ReactNode }) {
  const classes = {
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
  }[tone];

  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${classes}`}>{children}</span>;
}

function HistoryRow({
  entry,
  onLoad,
}: {
  entry: AuditHistoryEntry;
  onLoad: (result: AuditResult) => void;
}) {
  const date = new Date(entry.created_at).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = new Date(entry.created_at).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const theme = scoreTheme(entry.score);

  function handleLoad() {
    if (!entry.report) return;
    const security = Array.isArray(entry.report.security) ? entry.report.security as AuditCheck[] : [];
    const seo = Array.isArray(entry.report.seo) ? entry.report.seo as AuditCheck[] : [];
    const conversion = Array.isArray(entry.report.conversion) ? entry.report.conversion as AuditCheck[] : [];
    const barberiaos = Array.isArray(entry.report.barberiaos) ? entry.report.barberiaos as AuditCheck[] : [];
    const customerConversion = Array.isArray(entry.report.customer_conversion)
      ? entry.report.customer_conversion as AuditCheck[]
      : [];
    onLoad({
      audit_id: entry.id,
      url: entry.website_url,
      score: entry.score ?? scoreFromChecks([...security, ...seo, ...conversion, ...barberiaos]),
      category_scores: entry.report.category_scores as ShieldCategoryScores | undefined,
      detected_signals: entry.report.detected_signals as ShieldSignal[] | undefined,
      issues: entry.report.issues as ShieldIssue[] | undefined,
      recommendations: entry.report.recommendations as ShieldRecommendation[] | undefined,
      recommended_cta: entry.report.recommended_cta as ShieldCommercialCta | undefined,
      security,
      seo,
      conversion,
      barberiaos,
      customer_conversion: customerConversion,
      summary: Array.isArray(entry.report.summary) ? entry.report.summary as AuditCheck[] : [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-[#F6F8FB] px-4 py-3">
      <Globe size={13} className="shrink-0 text-slate-400" />
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-600" title={entry.website_url}>
        {entry.website_url}
      </span>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Clock size={11} />
        {date} · {time}
      </div>
      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-black ${theme.text} ${theme.bg}`}>
        {entry.score ?? "Manual"}
      </span>
      {entry.report && entry.score !== null ? (
        <button
          type="button"
          onClick={handleLoad}
          className="shrink-0 rounded-xl border border-[#C9922A]/25 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#7A5218] transition hover:border-[#C9922A]/45 hover:bg-[#C9922A]/5"
        >
          Ver
        </button>
      ) : (
        <span className="w-[45px]" />
      )}
    </div>
  );
}

function AuditResultPanel({
  result,
  onManualReview,
  manualReviewStatus,
}: {
  result: AuditResult;
  onManualReview: () => void;
  manualReviewStatus: ManualReviewStatus;
}) {
  const categoryScores = getCategoryScores(result);
  const groups = [
    result.security,
    result.seo,
    result.conversion,
    result.barberiaos,
    result.customer_conversion ?? [],
  ];
  const allOk = groups.flat().filter((check) => check.status === "ok").length;
  const allErrors = groups.flat().filter((check) => check.status === "error").length;
  const allWarns = groups.flat().filter((check) => check.status === "warn").length;
  const detectedSignals = result.detected_signals ?? groups
    .flat()
    .filter((check) => check.status === "ok")
    .map((check) => ({
      category: "customer_conversion" as keyof ShieldCategoryScores,
      label: check.name,
      detail: check.detail,
    }));
  const issues = result.issues ?? groups
    .flat()
    .filter((check) => check.status === "warn" || check.status === "error")
    .map((check) => ({
      category: "customer_conversion" as keyof ShieldCategoryScores,
      title: check.name,
      detail: check.detail,
      severity: check.status as Exclude<CheckStatus, "ok">,
    }));
  const recommendations =
    result.recommendations && result.recommendations.length > 0
      ? result.recommendations
      : CLIENT_DEFAULT_RECOMMENDATIONS;
  const recommendedCta = result.recommended_cta ?? {
    tone: result.score < 60 ? "critical" : result.score < 80 ? "growth" : "healthy",
    title: result.score < 60
      ? "Tu presencia digital puede estar perdiendo reservas"
      : "Tu presencia digital puede convertir más reservas",
    description: "BarberíaOS puede ayudarte a activar reservas online, QR, WhatsApp y seguimiento de clientes.",
  } satisfies ShieldCommercialCta;

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)] md:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <ShieldScoreCard score={result.score} />
          <div className="flex-1">
            <p className="label-section">Informe Shield</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-[#080A0F]">Resultado de confianza digital</h2>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex max-w-full items-center gap-1 truncate text-xs font-semibold text-[#8A641F] hover:underline"
              >
                {result.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                <ExternalLink size={11} />
              </a>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Lectura pasiva completada sobre señales públicas. Las alertas se presentan como oportunidades
              de confianza, visibilidad y conversión a reserva.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {allErrors > 0 && <MetricPill tone="error" icon={Info}>{allErrors} puntos de atención</MetricPill>}
              {allWarns > 0 && <MetricPill tone="warning" icon={AlertTriangle}>{allWarns} mejoras recomendadas</MetricPill>}
              {allOk > 0 && <MetricPill tone="success" icon={CheckCircle2}>{allOk} señales correctas</MetricPill>}
            </div>
          </div>
        </div>
      </div>

      <CategoryScoreGrid scores={categoryScores} />
      <SignalsAndIssues signals={detectedSignals} issues={issues} />
      <PrioritizedRecommendations recommendations={recommendations} />
      <CommercialCtaCard
        cta={recommendedCta}
        onManualReview={onManualReview}
        manualReviewStatus={manualReviewStatus}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {(["security", "seo", "conversion", "barberiaos", "customer_conversion"] as CategoryKey[]).map((key) => (
          <CategorySection key={key} categoryKey={key} checks={result[key] ?? []} />
        ))}
      </div>
    </div>
  );
}

function MetricPill({
  tone,
  icon: Icon,
  children,
}: {
  tone: "success" | "warning" | "error";
  icon: LucideIcon;
  children: ReactNode;
}) {
  const classes = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    error: "border-red-200 bg-red-50 text-red-700",
  }[tone];

  return (
    <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold ${classes}`}>
      <Icon size={14} />
      {children}
    </div>
  );
}

function SignalsAndIssues({
  signals,
  issues,
}: {
  signals: ShieldSignal[];
  issues: ShieldIssue[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
            <CheckCircle2 size={17} className="text-emerald-600" />
          </div>
          <div>
            <p className="label-section">Detectado</p>
            <h3 className="font-black text-[#080A0F]">Señales positivas</h3>
          </div>
        </div>
        {signals.length > 0 ? (
          <div className="space-y-2">
            {signals.slice(0, 6).map((signal, index) => (
              <div key={`${signal.label}-${index}`} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-bold text-emerald-800">{signal.label}</p>
                <p className="mt-1 text-xs leading-5 text-emerald-700/80">{signal.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            Aún no hay señales positivas suficientes. Empieza por reserva visible, WhatsApp y confianza local.
          </p>
        )}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)]">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50">
            <AlertTriangle size={17} className="text-amber-600" />
          </div>
          <div>
            <p className="label-section">Prioridad</p>
            <h3 className="font-black text-[#080A0F]">Problemas que frenan reservas</h3>
          </div>
        </div>
        {issues.length > 0 ? (
          <div className="space-y-2">
            {issues.slice(0, 6).map((issue, index) => (
              <div key={`${issue.title}-${index}`} className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-amber-900">{issue.title}</p>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700">
                    {issue.severity === "error" ? "Alta" : "Media"}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-amber-800/80">{issue.detail}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-500">
            No se han detectado bloqueos relevantes en las señales revisadas.
          </p>
        )}
      </div>
    </div>
  );
}

function PrioritizedRecommendations({ recommendations }: { recommendations: ShieldRecommendation[] }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C9922A]/10">
          <Sparkles size={17} className="text-[#C9922A]" />
        </div>
        <div>
          <p className="label-section">Plan de acción</p>
          <h3 className="font-black text-[#080A0F]">Recomendaciones priorizadas</h3>
        </div>
      </div>
      <div className="space-y-2">
        {recommendations.slice(0, 8).map((recommendation) => (
          <div key={recommendation.id} className="rounded-2xl border border-slate-100 bg-[#F6F8FB] px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#080A0F]">{recommendation.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{recommendation.detail}</p>
              </div>
              <span className="shrink-0 rounded-full border border-[#C9922A]/25 bg-white px-2 py-0.5 text-[10px] font-black uppercase text-[#8A641F]">
                {recommendation.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommercialCtaCard({
  cta,
  onManualReview,
  manualReviewStatus,
}: {
  cta: ShieldCommercialCta;
  onManualReview: () => void;
  manualReviewStatus: ManualReviewStatus;
}) {
  const isCritical = cta.tone === "critical";

  return (
    <div className={`rounded-[24px] border p-5 shadow-[var(--shadow-soft)] md:p-6 ${
      isCritical ? "border-amber-200 bg-amber-50 text-slate-900" : "border-slate-200 bg-white"
    }`}>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="label-section">
            Siguiente paso recomendado
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-900">
            {cta.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {cta.description}
          </p>
        </div>
        <div className="grid gap-2">
          <Link href="/dashboard/reservas" className="btn-gold w-full">
            <CalendarCheck size={14} />
            Activar reservas online
          </Link>
          <Link href="/dashboard/qr" className={isCritical ? "btn-outline w-full border-white/15 bg-white/10 text-white hover:bg-white/15" : "btn-outline w-full"}>
            <QrCode size={14} />
            Crear QR de reservas
          </Link>
          <button
            type="button"
            onClick={onManualReview}
            disabled={manualReviewStatus === "saving" || manualReviewStatus === "saved"}
            className={isCritical ? "btn-outline w-full border-white/15 bg-white/10 text-white hover:bg-white/15" : "btn-dark w-full"}
          >
            {manualReviewStatus === "saving" ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
            {manualReviewStatus === "saved" ? "Revisión solicitada" : "Solicitar revisión manual"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyShieldState() {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9922A]/10">
        <Sparkles size={22} className="text-[#C9922A]" />
      </div>
      <p className="mt-4 font-black text-[#080A0F]">Tu informe Shield aparecerá aquí</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
        Recibirás una lectura clara de seguridad visible, SEO básico, reserva online y confianza móvil,
        con recomendaciones pensadas para generar más citas.
      </p>
      <div className="mt-5 grid gap-2 text-left sm:grid-cols-3">
        {EMPTY_RECOMMENDATIONS.map((item) => (
          <div key={item} className="rounded-2xl border border-slate-100 bg-[#F6F8FB] px-3 py-2 text-xs font-semibold text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ManualReviewButton({
  className = "",
  onClick,
  status,
}: {
  className?: string;
  onClick: () => void;
  status: ManualReviewStatus;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "saving" || status === "saved"}
      className={`btn-dark ${className}`}
    >
      {status === "saving" ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
      {status === "saved" ? "Revisión solicitada" : "Solicitar revisión manual"}
    </button>
  );
}

export function SecurityAuditClient({ history }: { history: AuditHistoryEntry[] }) {
  const [url, setUrl] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [manualReviewStatus, setManualReviewStatus] = useState<ManualReviewStatus>("idle");
  const [manualReviewError, setManualReviewError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirmed) return;

    const parsedUrl = normalizePublicUrl(url);
    if (!parsedUrl) {
      setErrorMsg("Introduce una URL válida que empiece por http:// o https://.");
      setPhase("error");
      return;
    }

    if (isObviouslyInternalHost(parsedUrl.hostname)) {
      setErrorMsg("Solo se pueden analizar webs públicas. No se admiten direcciones internas o locales.");
      setPhase("error");
      return;
    }

    setPhase("loading");
    setErrorMsg("");
    setManualReviewError("");
    setManualReviewStatus("idle");
    setResult(null);

    try {
      const res = await fetch("/api/security-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsedUrl.toString(), confirmed_authorized: true }),
      });
      const data = (await res.json()) as Record<string, unknown>;

      if (!res.ok) {
        if (data.code === "AUDIT_SERVICE_UNAVAILABLE") {
          setPhase("maintenance");
          return;
        }

        const msg = typeof data.error === "string"
          ? data.error
          : "La auditoría automática está temporalmente no disponible. Puedes solicitar una revisión manual.";
        setErrorMsg(msg);
        setPhase("error");
        return;
      }

      setResult(data as unknown as AuditResult);
      setPhase("done");
    } catch {
      setErrorMsg("La auditoría automática está temporalmente no disponible. Puedes solicitar una revisión manual.");
      setPhase("error");
    }
  }

  async function handleManualReviewRequest() {
    const sourceUrl = result?.url ?? url;
    const parsedUrl = normalizePublicUrl(sourceUrl);
    if (!parsedUrl || isObviouslyInternalHost(parsedUrl.hostname)) {
      setManualReviewError("Introduce una URL pública válida antes de solicitar la revisión manual.");
      setManualReviewStatus("error");
      return;
    }

    setManualReviewStatus("saving");
    setManualReviewError("");

    try {
      const res = await fetch("/api/security-audit/manual-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: parsedUrl.toString(),
          notes: result
            ? `Solicitud desde resultado Shield ${result.audit_id} con score ${result.score}.`
            : "Solicitud desde estado de mantenimiento de BarberíaOS Shield.",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

      if (!res.ok) {
        setManualReviewError(
          typeof data.error === "string"
            ? data.error
            : "No se pudo registrar la revisión manual. Inténtalo de nuevo."
        );
        setManualReviewStatus("error");
        return;
      }

      setManualReviewStatus("saved");
    } catch {
      setManualReviewError("No se pudo registrar la revisión manual. Inténtalo de nuevo.");
      setManualReviewStatus("error");
    }
  }

  function handleLoadHistory(auditResult: AuditResult) {
    setResult(auditResult);
    setPhase("done");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const isLoading = phase === "loading";

  return (
    <div className="space-y-5" ref={formRef}>
      <AuditStatusAlert title="Auditoría pasiva y autorizada">
        Solo revisamos información pública de la web: HTTPS, cabeceras, HTML visible, metadatos,
        botones de reserva, WhatsApp y señales básicas de confianza. No hacemos pentesting, no accedemos
        a paneles privados y no modificamos webs externas.
      </AuditStatusAlert>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SHIELD_SIGNALS.map((signal) => (
          <AuditSignalCard key={signal.title} {...signal} />
        ))}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)] md:p-6">
        <p className="label-section mb-1">BarberíaOS Shield</p>
        <h2 className="text-2xl font-black text-[#080A0F]">BarberíaOS Shield</h2>
        <p className="mt-1 text-sm font-semibold text-slate-700">Auditoría pasiva de confianza digital</p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Comprueba si tu web está preparada para generar reservas, confianza y visibilidad.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="form-label" htmlFor="audit-url">
              URL pública de tu web
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="audit-url"
                type="url"
                inputMode="url"
                className="input w-full sm:flex-1"
                placeholder="https://mibarberia.es"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="submit"
                disabled={isLoading || !confirmed || !url.trim()}
                className="btn-gold w-full gap-2 disabled:opacity-50 sm:w-auto sm:shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    Analizar mi web
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500">Acepta URLs públicas con http:// o https://.</p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#C9922A]/20 bg-[#C9922A]/5 px-4 py-3 transition hover:border-[#C9922A]/35 hover:bg-[#C9922A]/10">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 accent-[#C9922A]"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              disabled={isLoading}
            />
            <span className="text-sm leading-6 text-slate-600">
              <strong className="font-black text-[#080A0F]">Tengo autorización.</strong>{" "}
              Confirmo que la web es mía o que tengo permiso expreso para realizar esta revisión pasiva.
            </span>
          </label>
        </form>

        {isLoading && (
          <div className="mt-5 rounded-2xl border border-[#C9922A]/20 bg-[#FAFBFF] px-4 py-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2 size={30} className="animate-spin text-[#C9922A]" />
              <div>
                <p className="font-black text-[#080A0F]">Analizando señales públicas...</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Revisando HTTPS, cabeceras, SEO visible y caminos hacia reserva. Puede tardar unos segundos.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-[11px] text-slate-500">
                {["HTTPS", "Metadatos", "Reserva", "Confianza"].map((step) => (
                  <span key={step} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold">
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === "maintenance" && (
          <div className="mt-5">
            <AuditStatusAlert
              tone="warning"
              title="Auditoría automática temporalmente no disponible"
              action={
                <ManualReviewButton
                  className="w-full sm:w-auto"
                  onClick={handleManualReviewRequest}
                  status={manualReviewStatus}
                />
              }
            >
              Puedes solicitar una revisión manual y el equipo revisará las señales públicas de tu web sin tocar nada externo.
            </AuditStatusAlert>
          </div>
        )}

        {phase === "error" && (
          <div className="mt-5">
            <AuditStatusAlert
              tone="error"
              title={errorMsg || "La auditoría automática está temporalmente no disponible. Puedes solicitar una revisión manual."}
              action={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setPhase("idle")}
                    className="btn-outline w-full sm:w-auto"
                  >
                    <RotateCcw size={14} />
                    Intentar de nuevo
                  </button>
                  <ManualReviewButton
                    className="w-full sm:w-auto"
                    onClick={handleManualReviewRequest}
                    status={manualReviewStatus}
                  />
                </div>
              }
            >
              No mostramos detalles técnicos aquí para proteger la configuración interna del servicio.
            </AuditStatusAlert>
          </div>
        )}

        {manualReviewStatus === "saved" && (
          <div className="mt-5">
            <AuditStatusAlert tone="success" title="Revisión manual solicitada">
              Hemos registrado la URL para revisión pasiva manual. La solicitud queda asociada a tu barbería.
            </AuditStatusAlert>
          </div>
        )}

        {manualReviewStatus === "error" && manualReviewError && (
          <div className="mt-5">
            <AuditStatusAlert tone="error" title={manualReviewError}>
              No se ha guardado ninguna solicitud manual duplicada desde este intento.
            </AuditStatusAlert>
          </div>
        )}
      </div>

      {phase === "done" && result && (
        <AuditResultPanel
          result={result}
          onManualReview={handleManualReviewRequest}
          manualReviewStatus={manualReviewStatus}
        />
      )}

      {(phase === "idle" || phase === "maintenance") && !result && <EmptyShieldState />}

      {history.length > 0 && (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)] md:p-6">
          <p className="label-section">Historial Shield</p>
          <h2 className="mb-4 mt-1 font-black text-[#080A0F]">Análisis anteriores</h2>
          <div className="space-y-2">
            {history.map((entry) => (
              <HistoryRow key={entry.id} entry={entry} onLoad={handleLoadHistory} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
