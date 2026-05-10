import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/src/lib/stripe/server";
import { syncStripeSubscriptionToSupabase } from "@/src/lib/stripe/sync-subscription";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function recordStripeEvent(event: Stripe.Event) {
  const supabase = createServiceRoleClient();

  const { error } = await supabase.from("stripe_events").insert({
    id: event.id,
    type: event.type,
    payload: event as unknown as Record<string, unknown>,
  });

  if (error?.code === "23505") {
    return { alreadyProcessed: true, supabase };
  }

  if (error) throw error;

  return { alreadyProcessed: false, supabase };
}

async function syncSubscriptionById(subscriptionId: string, fallbackBarbershopId?: string | null) {
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const supabase = createServiceRoleClient();

  await syncStripeSubscriptionToSupabase({
    supabase,
    subscription,
    fallbackBarbershopId,
  });
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const { alreadyProcessed, supabase } = await recordStripeEvent(event);
    if (alreadyProcessed) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (subscriptionId) {
          await syncSubscriptionById(
            subscriptionId,
            session.metadata?.barbershop_id ?? session.client_reference_id
          );
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await syncStripeSubscriptionToSupabase({ supabase, subscription });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;

        if (subscriptionId) {
          await syncSubscriptionById(subscriptionId);
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
