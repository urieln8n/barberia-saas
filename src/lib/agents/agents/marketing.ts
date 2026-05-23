import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getMarketingContext } from "../tools/marketing";
import { SITE_URL } from "@/src/lib/site-url";

export type MarketingResult = {
  preview: string;
  postsGenerated: number;
};

export async function runMarketingAgent(
  supabase: SupabaseClient,
  barbershopId: string,
  barbershopSlug: string,
): Promise<MarketingResult> {
  const bookingUrl = `${SITE_URL}/r/${barbershopSlug}`;
  const { barbershopName, topServiceName, freeSlots } = await getMarketingContext(
    supabase,
    barbershopId,
  );

  const shop = barbershopName ?? "la barbería";
  const service = topServiceName ?? "tu corte";

  const whatsapp =
    freeSlots > 0
      ? `Esta semana quedan ${freeSlots} huecos en ${shop}. Reserva tu ${service} aquí: ${bookingUrl}`
      : `Hola, agenda abierta en ${shop}. Reserva tu ${service} aquí: ${bookingUrl}`;

  const instagram = `✂️ ${service} disponible esta semana en ${shop}. Reserva tu hora → ${bookingUrl}`;

  const stories = `¿Ya tienes tu corte esta semana? 👇\n${bookingUrl}`;

  const preview = `💬 WHATSAPP\n${whatsapp}\n\n📸 INSTAGRAM\n${instagram}\n\n🎬 STORIES\n${stories}`;

  return { preview, postsGenerated: 3 };
}
