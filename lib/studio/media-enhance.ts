// Studio IA — Media Enhancement types and constants.
// No server-only imports here so these can be used in client components.

export type EnhanceMode =
  | "improve_image"
  | "social_format"
  | "before_after"
  | "image_to_video"
  | "subtitles";

export type MediaPlatform =
  | "instagram_reel"
  | "tiktok"
  | "whatsapp"
  | "facebook"
  | "instagram_post";

export type EnhanceModeInput = {
  mode: EnhanceMode;
  platform?: MediaPlatform;
  style?: string;
};

export type ImageEnhanceResult = {
  type: "image";
  originalUrl: string;
  enhancedUrl: string;
  platform?: string;
};

export type VideoJobResult = {
  type: "video_job";
  jobId: string;
};

export type SubtitlesResult = {
  type: "subtitles";
  text: string;
  segments: { start: number; end: number; text: string }[];
  srt: string;
};

export type BeforeAfterResult = {
  type: "before_after";
  compositeUrl: string;
};

export type EnhanceResult =
  | ImageEnhanceResult
  | VideoJobResult
  | SubtitlesResult
  | BeforeAfterResult;

// ─── UI constants ──────────────────────────────────────────────────────────────

export type EnhanceModeDef = {
  mode: EnhanceMode;
  label: string;
  subline: string;
  icon: string;
  badge?: string;
  accepts: "image" | "video" | "two_images";
  creditsUsed: number;
};

export const ENHANCE_MODES: EnhanceModeDef[] = [
  {
    mode:        "improve_image",
    label:       "Mejorar imagen",
    subline:     "Nitidez, iluminación y recorte automático para redes",
    icon:        "✨",
    accepts:     "image",
    creditsUsed: 1,
  },
  {
    mode:        "social_format",
    label:       "Formato redes",
    subline:     "Recortar y adaptar a Instagram, TikTok o WhatsApp",
    icon:        "📐",
    accepts:     "image",
    creditsUsed: 1,
  },
  {
    mode:        "before_after",
    label:       "Antes / Después",
    subline:     "Combina dos fotos en un reel vertical listo para publicar",
    icon:        "🔀",
    badge:       "Popular",
    accepts:     "two_images",
    creditsUsed: 1,
  },
  {
    mode:        "image_to_video",
    label:       "Foto → Vídeo",
    subline:     "Convierte tu foto en un clip con movimiento cinematográfico",
    icon:        "🎬",
    badge:       "IA",
    accepts:     "image",
    creditsUsed: 2,
  },
  {
    mode:        "subtitles",
    label:       "Subtítulos automáticos",
    subline:     "Transcribe cualquier vídeo y obtén subtítulos en segundos",
    icon:        "💬",
    accepts:     "video",
    creditsUsed: 1,
  },
];

export const MEDIA_PLATFORMS: { id: MediaPlatform; label: string; subline: string }[] = [
  { id: "instagram_reel",  label: "Instagram Reel",  subline: "1080×1920 · 9:16" },
  { id: "tiktok",          label: "TikTok",          subline: "1080×1920 · 9:16" },
  { id: "whatsapp",        label: "WhatsApp Status", subline: "1080×1920 · 9:16" },
  { id: "facebook",        label: "Facebook",        subline: "1080×1080 · 1:1"  },
  { id: "instagram_post",  label: "Post Instagram",  subline: "1080×1080 · 1:1"  },
];
