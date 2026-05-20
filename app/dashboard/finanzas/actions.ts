"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

export async function createExpense(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) return { error: "Barbería no encontrada" };

  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const description = (formData.get("description") as string) || null;
  const expense_date = formData.get("expense_date") as string;

  if (!amount || amount <= 0) return { error: "Importe inválido" };
  if (!category) return { error: "Categoría requerida" };
  if (!expense_date) return { error: "Fecha requerida" };

  const { error } = await supabase.from("expenses").insert({
    barbershop_id: barbershopId,
    amount,
    category: category as "alquiler" | "productos" | "herramientas" | "marketing" | "nomina" | "otros",
    description,
    expense_date,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/finanzas");
  return { success: true };
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/dashboard/finanzas");
  return { success: true };
}
