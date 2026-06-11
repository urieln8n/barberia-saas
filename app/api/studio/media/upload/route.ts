// Simple media upload to Cloudinary — no credit deduction.
// Used by the Reel wizard to obtain public URLs for image/video assets
// before passing them to the Shotstack renderer.
import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { uploadToCloudinary } from "@/lib/studio/cloudinary";

export const maxDuration = 60;

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

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Campo 'file' requerido" }, { status: 400 });

  // Determine Cloudinary resource type from MIME
  const isVideo  = file.type.startsWith("video/");
  const isImage  = file.type.startsWith("image/");
  if (!isVideo && !isImage) {
    return NextResponse.json({ error: "Solo se aceptan imágenes o vídeos" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let result;
  try {
    result = await uploadToCloudinary(buffer, barbershopId, isVideo ? "video" : "image");
  } catch (err) {
    console.error("[media/upload] Cloudinary error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al subir el archivo" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    url:      result.secure_url,
    publicId: result.public_id,
    type:     isVideo ? "video" : "image",
    filename: file.name,
  });
}
