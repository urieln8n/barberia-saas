import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChevronLeft,
  MapPin,
  QrCode,
  Scissors,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { type BarberiaProfile } from "@/components/marketplace/BarberiaCard";
import { BarberiasClient } from "../BarberiasClient";
import { SITE_URL } from "@/src/lib/site-url";

export const dynamic = "force-dynamic";

type Props = {
  params: { city: string };
};

type ServiceRow = {
  id: string;
  barbershop_id: string;
  name: string;
  price: number | null;
};

function formatCityLabel(raw: string) {
  const decoded = decodeURIComponent(raw).replace(/-/g, " ").trim();
  return decoded
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function citySlug(value: string) {
  return encodeURIComponent(value.trim().toLowerCase());
}

function getEffectiveProfileSlug(profile: BarberiaProfile) {
  return profile.public_slug || profile.slug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = formatCityLabel(params.city);
  const canonical = `${SITE_URL}/barberias/${citySlug(city)}`;
  const title = `Barberías en ${city} | Reserva cita online | BarberíaOS`;
  const description = `Encuentra barberías en ${city}, consulta servicios y reserva cita online con perfiles verificados por BarberíaOS.`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "BarberíaOS",
    },
  };
}

async function getProfilesByCity(rawCity: string): Promise<BarberiaProfile[]> {
  const supabase = await createClient();
  const city = formatCityLabel(rawCity);

  const { data: profilesRaw } = await supabase
    .from("barbershop_public_profiles")
    .select(
      "id, barbershop_id, slug, public_slug, public_name, city, neighborhood, address, description, short_description, cover_image_url, logo_url, instagram, whatsapp, phone, featured, is_featured, is_verified, latitude, longitude, google_maps_url, map_visible, priority_score",
    )
    .eq("is_published", true)
    .eq("marketplace_enabled", true)
    .ilike("city", city)
    .order("priority_score", { ascending: false })
    .order("created_at", { ascending: false });

  const profiles = (profilesRaw ?? []) as BarberiaProfile[];
  if (profiles.length === 0) return [];

  const barbershopIds = profiles.map((profile) => profile.barbershop_id);
  const { data: servicesRaw } = await supabase
    .from("services")
    .select("id, barbershop_id, name, price")
    .in("barbershop_id", barbershopIds)
    .eq("active", true)
    .order("created_at", { ascending: true });

  const servicesByShop = new Map<string, ServiceRow[]>();
  for (const service of (servicesRaw ?? []) as ServiceRow[]) {
    const current = servicesByShop.get(service.barbershop_id) ?? [];
    current.push(service);
    servicesByShop.set(service.barbershop_id, current);
  }

  return profiles.map((profile) => {
    const services = servicesByShop.get(profile.barbershop_id) ?? [];
    const prices = services
      .map((service) => Number(service.price))
      .filter((price) => Number.isFinite(price) && price > 0);

    return {
      ...profile,
      featured: Boolean(profile.is_featured ?? profile.featured),
      top_services: services.slice(0, 3).map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
      })),
      price_from: prices.length > 0 ? Math.min(...prices) : null,
    };
  });
}

