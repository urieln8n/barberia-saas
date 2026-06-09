"use server";

import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getOpenAIClient, getOwnerAIModel } from "@/src/lib/ai/openai-client";
import {
  getFallbackCampaign,
  type AdCampaignInput,
  type AdCampaignOutput,
  type CampaignType,
  type ContentPlatform,
  type ContentStyle,
} from "@/lib/studio/generate-content";

// ─── OpenAI structured output schema ─────────────────────────────────────────

const AD_SCHEMA = {
  type: "object",
  properties: {
    hook:            { type: "string" },
    caption:         { type: "string" },
    hashtags:        { type: "array", items: { type: "string" } },
    cta:             { type: "string" },
    onScreenText:    { type: "string" },
    visualIdea:      { type: "string" },
    bestPostingTime: { type: "string" },
  },
  required: ["hook", "caption", "hashtags", "cta", "onScreenText", "visualIdea", "bestPostingTime"],
  additionalProperties: false,
} as const;

const SYSTEM_INSTRUCTIONS = `Eres un experto en marketing digital para barberías. Creas anuncios virales que generan reservas directas.

REGLAS:
1. Hook (campo "hook"): 1-2 frases que paran el scroll. Urgencia, curiosidad o impacto inmediato.
2. Todo el copy termina en una acción: RESERVAR. Sin excepción.
3. Caption en español con emojis estratégicos. Máximo 180 palabras.
4. hashtags: 8-12 palabras SIN el símbolo #. Mezcla nicho + locales + trending.
5. onScreenText: máximo 3 líneas cortas para sobreponer en vídeo.
6. visualIdea: instrucción concreta de cómo grabar/montar el vídeo.
7. bestPostingTime: día(s) y hora(s) concretos según comportamiento de audiencia.
8. Adapta el tono al platform indicado.
Responde exclusivamente en español.`;

const CAMPAIGN_CONTEXT: Record<CampaignType, string> = {
  llenar_agenda:     "Hay huecos vacíos disponibles. Objetivo: convertirlos en reservas urgentes.",
  oferta_flash:      "Hay una oferta especial por tiempo limitado. Crear urgencia real para reservar.",
  transformacion:    "Mostrar un antes/después que demuestre el nivel de la barbería. El resultado visual debe convencer.",
  recuperar_cliente: "Reactivar clientes que llevan más de 4 semanas sin visitar. Tono cálido y cercano, no agresivo.",
  barbero_pro:       "Destacar a un barbero del equipo para humanizar la marca y generar confianza personal.",
  nuevo_servicio:    "Lanzar un nuevo servicio o producto. Crear curiosidad y deseo de ser el primero.",
  prueba_social:     "Usar testimonios o reseñas reales para generar prueba social y reservas.",
  urgencia_reserva:  "Comunicar escasez real de plazas. Crear FOMO genuino para reservar ahora mismo.",
};

const PLATFORM_CONTEXT: Record<ContentPlatform, string> = {
  instagram_reel: "Instagram Reels: aspiracional, estético, primeros 3s críticos, CTA al link en bio.",
  tiktok:         "TikTok: crudo, auténtico, hooks directos y coloquiales, energía alta y rápida.",
  whatsapp:       "WhatsApp Status: personal y directo como mensaje de conocido. Máximo 15 segundos de atención.",
  facebook:       "Facebook: audiencia 30-55 años, más explicativo, CTA a WhatsApp o link directo.",
};

const STYLE_CONTEXT: Record<ContentStyle, string> = {
  premium_morado:     "Estilo premium/violet. Aspiracional, moderno y diferenciado.",
  lujo_dorado:        "Estilo lujo/gold. Ultra premium y exclusivo.",
  urbano_moderno:     "Estilo urbano. Dinámico, joven y callejero.",
  minimalista_limpio: "Estilo minimal. Clean, simple y sofisticado.",
  barberia_clasica:   "Estilo clásico. Tradición, artesanía y calidez vintage.",
};

function buildPrompt(input: AdCampaignInput): string {
  const lines = [
    `Barbería: "${input.barbershopName}"`,
    `Campaña: ${CAMPAIGN_CONTEXT[input.campaign]}`,
    `Plataforma: ${PLATFORM_CONTEXT[input.platform]}`,
    `Estilo visual: ${STYLE_CONTEXT[input.style]}`,
  ];
  if (input.barberName)     lines.push(`Barbero protagonista: ${input.barberName}`);
  if (input.offerDetail)    lines.push(`Detalle (servicio/oferta/reseña): ${input.offerDetail}`);
  if (input.urgencyMessage) lines.push(`Mensaje de urgencia: "${input.urgencyMessage}"`);
  lines.push("\nCrea el anuncio completo optimizado para RESERVAS REALES.");
  return lines.join("\n");
}

// ─── Server action ────────────────────────────────────────────────────────────

type GenerateResult =
  | { data: AdCampaignOutput; error: null }
  | { data: null; error: string };

export async function generateStudio(input: AdCampaignInput): Promise<GenerateResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "No autenticado" };

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return { data: null, error: "Barbería no encontrada" };

  // biome-ignore lint: deduct_studio_credit not yet in generated types
  const { data: ok } = await (supabase as any).rpc("deduct_studio_credit", {
    p_barbershop_id: barbershopId,
    p_description: `Anuncio: ${input.campaign} · ${input.platform}`,
  });
  if (!ok) return { data: null, error: "Sin créditos disponibles" };

  // Generate with OpenAI (fallback to templates if unavailable)
  let result: AdCampaignOutput;
  const client = getOpenAIClient();

  if (client) {
    try {
      const response = await client.responses.create({
        model: getOwnerAIModel(),
        instructions: SYSTEM_INSTRUCTIONS,
        input: buildPrompt(input),
        max_output_tokens: 650,
        store: false,
        text: {
          format: {
            type: "json_schema",
            name: "ad_campaign",
            strict: true,
            schema: AD_SCHEMA,
          },
        },
      });

      if (response.output_text) {
        const parsed = JSON.parse(response.output_text) as {
          hook: string; caption: string; hashtags: string[]; cta: string;
          onScreenText: string; visualIdea: string; bestPostingTime: string;
        };
        result = { ...parsed, campaign: input.campaign, platform: input.platform, creditsUsed: 1 };
      } else {
        result = getFallbackCampaign(input);
      }
    } catch (err) {
      console.error("[generateStudio] OpenAI error, using fallback:", err);
      result = getFallbackCampaign(input);
    }
  } else {
    result = getFallbackCampaign(input);
  }

  // Persist to studio_contents (maps new shape to existing columns)
  // biome-ignore lint: studio_contents not yet in generated types
  await (supabase as any).from("studio_contents").insert({
    barbershop_id:  barbershopId,
    type:           input.campaign,
    title:          `${input.campaign} · ${input.platform}`,
    style:          input.style,
    script:         result.hook,
    on_screen_text: result.onScreenText,
    subtitles:      [],
    cta:            result.cta,
    caption:        result.caption,
    hashtags:       result.hashtags,
    visual_idea:    result.visualIdea,
    credits_used:   1,
  });

  return { data: result, error: null };
}
