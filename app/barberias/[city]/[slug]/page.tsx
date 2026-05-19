import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CalendarCheck,
  ChevronLeft,
  Clock,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { SITE_URL } from "@/src/lib/site-url";
import { TrackMarketplaceProfileView } from "./TrackMarketplaceProfileView";
import { TrackedMarketplaceLink } from "./TrackedMarketplaceLink";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    city: string;
    slug: string;
  };
};

type PublicProfile = {
  id: string;
  barbershop_id: string;
  slug: string;
  public_slug: string | null;
  public_name: string;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website_url: string | null;
  description: string | null;
  cover_image_url: string | null;
  logo_url: string | null;
  featured: boolean | null;
  google_maps_url: string | null;
  barbershops: {
    id: string;
    slug: string;
    public_booking_enabled: boolean | null;
  } | null;
};

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
};

type Barber = {
  id: string;
  name: string;
};

function citySlug(value: string | null) {
  return encodeURIComponent((value ?? "").trim().toLowerCase());
}

function cityLabel(value: string) {
  const decoded = decodeURIComponent(value).trim();
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
}

function isValidSlug(value: string) {
  return /^[a-z0-9][a-z0-9-]{0,78}[a-z0-9]$/.test(value) || /^[a-z0-9]{2}$/.test(value);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(Number(value)) ? 0 : 2,
  }).format(Number(value));
}

function formatWhatsAppHref(phone: string | null, barbershopName: string) {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (!digits) return null;

  return `https://wa.me/${digits}?text=${encodeURIComponent(
    `Hola, quiero reservar cita en ${barbershopName}.`,
  )}`;
}

function formatInstagramHref(value: string | null) {
  if (!value) return null;
  return value.startsWith("http") ? value : `https://instagram.com/${value.replace("@", "")}`;
}

function inferPriceRange(services: Service[]) {
  if (services.length === 0) return undefined;

  const prices = services.map((service) => Number(service.price)).filter(Number.isFinite);
  if (prices.length === 0) return undefined;

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
}

async function getProfile(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("barbershop_public_profiles")
    .select(
      "id, barbershop_id, slug, public_slug, public_name, city, neighborhood, address, phone, whatsapp, instagram, website_url, description, cover_image_url, logo_url, featured, google_maps_url, barbershops(id, slug, public_booking_enabled)",
    )
    .or(`slug.eq.${slug},public_slug.eq.${slug}`)
    .eq("is_published", true)
    .eq("marketplace_enabled", true)
    .maybeSingle();

  return data as PublicProfile | null;
}

async function getPublicProfileData(profile: PublicProfile) {
  const supabase = await createClient();

  const [{ data: services }, { data: barbers }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, description, price, duration_minutes")
      .eq("barbershop_id", profile.barbershop_id)
      .eq("active", true)
      .order("created_at", { ascending: true }),
    supabase
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", profile.barbershop_id)
      .eq("active", true)
      .order("created_at", { ascending: true }),
  ]);

  return {
    services: (services ?? []) as Service[],
    barbers: (barbers ?? []) as Barber[],
  };
}

function getDirectionsHref(profile: PublicProfile) {
  if (profile.google_maps_url) return profile.google_maps_url;
  if (!profile.address) return null;

  return `https://maps.google.com/?q=${encodeURIComponent(
    [profile.address, profile.city].filter(Boolean).join(", "),
  )}`;
}

function assertPublicProfileCity(profile: PublicProfile, rawCity: string) {
  if (!profile.city || citySlug(profile.city) !== citySlug(decodeURIComponent(rawCity))) {
    notFound();
  }
}

function buildJsonLd(profile: PublicProfile, canonical: string, services: Service[]) {
  const address = profile.address
    ? {
        "@type": "PostalAddress",
        streetAddress: profile.address,
        addressLocality: profile.city ?? undefined,
      }
    : undefined;
  const sameAs = [formatInstagramHref(profile.instagram), profile.website_url].filter(Boolean);
  const priceRange = inferPriceRange(services);

  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: profile.public_name,
    url: canonical,
    address,
    telephone: profile.phone ?? profile.whatsapp ?? undefined,
    image: profile.cover_image_url ?? profile.logo_url ?? undefined,
    priceRange,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug?.trim();
  if (!slug || !isValidSlug(slug)) {
    return {
      title: "Barberia no encontrada | BarberiaOS",
      robots: { index: false, follow: false },
    };
  }

  const profile = await getProfile(slug);
  if (!profile) {
    return {
      title: "Barberia no encontrada | BarberiaOS",
      robots: { index: false, follow: false },
    };
  }

  const city = profile.city ?? cityLabel(params.city);
  const canonical = `${SITE_URL}/barberias/${citySlug(city)}/${profile.public_slug || profile.slug}`;
  const title = `${profile.public_name} en ${city} | Reservar cita online`;
  const description = `Reserva cita en ${profile.public_name}, barberia en ${city}. Consulta servicios, precios, barberos y disponibilidad desde BarberiaOS.`;

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
      siteName: "BarberiaOS",
      images: profile.cover_image_url ? [{ url: profile.cover_image_url }] : undefined,
    },
  };
}

