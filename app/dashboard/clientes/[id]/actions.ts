"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

async function getContext() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);

  if (!barbershopId) {
    redirect("/onboarding");
  }

  return { supabase, barbershopId };
}

export async function saveClientCrmAction(formData: FormData) {
  const { barbershopId } = await getContext();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const preferences = String(formData.get("preferences") ?? "").trim();
  const favoriteBarberId = String(formData.get("favorite_barber_id") ?? "").trim();

  if (!clientId) {
    redirect("/dashboard/clientes");
  }

  const supabase = createServiceRoleClient();

  if (favoriteBarberId) {
    const { data: barber } = await supabase
      .from("barbers")
      .select("id")
      .eq("id", favoriteBarberId)
      .eq("barbershop_id", barbershopId)
      .maybeSingle();

    if (!barber) {
      redirect(`/dashboard/clientes/${clientId}`);
    }
  }

  await supabase
    .from("clients")
    .update({
      notes: notes || null,
      preferences: preferences || null,
      favorite_barber_id: favoriteBarberId || null,
    })
    .eq("id", clientId)
    .eq("barbershop_id", barbershopId);

  revalidatePath(`/dashboard/clientes/${clientId}`);
  revalidatePath("/dashboard/clientes");
  redirect(`/dashboard/clientes/${clientId}`);
}

export async function createCustomerReviewAction(formData: FormData) {
  const { barbershopId } = await getContext();
  const clientId = String(formData.get("client_id") ?? "").trim();

  if (!clientId) {
    redirect("/dashboard/clientes");
  }

  const supabase = createServiceRoleClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name")
    .eq("id", clientId)
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  if (!client) {
    redirect("/dashboard/clientes");
  }

  const { data: booking } = await supabase
    .from("appointments")
    .select("id")
    .eq("client_id", clientId)
    .eq("barbershop_id", barbershopId)
    .order("appointment_date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      business_id: barbershopId,
      booking_id: booking?.id ?? null,
      customer_id: clientId,
      source: "customer_detail",
      status: "pending",
      is_public: false,
    })
    .select("public_token")
    .maybeSingle();

  if (error || !review) {
    redirect(`/dashboard/clientes/${clientId}`);
  }

  revalidatePath("/dashboard/resenas");
  redirect(`/review/${review.public_token}`);
}
