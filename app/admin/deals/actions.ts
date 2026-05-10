"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/deals";

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function dateOrNull(v: unknown): string | null {
  const value = strOrNull(v);
  if (!value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "__invalid_date__";
}

function firstError(error: z.ZodError): string {
  return error.errors[0]?.message ?? "Datos no válidos";
}

function dbErrorMessage(error: { code?: string; message: string }, fallback: string): string {
  if (error.code === "PGRST116") return "No se encontró el deal";
  if (error.code === "23503") return "El lead relacionado no existe";
  if (error.code === "23505") return "Ya existe un deal con esos datos";
  if (error.code === "23514") return "Algún valor del deal no cumple las reglas permitidas";
  return error.message || fallback;
}

const DEAL_STAGES = [
  "prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost",
] as const;

const DEAL_STATUSES = ["open", "won", "lost"] as const;

const DealSchema = z.object({
  title:               z.string().trim().min(1, "El título del deal es obligatorio"),
  lead_id:             z.preprocess(
    strOrNull,
    z.string().uuid("ID de lead inválido").nullable(),
  ),
  value:               z.preprocess(
    v => (v === "" || v == null) ? 0 : Number(v),
    z.number({ invalid_type_error: "El valor debe ser un número" }).min(0, "El valor debe ser ≥ 0"),
  ),
  stage:               z.enum(DEAL_STAGES, { errorMap: () => ({ message: "Etapa no válida" }) }),
  probability:         z.preprocess(
    v => (v === "" || v == null) ? 0 : Number(v),
    z.number({ invalid_type_error: "La probabilidad debe ser un número" })
      .min(0, "La probabilidad debe estar entre 0 y 100")
      .max(100, "La probabilidad debe estar entre 0 y 100"),
  ),
  expected_close_date: z.preprocess(dateOrNull, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha de cierre no válida").nullable()),
  status:              z.enum(DEAL_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) }).default("open"),
  notes:               z.preprocess(strOrNull, z.string().nullable()),
});

const DealIdSchema = z.string().trim().uuid("ID de deal no válido");

function fromFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createDeal(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsed = DealSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const supabase = await createClient();
    const { error } = await supabase.from("crm_deals").insert(parsed.data).select("id").single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo crear el deal") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al crear el deal" };
  }
}

export async function updateDeal(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const id = DealIdSchema.safeParse(formData.get("id"));
    if (!id.success) return { success: false, error: firstError(id.error) };

    const parsed = DealSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const supabase = await createClient();
    const { error } = await supabase
      .from("crm_deals")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo actualizar el deal") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al actualizar el deal" };
  }
}

export async function deleteDeal(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsedId = DealIdSchema.safeParse(id);
    if (!parsedId.success) return { success: false, error: firstError(parsedId.error) };

    const supabase = await createClient();
    const { error } = await supabase
      .from("crm_deals")
      .delete()
      .eq("id", parsedId.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo eliminar el deal") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar el deal" };
  }
}
