"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("No autenticado");
  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) throw new Error("Barbería no encontrada");
  return { supabase, user, barbershopId };
}

function err(message: string) {
  return { ok: false as const, error: message };
}

function ok<T>(data: T) {
  return { ok: true as const, data };
}

// ── Crear o actualizar programa ───────────────────────────────────────────────

export async function upsertLoyaltyProgram(formData: FormData) {
  try {
    const { supabase, barbershopId } = await getAuthContext();

    const programId      = (formData.get("program_id") as string) || undefined;
    const name           = (formData.get("name") as string)?.trim();
    const stampsRequired = parseInt(formData.get("stamps_required") as string, 10);
    const rewardTitle    = (formData.get("reward_title") as string)?.trim();
    const rewardDesc     = (formData.get("reward_description") as string)?.trim() || null;
    const rewardType     = ((formData.get("reward_type") as string) || "free_service") as "free_service" | "discount" | "product" | "custom";
    const maxPerDay      = parseInt(formData.get("max_stamps_per_day") as string, 10) || 1;
    const waMessage      = (formData.get("whatsapp_message") as string)?.trim() || null;

    if (!name || !rewardTitle) return err("Nombre y recompensa son obligatorios");
    if (isNaN(stampsRequired) || stampsRequired < 2 || stampsRequired > 50)
      return err("Sellos requeridos debe estar entre 2 y 50");

    const payload = {
      barbershop_id:     barbershopId,
      name,
      stamps_required:   stampsRequired,
      reward_title:      rewardTitle,
      reward_description: rewardDesc,
      reward_type:       rewardType,
      max_stamps_per_day: maxPerDay,
      whatsapp_message:  waMessage,
      is_active:         true,
    };

    if (programId) {
      const { barbershop_id: _ignore, ...updateFields } = payload;
      const { error } = await supabase
        .from("loyalty_programs")
        .update({ ...updateFields, updated_at: new Date().toISOString() })
        .eq("id", programId)
        .eq("barbershop_id", barbershopId);
      if (error) return err(error.message);
    } else {
      // Desactivar programas anteriores
      await supabase
        .from("loyalty_programs")
        .update({ is_active: false })
        .eq("barbershop_id", barbershopId);

      const { error } = await supabase
        .from("loyalty_programs")
        .insert(payload);
      if (error) return err(error.message);
    }

    revalidatePath("/dashboard/fidelizacion");
    return ok("Programa guardado correctamente");
  } catch (e) {
    return err(e instanceof Error ? e.message : "Error inesperado");
  }
}

// ── Añadir sello manual ───────────────────────────────────────────────────────

export async function addManualStamp(formData: FormData) {
  try {
    const { supabase, user, barbershopId } = await getAuthContext();

    const clientId = formData.get("client_id") as string;
    const note     = (formData.get("note") as string)?.trim() || "Sello añadido manualmente";

    if (!clientId) return err("client_id requerido");

    // Verificar que el cliente pertenece a esta barbería
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("barbershop_id", barbershopId)
      .maybeSingle();
    if (!client) return err("Cliente no encontrado");

    const { data, error } = await supabase.rpc("loyalty_add_stamp", {
      p_barbershop_id:  barbershopId,
      p_client_id:      clientId,
      p_appointment_id: null,
      p_payment_id:     null,
      p_note:           note,
      p_created_by:     user.id,
    });

    if (error) return err(error.message);
    const rpcResult = data as { ok: boolean; reason?: string } | null;
    if (!rpcResult?.ok) return err(rpcResult?.reason ?? "No se pudo añadir el sello");

    revalidatePath("/dashboard/fidelizacion");
    revalidatePath(`/dashboard/clientes/${clientId}`);
    return ok(rpcResult);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Error inesperado");
  }
}

// ── Quitar sello manual ───────────────────────────────────────────────────────

