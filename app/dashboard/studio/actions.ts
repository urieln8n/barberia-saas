"use server";

import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import {
  generateStudioContent,
  type StudioContentInput,
  type StudioContentOutput,
} from "@/lib/studio/generate-content";

type GenerateResult =
  | { data: StudioContentOutput; error: null }
  | { data: null; error: string };

export async function generateStudio(
  input: StudioContentInput
): Promise<GenerateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "No autenticado" };

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return { data: null, error: "Barbería no encontrada" };

  // Atomically deduct 1 credit (DB-level FOR UPDATE prevents race conditions)
  // biome-ignore lint: deduct_studio_credit RPC not yet in generated types
  const { data: ok } = await (supabase as any).rpc("deduct_studio_credit", {
    p_barbershop_id: barbershopId,
    p_description: `Generación: ${input.type}`,
  });

  if (!ok) return { data: null, error: "Sin créditos disponibles" };

  const result = generateStudioContent(input);

  // Persist the generation — fire and forget; don't block the response
  // biome-ignore lint: studio_contents not yet in generated types
  ;(supabase as any)
    .from("studio_contents")
    .insert({
      barbershop_id: barbershopId,
      type: input.type,
      title: result.title,
      style: input.style,
      script: result.script,
      on_screen_text: result.onScreenText,
      subtitles: result.subtitles,
      cta: result.cta,
      caption: result.instagramCaption,
      hashtags: result.hashtags,
      visual_idea: result.visualIdea,
      credits_used: 1,
    })
    .then(() => {});

  return { data: result, error: null };
}
