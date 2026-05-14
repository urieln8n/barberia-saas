import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import {
  canAccessGrowth,
  canAccessGrowthAds,
  canAccessWhatsappIA,
  getBarbershopPlanUsage,
} from "@/src/lib/plans/limits";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GrowthEngineClient } from "./GrowthEngineClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Growth Engine | BarberíaOS",
  description: "Convierte Instagram, WhatsApp y campañas en reservas reales.",
};

type BarbershopRow = {
  name: string | null;
  slug: string | null;
  phone: string | null;
  city: string | null;
};

export default async function GrowthPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const [{ data: barbershop }, planUsage] = await Promise.all([
    supabase
      .from("barbershops")
      .select("name, slug, phone, city")
      .eq("id", barbershopId)
      .maybeSingle(),
    getBarbershopPlanUsage(supabase, barbershopId),
  ]);

  const shop = barbershop as BarbershopRow | null;
  const bookingUrl = shop?.slug ? `${getConfiguredSiteUrl()}/r/${shop.slug}` : null;
  const hasAccess = canAccessGrowth(planUsage.plan);

  return (
    <div className="space-y-5">
      <PageHeader
        section="Growth Engine"
        title="BarberíaOS Growth Engine"
        description="Convierte Instagram, WhatsApp y campañas en reservas reales."
      />

      <GrowthEngineClient
        hasAccess={hasAccess}
        planLabel={planUsage.label}
        canAccessAds={canAccessGrowthAds(planUsage.plan)}
        canAccessWhatsappIA={canAccessWhatsappIA(planUsage.plan)}
        barbershopName={shop?.name ?? null}
        instagramUsername={null}
        whatsapp={shop?.phone ?? null}
        bookingUrl={bookingUrl}
        city={shop?.city ?? null}
      />
    </div>
  );
}
