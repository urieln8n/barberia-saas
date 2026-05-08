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

  const planUsage = await getBarbershopPlanUsage(supabase, barbershopId);

  return (
    <BarberosClient
      barbers={barbers ?? []}
      barbershopId={barbershopId}
      planUsage={planUsage}
    />
  );
}
