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

  // image_url disponible tras migración 035 — cast necesario hasta regenerar tipos
  const { data: services } = await (supabase as any)
    .from("services")
    .select("id, name, description, price, duration_minutes, active, image_url")
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
