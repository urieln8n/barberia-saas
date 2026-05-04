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

export async function createBarber(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return;

  await supabase.from("barbers").insert({
    barbershop_id: barbershopId,
    name:  (formData.get("name") as string).trim(),
    phone: (formData.get("phone") as string)?.trim() || null,
  });

  revalidatePath("/dashboard/barberos");
}

export async function updateBarber(formData: FormData) {
  const { supabase } = await getBarbershopId();
  const id = formData.get("id") as string;

  await supabase.from("barbers").update({
    name:  (formData.get("name") as string).trim(),
    phone: (formData.get("phone") as string)?.trim() || null,
  }).eq("id", id);

  revalidatePath("/dashboard/barberos");
}

export async function toggleBarber(id: string, active: boolean) {
  const { supabase } = await getBarbershopId();
  await supabase.from("barbers").update({ active }).eq("id", id);
  revalidatePath("/dashboard/barberos");
}

export async function deleteBarber(id: string) {
  const { supabase } = await getBarbershopId();
  await supabase.from("barbers").delete().eq("id", id);
  revalidatePath("/dashboard/barberos");
}
