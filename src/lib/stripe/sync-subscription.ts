import type { SupabaseClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import {
  BILLING_PLANS,
  type BillingPlanName,
  getPlanFromStripePriceId,
  normalizeBillingPlanName,
} from "@/src/lib/stripe/plans";

type StripeSubscriptionLike = Stripe.Subscription & {
  current_period_start?: number;
  current_period_end?: number;
};

function fromUnix(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}

export function mapStripeSubscriptionStatus(status: string) {
  if (status === "trialing") return "trial";
  if (status === "active") return "active";
  if (status === "canceled") return "cancelled";
  return "paused";
}

function firstPriceId(subscription: StripeSubscriptionLike) {
  return subscription.items.data[0]?.price?.id ?? null;
}

export function resolvePlanFromStripeSubscription(
  subscription: StripeSubscriptionLike
): BillingPlanName {
  const metadataPlan = normalizeBillingPlanName(subscription.metadata?.plan_name);
  if (metadataPlan) return metadataPlan;

  const pricePlan = getPlanFromStripePriceId(firstPriceId(subscription));
  return pricePlan ?? "starter";
}

export async function syncStripeSubscriptionToSupabase({
  supabase,
  subscription,
  fallbackBarbershopId,
}: {
  supabase: SupabaseClient;
  subscription: StripeSubscriptionLike;
  fallbackBarbershopId?: string | null;
}) {
  const planName = resolvePlanFromStripeSubscription(subscription);
  const status = mapStripeSubscriptionStatus(subscription.status);
  const barbershopId = subscription.metadata?.barbershop_id ?? fallbackBarbershopId;

  if (!barbershopId) {
    throw new Error(`Stripe subscription ${subscription.id} has no barbershop_id metadata`);
  }

  const payload = {
    barbershop_id: barbershopId,
    plan_name: planName,
    amount_monthly: BILLING_PLANS[planName].amountMonthly,
    currency: (subscription.currency ?? "eur").toUpperCase(),
    billing_cycle: "monthly",
    status,
    started_at: fromUnix(subscription.start_date),
    trial_ends_at: fromUnix(subscription.trial_end),
    current_period_start: fromUnix(subscription.current_period_start),
    current_period_end: fromUnix(subscription.current_period_end),
    cancelled_at: status === "cancelled" ? fromUnix(subscription.canceled_at) ?? new Date().toISOString() : null,
    stripe_subscription_id: subscription.id,
    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id ?? null,
    stripe_price_id: firstPriceId(subscription),
    stripe_status: subscription.status,
    updated_at: new Date().toISOString(),
  };

  const { data: existingByStripeId, error: existingByStripeError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (existingByStripeError) throw existingByStripeError;

  if (existingByStripeId?.id) {
    const { error } = await supabase
      .from("subscriptions")
      .update(payload)
      .eq("id", existingByStripeId.id);
    if (error) throw error;
    return;
  }

  const { data: existingManualSubscription, error: existingManualError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("barbershop_id", barbershopId)
    .in("status", ["trial", "active"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingManualError) throw existingManualError;

  if (existingManualSubscription?.id) {
    const { error } = await supabase
      .from("subscriptions")
      .update(payload)
      .eq("id", existingManualSubscription.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from("subscriptions")
    .insert({ ...payload, created_at: new Date().toISOString() });

  if (error) throw error;
}
