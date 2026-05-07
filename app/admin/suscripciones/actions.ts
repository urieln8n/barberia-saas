"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/suscripciones";

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

const PLAN_NAMES    = ["starter", "growth", "premium", "custom"] as const;
const SUB_STATUSES  = ["trial", "active", "paused", "cancelled"] as const;
const BILLING_CYCLES = ["monthly", "annual"] as const;

const SubscriptionSchema = z.object({
  barbershop_id:        z.string().uuid("ID de barbería no válido"),
  plan_name:            z.enum(PLAN_NAMES, { errorMap: () => ({ message: "Plan no válido" }) }),
  amount_monthly:       z.preprocess(
    v => (v === "" || v == null) ? 0 : Number(v),
    z.number({ invalid_type_error: "El importe debe ser un número" }).min(0, "El importe debe ser ≥ 0"),
  ),
  currency:             z.string().trim().min(1, "La moneda es obligatoria").default("EUR"),
  billing_cycle:        z.enum(BILLING_CYCLES, { errorMap: () => ({ message: "Ciclo de facturación no válido" }) }).default("monthly"),
  status:               z.enum(SUB_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) }).default("trial"),
  started_at:           z.preprocess(strOrNull, z.string().nullable()),
  trial_ends_at:        z.preprocess(strOrNull, z.string().nullable()),
  current_period_start: z.preprocess(strOrNull, z.string().nullable()),
  current_period_end:   z.preprocess(strOrNull, z.string().nullable()),
  notes:                z.preprocess(strOrNull, z.string().nullable()),
});

const StatusSchema = z.enum(SUB_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) });

function fromFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createSubscription(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsed = SubscriptionSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("subscriptions").insert(parsed.data);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al crear la suscripción" };
  }
}

export async function updateSubscription(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const id = (formData.get("id") as string)?.trim();
    if (!id) return { success: false, error: "ID de suscripción no válido" };

    const parsed = SubscriptionSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const cancelled_at = parsed.data.status === "cancelled" ? new Date().toISOString() : null;

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("subscriptions")
      .update({ ...parsed.data, cancelled_at, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al actualizar la suscripción" };
  }
}

export async function updateSubscriptionStatus(id: string, status: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    if (!id?.trim()) return { success: false, error: "ID no válido" };

    const parsed = StatusSchema.safeParse(status);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const cancelled_at = parsed.data === "cancelled" ? new Date().toISOString() : null;

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: parsed.data, cancelled_at, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Error al actualizar el estado" };
  }
}

export async function deleteSubscription(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    if (!id?.trim()) return { success: false, error: "ID no válido" };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("subscriptions").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar la suscripción" };
  }
}
