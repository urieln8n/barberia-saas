import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getOpenAIClient } from "@/src/lib/ai/openai-client";
import { toFile } from "openai";

export const config = { api: { bodyParser: false } };

// Converts Whisper segments to SRT subtitle format
function toSRT(segments: { start: number; end: number; text: string }[]): string {
  return segments
    .map((seg, i) => {
      const fmt = (s: number) => {
        const ms  = Math.round(s * 1000) % 1000;
        const sec = Math.floor(s) % 60;
        const min = Math.floor(s / 60) % 60;
        const hr  = Math.floor(s / 3600);
        return `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
      };
      return `${i + 1}\n${fmt(seg.start)} --> ${fmt(seg.end)}\n${seg.text.trim()}\n`;
    })
    .join("\n");
}

// Accepts multipart/form-data:
//   - file: File (video or audio — mp4, mov, mp3, m4a, webm)
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return NextResponse.json({ error: "Barbería no encontrada" }, { status: 403 });

  // biome-ignore lint: deduct_studio_credit not yet in generated types
  const { data: ok } = await (supabase as any).rpc("deduct_studio_credit", {
    p_barbershop_id: barbershopId,
    p_description:   "Subtítulos automáticos (Whisper)",
  });
  if (!ok) return NextResponse.json({ error: "Sin créditos disponibles" }, { status: 402 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file requerido" }, { status: 400 });

  // Whisper accepts up to 25 MB
  const MAX_BYTES = 25 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Archivo demasiado grande. Máximo 25 MB. Para vídeos largos, extrae primero el audio." },
      { status: 413 },
    );
  }

  const client = getOpenAIClient();
  if (!client) {
    return NextResponse.json(
      { error: "OpenAI no configurado. Añade OPENAI_API_KEY en las variables de entorno." },
      { status: 503 },
    );
  }

  try {
    const buffer   = Buffer.from(await file.arrayBuffer());
    const openaiFile = await toFile(buffer, file.name, { type: file.type });

    const transcription = await client.audio.transcriptions.create({
      file:            openaiFile,
      model:           "whisper-1",
      language:        "es",
      response_format: "verbose_json",
    });

    // verbose_json includes segments with timestamps
    const segments = (transcription as unknown as {
      segments?: { start: number; end: number; text: string }[];
    }).segments ?? [];

    const srt = toSRT(segments);

    return NextResponse.json({
      type:     "subtitles",
      text:     transcription.text,
      segments,
      srt,
    });
  } catch (err) {
    console.error("[media/subtitles]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error al transcribir" },
      { status: 500 },
    );
  }
}
