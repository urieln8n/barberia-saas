import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type MarketingContext = {
  barbershopName: string | null;
  topServiceName: string | null;
  freeSlots: number;
};

export async function getMarketingContext(
  supabase: SupabaseClient,
  barbershopId: string,
): Promise<MarketingContext> {
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  const weekStartIso = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;

  type ServiceRelation = { name?: string | null } | { name?: string | null }[] | null;

  const [barbershopResult, weekApptsResult, todayCountResult] = await Promise.all([
    supabase.from("barbershops").select("name").eq("id", barbershopId).maybeSingle(),
    supabase
      .from("appointments")
      .select("services ( name )")
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", weekStartIso)
      .in("status", ["completed", "confirmed", "scheduled"]),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", todayIso)
      .in("status", ["pending", "scheduled", "confirmed"]),
  ]);

  const serviceCount = new Map<string, number>();
  for (const row of ((weekApptsResult.data ?? []) as { services: ServiceRelation }[])) {
    const svc = Array.isArray(row.services) ? row.services[0] : row.services;
    const name = (svc as { name?: string | null } | null)?.name;
    if (name) serviceCount.set(name, (serviceCount.get(name) ?? 0) + 1);
  }

  const topServiceName =
    [...serviceCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const freeSlots = Math.max(0, 16 - (todayCountResult.count ?? 0));

  return {
    barbershopName: (barbershopResult.data?.name as string | null) ?? null,
    topServiceName,
    freeSlots,
  };
}
