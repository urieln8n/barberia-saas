import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { BarberiaOSKitClient } from "./BarberiaOSKitClient";

export default async function BarberiaOSKitPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("name, slug")
    .eq("id", barbershopId)
    .single();

  if (!barbershop) redirect("/onboarding");

  const [{ count: servicesCount }, { count: barbersCount }, { count: appointmentsCount }] =
    await Promise.all([
      supabase
        .from("services")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId),
      supabase
        .from("barbers")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId),
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("barbershop_id", barbershopId),
    ]);

  return (
    <BarberiaOSKitClient
      name={barbershop.name}
      slug={barbershop.slug}
      servicesCount={servicesCount ?? 0}
      barbersCount={barbersCount ?? 0}
      appointmentsCount={appointmentsCount ?? 0}
    />
  );
}
