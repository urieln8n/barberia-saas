import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { uploadToCloudinary, buildEnhancedUrl, buildBeforeAfterUrl } from "@/lib/studio/cloudinary";

export const config = { api: { bodyParser: false } };

// Handles: improve_image, social_format, before_after
// Accepts multipart/form-data with:
//   - file: File (image)
//   - file_after: File (only for before_after)
//   - mode: "improve_image" | "social_format" | "before_after"
//   - platform: MediaPlatform (optional)
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

  const mode     = formData.get("mode") as string;
  const platform = (formData.get("platform") as string) || undefined;

  if (!mode) return NextResponse.json({ error: "mode requerido" }, { status: 400 });

  // Deduct credit
  // biome-ignore lint: deduct_studio_credit not yet in generated types
  const { data: ok } = await (supabase as any).rpc("deduct_studio_credit", {
    p_barbershop_id: barbershopId,
    p_description:   `Media enhance: ${mode}`,
  });
  if (!ok) return NextResponse.json({ error: "Sin créditos disponibles" }, { status: 402 });

  try {
    if (mode === "before_after") {
      const fileBefore = formData.get("file") as File | null;
      const fileAfter  = formData.get("file_after") as File | null;
      if (!fileBefore || !fileAfter) {
        return NextResponse.json({ error: "Se requieren dos imágenes para antes/después" }, { status: 400 });
      }

      const [bufBefore, bufAfter] = await Promise.all([
        fileBefore.arrayBuffer().then(b => Buffer.from(b)),
        fileAfter.arrayBuffer().then(b => Buffer.from(b)),
      ]);

      const [uploadBefore, uploadAfter] = await Promise.all([
        uploadToCloudinary(bufBefore, barbershopId, "image"),
        uploadToCloudinary(bufAfter,  barbershopId, "image"),
      ]);

      const compositeUrl = buildBeforeAfterUrl(uploadBefore.public_id, uploadAfter.public_id);

      return NextResponse.json({
        type:         "before_after",
        compositeUrl,
        beforeUrl:    uploadBefore.secure_url,
        afterUrl:     uploadAfter.secure_url,
      });
    }

    // improve_image | social_format
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "file requerido" }, { status: 400 });

    const buffer   = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadToCloudinary(buffer, barbershopId, "image");

    const enhancedUrl = buildEnhancedUrl(uploaded.public_id, mode, platform);

    return NextResponse.json({
      type:        "image",
      originalUrl: uploaded.secure_url,
      enhancedUrl,
      platform,
    });
  } catch (err) {
    console.error("[media/enhance]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error procesando imagen" },
      { status: 500 },
    );
  }
}
