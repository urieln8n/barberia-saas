"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

async function getBarbershopId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  return { supabase, barbershopId };
}

export async function createService(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return;

  await supabase.from("services").insert({
    barbershop_id:    barbershopId,
    name:             (formData.get("name") as string).trim(),
    price:            parseFloat(formData.get("price") as string),
    duration_minutes: parseInt(formData.get("duration_minutes") as string),
    description:      (formData.get("description") as string)?.trim() || null,
    active:           true,
  });

  revalidatePath("/dashboard/servicios");
}

export async function updateService(formData: FormData) {
  const { supabase } = await getBarbershopId();
  const id = formData.get("id") as string;

  await supabase.from("services").update({
    name:             (formData.get("name") as string).trim(),
    price:            parseFloat(formData.get("price") as string),
    duration_minutes: parseInt(formData.get("duration_minutes") as string),
    description:      (formData.get("description") as string)?.trim() || null,
  }).eq("id", id);

  revalidatePath("/dashboard/servicios");
}

export async function deleteService(id: string) {
  const { supabase } = await getBarbershopId();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/dashboard/servicios");
}
