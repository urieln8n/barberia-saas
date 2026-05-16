export type ShieldCheckStatus = "ok" | "warn" | "error";

export type ShieldCheck = {
  name: string;
  status: ShieldCheckStatus;
  detail: string;
  recommendation?: string;
};

export type ShieldCategoryScores = {
  security_basic: number;
  seo_visible: number;
  online_booking: number;
  mobile_trust: number;
  customer_conversion: number;
};

export type ShieldSignal = {
  category: keyof ShieldCategoryScores;
  label: string;
  detail: string;
};

export type ShieldIssue = {
  category: keyof ShieldCategoryScores;
  title: string;
  detail: string;
  severity: Exclude<ShieldCheckStatus, "ok">;
};

export type ShieldRecommendation = {
  id: string;
  title: string;
  detail: string;
  priority: "alta" | "media" | "baja";
  category: keyof ShieldCategoryScores;
};

export type ShieldCommercialCta = {
  title: string;
  description: string;
  tone: "critical" | "growth" | "healthy";
};

export type ShieldAuditResult = {
  audit_id: string;
  url: string;
  score: number;
  category_scores: ShieldCategoryScores;
  detected_signals: ShieldSignal[];
  issues: ShieldIssue[];
  recommendations: ShieldRecommendation[];
  recommended_cta: ShieldCommercialCta;
  security: ShieldCheck[];
  seo: ShieldCheck[];
  conversion: ShieldCheck[];
  barberiaos: ShieldCheck[];
  customer_conversion: ShieldCheck[];
  summary: ShieldCheck[];
};

type RawAuditResult = Record<string, unknown>;

const CATEGORY_WEIGHTS: Record<keyof ShieldCategoryScores, number> = {
  security_basic: 0.2,
  seo_visible: 0.2,
  online_booking: 0.22,
  mobile_trust: 0.18,
  customer_conversion: 0.2,
};

const CATEGORY_LABELS: Record<keyof ShieldCategoryScores, string> = {
  security_basic: "Seguridad básica",
  seo_visible: "SEO visible",
  online_booking: "Reserva online",
  mobile_trust: "Confianza móvil",
  customer_conversion: "Conversión a clientes",
};

const DEFAULT_RECOMMENDATIONS: ShieldRecommendation[] = [
  {
    id: "booking-button",
    title: "Añade botón de reserva visible",
    detail: "Coloca un CTA fijo o muy visible para reservar desde móvil sin buscar en la página.",
    priority: "alta",
    category: "online_booking",
  },
  {
    id: "whatsapp-direct",
    title: "Añade WhatsApp directo",
    detail: "Un enlace directo a WhatsApp reduce fricción para clientes que quieren preguntar o reservar rápido.",
    priority: "alta",
    category: "online_booking",
  },
  {
    id: "clear-hours",
    title: "Añade horarios claros",
    detail: "Muestra horarios actualizados para que el cliente sepa cuándo puede reservar o llamar.",
    priority: "media",
    category: "customer_conversion",
  },
  {
    id: "google-maps",
    title: "Añade enlace de Google Maps",
    detail: "Facilita llegar al local y refuerza la confianza desde búsquedas locales.",
    priority: "media",
    category: "mobile_trust",
  },
  {
    id: "visible-reviews",
    title: "Añade reseñas visibles",
    detail: "Las reseñas reducen la duda antes de reservar, especialmente en tráfico nuevo.",
    priority: "alta",
    category: "mobile_trust",
  },
  {
    id: "privacy-policy",
    title: "Añade política de privacidad",
    detail: "Si captas datos de clientes, enlaza una política de privacidad visible y fácil de encontrar.",
    priority: "media",
    category: "security_basic",
  },
  {
    id: "seo-title",
    title: "Mejora título SEO",
    detail: "Incluye servicio, ciudad o barrio y nombre de la barbería para captar búsquedas locales.",
    priority: "media",
    category: "seo_visible",
  },
  {
    id: "seo-description",
    title: "Mejora descripción SEO",
    detail: "Resume propuesta, ubicación y reserva en una descripción orientada a clic.",
    priority: "media",
    category: "seo_visible",
  },
  {
    id: "barberiaos-qr",
    title: "Activa QR de reservas BarberíaOS",
    detail: "Usa el QR en mostrador, escaparate, Instagram y Google Business para convertir visitas en citas.",
    priority: "alta",
    category: "customer_conversion",
  },
];

