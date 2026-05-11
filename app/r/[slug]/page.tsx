import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/src/lib/supabase/server";
import { BookingForm } from "./BookingForm";
import { TrackPageView } from "./TrackPageView";
import { TrackedLink } from "./TrackedLink";
import { SITE_URL } from "@/src/lib/site-url";
import { Map, QrCode } from "lucide-react";
import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  Instagram,
  MapPin,
  MessageCircle,
  Scissors,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";

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

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(Number(value)) ? 0 : 2,
  }).format(Number(value));
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

  const { data: barbershop, error: barbershopError } = await getPublicBarbershop(slug);

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
  const locationLabel = [publicProfile?.neighborhood, barbershop.city].filter(Boolean).join(", ") || location;
  const whatsappPhone = publicProfile?.whatsapp || barbershop.phone;
  const whatsappHref = formatWhatsAppHref(whatsappPhone, barbershop.name);
  const mapsHref =
    barbershop.address
      ? `https://maps.google.com/?q=${encodeURIComponent([barbershop.address, barbershop.city].filter(Boolean).join(", "))}`
      : null;
  const publicUrl = `${SITE_URL}/r/${barbershop.slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`;

  const trackingSource = "direct";

  return (
    <main className="premium-grid-bg min-h-screen pb-24 text-slate-950 md:pb-0">
      <TrackPageView barbershopId={barbershop.id} source={trackingSource} city={barbershop.city} />
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,155,60,0.24),transparent_34%),linear-gradient(135deg,#111111_0%,#1F2937_52%,#111111_100%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1fr_0.72fr] md:items-end md:py-12 lg:px-8">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-xl font-black tracking-wide shadow-2xl shadow-black/20">
                {getInitials(barbershop.name) || <Scissors size={24} />}
              </div>
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Reserva online disponible
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-normal text-white sm:text-5xl">
                  {barbershop.name}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-base leading-7 text-white/70">
              {publicProfile?.description ??
                "Reserva tu corte, barba o servicio de barbería en pocos pasos. Sin cuenta, sin espera y directo con el equipo."}
            </p>

            <div className="mt-5 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:flex-wrap">
              {locationLabel && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-[#D9B766]" />
                  {locationLabel}
                </span>
              )}
              {barbershop.phone && (
                <span className="inline-flex items-center gap-2">
                  <MessageCircle size={15} className="text-[#D9B766]" />
                  {barbershop.phone}
                </span>
              )}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                barbershopId={barbershop.id}
                eventType="booking_click"
                source={trackingSource}
                city={barbershop.city}
                href="#reservar"
                className="btn-gold"
              >
                Reservar cita <CalendarCheck size={16} />
              </TrackedLink>
              {whatsappHref && (
                <TrackedLink
                  barbershopId={barbershop.id}
                  eventType="whatsapp_click"
                  source={trackingSource}
                  city={barbershop.city}
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-white/10 active:scale-[0.98]"
                >
                  WhatsApp <MessageCircle size={15} />
                </TrackedLink>
              )}
              {barbershop.instagram_url && (
                <a
                  href={barbershop.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-white/10 active:scale-[0.98]"
                >
                  Instagram <Instagram size={15} />
                </a>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D9B766]">
              Perfil BarberiaOS
            </p>
            <div className="mt-4 grid gap-3">
              {[
                { icon: Clock, label: "Reserva rápida", text: "Elige servicio, profesional y hora." },
                { icon: ShieldCheck, label: "Sin esperas", text: "Las horas ocupadas se bloquean." },
                { icon: BadgeCheck, label: "Confirmación", text: "La cita queda registrada en la agenda." },
              ].map(({ icon: Icon, label, text }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D9B766]">
                      <Icon size={17} />
                    </div>
                    <div>
                      <p className="font-black text-white">{label}</p>
                      <p className="mt-1 text-sm leading-5 text-white/60">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[1fr_0.86fr] md:py-8 lg:px-8">
        <div className="space-y-6">
          <section className="section-band p-5 md:p-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="label-section">Servicios</p>
                <h2 className="section-heading">Servicios destacados</h2>
              </div>
              <span className="rounded-full bg-[#F8F5EF] px-3 py-1 text-xs font-bold text-[#8A641F]">
                {activeServices.length} activos
              </span>
            </div>

            {activeServices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E7E2D8] bg-[#FDFBF7] p-6 text-center">
                <Scissors size={24} className="mx-auto text-neutral-300" />
                <p className="mt-3 font-bold text-[#111827]">Servicios no disponibles todavía</p>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Esta barbería aún no ha publicado su catálogo de servicios online.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {activeServices.map((service) => (
                  <article key={service.id} className="rounded-2xl border border-[#E7E2D8] bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-black text-[#111827]">{service.name}</h3>
                        {service.description && (
                          <p className="mt-1 text-sm leading-6 text-neutral-500">
                            {service.description}
                          </p>
                        )}
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500">
                          <Clock size={13} />
                          {service.duration_minutes} min
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xl font-black text-[#111827]">{formatPrice(service.price)}</p>
                        <a href="#reservar" className="mt-3 inline-flex rounded-xl bg-[#111827] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0F172A]">
                          Elegir
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="section-band p-5 md:p-6">
            <div className="mb-4">
              <p className="label-section">Equipo</p>
              <h2 className="section-heading">Barberos disponibles</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-neutral-400">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-black text-[#111827]">Cualquiera</p>
                    <p className="text-sm text-neutral-500">Primer barbero libre</p>
                  </div>
                </div>
              </article>

              {activeBarbers.map((barber) => (
                <article key={barber.id} className="rounded-2xl border border-[#E7E2D8] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-sm font-black uppercase text-[#D9B766]">
                      {barber.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[#111827]">{barber.name}</p>
                      <p className="text-sm text-neutral-500">Barbero</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Scissors, title: "Reserva rápida", text: "Completa tu reserva desde el móvil en pocos pasos." },
              { icon: BadgeCheck, title: "Confirmación de cita", text: "La cita se registra directamente en la agenda." },
              { icon: ShieldCheck, title: "Sin dobles reservas", text: "Las horas ocupadas se muestran bloqueadas." },
            ].map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-[#E7E2D8] bg-white p-4 shadow-sm">
                <Icon size={18} className="text-[#8A641F]" />
                <h3 className="mt-3 font-black text-[#111827]">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
              </article>
            ))}
          </section>
        </div>

        <aside className="space-y-6 md:sticky md:top-6 md:self-start">
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

          <section className="rounded-[28px] border border-[#E7E2D8] bg-white p-5 shadow-sm">
            <p className="label-section">Información útil</p>
            <div className="mt-4 space-y-3 text-sm">
              {location && (
                <p className="flex gap-2 text-neutral-600">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-neutral-400" />
                  <span>{location}</span>
                </p>
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
                  className="flex gap-2 font-semibold text-[#111827] transition hover:text-[#8A641F]"
                >
                  <Map size={15} className="mt-0.5 shrink-0" />
                  Ver en Google Maps
                </TrackedLink>
              )}
              {barbershop.phone && (
                <p className="flex gap-2 text-neutral-600">
                  <MessageCircle size={15} className="mt-0.5 shrink-0 text-neutral-400" />
                  <span>{barbershop.phone}</span>
                </p>
              )}
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
                  <Star size={15} className="mt-0.5 shrink-0" />
                  Perfil en Google
                </a>
              )}
              {!location && !barbershop.phone && !barbershop.instagram_url && !barbershop.google_business_url && (
                <p className="text-neutral-500">
                  Esta barbería todavía no ha añadido información pública de contacto.
                </p>
              )}
            </div>
          </section>

          {/* QR de reservas */}
          <section className="rounded-[28px] border border-[#E7E2D8] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="label-section">Reserva rápida</p>
                <p className="mt-0.5 font-black text-[#111827]">QR de citas</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white">
                <QrCode size={16} />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt={`QR de reservas de ${barbershop.name}`}
                width={160}
                height={160}
                className="rounded-2xl"
              />
            </div>
            <p className="mt-3 text-center text-xs text-neutral-400">
              Escanea para reservar desde el móvil
            </p>
          </section>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E7E2D8] bg-white/95 px-4 pb-5 pt-3 shadow-[0_-10px_40px_rgba(17,17,17,0.10)] backdrop-blur md:hidden">
        <a href="#reservar" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/15">
          Reservar cita <CalendarCheck size={17} />
        </a>
      </div>
    </main>
  );
}
