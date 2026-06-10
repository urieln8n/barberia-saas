import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getReelRenderer } from "@/lib/studio/reels-engine";

// Mirror the Shotstack-rendered MP4 to Supabase Storage so the URL is permanent.
async function mirrorReelToStorage(
  rendererUrl: string,
  barbershopId: string,
  reelJobId: string,
): Promise<string> {
  const videoRes = await fetch(rendererUrl);
  if (!videoRes.ok) throw new Error(`Download failed: HTTP ${videoRes.status}`);

  const buffer      = await videoRes.arrayBuffer();
  const storagePath = `${barbershopId}/reels/${reelJobId}.mp4`;

  const serviceClient = createServiceRoleClient();
  const { error: uploadError } = await serviceClient.storage
    .from("studio-videos")
    .upload(storagePath, buffer, { contentType: "video/mp4", upsert: true });

  if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

  const { data: { publicUrl } } = serviceClient.storage
    .from("studio-videos")
    .getPublicUrl(storagePath);

  return publicUrl;
}

export async function GET(
  _request: Request,
  { params }: { params: { reelJobId: string } },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return NextResponse.json({ error: "Barbería no encontrada" }, { status: 403 });

  const { reelJobId } = params;

  // biome-ignore lint: studio_reel_jobs not yet in generated types
  const { data: job, error } = await (supabase as any)
    .from("studio_reel_jobs")
    .select("id, status, renderer, renderer_job_id, final_url, thumbnail_url, error_msg")
    .eq("id", reelJobId)
    .eq("barbershop_id", barbershopId)
    .single();

  if (error || !job) return NextResponse.json({ error: "Job no encontrado" }, { status: 404 });

  // Terminal states — return immediately
  if (job.status === "completed" || job.status === "failed") {
    return NextResponse.json({
      reelJobId:    job.id,
      status:       job.status,
      finalUrl:     job.final_url    ?? null,
      thumbnailUrl: job.thumbnail_url ?? null,
      errorMsg:     job.error_msg    ?? null,
    });
  }

  if (!job.renderer_job_id) {
    return NextResponse.json({ reelJobId: job.id, status: job.status });
  }

  // Poll the renderer that submitted this job (may differ from current REEL_RENDERER)
  const renderer = getReelRenderer(job.renderer);
  let providerStatus;
  try {
    providerStatus = await renderer.getStatus(job.renderer_job_id);
  } catch (err) {
    console.error("[reel/status] getStatus error:", err);
    return NextResponse.json({
      reelJobId: job.id,
      status:    "assembling",
      errorMsg:  String(err),
    });
  }

  if (providerStatus.status === "completed" && providerStatus.videoUrl) {
    // Mirror to Supabase Storage so the URL never expires
    let permanentUrl = providerStatus.videoUrl;
    try {
      permanentUrl = await mirrorReelToStorage(
        providerStatus.videoUrl,
        barbershopId,
        reelJobId,
      );
      console.log("[reel/status] reel mirrored to Storage:", permanentUrl);
    } catch (mirrorErr) {
      console.error("[reel/status] mirror failed, using renderer URL:", mirrorErr);
    }

    // biome-ignore lint: complete_studio_reel_job not yet in generated types
    await (supabase as any).rpc("complete_studio_reel_job", {
      p_job_id:        reelJobId,
      p_final_url:     permanentUrl,
      p_thumbnail_url: providerStatus.thumbnailUrl ?? null,
    });

    return NextResponse.json({
      reelJobId,
      status:       "completed",
      finalUrl:     permanentUrl,
      thumbnailUrl: providerStatus.thumbnailUrl ?? null,
      errorMsg:     null,
    });
  }

  if (providerStatus.status === "failed") {
    // biome-ignore lint: fail_studio_reel_job not yet in generated types
    await (supabase as any).rpc("fail_studio_reel_job", {
      p_job_id: reelJobId,
      p_error:  providerStatus.errorMsg ?? "Error desconocido",
    });
  }

  return NextResponse.json({
    reelJobId,
    status:   providerStatus.status === "failed" ? "failed" : "assembling",
    errorMsg: providerStatus.errorMsg ?? null,
  });
}
