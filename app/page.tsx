import Link from "next/link";
import type { Metadata } from "next";
import type { HTMLAttributes } from "react";
import {
  ArrowRight,
  BadgeEuro,
  Bot,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Crown,
  Instagram,
  Megaphone,
  MessageCircle,
  Printer,
  QrCode,
  ScanBarcode,
  Scissors,
  Sparkles,
  Star,
  Tablet,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import { LandingExperience, MotionSection } from "@/components/landing/PremiumLandingMotion";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionIntro } from "@/components/landing/SectionIntro";
import { DashboardMockup } from "@/components/landing/DashboardMockup";
import { PublicBookingMockup } from "@/components/landing/PublicBookingMockup";
import { LandingCTABlock } from "@/components/landing/LandingCTABlock";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import { Hero3DBarberia } from "@/components/landing/Hero3DBarberia";
import { QRBookingSection } from "@/components/landing/QRBookingSection";
import { AgendaPreviewSection } from "@/components/landing/AgendaPreviewSection";
import { CashCounterSection } from "@/components/landing/CashCounterSection";
import { ActivationTimeline } from "@/components/landing/ActivationTimeline";
import { PremiumPricingSection } from "@/components/landing/PremiumPricingSection";

const CONTACT_EMAIL = BUSINESS_CONFIG.legalEmail;
const WHATSAPP_URL = BUSINESS_CONFIG.whatsappUrl;
const DEMO_BOOKING_URL = BUSINESS_CONFIG.demoBookingUrl;
const DEMO_URL = BUSINESS_CONFIG.demoUrl;
const REQUEST_DEMO_URL = "/pedir-demo";
const CALCULATOR_URL = "/calculadora-booksy";

export const metadata: Metadata = {
  title: "BarberíaOS | Software para barberías con reservas, caja y clientes",
  description:
    "Gestiona reservas, caja, clientes, barberos, productos, QR y campañas de crecimiento para tu barbería sin depender de plataformas externas.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/` },
  openGraph: {
    title: "BarberíaOS | Software para barberías con reservas, caja y clientes",
    description:
      "Gestiona reservas, caja, clientes, barberos, productos, QR y campañas de crecimiento para tu barbería.",
    url: `${BUSINESS_CONFIG.siteUrl}/`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
  },
};

const controls = [
  ["Reservas", "Link y QR para que el cliente reserve sin escribirte por WhatsApp.", CalendarCheck2],
  ["Agenda", "Citas por día, servicio, barbero y estado desde un panel claro.", Clock3],
  ["Clientes", "Historial y base propia para que el cliente vuelva a tu barbería.", Users],
  ["Caja", "Servicios, productos, métodos de pago y cierre diario en orden.", WalletCards],
  ["Equipo", "Barberos, servicios, rendimiento y ocupación sin hojas sueltas.", Scissors],
  ["Crecimiento", "Mensajes, reseñas y campañas manuales para llenar huecos.", Megaphone],
] as const;

const operatingBlocks = [
  {
    eyebrow: "Reservas con QR",
    title: "El cliente escanea, elige servicio y reserva sin escribirte.",
    text: "Pon el QR en mostrador, escaparate, Instagram o tarjetas. BarberíaOS convierte ese tráfico en reservas ordenadas dentro de tu agenda.",
    icon: QrCode,
    stat: "24/7",
    label: "Reservas abiertas",
    points: ["Enlace público de reservas", "Servicios y barberos visibles", "Menos llamadas y menos mensajes sueltos"],
  },
  {
    eyebrow: "Caja + productos",
    title: "Cada corte, producto y propina queda registrado al cerrar el día.",
    text: "El dueño ve lo que entra, qué barbero genera más y qué se vendió en mostrador sin depender de memoria, papel o una hoja perdida.",
    icon: CircleDollarSign,
    stat: "1 panel",
    label: "Ventas y caja",
    points: ["Cobros por método de pago", "Ventas por barbero", "Productos conectados a caja"],
  },
  {
    eyebrow: "IA del dueño",
    title: "Un copiloto para detectar huecos, clientes dormidos y acciones claras.",
    text: "La IA no sustituye al dueño: le da contexto. Qué publicar, a quién recuperar, qué servicio empujar y dónde se está escapando dinero.",
    icon: Bot,
    stat: "IA",
    label: "Decisiones rápidas",
    points: ["Prompts para campañas", "Ideas para Instagram", "Resumen operativo del negocio"],
  },
] as const;

const marketingFeatures = [
  ["Clientes dormidos", "Detecta quién dejó de venir y prepara una acción antes de perderlo.", Clock3],
  ["Reseñas", "Activa mensajes para pedir reseña cuando el cliente sale satisfecho.", Star],
  ["Prompts virales", "Ideas de posts, reels y copies hechos para barberías, no para empresas genéricas.", Sparkles],
  ["Campañas manuales", "Lanza acciones por WhatsApp o Instagram conectadas a huecos reales.", Zap],
] as const;

