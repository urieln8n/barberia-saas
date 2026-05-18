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
  Gauge,
  Instagram,
  Megaphone,
  MessageCircle,
  PackageCheck,
  Printer,
  QrCode,
  ReceiptText,
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
import { ProductMockupCard } from "@/components/ui/ProductMockupCard";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

const CONTACT_EMAIL = BUSINESS_CONFIG.legalEmail;
const WHATSAPP_URL = BUSINESS_CONFIG.whatsappUrl;
const DEMO_BOOKING_URL = BUSINESS_CONFIG.demoBookingUrl;
const DEMO_URL = BUSINESS_CONFIG.demoUrl;

export const metadata: Metadata = {
  title: "Software para barberías | Reservas, caja, QR e IA",
  description:
    "BarberíaOS conecta reservas online, agenda, caja, clientes, productos, QR, marketing e IA del dueño para barberías. Sin comisión por reserva.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/` },
  openGraph: {
    title: "Software para barberías | Reservas, caja, QR e IA",
    description:
      "Reservas online, agenda, caja, clientes, productos, QR, marketing e IA del dueño para barberías modernas.",
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

function Shell({ children, className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <MotionSection className={`px-5 py-16 md:py-24 lg:px-8 ${className}`} {...props}>
      {children}
    </MotionSection>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-black uppercase text-[#38BDF8]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-[1.05] text-white md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-white/60">{text}</p>}
    </div>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/62">
      {children}
    </span>
  );
}

function DashboardMockup() {
  const appointments = [
    ["09:30", "Corte + barba", "Dani", "Confirmada"],
    ["10:45", "Degradado", "Leo", "En silla"],
    ["12:00", "Hueco libre", "Marco", "Compartir"],
  ] as const;

  return (
    <ProductMockupCard dark className="premium-mockup relative mx-auto w-full max-w-4xl rounded-[30px]">
      <div className="rounded-[24px] border border-[#38BDF8]/[0.16] bg-[#0b1019]/[0.88] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:p-5">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-black uppercase text-[#38BDF8]">BarberíaOS</p>
            <h3 className="mt-1 text-xl font-black text-white md:text-2xl">Panel demo del dueño</h3>
          </div>
          <div className="rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-3 py-1 text-xs font-black text-[#BDEBFF]">
            Datos de ejemplo
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Reservas hoy", "31", CalendarCheck2],
            ["Caja estimada", "1.248 €", ReceiptText],
            ["Productos", "186 €", PackageCheck],
            ["Ocupación", "87%", Gauge],
          ].map(([label, value, Icon]) => {
            const TypedIcon = Icon as typeof CalendarCheck2;
            return (
              <div key={label as string} className="rounded-2xl border border-[#38BDF8]/[0.16] bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-black uppercase text-white/[0.38]">{label as string}</p>
                  <TypedIcon size={14} className="text-[#38BDF8]" />
                </div>
                <p className="mt-3 text-2xl font-black text-white">{value as string}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-2xl border border-[#2F6FEB]/20 bg-[#07111f]/75 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.22)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black text-white">Agenda conectada</p>
              <QrCode size={16} className="text-[#38BDF8]" />
            </div>
            <div className="space-y-2">
              {appointments.map(([time, service, barber, status]) => (
                <div key={`${time}-${service}`} className="grid grid-cols-[52px_1fr] gap-3 rounded-xl border border-white/[0.12] bg-white/[0.065] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:grid-cols-[58px_1fr_auto]">
                  <p className="text-sm font-black text-[#38BDF8]">{time}</p>
                  <div>
                    <p className="text-sm font-black text-white">{service}</p>
                    <p className="mt-0.5 text-xs text-white/42">{barber}</p>
                  </div>
                  <span className="hidden rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/60 sm:inline-flex">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="premium-blue-panel rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-white">Marketing Studio</p>
                <TrendingUp size={16} className="text-[#38BDF8]" />
              </div>
              <p className="mt-3 text-3xl font-black text-white">14 clientes</p>
              <p className="mt-1 text-xs leading-5 text-white/55">ejemplo de clientes a recuperar.</p>
            </div>
            <div className="rounded-2xl border border-[#38BDF8]/[0.18] bg-[#2563EB]/[0.08] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_44px_rgba(37,99,235,0.10)]">
              <p className="text-sm font-black text-white">IA del dueño</p>
              <p className="mt-3 text-sm leading-6 text-white/58">
                "Tienes huecos mañana entre 16:00 y 18:00. Publica oferta de barba + corte y escribe a clientes de alta frecuencia."
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProductMockupCard>
  );
}

function PublicBookingMockup() {
  return (
    <div className="premium-mockup rounded-[28px] border p-4">
      <div className="rounded-[24px] border border-[#38BDF8]/[0.16] bg-[#07111f]/[0.78] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-[0_12px_30px_rgba(37,99,235,0.30)]">
              <Scissors size={19} />
            </div>
            <div>
              <p className="font-black text-white">Demo Barber Studio</p>
              <p className="text-xs text-white/42">Ejemplo de página pública</p>
            </div>
          </div>
          <QrCode className="text-[#38BDF8]" size={26} />
        </div>
        <div className="mt-5 space-y-2">
          {["Corte premium", "Corte + barba", "Arreglo de barba"].map((service, index) => (
            <div key={service} className="flex items-center justify-between rounded-2xl border border-white/[0.12] bg-white/[0.065] p-3">
              <div>
                <p className="text-sm font-black text-white">{service}</p>
                <p className="text-xs text-white/40">{index === 0 ? "30 min" : "45 min"}</p>
              </div>
              <span className="text-sm font-black text-[#38BDF8]">{index === 0 ? "18 €" : "24 €"}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#1D4ED8] px-4 py-3 text-center text-sm font-black text-white shadow-[0_16px_38px_rgba(37,99,235,0.34)]">
          Ver flujo de reserva
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <LandingExperience>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <div className="landing-canvas text-white">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/82 px-5 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#080A0F]">
                <Scissors size={18} />
              </span>
              <span className="font-black tracking-tight">BarberíaOS</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-bold text-white/54 md:flex" aria-label="Navegación principal">
              <ul className="flex items-center gap-6">
                <li><Link href="#controla" className="transition hover:text-white">Producto</Link></li>
                <li><Link href="#activacion" className="transition hover:text-white">Activación</Link></li>
                <li><Link href="#fundadoras" className="transition hover:text-white">Fundadoras</Link></li>
                <li><Link href="#precios" className="transition hover:text-white">Precios</Link></li>
                <li><Link href="/demo" className="transition hover:text-white">Demo</Link></li>
              </ul>
            </nav>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-300 transition hover:bg-emerald-400/20 sm:inline-flex"
            >
              Pedir demo
            </a>
          </div>
        </header>

        <section className="relative overflow-hidden px-5 pb-16 pt-12 md:pb-24 md:pt-20 lg:px-8" data-gsap-premium="hero">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/55 to-transparent" />
          <div className="premium-hero-glow" aria-hidden="true" />
          <div className="gold-particles" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black text-white/70">
                <Crown size={14} className="text-[#38BDF8]" />
                SaaS para barberías que quieren vender reservas sin perder control
              </div>
              <h1 className="mt-6 text-5xl font-black leading-[0.96] tracking-normal text-white md:text-7xl">
                Tu barbería ordenada y lista para reservar online en 48h.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/64">
                BarberíaOS conecta reservas, agenda, clientes, caja, QR, productos y mensajes de crecimiento
                para dueños que quieren dejar de depender de WhatsApp, papel o plataformas con comisión.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href={WHATSAPP_URL} variant="premiumBlue" className="min-h-12 px-7">
                  Pedir demo por WhatsApp <MessageCircle size={17} />
                </PrimaryButton>
                <PrimaryButton href={DEMO_URL} variant="ghost" className="premium-cta-glass min-h-12 px-7 hover:bg-white/[0.12] hover:text-white">
                  Ver demo interactiva <ArrowRight size={17} />
                </PrimaryButton>
              </div>
              <div className="mt-5">
                <a
                  href={DEMO_BOOKING_URL}
                  className="inline-flex items-center gap-2 text-sm font-black text-emerald-300 transition hover:text-emerald-200"
                >
                  <QrCode size={16} />
                  Probar página pública de reservas
                  <ChevronRight size={15} />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                <Pill>Sin comisión por reserva</Pill>
                <Pill>Activación guiada</Pill>
                <Pill>Kit QR incluido</Pill>
              </div>
            </div>
            <DashboardMockup />
          </div>
        </section>

        <Shell id="controla" className="landing-section-graphite border-t border-white/10">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Qué controla BarberíaOS"
              title="Un sistema claro para dueños de barbería, no otra app que nadie usa."
              text="BarberíaOS está pensado para locales que viven entre WhatsApp, agenda, caja, clientes y productos. El objetivo es simple: que el dueño sepa qué pasa y que el cliente pueda reservar sin fricción."
              center
            />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {controls.map(([title, text, Icon]) => (
                <article key={title} className="premium-dark-card rounded-[24px] p-5" data-gsap-premium="feature">
                  <Icon size={22} className="text-[#38BDF8]" />
                  <h3 className="mt-5 text-xl font-black text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </Shell>

        <Shell id="activacion" className="landing-section-dark">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="Activación en 48h"
                title="No compras solo una herramienta: sales con tu barbería configurada."
                text="En una demo validamos si encaja. Si avanzas, dejamos configurado lo esencial: servicios, barberos, enlace de reservas, QR, agenda y primeros materiales para compartir."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href={WHATSAPP_URL} variant="premiumBlue" className="min-h-12 px-7">
                  Pedir demo por WhatsApp <MessageCircle size={17} />
                </PrimaryButton>
                <PrimaryButton href={DEMO_URL} variant="ghost" className="premium-cta-glass min-h-12 px-7 hover:bg-white/[0.12] hover:text-white">
                  Ver demo interactiva
                </PrimaryButton>
              </div>
            </div>
            <div className="grid gap-3">
              {activationSteps.map(([step, text]) => (
                <article key={step} className="premium-dark-card rounded-[24px] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#38BDF8]/25 bg-[#38BDF8]/10 text-sm font-black text-[#38BDF8]">
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

        <Shell className="landing-section-graphite">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="Reservas con QR"
                title="Tu mostrador, espejo e Instagram pueden mandar reservas al mismo sistema."
                text="El cliente entra desde tu QR o enlace, elige servicio, barbero y hora. Tú ves la reserva en la agenda sin perseguir conversaciones sueltas."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href={WHATSAPP_URL} variant="premiumBlue" className="min-h-12 px-7">
                  Pedir demo por WhatsApp
                </PrimaryButton>
                <PrimaryButton href={DEMO_BOOKING_URL} variant="ghost" className="premium-cta-glass min-h-12 px-7 hover:bg-white/[0.12] hover:text-white">
                  Probar reserva pública
                </PrimaryButton>
              </div>
            </div>
            <PublicBookingMockup />
          </div>
        </Shell>

        <Shell className="landing-section-graphite">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="BarberíaOS Kit"
                title="Del software al local: QR, carteles, mensajes y setup recomendado."
                text="El Kit convierte BarberíaOS en algo visible dentro de la barbería. Incluye QR de reservas, materiales descargables, mensajes para WhatsApp e Instagram, checklist de activación y recomendaciones de tablet, impresora o caja si encajan con tu operación."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href={WHATSAPP_URL} variant="premiumBlue" className="min-h-12 px-7">
                  Pedir demo por WhatsApp <MessageCircle size={17} />
                </PrimaryButton>
                <a
                  href={DEMO_URL}
                  className="premium-cta-glass inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] px-7 text-sm font-black transition hover:bg-white/[0.12] hover:text-white"
                >
                  Ver demo interactiva
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="premium-blue-panel rounded-[28px] p-5 md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase text-[#38BDF8]">Kit incluido en la activación</p>
                    <h3 className="mt-2 text-2xl font-black text-white">Materiales para pasar de “tengo software” a “mis clientes reservan”.</h3>
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

        <Shell className="landing-section-graphite">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Comparativa honesta"
              title="La diferencia no es tener reservas. Es tener el negocio conectado."
              center
            />
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {comparisons.map(([title, text], index) => (
                <article
                  key={title}
                  className={`rounded-[28px] border p-6 ${
                    index === 2
                      ? "border-[#38BDF8]/[0.34] bg-[#2563EB]/[0.12] shadow-[0_24px_72px_rgba(37,99,235,0.14)]"
                      : "border-[#2F6FEB]/[0.16] bg-white/[0.055]"
                  }`}
                >
                  <p className={`text-xl font-black ${index === 2 ? "text-[#38BDF8]" : "text-white"}`}>{title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/58">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </Shell>

        <Shell id="fundadoras" className="landing-section-dark">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="Programa Barberías Fundadoras"
                title="Estamos abriendo plazas para barberías que quieren implantarlo con acompañamiento."
                text="No vamos a inventar casos reales. El programa fundador existe para trabajar con dueños que quieran ordenar reservas, caja y clientes con una activación guiada, feedback directo y condiciones iniciales claras."
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href={WHATSAPP_URL} variant="premiumBlue" className="min-h-12 px-7">
                  Pedir plaza fundadora <MessageCircle size={17} />
                </PrimaryButton>
                <PrimaryButton href={DEMO_URL} variant="ghost" className="premium-cta-glass min-h-12 px-7 hover:bg-white/[0.12] hover:text-white">
                  Ver demo interactiva
                </PrimaryButton>
              </div>
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

        <Shell id="precios" className="landing-section-dark">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              eyebrow="Planes"
              title="Precios claros para empezar sin comisión por reserva."
              text="Planes pensados por fase de negocio. Todos incluyen página pública, QR de reservas y activación asistida; eliges según equipo, caja, marketing y soporte que necesitas."
              center
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`relative flex min-h-full flex-col rounded-[30px] border p-6 ${
                    plan.featured
                      ? "border-[#38BDF8]/45 bg-gradient-to-b from-white to-[#eef7ff] text-[#080A0F] shadow-[0_26px_96px_rgba(37,99,235,0.18)]"
                      : "border-[#2F6FEB]/[0.16] bg-white/[0.055] text-white shadow-[0_22px_72px_rgba(0,0,0,0.20)]"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute right-5 top-5 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-black text-white">
                      Más equilibrado
                    </span>
                  )}
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <p className={`mt-3 min-h-14 text-sm leading-6 ${plan.featured ? "text-slate-500" : "text-white/55"}`}>
                    {plan.description}
                  </p>
                  <div className={`mt-4 rounded-2xl border p-4 ${
                    plan.featured ? "border-slate-200 bg-slate-50" : "border-white/10 bg-white/[0.045]"
                  }`}>
                    <p className={`text-xs font-black uppercase ${plan.featured ? "text-[#2563EB]" : "text-[#38BDF8]"}`}>
                      Para quién
                    </p>
                    <p className={`mt-2 text-sm leading-6 ${plan.featured ? "text-slate-600" : "text-white/62"}`}>
                      {plan.forWho}
                    </p>
                    <p className={`mt-3 text-xs font-bold ${plan.featured ? "text-slate-400" : "text-white/38"}`}>
                      {plan.limits}
                    </p>
                  </div>
                  <div className="mt-7 flex items-end gap-1">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className={plan.featured ? "pb-2 text-sm font-bold text-slate-400" : "pb-2 text-sm font-bold text-white/35"}>/mes</span>
                  </div>
                  <div className={`my-6 h-px ${plan.featured ? "bg-slate-200" : "bg-white/10"}`} />
                  <ul className="flex flex-1 flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className={`flex gap-3 text-sm font-bold leading-6 ${plan.featured ? "text-slate-700" : "text-white/72"}`}>
                        <CheckCircle2 size={17} className={`mt-0.5 shrink-0 ${plan.featured ? "text-[#2563EB]" : "text-[#38BDF8]"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <PrimaryButton href={plan.featured ? WHATSAPP_URL : DEMO_URL} variant={plan.featured ? "premiumBlue" : "ghost"} className={`mt-8 min-h-12 w-full ${plan.featured ? "" : "premium-cta-glass hover:bg-white/[0.12] hover:text-white"}`}>
                    {plan.featured ? "Pedir demo por WhatsApp" : "Ver demo interactiva"}
                  </PrimaryButton>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-xs font-semibold leading-5 text-white/42">
              Precios orientativos para España, sin comisión por reserva. IVA, condiciones finales y alcance de activación se confirman en la demo según el tamaño de la barbería.
            </p>
          </div>
        </Shell>

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
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <PrimaryButton href={WHATSAPP_URL} variant="premiumBlue" className="min-h-12 px-8">
                Pedir demo por WhatsApp <MessageCircle size={17} />
              </PrimaryButton>
              <a
                href={DEMO_URL}
                className="premium-cta-glass inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] px-8 text-sm font-black transition hover:bg-white/[0.12] hover:text-white"
              >
                Ver demo interactiva
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </Shell>

        <Shell className="landing-section-dark pt-0">
          <div className="mx-auto grid max-w-5xl gap-3">
            {faqs.map(([question, answer]) => (
              <article key={question} className="rounded-[22px] border border-[#2F6FEB]/[0.16] bg-white/[0.055] p-5 shadow-[0_18px_54px_rgba(0,0,0,0.18)]">
                <h3 className="font-black text-white">{question}</h3>
                <p className="mt-2 text-sm leading-7 text-white/55">{answer}</p>
              </article>
            ))}
          </div>
        </Shell>

        <footer className="border-t border-white/10 bg-gradient-to-br from-[#05070d] via-[#07111f] to-[#02030a] px-5 py-10 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#080A0F]">
                  <Scissors size={18} />
                </span>
                <span className="font-black tracking-tight text-white">BarberíaOS</span>
              </Link>
              <p className="mt-4 text-sm leading-6 text-white/48">
                Sistema operativo para barberías: reservas, caja, barberos, productos, marketing e IA en un solo panel.
              </p>
            </div>
            <div className="grid gap-7 sm:grid-cols-4">
              <div>
                <p className="text-xs font-black uppercase text-white/32">Producto</p>
                <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Enlaces de producto">
                  <ul className="flex flex-col gap-2">
                    <li><Link href="#controla" className="hover:text-white">Qué controla</Link></li>
                    <li><Link href="#marketing" className="hover:text-white">Marketing Studio</Link></li>
                    <li><Link href="#precios" className="hover:text-white">Precios</Link></li>
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
                    <li><Link href="/demo" className="hover:text-white">Ver demo</Link></li>
                    <li><Link href={DEMO_BOOKING_URL} className="hover:text-white">Crear reserva de prueba</Link></li>
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
