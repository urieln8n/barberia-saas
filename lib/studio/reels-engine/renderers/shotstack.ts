import "server-only";
import type {
  ReelRenderer, ReelAssemblyInput, ReelAssemblyOutput, ReelJobStatus,
  ReelClip, TextOverlay,
} from "../types";

// Shotstack base URL controlled by SHOTSTACK_ENV env var.
// "staging" = free sandbox (watermarked, no cost). Shotstack removed /v1 prefix from sandbox routes in 2025.
// "production" = paid renders, no watermark
const BASE_URL =
  process.env.SHOTSTACK_ENV === "production"
    ? "https://api.shotstack.io/edit/v1"
    : "https://api.shotstack.io/stage";

function apiKey(): string {
  const key = process.env.SHOTSTACK_API_KEY;
  if (!key) throw new Error("SHOTSTACK_API_KEY not set in environment");
  return key;
}

// ─── Timeline builder ─────────────────────────────────────────────────────────

// Supports both image and video assets.
// Images use Ken Burns effects (zoomIn, zoomOut, slideLeft, slideRight) to animate.
// Videos are passed directly. mediaType defaults to "video" for backward compat.
function buildMediaTrack(clips: ReelClip[]): object {
  let currentTime = 0;
  const shotstackClips = clips.map((clip, i) => {
    const isImage = clip.mediaType === "image";
    const obj: Record<string, unknown> = {
      asset: isImage
        ? { type: "image", src: clip.url }
        : { type: "video", src: clip.url, volume: 1 },
      start:  currentTime,
      length: clip.duration,
    };
    // Ken Burns effect for static images (animates the image)
    if (isImage && clip.effect) {
      obj.effect = clip.effect;
    }
    // Transition between clips (not on last clip)
    if (i < clips.length - 1) {
      const t = clip.transition ?? "fade";
      obj.transition = { in: t, out: t };
    }
    currentTime += clip.duration;
    return obj;
  });
  return { clips: shotstackClips };
}

// Shotstack HTML text overlays — uses Montserrat via Google Fonts for impact.
const GOOGLE_FONTS_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" rel="stylesheet">';

const TEXT_STYLES: Record<TextOverlay["style"], string> = {
  hook: [
    "font-family:'Montserrat',sans-serif",
    "font-size:68px",
    "font-weight:900",
    "color:#FFFFFF",
    "text-align:center",
    "text-shadow:0 4px 16px rgba(0,0,0,0.9)",
    "line-height:1.15",
    "padding:16px",
  ].join(";"),

  subtitle: [
    "font-family:'Montserrat',sans-serif",
    "font-size:42px",
    "font-weight:700",
    "color:#F3E8FF",
    "text-align:center",
    "text-shadow:0 3px 10px rgba(0,0,0,0.85)",
    "padding:12px",
  ].join(";"),

  cta: [
    "font-family:'Montserrat',sans-serif",
    "font-size:52px",
    "font-weight:900",
    "color:#FFFFFF",
    "text-align:center",
    "background-color:#7C3AED",
    "border-radius:20px",
    "padding:16px 40px",
    "box-shadow:0 8px 24px rgba(0,0,0,0.6)",
    "white-space:nowrap",
  ].join(";"),

  hashtag: [
    "font-family:'Montserrat',sans-serif",
    "font-size:30px",
    "font-weight:600",
    "color:#DDD6FE",
    "text-align:center",
    "text-shadow:0 2px 8px rgba(0,0,0,0.8)",
    "padding:8px",
  ].join(";"),
};

// Shotstack 2025 API accepts: top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft, center
const POSITION_MAP: Record<TextOverlay["position"], string> = {
  top:    "top",
  center: "center",
  bottom: "bottom",
};

const OFFSET_Y: Record<TextOverlay["position"], number> = {
  top:    0.1,
  center: 0,
  bottom: -0.1,
};

function buildTextTrack(overlays: TextOverlay[]): object {
  const clips = overlays.map(overlay => ({
    asset: {
      type: "html",
      html: `${GOOGLE_FONTS_LINK}<div style="${TEXT_STYLES[overlay.style]}">${overlay.text}</div>`,
      width:  1000,
      height: 300,
    },
    start:    overlay.startTime,
    length:   overlay.duration,
    position: POSITION_MAP[overlay.position],
    offset:   { x: 0, y: OFFSET_Y[overlay.position] },
  }));
  return { clips };
}

function buildLogoTrack(logoUrl: string, totalDuration: number): object {
  return {
    clips: [{
      asset:    { type: "image", src: logoUrl },
      start:    0,
      length:   totalDuration,
      position: "topRight",
      offset:   { x: -0.04, y: -0.04 },
      scale:    0.14,
      opacity:  0.88,
    }],
  };
}

function buildTimeline(input: ReelAssemblyInput): Record<string, unknown> {
  const tracks: object[] = [buildMediaTrack(input.clips)];

  if (input.textOverlays && input.textOverlays.length > 0) {
    tracks.push(buildTextTrack(input.textOverlays));
  }

  if (input.logoUrl) {
    tracks.push(buildLogoTrack(input.logoUrl, input.duration));
  }

  const timeline: Record<string, unknown> = { tracks };

  if (input.music?.url) {
    timeline.soundtrack = {
      src:    input.music.url,
      effect: "fadeInFadeOut",
      volume: input.music.volume,
    };
  }

  return timeline;
}

// ─── Shotstack API types ──────────────────────────────────────────────────────

type ShotstackSubmitResponse = {
  success: boolean;
  message: string;
  response: { id: string; message: string };
};

type ShotstackStatusResponse = {
  success: boolean;
  message: string;
  response: {
    id: string;
    status: "queued" | "fetching" | "rendering" | "saving" | "done" | "failed";
    url?: string;
    thumbnail?: string;
    error?: string;
  };
};

// ─── ShotstackRenderer ───────────────────────────────────────────────────────

export class ShotstackRenderer implements ReelRenderer {
  async render(input: ReelAssemblyInput): Promise<ReelAssemblyOutput> {
    const body = {
      timeline: buildTimeline(input),
      output: {
        format:      "mp4",
        resolution:  "hd",     // 1280×720 for 16:9; Shotstack adapts to aspectRatio
        aspectRatio: input.aspectRatio,
        fps:         25,
        quality:     "high",
      },
    };

    const res = await fetch(`${BASE_URL}/render`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":    apiKey(),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Shotstack render submit HTTP ${res.status}: ${txt}`);
    }

    const json = (await res.json()) as ShotstackSubmitResponse;
    if (!json.success) {
      throw new Error(`Shotstack render error: ${json.message}`);
    }

    return { rendererJobId: json.response.id };
  }

  async getStatus(rendererJobId: string): Promise<ReelJobStatus> {
    const res = await fetch(`${BASE_URL}/render/${rendererJobId}`, {
      headers: { "x-api-key": apiKey() },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Shotstack getStatus HTTP ${res.status}: ${txt}`);
    }

    const json = (await res.json()) as ShotstackStatusResponse;

    switch (json.response.status) {
      case "done":
        return {
          status:       "completed",
          videoUrl:     json.response.url,
          thumbnailUrl: json.response.thumbnail,
        };
      case "failed":
        return {
          status:   "failed",
          errorMsg: json.response.error ?? "Shotstack render failed",
        };
      default:
        return { status: "processing" };
    }
  }
}
