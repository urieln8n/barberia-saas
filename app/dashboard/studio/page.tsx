import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { StudioClient } from "./StudioClient";
import { MediaEnhanceClient } from "./MediaEnhanceClient";
import type { CampaignType } from "@/lib/studio/generate-content";

export const metadata: Metadata = {
  title: "Studio IA — BarberíaOS",
  description: "Genera anuncios virales que llenan tu agenda.",
};

export const dynamic = "force-dynamic";

// Deep-link query params → campaign type mapping
const QUERY_CAMPAIGN_MAP: Record<string, CampaignType> = {
  fill_empty_slots: "llenar_agenda",
  service_promo:    "oferta_flash",
  review_video:     "prueba_social",
  product_promo:    "nuevo_servicio",
  lost_clients:     "recuperar_cliente",
  urgency:          "urgencia_reserva",
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const activeTab = typeof searchParams?.tab === "string" ? searchParams.tab : "generate";
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const [barbershopResult, barbersResult] = await Promise.all([
    supabase.from("barbershops").select("id, name").eq("id", barbershopId).maybeSingle(),
    supabase.from("barbers").select("id, name").eq("barbershop_id", barbershopId).eq("active", true),
  ]);

  const barbershop = barbershopResult.data;
  const barbers = ((barbersResult.data ?? []) as unknown) as { id: string; name: string }[];

  // biome-ignore lint: studio_credit_wallets not yet in generated types
  const walletResult = await (supabase as any)
    .from("studio_credit_wallets")
    .select("current_credits, monthly_credits, extra_credits")
    .eq("barbershop_id", barbershopId)
    .maybeSingle();

  let studioCredits = { current: 0, monthly: 1, extra: 0, plan: "Starter" };
  if (walletResult.data) {
    studioCredits = {
      current: walletResult.data.current_credits,
      monthly: walletResult.data.monthly_credits,
      extra:   walletResult.data.extra_credits,
      plan:    "Growth",
    };
  } else if (!walletResult.error) {
    // biome-ignore lint: studio_credit_wallets not yet in generated types
    await (supabase as any).from("studio_credit_wallets").upsert(
      { barbershop_id: barbershopId, current_credits: 1, monthly_credits: 1, extra_credits: 0 },
      { onConflict: "barbershop_id" }
    );
    studioCredits = { current: 1, monthly: 1, extra: 0, plan: "Starter" };
  }

  const rawType = typeof searchParams?.type === "string" ? searchParams.type : undefined;
  const initialCampaign: CampaignType | undefined = rawType ? QUERY_CAMPAIGN_MAP[rawType] : undefined;

  const isEnhance = activeTab === "enhance";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Tab bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl gap-1 px-4 py-2">
          <Link
            href="/dashboard/studio?tab=generate"
            className={`rounded-xl px-4 py-2 text-sm font-black transition-colors ${
              !isEnhance
                ? "bg-violet-600 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            🎬 Generar anuncio
          </Link>
          <Link
            href="/dashboard/studio?tab=enhance"
            className={`rounded-xl px-4 py-2 text-sm font-black transition-colors ${
              isEnhance
                ? "bg-violet-600 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            ✨ Mejorar contenido
          </Link>
        </div>
      </div>

      {isEnhance ? (
        <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">Studio IA</p>
            <h1 className="mt-1 text-2xl font-black text-slate-900">Mejorar contenido</h1>
            <p className="mt-1 text-sm text-slate-500">
              Sube fotos o vídeos del móvil y obtén piezas profesionales listas para publicar.
            </p>
          </div>
          <MediaEnhanceClient studioCredits={studioCredits} />
        </div>
      ) : (
        <StudioClient
          barbershopName={barbershop?.name ?? "Mi Barbería"}
          barbers={barbers}
          studioCredits={studioCredits}
          initialCampaign={initialCampaign}
        />
      )}
    </div>
  );
}
