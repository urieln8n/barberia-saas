"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requireSuperAdmin } from "@/src/lib/permissions/admin";

const PATH = "/admin/deals";

export async function createDeal(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();

  const lead_id = (formData.get("lead_id") as string)?.trim() || null;

  await supabase.from("crm_deals").insert({
    lead_id,
    title:               (formData.get("title") as string).trim(),
    value:               parseFloat(formData.get("value") as string) || 0,
    stage:               (formData.get("stage") as string) || "prospecting",
    probability:         parseInt(formData.get("probability") as string) || 0,
    expected_close_date: (formData.get("expected_close_date") as string) || null,
    status:              (formData.get("status") as string) || "open",
    notes:               (formData.get("notes") as string)?.trim() || null,
  });

  revalidatePath(PATH);
}

export async function updateDeal(formData: FormData) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();
  const id = formData.get("id") as string;
  const lead_id = (formData.get("lead_id") as string)?.trim() || null;

  await supabase.from("crm_deals").update({
    lead_id,
    title:               (formData.get("title") as string).trim(),
    value:               parseFloat(formData.get("value") as string) || 0,
    stage:               (formData.get("stage") as string) || "prospecting",
    probability:         parseInt(formData.get("probability") as string) || 0,
    expected_close_date: (formData.get("expected_close_date") as string) || null,
    status:              (formData.get("status") as string) || "open",
    notes:               (formData.get("notes") as string)?.trim() || null,
    updated_at:          new Date().toISOString(),
  }).eq("id", id);

  revalidatePath(PATH);
}

export async function deleteDeal(id: string) {
  await requireSuperAdmin();
  const supabase = createServiceRoleClient();
  await supabase.from("crm_deals").delete().eq("id", id);
  revalidatePath(PATH);
}
