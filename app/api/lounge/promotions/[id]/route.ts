import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import {
  updateLoungePromotion,
  deleteLoungePromotion,
  toggleLoungePromotion,
} from "@/src/lib/lounge/promotions";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PUT /api/lounge/promotions/[id]
 * Updates a promotion. Validates ownership by barbershop_id.
 */
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const barbershopId = await getCurrentBarbershopId(supabase, user.id);
    if (!barbershopId) {
      return NextResponse.json({ error: "barbershop_not_found" }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const {
      title,
      description,
      price_label,
      cta_label,
      active,
      sort_order,
    } = body as Record<string, unknown>;

    const updatePayload: Record<string, unknown> = {};
    if (typeof title === "string") updatePayload.title = title.trim();
    if (description !== undefined) updatePayload.description = description;
    if (price_label !== undefined) updatePayload.price_label = price_label;
    if (typeof cta_label === "string") updatePayload.cta_label = cta_label;
    if (typeof active === "boolean") updatePayload.active = active;
    if (typeof sort_order === "number") updatePayload.sort_order = sort_order;

    const { data, error } = await updateLoungePromotion(
      supabase,
      barbershopId,
      id,
      updatePayload
    );

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ promotion: data });
  } catch (err) {
    console.error("[PUT /api/lounge/promotions/[id]]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

/**
 * DELETE /api/lounge/promotions/[id]
 * Deletes a promotion. Validates ownership by barbershop_id.
 */
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const barbershopId = await getCurrentBarbershopId(supabase, user.id);
    if (!barbershopId) {
      return NextResponse.json({ error: "barbershop_not_found" }, { status: 404 });
    }

    const { error } = await deleteLoungePromotion(supabase, barbershopId, id);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/lounge/promotions/[id]]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

/**
 * PATCH /api/lounge/promotions/[id]
 * Toggle active/inactive. Body: { active: boolean }
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const barbershopId = await getCurrentBarbershopId(supabase, user.id);
    if (!barbershopId) {
      return NextResponse.json({ error: "barbershop_not_found" }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const { active } = (body as Record<string, unknown>) ?? {};

    if (typeof active !== "boolean") {
      return NextResponse.json({ error: "active_must_be_boolean" }, { status: 400 });
    }

    const { error } = await toggleLoungePromotion(supabase, barbershopId, id, active);

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/lounge/promotions/[id]]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
