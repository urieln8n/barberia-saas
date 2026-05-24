import { createClient } from "@/src/lib/supabase/server";

export type LoungeSettings = {
  id: string;
  barbershop_id: string;
  welcome_title: string | null;
  welcome_description: string | null;
  show_products: boolean;
  show_promos: boolean;
  show_booking: boolean;
  show_reviews: boolean;
  show_whatsapp: boolean;
  show_instagram: boolean;
  google_review_url: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  share_message: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Minimal typed wrapper for lounge tables not yet in generated DB types (added in migration 031)
type LoungeTables = {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
    insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
    upsert: (row: Record<string, unknown>, opts?: Record<string, string>) => Promise<{ error: { message: string } | null }>;
  };
};

/**
 * Server function: load lounge_settings by barbershop_id.
 * Returns null if not found (normal for new barbershops).
 */
export async function getLoungeSettings(
  barbershopId: string
): Promise<LoungeSettings | null> {
  const supabase = await createClient();
  const db = supabase as unknown as LoungeTables;

  const { data, error } = await db
    .from("lounge_settings")
    .select("*")
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  if (error) {
    console.error("[getLoungeSettings] error:", error.message);
    return null;
  }

  return data as LoungeSettings | null;
}
