import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CompletedAppointment = {
  clientName: string;
};

export type ReviewsToolResult = {
  completedToday: number;
  firstClientName: string | null;
};

export async function getCompletedAppointmentsToday(
  supabase: SupabaseClient,
  barbershopId: string,
): Promise<ReviewsToolResult> {
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("appointments")
    .select("id, clients ( name )")
    .eq("barbershop_id", barbershopId)
    .eq("appointment_date", todayIso)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data || data.length === 0) {
    return { completedToday: 0, firstClientName: null };
  }

  type ClientRelation = { name?: string | null } | { name?: string | null }[] | null;
  const firstRow = data[0] as { clients: ClientRelation };
  const firstClient = Array.isArray(firstRow.clients) ? firstRow.clients[0] : firstRow.clients;
  const firstClientName = (firstClient as { name?: string | null } | null)?.name ?? null;

  return { completedToday: data.length, firstClientName };
}
