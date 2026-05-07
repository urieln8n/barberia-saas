"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/leads";

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
  if (error.code === "PGRST116") return "No se encontró el lead";
  if (error.code === "23503") return "El registro relacionado no existe";
  if (error.code === "23505") return "Ya existe un lead con esos datos";
  if (error.code === "23514") return "Algún valor del lead no cumple las reglas permitidas";
  return error.message || fallback;
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
    last_contacted_at: z.preprocess(dateTimeOrNull, z.string().datetime("Fecha de último contacto no válida").nullable()),
    next_action_at:    z.preprocess(dateTimeOrNull, z.string().datetime("Fecha de próxima acción no válida").nullable()),
  })
  .refine(
    d => d.contact_name || d.phone || d.email,
    { message: "Proporciona al menos un contacto: nombre, teléfono o email" },
  );

const LeadIdSchema = z.string().trim().uuid("ID de lead no válido");

function fromFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createLead(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsed = LeadSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const supabase = await createClient();
    const { error } = await supabase.from("crm_leads").insert(parsed.data).select("id").single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo crear el lead") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al crear el lead" };
  }
}

export async function updateLead(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const id = LeadIdSchema.safeParse(formData.get("id"));
    if (!id.success) return { success: false, error: firstError(id.error) };

    const parsed = LeadSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const supabase = await createClient();
    const { error } = await supabase
      .from("crm_leads")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo actualizar el lead") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al actualizar el lead" };
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsedId = LeadIdSchema.safeParse(id);
    if (!parsedId.success) return { success: false, error: firstError(parsedId.error) };

    const supabase = await createClient();
    const { error } = await supabase
      .from("crm_leads")
      .delete()
      .eq("id", parsedId.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo eliminar el lead") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar el lead" };
  }
}
