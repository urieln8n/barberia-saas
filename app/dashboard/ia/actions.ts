"use server";

import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { generateOwnerInsights, type OwnerAIMetrics, type OwnerAIResult } from "@/src/lib/ai/owner-ai";

type Relation<T> = T | T[] | null | undefined;

type AppointmentRow = {
  id: string;
  appointment_date: string;
  status: string | null;
  start_time: string | null;
  clients: Relation<{ id: string | null; created_at: string | null }>;
  services: Relation<{ name: string | null; price: number | string | null }>;
  barbers: Relation<{ name: string | null }>;
};

type CashMovementRow = {
  amount: number | string | null;
  discount_amount: number | string | null;
  tip_amount: number | string | null;
  movement_type: string | null;
  service_id?: string | null;
  barber_id?: string | null;
};

type ClientRow = {
  id: string;
  created_at: string | null;
  last_visit_at: string | null;
};

type ProductRow = {
  id: string;
  name: string | null;
  current_stock: number | string | null;
  min_stock: number | string | null;
};

type SaleItemRow = {
  product_id: string | null;
  quantity: number | string | null;
  total_sale_price: number | string | null;
};

type AskOwnerAIResponse = {
  ok: boolean;
  result?: OwnerAIResult;
  error?: string;
};

const requestWindowMs = 60_000;
const maxRequestsPerWindow = 8;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function localDateISO(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function movementTotal(movement: CashMovementRow) {
  const total =
    Number(movement.amount ?? 0) -
    Number(movement.discount_amount ?? 0) +
    Number(movement.tip_amount ?? 0);

  return movement.movement_type === "refund" || movement.movement_type === "expense"
    ? -total
    : total;
}

function assertQuestion(question: string) {
  const clean = question.trim().replace(/\s+/g, " ");

  if (!clean) {
    return { error: "Escribe una pregunta para la IA del Dueño.", question: "" };
  }

  if (clean.length > 280) {
    return { error: "La pregunta es demasiado larga. Máximo 280 caracteres.", question: "" };
  }

  return { error: null, question: clean };
}

function checkRateLimit(userId: string, barbershopId: string) {
  const key = `${barbershopId}:${userId}`;
  const now = Date.now();
  const current = rateLimitMap.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + requestWindowMs });
    return true;
  }

  if (current.count >= maxRequestsPerWindow) {
    return false;
  }

  current.count += 1;
  return true;
}

async function safeLogAIRequest({
  barbershopId,
  userId,
  question,
  result,
  tokensInput,
  tokensOutput,
  errorMessage,
}: {
  barbershopId: string;
  userId: string;
  question: string;
  result?: OwnerAIResult;
  tokensInput?: number | null;
  tokensOutput?: number | null;
  errorMessage?: string | null;
}) {
  try {
    const supabase = createServiceRoleClient();
    await supabase.from("ai_requests").insert({
      barbershop_id: barbershopId,
      user_id: userId,
      question: question.slice(0, 280),
      response_summary: result?.summary?.slice(0, 500) ?? null,
      model: result?.model ?? null,
      status: errorMessage ? "error" : result?.mode === "local" ? "fallback" : "completed",
      tokens_input: tokensInput ?? null,
      tokens_output: tokensOutput ?? null,
      error_message: errorMessage?.slice(0, 500) ?? null,
    });
  } catch {
    // La tabla ai_requests es opcional; nunca debe romper la IA del Dueño.
  }
}

