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

  // Citas de hoy con status activo (scheduled, confirmed, pending)
  const today = new Date().toISOString().split("T")[0];
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id,
      start_time,
      end_time,
      status,
      notes,
      clients ( id, name, phone ),
      services ( id, name, duration_minutes, price ),
      barbers ( id, name )
    `)
    .eq("barbershop_id", barbershopId)
    .eq("appointment_date", today)
    .in("status", ["scheduled", "confirmed", "completed"])
    .order("start_time", { ascending: true });

  return <SalaEsperaClient appointments={appointments ?? []} />;
}
