"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import type { InventoryMovementType, InventoryProductType } from "./types";

type ActionResult = { success: true } | { error: string };

const PRODUCT_TYPES: InventoryProductType[] = ["retail", "internal"];
const PAYMENT_METHODS = ["cash", "card", "bizum", "transfer", "other"] as const;
const MOVEMENT_TYPES: InventoryMovementType[] = [
  "in",
  "out",
  "adjustment",
  "internal_use",
  "manual_sale",
];

async function getInventoryContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  return { supabase, userId: user.id, barbershopId };
}

function readText(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

function readRequiredText(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function readNumber(formData: FormData, key: string): number | null {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;

  const value = Number(raw);
  return Number.isFinite(value) ? value : Number.NaN;
}

function readRequiredNumber(formData: FormData, key: string): number {
  const value = readNumber(formData, key);
  return value ?? Number.NaN;
}

function validateNonNegative(value: number | null, label: string): string | null {
  if (value === null) return null;
  if (!Number.isFinite(value)) return `${label} debe ser un número válido.`;
  if (value < 0) return `${label} no puede ser negativo.`;
  return null;
}

function readProductPayload(formData: FormData): {
  payload?: {
    name: string;
    category: string | null;
    product_type: InventoryProductType;
    sku: string | null;
    supplier: string | null;
    current_stock: number;
    min_stock: number;
    purchase_price: number | null;
    sale_price: number | null;
    notes: string | null;
    is_active: boolean;
  };
  error?: string;
} {
  const name = readRequiredText(formData, "name");
  if (!name) return { error: "El nombre del producto es obligatorio." };

  const productType = readRequiredText(formData, "product_type") as InventoryProductType;
  if (!PRODUCT_TYPES.includes(productType)) {
    return { error: "El tipo de producto no es válido." };
  }

  const currentStock = readRequiredNumber(formData, "current_stock");
  const minStock = readRequiredNumber(formData, "min_stock");
  const purchasePrice = readNumber(formData, "purchase_price");
  const salePrice = readNumber(formData, "sale_price");

  for (const [value, label] of [
    [currentStock, "El stock actual"],
    [minStock, "El stock mínimo"],
    [purchasePrice, "El precio de compra"],
    [salePrice, "El precio de venta"],
  ] as const) {
    const error = validateNonNegative(value, label);
    if (error) return { error };
  }

  return {
    payload: {
      name,
      category: readText(formData, "category"),
      product_type: productType,
      sku: readText(formData, "sku"),
      supplier: readText(formData, "supplier"),
      current_stock: currentStock,
      min_stock: minStock,
      purchase_price: purchasePrice,
      sale_price: salePrice,
      notes: readText(formData, "notes"),
      is_active: formData.get("is_active") === "on",
    },
  };
}

export async function createInventoryProduct(formData: FormData): Promise<ActionResult> {
  const { supabase, barbershopId } = await getInventoryContext();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const { payload, error: validationError } = readProductPayload(formData);
  if (validationError || !payload) return { error: validationError ?? "Datos inválidos." };

  const { error } = await supabase.from("inventory_products").insert({
    ...payload,
    barbershop_id: barbershopId,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/inventario");
  return { success: true };
}

export async function updateInventoryProduct(formData: FormData): Promise<ActionResult> {
  const { supabase, barbershopId } = await getInventoryContext();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const id = readRequiredText(formData, "id");
  if (!id) return { error: "No se encontró el producto a editar." };

  const { payload, error: validationError } = readProductPayload(formData);
  if (validationError || !payload) return { error: validationError ?? "Datos inválidos." };

  const { error } = await supabase
    .from("inventory_products")
    .update(payload)
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/inventario");
  return { success: true };
}

export async function toggleInventoryProduct(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const { supabase, barbershopId } = await getInventoryContext();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const { error } = await supabase
    .from("inventory_products")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/inventario");
  return { success: true };
}

export async function registerInventoryMovement(formData: FormData): Promise<ActionResult> {
  const { supabase, userId, barbershopId } = await getInventoryContext();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const productId = readRequiredText(formData, "product_id");
  const movementType = readRequiredText(formData, "movement_type") as InventoryMovementType;
  const quantity = readRequiredNumber(formData, "quantity");
  const reason = readText(formData, "reason");

  if (!productId) return { error: "Selecciona un producto." };
  if (!MOVEMENT_TYPES.includes(movementType)) {
    return { error: "El tipo de movimiento no es válido." };
  }

  const quantityError = validateNonNegative(quantity, "La cantidad");
  if (quantityError) return { error: quantityError };
  if (movementType !== "adjustment" && quantity <= 0) {
    return { error: "La cantidad debe ser mayor que cero." };
  }

  const { data: product, error: productError } = await supabase
    .from("inventory_products")
    .select("id, current_stock")
    .eq("id", productId)
    .eq("barbershop_id", barbershopId)
    .single();

  if (productError || !product) {
    return { error: productError?.message ?? "No se encontró el producto." };
  }

  const previousStock = Number(product.current_stock ?? 0);
  const newStock =
    movementType === "in"
      ? previousStock + quantity
      : movementType === "adjustment"
        ? quantity
        : previousStock - quantity;

  if (newStock < 0) {
    return {
      error:
        "El movimiento dejaría el stock en negativo. Ajusta la cantidad o registra un ajuste manual.",
    };
  }

  const { error: updateError } = await supabase
    .from("inventory_products")
    .update({ current_stock: newStock })
    .eq("id", productId)
    .eq("barbershop_id", barbershopId);

  if (updateError) return { error: updateError.message };

  const { error: insertError } = await supabase.from("inventory_movements").insert({
    barbershop_id: barbershopId,
    product_id: productId,
    movement_type: movementType,
    quantity,
    previous_stock: previousStock,
    new_stock: newStock,
    reason,
    created_by: userId,
    source:
      movementType === "adjustment"
        ? "adjustment"
        : movementType === "internal_use"
          ? "internal_use"
          : "manual",
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/dashboard/inventario");
  return { success: true };
}

export async function sellInventoryProduct(formData: FormData): Promise<ActionResult> {
  const { supabase, barbershopId } = await getInventoryContext();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const productId = readRequiredText(formData, "product_id");
  const cashSessionId = readText(formData, "cash_session_id");
  const clientId = readText(formData, "client_id");
  const barberId = readText(formData, "barber_id");
  const quantity = readRequiredNumber(formData, "quantity");
  const unitSalePrice = readRequiredNumber(formData, "unit_sale_price");
  const paymentMethod = readRequiredText(formData, "payment_method");
  const note = readText(formData, "note");

  if (!productId) return { error: "Selecciona un producto." };
  if (!cashSessionId) return { error: "Abre caja antes de vender productos." };
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "La cantidad debe ser mayor que cero." };
  }
  if (!Number.isFinite(unitSalePrice) || unitSalePrice < 0) {
    return { error: "El precio unitario no puede ser negativo." };
  }
  if (!PAYMENT_METHODS.includes(paymentMethod as (typeof PAYMENT_METHODS)[number])) {
    return { error: "Método de pago no válido." };
  }

  const { error } = await supabase.rpc("sell_inventory_product", {
    p_barbershop_id: barbershopId,
    p_product_id: productId,
    p_cash_session_id: cashSessionId,
    p_quantity: quantity,
    p_unit_sale_price: unitSalePrice,
    p_payment_method: paymentMethod,
    p_client_id: clientId,
    p_barber_id: barberId,
    p_appointment_id: null,
    p_note: note,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/inventario");
  revalidatePath("/dashboard/caja");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function cancelInventorySaleItem(formData: FormData): Promise<ActionResult> {
  const { supabase, barbershopId } = await getInventoryContext();
  if (!barbershopId) return { error: "No se encontró la barbería actual." };

  const saleItemId = readRequiredText(formData, "sale_item_id");
  const reason = readText(formData, "reason");

  if (!saleItemId) return { error: "No se encontró la venta a cancelar." };

  const { error } = await supabase.rpc("cancel_inventory_sale_item", {
    p_barbershop_id: barbershopId,
    p_sale_item_id: saleItemId,
    p_reason: reason,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/inventario");
  revalidatePath("/dashboard/caja");
  revalidatePath("/dashboard");
  return { success: true };
}
