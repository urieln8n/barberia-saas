import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { ClientesClient } from "./ClientesClient";

export default async function ClientesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, phone, email, notes, last_visit_at")
    .eq("barbershop_id", barbershopId)
    .order("name", { ascending: true });

  return (
    <ClientesClient
      clients={clients ?? []}
      barbershopId={barbershopId}
    />
  );
}
