import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { AgendaClient } from "./AgendaClient";

type Props = { searchParams: { fecha?: string } };

export default async function AgendaPage({ searchParams }: Props) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const fecha = searchParams.fecha ?? new Date().toISOString().split("T")[0];

  const [
    { data: appointments },
    { data: clients },
    { data: services },
    { data: barbers },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, start_time, end_time, status, notes, clients(name, phone), services(name, price), barbers(name)")
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", fecha)
      .order("start_time", { ascending: true }),
    supabase
      .from("clients")
      .select("id, name, phone")
      .eq("barbershop_id", barbershopId)
      .order("name", { ascending: true }),
    supabase
      .from("services")
      .select("id, name, price, duration_minutes")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),
    supabase
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),
  ]);

  return (
    <AgendaClient
      appointments={(appointments as any) ?? []}
      clients={clients ?? []}
      services={services ?? []}
      barbers={barbers ?? []}
      barbershopId={barbershopId}
      fecha={fecha}
    />
  );
}
