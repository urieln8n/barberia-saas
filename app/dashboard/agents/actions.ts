"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { runRetencionAgent } from "@/src/lib/agents/agents/retencion";
import { runHuecosAgent } from "@/src/lib/agents/agents/huecos";
import { runResenasAgent } from "@/src/lib/agents/agents/resenas";

export type AgentRunResult = {
  ok: boolean;
  preview?: string;
  count?: number;
  error?: string;
};

export async function runAgentAction(agentId: string): Promise<AgentRunResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("slug")
    .eq("id", barbershopId)
    .maybeSingle();

  const slug = (barbershop?.slug as string | null) ?? barbershopId;

  try {
    if (agentId === "retencion") {
      const result = await runRetencionAgent(supabase, barbershopId, slug);
      return { ok: true, preview: result.preview, count: result.count };
    }

    if (agentId === "huecos") {
      const result = await runHuecosAgent(supabase, barbershopId, slug);
      return { ok: true, preview: result.preview, count: result.freeSlots };
    }

    if (agentId === "resenas") {
      const result = await runResenasAgent(supabase, barbershopId);
      return { ok: true, preview: result.preview, count: result.completedToday };
    }

    return { ok: false, error: "Agente no disponible todavía." };
  } catch {
    return { ok: false, error: "Error ejecutando el agente. Inténtalo de nuevo." };
  }
}