async function collectMetrics(barbershopId: string): Promise<OwnerAIMetrics> {
  const supabase = createServiceRoleClient();
  const today = localDateISO();
  const weekStart = localDateISO(-6);
  const thirtyDaysAgo = localDateISO(-30);
  const fortyFiveDaysAgo = localDateISO(-45);
  const sixtyDaysAgo = localDateISO(-60);

  const [
    appointmentsResult,
    clientsResult,
    movementsResult,
    productsResult,
    saleItemsResult,
    reviewsResult,
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select(
        `
        id,
        appointment_date,
        status,
        start_time,
        clients ( id, created_at ),
        services ( name, price ),
        barbers ( name )
      `,
      )
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", weekStart)
      .order("appointment_date", { ascending: false }),
    supabase
      .from("clients")
      .select("id, created_at, last_visit_at")
      .eq("barbershop_id", barbershopId),
    supabase
      .from("cash_movements")
      .select("amount, discount_amount, tip_amount, movement_type, service_id, barber_id")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),
    supabase
      .from("inventory_products")
      .select("id, name, current_stock, min_stock")
      .eq("barbershop_id", barbershopId)
      .eq("is_active", true),
    supabase
      .from("inventory_sale_items")
      .select("product_id, quantity, total_sale_price")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${weekStart}T00:00:00`)
      .is("cancelled_at", null),
    supabase
      .from("reviews")
      .select("id, status")
      .eq("business_id", barbershopId),
  ]);

  const appointments = ((appointmentsResult.data ?? []) as AppointmentRow[]).map((appointment) => ({
    ...appointment,
    client: firstRelation(appointment.clients),
    service: firstRelation(appointment.services),
    barber: firstRelation(appointment.barbers),
  }));
  const clients = (clientsResult.data ?? []) as ClientRow[];
  const products = (productsResult.data ?? []) as ProductRow[];
  const saleItems = (saleItemsResult.data ?? []) as SaleItemRow[];
  const todayAppointments = appointments.filter((appointment) => appointment.appointment_date === today);
  const serviceStats = new Map<string, { name: string; count: number; revenue: number }>();
  const barberStats = new Map<string, { name: string; appointments: number; revenue: number }>();
  const productNameById = new Map(products.map((product) => [product.id, product.name ?? "Producto"]));
  const productStats = new Map<string, { name: string; quantity: number; revenue: number }>();

  for (const appointment of appointments) {
    const serviceName = appointment.service?.name;
    const price = Number(appointment.service?.price ?? 0);
    const barberName = appointment.barber?.name;

    if (serviceName) {
      const current = serviceStats.get(serviceName) ?? { name: serviceName, count: 0, revenue: 0 };
      current.count += 1;
      current.revenue += price;
      serviceStats.set(serviceName, current);
    }

    if (barberName) {
      const current = barberStats.get(barberName) ?? { name: barberName, appointments: 0, revenue: 0 };
      current.appointments += 1;
      current.revenue += price;
      barberStats.set(barberName, current);
    }
  }

  for (const item of saleItems) {
    if (!item.product_id) continue;
    const name = productNameById.get(item.product_id) ?? "Producto";
    const current = productStats.get(item.product_id) ?? { name, quantity: 0, revenue: 0 };
    current.quantity += Number(item.quantity ?? 0);
    current.revenue += Number(item.total_sale_price ?? 0);
    productStats.set(item.product_id, current);
  }

  const collectedRevenue = ((movementsResult.data ?? []) as CashMovementRow[]).reduce(
    (sum, movement) => sum + movementTotal(movement),
    0,
  );
  const estimatedRevenue = todayAppointments.reduce(
    (sum, appointment) => sum + Number(appointment.service?.price ?? 0),
    0,
  );
  const newClients = clients.filter((client) => client.created_at?.slice(0, 10) === today).length;
  const recurrentClients = Math.max(
    0,
    new Set(todayAppointments.map((appointment) => appointment.client?.id).filter(Boolean)).size - newClients,
  );
  const clientsNoVisit30 = clients.filter((client) => !client.last_visit_at || client.last_visit_at.slice(0, 10) <= thirtyDaysAgo).length;
  const clientsNoVisit45 = clients.filter((client) => !client.last_visit_at || client.last_visit_at.slice(0, 10) <= fortyFiveDaysAgo).length;
  const clientsNoVisit60 = clients.filter((client) => !client.last_visit_at || client.last_visit_at.slice(0, 10) <= sixtyDaysAgo).length;
  const topServices = Array.from(serviceStats.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  const topProducts = Array.from(productStats.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  const topBarbers = Array.from(barberStats.values()).sort((a, b) => b.appointments - a.appointments).slice(0, 5);

  return {
    todayAppointments: todayAppointments.length,
    weekAppointments: appointments.length,
    confirmedAppointments: todayAppointments.filter((appointment) => appointment.status === "confirmed").length,
    pendingAppointments: todayAppointments.filter((appointment) => ["pending", "scheduled"].includes(appointment.status ?? "")).length,
    cancelledAppointments: todayAppointments.filter((appointment) => appointment.status === "cancelled").length,
    weekCancelled: appointments.filter((appointment) => appointment.status === "cancelled").length,
    noShows: todayAppointments.filter((appointment) => appointment.status === "no_show").length,
    weekNoShows: appointments.filter((appointment) => appointment.status === "no_show").length,
    freeSlots: Math.max(0, 16 - todayAppointments.length),
    estimatedRevenue,
    collectedRevenue,
    servicesCompleted: todayAppointments.filter((appointment) => appointment.status === "completed").length,
    productsSold: saleItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0),
    newClients,
    recurrentClients,
    dormantClients: clientsNoVisit45,
    clientsNoVisit30,
    clientsNoVisit45,
    clientsNoVisit60,
    lowStockProducts: products.filter((product) => Number(product.current_stock ?? 0) <= Number(product.min_stock ?? 0)).length,
    topServiceName: topServices[0]?.name ?? null,
    topBarberName: topBarbers[0]?.name ?? null,
    topProducts,
    topServices,
    topBarbers,
    reviewsPending: (reviewsResult.data ?? []).filter((review) => review.status !== "published").length,
  };
}

export async function askOwnerAI(questionInput: string): Promise<AskOwnerAIResponse> {
  const validation = assertQuestion(questionInput);
  if (validation.error) {
    return { ok: false, error: validation.error };
  }

  const authClient = await createServerClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(authClient, user.id);
  if (!barbershopId) redirect("/onboarding");

  if (!checkRateLimit(user.id, barbershopId)) {
    return {
      ok: false,
      error: "Has hecho varias preguntas seguidas. Espera un minuto para controlar coste y uso.",
    };
  }

  try {
    const metrics = await collectMetrics(barbershopId);
    const { result, tokensInput, tokensOutput } = await generateOwnerInsights({
      barbershopId,
      question: validation.question,
      metrics,
    });

    await safeLogAIRequest({
      barbershopId,
      userId: user.id,
      question: validation.question,
      result,
      tokensInput,
      tokensOutput,
    });

    return { ok: true, result };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Error inesperado generando el analisis.";

    await safeLogAIRequest({
      barbershopId,
      userId: user.id,
      question: validation.question,
      errorMessage: message,
    });

    return {
      ok: false,
      error: "No se pudo generar el analisis ahora. La pagina sigue funcionando; prueba de nuevo en unos segundos.",
    };
  }
}
