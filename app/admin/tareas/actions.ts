"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/tareas";

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
  if (error.code === "PGRST116") return "No se encontró la tarea";
  if (error.code === "23503") return "El registro relacionado no existe";
  if (error.code === "23505") return "Ya existe una tarea con esos datos";
  if (error.code === "23514") return "Algún valor de la tarea no cumple las reglas permitidas";
  return error.message || fallback;
}

const TASK_PRIORITIES = ["baja", "media", "alta", "urgente"] as const;
const TASK_STATUSES   = ["pendiente", "en_progreso", "completada", "cancelada"] as const;
const RELATED_TYPES   = ["lead", "deal"] as const;

const TaskSchema = z
  .object({
    title:        z.string().trim().min(1, "El título de la tarea es obligatorio"),
    description:  z.preprocess(strOrNull, z.string().nullable()),
    due_date:     z.preprocess(dateTimeOrNull, z.string().datetime("Fecha límite no válida").nullable()),
    priority:     z.enum(TASK_PRIORITIES, { errorMap: () => ({ message: "Prioridad no válida" }) }).default("media"),
    status:       z.enum(TASK_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) }).default("pendiente"),
    related_type: z.preprocess(strOrNull, z.enum(RELATED_TYPES).nullable()),
    related_id:   z.preprocess(strOrNull, z.string().uuid("ID relacionado inválido").nullable()),
  })
  .refine(
    d => (d.related_type && d.related_id) || (!d.related_type && !d.related_id),
    { message: "Selecciona tipo e ID relacionado, o deja ambos vacíos" },
  );

const StatusSchema = z.enum(TASK_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) });
const TaskIdSchema = z.string().trim().uuid("ID de tarea no válido");

function fromFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsed = TaskSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const supabase = await createClient();
    const { error } = await supabase.from("crm_tasks").insert(parsed.data).select("id").single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo crear la tarea") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al crear la tarea" };
  }
}

export async function updateTask(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const id = TaskIdSchema.safeParse(formData.get("id"));
    if (!id.success) return { success: false, error: firstError(id.error) };

    const parsed = TaskSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: firstError(parsed.error) };

    const supabase = await createClient();
    const { error } = await supabase
      .from("crm_tasks")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo actualizar la tarea") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al actualizar la tarea" };
  }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsedId = TaskIdSchema.safeParse(id);
    if (!parsedId.success) return { success: false, error: firstError(parsedId.error) };

    const supabase = await createClient();
    const { error } = await supabase
      .from("crm_tasks")
      .delete()
      .eq("id", parsedId.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo eliminar la tarea") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar la tarea" };
  }
}

export async function toggleTaskStatus(id: string, currentStatus: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsedId = TaskIdSchema.safeParse(id);
    if (!parsedId.success) return { success: false, error: firstError(parsedId.error) };

    const newStatusRaw = currentStatus === "completada" ? "pendiente" : "completada";
    const parsed = StatusSchema.safeParse(newStatusRaw);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = await createClient();
    const { error } = await supabase
      .from("crm_tasks")
      .update({ status: parsed.data, updated_at: new Date().toISOString() })
      .eq("id", parsedId.data)
      .select("id")
      .single();
    if (error) return { success: false, error: dbErrorMessage(error, "No se pudo cambiar el estado de la tarea") };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error al cambiar el estado de la tarea" };
  }
}
