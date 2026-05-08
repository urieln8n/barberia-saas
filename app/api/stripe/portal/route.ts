import { NextResponse } from "next/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getAppUrl, getStripe } from "@/src/lib/stripe/server";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
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

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("barbershop_id", barbershopId)
      .not("stripe_customer_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subscriptionError) {
      return NextResponse.json({ error: subscriptionError.message }, { status: 500 });
    }

    if (!subscription?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Esta barbería todavía no tiene cliente de Stripe asociado." },
        { status: 404 }
      );
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${getAppUrl()}/dashboard/ajustes?billing=portal`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo abrir el portal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
