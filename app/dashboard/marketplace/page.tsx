import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { SITE_URL } from "@/src/lib/site-url";
import { MarketplaceClient, type MarketplacePageData, type PublicProfile } from "./MarketplaceClient";

export const metadata: Metadata = {
  title: "Perfil público y visibilidad local | BarberíaOS",
  description: "Gestiona tu enlace de reservas, QR, WhatsApp y presencia local en BarberíaOS.",
  robots: {
    index: false,
    follow: false,
  },
};

type EventCounts = {
  profile_view: number;
  booking_click: number;
  whatsapp_click: number;
  directions_click: number;
};

type HealthItem = {
  label: string;
  done: boolean;
  action: string;
};

type ServiceRow = {
  id: string;
  name: string;
  price: number | string | null;
  active: boolean | null;
};

type BarberRow = {
  id: string;
  name: string;
  active: boolean | null;
};

type BarbershopRow = {
  name: string;
  slug: string;
  city: string | null;
  phone: string | null;
  address: string | null;
  instagram_url: string | null;
  google_business_url: string | null;
  google_review_url: string | null;
  public_booking_enabled: boolean | null;
};

function normalizeSlug(value: string | null | undefined) {
  return value ? value.toLowerCase().replace(/[^a-z0-9-]/g, "-") : "";
}

function buildProfileHealth({
  profile,
  barbershop,
  services,
  barbers,
}: {
  profile: PublicProfile | null;
  barbershop: BarbershopRow | null;
  services: ServiceRow[];
  barbers: BarberRow[];
}) {
  const activeServicesWithPrice = services.filter((service) => {
    const price = Number(service.price ?? 0);
    return service.active !== false && price > 0;
  });
  const activeBarbers = barbers.filter((barber) => barber.active !== false);

  const items: HealthItem[] = [
    {
      label: "Nombre de barbería completo",
      done: Boolean(profile?.public_name || barbershop?.name),
      action: "Revisa el nombre público del perfil.",
    },
    {
      label: "Ciudad configurada",
      done: Boolean(profile?.city || barbershop?.city),
      action: "Añade la ciudad para aparecer en búsquedas locales.",
    },
    {
      label: "Barrio o zona configurada",
      done: Boolean(profile?.neighborhood),
      action: "Añade el barrio para que te encuentren mejor.",
    },
    {
      label: "Teléfono o WhatsApp configurado",
      done: Boolean(profile?.whatsapp || profile?.phone || barbershop?.phone),
      action: "Añade WhatsApp para recibir consultas directas.",
    },
    {
      label: "Servicios activos con precio",
      done: activeServicesWithPrice.length > 0,
      action: "Publica servicios activos con precio visible.",
    },
    {
      label: "Barberos activos",
      done: activeBarbers.length > 0,
      action: "Activa al menos un barbero para reservas.",
    },
    {
      label: "Horarios completos",
      done: false,
      action: "Conecta horarios públicos en una siguiente fase.",
    },
    {
      label: "Foto de portada",
      done: Boolean(profile?.cover_image_url),
      action: "Añade una foto horizontal de la barbería.",
    },
    {
      label: "Descripción corta",
      done: Boolean(profile?.description && profile.description.trim().length >= 24),
      action: "Explica estilo, zona y especialidad en 2-3 líneas.",
    },
    {
      label: "Enlace público activo",
      done: Boolean(profile?.is_published && barbershop?.public_booking_enabled !== false),
      action: "Publica el perfil para compartir tu enlace.",
    },
  ];

  const completed = items.filter((item) => item.done).length;
  const score = Math.round((completed / items.length) * 100);

  return { items, score, completed, total: items.length };
}

export default async function MarketplacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
    { data: servicesRaw },
    { data: barbersRaw },
    { data: reviewsRaw },
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
      .select("name, slug, city, phone, address, instagram_url, google_business_url, google_review_url, public_booking_enabled")
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
    supabase
      .from("services")
      .select("id, name, price, active")
      .eq("barbershop_id", barbershopId),
    supabase
      .from("barbers")
      .select("id, name, active")
      .eq("barbershop_id", barbershopId),
    supabase
      .from("reviews")
      .select("id, is_public, status")
      .eq("business_id", barbershopId),
  ]);

  const profile = profileRow as (PublicProfile & { featured?: boolean }) | null;
  const currentBarbershop = (barbershop ?? null) as BarbershopRow | null;
  const services = (servicesRaw ?? []) as ServiceRow[];
  const barbers = (barbersRaw ?? []) as BarberRow[];
  const reviews = (reviewsRaw ?? []) as { id: string; is_public: boolean; status: string }[];
  const events = (eventsRaw ?? []) as { event_type: string }[];

  const eventCounts: EventCounts = {
    profile_view: events.filter((event) => event.event_type === "profile_view").length,
    booking_click: events.filter((event) => event.event_type === "booking_click").length,
    whatsapp_click: events.filter((event) => event.event_type === "whatsapp_click").length,
    directions_click: events.filter((event) => event.event_type === "directions_click").length,
  };

  const defaultSlug = normalizeSlug(currentBarbershop?.slug);
  const health = buildProfileHealth({
    profile,
    barbershop: currentBarbershop,
    services,
    barbers,
  });

  const activeServices = services
    .filter((service) => service.active !== false)
    .slice(0, 3)
    .map((service) => ({
      id: service.id,
      name: service.name,
      price: Number(service.price ?? 0),
    }));

  const publicName = profile?.public_name || currentBarbershop?.name || "Tu barbería";
  const city = profile?.city || currentBarbershop?.city || null;
  const neighborhood = profile?.neighborhood ?? null;
  const planName = subscription?.plan_name ?? "starter";
  const isPremiumPlan = planName === "premium";
  const isGrowthOrAbove = planName === "growth" || isPremiumPlan;

  const data: MarketplacePageData = {
    profile,
    defaultSlug,
    siteUrl: SITE_URL,
    publicName,
    city,
    neighborhood,
    barbershopPhone: currentBarbershop?.phone ?? null,
    instagramUrl: currentBarbershop?.instagram_url ?? null,
    googleBusinessUrl: currentBarbershop?.google_business_url ?? null,
    googleReviewUrl: currentBarbershop?.google_review_url ?? null,
    publicBookingEnabled: currentBarbershop?.public_booking_enabled ?? null,
    health,
    metrics: eventCounts,
    activeServices,
    activeBarbersCount: barbers.filter((barber) => barber.active !== false).length,
    publicReviewsCount: reviews.filter((review) => review.is_public).length,
    isGrowthOrAbove,
    isPremiumPlan,
  };

  return <MarketplaceClient data={data} />;
}
