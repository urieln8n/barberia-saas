import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Store,
  ShoppingBag,
  ArrowRight,
  Eye,
  CalendarCheck,
  MessageCircle,
  Navigation,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { SITE_URL } from "@/src/lib/site-url";
import { PageHeader } from "@/components/ui/PageHeader";
import { MarketplaceClient, type PublicProfile } from "./MarketplaceClient";

export const metadata: Metadata = {
  title: "Marketplace | BarberíaOS",
  description: "Configura tu perfil público y aparece en el marketplace de BarberíaOS.",
};

type EventCounts = {
  profile_view:    number;
  booking_click:   number;
  whatsapp_click:  number;
  directions_click: number;
};

export default async function MarketplacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    { data: profileRow },
    { data: barbershop },
    { data: eventsRaw },
    { data: subscription },
  ] = await Promise.all([
    supabase
      .from("barbershop_public_profiles")
      .select(
        "id, slug, public_name, city, neighborhood, address, phone, whatsapp, instagram, website_url, description, cover_image_url, logo_url, is_published, marketplace_enabled, featured, latitude, longitude, google_maps_url, map_visible"
      )
      .eq("barbershop_id", barbershopId)
      .maybeSingle(),
    supabase
      .from("barbershops")
      .select("name, slug, city")
      .eq("id", barbershopId)
      .single(),
    supabase
      .from("marketplace_events")
      .select("event_type")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("subscriptions")
      .select("plan_name, status")
      .eq("barbershop_id", barbershopId)
      .in("status", ["active", "trial"])
      .maybeSingle(),
  ]);

  const profile = profileRow as (PublicProfile & { featured?: boolean }) | null;

  const defaultSlug = barbershop?.slug
    ? barbershop.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    : "";

  // Aggregate event counts
  const events = (eventsRaw ?? []) as { event_type: string }[];
  const eventCounts: EventCounts = {
    profile_view:    events.filter((e) => e.event_type === "profile_view").length,
    booking_click:   events.filter((e) => e.event_type === "booking_click").length,
    whatsapp_click:  events.filter((e) => e.event_type === "whatsapp_click").length,
    directions_click: events.filter((e) => e.event_type === "directions_click").length,
  };

  const planName = subscription?.plan_name ?? "starter";
  const isPremiumPlan = planName === "premium" || planName === "custom";
  const isGrowthOrAbove = planName === "growth" || isPremiumPlan;
  const hasAnalyticsData = Object.values(eventCounts).some((v) => v > 0);
  const showAnalytics = profile?.marketplace_enabled || hasAnalyticsData;

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow="Marketplace"
        title="Perfil público"
        description="Gestiona tu enlace privado de reservas y, si lo deseas, activa tu presencia en el directorio local para que nuevos clientes te encuentren."
      />

      {/* Two-layer explanation */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#C9922A]">Tu página privada</p>
          <p className="mt-2 font-black text-[#080A0F]">/r/tu-barberia</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Página exclusiva de tu barbería. Tus clientes solo ven tus servicios, barberos y botón de reserva.
            Ningún competidor aparece aquí. Siempre activa cuando publicas tu perfil.
          </p>
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Directorio local · Opcional</p>
          <p className="mt-2 font-black text-[#080A0F]">/barberias</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Aparece en búsquedas locales por ciudad y barrio para captar clientes nuevos.
            Puedes activarlo o desactivarlo en cualquier momento — no afecta a tu enlace privado.
          </p>
        </div>
      </div>

      {!profile && (
        <div className="rounded-[24px] border border-[#D5A84C]/30 bg-gradient-to-br from-[#D5A84C]/5 to-[#2563EB]/5 p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#D5A84C]/15">
              <ShoppingBag size={20} className="text-[#8A641F]" />
            </div>
            <div className="flex-1">
              <h2 className="font-black text-[#080A0F]">Sin perfil público todavía</h2>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Crea tu perfil público para que los clientes puedan reservar desde tu
                enlace, el QR de tu local, Instagram o el marketplace de BarberíaOS.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                {[
                  "Enlace de reservas propio",
                  "QR para imprimir",
                  "Visible en /barberias",
                  "Filtros por ciudad",
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-3 py-1 font-semibold text-[#8A641F]"
                  >
                    <ArrowRight size={10} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {profile && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Estado" value={profile.is_published ? "Publicado" : "Borrador"} active={profile.is_published} />
          <Stat label="Marketplace" value={profile.marketplace_enabled ? "Activo" : "Inactivo"} active={profile.marketplace_enabled} />
          <Stat label="URL pública" value={`/r/${profile.slug}`} mono />
        </div>
      )}

      {/* ── Analytics: últimos 30 días ──────────────────────────────────── */}
      {profile && showAnalytics && (
        <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D5A84C]/10">
                <TrendingUp size={14} className="text-[#8A641F]" />
              </div>
              <p className="font-black text-[#080A0F]">Actividad del perfil</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">
              Últimos 30 días
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <EventStat
              icon={Eye}
              label="Visitas"
              value={eventCounts.profile_view}
              color="blue"
            />
            <EventStat
              icon={CalendarCheck}
              label="Clics en Reservar"
              value={eventCounts.booking_click}
              color="green"
            />
            <EventStat
              icon={MessageCircle}
              label="Clics WhatsApp"
              value={eventCounts.whatsapp_click}
              color="emerald"
            />
            <EventStat
              icon={Navigation}
              label="Cómo llegar"
              value={eventCounts.directions_click}
              color="gold"
            />
          </div>

          {!hasAnalyticsData && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Aún no hay datos. Los eventos se registran cuando los clientes visitan tu perfil público.
            </p>
          )}
        </section>
      )}

      {/* ── Upgrade CTA ─────────────────────────────────────────────────── */}
      {profile?.marketplace_enabled && !profile?.featured && !isPremiumPlan && (
        <div className="rounded-[20px] border border-[#D5A84C]/30 bg-gradient-to-br from-[#D5A84C]/5 to-transparent p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D5A84C]/15">
              <Sparkles size={16} className="text-[#8A641F]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-[#080A0F]">Destaca tu barbería</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Las barberías <strong>Destacadas</strong> aparecen primero en el directorio y en el mapa,
                con una estrella dorada que atrae más clics.
                {!isGrowthOrAbove && " Disponible en los planes Growth y Premium."}
              </p>
              <a
                href="/#precios"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[#D5A84C]/40 bg-[#D5A84C]/10 px-3 py-1.5 text-xs font-bold text-[#8A641F] transition hover:bg-[#D5A84C]/20"
              >
                Ver planes
                <ChevronRight size={12} />
              </a>
            </div>
          </div>
        </div>
      )}

      <MarketplaceClient
        profile={profile}
        defaultSlug={defaultSlug}
        siteUrl={SITE_URL}
      />

    </div>
  );
}

function Stat({
  label,
  value,
  active,
  mono,
}: {
  label: string;
  value: string;
  active?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p
        className={`mt-1 text-sm font-black ${
          mono
            ? "font-mono text-slate-600"
            : active === true
            ? "text-emerald-600"
            : active === false
            ? "text-slate-400"
            : "text-[#080A0F]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EventStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "blue" | "green" | "emerald" | "gold";
}) {
  const colorMap = {
    blue:    "bg-blue-50 text-blue-600",
    green:   "bg-green-50 text-green-600",
    emerald: "bg-emerald-50 text-emerald-600",
    gold:    "bg-[#D5A84C]/10 text-[#8A641F]",
  };

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${colorMap[color]}`}>
        <Icon size={14} />
      </div>
      <p className="text-2xl font-black tabular-nums text-[#080A0F]">{value}</p>
      <p className="text-[10px] font-semibold leading-tight text-slate-500">{label}</p>
    </div>
  );
}
