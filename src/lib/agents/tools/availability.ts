import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_DAILY_SLOTS = 16;

export type FreeSlotsResult = {
  todayAppointments: number;
  freeSlots: number;
  estimatedRevenue: number;
};

export async function getFreeSlots(
  supabase: SupabaseClient,
  barbershopId: string,
): Promise<FreeSlotsResult> {
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("appointments")
    .select("id, services ( price )")
    .eq("barbershop_id", barbershopId)
    .eq("appointment_date", todayIso)
    .in("status", ["pending", "scheduled", "confirmed"]);

  if (error || !data) {
    return { todayAppointments: 0, freeSlots: MAX_DAILY_SLOTS, estimatedRevenue: 0 };
  }

  const todayAppointments = data.length;
  const freeSlots = Math.max(0, MAX_DAILY_SLOTS - todayAppointments);

  type ServiceRelation = { price?: number | string | null } | { price?: number | string | null }[] | null;
  const estimatedRevenue = (data as { services: ServiceRelation }[]).reduce((sum, row) => {
    const svc = Array.isArray(row.services) ? row.services[0] : row.services;
    return sum + Number((svc as { price?: number | string | null } | null)?.price ?? 0);
  }, 0);

  return { todayAppointments, freeSlots, estimatedRevenue };
}
