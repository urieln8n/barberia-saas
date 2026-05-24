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

export type LoungeDailyData = {
  date: string;   // ISO date string "YYYY-MM-DD"
  type: string;
  count: number;
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

// lounge_interactions table added in migration 031
// Once types are regenerated these casts can be removed.
type InteractionRow = { type: string; created_at: string };

type LoungeInteractionsQuery = {
  from: (table: "lounge_interactions") => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        gte: (col: string, val: string) => Promise<{
          data: InteractionRow[] | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

function toDateKey(isoString: string): string {
  // "2025-05-24T10:30:00Z" → "2025-05-24"
  return isoString.substring(0, 10);
}

/**
 * Server function: aggregate interactions by type (totals) AND by day
 * for the last 30 days. A single query; grouping done in JS.
 * Returns all zeros / empty array if no data (graceful).
 */
export async function getLoungeMetrics(
  barbershopId: string
): Promise<LoungeMetrics> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as LoungeInteractionsQuery;

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data, error } = await db
      .from("lounge_interactions")
      .select("type, created_at")
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

/**
 * Server function: returns daily interaction counts for chart rendering.
 * Returns an array of { date, type, count } grouped by day + type.
 * Returns [] if no data (graceful).
 */
export async function getLoungeDailyMetrics(
  barbershopId: string
): Promise<LoungeDailyData[]> {
  try {
    const supabase = await createClient();
    const db = supabase as unknown as LoungeInteractionsQuery;

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data, error } = await db
      .from("lounge_interactions")
      .select("type, created_at")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", since.toISOString());

    if (error || !data) {
      return [];
    }

    // Group by date + type in JS
    const map = new Map<string, number>();

    for (const row of data) {
      const key = `${toDateKey(row.created_at)}__${row.type}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    const result: LoungeDailyData[] = [];
    for (const [key, count] of map.entries()) {
      const [date, type] = key.split("__");
      result.push({ date, type, count });
    }

    // Sort by date asc
    result.sort((a, b) => a.date.localeCompare(b.date));

    return result;
  } catch (err) {
    console.error("[getLoungeDailyMetrics] unexpected error:", err);
    return [];
  }
}
