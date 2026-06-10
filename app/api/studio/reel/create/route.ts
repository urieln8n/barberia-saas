import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import {
  getReelRenderer, getMusicTrack,
  type ReelAssemblyInput, type ReelClip, type TextOverlay, type MusicMood,
} from "@/lib/studio/reels-engine";

// Credits per duration
const CREDITS_BY_DURATION: Record<number, number> = { 15: 3, 30: 5, 60: 8 };

type CreateReelBody = {
  clip_urls:     string[];
  hook_text?:    string;
  cta_text?:     string;
  hashtags?:     string[];
  music_mood?:   MusicMood;
  duration?:     15 | 30 | 60;
  style?:        string;
  logo_url?:     string;
  template_slug?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return NextResponse.json({ error: "Barbería no encontrada" }, { status: 403 });

  let body: CreateReelBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const {
    clip_urls,
    hook_text,
    cta_text,
    hashtags    = [],
    music_mood  = "energetico",
    duration    = 30,
    style       = "premium_morado",
    logo_url,
    template_slug = "custom",
  } = body;

  if (!clip_urls || clip_urls.length === 0) {
    return NextResponse.json({ error: "Se requiere al menos 1 clip_url" }, { status: 400 });
  }
  if (clip_urls.length > 12) {
    return NextResponse.json({ error: "Máximo 12 clips por Reel" }, { status: 400 });
  }

  const creditsNeeded = CREDITS_BY_DURATION[duration] ?? 5;

  // Deduct credits (fails gracefully if wallet empty)
  // biome-ignore lint: deduct_studio_credit not yet in generated types
  const { data: ok } = await (supabase as any).rpc("deduct_studio_credit", {
    p_barbershop_id: barbershopId,
    p_description:   `Reel ${duration}s · ${template_slug}`,
  });
  if (!ok) return NextResponse.json({ error: "Sin créditos disponibles" }, { status: 402 });

  // Deduct remaining credits beyond the first one
  for (let i = 1; i < creditsNeeded; i++) {
    // biome-ignore lint: deduct_studio_credit not yet in generated types
    await (supabase as any).rpc("deduct_studio_credit", {
      p_barbershop_id: barbershopId,
      p_description:   `Reel ${duration}s · crédito ${i + 1}/${creditsNeeded}`,
    });
  }

  // Resolve music track
  const track    = getMusicTrack(music_mood);
  const music_url = track?.url ?? null;

  // Insert reel job with status "pending"
  // biome-ignore lint: studio_reel_jobs not yet in generated types
  const { data: job, error: insertErr } = await (supabase as any)
    .from("studio_reel_jobs")
    .insert({
      barbershop_id: barbershopId,
      template_slug,
      duration,
      style,
      music_mood,
      clip_urls,
      hook_text:    hook_text ?? null,
      cta_text:     cta_text  ?? null,
      hashtags,
      logo_url:     logo_url  ?? null,
      music_url,
      renderer:     process.env.REEL_RENDERER ?? "shotstack",
      status:       "pending",
      credits_used: creditsNeeded,
    })
    .select("id")
    .single();

  if (insertErr || !job) {
    console.error("[reel/create] insert error:", insertErr);
    return NextResponse.json({ error: "Error al crear el job" }, { status: 500 });
  }

  const reelJobId: string = job.id;

  // Build ReelAssemblyInput
  const clipDuration = Math.floor(duration / clip_urls.length);
  const clips: ReelClip[] = clip_urls.map(url => ({
    url,
    duration: clipDuration,
    transition: "fade",
  }));

  const textOverlays: TextOverlay[] = [];
  if (hook_text) {
    textOverlays.push({
      text:      hook_text,
      style:     "hook",
      position:  "top",
      startTime: 0,
      duration:  Math.min(4, duration * 0.25),
    });
  }
  if (cta_text) {
    textOverlays.push({
      text:      cta_text,
      style:     "cta",
      position:  "bottom",
      startTime: Math.max(0, duration - 5),
      duration:  5,
    });
  }
  if (hashtags.length > 0) {
    textOverlays.push({
      text:      hashtags.map(h => `#${h}`).join("  "),
      style:     "hashtag",
      position:  "bottom",
      startTime: Math.max(0, duration - 3),
      duration:  3,
    });
  }

  const input: ReelAssemblyInput = {
    clips,
    music: track && music_url ? { url: music_url, volume: 0.35, fadeIn: 1, fadeOut: 2 } : null,
    textOverlays,
    logoUrl:     logo_url ?? null,
    duration:    duration as 15 | 30 | 60,
    aspectRatio: "9:16",
  };

  // Submit to renderer — Studio IA doesn't know which renderer is running
  try {
    const renderer = getReelRenderer();
    const { rendererJobId } = await renderer.render(input);

    // Update job with renderer job ID
    // biome-ignore lint: studio_reel_jobs not yet in generated types
    await (supabase as any)
      .from("studio_reel_jobs")
      .update({ status: "assembling", renderer_job_id: rendererJobId })
      .eq("id", reelJobId);

    return NextResponse.json({ reelJobId, status: "assembling" });
  } catch (err) {
    console.error("[reel/create] renderer.render() error:", err);
    // biome-ignore lint: studio_reel_jobs not yet in generated types
    await (supabase as any)
      .from("studio_reel_jobs")
      .update({ status: "failed", error_msg: String(err) })
      .eq("id", reelJobId);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al iniciar el ensamble" },
      { status: 500 },
    );
  }
}
