import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { isSafeAuditUrl } from "@/src/lib/audit/ssrf-guard";
import { normalizeShieldAuditResult } from "@/src/lib/audit/shield-result";
import { runInternalShieldAudit } from "@/src/lib/audit/internal-shield-audit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// 30 s — generous for slow sites + Python service startup
const AUDIT_SERVICE_TIMEOUT_MS = 30_000;
const PUBLIC_SERVICE_UNAVAILABLE_MESSAGE =
  "La auditoría automática está temporalmente no disponible. Puedes solicitar una revisión manual.";

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

    // ── 8. Run passive audit ────────────────────────────────────────────────
    const serviceUrl = process.env.SECURITY_AUDIT_SERVICE_URL;
    let auditResult: Record<string, unknown>;
    try {
      if (serviceUrl) {
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
      } else {
        auditResult = await runInternalShieldAudit(targetUrl);
      }
    } catch (fetchErr) {
      const msg =
        fetchErr instanceof Error ? fetchErr.message : "No se pudo analizar la URL pública.";

      await supabase
        .from("security_audits")
        .update({ status: "error", report: { error: "Audit unavailable" } })
        .eq("id", auditId);

      console.error("[security-audit] Passive audit failed:", msg);
      return NextResponse.json(
        {
          error: PUBLIC_SERVICE_UNAVAILABLE_MESSAGE,
          code: "AUDIT_SERVICE_UNAVAILABLE",
        },
        { status: 502 }
      );
    }

    // ── 9. Normalize and persist Shield result ───────────────────────────────
    const shieldResult = normalizeShieldAuditResult(auditResult, targetUrl, auditId);

    const report = {
      category_scores:      shieldResult.category_scores,
      detected_signals:     shieldResult.detected_signals,
      issues:               shieldResult.issues,
      recommendations:      shieldResult.recommendations,
      recommended_cta:      shieldResult.recommended_cta,
      security:             shieldResult.security,
      seo:                  shieldResult.seo,
      conversion:           shieldResult.conversion,
      barberiaos:           shieldResult.barberiaos,
      customer_conversion:  shieldResult.customer_conversion,
      summary:              shieldResult.summary,
      completed_at:         new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("security_audits")
      .update({ status: "done", score: shieldResult.score, report })
      .eq("id", auditId)
      .eq("barbershop_id", barbershopId); // RLS extra guard

    if (updateError) {
      // Non-fatal — result is already computed; log and continue
      console.error("[security-audit] Failed to save result:", updateError.message);
    }

    // ── 10. Return result ────────────────────────────────────────────────────
    return NextResponse.json(shieldResult);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno del servidor.";
    console.error("[security-audit] Unexpected error:", message);
    return NextResponse.json(
      { error: PUBLIC_SERVICE_UNAVAILABLE_MESSAGE },
      { status: 500 }
    );
  }
}
