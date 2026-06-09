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
  premium_morado:     "luxury barber shop, dramatic violet and gold lighting, premium cinematic aesthetic",
  lujo_dorado:        "luxury barber shop, rich gold and black tones, ultra high-end exclusive feel",
  urbano_moderno:     "modern urban barber shop, clean minimal lines, dynamic street-style energy",
  minimalista_limpio: "minimalist barber shop, pure white and light tones, clean sophisticated look",
  barberia_clasica:   "classic vintage barber shop, warm tones, traditional artisan craftsmanship",
};

// Ad-focused campaign prompts — each shot is designed to stop the scroll
const CAMPAIGN_PROMPTS: Record<string, string> = {
  llenar_agenda:     "empty premium barber chair with soft inviting light, close-up scissors and comb ready, atmosphere of calm availability — booking now vibe",
  oferta_flash:      "bold dynamic barber shop promotion scene, high contrast lighting, urgency and energy, clock ticking, deal visual impact",
  transformacion:    "dramatic side-by-side before-and-after haircut transformation reveal, same person, stunning makeover, jaw-drop moment",
  recuperar_cliente: "warm barber welcoming back a loyal customer with a handshake and smile, nostalgia and comfort, trust and familiarity",
  barbero_pro:       "skilled confident barber in action at work, close-up of precise razor technique, professional artistry and mastery",
  nuevo_servicio:    "exciting service launch reveal in barber shop, spotlight on new tool or product, curiosity and premiere energy",
  prueba_social:     "happy satisfied customer admiring fresh haircut in mirror, genuine authentic smile, social proof and delight",
  urgencia_reserva:  "barber shop calendar filling up fast, last slots visual, FOMO energy, urgency without being desperate",
};

const PLATFORM_DESC: Record<string, string> = {
  instagram_reel: "vertical 9:16 format, aspirational aesthetic quality",
  tiktok:         "vertical 9:16 format, raw authentic energy, fast cuts",
  whatsapp:       "vertical 9:16 format, personal close-up feel, warm and direct",
  facebook:       "square 1:1 format, clear and readable composition",
};

function buildPrompt(input: VideoGenerationInput): string {
  const styleDesc    = STYLE_DESC[input.style]          ?? "professional barber shop";
  const campaignDesc = CAMPAIGN_PROMPTS[input.templateType] ?? "professional barber shop scene";
  const platform     = (input.inputData as Record<string, string> | undefined)?.platform ?? "instagram_reel";
  const platformDesc = PLATFORM_DESC[platform] ?? PLATFORM_DESC.instagram_reel;
  return `${campaignDesc}, ${styleDesc}, ${platformDesc}, 4K cinematic quality, smooth camera motion, no text overlays, photorealistic`;
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
        aspect_ratio: (input.inputData as Record<string, string> | undefined)?.platform === "facebook" ? "1:1" : "9:16",
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
