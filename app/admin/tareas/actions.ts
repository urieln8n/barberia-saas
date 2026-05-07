"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requireSuperAdmin } from "@/src/lib/permissions/admin";

const PATH = "/admin/tareas";

export async function createTask(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();

  const related_type = (formData.get("related_type") as string)?.trim() || null;
  const related_id   = (formData.get("related_id")   as string)?.trim() || null;

  await supabase.from("crm_tasks").insert({
    title:        (formData.get("title") as string).trim(),
    description:  (formData.get("description") as string)?.trim() || null,
    due_date:     (formData.get("due_date") as string) || null,
    priority:     (formData.get("priority") as string) || "media",
    status:       "pendiente",
    related_type: related_type || null,
    related_id:   related_id   || null,
  });

  revalidatePath(PATH);
}

export async function updateTask(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();
  const id = formData.get("id") as string;

  const related_type = (formData.get("related_type") as string)?.trim() || null;
  const related_id   = (formData.get("related_id")   as string)?.trim() || null;

  await supabase.from("crm_tasks").update({
    title:        (formData.get("title") as string).trim(),
    description:  (formData.get("description") as string)?.trim() || null,
    due_date:     (formData.get("due_date") as string) || null,
    priority:     (formData.get("priority") as string) || "media",
    status:       (formData.get("status") as string) || "pendiente",
    related_type: related_type || null,
    related_id:   related_id   || null,
    updated_at:   new Date().toISOString(),
  }).eq("id", id);

  revalidatePath(PATH);
}

export async function deleteTask(id: string) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();
  await supabase.from("crm_tasks").delete().eq("id", id);
  revalidatePath(PATH);
}

export async function toggleTaskStatus(id: string, currentStatus: string) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();
  const newStatus = currentStatus === "completada" ? "pendiente" : "completada";
  await supabase.from("crm_tasks").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath(PATH);
}
