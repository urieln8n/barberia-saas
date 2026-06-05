import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { StudioClient } from "./StudioClient";

export const metadata: Metadata = {
  title: "Studio IA — BarberíaOS",
  description: "Crea reels, ofertas y campañas para llenar tu agenda con IA.",
};

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const [barbershopResult, barbersResult, servicesResult] = await Promise.all([
    supabase.from("barbershops").select("id, name, slug, city, phone").eq("id", barbershopId).maybeSingle(),
    supabase.from("barbers").select("id, name").eq("barbershop_id", barbershopId).eq("active", true),
    supabase.from("services").select("id, name, price").eq("barbershop_id", barbershopId).eq("active", true),
  ]);

  // products table may not exist yet — query safely with unknown cast
  let products: { id: string; name: string }[] = [];
  try {
    // biome-ignore lint: products table may not be in generated types yet
    const prodResult = await (supabase as any).from("products").select("id, name").eq("barbershop_id", barbershopId).eq("active", true).limit(20); // eslint-disable-line
    if (prodResult.data) products = prodResult.data as { id: string; name: string }[];
  } catch {
    // table not yet available — no-op
  }

  const barbershop = barbershopResult.data;
  const barbers = ((barbersResult.data ?? []) as unknown) as { id: string; name: string }[];
  const services = ((servicesResult.data ?? []) as unknown) as { id: string; name: string; price: number | null }[];

  // Mock credits — TODO: replace with real wallet query once table exists
  const studioCredits = { current: 5, monthly: 5, extra: 0, plan: "Growth" };

  return (
    <StudioClient
      barbershopName={barbershop?.name ?? "Mi Barbería"}
      barbers={barbers}
      services={services}
      products={products}
      studioCredits={studioCredits}
    />
  );
}
