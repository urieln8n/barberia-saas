"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/suscripciones";

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function dateTimeOrNull(v: unknown): string | null {
  const value = strOrNull(v);
  if (!value) return null;
  return Number.isNaN(Date.parse(value)) ? value : new Date(value).toISOString();
}

function firstError(error: z.ZodError): string {
  return error.errors[0]?.message ?? "Datos no válidos";
}

function dbErrorMessage(error: { code?: string; message: string }, fallback: string): string {
  if (error.code === "PGRST116") return "No se encontró la suscripción";
  if (error.code === "23503") return "La barbería seleccionada no existe";
  if (error.code === "23505") return "Ya existe una suscripción activa o trial para esta barbería";
  if (error.code === "23514") return "Algún valor de la suscripción no cumple las reglas permitidas";
  return error.message || fallback;
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
  started_at:           z.preprocess(dateTimeOrNull, z.string().datetime("Fecha de inicio no válida").nullable()),
  trial_ends_at:        z.preprocess(dateTimeOrNull, z.string().datetime("Fecha fin de trial no válida").nullable()),
  current_period_start: z.preprocess(dateTimeOrNull, z.string().datetime("Inicio de periodo no válido").nullable()),
  current_period_end:   z.preprocess(dateTimeOrNull, z.string().datetime("Fin de periodo no válido").nullable()),
  notes:                z.preprocess(strOrNull, z.string().nullable()),
});

const StatusSchema = z.enum(SUB_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) });
const SubscriptionIdSchema = z.string().trim().uuid("ID de suscripción no válido");

function fromFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createSubscription(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsed = SubscriptionSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const supabase = await createClient();
    const { error } = await supabase.from("subscriptions").insert(parsed.data).select("id").single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo crear la suscripción") };

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
    const id = SubscriptionIdSchema.safeParse(formData.get("id"));
    if (!id.success) return { success: false, error: firstError(id.error) };

    const parsed = SubscriptionSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const cancelled_at = parsed.data.status === "cancelled" ? new Date().toISOString() : null;

    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .update({ ...parsed.data, cancelled_at, updated_at: new Date().toISOString() })
      .eq("id", id.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo actualizar la suscripción") };

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
    const parsedId = SubscriptionIdSchema.safeParse(id);
    if (!parsedId.success) return { success: false, error: firstError(parsedId.error) };

    const parsed = StatusSchema.safeParse(status);
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const cancelled_at = parsed.data === "cancelled" ? new Date().toISOString() : null;

    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: parsed.data, cancelled_at, updated_at: new Date().toISOString() })
      .eq("id", parsedId.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo actualizar el estado") };

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
    const parsedId = SubscriptionIdSchema.safeParse(id);
    if (!parsedId.success) return { success: false, error: firstError(parsedId.error) };

    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", parsedId.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo eliminar la suscripción") };

    revalidatePath(PATH);
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar la suscripción" };
  }
}
