import { createClient } from "@/src/lib/supabase/server";
import type { LoungeSettings } from "./get-lounge-settings";

export type LoungePromotion = {
  id: string;
  barbershop_id: string;
  title: string;
  description: string | null;
  price_label: string | null;
  cta_label: string;
  active: boolean;
  sort_order: number;
};

export type PublicLoungeService = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

export type PublicLoungeBarbershop = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  instagram_url: string | null;
  google_business_url: string | null;
};

export type PublicLoungeData = {
  barbershop: PublicLoungeBarbershop;
  settings: LoungeSettings | null;
  promotions: LoungePromotion[];
  services: PublicLoungeService[];
};

// Flexible builder type for lounge tables not yet in generated DB types (migration 031)
type FlexibleQuery = {
  select: (cols: string) => FlexibleQuery;
  eq: (col: string, val: string | boolean) => FlexibleQuery;
  order: (col: string, opts?: { ascending: boolean }) => FlexibleQuery;
  limit: (n: number) => FlexibleQuery;
  maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
  then: (resolve: (value: { data: unknown; error: unknown }) => void) => Promise<void>;
};

type FlexDB = {
  from: (table: string) => FlexibleQuery;
};

/**
 * Public function: load barbershop + lounge_settings + lounge_promotions + services.
 * Used by /lounge/[slug] page. Does NOT require auth.
 * Returns null if barbershop is not found.
 */
export async function getPublicLoungeData(
  slug: string
): Promise<PublicLoungeData | null> {
  const supabase = await createClient();

  // 1. Fetch barbershop by slug (known table — use typed client)
  const { data: barbershop, error: barbershopError } = await supabase
    .from("barbershops")
    .select("id, name, slug, phone, address, city, instagram_url, google_business_url")
    .eq("slug", slug)
    .maybeSingle();

  if (barbershopError || !barbershop) {
    return null;
  }

  // Tables added in migration 031 — use flexible cast until types are regenerated
  const db = supabase as unknown as FlexDB;

  // 2. Fetch lounge_settings (public read policy requires is_active = true)
  const { data: settingsRaw } = await db
    .from("lounge_settings")
    .select("*")
    .eq("barbershop_id", barbershop.id)
    .eq("is_active", true)
    .maybeSingle();

  // 3. Fetch active lounge_promotions ordered by sort_order
  const { data: promotionsRaw } = (await (db
    .from("lounge_promotions")
    .select("id, barbershop_id, title, description, price_label, cta_label, active, sort_order")
    .eq("barbershop_id", barbershop.id)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .limit(10) as unknown as Promise<{ data: unknown; error: unknown }>));

  // 4. Fetch active services (known table — use typed client)
  const { data: servicesRaw } = await supabase
    .from("services")
    .select("id, name, price, duration_minutes")
    .eq("barbershop_id", barbershop.id)
    .eq("active", true)
    .order("created_at", { ascending: true })
    .limit(6);

  return {
    barbershop: barbershop as PublicLoungeBarbershop,
    settings: (settingsRaw as LoungeSettings | null) ?? null,
    promotions: (promotionsRaw as LoungePromotion[] | null) ?? [],
    services: (servicesRaw ?? []) as PublicLoungeService[],
  };
}
