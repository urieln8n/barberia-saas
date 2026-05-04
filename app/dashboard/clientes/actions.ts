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

export async function createClient_(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return;

  await supabase.from("clients").insert({
    barbershop_id: barbershopId,
    name:  (formData.get("name") as string).trim(),
    phone: (formData.get("phone") as string)?.trim() || null,
    email: (formData.get("email") as string)?.trim() || null,
    notes: (formData.get("notes") as string)?.trim() || null,
  });

  revalidatePath("/dashboard/clientes");
}

export async function updateClient_(formData: FormData) {
  const { supabase } = await getBarbershopId();
  const id = formData.get("id") as string;

  await supabase.from("clients").update({
    name:  (formData.get("name") as string).trim(),
    phone: (formData.get("phone") as string)?.trim() || null,
    email: (formData.get("email") as string)?.trim() || null,
    notes: (formData.get("notes") as string)?.trim() || null,
  }).eq("id", id);

  revalidatePath("/dashboard/clientes");
}

export async function deleteClient_(id: string) {
  const { supabase } = await getBarbershopId();
  await supabase.from("clients").delete().eq("id", id);
  revalidatePath("/dashboard/clientes");
}
