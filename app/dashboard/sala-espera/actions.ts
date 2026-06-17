"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { sendWaitlistNotification } from "@/src/lib/email/send-waitlist-notification";

async function getAuthContext() {
  const authClient = await createClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();
  if (error || !user) redirect("/login");
  const barbershopId = await getCurrentBarbershopId(authClient, user.id);
  if (!barbershopId) redirect("/onboarding");
  return { barbershopId };
}

export async function addToWaitlist(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const { barbershopId } = await getAuthContext();

  const clientName    = (formData.get("client_name")    as string)?.trim();
  const clientEmail   = (formData.get("client_email")   as string)?.trim();
  const clientPhone   = (formData.get("client_phone")   as string)?.trim() || null;
  const preferredDate = (formData.get("preferred_date") as string)?.trim();
  const serviceId     = (formData.get("service_id")     as string)?.trim() || null;

  if (!clientName || !clientEmail || !preferredDate) {
    return { success: false, error: "Nombre, email y fecha son obligatorios" };
  }

  const supabase = createServiceRoleClient();
  const { error } = await (supabase as any)
    .from("waitlist_entries")
    .insert({
      barbershop_id:  barbershopId,
      client_name:    clientName,
      client_email:   clientEmail,
      client_phone:   clientPhone,
      preferred_date: preferredDate,
      service_id:     serviceId,
    });

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/sala-espera");
  return { success: true };
}

export async function removeFromWaitlist(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { barbershopId } = await getAuthContext();

  const supabase = createServiceRoleClient();
  const { error } = await (supabase as any)
    .from("waitlist_entries")
    .delete()
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/sala-espera");
  return { success: true };
}

export async function notifyWaitlistEntry(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { barbershopId } = await getAuthContext();

  const supabase = createServiceRoleClient();

  const { data: entry, error: fetchError } = await (supabase as any)
    .from("waitlist_entries")
    .select(`
      id,
      client_name,
      client_email,
      preferred_date,
      barbershops!inner ( name, slug )
    `)
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
    .single();

  if (fetchError || !entry) {
    return { success: false, error: "Entrada no encontrada" };
  }

  const barbershop = Array.isArray(entry.barbershops)
    ? entry.barbershops[0]
    : entry.barbershops;

  await sendWaitlistNotification({
    clientName:     entry.client_name,
    clientEmail:    entry.client_email,
    barbershopName: (barbershop as { name?: string } | null)?.name ?? "",
    barbershopSlug: (barbershop as { slug?: string } | null)?.slug ?? "",
    availableDate:  entry.preferred_date,
    appUrl:
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://barberiaos.com",
  });

  await (supabase as any)
    .from("waitlist_entries")
    .update({ notified_at: new Date().toISOString() })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  revalidatePath("/dashboard/sala-espera");
  return { success: true };
}
