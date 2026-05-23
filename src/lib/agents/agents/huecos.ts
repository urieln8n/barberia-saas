import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getFreeSlots } from "../tools/availability";
import { SITE_URL } from "@/src/lib/site-url";

export type HuecosResult = {
  freeSlots: number;
  preview: string;
  bookingUrl: string;
};

export async function runHuecosAgent(
  supabase: SupabaseClient,
  barbershopId: string,
  barbershopSlug: string,
): Promise<HuecosResult> {
  const bookingUrl = `${SITE_URL}/r/${barbershopSlug}`;
  const { freeSlots } = await getFreeSlots(supabase, barbershopId);

  const preview =
    freeSlots > 0
      ? `Hoy quedan ${freeSlots} huecos disponibles. ¿Te reservo uno? Elige tu hora aquí: ${bookingUrl}`
      : `La agenda de hoy está completa. Reserva para mañana aquí: ${bookingUrl}`;

  return { freeSlots, preview, bookingUrl };
}
