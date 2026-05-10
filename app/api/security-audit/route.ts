import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { isSafeAuditUrl } from "@/src/lib/audit/ssrf-guard";

export const dynamic = "force-dynamic";

// 30 s — generous for slow sites + Python service startup
const AUDIT_SERVICE_TIMEOUT_MS = 30_000;

export async function POST(request: Request) {
  try {
    // ── 1. Parse body ────────────────────────────────────────────────────────
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const { url, confirmed_authorized } = body;

    // ── 2. Require explicit authorization confirmation ────────────────────────
    if (confirmed_authorized !== true) {
      return NextResponse.json(
        {
          error:
            "Debes confirmar que estás autorizado a analizar esta URL " +
            "(confirmed_authorized: true).",
        },
        { status: 400 }
      );
    }

    // ── 3. Auth verification ─────────────────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para ejecutar una auditoría." },
        { status: 401 }
      );
    }

    // ── 4. Resolve barbershop ────────────────────────────────────────────────
    const barbershopId = await getCurrentBarbershopId(supabase, user.id);
    if (!barbershopId) {
      return NextResponse.json(
        { error: "No se encontró la barbería asociada a tu cuenta." },
        { status: 404 }
      );
    }

    // ── 5. Validate URL ──────────────────────────────────────────────────────
    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "Se requiere el campo 'url' con una URL válida." },
        { status: 400 }
      );
    }

    const targetUrl = url.trim();

    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return NextResponse.json(
        { error: "Solo se admiten URLs con esquema http:// o https://." },
        { status: 400 }
      );
    }

    if (targetUrl.length > 2048) {
      return NextResponse.json(
        { error: "La URL supera el límite de 2048 caracteres." },
        { status: 400 }
      );
    }

    // ── 6. SSRF protection ───────────────────────────────────────────────────
    const safe = await isSafeAuditUrl(targetUrl);
    if (!safe) {
      return NextResponse.json(
        {
          error:
            "URL no permitida: no se pueden auditar IPs privadas, " +
            "localhost, link-local ni metadatos cloud.",
        },
        { status: 422 }
      );
    }

    // ── 7. Create pending audit row ──────────────────────────────────────────
    const { data: auditRow, error: insertError } = await supabase
      .from("security_audits")
      .insert({
        barbershop_id: barbershopId,
        website_url:   targetUrl,
        status:        "running",
      })
      .select("id")
      .single();

    if (insertError || !auditRow) {
      console.error("[security-audit] Insert failed:", insertError?.message);
      return NextResponse.json(
        { error: "No se pudo registrar la auditoría. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    const auditId: string = auditRow.id;

    // ── 8. Call the Python audit microservice ────────────────────────────────
    const serviceUrl = process.env.SECURITY_AUDIT_SERVICE_URL;
    if (!serviceUrl) {
      await supabase
        .from("security_audits")
        .update({ status: "error", report: { error: "Servicio no configurado." } })
        .eq("id", auditId);

      return NextResponse.json(
        {
          error:
            "El servicio de auditoría no está configurado. " +
            "Añade SECURITY_AUDIT_SERVICE_URL al entorno.",
        },
        { status: 503 }
      );
    }

    let auditResult: Record<string, unknown>;
    try {
      const response = await fetch(`${serviceUrl.replace(/\/$/, "")}/audit`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: targetUrl }),
        signal:  AbortSignal.timeout(AUDIT_SERVICE_TIMEOUT_MS),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({})) as Record<string, unknown>;
        throw new Error(
          typeof errBody.detail === "string"
            ? errBody.detail
            : `El servicio respondió con HTTP ${response.status}.`
        );
      }

      auditResult = await response.json() as Record<string, unknown>;
    } catch (fetchErr) {
      const msg =
        fetchErr instanceof Error ? fetchErr.message : "Error de conexión con el servicio.";

      await supabase
        .from("security_audits")
        .update({ status: "error", report: { error: msg } })
        .eq("id", auditId);

      console.error("[security-audit] Service call failed:", msg);
      return NextResponse.json(
        { error: `No se pudo completar la auditoría: ${msg}` },
        { status: 502 }
      );
    }

    // ── 9. Persist result ────────────────────────────────────────────────────
    const rawScore = auditResult.score;
    const score: number | null =
      typeof rawScore === "number" && rawScore >= 0 && rawScore <= 100
        ? Math.round(rawScore)
        : null;

    const report = {
      security:     Array.isArray(auditResult.security)   ? auditResult.security   : [],
      seo:          Array.isArray(auditResult.seo)        ? auditResult.seo        : [],
      conversion:   Array.isArray(auditResult.conversion) ? auditResult.conversion : [],
      barberiaos:   Array.isArray(auditResult.barberiaos) ? auditResult.barberiaos : [],
      summary:      Array.isArray(auditResult.summary)    ? auditResult.summary    : [],
      completed_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("security_audits")
      .update({ status: "done", score, report })
      .eq("id", auditId)
      .eq("barbershop_id", barbershopId); // RLS extra guard

    if (updateError) {
      // Non-fatal — result is already computed; log and continue
      console.error("[security-audit] Failed to save result:", updateError.message);
    }

    // ── 10. Return result ────────────────────────────────────────────────────
    return NextResponse.json({
      audit_id:   auditId,
      url:        typeof auditResult.url === "string" ? auditResult.url : targetUrl,
      score,
      security:   report.security,
      seo:        report.seo,
      conversion: report.conversion,
      barberiaos: report.barberiaos,
      summary:    report.summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno del servidor.";
    console.error("[security-audit] Unexpected error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
