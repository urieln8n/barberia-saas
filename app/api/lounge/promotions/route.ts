import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import {
  getLoungePromotions,
  createLoungePromotion,
} from "@/src/lib/lounge/promotions";

/**
 * GET /api/lounge/promotions
 * Returns all promotions for the authenticated barbershop.
 */
export async function GET() {
  try {
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

    const promotions = await getLoungePromotions(supabase, barbershopId);
    return NextResponse.json({ promotions });
  } catch (err) {
    console.error("[GET /api/lounge/promotions]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

/**
 * POST /api/lounge/promotions
 * Creates a new promotion for the authenticated barbershop.
 * Body: { title, description?, price_label?, cta_label?, active?, sort_order? }
 */
export async function POST(req: NextRequest) {
  try {
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

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "title_required" }, { status: 400 });
    }

    const { data, error } = await createLoungePromotion(supabase, barbershopId, {
      title: title.trim(),
      description: typeof description === "string" ? description : null,
      price_label: typeof price_label === "string" ? price_label : null,
      cta_label: typeof cta_label === "string" ? cta_label : "Me interesa",
      active: typeof active === "boolean" ? active : true,
      sort_order: typeof sort_order === "number" ? sort_order : 0,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ promotion: data }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/lounge/promotions]", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
