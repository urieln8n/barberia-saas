// Studio IA — Reels Engine public API.
// This is the ONLY file that Studio IA imports from reels-engine.
// All renderer-specific code stays inside renderers/*.

export type {
  ReelRenderer, ReelAssemblyInput, ReelAssemblyOutput, ReelJobStatus,
  ReelClip, ReelMusic, TextOverlay, TextStyle, ReelTransition,
  MusicMood, MusicTrack,
} from "./types";

export { getMusicTrack, MUSIC_LIBRARY } from "./music-library";

import { ShotstackRenderer }  from "./renderers/shotstack";
import { RemotionRenderer }    from "./renderers/remotion";
import { CreatomateRenderer }  from "./renderers/creatomate";
import { FFmpegRenderer }      from "./renderers/ffmpeg";
import type { ReelRenderer }   from "./types";

export type ReelRendererName = "shotstack" | "remotion" | "creatomate" | "ffmpeg";

/**
 * Returns the configured ReelRenderer.
 * Pass an explicit `name` to override the REEL_RENDERER env var
 * (used by the status route to poll with the same renderer that submitted the job).
 */
export function getReelRenderer(name?: string): ReelRenderer {
  const rendererName = (name ?? process.env.REEL_RENDERER ?? "shotstack") as ReelRendererName;
  switch (rendererName) {
    case "remotion":   return new RemotionRenderer();
    case "creatomate": return new CreatomateRenderer();
    case "ffmpeg":     return new FFmpegRenderer();
    case "shotstack":
    default:           return new ShotstackRenderer();
  }
}
