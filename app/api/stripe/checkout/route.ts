import { NextResponse } from "next/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getStripePriceId, normalizeBillingPlanName } from "@/src/lib/stripe/plans";
import { getAppUrl, getStripe } from "@/src/lib/stripe/server";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const planName = normalizeBillingPlanName(body.plan);

    if (!planName || planName === "free") {
      return NextResponse.json(
        { error: "Selecciona un plan de pago válido." },
        { status: 400 }
      );
    }

    const priceId = getStripePriceId(planName);
    if (!priceId) {
      return NextResponse.json(
        { error: `Falta configurar el Price ID de Stripe para el plan ${planName}.` },
        { status: 500 }
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
        { error: "No se encontró la barbería actual." },
        { status: 404 }
      );
    }

    const { data: barbershop } = await supabase
      .from("barbershops")
      .select("name")
      .eq("id", barbershopId)
      .maybeSingle();

    const { data: currentSubscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("barbershop_id", barbershopId)
      .in("status", ["trial", "active"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const appUrl = getAppUrl();
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: currentSubscription?.stripe_customer_id ?? undefined,
      customer_email: currentSubscription?.stripe_customer_id ? undefined : user.email ?? undefined,
      client_reference_id: barbershopId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard/ajustes?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/ajustes?billing=cancelled`,
      metadata: {
        barbershop_id: barbershopId,
        plan_name: planName,
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          barbershop_id: barbershopId,
          plan_name: planName,
          user_id: user.id,
          barbershop_name: barbershop?.name ?? "",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear el checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
