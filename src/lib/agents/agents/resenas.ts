import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getCompletedAppointmentsToday } from "../tools/reviews";

export type ResenasResult = {
  completedToday: number;
  preview: string;
};

export async function runResenasAgent(
  supabase: SupabaseClient,
  barbershopId: string,
): Promise<ResenasResult> {
  const { completedToday, firstClientName } = await getCompletedAppointmentsToday(
    supabase,
    barbershopId,
  );

  const name = firstClientName ?? "cliente";

  const preview =
    completedToday > 0
      ? `Hola ${name}, gracias por tu visita de hoy. Si tienes un minuto, tu opinión en Google nos ayuda mucho: [tu link de Google]. ¡Hasta pronto!`
      : `Hola [Nombre], gracias por tu visita. Si tienes un minuto, tu opinión en Google nos ayuda mucho: [tu link de Google]. ¡Hasta pronto!`;

  return { completedToday, preview };
}
