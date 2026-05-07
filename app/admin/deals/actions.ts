"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/deals";

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
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
  expected_close_date: z.preprocess(strOrNull, z.string().nullable()),
  status:              z.enum(DEAL_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) }).default("open"),
  notes:               z.preprocess(strOrNull, z.string().nullable()),
});

function fromFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createDeal(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsed = DealSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("crm_deals").insert(parsed.data);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al crear el deal" };
  }
}

export async function updateDeal(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const id = (formData.get("id") as string)?.trim();
    if (!id) return { success: false, error: "ID de deal no válido" };

    const parsed = DealSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("crm_deals")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al actualizar el deal" };
  }
}

export async function deleteDeal(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    if (!id?.trim()) return { success: false, error: "ID no válido" };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("crm_deals").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar el deal" };
  }
}
