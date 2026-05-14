import "server-only";
import { buildOwnerInsights, buildTodayRecommendation, type OwnerInsightInput } from "./owner-insights";
import { createOwnerAIResponse } from "./openai-client";
import { OWNER_AI_SYSTEM_PROMPT } from "./owner-ai-prompts";

export type OwnerAIInsight = {
  label: string;
  value: string;
  description: string;
};

export type OwnerAIAction = {
  title: string;
  description: string;
  action_type: string;
};

export type OwnerAIResult = {
  title: string;
  summary: string;
  priority: "low" | "medium" | "high";
  insights: OwnerAIInsight[];
  recommended_actions: OwnerAIAction[];
  whatsapp_message: string;
  instagram_caption: string;
  mode: "openai" | "local";
  model: string | null;
  notice?: string;
};

export type OwnerAIMetrics = OwnerInsightInput & {
  weekAppointments: number;
  weekCancelled: number;
  weekNoShows: number;
  clientsNoVisit30: number;
  clientsNoVisit45: number;
  clientsNoVisit60: number;
  reviewsPending: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  topServices: { name: string; count: number; revenue: number }[];
  topBarbers: { name: string; appointments: number; revenue: number }[];
};

export type GenerateOwnerInsightsInput = {
  barbershopId: string;
  question: string;
  metrics: OwnerAIMetrics;
};

function trimQuestion(question: string) {
  return question.trim().slice(0, 280);
}

function localResult(question: string, metrics: OwnerAIMetrics, model: string | null, notice?: string): OwnerAIResult {
  const baseInsights = buildOwnerInsights(metrics).slice(0, 6);
  const topProduct = metrics.topProducts[0];

  return {
    title: "Resumen inteligente",
    summary: `${buildTodayRecommendation(metrics)} Pregunta analizada: ${trimQuestion(question) || "resumen general"}.`,
    priority:
      metrics.noShows > 0 || metrics.lowStockProducts > 0 || metrics.dormantClients > 5
        ? "high"
        : metrics.freeSlots > 0 || metrics.pendingAppointments > 0
          ? "medium"
          : "low",
    insights: baseInsights.map((insight) => ({
      label: insight.title,
      value: insight.value,
      description: insight.description,
    })),
    recommended_actions: [
      {
        title: "Enviar campaña a clientes perdidos",
        description:
          metrics.clientsNoVisit45 > 0
            ? `Hay ${metrics.clientsNoVisit45} clientes sin volver hace mas de 45 dias.`
            : "Aun no hay suficientes clientes perdidos detectados.",
        action_type: "whatsapp_reactivation",
      },
      {
        title: "Llenar huecos libres",
        description:
          metrics.freeSlots > 0
            ? `Quedan ${metrics.freeSlots} huecos estimados hoy. Conviene activar una promo rapida.`
            : "No se detectan huecos libres relevantes hoy.",
        action_type: "free_slots_promo",
      },
      {
        title: "Revisar stock bajo",
        description:
          metrics.lowStockProducts > 0
            ? `${metrics.lowStockProducts} productos necesitan reposicion.`
            : topProduct
              ? `${topProduct.name} es el producto con mas venta registrada.`
              : "Cuando registres ventas de productos, se priorizara reposicion y margen.",
        action_type: "inventory_review",
      },
    ],
    whatsapp_message:
      metrics.freeSlots > 0
        ? `Hola, hoy tenemos ${metrics.freeSlots} huecos disponibles en la barberia. Si quieres corte o barba, respondeme y te reservo hora.`
        : "Hola, esta semana tenemos agenda abierta para corte y barba. Si quieres reservar, respondeme y te paso horarios.",
    instagram_caption:
      metrics.topServices[0]?.name
        ? `Hoy toca cuidarse. Reserva ${metrics.topServices[0].name} desde nuestro enlace y asegura tu hora.`
        : "Agenda abierta esta semana. Reserva tu corte desde el enlace de la barberia.",
    mode: "local",
    model,
    notice,
  };
}