export default async function BarberiaMarketplaceProfilePage({ params }: Props) {
  const slug = params.slug?.trim();
  if (!slug || !isValidSlug(slug)) notFound();

  const profile = await getProfile(slug);
  if (!profile || !profile.barbershops?.public_booking_enabled) notFound();

  assertPublicProfileCity(profile, params.city);

  const { services, barbers } = await getPublicProfileData(profile);
  const city = profile.city ?? cityLabel(params.city);
  const canonical = `${SITE_URL}/barberias/${citySlug(city)}/${profile.public_slug || profile.slug}`;
  const bookingHref = `/r/${profile.slug}`;
  const whatsappHref = formatWhatsAppHref(profile.whatsapp, profile.public_name);
  const directionsHref = getDirectionsHref(profile);
  const instagramHref = formatInstagramHref(profile.instagram);
  const locationLabel = [profile.neighborhood, city].filter(Boolean).join(", ");
  const jsonLd = buildJsonLd(profile, canonical, services);

  return (
    <main className="min-h-screen bg-[#F6F8FB] text-[#080A0F]">
      <TrackMarketplaceProfileView barbershopId={profile.barbershop_id} city={profile.city} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="relative overflow-hidden bg-[#080A0F] bg-cover bg-center text-white"
        style={
          profile.cover_image_url
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(8,10,15,0.90), rgba(8,10,15,0.68)), url(${profile.cover_image_url})`,
              }
            : undefined
        }
      >
        {!profile.cover_image_url && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,168,76,0.20),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.16),transparent_42%)]" />
        )}
        <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="transition hover:text-white">
              BarberiaOS
            </Link>
            <span className="text-white/30">/</span>
            <Link href="/barberias" className="transition hover:text-white">
              Barberias
            </Link>
            <span className="text-white/30">/</span>
            <Link href={`/barberias/${citySlug(city)}`} className="transition hover:text-white">
              {city}
            </Link>
          </nav>

          <div className="grid gap-8 pb-10 pt-10 md:grid-cols-[1fr_360px] md:items-end md:pb-14 md:pt-16">
            <div>
              <Link
                href={`/barberias/${citySlug(city)}`}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
              >
                <ChevronLeft size={15} />
                Barberias en {city}
              </Link>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-100">
                  <BadgeCheck size={13} />
                  Verificada por BarberiaOS
                </span>
                {profile.featured && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D5A84C]/30 bg-[#D5A84C]/15 px-3 py-1.5 text-xs font-black text-[#F4D98F]">
                    <Star size={12} fill="currentColor" />
                    Destacada
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white/10 text-lg font-black text-[#F4D98F] shadow-2xl">
                  {profile.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.logo_url}
                      alt={`Logo de ${profile.public_name}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(profile.public_name) || <Scissors size={22} />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-4xl font-black tracking-normal text-white sm:text-5xl">
                    {profile.public_name}
                  </h1>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-white/70">
                    <MapPin size={15} className="text-[#D5A84C]" />
                    {locationLabel || city}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                {profile.description ??
                  "Perfil publico de barberia conectado a BarberiaOS. Consulta sus servicios y reserva desde el enlace oficial."}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <TrackedMarketplaceLink
                  barbershopId={profile.barbershop_id}
                  eventType="booking_click"
                  city={profile.city}
                  href={bookingHref}
                  className="btn-gold"
                >
                  Reservar cita <CalendarCheck size={16} />
                </TrackedMarketplaceLink>
                {whatsappHref && (
                  <TrackedMarketplaceLink
                    barbershopId={profile.barbershop_id}
                    eventType="whatsapp_click"
                    city={profile.city}
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                  >
                    WhatsApp <MessageCircle size={15} />
                  </TrackedMarketplaceLink>
                )}
                {directionsHref && (
                  <TrackedMarketplaceLink
                    barbershopId={profile.barbershop_id}
                    eventType="directions_click"
                    city={profile.city}
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                  >
                    Como llegar <Navigation size={15} />
                  </TrackedMarketplaceLink>
                )}
              </div>
            </div>

            <aside className="rounded-[24px] border border-white/12 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-[11px] font-black uppercase text-[#D5A84C]">
                Reserva oficial
              </p>
              <h2 className="mt-2 text-xl font-black text-white">
                Disponibilidad conectada a BarberiaOS
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Reserva desde el enlace oficial de la barberia. La cita se gestiona en su
                agenda de BarberiaOS.
              </p>
              <TrackedMarketplaceLink
                barbershopId={profile.barbershop_id}
                eventType="booking_click"
                city={profile.city}
                href={bookingHref}
                className="btn-gold mt-5 w-full"
              >
                Reservar cita <ExternalLink size={15} />
              </TrackedMarketplaceLink>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-6">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="label-section text-[#C9922A]">Servicios</p>
                <h2 className="mt-2 text-2xl font-black">Servicios y precios</h2>
              </div>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
                {services.length} activos
              </span>
            </div>

            {services.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <Scissors size={26} className="mx-auto text-[#C9922A]" />
                <p className="mt-3 font-black">Servicios pendientes de publicar</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Esta barberia aun no ha publicado su catalogo de servicios en el
                  directorio.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-3">
                {services.map((service) => (
                  <article
                    key={service.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-black">{service.name}</h3>
                        {service.description && (
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {service.description}
                          </p>
                        )}
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                          <Clock size={13} />
                          {service.duration_minutes} min
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xl font-black text-[#8A641F]">
                          {formatPrice(service.price)}
                        </p>
                        <TrackedMarketplaceLink
                          barbershopId={profile.barbershop_id}
                          eventType="booking_click"
                          city={profile.city}
                          href={`${bookingHref}?service=${service.id}#reservar`}
                          className="mt-3 inline-flex rounded-xl bg-[#C9922A] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#B78120]"
                        >
                          Reservar
                        </TrackedMarketplaceLink>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <p className="label-section text-[#C9922A]">Equipo</p>
            <h2 className="mt-2 text-2xl font-black">Barberos</h2>
            {barbers.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <User size={26} className="mx-auto text-[#C9922A]" />
                <p className="mt-3 font-black">Equipo pendiente de publicar</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  La barberia todavia no ha mostrado barberos activos en su ficha publica.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {barbers.map((barber) => (
                  <article key={barber.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#080A0F] text-sm font-black text-[#D5A84C]">
                        {barber.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black">{barber.name}</p>
                        <p className="text-sm text-slate-500">Barbero</p>
                      </div>
                    </div>
                    <TrackedMarketplaceLink
                      barbershopId={profile.barbershop_id}
                      eventType="booking_click"
                      city={profile.city}
                      href={`${bookingHref}?barber=${barber.id}#reservar`}
                      className="mt-4 inline-flex text-sm font-bold text-[#8A641F] hover:underline"
                    >
                      Reservar con {barber.name}
                    </TrackedMarketplaceLink>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <p className="label-section text-[#C9922A]">Disponibilidad</p>
            <h2 className="mt-2 text-2xl font-black">Reserva desde el enlace oficial</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              La disponibilidad se consulta en la pagina oficial de reservas de esta
              barberia. No mostramos horarios estimados para evitar informacion incorrecta.
            </p>
            <TrackedMarketplaceLink
              barbershopId={profile.barbershop_id}
              eventType="booking_click"
              city={profile.city}
              href={bookingHref}
              className="btn-gold mt-5"
            >
              Ver disponibilidad <CalendarCheck size={16} />
            </TrackedMarketplaceLink>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <p className="label-section text-[#C9922A]">Resenas</p>
            <h2 className="mt-2 text-2xl font-black">Resenas verificadas</h2>
            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
              Las resenas verificadas estaran disponibles proximamente.
            </div>
          </section>
        </div>

        <aside className="space-y-6 md:sticky md:top-6 md:self-start">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="label-section text-[#C9922A]">Ubicacion</p>
            <h2 className="mt-2 text-xl font-black">Como llegar</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p className="flex gap-2">
                <MapPin size={16} className="mt-1 shrink-0 text-[#C9922A]" />
                <span>
                  {[profile.address, profile.neighborhood, city].filter(Boolean).join(", ") ||
                    city}
                </span>
              </p>
              {directionsHref && (
                <TrackedMarketplaceLink
                  barbershopId={profile.barbershop_id}
                  eventType="directions_click"
                  city={profile.city}
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full"
                >
                  Como llegar <Navigation size={15} />
                </TrackedMarketplaceLink>
              )}
              {instagramHref && (
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold text-[#080A0F] transition hover:text-[#8A641F]"
                >
                  <Instagram size={15} />
                  Instagram
                </a>
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#C9922A]/20 bg-[#080A0F] p-5 text-white shadow-sm">
            <p className="label-section text-[#D5A84C]">Confianza</p>
            <h2 className="mt-2 text-xl font-black">Perfil conectado a BarberiaOS</h2>
            <div className="mt-4 grid gap-3">
              {[
                { icon: CalendarCheck, text: "Reservas directas desde el enlace oficial" },
                { icon: ShieldCheck, text: "Barberia verificada en el marketplace" },
                { icon: Scissors, text: "Servicios actualizados por la barberia" },
                { icon: Sparkles, text: "Perfil publico conectado a BarberiaOS" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
                  <Icon size={16} className="mt-0.5 shrink-0 text-[#D5A84C]" />
                  <p className="text-sm leading-5 text-white/70">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 text-center shadow-sm">
            <h2 className="text-xl font-black">
              Reserva tu proxima cita en {profile.public_name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Elige servicio y hora desde la pagina oficial de reservas.
            </p>
            <TrackedMarketplaceLink
              barbershopId={profile.barbershop_id}
              eventType="booking_click"
              city={profile.city}
              href={bookingHref}
              className="btn-gold mt-5 w-full"
            >
              Reservar cita <CalendarCheck size={16} />
            </TrackedMarketplaceLink>
          </section>
        </aside>
      </div>
    </main>
  );
}
