import { createClient } from "@/src/lib/supabase/server";

export type LoungeInteractionType =
  | "qr_scan"
  | "booking_click"
  | "product_interest"
  | "upgrade_interest"
  | "promo_click"
  | "review_click"
  | "whatsapp_click"
  | "share_click";

export const LOUNGE_INTERACTION_TYPES: LoungeInteractionType[] = [
  "qr_scan",
  "booking_click",
  "product_interest",
  "upgrade_interest",
  "promo_click",
  "review_click",
  "whatsapp_click",
  "share_click",
];

// lounge_interactions table added in migration 031, not yet in generated DB types
type LoungeInteractionsInsert = {
  barbershop_id: string;
  type: LoungeInteractionType;
  payload: Record<string, unknown>;
};

type InteractionsTable = {
  from: (table: "lounge_interactions") => {
    insert: (row: LoungeInteractionsInsert) => Promise<{ error: { message: string } | null }>;
  };
};

/**
 * Insert a lounge_interaction (server action / function).
 * Uses anon key + public INSERT policy — no auth required.
 * NEVER throws — always returns gracefully.
 */
export async function trackLoungeInteraction(
  barbershopId: string,
  type: LoungeInteractionType,
  payload: Record<string, unknown> = {}
): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as InteractionsTable;

    const { error } = await db.from("lounge_interactions").insert({
      barbershop_id: barbershopId,
      type,
      payload,
    });

    if (error) {
      console.error("[trackLoungeInteraction] insert error:", error.message);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("[trackLoungeInteraction] unexpected error:", err);
    return { success: false };
  }
}
