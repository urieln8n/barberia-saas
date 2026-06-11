"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { sendWaitlistNotification } from "@/src/lib/email/send-waitlist-notification";

const ALLOWED_STATUS = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;

type AllowedStatus = (typeof ALLOWED_STATUS)[number];

function isAllowedStatus(s: string): s is AllowedStatus {
  return ALLOWED_STATUS.includes(s as AllowedStatus);
}

async function getAuthContext() {
  const authClient = await createServerClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(authClient, user.id);
  if (!barbershopId) redirect("/onboarding");

  return { barbershopId };
}

export async function updateReservationStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  if (!id || !isAllowedStatus(status)) {
    return { success: false, error: "Parámetros inválidos" };
  }

  const { barbershopId } = await getAuthContext();

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .eq("barbershop_id", barbershopId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/agenda");
  revalidatePath("/dashboard/reservas");
  revalidatePath("/dashboard/reservas/pipeline");

  if (status === "cancelled") {
    notifyWaitlist(id, barbershopId).catch((err) => {
      console.error("[waitlist] Error notificando lista de espera:", err);
    });
  }

  return { success: true };
}

async function notifyWaitlist(
  appointmentId: string,
  barbershopId: string
): Promise<void> {
  const supabase = createServiceRoleClient();

  const [{ data: appt }, { data: barbershop }] = await Promise.all([
    supabase
      .from("appointments")
      .select("appointment_date")
      .eq("id", appointmentId)
      .maybeSingle(),
    supabase
      .from("barbershops")
      .select("name, slug")
      .eq("id", barbershopId)
      .maybeSingle(),
  ]);

  if (!appt?.appointment_date || !barbershop) return;

  // biome-ignore lint: waitlist_entries not yet in generated types
  const { data: entries } = await (supabase as any)
    .from("waitlist_entries")
    .select("id, client_name, client_email")
    .eq("barbershop_id", barbershopId)
    .eq("preferred_date", appt.appointment_date)
    .is("notified_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(3);

  if (!entries?.length) return;

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://barberiaos.com";

  const ids: string[] = [];
  for (const entry of entries as { id: string; client_name: string; client_email: string }[]) {
    await sendWaitlistNotification({
      clientName:     entry.client_name,
      clientEmail:    entry.client_email,
      barbershopName: barbershop.name,
      barbershopSlug: barbershop.slug,
      availableDate:  appt.appointment_date,
      appUrl,
    });
    ids.push(entry.id);
  }

  // biome-ignore lint: waitlist_entries not yet in generated types
  await (supabase as any)
    .from("waitlist_entries")
    .update({ notified_at: new Date().toISOString() })
    .in("id", ids);
}

export type ReservationDetail = {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AllowedStatus;
  notes: string | null;
  source: string | null;
  created_at: string;
  client: {
    id: string;
    name: string;
    phone: string | null;
    visit_count: number;
    last_visit_at: string | null;
    no_show_count: number;
  } | null;
  service: {
    id: string;
    name: string;
    price: number;
    duration_minutes: number;
  } | null;
  barber: {
    id: string;
    name: string;
  } | null;
};

export async function getReservationById(
  id: string
): Promise<{ data: ReservationDetail | null; error?: string }> {
  if (!id) return { data: null, error: "ID requerido" };

  const { barbershopId } = await getAuthContext();

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      start_time,
      end_time,
      status,
      notes,
      source,
      created_at,
      clients (id, name, phone, visit_count, last_visit_at, no_show_count),
      services (id, name, price, duration_minutes),
      barbers (id, name)
    `
    )
    .eq("id", id)
    .eq("barbershop_id", barbershopId)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "No encontrada" };
  }

  function firstOf<T>(val: T | T[] | null | undefined): T | null {
    if (!val) return null;
    return Array.isArray(val) ? (val[0] ?? null) : val;
  }

  const rawClient = firstOf(
    data.clients as
      | { id: string; name: string; phone: string | null; visit_count: number; last_visit_at: string | null; no_show_count: number }
      | { id: string; name: string; phone: string | null; visit_count: number; last_visit_at: string | null; no_show_count: number }[]
      | null
  );
  const rawService = firstOf(
    data.services as
      | { id: string; name: string; price: number; duration_minutes: number }
      | { id: string; name: string; price: number; duration_minutes: number }[]
      | null
  );
  const rawBarber = firstOf(
    data.barbers as
      | { id: string; name: string }
      | { id: string; name: string }[]
      | null
  );

  return {
    data: {
      id: data.id,
      appointment_date: data.appointment_date,
      start_time: data.start_time,
      end_time: data.end_time,
      status: isAllowedStatus(data.status ?? "") ? (data.status as AllowedStatus) : "scheduled",
      notes: data.notes,
      source: data.source,
      created_at: data.created_at,
      client: rawClient
        ? {
            id: rawClient.id,
            name: rawClient.name,
            phone: rawClient.phone,
            visit_count: rawClient.visit_count ?? 0,
            last_visit_at: rawClient.last_visit_at,
            no_show_count: rawClient.no_show_count ?? 0,
          }
        : null,
      service: rawService
        ? {
            id: rawService.id,
            name: rawService.name,
            price: rawService.price ?? 0,
            duration_minutes: rawService.duration_minutes ?? 0,
          }
        : null,
      barber: rawBarber ? { id: rawBarber.id, name: rawBarber.name } : null,
    },
  };
}
