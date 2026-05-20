import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getBarbershopPlanUsage } from "@/src/lib/plans/limits";
import { BarberosClient } from "./BarberosClient";

export default async function BarberosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: barbers } = await supabase
    .from("barbers")
    .select("id, name, phone, active")
    .eq("barbershop_id", barbershopId)
    .order("created_at", { ascending: true });

  const [{ data: schedules }, { data: closures }] = await Promise.all([
    supabase
      .from("barber_schedules")
      .select("id, barber_id, weekday, start_time, end_time, active")
      .eq("barbershop_id", barbershopId)
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true }),
    supabase
      .from("barbershop_closures")
      .select("id, closure_date, start_time, end_time, reason")
      .eq("barbershop_id", barbershopId)
      .gte("closure_date", new Date().toISOString().slice(0, 10))
      .order("closure_date", { ascending: true })
      .limit(12),
  ]);

  const planUsage = await getBarbershopPlanUsage(supabase, barbershopId);

  return (
    <BarberosClient
      barbers={barbers ?? []}
      schedules={schedules ?? []}
      closures={closures ?? []}
      barbershopId={barbershopId}
      planUsage={planUsage}
    />
  );
}
