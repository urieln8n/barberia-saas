import { createClient } from "@/src/lib/supabase/server";
import type { LoungeInteractionType } from "./track-interaction";

export type LoungeMetrics = {
  qr_scan: number;
  booking_click: number;
  product_interest: number;
  upgrade_interest: number;
  promo_click: number;
  whatsapp_click: number;
  review_click: number;
  share_click: number;
};

const ZERO_METRICS: LoungeMetrics = {
  qr_scan: 0,
  booking_click: 0,
  product_interest: 0,
  upgrade_interest: 0,
  promo_click: 0,
  whatsapp_click: 0,
  review_click: 0,
  share_click: 0,
};

// lounge_interactions table added in migration 031, not yet in generated DB types
type LoungeInteractionsSelect = {
  from: (table: "lounge_interactions") => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        gte: (col: string, val: string) => Promise<{
          data: Array<{ type: string }> | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

/**
 * Server function: count interactions by type for last 30 days.
 * Returns all zeros if no data (graceful).
 */
export async function getLoungeMetrics(
  barbershopId: string
): Promise<LoungeMetrics> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as LoungeInteractionsSelect;

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data, error } = await db
      .from("lounge_interactions")
      .select("type")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", since.toISOString());

    if (error || !data) {
      return ZERO_METRICS;
    }

    const metrics = { ...ZERO_METRICS };

    for (const row of data) {
      const type = row.type as LoungeInteractionType;
      if (type in metrics) {
        metrics[type] = (metrics[type] ?? 0) + 1;
      }
    }

    return metrics;
  } catch (err) {
    console.error("[getLoungeMetrics] unexpected error:", err);
    return ZERO_METRICS;
  }
}
