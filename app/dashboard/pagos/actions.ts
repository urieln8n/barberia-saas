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

export async function createPayment(formData: FormData) {
  const { supabase, barbershopId } = await getBarbershopId();
  if (!barbershopId) return { error: "Sin barbería" };

  const amount     = parseFloat(formData.get("amount") as string);
  const method     = formData.get("method") as string;
  const notes      = (formData.get("notes") as string)?.trim() || null;
  const client_id  = (formData.get("client_id") as string) || null;

  if (isNaN(amount) || amount <= 0) return { error: "Importe inválido" };

  const { error } = await supabase.from("payments").insert({
    barbershop_id: barbershopId,
    amount,
    method,
    notes,
    client_id,
    status: "paid",
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/pagos");
  return { error: null };
}

export async function deletePayment(id: string) {
  const { supabase } = await getBarbershopId();
  await supabase.from("payments").delete().eq("id", id);
  revalidatePath("/dashboard/pagos");
}
