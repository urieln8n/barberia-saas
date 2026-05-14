import type { SupabaseClient } from "@supabase/supabase-js";

export type PlanName = "free" | "starter" | "pro" | "growth" | "premium";

export type PlanLimits = {
  label: string;
  maxBarbers: number | null;
  maxServices: number | null;
  maxTrialBookings: number | null;
  modules: {
    payments: boolean;
    finances: boolean;
    reviews: boolean;
    whatsapp: boolean;
    recovery: boolean;
    automations: boolean;
  };
};

export type PlanUsage = {
  plan: PlanName;
  label: string;
  limits: PlanLimits;
  barbersCount: number;
  servicesCount: number;
  trialBookingsCount: number;
  trialEndsAt: string | null;
  isTrialExpired: boolean;
};

const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  free: {
    label: "Free",
    maxBarbers: 1,
    maxServices: 5,
    maxTrialBookings: 9999,
    modules: {
      payments: true,
      finances: false,
      reviews: false,
      whatsapp: false,
      recovery: false,
      automations: false,
    },
  },
  starter: {
    label: "Starter",
    maxBarbers: 2,
    maxServices: null,
    maxTrialBookings: null,
    modules: {
      payments: true,
      finances: false,
      reviews: false,
      whatsapp: false,
      recovery: false,
      automations: false,
    },
  },
  pro: {
    label: "Pro",
    maxBarbers: 6,
    maxServices: null,
    maxTrialBookings: null,
    modules: {
      payments: true,
      finances: true,
      reviews: true,
      whatsapp: false,
      recovery: false,
      automations: false,
    },
  },
  growth: {
    label: "Growth",
    maxBarbers: 12,
    maxServices: null,
    maxTrialBookings: null,
    modules: {
      payments: true,
      finances: true,
      reviews: true,
      whatsapp: true,
      recovery: true,
      automations: true,
    },
  },
  premium: {
    label: "Premium",
    maxBarbers: null,
    maxServices: null,
    maxTrialBookings: null,
    modules: {
      payments: true,
      finances: true,
      reviews: true,
      whatsapp: true,
      recovery: true,
      automations: true,
    },
  },
};

function normalizePlanName(value: unknown): PlanName {
  const plan = String(value ?? "").toLowerCase();

  if (plan === "free") return "free";
  if (plan === "starter") return "starter";
  if (plan === "pro") return "pro";
  if (plan === "growth") return "growth";
  if (plan === "premium" || plan === "scale" || plan === "custom") return "premium";

  return "starter";
}

function isPast(date: string | null | undefined) {
  if (!date) return false;
  return new Date(date).getTime() < Date.now();
}

export function getPlanLimits(plan: PlanName) {
  return PLAN_LIMITS[plan];
}

export function canAccessGrowth(plan: PlanName) {
  return plan === "pro" || plan === "growth" || plan === "premium";
}

export function canAccessGrowthAds(plan: PlanName) {
  return plan === "premium";
}

export function canAccessWhatsappIA(plan: PlanName) {
  return plan === "growth" || plan === "premium";
}

export function formatLimit(limit: number | null) {
  return limit === null ? "Ilimitado" : String(limit);
}

export async function getBarbershopPlanUsage(
  supabase: SupabaseClient,
  barbershopId: string
): Promise<PlanUsage> {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_name, status, trial_ends_at")
    .eq("barbershop_id", barbershopId)
    .in("status", ["trial", "active"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const plan = subscription ? normalizePlanName(subscription.plan_name) : "free";
  const trialEndsAt = subscription?.trial_ends_at ?? null;
  const isTrialExpired = subscription?.status === "trial" && isPast(trialEndsAt);

  const [barbersResult, servicesResult, bookingsResult] = await Promise.all([
    supabase
      .from("barbers")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId),
    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId),
  ]);

  const limits = getPlanLimits(plan);

  return {
    plan,
    label: limits.label,
    limits,
    barbersCount: barbersResult.count ?? 0,
    servicesCount: servicesResult.count ?? 0,
    trialBookingsCount: bookingsResult.count ?? 0,
    trialEndsAt,
    isTrialExpired,
  };
}

export function assertCanCreateBarber(usage: PlanUsage) {
  const limit = usage.limits.maxBarbers;
  if (limit !== null && usage.barbersCount >= limit) {
    return `Tu plan ${usage.label} permite hasta ${limit} barbero${limit === 1 ? "" : "s"}. Sube de plan para añadir más equipo.`;
  }
  return null;
}

export function assertCanCreateService(usage: PlanUsage) {
  const limit = usage.limits.maxServices;
  if (limit !== null && usage.servicesCount >= limit) {
    return `Tu plan ${usage.label} permite hasta ${limit} servicios. Sube de plan para añadir más servicios.`;
  }
  return null;
}

export function assertCanCreateBooking(usage: PlanUsage) {
  if (usage.isTrialExpired) {
    return "Tu prueba ha terminado. Activa un plan para seguir recibiendo reservas.";
  }

  const limit = usage.limits.maxTrialBookings;
  if (limit !== null && usage.trialBookingsCount >= limit) {
    return `Tu plan ${usage.label} permite hasta ${limit} reservas durante la prueba. Activa Starter para reservas ilimitadas.`;
  }

  return null;
}
