import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildBarberPerformance } from "@/src/lib/cash/barber-performance";
import { CajaClient } from "./CajaClient";
import type { InventoryProduct, InventoryProductType } from "../inventario/types";

export const dynamic = "force-dynamic";

type Relation<T> = T | T[] | null | undefined;

type CashSession = {
  id: string;
  opening_amount: number | string | null;
  opened_at: string;
  status: string;
};

type CashMovementRaw = {
  id: string;
  amount: number | string | null;
  discount_amount: number | string | null;
  tip_amount: number | string | null;
  payment_method: string | null;
  movement_type: string | null;
  barber_id: string | null;
  client_id: string | null;
  service_id: string | null;
  description: string | null;
  created_at: string;
  clients?: Relation<{ name: string | null }>;
  barbers?: Relation<{ name: string | null }>;
  services?: Relation<{ name: string | null }>;
};

type InventoryProductRaw = Omit<
  InventoryProduct,
  "current_stock" | "min_stock" | "purchase_price" | "sale_price" | "product_type"
> & {
  product_type: string;
  current_stock: number | string | null;
  min_stock: number | string | null;
  purchase_price: number | string | null;
  sale_price: number | string | null;
};

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function normalizeSession(session: CashSession | null) {
  if (!session) return null;

  return {
    id: session.id,
    opening_amount: Number(session.opening_amount ?? 0),
    opened_at: session.opened_at,
    status: session.status,
  };
}

function normalizeMovement(movement: CashMovementRaw) {
  const client = firstRelation(movement.clients);
  const barber = firstRelation(movement.barbers);
  const service = firstRelation(movement.services);

  return {
    id: movement.id,
    amount: Number(movement.amount ?? 0),
    discount_amount: Number(movement.discount_amount ?? 0),
    tip_amount: Number(movement.tip_amount ?? 0),
    payment_method: movement.payment_method ?? "other",
    movement_type: movement.movement_type ?? "payment",
    description: movement.description,
    created_at: movement.created_at,
    clients: client?.name ? { name: client.name } : null,
    barbers: barber?.name ? { name: barber.name } : null,
    services: service?.name ? { name: service.name } : null,
  };
}

function normalizeInventoryProduct(product: InventoryProductRaw): InventoryProduct {
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

export default async function CajaPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  let errorMessage: string | null = null;

  const [
    cashSessionResult,
    clientsResult,
    barbersResult,
    servicesResult,
    productsResult,
  ] = await Promise.all([
    supabase
      .from("cash_sessions")
      .select("id, opening_amount, opened_at, status")
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

    supabase
      .from("services")
      .select("id, name, price, duration_minutes")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),

    supabase
      .from("inventory_products")
      .select(
        "id, barbershop_id, name, category, product_type, sku, supplier, current_stock, min_stock, purchase_price, sale_price, notes, is_active, created_at, updated_at",
      )
      .eq("barbershop_id", barbershopId)
      .eq("product_type", "retail")
      .eq("is_active", true)
      .gt("current_stock", 0)
      .order("name", { ascending: true }),
  ]);

  if (cashSessionResult.error) {
    errorMessage =
      "No se pudo leer la caja. Comprueba que la migración 012_cash_assistant.sql está aplicada en Supabase.";
  }

  const session = normalizeSession((cashSessionResult.data as CashSession | null) ?? null);

  const movementsResult = session
    ? await supabase
        .from("cash_movements")
        .select(
          `
          id,
          amount,
          discount_amount,
          tip_amount,
          payment_method,
          movement_type,
          barber_id,
          client_id,
          service_id,
          description,
          created_at,
          clients ( name ),
          barbers ( name ),
          services ( name )
        `
        )
        .eq("barbershop_id", barbershopId)
        .eq("cash_session_id", session.id)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (movementsResult.error) {
    errorMessage = movementsResult.error.message;
  }

  if (productsResult.error) {
    errorMessage = errorMessage
      ? `${errorMessage} / ${productsResult.error.message}`
      : productsResult.error.message;
  }

  const barbers = (barbersResult.data ?? []).map((barber) => ({
    id: barber.id,
    name: barber.name,
  }));
  const movements = ((movementsResult.data as CashMovementRaw[]) ?? []).map(normalizeMovement);
  const performanceItems = buildBarberPerformance(
    barbers,
    ((movementsResult.data as CashMovementRaw[]) ?? []).map((movement) => ({
      amount: movement.amount,
      discount_amount: movement.discount_amount,
      tip_amount: movement.tip_amount,
      payment_method: movement.payment_method,
      movement_type: movement.movement_type,
      barber_id: movement.barber_id,
      client_id: movement.client_id,
      service_id: movement.service_id,
    }))
  );

  return (
    <CajaClient
      session={session}
      movements={movements}
      products={((productsResult.data as InventoryProductRaw[] | null) ?? []).map(
        normalizeInventoryProduct,
      )}
      clients={(clientsResult.data ?? []).map((client) => ({
        id: client.id,
        name: client.name,
      }))}
      barbers={barbers}
      services={(servicesResult.data ?? []).map((service) => ({
        id: service.id,
        name: service.name,
        price: Number(service.price ?? 0),
        duration_minutes: Number(service.duration_minutes ?? 30),
      }))}
      performanceItems={performanceItems}
      errorMessage={errorMessage}
    />
  );
}
