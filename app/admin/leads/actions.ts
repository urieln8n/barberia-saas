"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/leads";

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

const LEAD_STATUSES = [
  "nuevo", "contactado", "demo_agendada", "propuesta_enviada",
  "trial_activo", "ganado", "perdido",
] as const;

const LEAD_SOURCES = [
  "directo", "instagram", "referido", "google", "linkedin", "feria", "otro",
] as const;

const LeadSchema = z
  .object({
    business_name:     z.string().trim().min(1, "El nombre de la barbería es obligatorio"),
    contact_name:      z.preprocess(strOrNull, z.string().nullable()),
    phone:             z.preprocess(strOrNull, z.string().nullable()),
    email:             z.preprocess(
      strOrNull,
      z.string().email("Formato de email inválido").nullable(),
    ),
    city:              z.preprocess(strOrNull, z.string().nullable()),
    country:           z.string().trim().default("ES"),
    source:            z.enum(LEAD_SOURCES, { errorMap: () => ({ message: "Origen no válido" }) }).default("directo"),
    status:            z.enum(LEAD_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) }),
    potential_mrr:     z.preprocess(
      v => (v === "" || v == null) ? 0 : Number(v),
      z.number({ invalid_type_error: "El MRR debe ser un número" }).min(0, "El MRR potencial debe ser ≥ 0"),
    ),
    notes:             z.preprocess(strOrNull, z.string().nullable()),
    last_contacted_at: z.preprocess(strOrNull, z.string().nullable()),
    next_action_at:    z.preprocess(strOrNull, z.string().nullable()),
  })
  .refine(
    d => d.contact_name || d.phone || d.email,
    { message: "Proporciona al menos un contacto: nombre, teléfono o email" },
  );

function fromFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createLead(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsed = LeadSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("crm_leads").insert(parsed.data);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al crear el lead" };
  }
}

export async function updateLead(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const id = (formData.get("id") as string)?.trim();
    if (!id) return { success: false, error: "ID de lead no válido" };

    const parsed = LeadSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("crm_leads")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al actualizar el lead" };
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    if (!id?.trim()) return { success: false, error: "ID no válido" };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("crm_leads").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar el lead" };
  }
}