export async function removeManualStamp(formData: FormData) {
  try {
    const { supabase, user, barbershopId } = await getAuthContext();

    const clientId = formData.get("client_id") as string;
    const note     = (formData.get("note") as string)?.trim() || "Sello eliminado manualmente";

    if (!clientId) return err("client_id requerido");

    // Obtener tarjeta activa
    const { data: card } = await supabase
      .from("loyalty_cards")
      .select("id, current_stamps, program_id")
      .eq("barbershop_id", barbershopId)
      .eq("client_id", clientId)
      .eq("status", "active")
      .maybeSingle();

    if (!card) return err("No hay tarjeta activa para este cliente");
    if (card.current_stamps <= 0) return err("El cliente no tiene sellos que quitar");

    // Descontar sello
    const { error: updateError } = await supabase
      .from("loyalty_cards")
      .update({ current_stamps: card.current_stamps - 1, updated_at: new Date().toISOString() })
      .eq("id", card.id)
      .eq("barbershop_id", barbershopId);
    if (updateError) return err(updateError.message);

    // Registrar evento
    await supabase.from("loyalty_stamps").insert({
      barbershop_id: barbershopId,
      client_id:     clientId,
      card_id:       card.id,
      stamp_type:    "manual_remove",
      stamps_delta:  -1,
      note,
      created_by:    user.id,
    });

    revalidatePath("/dashboard/fidelizacion");
    revalidatePath(`/dashboard/clientes/${clientId}`);
    return ok("Sello eliminado correctamente");
  } catch (e) {
    return err(e instanceof Error ? e.message : "Error inesperado");
  }
}

// ── Canjear recompensa ────────────────────────────────────────────────────────

export async function redeemReward(formData: FormData) {
  try {
    const { supabase, user, barbershopId } = await getAuthContext();

    const cardId = formData.get("card_id") as string;
    if (!cardId) return err("card_id requerido");

    // Verificar que la tarjeta pertenece a esta barbería
    const { data: card } = await supabase
      .from("loyalty_cards")
      .select("id, client_id")
      .eq("id", cardId)
      .eq("barbershop_id", barbershopId)
      .eq("status", "completed")
      .maybeSingle();
    if (!card) return err("Tarjeta no encontrada o no está completa");

    const { data, error } = await supabase.rpc("loyalty_redeem_reward", {
      p_card_id:    cardId,
      p_created_by: user.id,
    });

    if (error) return err(error.message);
    const redeemResult = data as { ok: boolean; reason?: string } | null;
    if (!redeemResult?.ok) return err(redeemResult?.reason ?? "No se pudo canjear");

    // Disparar webhook n8n si está configurado
    void triggerLoyaltyWebhook("reward_redeemed", barbershopId, card.client_id);

    revalidatePath("/dashboard/fidelizacion");
    return ok(data);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Error inesperado");
  }
}

// ── Desactivar programa ───────────────────────────────────────────────────────

export async function deactivateLoyaltyProgram(programId: string) {
  try {
    const { supabase, barbershopId } = await getAuthContext();

    const { error } = await supabase
      .from("loyalty_programs")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", programId)
      .eq("barbershop_id", barbershopId);

    if (error) return err(error.message);
    revalidatePath("/dashboard/fidelizacion");
    return ok("Programa desactivado");
  } catch (e) {
    return err(e instanceof Error ? e.message : "Error inesperado");
  }
}

// ── Webhook interno para n8n ──────────────────────────────────────────────────

export async function triggerLoyaltyWebhook(
  event: string,
  barbershopId: string,
  clientId: string,
) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const supabase = await createClient();

    const [{ data: client }, { data: program }, { data: card }] = await Promise.all([
      supabase.from("clients").select("name, phone").eq("id", clientId).maybeSingle(),
      supabase.from("loyalty_programs")
        .select("reward_title, stamps_required, name")
        .eq("barbershop_id", barbershopId)
        .eq("is_active", true)
        .maybeSingle(),
      supabase.from("loyalty_cards")
        .select("current_stamps")
        .eq("barbershop_id", barbershopId)
        .eq("client_id", clientId)
        .in("status", ["active", "completed"])
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const payload = {
      event,
      barbershop_id:    barbershopId,
      client_id:        clientId,
      client_name:      client?.name ?? "",
      phone:            client?.phone ?? "",
      current_stamps:   card?.current_stamps ?? 0,
      stamps_required:  program?.stamps_required ?? 0,
      reward_title:     program?.reward_title ?? "",
      program_name:     program?.name ?? "",
      booking_url:      `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://barberiaos.com"}/r`,
      timestamp:        new Date().toISOString(),
    };

    await fetch(webhookUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET ?? "" },
      body:    JSON.stringify(payload),
      signal:  AbortSignal.timeout(5000),
    });
  } catch {
    // Silencioso: el webhook es best-effort, no debe romper el flujo principal
  }
}
