import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { PagosClient } from "./PagosClient";

export default async function PagosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = new Date().toISOString().split("T")[0];

  const [{ data: payments }, { data: clients }] = await Promise.all([
    supabase
      .from("payments")
      .select("id, amount, method, notes, status, created_at, clients(name)")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .order("created_at", { ascending: false }),
    supabase
      .from("clients")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .order("name", { ascending: true }),
  ]);

  return (
    <PagosClient
      payments={(payments as any) ?? []}
      clients={clients ?? []}
      barbershopId={barbershopId}
    />
  );
}
