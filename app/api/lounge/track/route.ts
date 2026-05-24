import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import {
  LOUNGE_INTERACTION_TYPES,
  type LoungeInteractionType,
} from "@/src/lib/lounge/track-interaction";

/**
 * POST /api/lounge/track
 * Body: { slug: string, type: LoungeInteractionType, payload?: object }
 * Validates type, resolves barbershop_id by slug, inserts interaction.
 * Returns { ok: true } or { ok: false } — never throws 500.
 */
export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
    }

    const { slug, type, payload } = body as Record<string, unknown>;

    // Validate slug
    if (typeof slug !== "string" || !slug.trim()) {
      return NextResponse.json({ ok: false, error: "missing_slug" }, { status: 400 });
    }

    // Validate type
    if (
      typeof type !== "string" ||
      !(LOUNGE_INTERACTION_TYPES as string[]).includes(type)
    ) {
      return NextResponse.json({ ok: false, error: "invalid_type" }, { status: 400 });
    }

    // Validate payload (optional object, no personal data)
    const safePayload =
      typeof payload === "object" && payload !== null && !Array.isArray(payload)
        ? (payload as Record<string, unknown>)
        : {};

    const supabase = await createClient();

    // Resolve barbershop_id by slug (barbershops is a known table)
    const { data: barbershop, error: slugError } = await supabase
      .from("barbershops")
      .select("id")
      .eq("slug", slug.trim())
      .maybeSingle();

    if (slugError || !barbershop) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    // Insert interaction — lounge_interactions added in migration 031
    // Table not yet in generated types; using unknown cast until types are regenerated
    const lounge = supabase as unknown as {
      from: (table: "lounge_interactions") => {
        insert: (row: { barbershop_id: string; type: string; payload: Record<string, unknown> }) => Promise<{ error: { message: string } | null }>;
      };
    };

    const { error: insertError } = await lounge
      .from("lounge_interactions")
      .insert({
        barbershop_id: barbershop.id,
        type: type as LoungeInteractionType,
        payload: safePayload,
      });

    if (insertError) {
      console.error("[/api/lounge/track] insert error:", insertError.message);
      return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/lounge/track] unexpected error:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
