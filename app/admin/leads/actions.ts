"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { requirePlatformAdmin } from "@/src/lib/permissions/admin";

const PATH = "/admin/leads";

export async function createLead(formData: FormData) {
  await requirePlatformAdmin();
  const supabase = createServiceRoleClient();

  await supabase.from("crm_leads").insert({
    business_name:     (formData.get("business_name") as string).trim(),
    contact_name:      (formData.get("contact_name")  as string)?.trim() || null,
    phone:             (formData.get("phone")          as string)?.trim() || null,
    email:             (formData.get("email")          as string)?.trim() || null,
    city:              (formData.get("city")           as string)?.trim() || null,
    country:           (formData.get("country")        as string)?.trim() || "ES",
    source:            (formData.get("source")         as string) || "directo",
    status:            (formData.get("status")         as string) || "nuevo",
    potential_mrr:     parseFloat(formData.get("potential_mrr") as string) || 0,
    notes:             (formData.get("notes")          as string)?.trim() || null,
    last_contacted_at: (formData.get("last_contacted_at") as string) || null,
    next_action_at:    (formData.get("next_action_at")    as string) || null,
  });

  revalidatePath(PATH);
}

export async function updateLead(formData: FormData) {
  await requirePlatformAdmin();
  const supabase = createServiceRoleClient();
  const id = formData.get("id") as string;

  await supabase.from("crm_leads").update({
    business_name:     (formData.get("business_name") as string).trim(),
    contact_name:      (formData.get("contact_name")  as string)?.trim() || null,
    phone:             (formData.get("phone")          as string)?.trim() || null,
    email:             (formData.get("email")          as string)?.trim() || null,
    city:              (formData.get("city")           as string)?.trim() || null,
    country:           (formData.get("country")        as string)?.trim() || "ES",
    source:            (formData.get("source")         as string) || "directo",
    status:            (formData.get("status")         as string) || "nuevo",
    potential_mrr:     parseFloat(formData.get("potential_mrr") as string) || 0,
    notes:             (formData.get("notes")          as string)?.trim() || null,
    last_contacted_at: (formData.get("last_contacted_at") as string) || null,
    next_action_at:    (formData.get("next_action_at")    as string) || null,
    updated_at:        new Date().toISOString(),
  }).eq("id", id);

  revalidatePath(PATH);
}

export async function deleteLead(id: string) {
  await requirePlatformAdmin();
  const supabase = createServiceRoleClient();
  await supabase.from("crm_leads").delete().eq("id", id);
  revalidatePath(PATH);
}
