import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getLostClients } from "../tools/clients";
import { buildRetentionMessage } from "@/src/lib/retention/messages";
import { SITE_URL } from "@/src/lib/site-url";

export type RetencionResult = {
  count: number;
  preview: string;
  previewName: string;
  bookingUrl: string;
};

export async function runRetencionAgent(
  supabase: SupabaseClient,
  barbershopId: string,
  barbershopSlug: string,
): Promise<RetencionResult> {
  const bookingUrl = `${SITE_URL}/r/${barbershopSlug}`;
  const lostClients = await getLostClients(supabase, barbershopId);

  if (lostClients.length === 0) {
    return {
      count: 0,
      preview: buildRetentionMessage({ name: "cliente", bookingUrl }),
      previewName: "cliente",
      bookingUrl,
    };
  }

  const first = lostClients[0];
  return {
    count: lostClients.length,
    preview: buildRetentionMessage({ name: first.name, bookingUrl }),
    previewName: first.name,
    bookingUrl,
  };
}
