import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { StudioClient } from "./StudioClient";
import type { ContentType } from "@/lib/studio/generate-content";

export const metadata: Metadata = {
  title: "Studio IA — BarberíaOS",
  description: "Crea reels, ofertas y campañas para llenar tu agenda con IA.",
};

export const dynamic = "force-dynamic";

// Query param → ContentType mapping
const QUERY_TYPE_MAP: Record<string, ContentType> = {
  fill_empty_slots: "llenar_huecos",
  service_promo:    "corte_premium",
  review_video:     "resena_cliente",
  product_promo:    "producto_destacado",
  lost_clients:     "recuperar_clientes",
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
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

  // Resolve initial state from query params
  const rawType   = typeof searchParams?.type        === "string" ? searchParams.type        : undefined;
  const rawSvcId  = typeof searchParams?.serviceId   === "string" ? searchParams.serviceId   : undefined;
  const rawSvcNm  = typeof searchParams?.serviceName === "string" ? searchParams.serviceName : undefined;
  const rawRevId  = typeof searchParams?.reviewId    === "string" ? searchParams.reviewId    : undefined;

  const initialType: ContentType | undefined = rawType ? QUERY_TYPE_MAP[rawType] : undefined;
  const initialServiceName = rawSvcNm ?? (rawSvcId ? services.find(s => s.id === rawSvcId)?.name : undefined);

  return (
    <StudioClient
      barbershopName={barbershop?.name ?? "Mi Barbería"}
      barbers={barbers}
      services={services}
      products={products}
      studioCredits={studioCredits}
      initialType={initialType}
      initialServiceName={initialServiceName}
      initialReviewId={rawRevId}
    />
  );
}
