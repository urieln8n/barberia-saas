import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { InventarioClient } from "./InventarioClient";
import type { InventoryMovement, InventoryProduct, InventoryProductType } from "./types";

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
  "quantity" | "previous_stock" | "new_stock"
> & {
  quantity: number | string | null;
  previous_stock: number | string | null;
  new_stock: number | string | null;
  source?: string | null;
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

  const [productsResult, movementsResult] = await Promise.all([
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
        "id, barbershop_id, product_id, movement_type, quantity, previous_stock, new_stock, reason, source, created_at, created_by",
      )
      .eq("barbershop_id", barbershopId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const errorMessage =
    productsResult.error?.message ??
    movementsResult.error?.message ??
    null;

  return (
    <InventarioClient
      products={((productsResult.data as ProductRow[] | null) ?? []).map(normalizeProduct)}
      recentMovements={((movementsResult.data as MovementRow[] | null) ?? []).map(
        normalizeMovement,
      )}
      errorMessage={errorMessage}
    />
  );
}
