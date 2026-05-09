"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

const PAYMENT_METHODS = ["cash", "card", "bizum", "transfer", "other"] as const;

type CashMovementRow = {
  amount: number | string | null;
  discount_amount: number | string | null;
  tip_amount: number | string | null;
  payment_method: string | null;
  movement_type: string | null;
};

function parseAmount(value: FormDataEntryValue | null, fallback = 0) {
  if (typeof value !== "string" || value.trim() === "") return fallback;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : Number.NaN;
}

function movementTotal(movement: CashMovementRow) {
  const amount = Number(movement.amount ?? 0);
  const discount = Number(movement.discount_amount ?? 0);
  const tip = Number(movement.tip_amount ?? 0);
  const total = amount - discount + tip;

  if (movement.movement_type === "refund" || movement.movement_type === "expense") {
    return -total;
  }

  return total;
}

async function getContext() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  return { supabase, userId: user.id, barbershopId };
}

export async function openCashSession(formData: FormData) {
  const { supabase, userId, barbershopId } = await getContext();
  const openingAmount = parseAmount(formData.get("opening_amount"));

  if (!Number.isFinite(openingAmount) || openingAmount < 0) {
    return { error: "Importe inicial inválido." };
  }

  const { error } = await supabase.from("cash_sessions").insert({
    barbershop_id: barbershopId,
    opened_by: userId,
    opening_amount: openingAmount,
    status: "open",
  });

  if (error) {
    if (error.message.toLowerCase().includes("unique")) {
      return { error: "Ya hay una caja abierta para esta barbería." };
    }

    return { error: error.message };
  }

  revalidatePath("/dashboard/caja");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function createCashMovement(formData: FormData) {
  const { supabase, barbershopId } = await getContext();

  const cashSessionId = String(formData.get("cash_session_id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim() || null;
  const barberId = String(formData.get("barber_id") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "").trim() || null;
  const amount = parseAmount(formData.get("amount"));
  const discountAmount = parseAmount(formData.get("discount_amount"));
  const tipAmount = parseAmount(formData.get("tip_amount"));
  const paymentMethod = String(formData.get("payment_method") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!cashSessionId) return { error: "No hay una caja abierta válida." };
  if (!barberId) return { error: "Selecciona un barbero." };
  if (!Number.isFinite(amount) || amount <= 0) return { error: "Precio inválido." };
  if (!Number.isFinite(discountAmount) || discountAmount < 0) return { error: "Descuento inválido." };
  if (!Number.isFinite(tipAmount) || tipAmount < 0) return { error: "Propina inválida." };
  if (discountAmount > amount) return { error: "El descuento no puede superar el precio." };
  if (!PAYMENT_METHODS.includes(paymentMethod as (typeof PAYMENT_METHODS)[number])) {
    return { error: "Método de pago no válido." };
  }

  const { data: session, error: sessionError } = await supabase
    .from("cash_sessions")
    .select("id")
    .eq("id", cashSessionId)
    .eq("barbershop_id", barbershopId)
    .eq("status", "open")
    .maybeSingle();

  if (sessionError) return { error: sessionError.message };
  if (!session) return { error: "La caja ya no está abierta." };

  const { error } = await supabase.from("cash_movements").insert({
    barbershop_id: barbershopId,
    cash_session_id: cashSessionId,
    client_id: clientId,
    barber_id: barberId,
    service_id: serviceId,
    amount,
    discount_amount: discountAmount,
    tip_amount: tipAmount,
    payment_method: paymentMethod,
    movement_type: "payment",
    description,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/caja");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function closeCashSession(formData: FormData) {
  const { supabase, barbershopId } = await getContext();

  const cashSessionId = String(formData.get("cash_session_id") ?? "").trim();
  const closingAmount = parseAmount(formData.get("closing_amount"));
  const notes = String(formData.get("closing_notes") ?? "").trim() || null;

  if (!cashSessionId) return { error: "No hay una caja abierta válida." };
  if (!Number.isFinite(closingAmount) || closingAmount < 0) {
    return { error: "Dinero real contado inválido." };
  }

  const { data: session, error: sessionError } = await supabase
    .from("cash_sessions")
    .select("id, opening_amount")
    .eq("id", cashSessionId)
    .eq("barbershop_id", barbershopId)
    .eq("status", "open")
    .maybeSingle();

  if (sessionError) return { error: sessionError.message };
  if (!session) return { error: "La caja ya está cerrada o no existe." };

  const { data: movements, error: movementsError } = await supabase
    .from("cash_movements")
    .select("amount, discount_amount, tip_amount, payment_method, movement_type")
    .eq("barbershop_id", barbershopId)
    .eq("cash_session_id", cashSessionId);

  if (movementsError) return { error: movementsError.message };

  const cashMovementTotal = ((movements ?? []) as CashMovementRow[])
    .filter((movement) => movement.payment_method === "cash")
    .reduce((sum, movement) => sum + movementTotal(movement), 0);

  const expectedCashAmount = Number(session.opening_amount ?? 0) + cashMovementTotal;
  const differenceAmount = closingAmount - expectedCashAmount;

  const { error } = await supabase
    .from("cash_sessions")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      closing_amount: closingAmount,
      expected_cash_amount: expectedCashAmount,
      difference_amount: differenceAmount,
      notes,
    })
    .eq("id", cashSessionId)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/caja");
  revalidatePath("/dashboard");

  return { success: true };
}
