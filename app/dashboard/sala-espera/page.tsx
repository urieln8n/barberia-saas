import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { SalaEsperaClient } from "./SalaEsperaClient";

export default async function SalaEsperaPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = new Date().toISOString().split("T")[0];

  const [
    { data: appointments },
    { data: waitlistEntries },
    { data: services },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        clients  ( id, name, phone ),
        services ( id, name, duration_minutes, price ),
        barbers  ( id, name )
      `)
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today)
      .in("status", ["scheduled", "confirmed", "completed"])
      .order("start_time", { ascending: true }),

    (supabase as any)
      .from("waitlist_entries")
      .select(
        "id, client_name, client_email, client_phone, preferred_date, service_id, notified_at, expires_at, created_at"
      )
      .eq("barbershop_id", barbershopId)
      .gte("expires_at", new Date().toISOString())
      .order("preferred_date", { ascending: true }),

    supabase
      .from("services")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .order("name"),
  ]);

  return (
    <SalaEsperaClient
      appointments={appointments ?? []}
      waitlistEntries={waitlistEntries ?? []}
      services={services ?? []}
    />
  );
}
