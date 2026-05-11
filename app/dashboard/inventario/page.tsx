import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { InventarioClient } from "./InventarioClient";
import type {
  CashSessionOption,
  InventoryMovement,
  InventoryMovementSource,
  InventoryProduct,
  InventoryProductType,
  InventorySaleItem,
} from "./types";

export const dynamic = "force-dynamic";

type ProductRow = Omit<
  InventoryProduct,
  "current_stock" | "min_stock" | "purchase_price" | "sale_price" | "product_type"
> & {
  product_type: string;
  current_stock: number | string | null;
  min_stock: number | string | null;
  purchase_price: number | string | null;
  sale_price: number | string | null;
};

type MovementRow = Omit<
  InventoryMovement,
  "quantity" | "previous_stock" | "new_stock" | "source"
> & {
  quantity: number | string | null;
  previous_stock: number | string | null;
  new_stock: number | string | null;
  source: string | null;
};

type SaleItemRow = Omit<
  InventorySaleItem,
  | "quantity"
  | "unit_purchase_price"
  | "unit_sale_price"
  | "total_sale_price"
  | "estimated_profit"
  | "stock_before"
  | "stock_after"
> & {
  quantity: number | string | null;
  unit_purchase_price: number | string | null;
  unit_sale_price: number | string | null;
  total_sale_price: number | string | null;
  estimated_profit: number | string | null;
  stock_before: number | string | null;
  stock_after: number | string | null;
};

type CashSessionRow = {
  id: string;
  opened_at: string;
  opening_amount: number | string | null;
};

type PersonRow = {
  id: string;
  name: string | null;
};

function normalizeProduct(product: ProductRow): InventoryProduct {
  return {
    ...product,
    product_type:
      product.product_type === "internal" ? "internal" : ("retail" satisfies InventoryProductType),
    current_stock: Number(product.current_stock ?? 0),
    min_stock: Number(product.min_stock ?? 0),
    purchase_price:
      product.purchase_price === null ? null : Number(product.purchase_price),
    sale_price: product.sale_price === null ? null : Number(product.sale_price),
  };
}

function normalizeMovement(movement: MovementRow): InventoryMovement {
  return {
    ...movement,
    movement_type: movement.movement_type,
    quantity: Number(movement.quantity ?? 0),
    previous_stock:
      movement.previous_stock === null ? null : Number(movement.previous_stock),
    new_stock: movement.new_stock === null ? null : Number(movement.new_stock),
    source: normalizeSource(movement.source),
  };
}

function normalizeSource(source: string | null): InventoryMovementSource | null {
  if (
    source === "manual" ||
    source === "cash_sale" ||
    source === "sale_cancelled" ||
    source === "adjustment" ||
    source === "internal_use"
  ) {
    return source;
  }

  return null;
}

function normalizeSaleItem(item: SaleItemRow): InventorySaleItem {
  return {
    ...item,
    quantity: Number(item.quantity ?? 0),
    unit_purchase_price:
      item.unit_purchase_price === null ? null : Number(item.unit_purchase_price),
    unit_sale_price: Number(item.unit_sale_price ?? 0),
    total_sale_price: Number(item.total_sale_price ?? 0),
    estimated_profit:
      item.estimated_profit === null ? null : Number(item.estimated_profit),
    stock_before: item.stock_before === null ? null : Number(item.stock_before),
    stock_after: item.stock_after === null ? null : Number(item.stock_after),
  };
}

export default async function InventarioPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const [productsResult, movementsResult, salesResult, cashSessionResult, clientsResult, barbersResult] = await Promise.all([
    supabase
      .from("inventory_products")
      .select(
        "id, barbershop_id, name, category, product_type, sku, supplier, current_stock, min_stock, purchase_price, sale_price, notes, is_active, created_at, updated_at",
      )
      .eq("barbershop_id", barbershopId)
      .order("name", { ascending: true }),
    supabase
      .from("inventory_movements")
      .select(
        "id, barbershop_id, product_id, movement_type, quantity, previous_stock, new_stock, reason, created_at, created_by, sale_item_id, cash_session_id, sale_id, appointment_id, source",
      )
      .eq("barbershop_id", barbershopId)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("inventory_sale_items")
      .select(
        `
        id,
        barbershop_id,
        product_id,
        cash_session_id,
        sale_id,
        appointment_id,
        client_id,
        barber_id,
        quantity,
        unit_purchase_price,
        unit_sale_price,
        total_sale_price,
        estimated_profit,
        stock_before,
        stock_after,
        created_by,
        created_at,
        cancelled_at,
        cancellation_reason,
        products:inventory_products ( name ),
        clients ( name ),
        barbers ( name )
      `,
      )
      .eq("barbershop_id", barbershopId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("cash_sessions")
      .select("id, opened_at, opening_amount")
      .eq("barbershop_id", barbershopId)
      .eq("status", "open")
      .order("opened_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("clients")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .order("name", { ascending: true }),
    supabase
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),
  ]);

  const errorMessage =
    productsResult.error?.message ??
    movementsResult.error?.message ??
    salesResult.error?.message ??
    cashSessionResult.error?.message ??
    clientsResult.error?.message ??
    barbersResult.error?.message ??
    null;

  const cashSessionData = cashSessionResult.data as CashSessionRow | null;
  const openCashSession: CashSessionOption | null = cashSessionData
    ? {
        id: cashSessionData.id,
        opened_at: cashSessionData.opened_at,
        opening_amount: Number(cashSessionData.opening_amount ?? 0),
      }
    : null;

  return (
    <InventarioClient
      products={((productsResult.data as ProductRow[] | null) ?? []).map(normalizeProduct)}
      recentMovements={((movementsResult.data as MovementRow[] | null) ?? []).map(
        normalizeMovement,
      )}
      saleItems={((salesResult.data as SaleItemRow[] | null) ?? []).map(normalizeSaleItem)}
      openCashSession={openCashSession}
      clients={((clientsResult.data as PersonRow[] | null) ?? []).map((client) => ({
        id: client.id,
        name: client.name ?? "Cliente sin nombre",
      }))}
      barbers={((barbersResult.data as PersonRow[] | null) ?? []).map((barber) => ({
        id: barber.id,
        name: barber.name ?? "Barbero sin nombre",
      }))}
      errorMessage={errorMessage}
    />
  );
}
