import type { VideoProvider, VideoGenerationInput, VideoJobStatus } from "../video-provider";

// JWT HS256 signed with ak (KLING_API_KEY) + sk (KLING_SECRET_KEY).
// Kling requires a fresh token per request — 30 min TTL.
// Uses Node.js 18+ native crypto.subtle: zero extra npm packages.
async function signKlingJWT(): Promise<string> {
  const ak = process.env.KLING_API_KEY;
  const sk = process.env.KLING_SECRET_KEY;
  if (!ak || !sk) {
    throw new Error("KLING_API_KEY / KLING_SECRET_KEY not set in environment");
  }

  const now = Math.floor(Date.now() / 1000);
  const b64url = (s: string) => Buffer.from(s).toString("base64url");

  const header  = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({ iss: ak, exp: now + 1800, nbf: now - 5 }));
  const body    = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sk),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const rawSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const sig = Buffer.from(rawSig).toString("base64url");

  return `${body}.${sig}`;
}

// ─── Prompt building ─────────────────────────────────────────────────────────

const STYLE_DESC: Record<string, string> = {
  premium_morado: "luxury barber shop, dramatic violet and gold lighting, premium cinematic aesthetic",
  premium_dorado: "luxury barber shop, rich gold and black tones, elegant high-end look",
  moderno:        "modern barber shop, clean minimal lines, contemporary fresh style",
  clasico:        "classic vintage barber shop, warm tones, traditional artisan craftsmanship",
};

const TYPE_PROMPTS: Record<string, string> = {
  corte_premium:       "professional barber performing a perfect fade haircut, close-up razor blade, slow-motion hair falling",
  antes_despues:       "dramatic before-and-after haircut transformation, split reveal, same person stunning makeover",
  oferta_semanal:      "dynamic barber shop weekly deal promotion, bold visual energy, strong call to action",
  promo_urgente:       "urgent flash sale barbershop, high-contrast bold energy, limited time offer",
  llenar_huecos:       "empty barber chair softly lit, available appointment slots, warm welcoming atmosphere",
  recuperar_clientes:  "warm barber greeting a returning loyal customer, nostalgia, trust and comfort",
  barbero_destacado:   "skilled barber confident portrait at work, professional grooming artistry, close-up hands",
  producto_destacado:  "luxury hair product close-up on marble counter, beauty showcase, premium brand feel",
  resena_cliente:      "happy satisfied customer admiring fresh haircut in mirror, genuine smile, social proof moment",
};

function buildPrompt(input: VideoGenerationInput): string {
  const styleDesc = STYLE_DESC[input.style] ?? "professional barber shop";
  const typeDesc  = TYPE_PROMPTS[input.templateType] ?? "professional barber shop scene";
  return `${typeDesc}, ${styleDesc}, 4K cinematic quality, vertical 9:16 aspect ratio, smooth camera motion, no text overlays`;
}

// ─── Kling API types ─────────────────────────────────────────────────────────

type KlingStatus = "submitted" | "processing" | "succeed" | "failed";

interface KlingTaskResponse {
  code: number;
  message: string;
  data?: {
    task_id: string;
    task_status: KlingStatus;
    task_status_msg?: string;
    task_result?: {
      videos?: Array<{ id: string; url: string; duration: string }>;
    };
  };
}

const KLING_BASE = "https://api.klingai.com";

// ─── Provider ────────────────────────────────────────────────────────────────

export class KlingProvider implements VideoProvider {
  async generateVideo(input: VideoGenerationInput): Promise<string> {
    const token = await signKlingJWT();

    const res = await fetch(`${KLING_BASE}/v1/videos/text2video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model:        process.env.KLING_MODEL ?? "kling-v1",
        prompt:       buildPrompt(input),
        mode:         "std",
        aspect_ratio: "9:16",
        duration:     "5",
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Kling generateVideo HTTP ${res.status}: ${body}`);
    }

    const json = (await res.json()) as KlingTaskResponse;

    if (json.code !== 0 || !json.data?.task_id) {
      throw new Error(`Kling API error ${json.code}: ${json.message}`);
    }

    return json.data.task_id;
  }

  async getStatus(providerJobId: string, _jobCreatedAt: Date): Promise<VideoJobStatus> {
    const token = await signKlingJWT();

    const res = await fetch(`${KLING_BASE}/v1/videos/text2video/${providerJobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Kling getStatus HTTP ${res.status}: ${body}`);
    }

    const json = (await res.json()) as KlingTaskResponse;

    if (json.code !== 0 || !json.data) {
      throw new Error(`Kling getStatus error ${json.code}: ${json.message}`);
    }

    const { task_status, task_result, task_status_msg } = json.data;

    switch (task_status) {
      case "succeed": {
        const videoUrl = task_result?.videos?.[0]?.url;
        if (!videoUrl) throw new Error("Kling: task succeed but no video URL in response");
        return { status: "completed", videoUrl };
      }
      case "failed":
        return {
          status: "failed",
          errorMsg: task_status_msg ?? "Kling generation failed",
        };
      default:
        // "submitted" | "processing"
        return { status: "processing" };
    }
  }
}
