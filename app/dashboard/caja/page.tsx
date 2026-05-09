import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildBarberPerformance } from "@/src/lib/cash/barber-performance";
import { CajaClient } from "./CajaClient";

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

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function getLocalDateISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

export default async function CajaPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = getLocalDateISO();
  let errorMessage: string | null = null;

  const [
    cashSessionResult,
    clientsResult,
    barbersResult,
    servicesResult,
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
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (movementsResult.error) {
    errorMessage = movementsResult.error.message;
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