const kitItems = [
  ["QR de reservas", "Enlace propio para mostrador, espejo, Instagram, Google y WhatsApp.", QrCode],
  ["Carteles descargables", "Materiales imprimibles para que el QR se vea dentro del local.", Printer],
  ["Mensajes listos", "Textos para WhatsApp, bio de Instagram e historias sin improvisar.", MessageCircle],
  ["Setup recomendado", "Tablet, soporte, impresora y caja como guía de compra, no hardware propio.", Tablet],
] as const;

const activationSteps = [
  ["Día 1", "Configuramos barbería, servicios, barberos, enlace público y QR."],
  ["Día 2", "Revisamos agenda, caja básica, materiales del Kit y primer flujo de reservas."],
  ["Después", "Te quedas con checklist, mensajes y soporte para operar sin depender de papel."],
] as const;

const founderBenefits = [
  "Activación guiada de la barbería",
  "Ajuste de servicios, barberos y QR inicial",
  "Feedback directo para priorizar mejoras reales",
  "Condiciones fundadoras mientras el programa esté abierto",
] as const;

const demoDeliverables = [
  "Diagnóstico rápido de cómo reservas hoy",
  "Demo de la página pública y QR",
  "Recorrido por agenda, caja, clientes y Kit",
  "Recomendación honesta del plan adecuado",
] as const;

const comparisons = [
  ["Agenda tradicional", "Apunta citas, pero no conecta clientes, caja, productos ni marketing."],
  ["Plataformas con comisión", "Te dan visibilidad, pero condicionan la relación con el cliente y tus datos."],
  ["BarberíaOS", "Une reservas, caja, clientes, productos, QR, marketing e IA del dueño."],
] as const;

const threeSteps = [
  ["1", "Compartes tu enlace o QR."],
  ["2", "El cliente reserva sin descargar app."],
  ["3", "Tú controlas agenda, caja, clientes y barberos desde un panel."],
] as const;

const beforeAfter = [
  {
    title: "Antes",
    points: [
      "Reservas por mensajes sueltos.",
      "Caja sin control.",
      "Clientes perdidos.",
      "Comisiones o dependencia de plataformas.",
    ],
  },
  {
    title: "Después",
    points: [
      "Link propio.",
      "QR en local e Instagram.",
      "Clientes propios.",
      "Caja y barberos en un panel.",
      "Marketing Studio para llenar huecos.",
    ],
  },
] as const;

const comparisonRows = [
  ["Reservas online", "Manual", "Según plataforma", "Sí"],
  ["Link propio", "No", "Limitado", "Sí"],
  ["QR propio", "No", "Limitado", "Sí"],
  ["Control de caja", "No", "Parcial", "Sí"],
  ["Base de clientes propia", "Dispersa", "Clientes gestionados dentro de la plataforma", "Sí"],
  ["Control por barbero", "Manual", "Parcial", "Sí"],
  ["Marketing/retención", "Manual", "Limitado al canal", "Marketing Studio"],
  ["Comisión por reserva", "No", "Posible comisión en ciertos modelos", "0%"],
  ["Dependencia de plataforma", "Baja, pero sin sistema", "Mayor dependencia del canal", "Canal propio"],
  ["Activación guiada", "No", "Variable", "Sí"],
] as const;

const proofPoints = [
  "Demo pública funcional",
  "Dashboard activo",
  "Reservas online",
  "QR de reservas",
  "Caja",
  "Clientes",
  "Marketing Studio",
  "Roadmap: reseñas IA, recepcionista WhatsApp, inventario/caja avanzada",
] as const;

const plans = [
  {
    name: "Arranca",
    price: "39 €",
    description: "Para dejar atrás WhatsApp y papel con una base profesional.",
    forWho: "Barberías pequeñas o barberos que quieren ordenar reservas.",
    limits: "Hasta 2 barberos · activación asistida básica",
    featured: false,
    features: ["Reservas online", "Agenda y clientes", "QR de reservas", "Caja básica", "Página pública", "Soporte por WhatsApp"],
  },
  {
    name: "Control",
    price: "79 €",
    description: "Para barberías con equipo que quieren control diario y marketing.",
    forWho: "Locales con equipo, caja diaria y venta de productos.",
    limits: "Hasta 5 barberos · Kit de activación incluido",
    featured: true,
    features: ["Todo en Arranca", "Caja avanzada", "Productos", "Marketing Studio", "Clientes dormidos", "Rendimiento por barbero", "Materiales QR guiados"],
  },
  {
    name: "Domina",
    price: "149 €",
    description: "Para dueños que quieren crecimiento, IA y visión completa del negocio.",
    forWho: "Dueños que quieren recuperar clientes y tomar decisiones con datos.",
    limits: "Hasta 10 barberos · revisión mensual de crecimiento",
    featured: false,
    features: ["Todo en Control", "IA del dueño", "CRM de leads", "Reportes avanzados", "Campañas de recuperación", "Soporte prioritario", "Sesión mensual de optimización"],
  },
] as const;

