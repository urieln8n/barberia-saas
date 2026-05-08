"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { assertCanCreateBarber, getBarbershopPlanUsage } from "@/src/lib/plans/limits";

async function getBarbershopId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  return { supabase, barbershopId };
}

export async function createBarber(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const usage = await getBarbershopPlanUsage(supabase, barbershopId);
  const limitError = assertCanCreateBarber(usage);
  if (limitError) return { error: limitError };

  const { error } = await supabase.from("barbers").insert({
    barbershop_id: barbershopId,
    name:  (formData.get("name") as string).trim(),
    phone: (formData.get("phone") as string)?.trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}

export async function updateBarber(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };
  const id = formData.get("id") as string;

  const { error } = await supabase.from("barbers").update({
    name:  (formData.get("name") as string).trim(),
    phone: (formData.get("phone") as string)?.trim() || null,
  }).eq("id", id).eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}

export async function toggleBarber(id: string, active: boolean) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const { error } = await supabase
    .from("barbers")
    .update({ active })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}

export async function deleteBarber(id: string) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const { error } = await supabase
    .from("barbers")
    .delete()
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/barberos");
  return { success: true };
}
