"use server";

import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

export type LoungeSettingsInput = {
  welcome_title?: string;
  welcome_description?: string;
  show_products?: boolean;
  show_promos?: boolean;
  show_booking?: boolean;
  show_reviews?: boolean;
  show_whatsapp?: boolean;
  show_instagram?: boolean;
  google_review_url?: string;
  whatsapp_url?: string;
  instagram_url?: string;
  share_message?: string;
  is_active?: boolean;
};

// lounge_settings table added in migration 031, not yet in generated DB types
type LoungeSettingsTable = {
  from: (table: "lounge_settings") => {
    upsert: (
      row: { barbershop_id: string } & LoungeSettingsInput,
      opts: { onConflict: string }
    ) => Promise<{ error: { message: string } | null }>;
  };
};

/**
 * Server action to create or update lounge_settings.
 * Validates barbershop_id belongs to auth user.
 * Returns { success: boolean, error?: string }.
 */
export async function upsertLoungeSettings(
  input: LoungeSettingsInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "No autenticado" };
    }

    const barbershopId = await getCurrentBarbershopId(supabase, user.id);
    if (!barbershopId) {
      return { success: false, error: "Barbería no encontrada" };
    }

    const db = supabase as unknown as LoungeSettingsTable;

    const { error } = await db
      .from("lounge_settings")
      .upsert(
        {
          barbershop_id: barbershopId,
          ...input,
        },
        { onConflict: "barbershop_id" }
      );

    if (error) {
      console.error("[upsertLoungeSettings] error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("[upsertLoungeSettings] unexpected error:", err);
    return { success: false, error: "Error inesperado" };
  }
}