function safeParseOwnerAI(text: string | null): Omit<OwnerAIResult, "mode" | "model" | "notice"> | null {
  if (!text) return null;

  try {
    const parsed = JSON.parse(text) as Omit<OwnerAIResult, "mode" | "model" | "notice">;

    if (!parsed.title || !parsed.summary || !Array.isArray(parsed.insights)) {
      return null;
    }

    return {
      title: String(parsed.title).slice(0, 120),
      summary: String(parsed.summary).slice(0, 600),
      priority: ["low", "medium", "high"].includes(parsed.priority) ? parsed.priority : "medium",
      insights: (parsed.insights ?? []).slice(0, 6).map((insight) => ({
        label: String(insight.label ?? "").slice(0, 80),
        value: String(insight.value ?? "").slice(0, 80),
        description: String(insight.description ?? "").slice(0, 260),
      })),
      recommended_actions: (parsed.recommended_actions ?? []).slice(0, 5).map((action) => ({
        title: String(action.title ?? "").slice(0, 100),
        description: String(action.description ?? "").slice(0, 300),
        action_type: String(action.action_type ?? "manual").slice(0, 80),
      })),
      whatsapp_message: String(parsed.whatsapp_message ?? "").slice(0, 600),
      instagram_caption: String(parsed.instagram_caption ?? "").slice(0, 600),
    };
  } catch {
    return null;
  }
}

function buildCompactPayload({ question, metrics }: GenerateOwnerInsightsInput) {
  return JSON.stringify({
    question: trimQuestion(question),
    metrics: {
      today: {
        appointments: metrics.todayAppointments,
        confirmed: metrics.confirmedAppointments,
        pending: metrics.pendingAppointments,
        cancelled: metrics.cancelledAppointments,
        no_shows: metrics.noShows,
        free_slots_estimated: metrics.freeSlots,
        estimated_revenue: metrics.estimatedRevenue,
        collected_revenue: metrics.collectedRevenue,
        services_completed: metrics.servicesCompleted,
        products_sold: metrics.productsSold,
      },
      week: {
        appointments: metrics.weekAppointments,
        cancelled: metrics.weekCancelled,
        no_shows: metrics.weekNoShows,
      },
      clients: {
        new_today: metrics.newClients,
        recurrent_today: metrics.recurrentClients,
        dormant_total: metrics.dormantClients,
        no_visit_30_days: metrics.clientsNoVisit30,
        no_visit_45_days: metrics.clientsNoVisit45,
        no_visit_60_days: metrics.clientsNoVisit60,
      },
      rankings: {
        top_services: metrics.topServices.slice(0, 5),
        top_products: metrics.topProducts.slice(0, 5),
        top_barbers: metrics.topBarbers.slice(0, 5),
      },
      inventory: {
        low_stock_products: metrics.lowStockProducts,
      },
      reviews: {
        pending: metrics.reviewsPending,
      },
    },
  });
}

export async function generateOwnerInsights(input: GenerateOwnerInsightsInput) {
  const question = trimQuestion(input.question);
  const fallbackNotice = "OpenAI no configurado. Usando analisis local.";
  const response = await createOwnerAIResponse({
    instructions: OWNER_AI_SYSTEM_PROMPT,
    input: buildCompactPayload({ ...input, question }),
  });

  if (!response.configured) {
    return {
      result: localResult(question, input.metrics, response.model, fallbackNotice),
      tokensInput: null,
      tokensOutput: null,
    };
  }

  const parsed = safeParseOwnerAI(response.outputText);

  if (!parsed) {
    return {
      result: localResult(question, input.metrics, response.model, "OpenAI respondio en un formato no valido. Usando analisis local."),
      tokensInput: response.inputTokens,
      tokensOutput: response.outputTokens,
    };
  }

  return {
    result: {
      ...parsed,
      mode: "openai" as const,
      model: response.model,
    },
    tokensInput: response.inputTokens,
    tokensOutput: response.outputTokens,
  };
}
