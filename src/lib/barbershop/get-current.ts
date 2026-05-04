import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCurrentBarbershopId(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  // Intento 1: via barbershop_members (más reciente primero)
  const { data: members } = await supabase
    .from("barbershop_members")
    .select("barbershop_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (members?.[0]?.barbershop_id) {
    return members[0].barbershop_id as string;
  }

  // Intento 2: via owner_id directo en barbershops (más reciente primero)
  const { data: barbershops } = await supabase
    .from("barbershops")
    .select("id")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  return (barbershops?.[0]?.id as string) ?? null;
}
