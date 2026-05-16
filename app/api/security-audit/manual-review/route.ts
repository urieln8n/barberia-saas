import { NextResponse } from "next/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { isSafeAuditUrl } from "@/src/lib/audit/ssrf-guard";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

const PUBLIC_ERROR_MESSAGE =
  "No se pudo registrar la revisión manual. Inténtalo de nuevo o contacta con soporte.";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) : null;

    if (!url) {
      return NextResponse.json({ error: "Introduce una URL pública para revisar." }, { status: 400 });
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json(
        { error: "Solo se admiten URLs con esquema http:// o https://." },
        { status: 400 }
      );
    }

    if (url.length > 2048) {
      return NextResponse.json({ error: "La URL supera el límite de 2048 caracteres." }, { status: 400 });
    }

    const safe = await isSafeAuditUrl(url);
    if (!safe) {
      return NextResponse.json(
        { error: "Solo se pueden solicitar revisiones de webs públicas." },
        { status: 422 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
    }

    const barbershopId = await getCurrentBarbershopId(supabase, user.id);
    if (!barbershopId) {
      return NextResponse.json(
        { error: "No se encontró la barbería asociada a tu cuenta." },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("shield_manual_review_requests")
      .insert({
        barbershop_id: barbershopId,
        user_id: user.id,
        url,
        notes,
        status: "pending",
      })
      .select("id, status, created_at")
      .single();

    if (error || !data) {
      console.error("[security-audit/manual-review] Insert failed:", error?.message);
      return NextResponse.json({ error: PUBLIC_ERROR_MESSAGE }, { status: 500 });
    }

    return NextResponse.json({ ok: true, request: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[security-audit/manual-review] Unexpected error:", message);
    return NextResponse.json({ error: PUBLIC_ERROR_MESSAGE }, { status: 500 });
  }
}
