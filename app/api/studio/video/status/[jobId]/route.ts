import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getVideoProvider } from "@/lib/studio/video-provider";

// Downloads the MP4 from a provider CDN and uploads it to Supabase Storage
// so the URL never expires. Falls back to klingUrl on any error.
async function mirrorVideoToStorage(
  klingUrl: string,
  barbershopId: string,
  jobId: string,
): Promise<string> {
  const videoRes = await fetch(klingUrl);
  if (!videoRes.ok) {
    throw new Error(`CDN download failed: HTTP ${videoRes.status}`);
  }

  const videoBuffer = await videoRes.arrayBuffer();
  const storagePath = `${barbershopId}/${jobId}.mp4`;

  const serviceClient = createServiceRoleClient();
  const { error: uploadError } = await serviceClient.storage
    .from("studio-videos")
    .upload(storagePath, videoBuffer, {
      contentType: "video/mp4",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = serviceClient.storage
    .from("studio-videos")
    .getPublicUrl(storagePath);

  return publicUrl;
}

export async function GET(
  _request: Request,
  { params }: { params: { jobId: string } },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return NextResponse.json({ error: "Barbería no encontrada" }, { status: 403 });

  const { jobId } = params;

  // biome-ignore lint: studio_video_jobs not yet in generated types
  const { data: job, error } = await (supabase as any)
    .from("studio_video_jobs")
    .select("id, status, provider, provider_job_id, output_video_url, thumbnail_url, error_msg, created_at")
    .eq("id", jobId)
    .eq("barbershop_id", barbershopId)
    .single();

  if (error || !job) return NextResponse.json({ error: "Job no encontrado" }, { status: 404 });

  // Terminal states: return immediately without calling provider
  if (job.status === "completed" || job.status === "failed") {
    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      videoUrl: job.output_video_url ?? null,
      thumbnailUrl: job.thumbnail_url ?? null,
      errorMsg: job.error_msg ?? null,
    });
  }

  // Poll provider for current status
  const provider = getVideoProvider(job.provider);
  const providerStatus = await provider.getStatus(job.provider_job_id, new Date(job.created_at));

  if (providerStatus.status === "completed" && providerStatus.videoUrl) {
    // Mirror CDN URL → Supabase Storage for permanent persistence.
    // Graceful fallback: if mirror fails (e.g. bucket not yet created),
    // store the provider CDN URL so the video is still accessible short-term.
    let permanentUrl = providerStatus.videoUrl;
    try {
      permanentUrl = await mirrorVideoToStorage(
        providerStatus.videoUrl,
        barbershopId,
        jobId,
      );
      console.log("[status] video mirrored to Storage:", permanentUrl);
    } catch (mirrorErr) {
      console.error("[status] mirror to Storage failed, using CDN URL:", mirrorErr);
    }

    // biome-ignore lint: complete_studio_video_job not yet in generated types
    await (supabase as any).rpc("complete_studio_video_job", {
      p_job_id: jobId,
      p_video_url: permanentUrl,
      p_thumbnail_url: providerStatus.thumbnailUrl ?? null,
    });

    return NextResponse.json({
      jobId: job.id,
      status: "completed",
      videoUrl: permanentUrl,
      thumbnailUrl: providerStatus.thumbnailUrl ?? null,
      errorMsg: null,
    });
  }

  if (providerStatus.status === "failed") {
    // biome-ignore lint: fail_studio_video_job not yet in generated types
    await (supabase as any).rpc("fail_studio_video_job", {
      p_job_id: jobId,
      p_error: providerStatus.errorMsg ?? "Error desconocido",
      p_requeue: false,
    });
  }

  return NextResponse.json({
    jobId: job.id,
    status: providerStatus.status,
    videoUrl: providerStatus.videoUrl ?? null,
    thumbnailUrl: providerStatus.thumbnailUrl ?? null,
    errorMsg: providerStatus.errorMsg ?? null,
  });
}