function buildJsonLd(city: string, profiles: BarberiaProfile[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Barberías en ${city}`,
    url: `${SITE_URL}/barberias/${citySlug(city)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: profiles.length,
      itemListElement: profiles.map((profile, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/barberias/${citySlug(city)}/${getEffectiveProfileSlug(profile)}`,
        item: {
          "@type": "HairSalon",
          name: profile.public_name,
          url: `${SITE_URL}/barberias/${citySlug(city)}/${getEffectiveProfileSlug(profile)}`,
          address: [profile.address, profile.neighborhood, profile.city].filter(Boolean).join(", ") || undefined,
          telephone: profile.phone ?? profile.whatsapp ?? undefined,
          image: profile.cover_image_url ?? profile.logo_url ?? undefined,
        },
      })),
    },
  };
}

function EmptyCityState({ city }: { city: string }) {
  return (
    <section className="rounded-[28px] border border-[#E7E2D8] bg-white p-8 text-center shadow-[var(--shadow-warm)] md:p-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-[#E7E2D8] bg-[#F8F5EF] shadow-sm">
        <MapPin size={32} className="text-[#C9922A]" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-[#080A0F]">
        Todavía no hay barberías publicadas en {city}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
        Estamos abriendo el directorio local de BarberíaOS. Si tienes una barbería,
        puedes ser de las primeras en aparecer.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/demo" className="btn-gold">
          Solicitar demo
          <ArrowRight size={15} />
        </Link>
        <Link href="/barberias" className="btn-outline">
          Ver otras ciudades
        </Link>
      </div>
    </section>
  );
}

function OwnerCta({ city }: { city: string }) {
  const benefits = [
    { label: "Perfil público profesional", icon: BadgeCheck },
    { label: "Enlace de reservas", icon: CalendarCheck },
    { label: "QR para Instagram y mostrador", icon: QrCode },
    { label: "Métricas de visitas y clics", icon: TrendingUp },
    { label: "Posibilidad de destacar tu barbería", icon: Sparkles },
  ];

  return (
    <section className="mt-16 overflow-hidden rounded-[32px] border border-[#C9922A]/25 bg-[#080A0F] p-6 text-white shadow-[0_24px_90px_rgba(8,10,15,0.28)] md:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D5A84C] text-[#080A0F]">
            <Scissors size={21} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-white">
            ¿Tienes una barbería en {city}?
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Aparece en el directorio local de BarberíaOS, recibe reservas directas
            y controla tu perfil desde tu propio panel.
          </p>
          <Link href="/demo" className="btn-gold mt-6">
            Solicitar demo
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {benefits.map(({ label, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <Icon size={17} className="text-[#D5A84C]" />
              <p className="mt-3 text-sm font-bold leading-5 text-white">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function BarberiasCityPage({ params }: Props) {
  const city = formatCityLabel(params.city);
  const profiles = await getProfilesByCity(params.city);
  const withCoords = profiles.filter(
    (profile) => profile.latitude != null && profile.longitude != null && profile.map_visible !== false,
  ).length;
  const featuredCount = profiles.filter((profile) => profile.is_featured ?? profile.featured).length;
  const jsonLd = buildJsonLd(city, profiles);

  return (
    <main className="min-h-screen bg-[#F4F1EA]">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-[#080A0F] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(213,168,76,0.18),transparent_38%),linear-gradient(225deg,rgba(37,99,235,0.18),transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
            <Link href="/barberias" className="transition hover:text-white">Barberías</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/85">{city}</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#D5A84C]/35 bg-[#D5A84C]/12 px-3 py-1.5 text-xs font-black uppercase text-[#F4D58A]">
                  Directorio local
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-white/80">
                  {profiles.length} {profiles.length === 1 ? "barbería" : "barberías"}
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-black text-white sm:text-5xl md:text-6xl">
                Barberías en {city}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
                Encuentra barberías verificadas, consulta servicios y reserva cita
                online desde BarberíaOS.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#listado" className="btn-gold">
                  Reservar en una barbería
                  <ArrowRight size={15} />
                </a>
                <Link href="/demo" className="btn-outline border-white/15 bg-white/10 text-white hover:bg-white hover:text-[#080A0F]">
                  Quiero aparecer aquí
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
              <div>
                <p className="text-2xl font-black text-white">{profiles.length}</p>
                <p className="mt-1 text-[11px] font-bold uppercase leading-4 text-white/45">Perfiles</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{withCoords}</p>
                <p className="mt-1 text-[11px] font-bold uppercase leading-4 text-white/45">En mapa</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{featuredCount}</p>
                <p className="mt-1 text-[11px] font-bold uppercase leading-4 text-white/45">Top</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/barberias"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#080A0F]"
        >
          <ChevronLeft size={15} />
          Ver todas las ciudades
        </Link>

        <section id="listado">
          {profiles.length === 0 ? (
            <EmptyCityState city={city} />
          ) : (
            <BarberiasClient
              profiles={profiles}
              featuredLabel={`Destacadas en ${city}`}
              restLabel={`Barberías en ${city}`}
            />
          )}
        </section>

        <OwnerCta city={city} />
      </div>
    </main>
  );
}
