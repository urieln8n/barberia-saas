import type { Metadata } from "next";
import Link from "next/link";
import { Scissors, MapPin } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-[#C9922A]/20 bg-[#C9922A]/5 shadow-sm">
        <Scissors size={32} className="text-[#C9922A]" />
      </div>
      <h2 className="mt-6 text-xl font-black text-[#080A0F]">
        Aún no hay barberías en el directorio
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        Las primeras barberías están activando su presencia pública. Vuelve pronto o
        reserva directamente si ya tienes el enlace de tu barbería.
      </p>
      <Link href="/" className="btn-gold mt-8">
        Volver al inicio
      </Link>
    </div>
  );
}

export default async function BarberiasPage() {
  const profiles = await getMarketplaceProfiles();
  const cityGroups = getCityGroups(profiles);

  return (
    <main className="min-h-screen bg-[#F6F8FB]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#080A0F] py-16 text-white md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,168,76,0.20),transparent_44%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.18),transparent_44%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-white/60 text-sm font-semibold hover:text-white transition">
              BarberíaOS
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-sm font-semibold text-white/80">Barberías</span>
          </div>

          <div className="mt-8">
            <p className="label-section text-[#D5A84C]">Marketplace</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Encuentra tu barbería
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/65">
              Barberías profesionales con reserva online. Elige ciudad, elige profesional,
              reserva en segundos — sin llamadas, sin esperas.
            </p>
          </div>

          {/* City pills */}
          {cityGroups.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {cityGroups.map(([city, count]) => (
                <Link
                  key={city}
                  href={`/barberias/${encodeURIComponent(city.toLowerCase().trim())}`}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                >
                  <MapPin size={11} />
                  {city}
                  <span className="ml-0.5 rounded-full bg-white/15 px-1.5 py-0.5 text-[10px] font-black">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {profiles.length === 0 ? (
          <EmptyMarketplace />
        ) : (
          <BarberiasClient profiles={profiles} />
        )}

        {/* Bottom CTA — for barbershop owners */}
        <div className="mt-16 rounded-[28px] border border-[#C9922A]/20 bg-gradient-to-br from-[#C9922A]/5 to-transparent p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#080A0F]">
            <Scissors size={20} className="text-[#C9922A]" />
          </div>
          <h2 className="mt-5 text-xl font-black text-[#080A0F]">
            ¿Eres dueño de una barbería?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Crea tu perfil, activa tu enlace privado de reservas y decide si quieres aparecer
            en el directorio para captar nuevos clientes. Sin comisión por cita.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/login" className="btn-gold">
              Crear mi cuenta gratis
            </Link>
            <Link href="/" className="btn-outline">
              Ver planes y precios
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
