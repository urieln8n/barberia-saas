"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

async function getAuthContext() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");
  return { barbershopId };
}

export async function addManualStampAction(formData: FormData) {
  const { barbershopId } = await getAuthContext();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const programId = String(formData.get("program_id") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || "Sello manual";

  if (!clientId || !programId) redirect("/dashboard/clientes");

  const db = createServiceRoleClient();

  // Verify program belongs to this barbershop
  const { data: program } = await db
    .from("loyalty_programs")
    .select("id, stamps_required, is_active")
    .eq("id", programId)
    .eq("barbershop_id", barbershopId)
    .eq("is_active", true)
    .maybeSingle();

  if (!program) redirect(`/dashboard/clientes/${clientId}`);

  // Verify client belongs to this barbershop
  const { data: clientCheck } = await db
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  if (!clientCheck) redirect("/dashboard/clientes");

  // Get or create loyalty card
  const { data: existingCard } = await db
    .from("loyalty_cards")
    .select("id, current_stamps")
    .eq("barbershop_id", barbershopId)
    .eq("program_id", programId)
    .eq("client_id", clientId)
    .maybeSingle();

  let cardId: string;
  let currentStamps: number;

  if (existingCard) {
    cardId = existingCard.id;
    currentStamps = existingCard.current_stamps ?? 0;
  } else {
    const { data: newCard, error: cardError } = await db
      .from("loyalty_cards")
      .insert({
        barbershop_id: barbershopId,
        program_id: programId,
        client_id: clientId,
        current_stamps: 0,
        redeemed_count: 0,
      })
      .select("id, current_stamps")
      .single();

    if (cardError || !newCard) redirect(`/dashboard/clientes/${clientId}`);
    cardId = newCard.id;
    currentStamps = 0;
  }

  // Insert stamp record
  await db.from("loyalty_stamps").insert({
    barbershop_id: barbershopId,
    program_id: programId,
    card_id: cardId,
    client_id: clientId,
    appointment_id: null,
    added_by: "manual",
    notes,
  });

  // Update card stamp count
  await db
    .from("loyalty_cards")
    .update({ current_stamps: currentStamps + 1 })
    .eq("id", cardId)
    .eq("barbershop_id", barbershopId);

  revalidatePath(`/dashboard/clientes/${clientId}`);
  revalidatePath("/dashboard/fidelizacion");
  redirect(`/dashboard/clientes/${clientId}`);
}

export async function redeemRewardAction(formData: FormData) {
  const { barbershopId } = await getAuthContext();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const cardId = String(formData.get("card_id") ?? "").trim();

  if (!clientId || !cardId) redirect("/dashboard/clientes");

  const db = createServiceRoleClient();

  // Verify card belongs to barbershop + get current state
  const { data: card } = await db
    .from("loyalty_cards")
    .select("id, current_stamps, redeemed_count, program_id")
    .eq("id", cardId)
    .eq("barbershop_id", barbershopId)
    .eq("client_id", clientId)
    .maybeSingle();

  if (!card) redirect(`/dashboard/clientes/${clientId}`);

  const { data: program } = await db
    .from("loyalty_programs")
    .select("stamps_required, reward_description")
    .eq("id", card.program_id)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  if (!program) redirect(`/dashboard/clientes/${clientId}`);
  if ((card.current_stamps ?? 0) < program.stamps_required)
    redirect(`/dashboard/clientes/${clientId}`);

  // Record redemption
  await db.from("loyalty_redemptions").insert({
    barbershop_id: barbershopId,
    card_id: cardId,
    client_id: clientId,
    program_id: card.program_id,
    reward_description: program.reward_description,
    redeemed_at: new Date().toISOString(),
  });

  // Reset stamps, increment redeemed count
  await db
    .from("loyalty_cards")
    .update({
      current_stamps: 0,
      redeemed_count: (card.redeemed_count ?? 0) + 1,
    })
    .eq("id", cardId)
    .eq("barbershop_id", barbershopId);

  revalidatePath(`/dashboard/clientes/${clientId}`);
  revalidatePath("/dashboard/fidelizacion");
  redirect(`/dashboard/clientes/${clientId}`);
}
