// Studio IA — Music library for Reels Engine.
// Tracks are royalty-free (CC0 / Pixabay license).
// Actual audio files must be uploaded to Supabase Storage and their public
// URLs set via environment variables before music is active.
// If a URL is empty/unset, the reel is assembled without audio.

import type { MusicMood, MusicTrack } from "./types";

// Each mood maps to 1 env var pointing to a public audio file.
// Upload your tracks to Supabase Storage under the bucket "studio-videos"
// in a path like: music/energetico.mp3
// Then set: MUSIC_ENERGETICO=https://...supabase.co/storage/v1/object/public/studio-videos/music/energetico.mp3
const MUSIC_URLS: Record<Exclude<MusicMood, "none">, string> = {
  energetico: process.env.MUSIC_ENERGETICO ?? "",
  relajado:   process.env.MUSIC_RELAJADO   ?? "",
  premium:    process.env.MUSIC_PREMIUM    ?? "",
  urbano:     process.env.MUSIC_URBANO     ?? "",
};

export const MUSIC_LIBRARY: MusicTrack[] = [
  { id: "energetico_1", name: "Urban Barber Beat",    mood: "energetico", duration: 90, url: MUSIC_URLS.energetico },
  { id: "relajado_1",   name: "Smooth Shop Vibes",    mood: "relajado",   duration: 90, url: MUSIC_URLS.relajado   },
  { id: "premium_1",    name: "Luxury Grooming",      mood: "premium",    duration: 90, url: MUSIC_URLS.premium    },
  { id: "urbano_1",     name: "Street Style Cuts",    mood: "urbano",     duration: 90, url: MUSIC_URLS.urbano     },
];

/**
 * Returns the music track for the given mood.
 * Returns null when mood is "none" or when no URL is configured for the mood.
 */
export function getMusicTrack(mood: MusicMood): MusicTrack | null {
  if (mood === "none") return null;
  const track = MUSIC_LIBRARY.find(t => t.mood === mood && t.url.length > 0);
  return track ?? null;
}
