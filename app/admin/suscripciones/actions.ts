"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requireSuperAdmin } from "@/src/lib/permissions/admin";

const PATH = "/admin/suscripciones";

export async function createSubscription(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();

  const status    = formData.get("status") as string;
  const startedAt = formData.get("started_at") as string;
  const trialEnds = formData.get("trial_ends_at") as string;
  const periodStart = formData.get("current_period_start") as string;
  const periodEnd   = formData.get("current_period_end")   as string;

  await supabase.from("subscriptions").insert({
    barbershop_id:        formData.get("barbershop_id") as string,
    plan_name:            formData.get("plan_name")     as string || "starter",
    amount_monthly:       parseFloat(formData.get("amount_monthly") as string) || 0,
    currency:             (formData.get("currency") as string)?.trim() || "EUR",
    billing_cycle:        formData.get("billing_cycle") as string || "monthly",
    status,
    started_at:           startedAt   || null,
    trial_ends_at:        trialEnds   || null,
    current_period_start: periodStart || null,
    current_period_end:   periodEnd   || null,
    notes:                (formData.get("notes") as string)?.trim() || null,
  });

  revalidatePath(PATH);
  revalidatePath("/admin");
}

export async function updateSubscription(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();
  const id = formData.get("id") as string;

  const status    = formData.get("status") as string;
  const startedAt = formData.get("started_at") as string;
  const trialEnds = formData.get("trial_ends_at") as string;
  const periodStart = formData.get("current_period_start") as string;
  const periodEnd   = formData.get("current_period_end")   as string;

  const cancelled_at = status === "cancelled"
    ? new Date().toISOString()
    : null;

  await supabase.from("subscriptions").update({
    plan_name:            formData.get("plan_name")    as string || "starter",
    amount_monthly:       parseFloat(formData.get("amount_monthly") as string) || 0,
    currency:             (formData.get("currency") as string)?.trim() || "EUR",
    billing_cycle:        formData.get("billing_cycle") as string || "monthly",
    status,
    started_at:           startedAt   || null,
    trial_ends_at:        trialEnds   || null,
    current_period_start: periodStart || null,
    current_period_end:   periodEnd   || null,
    cancelled_at,
    notes:                (formData.get("notes") as string)?.trim() || null,
    updated_at:           new Date().toISOString(),
  }).eq("id", id);

  revalidatePath(PATH);
  revalidatePath("/admin");
}

export async function updateSubscriptionStatus(id: string, status: string) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();

  const cancelled_at = status === "cancelled" ? new Date().toISOString() : null;

  await supabase.from("subscriptions").update({
    status,
    cancelled_at,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  revalidatePath(PATH);
  revalidatePath("/admin");
}

export async function deleteSubscription(id: string) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();
  await supabase.from("subscriptions").delete().eq("id", id);
  revalidatePath(PATH);
  revalidatePath("/admin");
}
