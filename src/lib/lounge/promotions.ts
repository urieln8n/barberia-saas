import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

export type LoungePromotionRow =
  Database["public"]["Tables"]["lounge_promotions"]["Row"];

export type LoungePromotionInsert =
  Database["public"]["Tables"]["lounge_promotions"]["Insert"];

export type LoungePromotionUpdate =
  Database["public"]["Tables"]["lounge_promotions"]["Update"];

type TypedClient = SupabaseClient<Database>;

/**
 * Fetch all promotions for a barbershop ordered by sort_order.
 * Never throws — returns [] on error.
 */
export async function getLoungePromotions(
  supabase: TypedClient,
  barbershopId: string
): Promise<LoungePromotionRow[]> {
  const { data, error } = await supabase
    .from("lounge_promotions")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[getLoungePromotions] error:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Create a new lounge promotion for a barbershop.
 */
export async function createLoungePromotion(
  supabase: TypedClient,
  barbershopId: string,
  data: Omit<LoungePromotionInsert, "barbershop_id" | "id" | "created_at" | "updated_at">
): Promise<{ data: LoungePromotionRow | null; error: string | null }> {
  const { data: row, error } = await supabase
    .from("lounge_promotions")
    .insert({
      ...data,
      barbershop_id: barbershopId,
    })
    .select()
    .single();

  if (error) {
    console.error("[createLoungePromotion] error:", error.message);
    return { data: null, error: error.message };
  }

  return { data: row, error: null };
}

/**
 * Update a lounge promotion. Validates ownership by barbershop_id.
 */
export async function updateLoungePromotion(
  supabase: TypedClient,
  barbershopId: string,
  id: string,
  data: Omit<LoungePromotionUpdate, "barbershop_id" | "id" | "created_at">
): Promise<{ data: LoungePromotionRow | null; error: string | null }> {
  const { data: row, error } = await supabase
    .from("lounge_promotions")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
    .select()
    .single();

  if (error) {
    console.error("[updateLoungePromotion] error:", error.message);
    return { data: null, error: error.message };
  }

  return { data: row, error: null };
}

/**
 * Delete a lounge promotion. Validates ownership by barbershop_id.
 */
export async function deleteLoungePromotion(
  supabase: TypedClient,
  barbershopId: string,
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("lounge_promotions")
    .delete()
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) {
    console.error("[deleteLoungePromotion] error:", error.message);
    return { error: error.message };
  }

  return { error: null };
}

/**
 * Toggle active/inactive for a lounge promotion.
 */
export async function toggleLoungePromotion(
  supabase: TypedClient,
  barbershopId: string,
  id: string,
  active: boolean
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("lounge_promotions")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) {
    console.error("[toggleLoungePromotion] error:", error.message);
    return { error: error.message };
  }

  return { error: null };
}
