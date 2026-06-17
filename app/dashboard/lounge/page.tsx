import { redirect } from "next/navigation";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import {
  ArrowRight,
  Bot,
  ExternalLink,
  MessageCircle,
  Package,
  QrCode,
  Settings,
  Sparkles,
  Star,
  Tag,
  Tv,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getLoungeSettings } from "@/src/lib/lounge/get-lounge-settings";
import { getLoungeMetrics, getLoungeDailyMetrics } from "@/src/lib/lounge/get-lounge-metrics";
import { getLoungePromotions } from "@/src/lib/lounge/promotions";

const LoungeMetricsChart = dynamicImport(
  () => import("@/components/lounge/LoungeMetricsChart"),
  { ssr: false }
);

export const dynamic = "force-dynamic";

export default async function LoungePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("id, name, slug")
    .eq("id", barbershopId)
    .maybeSingle();

  const siteUrl = getConfiguredSiteUrl();
  const slug = barbershop?.slug ?? null;
  const loungePublicUrl = slug ? `${siteUrl}/lounge/${slug}` : null;
  const hasLounge = Boolean(slug);

  // Load real lounge settings, metrics, and promotions
  const [loungeSettings, loungeMetrics, loungeDailyData, loungePromotions] =
    await Promise.all([
      getLoungeSettings(barbershopId),
      getLoungeMetrics(barbershopId),
      getLoungeDailyMetrics(barbershopId),
      getLoungePromotions(supabase, barbershopId),
    ]);

  const isLoungeActive = loungeSettings?.is_active ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Módulo Lounge"
        title="BarberíaOS Lounge"
        description="Convierte tu sala de espera en una máquina de reservas, ventas y reseñas."
        action={
          <div className="flex flex-wrap gap-2">
            {hasLounge && loungePublicUrl ? (
              <a
                href={loungePublicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark"
              >
                <ExternalLink size={15} /> Ver página pública
              </a>
            ) : null}
            <Link href="/dashboard/lounge/settings" className="btn-gold">
              <Settings size={15} /> Configurar Lounge
            </Link>
            <Link href="/dashboard/lounge/qr" className="btn-outline">
              <QrCode size={15} /> QR del Lounge
            </Link>
          </div>
        }
      />

      {/* ── Estado + Badge ── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#D4AF37]">
          <Sparkles size={11} className="text-[#D4AF37]" />
          BarberíaOS Lounge
        </span>
        {hasLounge && isLoungeActive === true ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Activo
          </span>
        ) : hasLounge && isLoungeActive === false ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/[0.08] px-3 py-1 text-xs font-bold text-red-400">
            Inactivo
          </span>
        ) : hasLounge ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Activo
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.08] px-3 py-1 text-xs font-bold text-amber-400">
            Pendiente de slug
          </span>
        )}
      </div>

      {/* ── Link público copiable ── */}
      {hasLounge && loungePublicUrl ? (
        <div className="surface-frame p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
              <QrCode size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-white/90">Tu Lounge público</p>
              <p className="mt-1 text-sm text-white/50">
                Comparte este link o imprime el QR del Lounge para tu sala de espera.
              </p>
              <div className="mt-3 flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3">
                <span className="min-w-0 flex-1 break-all font-mono text-xs font-semibold text-white/60">
                  {loungePublicUrl}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dashboard/lounge/qr" className="btn-gold">
              <QrCode size={15} /> Ver QR del Lounge
            </Link>
            <a
              href={loungePublicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <ExternalLink size={15} /> Ver página pública
            </a>
            <Link href="/dashboard/qr" className="btn-outline">
              <QrCode size={15} /> QR de reservas
            </Link>
          </div>
        </div>
      ) : (
        <div className="surface-frame p-5 md:p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-dashed border-white/[0.10] bg-white/[0.04]">
              <Sparkles size={22} className="text-white/30" />
            </div>
            <p className="font-black text-white/80">Activa BarberíaOS Lounge</p>
            <p className="max-w-sm text-sm leading-6 text-white/50">
              Configura el slug de tu barbería para activar tu página de Lounge pública y
              convertir la sala de espera en un canal de reservas, ventas y reseñas.
            </p>
            <Link href="/dashboard/ajustes" className="btn-dark mt-2">
              Configurar barbería <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* ── Métricas Lounge (gráfico + totales) ── */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="label-section">Rendimiento del Lounge</p>
            <h2 className="section-heading mt-0.5">Métricas de conversión</h2>
            <p className="section-subtext">
              Escaneos, clicks y conversiones de los últimos 30 días.
            </p>
          </div>
        </div>
        <LoungeMetricsChart dailyData={loungeDailyData} totals={loungeMetrics} />
      </section>

      {/* ── Recomendación: crear primera promoción ── */}
      {loungePromotions.length === 0 && (
        <div className="flex items-start gap-4 rounded-[20px] border border-[#D4AF37]/25 bg-[#D4AF37]/[0.05] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <Tag size={18} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white/90">Crea tu primera promoción</p>
            <p className="mt-0.5 text-sm text-white/50">
              Añade una oferta al Lounge para aumentar el ticket medio mientras los clientes esperan.
            </p>
          </div>
          <Link href="/dashboard/lounge/promotions" className="btn-gold shrink-0">
            Crear oferta
          </Link>
        </div>
      )}

      {/* ── Productos destacados ── */}
      <section className="surface-frame p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Package size={16} className="text-[#C9922A]" />
              <p className="label-section">Productos destacados</p>
            </div>
            <h2 className="section-heading mt-1">Lo que ven tus clientes en espera</h2>
            <p className="section-subtext">
              Añade productos y servicios que tus clientes podrán descubrir mientras esperan.
            </p>
          </div>
          <Link href="/dashboard/inventario" className="btn-outline shrink-0">
            Ver inventario <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-5 flex flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/[0.08] bg-white/[0.04]">
            <Package size={20} className="text-white/30" />
          </div>
          <p className="font-black text-white/70">Sin productos configurados</p>
          <p className="max-w-sm text-sm leading-6 text-white/40">
            Añade productos en tu inventario para que aparezcan en el Lounge. Tus clientes
            podrán mostrar interés mientras esperan su turno.
          </p>
          <Link href="/dashboard/inventario" className="btn-primary mt-1">
            Añadir productos
          </Link>
        </div>
      </section>

      {/* ── Promociones Lounge ── */}
      <section className="surface-frame p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-[#C9922A]" />
              <p className="label-section">Promociones Lounge</p>
            </div>
            <h2 className="section-heading mt-1">Ofertas en la sala de espera</h2>
            <p className="section-subtext">
              {loungePromotions.length > 0
                ? `${loungePromotions.length} promoción${loungePromotions.length > 1 ? "es" : ""} configurada${loungePromotions.length > 1 ? "s" : ""}.`
                : "Crea promociones para aumentar el ticket medio."}
            </p>
          </div>
          <Link href="/dashboard/lounge/promotions" className="btn-gold shrink-0">
            Gestionar promociones <ArrowRight size={14} />
          </Link>
        </div>

        {loungePromotions.length > 0 ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {loungePromotions.slice(0, 4).map((promo) => (
              <div
                key={promo.id}
                className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05] px-4 py-3"
              >
                <Tag size={14} className="shrink-0 text-[#D4AF37]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white/85">{promo.title}</p>
                  {promo.price_label && (
                    <p className="text-xs text-[#D4AF37]/80">{promo.price_label}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                    promo.active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-white/[0.05] text-white/35"
                  }`}
                >
                  {promo.active ? "Activa" : "Inactiva"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center justify-center gap-3 rounded-[20px] border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-white/[0.08] bg-white/[0.04]">
              <Tag size={20} className="text-white/30" />
            </div>
            <p className="font-black text-white/70">Sin promociones configuradas</p>
            <p className="max-w-sm text-sm leading-6 text-white/40">
              Crea tu primera oferta para que aparezca en el Lounge y capture
              la atención de tus clientes mientras esperan.
            </p>
            <Link href="/dashboard/lounge/promotions" className="btn-gold mt-1">
              Crear primera promoción
            </Link>
          </div>
        )}
      </section>

      {/* ── Servicios upgrade ── */}
      <section className="surface-frame p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#C9922A]" />
              <p className="label-section">Servicios upgrade</p>
            </div>
            <h2 className="section-heading mt-1">Upsell en sala de espera</h2>
            <p className="section-subtext">
              Los clientes pueden descubrir servicios adicionales mientras esperan: barba, cejas, lavado premium.
            </p>
          </div>
          <Link href="/dashboard/servicios" className="btn-outline shrink-0">
            Ver servicios <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Arreglo de barba", "Diseño de cejas", "Lavado premium", "Tratamiento facial", "Mascarilla hidratante"].map(
            (service) => (
              <div
                key={service}
                className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.05] px-4 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/15">
                  <Sparkles size={14} className="text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm font-black text-white/85">{service}</p>
                  <p className="text-xs text-white/40">Actívalo en Servicios</p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── Canales de conversión ── */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface-frame p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-[#C9922A]" />
            <p className="label-section">Reseñas en Google</p>
          </div>
          <h3 className="section-heading">Pide reseñas desde el Lounge</h3>
          <p className="section-subtext mt-1">
            El botón "Dejar reseña en Google" aparecerá en tu Lounge público para que los
            clientes lo hagan mientras esperan.
          </p>
          <Link href="/dashboard/resenas" className="mt-4 btn-outline w-full">
            Configurar reseñas <ArrowRight size={14} />
          </Link>
        </div>

        <div className="surface-frame p-5 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-[#C9922A]" />
            <p className="label-section">WhatsApp directo</p>
          </div>
          <h3 className="section-heading">Botón de contacto rápido</h3>
          <p className="section-subtext mt-1">
            El botón "Hablar con la barbería" en el Lounge abre WhatsApp directamente. Sin
            esperar, sin formularios.
          </p>
          <Link href="/dashboard/ajustes" className="mt-4 btn-outline w-full">
            Configurar WhatsApp <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Agente Lounge (Próximamente) ── */}
      <section className="flex items-start gap-4 rounded-[20px] border border-white/[0.07] bg-white/[0.03] p-5 opacity-75">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
          <Bot size={20} className="text-white/35" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-white/70">Agente Lounge IA</h3>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[10px] font-black uppercase text-white/40">
              Próximamente
            </span>
            <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] font-black uppercase text-[#D4AF37]">
              Premium IA
            </span>
          </div>
          <p className="mt-1 text-sm leading-5 text-white/40">
            Tu Agente Lounge detectará qué productos, promociones y servicios generan más interés
            para recomendar acciones automáticas y maximizar la conversión en sala de espera.
          </p>
          <p className="mt-2 text-xs font-semibold text-white/30">
            Estado: Próximamente · Premium IA
          </p>
        </div>
      </section>

      {/* ── Próximamente ── */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="flex items-start gap-4 rounded-[20px] border border-white/[0.07] bg-white/[0.03] p-5 opacity-70">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
            <Tv size={20} className="text-white/35" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white/70">Lounge TV</h3>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[10px] font-black uppercase text-white/40">
                Próximamente
              </span>
            </div>
            <p className="mt-1 text-sm leading-5 text-white/40">
              Pantalla para sala de espera con agenda del día, promociones y contenido de
              marca. Tu barbería, siempre activa.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-[20px] border border-white/[0.07] bg-white/[0.03] p-5 opacity-70">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
            <Tag size={20} className="text-white/35" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white/70">Lounge Ads</h3>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[10px] font-black uppercase text-white/40">
                Próximamente
              </span>
            </div>
            <p className="mt-1 text-sm leading-5 text-white/40">
              Publicidad de productos locales en tu sala de espera. Genera ingresos
              adicionales mientras tus clientes esperan su turno.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
