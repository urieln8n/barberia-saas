import type {
  ShieldAuditResult,
  ShieldCommercialCta,
  ShieldIssue,
  ShieldRecommendation,
} from "./shield-result";

type ReportStatus = "pending" | "in_review" | "completed" | "cancelled";

type ReportBarbershop = {
  name: string;
  city: string | null;
} | null;

type ReportAudit = {
  score: number | null;
  created_at: string;
  report: (Partial<ShieldAuditResult> & {
    issues?: ShieldIssue[];
    recommendations?: ShieldRecommendation[];
    recommended_cta?: ShieldCommercialCta;
    completed_at?: string;
  }) | null;
} | null;

export type ShieldReportSource = {
  url: string;
  status: ReportStatus;
  notes: string | null;
  created_at: string;
  barbershop: ReportBarbershop;
  latestAudit: ReportAudit;
};

export type ShieldCommercialReport = {
  reportTitle: string;
  reportSubtitle: string;
  executiveSummary: string;
  detectedProblems: Array<{
    title: string;
    detail: string;
    severity: "warn" | "error";
  }>;
  recommendations: Array<{
    title: string;
    detail: string;
    priority: "alta" | "media" | "baja";
  }>;
  barberiaosProposal: string;
  whatsappSummary: string;
  scoreLabel: string;
  scoreValue: number | null;
  reviewedAt: string | null;
  cta: string;
  hasRealScore: boolean;
};

const PRELIMINARY_PROBLEMS = [
  {
    title: "Reserva online por validar",
    detail:
      "No hay score real vinculado a esta solicitud. Conviene revisar si la web muestra una llamada clara a reservar desde móvil.",
    severity: "warn" as const,
  },
  {
    title: "Contacto directo por validar",
    detail:
      "Se recomienda comprobar si WhatsApp, teléfono o contacto inmediato están visibles para usuarios con intención alta.",
    severity: "warn" as const,
  },
  {
    title: "Confianza local por validar",
    detail:
      "Antes de enviar una propuesta, revisa señales públicas como reseñas, ubicación, horarios y política de privacidad.",
    severity: "warn" as const,
  },
];

const PRELIMINARY_RECOMMENDATIONS = [
  {
    title: "Revisar camino a reserva",
    detail: "Confirmar si el primer bloque móvil permite reservar o pedir cita sin fricción.",
    priority: "alta" as const,
  },
  {
    title: "Revisar WhatsApp visible",
    detail: "Validar si hay acceso directo a WhatsApp o contacto inmediato para consultas rápidas.",
    priority: "alta" as const,
  },
  {
    title: "Revisar señales de confianza",
    detail: "Comprobar reseñas, ubicación, horarios y prueba social antes de afirmar bloqueos concretos.",
    priority: "media" as const,
  },
  {
    title: "Proponer QR y reservas online",
    detail: "Si la barbería no tiene flujo claro, BarberíaOS puede conectar QR, agenda y recordatorios.",
    priority: "media" as const,
  },
];

function getBarbershopLabel(source: ShieldReportSource) {
  return source.barbershop?.name?.trim() || "tu barbería";
}

function normalizeProblems(source: ShieldReportSource) {
  const hasScore = typeof source.latestAudit?.score === "number";
  const issues = source.latestAudit?.report?.issues;
  if (!hasScore || !Array.isArray(issues) || issues.length === 0) return PRELIMINARY_PROBLEMS;

  return issues.slice(0, 8).map((issue) => ({
    title: issue.title,
    detail: issue.detail,
    severity: issue.severity,
  }));
}

function normalizeRecommendations(source: ShieldReportSource) {
  const hasScore = typeof source.latestAudit?.score === "number";
  const recommendations = source.latestAudit?.report?.recommendations;
  if (!hasScore || !Array.isArray(recommendations) || recommendations.length === 0) {
    return PRELIMINARY_RECOMMENDATIONS;
  }

  return recommendations.slice(0, 8).map((recommendation) => ({
    title: recommendation.title,
    detail: recommendation.detail,
    priority: recommendation.priority,
  }));
}

function buildProposal(source: ShieldReportSource) {
  const cta = source.latestAudit?.report?.recommended_cta;
  if (typeof source.latestAudit?.score === "number" && cta?.description) return cta.description;

  return "BarberíaOS puede ayudar a centralizar reservas online, QR, recordatorios, seguimiento de clientes, caja y marketing en un panel pensado para barberías.";
}

function buildWhatsappSummary(source: ShieldReportSource, recommendations: ShieldCommercialReport["recommendations"]) {
  const name = getBarbershopLabel(source);
  const hasScore = typeof source.latestAudit?.score === "number";

  if (!hasScore) {
    return `Hola, hemos preparado un diagnóstico preliminar con BarberíaOS Shield para ${name}. Antes de afirmar problemas concretos, conviene revisar reserva online, WhatsApp visible, reseñas y señales de confianza. Con BarberíaOS podemos ayudarte a activar reservas online, QR, recordatorios, seguimiento de clientes y un panel completo para controlar agenda, caja y marketing. Si quieres, te enseño una demo rápida.`;
  }

  const recommendationText = recommendations
    .slice(0, 3)
    .map((recommendation) => recommendation.title.toLowerCase())
    .join(", ");

  return `Hola, hemos revisado tu presencia digital con BarberíaOS Shield y detectamos algunos puntos que pueden estar frenando reservas: ${recommendationText || "reserva online, WhatsApp visible y señales de confianza"}. Con BarberíaOS podemos ayudarte a activar reservas online, QR, recordatorios, seguimiento de clientes y un panel completo para controlar agenda, caja y marketing. Si quieres, te enseño una demo rápida.`;
}

export function buildShieldCommercialReport(source: ShieldReportSource): ShieldCommercialReport {
  const hasRealScore = typeof source.latestAudit?.score === "number";
  const scoreValue = hasRealScore ? source.latestAudit?.score ?? null : null;
  const recommendations = normalizeRecommendations(source);
  const detectedProblems = normalizeProblems(source);
  const barberiaosProposal = buildProposal(source);
  const reviewedAt =
    (typeof source.latestAudit?.report?.completed_at === "string" && source.latestAudit.report.completed_at) ||
    source.latestAudit?.created_at ||
    null;

  const executiveSummary = hasRealScore
    ? `BarberíaOS Shield ha revisado señales públicas de ${getBarbershopLabel(source)} para priorizar mejoras de confianza digital y conversión a reservas.`
    : `Este informe es un diagnóstico preliminar de ${getBarbershopLabel(source)}. No hay un score real vinculado todavía, por lo que las recomendaciones se presentan como puntos a revisar.`;

  return {
    reportTitle: "Informe BarberíaOS Shield",
    reportSubtitle: "Diagnóstico de confianza digital y conversión a reservas",
    executiveSummary,
    detectedProblems,
    recommendations,
    barberiaosProposal,
    whatsappSummary: buildWhatsappSummary(source, recommendations),
    scoreLabel: hasRealScore ? `${scoreValue}/100` : "Diagnóstico preliminar",
    scoreValue,
    reviewedAt,
    cta: "Siguiente paso: enseñar una demo rápida de BarberíaOS y activar un flujo simple de reservas online, QR, recordatorios y seguimiento de clientes.",
    hasRealScore,
  };
}
