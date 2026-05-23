import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type LostClient = {
  id: string;
  name: string;
  phone: string | null;
  last_visit_at: string | null;
  days_since_visit: number;
};

export async function getLostClients(
  supabase: SupabaseClient,
  barbershopId: string,
  minDaysLost = 45,
  limit = 20,
): Promise<LostClient[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - minDaysLost);

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, phone, last_visit_at")
    .eq("barbershop_id", barbershopId)
    .not("last_visit_at", "is", null)
    .lt("last_visit_at", cutoff.toISOString())
    .order("last_visit_at", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  const now = Date.now();
  return data.map((client) => ({
    id: client.id as string,
    name: (client.name as string) ?? "Cliente",
    phone: (client.phone as string | null) ?? null,
    last_visit_at: client.last_visit_at as string | null,
    days_since_visit: client.last_visit_at
      ? Math.floor((now - new Date(client.last_visit_at as string).getTime()) / 86_400_000)
      : minDaysLost,
  }));
}
