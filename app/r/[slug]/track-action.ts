"use server";

import { createClient } from "@/src/lib/supabase/server";

type EventType = "profile_view" | "booking_click" | "directions_click" | "whatsapp_click";

export async function trackMarketplaceEvent(
  barbershopId: string,
  eventType: EventType,
  source: string | null,
  city: string | null,
): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from("marketplace_events").insert({
      barbershop_id: barbershopId,
      event_type:    eventType,
      source,
      city,
    });
  } catch {
    // Tracking must never break the page
  }
}
