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
  const amount = Number(value.replace(",", "."));
  return Number.isFinite(amount) ? amount : Number.NaN;
}

function normalizeMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function movementTotal(movement: CashMovementRow) {
  const amount = Number(movement.amount ?? 0);
  const discount = Number(movement.discount_amount ?? 0);
  const tip = Number(movement.tip_amount ?? 0);

  if (!Number.isFinite(amount) || !Number.isFinite(discount) || !Number.isFinite(tip)) {
    return Number.NaN;
  }

  const total = amount - discount + tip;

  if (movement.movement_type === "refund" || movement.movement_type === "expense") {
    return normalizeMoney(-total);
  }

  return normalizeMoney(total);
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
  const openingAmount = normalizeMoney(parseAmount(formData.get("opening_amount")));

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
  const movementType = String(formData.get("movement_type") ?? "payment").trim();
  const clientId = String(formData.get("client_id") ?? "").trim() || null;
  const barberId = String(formData.get("barber_id") ?? "").trim() || null;
  const serviceId = String(formData.get("service_id") ?? "").trim() || null;
  const amount = normalizeMoney(parseAmount(formData.get("amount")));
  const discountAmount = normalizeMoney(parseAmount(formData.get("discount_amount")));
  const tipAmount = normalizeMoney(parseAmount(formData.get("tip_amount")));
  const paymentMethod = String(formData.get("payment_method") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!cashSessionId) return { error: "No hay una caja abierta válida." };
  if (movementType !== "payment" && movementType !== "expense") {
    return { error: "Tipo de movimiento no válido." };
  }
  if (movementType === "payment" && !barberId) return { error: "Selecciona un barbero." };
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
    payment_method: paymentMethod as "cash" | "card" | "bizum" | "transfer" | "other",
    movement_type: movementType as "payment" | "refund" | "expense" | "adjustment",
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
  const closingAmount = normalizeMoney(parseAmount(formData.get("closing_amount")));
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

  const openingAmount = Number(session.opening_amount ?? 0);
  if (!Number.isFinite(openingAmount) || openingAmount < 0 || !Number.isFinite(cashMovementTotal)) {
    return { error: "No se pudo calcular el efectivo esperado de forma segura." };
  }

  const expectedCashAmount = normalizeMoney(Math.max(0, openingAmount + cashMovementTotal));
  const differenceAmount = normalizeMoney(closingAmount - expectedCashAmount);

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

export async function sellInventoryProductFromCash(formData: FormData) {
  const { supabase, barbershopId } = await getContext();

  const cashSessionId = String(formData.get("cash_session_id") ?? "").trim();
  const productId = String(formData.get("product_id") ?? "").trim();
  const quantity = parseAmount(formData.get("quantity"));
  const unitSalePrice = parseAmount(formData.get("unit_sale_price"));
  const paymentMethod = String(formData.get("payment_method") ?? "cash").trim() || "cash";
  const clientId = String(formData.get("client_id") ?? "").trim() || null;
  const barberId = String(formData.get("barber_id") ?? "").trim() || null;

  if (!cashSessionId) return { error: "Abre la caja antes de vender productos." };
  if (!productId) return { error: "Selecciona un producto." };
  if (!Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
    return { error: "La cantidad debe ser un número entero mayor o igual a 1." };
  }
  if (!Number.isFinite(unitSalePrice) || unitSalePrice <= 0) {
    return { error: "Configura un precio de venta válido antes de vender." };
  }
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

  const { data: product, error: productError } = await supabase
    .from("inventory_products")
    .select("id, product_type, current_stock, sale_price, is_active")
    .eq("id", productId)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  if (productError) return { error: productError.message };
  if (!product) return { error: "No se encontró el producto seleccionado." };
  if (!product.is_active) return { error: "No se pueden vender productos inactivos." };
  if (product.product_type !== "retail") {
    return { error: "No se pueden vender productos de uso interno desde caja." };
  }

  const stock = Number(product.current_stock ?? 0);
  const productSalePrice = Number(product.sale_price ?? Number.NaN);

  if (!Number.isFinite(productSalePrice) || productSalePrice <= 0) {
    return { error: "Configura un precio de venta válido en Inventario antes de vender." };
  }

  if (stock < quantity) {
    return { error: "No hay stock suficiente para vender este producto." };
  }

  const { error } = await supabase.rpc("sell_inventory_product", {
    p_barbershop_id: barbershopId,
    p_product_id: productId,
    p_cash_session_id: cashSessionId,
    p_quantity: quantity,
    p_unit_sale_price: productSalePrice,
    p_payment_method: paymentMethod,
    p_client_id: clientId,
    p_barber_id: barberId,
    p_note: "Venta desde caja",
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("stock suficiente")) {
      return { error: "No hay stock suficiente para vender este producto." };
    }

    if (message.includes("uso interno")) {
      return { error: "No se pueden vender productos de uso interno desde caja." };
    }

    if (message.includes("inactivos")) {
      return { error: "No se pueden vender productos inactivos." };
    }

    if (message.includes("caja ya no esta abierta")) {
      return { error: "La caja ya no está abierta." };
    }

    return { error: error.message };
  }

  revalidatePath("/dashboard/caja");
  revalidatePath("/dashboard/inventario");
  revalidatePath("/dashboard");

  return { success: true };
}