function asCheckArray(value: unknown): ShieldCheck[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item): ShieldCheck | null => {
      if (!item || typeof item !== "object") return null;
      const source = item as Record<string, unknown>;
      const status = source.status;
      const safeStatus: ShieldCheckStatus =
        status === "ok" || status === "warn" || status === "error" ? status : "warn";

      const check: ShieldCheck = {
        name: typeof source.name === "string" ? source.name : "Señal revisada",
        status: safeStatus,
        detail: typeof source.detail === "string" ? source.detail : "Señal pública revisada.",
      };

      if (typeof source.recommendation === "string") {
        check.recommendation = source.recommendation;
      }

      return check;
    })
    .filter((item): item is ShieldCheck => item !== null);
}

function scoreChecks(checks: ShieldCheck[]) {
  if (checks.length === 0) return 55;

  const total = checks.reduce((sum, check) => {
    if (check.status === "ok") return sum + 100;
    if (check.status === "warn") return sum + 65;
    return sum + 25;
  }, 0);

  return Math.round(total / checks.length);
}

function normalizeScore(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < 0 || value > 100) return null;
  return Math.round(value);
}

function inferCustomerConversionChecks({
  conversion,
  barberiaos,
  summary,
}: {
  conversion: ShieldCheck[];
  barberiaos: ShieldCheck[];
  summary: ShieldCheck[];
}) {
  const sourceText = [...conversion, ...barberiaos, ...summary]
    .map((check) => `${check.name} ${check.detail} ${check.recommendation ?? ""}`)
    .join(" ")
    .toLowerCase();

  const hasBooking = /reserva|booking|cita|agenda/.test(sourceText);
  const hasWhatsapp = /whatsapp|wa\.me|teléfono|telefono|llamar/.test(sourceText);
  const hasReviews = /reseña|review|valoraci/.test(sourceText);
  const hasMaps = /maps|mapa|direcci[oó]n|ubicaci[oó]n/.test(sourceText);

  return [
    {
      name: "Camino claro a reserva",
      status: hasBooking ? "ok" : "error",
      detail: hasBooking
        ? "La web muestra señales orientadas a reservar o pedir cita."
        : "No se detecta un camino suficientemente claro hacia la reserva.",
      recommendation: "Añade un botón de reserva visible desde el primer bloque móvil.",
    },
    {
      name: "Contacto inmediato",
      status: hasWhatsapp ? "ok" : "warn",
      detail: hasWhatsapp
        ? "Hay señales de contacto rápido para clientes con intención alta."
        : "No se detecta claramente WhatsApp o contacto inmediato.",
      recommendation: "Añade WhatsApp directo para consultas y reservas rápidas.",
    },
    {
      name: "Prueba social y ubicación",
      status: hasReviews && hasMaps ? "ok" : "warn",
      detail: hasReviews && hasMaps
        ? "La web contiene señales de confianza local."
        : "Las reseñas o la ubicación podrían estar más visibles.",
      recommendation: "Añade reseñas visibles y enlace directo a Google Maps.",
    },
  ] satisfies ShieldCheck[];
}

function buildSignals(groups: Record<keyof ShieldCategoryScores, ShieldCheck[]>) {
  return Object.entries(groups).flatMap(([category, checks]) =>
    checks
      .filter((check) => check.status === "ok")
      .slice(0, 3)
      .map((check) => ({
        category: category as keyof ShieldCategoryScores,
        label: check.name,
        detail: check.detail,
      }))
  );
}

function buildIssues(groups: Record<keyof ShieldCategoryScores, ShieldCheck[]>) {
  return Object.entries(groups).flatMap(([category, checks]) =>
    checks
      .filter((check) => check.status === "warn" || check.status === "error")
      .map((check) => ({
        category: category as keyof ShieldCategoryScores,
        title: check.name,
        detail: check.detail,
        severity: check.status as Exclude<ShieldCheckStatus, "ok">,
      }))
  );
}

