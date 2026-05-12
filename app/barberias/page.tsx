import type { Metadata } from "next";
import Link from "next/link";
import { Scissors, MapPin, CalendarCheck, Store } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { type BarberiaProfile } from "@/components/marketplace/BarberiaCard";
import { BarberiasClient } from "./BarberiasClient";
import { SITE_URL } from "@/src/lib/site-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Barberías con reservas online | BarberíaOS",
  description:
    "Encuentra barberías cerca de ti con reserva online, barberos profesionales y los mejores servicios de corte y barba. Reserva en segundos.",
  alternates: { canonical: `${SITE_URL}/barberias` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/barberias`,
    title: "Barberías con reservas online | BarberíaOS",
    description:
      "Encuentra y reserva en las mejores barberías. Corte, barba y servicios premium con cita online.",
    siteName: "BarberíaOS",
  },
};

async function getMarketplaceProfiles(): Promise<BarberiaProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("barbershop_public_profiles")
    .select(
      "id, barbershop_id, slug, public_name, city, neighborhood, description, cover_image_url, logo_url, instagram, whatsapp, phone, featured, latitude, longitude, google_maps_url, map_visible"
    )
    .eq("is_published", true)
    .eq("marketplace_enabled", true)
    .order("priority_score", { ascending: false })
    .order("created_at", { ascending: false });

  return (data ?? []) as BarberiaProfile[];
}

function getCityGroups(profiles: BarberiaProfile[]) {
  const counts = new Map<string, number>();
  for (const p of profiles) {
    if (p.city) counts.set(p.city, (counts.get(p.city) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

function EmptyMarketplace() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#D5A84C]/20 to-[#D5A84C]/5 ring-1 ring-[#D5A84C]/20 shadow-sm">
        <Scissors size={36} className="text-[#C9922A]" />
      </div>
      <h2 className="mt-7 text-2xl font-black text-[#080A0F]">
        Aún no hay barberías publicadas
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        Cuando una barbería active su perfil público aparecerá aquí.
        Vuelve pronto o reserva directamente si ya tienes el enlace de tu barbería.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-gold">
          Volver al inicio
        </Link>
        <Link href="/login" className="btn-outline">
          Crear mi cuenta gratis
        </Link>
      </div>
    </div>
  );
}

export default async function BarberiasPage() {
  const profiles = await getMarketplaceProfiles();
  const cityGroups = getCityGroups(profiles);

  return (
    <main className="min-h-screen bg-[#F5F6F8] pb-20 lg:pb-0">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-4 pt-6 sm:px-6 lg:px-10">
        {/* Breadcrumb — outside the hero card so it doesn't compete with the H1 */}
        <div className="mx-auto mb-3 flex max-w-[1400px] items-center gap-2 text-sm">
          <Link href="/" className="font-semibold text-slate-500 transition hover:text-[#080A0F]">
            BarberíaOS
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">Barberías</span>
        </div>

        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[34px] border border-white bg-[linear-gradient(135deg,#FFFFFF_0%,#F7F3EA_46%,#EEF3F8_100%)] px-5 py-10 shadow-[0_24px_80px_rgba(8,10,15,0.10)] sm:px-8 md:py-14 lg:px-12">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D5A84C]/40 to-transparent" />
          {/* Decorative gold glows */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#D5A84C]/6 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#D5A84C]/4 blur-3xl" />

          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="max-w-2xl">
              <p className="label-section text-[#8A641F]">Directorio · Marketplace local</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-[#080A0F] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                Encuentra barberías
                <br />
                <span className="text-[#8A641F]">con reserva online</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Descubre barberías cerca de ti, consulta su ubicación y reserva en segundos con BarberíaOS.
              </p>

              {/* Hero CTAs — primary action first */}
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#directorio" className="btn-gold">
                  <CalendarCheck size={15} />
                  Reservar ahora
                </a>
                <Link
                  href="/login"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-[#080A0F] shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#D5A84C]/40 hover:bg-white"
                >
                  <Store size={15} />
                  ¿Tienes una barbería?
                </Link>
              </div>

              {/* Trust badges — subordinate, below CTAs */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {["Sin llamadas", "Reserva online", "Mapa interactivo", "Sin comisiones"].map((label) => (
                  <span
                    key={label}
                    className="flex items-center gap-1 rounded-full border border-slate-200/60 bg-white/50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 backdrop-blur-sm"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#D5A84C]" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white bg-white/70 p-4 shadow-[0_16px_46px_rgba(8,10,15,0.08)] backdrop-blur">
              <p className="text-xs font-black uppercase text-slate-400">Ciudades populares</p>
              {cityGroups.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {cityGroups.map(([city, count]) => (
                    <Link
                      key={city}
                      href={`/barberias/${encodeURIComponent(city.toLowerCase().trim())}`}
                      className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#D5A84C]/40 hover:text-[#080A0F]"
                    >
                      <MapPin size={11} className="text-[#C9922A]" />
                      {city}
                      <span className="ml-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-black tabular-nums text-slate-500">
                        {count}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Las primeras barberías publicadas aparecerán aquí.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Directory ────────────────────────────────────────────────────── */}
      <div id="directorio" className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">

        {profiles.length === 0 ? (
          <EmptyMarketplace />
        ) : (
          <BarberiasClient profiles={profiles} />
        )}

        {/* ── Owner CTA ────────────────────────────────────────────────── */}
        <div className="mt-20 overflow-hidden rounded-[32px] bg-[#080A0F] p-10 text-center shadow-[0_20px_60px_rgba(8,10,15,0.16)] md:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D5A84C]/10 ring-1 ring-[#D5A84C]/20">
            <Scissors size={24} className="text-[#D5A84C]" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-white">
            ¿Tienes una barbería?
          </h2>
          <p className="mt-3 max-w-md mx-auto text-sm leading-6 text-white/60">
            Crea tu perfil, activa reservas online y aparece en el directorio de BarberíaOS.
            Sin comisión por cita, sin contratos.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="btn-gold">
              Crear mi cuenta gratis
            </Link>
            <Link
              href="/#precios"
              className="inline-flex items-center gap-2 rounded-[14px] border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Ver planes
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