const faqs = [
  ["¿BarberíaOS es solo una agenda?", "No. La agenda es una parte. BarberíaOS conecta reservas, caja, clientes, barberos, productos, QR, marketing e IA en un solo sistema."],
  ["¿Cobra comisión por reserva?", "No. El modelo es plan mensual fijo. Tus clientes, tus datos y tu relación comercial siguen siendo tuyos."],
  ["¿Mis clientes tienen que instalar una app?", "No. Reservan desde el navegador con tu link público, tu QR o el botón que compartes por Instagram y WhatsApp."],
  ["¿El hardware lo vende BarberíaOS?", "No por ahora. Te recomendamos tablet, soporte, impresora o caja si encajan con tu local, pero no prometemos hardware propio."],
] as const;

const cityLinks = [
  { city: "Madrid", slug: "madrid", desc: "Reservas, caja y QR para barberías en Madrid" },
  { city: "Barcelona", slug: "barcelona", desc: "Software de gestión para barberías en Barcelona" },
  { city: "Valencia", slug: "valencia", desc: "Agenda y reservas online para barberías en Valencia" },
  { city: "Sevilla", slug: "sevilla", desc: "Reservas sin comisión para barberías en Sevilla" },
  { city: "Bilbao", slug: "bilbao", desc: "Panel de barbería con caja e IA en Bilbao" },
  { city: "Málaga", slug: "malaga", desc: "QR y reservas online para barberías en Málaga" },
] as const;

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_CONFIG.commercialName,
    url: BUSINESS_CONFIG.siteUrl,
    email: BUSINESS_CONFIG.legalEmail,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: BUSINESS_CONFIG.supportEmail,
      url: `${BUSINESS_CONFIG.siteUrl}/demo`,
      areaServed: "ES",
      availableLanguage: ["es"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BUSINESS_CONFIG.commercialName,
    url: BUSINESS_CONFIG.siteUrl,
    inLanguage: "es-ES",
    publisher: {
      "@type": "Organization",
      name: BUSINESS_CONFIG.commercialName,
      url: BUSINESS_CONFIG.siteUrl,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BUSINESS_CONFIG.commercialName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: BUSINESS_CONFIG.siteUrl,
    description:
      "Software SaaS para barberías con reservas online, agenda, caja, clientes, productos, QR, marketing e IA del dueño.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: "39",
      highPrice: "149",
      offerCount: "3",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: BUSINESS_CONFIG.siteUrl,
      },
    ],
  },
];

// ── Local layout helpers ───────────────────────────────────────────────────────

