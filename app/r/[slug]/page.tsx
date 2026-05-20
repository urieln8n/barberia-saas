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
    supabase
      .from("services")
      .select("id, name, description, price, duration_minutes")
      .eq("barbershop_id", barbershop.id)
      .eq("active", true)
      .order("created_at", { ascending: true }),

    supabase
      .from("barbers")
      .select("id, name")
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
  const heroDescription =
    publicProfile?.description ??
    "Elige servicio, profesional y hora real disponible en menos de un minuto.";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#080A0F_0%,#111827_32%,#F7F8FB_32.2%,#EEF2F7_100%)] pb-24 text-slate-950 md:pb-12">
      <TrackPageView
        barbershopId={barbershop.id}
        source={trackingSource}
        city={barbershop.city}
      />

      <header className="border-b border-white/10 bg-[#080A0F]/88 text-white backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D9B766]/25 bg-[#D9B766]/10 text-sm font-black tracking-wide text-[#D9B766]">
              {getInitials(barbershop.name) || <Scissors size={20} />}
            </div>
            <div className="min-w-0">
              <p className="truncate font-black text-white">{barbershop.name}</p>
              {locationLabel && (
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-white/50">
                  <MapPin size={13} className="shrink-0" />
                  {locationLabel}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 text-xs font-black text-emerald-200">
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
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-sm font-bold text-white transition hover:border-[#D9B766]/40"
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
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-sm font-bold text-white transition hover:border-[#D9B766]/40"
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
          <p className="text-[11px] font-black uppercase text-[#D9B766]">Reserva pública</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-normal text-white sm:text-4xl">
            Reserva tu cita en {barbershop.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/62">
            {heroDescription}
          </p>
          {isDemoBarber && (
            <p className="mt-3 max-w-2xl rounded-2xl border border-[#D9B766]/25 bg-[#D9B766]/10 px-4 py-3 text-sm font-bold leading-6 text-[#F6D98B]">
              Demo interactiva. Tus clientes reservarían desde Instagram, Google, WhatsApp o QR sin descargar ninguna app.
            </p>
          )}
          <a
            href="#reservar"
            className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#D9B766] px-5 py-3 text-sm font-black text-[#080A0F] shadow-lg shadow-[#D9B766]/15 transition hover:bg-[#E4C87B]"
          >
            Reservar ahora <CalendarCheck size={17} />
          </a>
        </div>

        <div className="grid gap-2 rounded-[24px] border border-white/10 bg-white/[0.06] p-4 shadow-sm backdrop-blur">
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
            <div key={text} className="flex items-center gap-3 text-sm text-white/68">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D9B766]">
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
            barbershopName={barbershop.name}
            barbershopCity={barbershop.city ?? ""}
            services={activeServices}
            barbers={activeBarbers}
            initialServiceId={initialServiceId}
            initialBarberId={initialBarberId}
          />
        </section>

        <aside className="space-y-4 md:sticky md:top-6 md:self-start">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="label-section">Información</p>
            <div className="mt-4 space-y-3 text-sm">
              {location && (
                <p className="flex gap-2 text-neutral-600">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-neutral-400" />
                  <span>{location}</span>
                </p>
              )}
              {barbershop.phone && (
                <p className="flex gap-2 text-neutral-600">
                  <MessageCircle
                    size={15}
                    className="mt-0.5 shrink-0 text-neutral-400"
                  />
                  <span>{barbershop.phone}</span>
                </p>
              )}
              <p className="flex gap-2 text-neutral-600">
                <Clock size={15} className="mt-0.5 shrink-0 text-neutral-400" />
                <span>{isDemoBarber ? "Lunes a sábado · 10:00–20:00" : "Horarios disponibles dentro del formulario."}</span>
              </p>
              {barbershop.instagram_url && (
                <a
                  href={barbershop.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 font-semibold text-[#111827] transition hover:text-[#8A641F]"
                >
                  <Instagram size={15} className="mt-0.5 shrink-0" />
                  Instagram
                </a>
              )}
              {barbershop.google_business_url && (
                <a
                  href={barbershop.google_business_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 font-semibold text-[#111827] transition hover:text-[#8A641F]"
                >
                  <Map size={15} className="mt-0.5 shrink-0" />
                  Perfil en Google
                </a>
              )}
              {!location &&
                !barbershop.phone &&
                !barbershop.instagram_url &&
                !barbershop.google_business_url && (
                  <p className="text-neutral-500">
                    Esta barbería todavía no ha añadido información pública de
                    contacto.
                  </p>
                )}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="label-section">Cancelación</p>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Si necesitas cambiar o cancelar tu cita, contacta directamente con la
              barbería por teléfono o WhatsApp.
            </p>
          </section>

          <p className="text-center text-xs font-semibold text-neutral-400">
            Powered by BarberíaOS
          </p>
        </aside>
      </div>
    </main>
  );
}
