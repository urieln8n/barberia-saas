import type { PlanName } from "@/src/lib/plans/limits";

export type BillingPlanName = PlanName;

type BillingPlan = {
  name: BillingPlanName;
  label: string;
  amountMonthly: number;
  priceEnvKey: string | null;
  checkoutEnabled: boolean;
};

export const BILLING_PLANS: Record<BillingPlanName, BillingPlan> = {
  free: {
    name: "free",
    label: "Free",
    amountMonthly: 0,
    priceEnvKey: null,
    checkoutEnabled: false,
  },
  starter: {
    name: "starter",
    label: "Starter",
    amountMonthly: 39,
    priceEnvKey: "STRIPE_PRICE_STARTER",
    checkoutEnabled: true,
  },
  pro: {
    name: "pro",
    label: "Pro",
    amountMonthly: 79,
    priceEnvKey: "STRIPE_PRICE_PRO",
    checkoutEnabled: true,
  },
  growth: {
    name: "growth",
    label: "Growth",
    amountMonthly: 149,
    priceEnvKey: "STRIPE_PRICE_GROWTH",
    checkoutEnabled: true,
  },
  premium: {
    name: "premium",
    label: "Premium",
    amountMonthly: 299,
    priceEnvKey: "STRIPE_PRICE_PREMIUM",
    checkoutEnabled: true,
  },
};

export const PAID_BILLING_PLAN_NAMES = Object.values(BILLING_PLANS)
  .filter((plan) => plan.checkoutEnabled)
  .map((plan) => plan.name);

export function normalizeBillingPlanName(value: unknown): BillingPlanName | null {
  const plan = String(value ?? "").toLowerCase();

  if (plan === "free") return "free";
  if (plan === "starter") return "starter";
  if (plan === "pro") return "pro";
  if (plan === "growth") return "growth";
  if (plan === "premium" || plan === "scale" || plan === "custom") return "premium";

  return null;
}

export function getStripePriceId(planName: BillingPlanName) {
  const plan = BILLING_PLANS[planName];
  if (!plan.priceEnvKey) return null;
  return process.env[plan.priceEnvKey] ?? null;
}

export function getPlanFromStripePriceId(priceId: string | null | undefined) {
  if (!priceId) return null;

  for (const plan of Object.values(BILLING_PLANS)) {
    if (plan.priceEnvKey && process.env[plan.priceEnvKey] === priceId) {
      return plan.name;
    }
  }

  return null;
}