function Shell({ children, className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <MotionSection className={`px-5 py-16 md:py-24 lg:px-8 ${className}`} {...props}>
      {children}
    </MotionSection>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#D5A84C]/20 bg-[#D5A84C]/[0.05] px-3 py-1 text-xs font-bold text-white/70">
      {children}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <LandingExperience>
      {/* Skip navigation for accessibility */}
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-2xl focus:bg-[#2563EB] focus:px-4 focus:py-2 focus:text-sm focus:font-black focus:text-white"
      >
        Saltar al contenido
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      <div id="contenido-principal" className="landing-canvas text-white">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/82 px-5 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#080A0F] ring-1 ring-[#D5A84C]/25">
                <Scissors size={18} />
              </span>
              <span className="font-black tracking-tight">BarberíaOS</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-bold text-white/54 md:flex" aria-label="Navegación principal">
              <ul className="flex items-center gap-6">
                <li><Link href="#controla" className="transition hover:text-white">Producto</Link></li>
                <li><Link href="#activacion" className="transition hover:text-white">Activación</Link></li>
                <li><Link href="/barberias-fundadoras" className="transition hover:text-white">Fundadoras</Link></li>
                <li><Link href="#precios" className="transition hover:text-white">Precios</Link></li>
                <li><Link href={CALCULATOR_URL} className="transition hover:text-white">Calculadora</Link></li>
              </ul>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-2xl px-4 py-2 text-sm font-black text-white/70 transition hover:text-white"
              >
                Entrar al panel
              </Link>
              <Link
                href={REQUEST_DEMO_URL}
                className="hidden rounded-2xl border border-[#D5A84C]/30 bg-[#D5A84C]/10 px-4 py-2 text-sm font-black text-[#D5A84C] transition hover:bg-[#D5A84C]/18 sm:inline-flex"
              >
                Pedir demo
              </Link>
            </div>
          </div>
        </header>

        {/* ── Hero — Premium 3D ──────────────────────────────────────────────── */}
        <Hero3DBarberia />

        {/* ── Qué controla ───────────────────────────────────────────────────── */}
        <Shell id="controla" className="landing-section-graphite border-t border-white/10">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Qué controla BarberíaOS"
              title="Un sistema claro para dueños de barbería, no otra app que nadie usa."
              text="BarberíaOS está pensado para locales que viven entre WhatsApp, agenda, caja, clientes y productos. El objetivo es simple: que el dueño sepa qué pasa y que el cliente pueda reservar sin fricción."
              center
            />
            <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {controls.map(([title, text, Icon], i) => {
                const isGold = i === 0 || i === 3;
                const stat = i === 0 ? "24/7" : i === 3 ? "1 panel" : null;
                return (
                  <article
                    key={title}
                    className={`rounded-[24px] p-5 ${i === 0 ? "col-span-2 lg:col-span-1" : ""} ${isGold ? "bento-gold-feature" : "premium-dark-card"}`}
                    data-gsap-premium="feature"
                  >
                    <div className="flex items-start justify-between">
                      <Icon size={22} className={isGold ? "text-[#D5A84C]" : "text-[#38BDF8]"} />
                      {stat && <span className="text-xl font-black text-[#D5A84C]/65">{stat}</span>}
                    </div>
                    <h3 className="mt-5 text-xl font-black text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </Shell>

        {/* ── QR Booking flow — Premium animated section ──────────────────────── */}
        <QRBookingSection id="funciona" />

        {/* ── Agenda Preview ──────────────────────────────────────────────────── */}
        <AgendaPreviewSection />

        {/* ── Flujo de conversión ───────────────────────────────────────────── */}
        <Shell className="landing-section-dark">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Cómo funciona"
              title="De Instagram, Google, WhatsApp o QR a una reserva ordenada."
              text="El flujo comercial es simple: calculas el ahorro, ves la demo pública y pides un diagnóstico si quieres activarlo con acompañamiento."
              center
            />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {threeSteps.map(([step, text]) => (
                <article key={step} className="premium-dark-card rounded-[24px] p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#38BDF8]/12 text-lg font-black text-[#38BDF8]">
                    {step}
                  </span>
                  <p className="mt-5 text-lg font-black leading-7 text-white">{text}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <PrimaryButton href={CALCULATOR_URL} variant="premiumBlue" className="min-h-12 px-7">
                Calcular mi ahorro <ArrowRight size={17} />
              </PrimaryButton>
              <PrimaryButton href={DEMO_BOOKING_URL} variant="ghost" className="premium-cta-glass min-h-12 px-7 hover:bg-white/[0.12] hover:text-white">
                Ver demo interactiva <QrCode size={17} />
              </PrimaryButton>
              <PrimaryButton href={REQUEST_DEMO_URL} variant="ghost" className="premium-cta-glass min-h-12 px-7 hover:bg-white/[0.12] hover:text-white">
                Pedir diagnóstico gratis <ArrowRight size={17} />
              </PrimaryButton>
            </div>
          </div>
        </Shell>

        {/* ── Antes / Después ───────────────────────────────────────────────── */}
        <Shell className="landing-section-graphite">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-2">
              {beforeAfter.map((block, index) => (
                <article
                  key={block.title}
                  className={`rounded-[28px] border p-6 md:p-7 ${
                    index === 1
                      ? "border-[#38BDF8]/25 bg-[#38BDF8]/[0.06]"
                      : "border-white/10 bg-white/[0.045]"
                  }`}
                >
                  <h2 className={`text-3xl font-black ${index === 1 ? "text-[#38BDF8]" : "text-white"}`}>
                    {block.title}
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {block.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm font-bold leading-6 text-white/70">
                        <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${index === 1 ? "text-[#38BDF8]" : "text-white/35"}`} />
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </Shell>

        {/* ── Activación ─────────────────────────────────────────────────────── */}
        <Shell id="activacion" className="landing-section-dark">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="Activación en 48h"
                title="No compras solo una herramienta: sales con tu barbería configurada."
                text="En una demo validamos si encaja. Si avanzas, dejamos configurado lo esencial: servicios, barberos, enlace de reservas, QR, agenda y primeros materiales para compartir."
              />
              <LandingCTABlock
                primaryHref={REQUEST_DEMO_URL}
                primaryLabel="Pedir diagnóstico gratis"
                secondaryHref={DEMO_BOOKING_URL}
                secondaryLabel="Ver demo interactiva"
                className="mt-8"
              />
            </div>
            <div className="grid gap-3">
              {activationSteps.map(([step, text]) => (
                <article key={step} className="premium-dark-card rounded-[24px] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D5A84C]/25 bg-[#D5A84C]/10 text-sm font-black text-[#D5A84C]">
                      {step}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{step === "Después" ? "Acompañamiento" : `Activación ${step}`}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/58">{text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Shell>

        {/* ── Reservas con QR ────────────────────────────────────────────────── */}
        <Shell className="landing-section-graphite">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="Reservas con QR"
                title="Tu mostrador, espejo e Instagram pueden mandar reservas al mismo sistema."
                text="El cliente entra desde tu QR o enlace, elige servicio, barbero y hora. Tú ves la reserva en la agenda sin perseguir conversaciones sueltas."
              />
              <LandingCTABlock
                primaryHref={DEMO_BOOKING_URL}
                primaryLabel="Ver demo interactiva"
                secondaryHref={REQUEST_DEMO_URL}
                secondaryLabel="Pedir diagnóstico"
                className="mt-8"
              />
            </div>
            <PublicBookingMockup />
          </div>
        </Shell>

        {/* ── BarberíaOS Kit ─────────────────────────────────────────────────── */}
        <Shell className="landing-section-graphite">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="BarberíaOS Kit"
                title="Del software al local: QR, carteles, mensajes y setup recomendado."
                text="El Kit convierte BarberíaOS en algo visible dentro de la barbería. Incluye QR de reservas, materiales descargables, mensajes para WhatsApp e Instagram, checklist de activación y recomendaciones de tablet, impresora o caja si encajan con tu operación."
              />
              <LandingCTABlock
                primaryHref={WHATSAPP_URL}
                secondaryHref={DEMO_URL}
                className="mt-8"
              />
            </div>

            <div className="grid gap-4">
              <div className="premium-blue-panel rounded-[28px] p-5 md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase text-[#38BDF8]">Kit incluido en la activación</p>
                    <h3 className="mt-2 text-2xl font-black text-white">Materiales para pasar de "tengo software" a "mis clientes reservan".</h3>
                  </div>
                  <QrCode size={34} className="shrink-0 text-[#38BDF8]" />
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {[
                    ["Cartel A4", Printer],
                    ["Story IG", Instagram],
                    ["Setup local", ScanBarcode],
                  ].map(([label, Icon]) => {
                    const TypedIcon = Icon as typeof Printer;
                    return (
                      <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.07] p-3">
                        <TypedIcon size={18} className="text-[#38BDF8]" />
                        <p className="mt-3 text-sm font-black text-white">{label as string}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {kitItems.map(([title, text, Icon]) => (
                  <article key={title} className="premium-dark-card rounded-[24px] p-5" data-gsap-premium="feature">
                    <Icon size={21} className="text-[#38BDF8]" />
                    <h3 className="mt-4 text-lg font-black text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/54">{text}</p>
                  </article>
                ))}
              </div>
              <p className="text-xs font-bold leading-5 text-white/40">
                BarberíaOS no fabrica hardware propio. El Kit incluye materiales digitales y una guía honesta de setup recomendado para tu local.
              </p>
            </div>
          </div>
        </Shell>

        {/* ── Operating blocks ───────────────────────────────────────────────── */}
        <Shell className="landing-section-graphite">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-3">
              {operatingBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <article key={block.title} className="premium-blue-card flex min-h-full flex-col rounded-[28px] p-6" data-gsap-premium="feature">
                    <div className="flex items-center justify-between">
                      <Icon size={24} className="text-[#38BDF8]" />
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">{block.stat}</p>
                        <p className="text-[10px] font-black uppercase text-white/35">{block.label}</p>
                      </div>
                    </div>
                    <p className="mt-6 text-xs font-black uppercase text-[#38BDF8]">{block.eyebrow}</p>
                    <h3 className="mt-3 text-2xl font-black leading-tight text-white">{block.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/56">{block.text}</p>
                    <ul className="mt-6 space-y-3">
                      {block.points.map((point) => (
                        <li key={point} className="flex items-center gap-3 text-sm font-bold text-white/72">
                          <CheckCircle2 size={16} className="shrink-0 text-[#38BDF8]" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </Shell>

        {/* ── Prueba operativa ──────────────────────────────────────────────── */}
        <Shell className="landing-section-dark">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <SectionIntro
                eyebrow="Sistema vivo"
                title="Un sistema vivo para barberías modernas."
                text="Producto en construcción real, no humo: puedes abrir la demo pública, ver el flujo de reservas y revisar los módulos operativos sin depender de testimonios inventados."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {proofPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#38BDF8]" />
                    <p className="text-sm font-bold leading-6 text-white/74">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryButton href={DEMO_BOOKING_URL} variant="premiumBlue" className="min-h-12 px-7">
                Abrir demo pública <ArrowRight size={17} />
              </PrimaryButton>
              <PrimaryButton href={REQUEST_DEMO_URL} variant="ghost" className="premium-cta-glass min-h-12 px-7 hover:bg-white/[0.12] hover:text-white">
                Pedir diagnóstico <ArrowRight size={17} />
              </PrimaryButton>
            </div>
          </div>
        </Shell>

        {/* ── Marketing Studio ───────────────────────────────────────────────── */}
        <Shell id="marketing" className="landing-section-dark">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <SectionIntro
                eyebrow="Marketing Studio"
                title="Convierte huecos, clientes dormidos y reseñas en acciones."
                text="BarberíaOS no promete magia. Te da señales: quién no volvió, qué hueco conviene empujar, qué mensaje enviar y qué campaña puede generar reservas reales."
              />
              <div className="premium-blue-panel rounded-[28px] p-6">
                <p className="text-sm font-black text-white">Próxima acción sugerida</p>
                <p className="mt-3 text-2xl font-black leading-tight text-white">
                  Recupera 18 clientes con una campaña de corte + barba antes del viernes.
                </p>
                <div className="mt-5 flex items-center gap-3 text-sm font-bold text-[#38BDF8]">
                  <Bot size={17} />
                  Generado para el dueño, basado en actividad real
                </div>
              </div>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {marketingFeatures.map(([title, text, Icon]) => (
                <article key={title} className="premium-dark-card rounded-[24px] p-5" data-gsap-premium="feature">
                  <Icon size={21} className="text-[#38BDF8]" />
                  <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/54">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </Shell>

        {/* ── Cash counter — animated revenue section ─────────────────────────── */}
        <CashCounterSection />

        {/* ── Comparativa ────────────────────────────────────────────────────── */}
        <Shell className="landing-section-graphite">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Comparativa honesta"
              title="La diferencia no es tener reservas. Es tener el negocio conectado."
              center
            />

            {/* Sin comisión — callout gold agresivo */}
            <div className="mt-10 rounded-[28px] border border-[#D5A84C]/25 bg-gradient-to-r from-[#D5A84C]/[0.07] via-[#D5A84C]/[0.03] to-transparent p-5 shadow-[0_0_60px_rgba(213,168,76,0.07),inset_0_1px_0_rgba(213,168,76,0.12)] md:p-7">
              <div className="flex flex-col items-center gap-5 text-center md:flex-row md:text-left">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D5A84C]/25 bg-[#D5A84C]/10 shadow-[0_0_24px_rgba(213,168,76,0.10)]">
                  <CircleDollarSign size={26} className="text-[#D5A84C]" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-black text-white md:text-xl">
                    0€ de comisión por reserva. Para siempre.
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-white/54">
                    BarberíaOS cobra un precio mensual fijo. Sin porcentajes, sin sorpresas al final del mes. Tus ingresos son completamente tuyos.
                  </p>
                </div>
                <div className="shrink-0 rounded-2xl border border-[#D5A84C]/30 bg-[#D5A84C]/10 px-6 py-4 text-center shadow-[0_0_30px_rgba(213,168,76,0.08)]">
                  <p className="text-4xl font-black text-[#D5A84C]">0%</p>
                  <p className="mt-0.5 text-xs font-bold text-white/45">comisión</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {comparisons.map(([title, text], index) => (
                <article
                  key={title}
                  className={`rounded-[28px] border p-6 ${
                    index === 2
                      ? "border-[#D5A84C]/40 bg-[#D5A84C]/[0.05] shadow-[0_24px_72px_rgba(213,168,76,0.10)]"
                      : "border-[#2F6FEB]/[0.16] bg-white/[0.055]"
                  }`}
                >
                  {index === 2 && (
                    <span className="mb-3 inline-flex rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#D5A84C]">
                      ✦ Recomendado
                    </span>
                  )}
                  <p className={`text-xl font-black ${index === 2 ? "text-[#D5A84C]" : "text-white"}`}>{title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/58">{text}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 overflow-x-auto rounded-[28px] border border-white/10 bg-white/[0.04]">
              <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] border-b border-white/10 bg-white/[0.04] text-xs font-black uppercase text-white/45">
                <div className="p-4">Capacidad</div>
                <div className="p-4">WhatsApp/Papel</div>
                <div className="p-4">Marketplace</div>
                <div className="p-4 text-[#D5A84C]">BarberíaOS</div>
              </div>
              {comparisonRows.map(([feature, manual, marketplace, barberiaos]) => (
                <div key={feature} className="grid grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] border-b border-white/[0.06] text-sm last:border-b-0">
                  <div className="p-4 font-black text-white">{feature}</div>
                  <div className="p-4 text-white/54">{manual}</div>
                  <div className="p-4 text-white/54">{marketplace}</div>
                  <div className="p-4 font-bold text-white/78">{barberiaos}</div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </Shell>

        {/* ── Por ciudad ─────────────────────────────────────────────────────── */}
        <Shell id="ciudades" className="landing-section-graphite border-t border-white/[0.07]">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Por ciudad"
              title="Software para barberías en toda España."
              text="Agenda, caja, QR y página pública para tu barbería. Sin comisión por reserva, en cualquier ciudad."
              center
            />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cityLinks.map(({ city, slug, desc }) => (
                <Link
                  key={city}
                  href={`/barberias/${slug}`}
                  className="group flex items-center justify-between rounded-[20px] border border-white/[0.10] bg-white/[0.04] p-5 transition hover:border-[#D5A84C]/30 hover:bg-[#D5A84C]/[0.04]"
                >
                  <div>
                    <p className="font-black text-white transition group-hover:text-[#D5A84C]">{city}</p>
                    <p className="mt-1 text-sm text-white/45">{desc}</p>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-white/20 transition group-hover:text-[#D5A84C]/60" />
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {([
                ["Alternativa a Booksy", "/alternativa-a-booksy"],
                ["Calculadora Booksy", "/calculadora-booksy"],
                ["¿Cuánto cobra Booksy?", "/blog/cuanto-cobra-booksy"],
                ["Agenda online", "/agenda-online-barberia"],
                ["Software para barberías", "/software-para-barberias"],
                ["Caja para barberías", "/caja-para-barberias"],
                ["Reservas online", "/reservas-online-barberia"],
              ] as const).map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/55 transition hover:border-[#38BDF8]/25 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </Shell>

        {/* ── SEO conversion — Booksy campaign funnel ────────────────────────── */}
        <Shell className="landing-section-dark border-t border-white/[0.07]">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Sin comisiones"
              title="Calcula cuánto puedes ahorrar en comisiones y dependencia de plataformas."
              text="Compara el coste aproximado de trabajar con plataformas y el coste fijo de BarberíaOS. Los cálculos son estimaciones para ayudarte a decidir con más contexto."
              center
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/calculadora-booksy"
                className="premium-dark-card group flex flex-col rounded-[24px] p-6"
              >
                <CircleDollarSign size={22} className="text-[#D5A84C]" />
                <p className="mt-4 text-sm font-black text-white">Calculadora de coste real</p>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Introduce tus reservas y ticket medio. Ve cuánto pagas entre cuota y comisiones vs. precio fijo en BarberíaOS.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-[#D5A84C]">
                  Calcular mi coste <ArrowRight size={13} />
                </span>
              </Link>
              <Link
                href="/alternativa-a-booksy"
                className="premium-dark-card group flex flex-col rounded-[24px] p-6"
              >
                <TrendingUp size={22} className="text-[#D5A84C]" />
                <p className="mt-4 text-sm font-black text-white">Comparativa directa</p>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Comisiones, propiedad de datos, marketplace, soporte. La comparativa sin letra pequeña entre plataformas externas y BarberíaOS.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-[#D5A84C]">
                  Ver comparativa <ArrowRight size={13} />
                </span>
              </Link>
              <Link
                href="/blog/cuanto-cobra-booksy"
                className="premium-dark-card group flex flex-col rounded-[24px] p-6 sm:col-span-2 lg:col-span-1"
              >
                <BadgeEuro size={22} className="text-[#38BDF8]" />
                <p className="mt-4 text-sm font-black text-white">Guía: ¿cuánto cobra Booksy de verdad?</p>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Desglose real de comisiones Boost, qué pasa con tus datos y cómo migrar sin perder ningún cliente.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-[#38BDF8]">
                  Leer guía <ArrowRight size={13} />
                </span>
              </Link>
            </div>
          </div>
        </Shell>

        {/* ── Programa Fundadoras ────────────────────────────────────────────── */}
        <Shell id="fundadoras" className="landing-section-dark">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="Programa Barberías Fundadoras"
                title="Estamos abriendo plazas para barberías que quieren implantarlo con acompañamiento."
                text="No vamos a inventar casos reales. El programa fundador existe para trabajar con dueños que quieran ordenar reservas, caja y clientes con una activación guiada, feedback directo y condiciones iniciales claras."
              />
              <LandingCTABlock
                primaryHref="/pedir-demo?interest=barberia-fundadora"
                primaryLabel="Solicitar plaza fundadora"
                secondaryHref="/barberias-fundadoras"
                secondaryLabel="Ver oferta fundadora"
                className="mt-8"
              />
            </div>
            <div className="premium-blue-panel rounded-[30px] p-6">
              <p className="text-xs font-black uppercase text-[#38BDF8]">Qué incluye</p>
              <div className="mt-5 grid gap-3">
                {founderBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.065] p-4">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#38BDF8]" />
                    <p className="text-sm font-bold leading-6 text-white/76">{benefit}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs font-semibold leading-5 text-white/45">
                Sin prometer resultados falsos: se valida caso a caso, con datos de tu barbería y una recomendación honesta de plan.
              </p>
            </div>
          </div>
        </Shell>

        {/* ── Precios — replaced by PremiumPricingSection below ──────────────── */}

        {/* ── Después de la demo ─────────────────────────────────────────────── */}
        <Shell className="landing-section-graphite">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <SectionIntro
                eyebrow="Después de pedir demo"
                title="Sales con una respuesta clara: si encaja, cómo se activa y qué plan tiene sentido."
                text="La demo no es una llamada genérica. Se revisa tu forma actual de reservar, se enseña el flujo público y se aterriza una activación realista para tu barbería."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {demoDeliverables.map((item) => (
                  <article key={item} className="premium-dark-card rounded-[24px] p-5">
                    <CheckCircle2 size={18} className="text-[#38BDF8]" />
                    <p className="mt-4 text-sm font-bold leading-6 text-white/74">{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Shell>

        {/* ── Activation timeline — 24h flow ───────────────────────────────────── */}
        <ActivationTimeline />

        {/* ── Premium Pricing ──────────────────────────────────────────────────── */}
        <PremiumPricingSection />

        {/* ── CTA final ──────────────────────────────────────────────────────── */}
        <Shell className="landing-section-graphite">
          <div className="premium-blue-panel mx-auto max-w-5xl rounded-[32px] p-7 text-center md:p-12">
            <BadgeEuro className="mx-auto text-[#38BDF8]" size={34} />
            <p className="mt-5 text-xs font-black uppercase text-[#38BDF8]">Pide una demo</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white md:text-6xl">
              Mira BarberíaOS aplicado a tu forma real de trabajar.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/62">
              Te enseñamos reservas, caja, productos, QR, clientes, Marketing Studio e IA del dueño en un recorrido corto y directo, sin prometer resultados que no se puedan demostrar.
            </p>
            <LandingCTABlock
              primaryHref={REQUEST_DEMO_URL}
              primaryLabel="Pedir diagnóstico gratis"
              secondaryHref={CALCULATOR_URL}
              secondaryLabel="Calcular mi ahorro"
              className="mt-9 justify-center"
            />
          </div>
        </Shell>

        {/* ── FAQ ────────────────────────────────────────────────────────────── */}
        <Shell className="landing-section-dark">
          <div className="mx-auto max-w-5xl">
            <SectionIntro
              eyebrow="Preguntas frecuentes"
              title="Respuestas antes de pedir demo."
              center
            />
            <div className="mt-10">
              <FAQAccordion items={faqs} dark />
            </div>
          </div>
        </Shell>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <footer className="border-t border-white/10 bg-gradient-to-br from-[#05070d] via-[#07111f] to-[#02030a] px-5 py-10 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#080A0F] ring-1 ring-[#D5A84C]/25">
                  <Scissors size={18} />
                </span>
                <span className="font-black tracking-tight text-white">BarberíaOS</span>
              </Link>
              <p className="mt-4 text-sm leading-6 text-white/48">
                Sistema operativo para barberías: reservas, caja, barberos, productos, marketing e IA en un solo panel.
              </p>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <p className="text-xs font-black uppercase text-white/32">Producto</p>
                <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Enlaces de producto">
                  <ul className="flex flex-col gap-2">
                    <li><Link href="#controla" className="hover:text-white">Qué controla</Link></li>
                    <li><Link href="#marketing" className="hover:text-white">Marketing Studio</Link></li>
                    <li><Link href="#precios" className="hover:text-white">Precios</Link></li>
                    <li><Link href="/barberias-fundadoras" className="hover:text-white">Fundadoras</Link></li>
                  </ul>
                </nav>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white/32">Empresa</p>
                <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Enlaces de empresa">
                  <ul className="flex flex-col gap-2">
                    <li><Link href="/vision" className="hover:text-white">Visión</Link></li>
                    <li><Link href="/proposito" className="hover:text-white">Propósito</Link></li>
                    <li><Link href="/impacto" className="hover:text-white">Impacto</Link></li>
                    <li><Link href="/academia" className="hover:text-white">Academia</Link></li>
                  </ul>
                </nav>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white/32">Acciones</p>
                <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Acciones comerciales">
                  <ul className="flex flex-col gap-2">
                    <li><Link href="/pedir-demo" className="hover:text-white">Pedir demo</Link></li>
                    <li><Link href={DEMO_BOOKING_URL} className="hover:text-white">Crear reserva de prueba</Link></li>
                    <li><Link href="/calculadora-booksy" className="hover:text-white">Calcular ahorro</Link></li>
                    <li><Link href="/login" className="hover:text-white">Entrar al panel</Link></li>
                    <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>
                  </ul>
                </nav>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white/32">Legal</p>
                <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Enlaces legales">
                  <ul className="flex flex-col gap-2">
                    <li><Link href="/legal/aviso-legal" className="hover:text-white">Aviso legal</Link></li>
                    <li><Link href="/legal/privacidad" className="hover:text-white">Privacidad</Link></li>
                    <li><Link href="/legal/cookies" className="hover:text-white">Cookies</Link></li>
                    <li><Link href="/legal/terminos" className="hover:text-white">Términos</Link></li>
                  </ul>
                </nav>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white/32">Ciudades</p>
                <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Software por ciudad">
                  <ul className="flex flex-col gap-2">
                    <li><Link href="/barberias/madrid" className="hover:text-white">Madrid</Link></li>
                    <li><Link href="/barberias/barcelona" className="hover:text-white">Barcelona</Link></li>
                    <li><Link href="/barberias/valencia" className="hover:text-white">Valencia</Link></li>
                    <li><Link href="/barberias/sevilla" className="hover:text-white">Sevilla</Link></li>
                    <li><Link href="/barberias/malaga" className="hover:text-white">Málaga</Link></li>
                    <li><Link href="/alternativa-a-booksy" className="hover:text-white">Alt. Booksy</Link></li>
                    <li><Link href="/calculadora-booksy" className="hover:text-white">Calculadora</Link></li>
                    <li><Link href="/blog/cuanto-cobra-booksy" className="hover:text-white">Blog Booksy</Link></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/35">
            © {new Date().getFullYear()} BarberíaOS. Contacto: {CONTACT_EMAIL}
          </div>
        </footer>

      </div>
    </LandingExperience>
  );
}
