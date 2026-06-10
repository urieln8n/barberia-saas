import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { uploadToCloudinary } from "@/lib/studio/cloudinary";

// Kling image-to-video endpoint
const KLING_BASE = "https://api.klingai.com";

async function signKlingJWT(): Promise<string> {
  const ak = process.env.KLING_API_KEY;
  const sk = process.env.KLING_SECRET_KEY;
  if (!ak || !sk) throw new Error("KLING_API_KEY / KLING_SECRET_KEY not set");

  const now = Math.floor(Date.now() / 1000);
  const b64url = (s: string) => Buffer.from(s).toString("base64url");
  const header  = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({ iss: ak, exp: now + 1800, nbf: now - 5 }));
  const body    = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(sk),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const rawSig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `${body}.${Buffer.from(rawSig).toString("base64url")}`;
}

// Accepts multipart/form-data:
//   - file: File (image)
//   - style: ContentStyle
//   - platform: ContentPlatform
//   - prompt: optional extra prompt text
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return NextResponse.json({ error: "Barbería no encontrada" }, { status: 403 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const file     = formData.get("file") as File | null;
  const style    = (formData.get("style") as string) || "premium_morado";
  const platform = (formData.get("platform") as string) || "instagram_reel";
  const extraPrompt = (formData.get("prompt") as string) || "";

  if (!file) return NextResponse.json({ error: "file requerido" }, { status: 400 });

  const providerName = (process.env.VIDEO_PROVIDER ?? "mock") as string;

  // Deduct 2 credits (i2v costs more than text generation)
  if (providerName !== "mock") {
    // biome-ignore lint: deduct_studio_credit not yet in generated types
    const { data: ok } = await (supabase as any).rpc("deduct_studio_credit", {
      p_barbershop_id: barbershopId,
      p_description:   "Foto → Vídeo IA",
    });
    if (!ok) return NextResponse.json({ error: "Sin créditos disponibles" }, { status: 402 });
    // Deduct second credit
    await (supabase as any).rpc("deduct_studio_credit", {
      p_barbershop_id: barbershopId,
      p_description:   "Foto → Vídeo IA (crédito 2/2)",
    });
  }

  try {
    // 1. Upload image to Cloudinary to get a public URL
    const buffer  = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadToCloudinary(buffer, barbershopId, "image");
    const imageUrl = uploaded.secure_url;

    // 2. If mock provider, create a mock job
    if (providerName === "mock") {
      // biome-ignore lint: studio_video_jobs not yet in generated types
      const { data: job } = await (supabase as any)
        .from("studio_video_jobs")
        .insert({
          barbershop_id:   barbershopId,
          template_type:   "image_to_video",
          style,
          input_data:      { imageUrl, platform, extraPrompt },
          provider:        "mock",
          provider_job_id: `mock-i2v-${Date.now()}`,
          status:          "processing",
          started_at:      new Date().toISOString(),
        })
        .select("id").single();
      return NextResponse.json({ jobId: job?.id, status: "processing", provider: "mock" });
    }

    // 3. Submit to Kling i2v
    const token = await signKlingJWT();
    const aspectRatio = platform === "facebook" ? "1:1" : "9:16";

    const prompt = [
      "barber shop advertisement, professional marketing video",
      extraPrompt,
      `${style.replace(/_/g, " ")} aesthetic`,
      "smooth camera motion, cinematic, no text overlays",
    ].filter(Boolean).join(", ");

    const klingRes = await fetch(`${KLING_BASE}/v1/videos/image2video`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        model:        process.env.KLING_MODEL ?? "kling-v1",
        image:        imageUrl,
        prompt,
        mode:         "std",
        aspect_ratio: aspectRatio,
        duration:     "5",
      }),
    });

    if (!klingRes.ok) {
      const txt = await klingRes.text();
      throw new Error(`Kling i2v HTTP ${klingRes.status}: ${txt}`);
    }

    const klingJson = await klingRes.json() as { code: number; message: string; data?: { task_id: string } };
    if (klingJson.code !== 0 || !klingJson.data?.task_id) {
      throw new Error(`Kling i2v error ${klingJson.code}: ${klingJson.message}`);
    }

    const providerJobId = klingJson.data.task_id;

    // 4. Persist job (reuses existing studio_video_jobs + status polling route)
    // biome-ignore lint: studio_video_jobs not yet in generated types
    const { data: job } = await (supabase as any)
      .from("studio_video_jobs")
      .insert({
        barbershop_id:   barbershopId,
        template_type:   "image_to_video",
        style,
        input_data:      { imageUrl, platform, extraPrompt },
        provider:        "kling",
        provider_job_id: providerJobId,
        status:          "processing",
        started_at:      new Date().toISOString(),
      })
      .select("id").single();

    return NextResponse.json({ jobId: job?.id, status: "processing", provider: "kling" });
  } catch (err) {
    console.error("[media/i2v]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al iniciar la generación" },
      { status: 500 },
    );
  }
}
