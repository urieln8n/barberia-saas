import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  Instagram,
  Map,
  MapPin,
  MessageCircle,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { SITE_URL } from "@/src/lib/site-url";
import { BookingForm } from "./BookingForm";
import { TrackPageView } from "./TrackPageView";
import { TrackedLink } from "./TrackedLink";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    slug: string;
  };
  searchParams?: {
    service?: string;
    barber?: string;
  };
};

type Barbershop = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  instagram_url: string | null;
  google_business_url: string | null;
  public_booking_enabled: boolean | null;
};

type PublicProfile = {
  description: string | null;
  neighborhood: string | null;
  whatsapp: string | null;
  logo_url: string | null;
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatWhatsAppHref(phone: string | null, barbershopName: string) {
  if (!phone) return null;

  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return null;

  const message = encodeURIComponent(
    `Hola, quiero reservar cita en ${barbershopName}.`
  );

  return `https://wa.me/${digits}?text=${message}`;
}

async function getPublicBarbershop(slug: string) {
  const supabase = await createClient();

  return supabase
    .from("barbershops")
    .select(
      "id, name, slug, phone, address, city, instagram_url, google_business_url, public_booking_enabled"
    )
    .eq("slug", slug)
    .eq("public_booking_enabled", true)
    .maybeSingle();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug?.trim();
  if (!slug) {
    return {
      title: "Reservas online | BarberiaOS",
      description: "Reserva tu cita online en una barbería con BarberiaOS.",
      alternates: {
        canonical: "/",
      },
    };
  }

  const { data: barbershop } = await getPublicBarbershop(slug);

  if (!barbershop) {
    return {
      title: "Barbería no encontrada | BarberiaOS",
      description: "Esta página de reservas no está disponible.",
      alternates: {
        canonical: `/r/${slug}`,
      },
    };
  }

  const location = [barbershop.address, barbershop.city].filter(Boolean).join(", ");

  return {
    title: `${barbershop.name} | Reservas online`,
    description: location
      ? `Reserva cita online en ${barbershop.name}, ${location}.`
      : `Reserva cita online en ${barbershop.name}.`,
    alternates: {
      canonical: `/r/${barbershop.slug}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/r/${barbershop.slug}`,
      title: `${barbershop.name} | Reservas online`,
      description: location
        ? `Reserva cita online en ${barbershop.name}, ${location}.`
        : `Reserva cita online en ${barbershop.name}.`,
      siteName: "BarberíaOS",
    },
    twitter: {
      card: "summary",
      title: `${barbershop.name} | Reservas online`,
      description: location
        ? `Reserva cita online en ${barbershop.name}, ${location}.`
        : `Reserva cita online en ${barbershop.name}.`,
    },
  };
}

export default async function PublicBookingPage({ params, searchParams }: Props) {
  const slug = params.slug?.trim();

  if (!slug) {
    notFound();
  }

  const { data: barbershop, error: barbershopError } =
    await getPublicBarbershop(slug);

  if (barbershopError || !barbershop) {
    notFound();
  }

  const supabase = await createClient();

  const [
    { data: services, error: servicesError },
    { data: barbers, error: barbersError },
    { data: rawProfile },
  ] = await Promise.all([
    // image_url/photo_url disponibles tras migración 035
      (supabase as any)
      .from("services")
      .select("id, name, description, price, duration_minutes, image_url")
      .eq("barbershop_id", barbershop.id)
      .eq("active", true)
      .order("created_at", { ascending: true }),

      (supabase as any)
      .from("barbers")
      .select("id, name, photo_url")
      .eq("barbershop_id", barbershop.id)
      .eq("active", true)
      .order("created_at", { ascending: true }),

    supabase
      .from("barbershop_public_profiles")
      .select("description, neighborhood, whatsapp, logo_url")
      .eq("barbershop_id", barbershop.id)
      .eq("is_published", true)
      .maybeSingle(),
  ]);

  const publicProfile = rawProfile as PublicProfile | null;

  if (servicesError || barbersError) {
    console.error("Error loading public booking data:", {
      servicesError,
      barbersError,
    });
  }

  const activeServices = (services ?? []) as Service[];
  const activeBarbers = (barbers ?? []) as Barber[];
  const initialServiceId = activeServices.some(
    (service) => service.id === searchParams?.service
  )
    ? searchParams?.service ?? null
    : null;
  const initialBarberId =
    searchParams?.barber === "any" ||
    activeBarbers.some((barber) => barber.id === searchParams?.barber)
      ? searchParams?.barber ?? null
      : null;
  const location = [barbershop.address, barbershop.city].filter(Boolean).join(", ");
  const locationLabel =
    [publicProfile?.neighborhood, barbershop.city].filter(Boolean).join(", ") ||
    location;
  const whatsappPhone = publicProfile?.whatsapp || barbershop.phone;
  const whatsappHref = formatWhatsAppHref(whatsappPhone, barbershop.name);
  const mapsHref = barbershop.address
    ? `https://maps.google.com/?q=${encodeURIComponent(
        [barbershop.address, barbershop.city].filter(Boolean).join(", ")
      )}`
    : null;
  const trackingSource = "direct";
  const isDemoBarber = barbershop.slug === "demo-barber";
  const displayName = isDemoBarber ? "FadeLab Barbers" : barbershop.name;
  const heroDescription =
    isDemoBarber
      ? "Así reservan tus clientes desde Instagram, Google, WhatsApp o el QR de tu mostrador. Sin app, sin llamadas, sin WhatsApp perdido."
      : (publicProfile?.description ?? "Elige servicio, profesional y hora real disponible en menos de un minuto.");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: displayName,
    url: `${SITE_URL}/r/${barbershop.slug}`,
    ...(barbershop.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: barbershop.address,
        addressLocality: barbershop.city ?? undefined,
        addressCountry: "ES",
      },
    }),
    ...(whatsappPhone && { telephone: whatsappPhone }),
    ...(barbershop.instagram_url && { sameAs: [barbershop.instagram_url] }),
    ...(publicProfile?.description && { description: publicProfile.description }),
    hasOfferCatalog: activeServices.length > 0
      ? {
          "@type": "OfferCatalog",
          name: `Servicios de ${displayName}`,
          itemListElement: activeServices.slice(0, 10).map((s, i) => ({
            "@type": "Offer",
            position: i + 1,
            name: s.name,
            price: s.price,
            priceCurrency: "EUR",
          })),
        }
      : undefined,
    makesOffer: {
      "@type": "Offer",
      name: "Reserva online sin comisión",
      url: `${SITE_URL}/r/${barbershop.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,rgba(37,99,235,0.18),transparent_28rem),radial-gradient(circle_at_88%_5%,rgba(212,175,102,0.14),transparent_24rem),linear-gradient(180deg,#050A14_0%,#07101F_48%,#0B1220_100%)] pb-24 text-white md:pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackPageView
        barbershopId={barbershop.id}
        source={trackingSource}
        city={barbershop.city}
      />

      <header className="border-b border-white/10 bg-[#07101F]/88 text-white shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/45 bg-[#D4AF37]/20 text-sm font-black tracking-wide text-[#D4AF37]">
              {getInitials(barbershop.name) || <Scissors size={20} />}
            </div>
            <div className="min-w-0">
              <p className="truncate font-black text-white">{displayName}</p>
              {locationLabel && (
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm font-medium text-slate-300">
                  <MapPin size={13} className="shrink-0" />
                  {locationLabel}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Reserva online disponible
            </span>
            {whatsappHref && (
              <TrackedLink
                barbershopId={barbershop.id}
                eventType="whatsapp_click"
                source={trackingSource}
                city={barbershop.city}
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.07] px-4 text-sm font-bold text-white/80 backdrop-blur-sm transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.1] hover:text-white"
              >
                <MessageCircle size={15} />
                WhatsApp
              </TrackedLink>
            )}
            {mapsHref && (
              <TrackedLink
                barbershopId={barbershop.id}
                eventType="directions_click"
                source={trackingSource}
                city={barbershop.city}
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.07] px-4 text-sm font-bold text-white/80 backdrop-blur-sm transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.1] hover:text-white"
              >
                <Map size={15} />
                Cómo llegar
              </TrackedLink>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 text-white sm:px-6 md:grid-cols-[1fr_0.72fr] md:items-end md:py-10 lg:px-8">
        <div>
          <p className="text-xs font-black uppercase text-[#D4AF37]">Reserva pública</p>
          {isDemoBarber && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-black text-[#E5C04C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              Demo interactiva de BarberíaOS — powered by BarberíaOS
            </div>
          )}
          <h1 className="mt-2 max-w-3xl text-4xl font-black tracking-normal text-white sm:text-5xl">
            Reserva tu cita en {displayName}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            {heroDescription}
          </p>
          <a
            href="#reservar"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-3 text-base font-black text-[#050A14] shadow-lg shadow-[#D4AF37]/25 transition hover:bg-[#E5C04C]"
          >
            Reservar ahora <CalendarCheck size={17} />
          </a>
        </div>

        <div className="grid gap-3 rounded-[2rem] border border-amber-200/40 bg-[#F6F1E8] p-5 text-slate-950 shadow-[var(--shadow-soft)]">
          {[
            {
              icon: Scissors,
              text: `${activeServices.length} servicios disponibles`,
            },
            {
              icon: BadgeCheck,
              text: activeBarbers.length
                ? `${activeBarbers.length} barberos activos`
                : "Asignación según disponibilidad",
            },
            {
              icon: ShieldCheck,
              text: "Horas ocupadas bloqueadas automáticamente",
            },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-base text-slate-700">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#8A641F]">
                <Icon size={16} />
              </span>
              <span className="font-semibold">{text}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <section id="reservar" className="scroll-mt-4">
          <BookingForm
            barbershopId={barbershop.id}
            barbershopSlug={barbershop.slug}
            barbershopName={displayName}
            barbershopCity={barbershop.city ?? ""}
            barbershopPhone={barbershop.phone ?? null}
            barbershopMapsHref={mapsHref}
            services={activeServices}
            barbers={activeBarbers}
            initialServiceId={initialServiceId}
            initialBarberId={initialBarberId}
          />
        </section>

        <aside className="space-y-4 md:sticky md:top-6 md:self-start">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30">Información</p>
            <div className="mt-4 space-y-3 text-sm">
              {location && (
                <p className="flex gap-2 text-white/55">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-white/30" />
                  <span>{location}</span>
                </p>
              )}
              {barbershop.phone && (
                <p className="flex gap-2 text-white/55">
                  <MessageCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-white/30"
                  />
                  <span>{barbershop.phone}</span>
                </p>
              )}
              <p className="flex gap-2 text-white/55">
                <Clock size={14} className="mt-0.5 shrink-0 text-white/30" />
                <span>{isDemoBarber ? "Lunes a sábado · 10:00–20:00" : "Horarios disponibles dentro del formulario."}</span>
              </p>
              {barbershop.instagram_url && (
                <a
                  href={barbershop.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 font-semibold text-white/70 transition hover:text-[#D4AF37]"
                >
                  <Instagram size={14} className="mt-0.5 shrink-0" />
                  Instagram
                </a>
              )}
              {barbershop.google_business_url && (
                <a
                  href={barbershop.google_business_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 font-semibold text-white/70 transition hover:text-[#D4AF37]"
                >
                  <Map size={14} className="mt-0.5 shrink-0" />
                  Perfil en Google
                </a>
              )}
              {!location &&
                !barbershop.phone &&
                !barbershop.instagram_url &&
                !barbershop.google_business_url && (
                  <p className="text-white/35">
                    Esta barbería todavía no ha añadido información pública de
                    contacto.
                  </p>
                )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30">Cancelación</p>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Si necesitas cambiar o cancelar tu cita, contacta directamente con la
              barbería por teléfono o WhatsApp.
            </p>
          </section>

          <p className="text-center text-xs font-semibold text-white/20">
            Powered by <span className="text-[#D4AF37]/60">BarberíaOS</span>
          </p>
        </aside>
      </div>

      {/* CTA para dueños — solo en demo */}
      {isDemoBarber && (
        <div className="mx-auto mt-8 max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-[#D4AF37]/30 bg-gradient-to-br from-[#0B1220] to-[#07101F] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37]/70">
              ¿Eres dueño de una barbería?
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Quiero esto para mi barbería
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Reservas online, agenda, caja, clientes y QR. Sin comisiones. Listo en un día.
            </p>
            <a
              href="https://wa.me/34645466308?text=Hola%2C%20acabo%20de%20ver%20la%20demo%20y%20quiero%20BarberíaOS%20para%20mi%20barbería"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-[#D4AF37] px-8 text-sm font-black text-[#070707] shadow-[0_8px_28px_rgba(212,175,55,0.35)] transition hover:-translate-y-0.5 hover:bg-[#EFC84A]"
            >
              Pedir demo por WhatsApp →
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
