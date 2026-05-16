import "server-only";

import { isSafeAuditUrl } from "./ssrf-guard";
import type {
  ShieldCategoryScores,
  ShieldCheck,
  ShieldCommercialCta,
} from "./shield-result";

const INTERNAL_AUDIT_TIMEOUT_MS = 12_000;
const MAX_HTML_CHARS = 350_000;
const MAX_REDIRECTS = 3;

type InternalSignal = {
  key: string;
  found: boolean;
  label: string;
};

type InternalAuditHtml = {
  url: string;
  html: string;
};

function includesAny(value: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(value));
}

function stripTags(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html: string) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1] ?? "") : "";
}

function extractMetaDescription(html: string) {
  const match = html.match(
    /<meta\s+[^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*content=["']([^"']+)["'][^>]*>/i
  ) ?? html.match(
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*(?:name|property)=["'](?:description|og:description)["'][^>]*>/i
  );

  return match?.[1]?.trim() ?? "";
}

function check(name: string, found: boolean, okDetail: string, failDetail: string, recommendation: string): ShieldCheck {
  return {
    name,
    status: found ? "ok" : "warn",
    detail: found ? okDetail : failDetail,
    recommendation: found ? undefined : recommendation,
  };
}

function scoreFromSignals(signals: InternalSignal[]) {
  const weights: Record<string, number> = {
    https: 14,
    title: 12,
    description: 12,
    booking: 18,
    whatsapp: 16,
    privacy: 10,
    maps: 9,
    reviews: 9,
  };

  return signals.reduce((total, signal) => total + (signal.found ? weights[signal.key] ?? 0 : 0), 0);
}

function scoreChecks(checks: ShieldCheck[]) {
  if (checks.length === 0) return 45;
  const total = checks.reduce((sum, item) => {
    if (item.status === "ok") return sum + 100;
    if (item.status === "warn") return sum + 62;
    return sum + 25;
  }, 0);

  return Math.round(total / checks.length);
}

function buildCommercialCta(score: number): ShieldCommercialCta {
  if (score < 60) {
    return {
      tone: "critical",
      title: "Tu presencia digital puede estar perdiendo reservas",
      description:
        "BarberíaOS puede activar reservas online, QR, WhatsApp, seguimiento de clientes y recordatorios para recuperar citas que hoy se pierden.",
    };
  }

  if (score < 80) {
    return {
      tone: "growth",
      title: "Tu web tiene base, pero todavía puede convertir más",
      description:
        "Con BarberíaOS puedes reforzar reserva online, QR, WhatsApp y señales de confianza para cerrar más citas desde móvil.",
    };
  }

  return {
    tone: "healthy",
    title: "Tu presencia digital muestra buenas señales",
    description:
      "BarberíaOS puede ayudarte a mantener reservas, QR y seguimiento de clientes conectados en un único sistema.",
  };
}

async function fetchHtmlWithSafeRedirects(url: string): Promise<InternalAuditHtml> {
  let currentUrl = url;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    if (!(await isSafeAuditUrl(currentUrl))) {
      throw new Error("Unsafe redirect target");
    }

    const response = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.2",
        "User-Agent": "BarberiaOS-Shield/1.0 passive-audit",
      },
      signal: AbortSignal.timeout(INTERNAL_AUDIT_TIMEOUT_MS),
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Redirect without location");
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    if (!response.ok) {
      throw new Error("Target returned non-success status");
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error("Target is not HTML");
    }

    const html = (await response.text()).slice(0, MAX_HTML_CHARS);
    if (!html.trim()) throw new Error("Empty HTML");

    return { url: currentUrl, html };
  }

  throw new Error("Too many redirects");
}

