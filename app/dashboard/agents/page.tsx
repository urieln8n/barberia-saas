import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { AgentsClient } from "./AgentsClient";

export const dynamic = "force-dynamic";

function getLocalDateISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default async function AgentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = getLocalDateISO();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [barbershopResult, lostClientsResult, todayApptsResult, activeBarbersResult] =
    await Promise.all([
      supabase
        .from("barbershops")
        .select("id, name, slug")
        .eq("id", barbershopId)
        .maybeSingle(),
      supabase
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId)
        .not("last_visit_at", "is", null)
        .lt("last_visit_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId)
        .eq("appointment_date", today)
        .in("status", ["scheduled", "confirmed"]),
      supabase
        .from("barbers")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId)
        .eq("active", true),
    ]);

  return (
    <AgentsClient
      barbershopName={barbershopResult.data?.name ?? null}
      barbershopSlug={barbershopResult.data?.slug ?? null}
      lostClientsCount={lostClientsResult.count ?? 0}
      todayAppointmentsCount={todayApptsResult.count ?? 0}
      activeBarbersCount={activeBarbersResult.count ?? 0}
    />
  );
}
