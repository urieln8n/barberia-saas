"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

export type ActionResult = { success: true } | { success: false; error: string };

const PATH = "/admin/tareas";

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

const TASK_PRIORITIES = ["baja", "media", "alta", "urgente"] as const;
const TASK_STATUSES   = ["pendiente", "en_progreso", "completada", "cancelada"] as const;
const RELATED_TYPES   = ["lead", "deal"] as const;

const TaskSchema = z.object({
  title:        z.string().trim().min(1, "El título de la tarea es obligatorio"),
  description:  z.preprocess(strOrNull, z.string().nullable()),
  due_date:     z.preprocess(strOrNull, z.string().nullable()),
  priority:     z.enum(TASK_PRIORITIES, { errorMap: () => ({ message: "Prioridad no válida" }) }).default("media"),
  status:       z.enum(TASK_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) }).default("pendiente"),
  related_type: z.preprocess(strOrNull, z.enum(RELATED_TYPES).nullable()),
  related_id:   z.preprocess(strOrNull, z.string().uuid("ID relacionado inválido").nullable()),
});

const StatusSchema = z.enum(TASK_STATUSES, { errorMap: () => ({ message: "Estado no válido" }) });

function fromFormData(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const parsed = TaskSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("crm_tasks").insert(parsed.data);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al crear la tarea" };
  }
}

export async function updateTask(formData: FormData): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    const id = (formData.get("id") as string)?.trim();
    if (!id) return { success: false, error: "ID de tarea no válido" };

    const parsed = TaskSchema.safeParse(fromFormData(formData));
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("crm_tasks")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error inesperado al actualizar la tarea" };
  }
}

export async function deleteTask(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    if (!id?.trim()) return { success: false, error: "ID no válido" };

    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("crm_tasks").delete().eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar la tarea" };
  }
}

export async function toggleTaskStatus(id: string, currentStatus: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  try {
    if (!id?.trim()) return { success: false, error: "ID no válido" };

    const newStatusRaw = currentStatus === "completada" ? "pendiente" : "completada";
    const parsed = StatusSchema.safeParse(newStatusRaw);
    if (!parsed.success) return { success: false, error: parsed.error.errors[0].message };

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("crm_tasks")
      .update({ status: parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: error.message };

    revalidatePath(PATH);
    return { success: true };
  } catch {
    return { success: false, error: "Error al cambiar el estado de la tarea" };
  }
}
