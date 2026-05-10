import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getBarbershopPlanUsage } from "@/src/lib/plans/limits";
import { ServiciosClient } from "./ServiciosClient";

export default async function ServiciosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: services } = await supabase
    .from("services")
    .select("id, name, description, price, duration_minutes, active")
    .eq("barbershop_id", barbershopId)
    .order("created_at", { ascending: true });

  const planUsage = await getBarbershopPlanUsage(supabase, barbershopId);

  return (
    <ServiciosClient
      services={services ?? []}
      barbershopId={barbershopId}
      planUsage={planUsage}
    />
  );
}
