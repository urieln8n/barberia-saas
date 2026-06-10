// Studio IA — Reels Engine types.
// The ReelRenderer interface is the ONLY contract between Studio IA and any
// assembly provider (Shotstack, Remotion, Creatomate, FFmpeg…).
// Studio IA never imports from a specific renderer directly.

// ─── Input types ─────────────────────────────────────────────────────────────

export type ReelTransition = "fade" | "cut" | "wipeLeft" | "wipeRight" | "slideLeft" | "slideRight";

export type ReelClip = {
  url: string;             // must be a permanent URL (Supabase Storage)
  duration: number;        // seconds — typically 5
  transition?: ReelTransition;
};

export type ReelMusic = {
  url: string;             // public audio URL (Supabase Storage)
  volume: number;          // 0.0–1.0
  fadeIn?: number;         // seconds
  fadeOut?: number;        // seconds
};

export type TextStyle = "hook" | "subtitle" | "cta" | "hashtag";

export type TextOverlay = {
  text: string;
  style: TextStyle;
  position: "top" | "center" | "bottom";
  startTime: number;       // seconds from beginning
  duration: number;        // seconds
};

export type ReelAssemblyInput = {
  clips: ReelClip[];
  music?: ReelMusic | null;
  textOverlays?: TextOverlay[];
  logoUrl?: string | null;
  duration: 15 | 30 | 60;  // total reel duration in seconds
  aspectRatio: "9:16" | "1:1" | "16:9";
};

// ─── Output types ─────────────────────────────────────────────────────────────

export type ReelAssemblyOutput = {
  rendererJobId: string;   // provider-specific job ID for polling
};

export type ReelJobStatus = {
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMsg?: string;
  progress?: number;       // 0–100 if provider exposes it
};

// ─── Renderer interface ───────────────────────────────────────────────────────

export interface ReelRenderer {
  /** Submit clips + assets for assembly. Returns a renderer job ID. */
  render(input: ReelAssemblyInput): Promise<ReelAssemblyOutput>;

  /** Poll provider for job status. */
  getStatus(rendererJobId: string): Promise<ReelJobStatus>;
}

// ─── Music mood ───────────────────────────────────────────────────────────────

export type MusicMood = "energetico" | "relajado" | "premium" | "urbano" | "none";

export type MusicTrack = {
  id: string;
  name: string;
  mood: MusicMood;
  duration: number;        // seconds
  url: string;             // public URL
};