export async function runInternalShieldAudit(targetUrl: string): Promise<Record<string, unknown>> {
  const { url: finalUrl, html } = await fetchHtmlWithSafeRedirects(targetUrl);
  const visibleText = stripTags(html).toLowerCase();
  const raw = html.toLowerCase();
  const title = extractTitle(html);
  const description = extractMetaDescription(html);
  const parsedUrl = new URL(finalUrl);

  const hasHttps = parsedUrl.protocol === "https:";
  const hasTitle = title.length >= 8;
  const hasDescription = description.length >= 40;
  const hasBooking = includesAny(`${visibleText} ${raw}`, [
    /\breserv(ar|a|as|as)?\b/i,
    /\bcita(s)?\b/i,
    /\bagenda\b/i,
    /\bbooking\b/i,
    /\bbook now\b/i,
  ]);
  const hasWhatsapp = includesAny(raw, [/wa\.me\//i, /whatsapp/i, /api\.whatsapp\.com/i]);
  const hasPrivacy = includesAny(visibleText, [/pol[ií]tica de privacidad/i, /privacidad/i, /privacy policy/i]);
  const hasMaps = includesAny(`${visibleText} ${raw}`, [
    /google\.com\/maps/i,
    /maps\.app\.goo\.gl/i,
    /google maps/i,
    /\bdirecci[oó]n\b/i,
    /\bubicaci[oó]n\b/i,
    /\bc\.?\s+[a-záéíóúñ]/i,
    /\bcalle\b/i,
    /\bavenida\b/i,
  ]);
  const hasReviews = includesAny(visibleText, [
    /reseñ/i,
    /testimonio/i,
    /opiniones/i,
    /valoraci/i,
    /reviews/i,
    /★★★★★|⭐/i,
  ]);

  const signals: InternalSignal[] = [
    { key: "https", found: hasHttps, label: "HTTPS" },
    { key: "title", found: hasTitle, label: "Título SEO" },
    { key: "description", found: hasDescription, label: "Meta description" },
    { key: "booking", found: hasBooking, label: "Reserva/cita" },
    { key: "whatsapp", found: hasWhatsapp, label: "WhatsApp" },
    { key: "privacy", found: hasPrivacy, label: "Privacidad" },
    { key: "maps", found: hasMaps, label: "Mapa o dirección" },
    { key: "reviews", found: hasReviews, label: "Reseñas/testimonios" },
  ];

  const security: ShieldCheck[] = [
    check(
      "HTTPS público",
      hasHttps,
      "La URL final usa HTTPS.",
      "La URL final no usa HTTPS.",
      "Usa HTTPS para reforzar confianza y evitar avisos del navegador."
    ),
    check(
      "Política de privacidad visible",
      hasPrivacy,
      "Se detecta una señal de privacidad en la web.",
      "No se detecta claramente política de privacidad.",
      "Añade un enlace visible a política de privacidad si captas datos de clientes."
    ),
  ];

  const seo: ShieldCheck[] = [
    check(
      "Título SEO",
      hasTitle,
      "La página tiene un título público útil.",
      "No se detecta un título suficientemente descriptivo.",
      "Incluye nombre, servicio principal y ciudad o barrio en el título."
    ),
    check(
      "Meta description",
      hasDescription,
      "La página tiene una descripción pública.",
      "No se detecta una meta description suficientemente clara.",
      "Añade una descripción con ubicación, propuesta y llamada a reservar."
    ),
  ];

  const conversion: ShieldCheck[] = [
    check(
      "Camino hacia reserva",
      hasBooking,
      "Se detectan señales de reserva, cita o agenda.",
      "No se detecta claramente una llamada a reservar.",
      "Añade un botón de reserva visible desde el primer bloque móvil."
    ),
    check(
      "WhatsApp directo",
      hasWhatsapp,
      "Se detecta WhatsApp o enlace directo de contacto.",
      "No se detecta claramente WhatsApp directo.",
      "Añade un enlace de WhatsApp para reservas y consultas rápidas."
    ),
  ];

  const barberiaos: ShieldCheck[] = [
    check(
      "Ubicación local",
      hasMaps,
      "Se detecta Google Maps, ubicación o dirección.",
      "La ubicación no parece suficientemente visible.",
      "Añade dirección clara y enlace a Google Maps."
    ),
    check(
      "Prueba social",
      hasReviews,
      "Se detectan reseñas, testimonios u opiniones.",
      "No se detectan reseñas o testimonios visibles.",
      "Muestra reseñas reales para reforzar confianza antes de reservar."
    ),
  ];

  const customerConversion: ShieldCheck[] = [
    {
      name: "Conversión desde móvil",
      status: hasBooking && (hasWhatsapp || hasMaps) ? "ok" : "warn",
      detail: hasBooking && (hasWhatsapp || hasMaps)
        ? "La web contiene señales básicas para convertir visitas en citas."
        : "La web necesita un camino más directo hacia la cita desde móvil.",
      recommendation: "Conecta reserva online, WhatsApp y QR para reducir fricción.",
    },
  ];

  const categoryScores: ShieldCategoryScores = {
    security_basic: scoreChecks(security),
    seo_visible: scoreChecks(seo),
    online_booking: scoreChecks(conversion),
    mobile_trust: scoreChecks(barberiaos),
    customer_conversion: scoreChecks(customerConversion),
  };
  const score = scoreFromSignals(signals);

  return {
    url: finalUrl,
    score,
    category_scores: categoryScores,
    detected_categories: signals.filter((signal) => signal.found).map((signal) => signal.label),
    commercial_cta: buildCommercialCta(score),
    recommended_cta: buildCommercialCta(score),
    security,
    seo,
    conversion,
    barberiaos,
    customer_conversion: customerConversion,
    summary: [
      {
        name: "Auditoría pasiva interna",
        status: score >= 70 ? "ok" : score >= 45 ? "warn" : "error",
        detail: "Resultado generado desde BarberíaOS con una lectura pasiva del HTML público.",
        recommendation: "Prioriza reserva visible, WhatsApp directo, reseñas y ubicación.",
      },
    ] satisfies ShieldCheck[],
  };
}