function buildRecommendations(groups: Record<keyof ShieldCategoryScores, ShieldCheck[]>) {
  const fromChecks = Object.entries(groups).flatMap(([category, checks]) =>
    checks
      .filter((check) => check.status !== "ok" && check.recommendation)
      .map((check, index) => ({
        id: `${category}-${index}-${check.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title: check.recommendation ?? check.name,
        detail: check.detail,
        priority: check.status === "error" ? "alta" : "media",
        category: category as keyof ShieldCategoryScores,
      } satisfies ShieldRecommendation))
  );

  const byTitle = new Map<string, ShieldRecommendation>();
  [...fromChecks, ...DEFAULT_RECOMMENDATIONS].forEach((recommendation) => {
    const key = recommendation.title.toLowerCase();
    if (!byTitle.has(key)) byTitle.set(key, recommendation);
  });

  return Array.from(byTitle.values())
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority))
    .slice(0, 8);
}

function priorityRank(priority: ShieldRecommendation["priority"]) {
  if (priority === "alta") return 0;
  if (priority === "media") return 1;
  return 2;
}

function buildCta(score: number): ShieldCommercialCta {
  if (score < 60) {
    return {
      tone: "critical",
      title: "Tu presencia digital puede estar perdiendo reservas",
      description:
        "BarberíaOS puede ayudarte a activar reservas online, QR, WhatsApp y seguimiento de clientes.",
    };
  }

  if (score < 80) {
    return {
      tone: "growth",
      title: "Tu web tiene base, pero todavía puede convertir más",
      description:
        "Refuerza reservas online, QR, WhatsApp y señales de confianza para cerrar más citas desde móvil.",
    };
  }

  return {
    tone: "healthy",
    title: "Tu presencia digital muestra buenas señales",
    description:
      "Puedes usar BarberíaOS para mantener reservas, QR y seguimiento conectados en un único sistema.",
  };
}

export function normalizeShieldAuditResult(
  auditResult: RawAuditResult,
  targetUrl: string,
  auditId: string
): ShieldAuditResult {
  const security = asCheckArray(auditResult.security);
  const seo = asCheckArray(auditResult.seo);
  const conversion = asCheckArray(auditResult.conversion);
  const barberiaos = asCheckArray(auditResult.barberiaos);
  const summary = asCheckArray(auditResult.summary);
  const explicitCustomerConversion =
    asCheckArray(auditResult.customer_conversion).length > 0
      ? asCheckArray(auditResult.customer_conversion)
      : asCheckArray(auditResult.conversion_to_clients);
  const customerConversion =
    explicitCustomerConversion.length > 0
      ? explicitCustomerConversion
      : inferCustomerConversionChecks({ conversion, barberiaos, summary });

  const categoryScores: ShieldCategoryScores = {
    security_basic: normalizeScore((auditResult.category_scores as Record<string, unknown> | undefined)?.security_basic)
      ?? scoreChecks(security),
    seo_visible: normalizeScore((auditResult.category_scores as Record<string, unknown> | undefined)?.seo_visible)
      ?? scoreChecks(seo),
    online_booking: normalizeScore((auditResult.category_scores as Record<string, unknown> | undefined)?.online_booking)
      ?? scoreChecks(conversion),
    mobile_trust: normalizeScore((auditResult.category_scores as Record<string, unknown> | undefined)?.mobile_trust)
      ?? scoreChecks(barberiaos),
    customer_conversion: normalizeScore((auditResult.category_scores as Record<string, unknown> | undefined)?.customer_conversion)
      ?? scoreChecks(customerConversion),
  };

  const weightedScore = Math.round(
    Object.entries(categoryScores).reduce((sum, [key, value]) => {
      return sum + value * CATEGORY_WEIGHTS[key as keyof ShieldCategoryScores];
    }, 0)
  );
  const score = normalizeScore(auditResult.score) ?? weightedScore;
  const groups = {
    security_basic: security,
    seo_visible: seo,
    online_booking: conversion,
    mobile_trust: barberiaos,
    customer_conversion: customerConversion,
  };

  return {
    audit_id: auditId,
    url: typeof auditResult.url === "string" ? auditResult.url : targetUrl,
    score,
    category_scores: categoryScores,
    detected_signals: buildSignals(groups),
    issues: buildIssues(groups),
    recommendations: buildRecommendations(groups),
    recommended_cta: buildCta(score),
    security,
    seo,
    conversion,
    barberiaos,
    customer_conversion: customerConversion,
    summary,
  };
}

export { CATEGORY_LABELS as SHIELD_CATEGORY_LABELS };
