import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ChevronLeft, Scissors } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { type BarberiaProfile } from "@/components/marketplace/BarberiaCard";
import { BarberiasClient } from "../BarberiasClient";
import { SITE_URL } from "@/src/lib/site-url";

export const dynamic = "force-dynamic";

type Props = {
  params: { city: string };
};

function formatCityLabel(raw: string) {
  const decoded = decodeURIComponent(raw);
  return decoded.charAt(0).toUpperCase() + decoded.slice(1);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = formatCityLabel(params.city);
  return {
    title: `Barberías en ${city} con reserva online | BarberíaOS`,
    description: `Las mejores barberías en ${city} con cita online. Corte, barba y servicios profesionales. Reserva en segundos sin llamadas.`,
    alternates: { canonical: `${SITE_URL}/barberias/${params.city}` },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/barberias/${params.city}`,
      title: `Barberías en ${city} con reserva online | BarberíaOS`,
      description: `Las mejores barberías en ${city}. Reserva online en segundos.`,
      siteName: "BarberíaOS",
    },
  };
}

async function getProfilesByCity(rawCity: string): Promise<BarberiaProfile[]> {
  const supabase = await createClient();
  const city = decodeURIComponent(rawCity);

  const { data } = await supabase
    .from("barbershop_public_profiles")
    .select(
      "id, barbershop_id, slug, public_name, city, neighborhood, description, cover_image_url, logo_url, instagram, whatsapp, phone, featured, latitude, longitude, google_maps_url, map_visible"
    )
    .eq("is_published", true)
    .eq("marketplace_enabled", true)
    .ilike("city", city)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  return (data ?? []) as BarberiaProfile[];
}

function EmptyCityState({ city }: { city: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm">
        <MapPin size={32} className="text-slate-300" />
      </div>
      <h2 className="mt-6 text-xl font-black text-[#080A0F]">
        Sin barberías en {city} todavía
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        Aún no hay barberías con perfil público en {city}. Puedes explorar todas las
        ciudades disponibles.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/barberias" className="btn-primary">
          Ver todas las barberías
        </Link>
        <Link href="/" className="btn-outline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export default async function BarberiasCityPage({ params }: Props) {
  const city = formatCityLabel(params.city);
  const profiles = await getProfilesByCity(params.city);

  return (
    <main className="min-h-screen bg-[#F6F8FB]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#080A0F] py-14 text-white md:py-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,168,76,0.18),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.14),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition">BarberíaOS</Link>
            <span className="text-white/30">/</span>
            <Link href="/barberias" className="hover:text-white transition">Barberías</Link>
            <span className="text-white/30">/</span>
            <span className="text-white/80">{city}</span>
          </nav>

          <div className="mt-6">
            <p className="label-section text-[#D5A84C]">SEO local</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Barberías en {city}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/65">
              Reserva online en las mejores barberías de {city}. Sin llamadas, sin esperas —
              elige profesional y hora en segundos.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80">
                <MapPin size={12} />
                {city}
              </span>
              {profiles.length > 0 && (
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80">
                  {profiles.length} {profiles.length === 1 ? "barbería" : "barberías"}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back link */}
        <Link
          href="/barberias"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#080A0F]"
        >
          <ChevronLeft size={15} />
          Ver todas las ciudades
        </Link>

        {profiles.length === 0 ? (
          <EmptyCityState city={city} />
        ) : (
          <BarberiasClient
            profiles={profiles}
            featuredLabel={`Destacadas en ${city}`}
            restLabel={`Barberías en ${city}`}
          />
        )}

        {/* CTA barbershop owners */}
        <div className="mt-16 rounded-[28px] border border-[#C9922A]/20 bg-gradient-to-br from-[#C9922A]/5 to-transparent p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#080A0F]">
            <Scissors size={20} className="text-[#C9922A]" />
          </div>
          <h2 className="mt-5 text-xl font-black text-[#080A0F]">
            ¿Tienes una barbería en {city}?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Crea tu enlace privado de reservas y activa tu presencia en {city} para captar
            clientes nuevos. Sin comisión por cita.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="btn-gold">
              Añadir mi barbería
            </Link>
            <Link href="/barberias" className="btn-outline">
              Ver todas las ciudades
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
