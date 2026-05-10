import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Store, ShoppingBag, ArrowRight } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { SITE_URL } from "@/src/lib/site-url";
import { PageHeader } from "@/components/ui/PageHeader";
import { MarketplaceClient, type PublicProfile } from "./MarketplaceClient";

export const metadata: Metadata = {
  title: "Marketplace | BarberíaOS",
  description: "Configura tu perfil público y aparece en el marketplace de BarberíaOS.",
};

export default async function MarketplacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const [{ data: profileRow }, { data: barbershop }] = await Promise.all([
    supabase
      .from("barbershop_public_profiles")
      .select(
        "id, slug, public_name, city, neighborhood, address, phone, whatsapp, instagram, website_url, description, cover_image_url, logo_url, is_published, marketplace_enabled"
      )
      .eq("barbershop_id", barbershopId)
      .maybeSingle(),
    supabase
      .from("barbershops")
      .select("name, slug, city")
      .eq("id", barbershopId)
      .single(),
  ]);

  const profile = profileRow as PublicProfile | null;

  const defaultSlug = barbershop?.slug
    ? barbershop.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    : "";

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
