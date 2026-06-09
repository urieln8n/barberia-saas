import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getVideoProvider } from "@/lib/studio/video-provider";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return NextResponse.json({ error: "Barbería no encontrada" }, { status: 403 });

  let body: { templateType?: string; style?: string; inputData?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { templateType, style, inputData } = body;
  if (!templateType || !style) {
    return NextResponse.json({ error: "templateType y style son requeridos" }, { status: 400 });
  }

  // biome-ignore lint: deduct_studio_credit not yet in generated types
  const { data: ok } = await (supabase as any).rpc("deduct_studio_credit", {
    p_barbershop_id: barbershopId,
    p_description: `Vídeo: ${templateType}`,
  });
  if (!ok) return NextResponse.json({ error: "Sin créditos disponibles" }, { status: 402 });

  const providerName = "mock";
  const provider = getVideoProvider(providerName);
  const providerJobId = await provider.generateVideo({
    templateType,
    style,
    inputData: inputData ?? {},
  });

  // biome-ignore lint: studio_video_jobs not yet in generated types
  const { data: job, error: insertError } = await (supabase as any)
    .from("studio_video_jobs")
    .insert({
      barbershop_id: barbershopId,
      template_type: templateType,
      style,
      input_data: inputData ?? {},
      provider: providerName,
      provider_job_id: providerJobId,
      status: "processing",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (insertError || !job) {
    return NextResponse.json({ error: "Error al crear el job" }, { status: 500 });
  }

  return NextResponse.json({
    jobId: job.id,
    providerJobId,
    provider: providerName,
    status: "processing",
  });
}
