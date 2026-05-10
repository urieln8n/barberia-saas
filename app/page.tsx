import Link from "next/link";
import type { HTMLAttributes } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Crown,
  Gauge,
  Globe,
  MapPin,
  Minus,
  QrCode,
  ReceiptText,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { LostMoneyCalculator } from "@/components/marketing/LostMoneyCalculator";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProductMockupCard } from "@/components/ui/ProductMockupCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE_URL } from "@/src/lib/site-url";

// ── Data ─────────────────────────────────────────────────────────────────────

const ownerPains = [
  {
    title: "Reservas perdidas por WhatsApp",
    text: "Mensajes mezclados, cambios de hora sin control y clientes que se quedan esperando respuesta.",
  },
  {
    title: "No sabe qué barbero vende más",
    text: "Sin datos claros, no puedes reconocer a los mejores ni detectar huecos por barbero.",
  },
  {
    title: "No controla bien la caja diaria",
    text: "Cobros mezclados, métodos sin registrar y cierre del día sin un resumen claro.",
  },
  {
    title: "No tiene página profesional de reservas",
    text: "Depende de plataformas genéricas que cobran comisión por cada cliente que ya era suyo.",
  },
  {
    title: "Su web no convierte clientes",
    text: "No hay botón de reserva visible, no hay WhatsApp a la vista y los precios están enterrados.",
  },
  {
    title: "No sabe si su web inspira confianza",
    text: "Sin HTTPS, sin SEO básico ni señales claras de cómo reservar, los clientes se van silenciosamente.",
  },
  {
    title: "Depende de plataformas genéricas",
    text: "En Booksy o Treatwell los datos, la visibilidad y la relación con el cliente no son suyos.",
  },
];

const moneyLeaks = [
  "Gestionar reservas solo por WhatsApp",
  "No confirmar citas antes del servicio",
  "No recordar al cliente su reserva",
  "No guardar datos de clientes frecuentes",
  "No medir ventas por barbero",
  "No tener QR visible en mostrador y escaparate",
  "No recuperar clientes que dejaron de venir",
  "No tener página pública propia de reservas",
  "No aparecer en búsquedas locales",
  "No saber si tu web inspira confianza a los clientes",
];

const setupItems = [
  "Datos de la barbería",
  "Servicios y precios",
  "Barberos activos",
  "Horarios de atención",
  "Página pública",
  "QR de reservas",
  "Prueba de reserva real",
  "Revisión final antes de lanzar",
];

const steps = [
  {
    title: "Nos pasas tu información",
    text: "Servicios, precios, horarios, barberos y datos básicos de tu barbería.",
  },
  {
    title: "Configuramos BarberiaOS",
    text: "Dejamos lista tu agenda online, QR, página pública, marketplace y panel principal.",
  },
  {
    title: "Empiezas a recibir reservas",
    text: "Compartes el link en Instagram, Google, WhatsApp o en el local con tu QR.",
  },
];

const modules = [
  ["Reservas online", "Agenda clara por día, hora, servicio y barbero.", CalendarClock],
  ["QR profesional", "Reserva desde mostrador, escaparate, Instagram o Google.", QrCode],
  ["Clientes propios", "Base de datos para ver frecuentes, dormidos y nuevos.", Users],
  ["Control de barberos", "Rendimiento, huecos, servicios y ventas por persona.", BarChart3],
  ["Caja diaria", "Cobros, métodos de pago y cierre con más control.", WalletCards],
  ["Página pública", "Enlace /r/tu-barberia con servicios, barberos y botón de reserva.", Globe],
  ["Marketplace local", "Aparece en /barberias para que clientes nuevos te encuentren.", ShoppingBag],
  ["Auditoría web", "Analiza HTTPS, SEO, cabeceras y conversión de tu web actual.", ShieldCheck],
  ["Widget instalable", "Botón flotante de reserva para añadir a cualquier web en un minuto.", Code2],
  ["Estadísticas", "Huecos libres, ocupación y rendimiento en tiempo real.", Gauge],
  ["Recuperación", "Detecta clientes que llevan semanas sin volver.", TrendingUp],
  ["Recordatorios", "Automatizaciones para reducir no-shows y mantener agenda llena.", Zap],
];

const beforeAfter = [
  ["Agenda", "Mensajes sueltos y cambios difíciles de seguir", "Reservas ordenadas por barbero y hora"],
  ["Clientes", "Nombres perdidos en WhatsApp o papel", "Base de datos con historial y frecuencia"],
  ["Huecos", "Te enteras tarde de las horas libres", "Ves huecos y los puedes compartir rápido"],
  ["Caja", "Ventas poco claras al final del día", "Cobros y ventas por barbero en un panel"],
  ["Presencia", "No sabes si tu web convierte o falla", "Auditoría pasiva con puntuación y mejoras concretas"],
];

const traditionalComparison = [
  ["Reservas online 24/7", false, false, false, true, true],
  ["Clientes propios", false, false, true, false, true],
  ["QR para el local", false, false, false, false, true],
  ["Recordatorios y confirmación", false, false, false, true, true],
  ["Ventas por barbero", false, false, true, false, true],
  ["Página pública propia", false, false, false, false, true],
  ["Marketplace local", false, false, false, true, true],
  ["Auditoría web", false, false, false, false, true],
  ["Widget instalable", false, false, false, false, true],
  ["Recuperar clientes dormidos", false, false, false, false, true],
  ["Control sin depender de terceros", true, true, true, false, true],
];

const plans = [
  {
    name: "Básico",
    price: "39 €/mes",
    forWho: "Para barbería pequeña o autónomo",
    features: [
      "Reservas online",
      "Clientes, barberos y servicios",
      "Página pública /r/tu-barberia",
      "QR de reservas",
      "Soporte básico",
    ],
  },
  {
    name: "Pro",
    price: "79 €/mes",
    forWho: "Para barbería con equipo",
    featured: true,
    features: [
      "Todo en Básico",
      "Caja diaria",
      "Ventas por barbero",
      "Marketplace local",
      "Auditoría web básica",
      "Widget instalable",
      "Clientes frecuentes y dormidos",
    ],
  },
  {
    name: "Premium",
    price: "149 €/mes",
    forWho: "Para barbería que quiere marketing y automatización",
    features: [
      "Todo en Pro",
      "Automatizaciones y recordatorios",
      "Reportes avanzados",
      "Configuración asistida",
      "Prioridad en soporte",
      "Futuro WhatsApp IA",
    ],
  },
];

const faqs = [
  [
    "¿Mi barbería aparece junto a competidores en el marketplace?",
    "Solo si activas el marketplace. Tu enlace privado /r/tu-barberia nunca muestra otras barberías. El listado /barberias muestra varias barberías publicadas, igual que aparecen varios locales en Google Maps.",
  ],
  [
    "¿Puedo tener solo mi enlace privado sin salir en el marketplace?",
    "Sí. Puedes publicar tu perfil y tener el enlace /r/tu-barberia activo sin aparecer en el listado general. El marketplace es opcional y se activa por separado desde tu panel.",
  ],
  [
    "¿La auditoría web es segura?",
    "Sí. Es una auditoría completamente pasiva y no intrusiva: analiza la página pública de tu web como lo haría cualquier cliente o buscador. No accede a datos privados, no lanza ataques ni modifica nada. No sustituye una auditoría profesional avanzada.",
  ],
  [
    "¿Necesito cambiar mi web actual?",
    "No. BarberíaOS te da una página pública propia (/r/tu-barberia) que funciona aunque no tengas web. Si ya tienes web, puedes añadir el botón de reserva con un pequeño script sin tocar el diseño.",
  ],
  [
    "¿Puedo instalar el botón de reservas en mi web?",
    "Sí. El widget instalable añade un botón flotante 'Reservar ahora' a cualquier web existente con una sola línea de código. No hay que cambiar el diseño ni el CMS.",
  ],
  [
    "¿BarberíaOS sustituye a Booksy?",
    "No exactamente. BarberíaOS está pensado para que controles tus clientes, tu caja, tu página y tus datos sin pagar comisión por cada cliente. Puedes usarlo junto a Booksy o como alternativa directa.",
  ],
  [
    "¿Necesito saber de tecnología?",
    "No. Te configuramos servicios, barberos, horarios, QR y página pública. No recibes un software vacío que tienes que rellenar solo.",
  ],
  [
    "¿Puedo usarlo con Instagram?",
    "Sí. Pones tu link de reservas en la bio, historias, destacados, mensajes de WhatsApp, Google Business Profile o en el QR físico del local.",
  ],
  [
    "¿Cuánto tarda la configuración?",
    "La oferta de entrada es dejar la agenda online configurada en menos de 48 horas cuando tenemos la información necesaria.",
  ],
  [
    "¿Tiene permanencia?",
    "No. Sin permanencia y sin tarjeta para la configuración inicial gratuita.",
  ],
  [
    "¿Los clientes son míos?",
    "Sí. BarberíaOS te ayuda a construir una base de datos propia de clientes de tu barbería, no de la plataforma.",
  ],
];

const publicLegalLinks = [
  { href: "/legal/aviso-legal", label: "Aviso Legal" },
  { href: "/legal/privacidad", label: "Privacidad" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/terminos", label: "Términos" },
  { href: "/legal/condiciones-contratacion", label: "Condiciones de contratación" },
  { href: "/legal/contacto", label: "Contacto legal" },
];

// ── Layout helpers ────────────────────────────────────────────────────────────

function Shell({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`px-5 py-20 lg:px-8 ${className}`} {...props}>
      {children}
    </section>
  );
}

function BooleanMark({ value }: { value: boolean }) {
  return (
    <div className={value ? "flex justify-center text-emerald-600" : "flex justify-center text-slate-300"}>
      {value ? <Check size={18} /> : <Minus size={18} />}
    </div>
  );
}

// ── Visual mockups ────────────────────────────────────────────────────────────

function DashboardMockup() {
  const appointments = [
    ["10:00", "Corte premium", "Carlos", "Confirmada"],
    ["11:30", "Corte + barba", "Miguel", "Pendiente"],
    ["15:00", "Hueco libre", "Andrés", "Compartir"],
  ];

  return (
    <ProductMockupCard dark className="relative mx-auto max-w-3xl rounded-[28px]">
      <div className="rounded-[22px] border border-white/10 bg-[#0B0E14] p-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-black uppercase text-[#D5A84C]">BarberiaOS</p>
            <p className="mt-1 text-xl font-black text-white">Panel principal</p>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            48h setup
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {[
            ["Reservas", "24"],
            ["No-shows", "-18%"],
            ["Huecos", "6"],
            ["Ventas", "840 €"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
              <p className="text-[10px] font-bold uppercase text-white/40">{label}</p>
              <p className="mt-2 text-xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black text-white">Reservas de hoy</p>
              <CalendarClock size={16} className="text-[#D5A84C]" />
            </div>
            <div className="space-y-2">
              {appointments.map(([time, service, barber, status]) => (
                <div key={`${time}-${service}`} className="grid grid-cols-[54px_1fr_auto] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2 text-xs">
                  <span className="font-black text-white">{time}</span>
                  <span className="min-w-0 truncate text-white/65">{service} · {barber}</span>
                  <span className={status === "Compartir" ? "font-black text-[#D5A84C]" : "font-bold text-emerald-300"}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-black text-white">Alertas inteligentes</p>
            <div className="mt-4 space-y-3">
              {[
                "3 citas sin confirmar mañana",
                "8 clientes llevan 45 días sin volver",
                "Martes con baja ocupación",
              ].map((alert) => (
                <div key={alert} className="rounded-xl border border-[#D5A84C]/20 bg-[#D5A84C]/10 p-3 text-xs font-bold text-[#F2D998]">
                  {alert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProductMockupCard>
  );
}

function SetupVisual() {
  return (
    <ProductMockupCard className="mx-auto max-w-4xl">
      <div className="grid gap-3 sm:grid-cols-2">
        {setupItems.map((item, index) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#080A0F] text-xs font-black text-[#D5A84C]">
              {index + 1}
            </span>
            <span className="text-sm font-black text-slate-800">{item}</span>
            <CheckCircle2 size={17} className="ml-auto text-emerald-600" />
          </div>
        ))}
      </div>
    </ProductMockupCard>
  );
}

function QRVisual() {
  const publicBookingExampleUrl = `${SITE_URL.replace(/^https?:\/\//, "")}/r/black-crown`;

  return (
    <ProductMockupCard className="mx-auto max-w-4xl">
      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="grid aspect-square grid-cols-7 gap-1.5 rounded-2xl bg-white p-4">
            {Array.from({ length: 49 }).map((_, index) => (
              <span
                key={index}
                className={`rounded-[4px] ${index % 3 === 0 || index % 8 === 0 || index < 7 ? "bg-[#080A0F]" : "bg-slate-200"}`}
              />
            ))}
          </div>
          <p className="mt-4 break-all text-center font-mono text-xs font-bold text-slate-500">
            {publicBookingExampleUrl}
          </p>
        </div>
        <div className="mx-auto w-full max-w-[290px] rounded-[30px] border border-slate-200 bg-[#080A0F] p-3 shadow-[var(--shadow-card)]">
          <div className="rounded-[24px] bg-white p-4">
            <p className="text-xs font-black uppercase text-[#2563EB]">Reserva móvil</p>
            <h3 className="mt-2 text-2xl font-black text-[#080A0F]">Black Crown</h3>
            <div className="mt-4 space-y-2">
              {["Corte premium - 22 €", "Corte + barba - 32 €", "Barba - 14 €"].map((service) => (
                <div key={service} className="rounded-2xl border border-slate-200 p-3 text-sm font-bold text-slate-700">
                  {service}
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-2xl bg-[#2563EB] px-4 py-3 text-sm font-black text-white">
              Reservar
            </button>
          </div>
        </div>
      </div>
    </ProductMockupCard>
  );
}

function MarketplaceMockup() {
  const barberias = [
    {
      name: "Black Crown Barber",
      city: "Madrid · Malasaña",
      slug: "black-crown",
      score: "★ 4.9",
      services: "Corte · Barba · Afeitado",
    },
    {
      name: "BarberShop Premium",
      city: "Madrid · Chamberí",
      slug: "barbershop-premium",
      score: "★ 4.7",
      services: "Corte · Degradado · Barba",
    },
  ];

  return (
    <ProductMockupCard className="mx-auto max-w-4xl">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[#2563EB]">
              BarberíaOS Marketplace
            </p>
            <p className="text-2xl font-black text-[#080A0F]">Barberías en Madrid</p>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            2 barberías
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {barberias.map((b) => (
            <div key={b.slug} className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#080A0F] text-[#D5A84C]">
                  <Scissors size={18} />
                </div>
                <span className="rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-2.5 py-0.5 text-xs font-bold text-[#8A641F]">
                  {b.score}
                </span>
              </div>
              <h3 className="mt-3 font-black text-[#080A0F]">{b.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={11} className="shrink-0" /> {b.city}
              </p>
              <p className="mt-2 text-xs text-slate-400">{b.services}</p>
              <button className="mt-4 w-full rounded-xl bg-[#080A0F] px-4 py-2.5 text-xs font-black text-white">
                Reservar
              </button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Tu perfil privado /r/tu-barberia nunca muestra otras barberías.
        </p>
      </div>
    </ProductMockupCard>
  );
}

function AuditMockup() {
  const score = 73;
  const checks = [
    { name: "HTTPS activo", status: "ok" as const },
    { name: "Certificado SSL", status: "ok" as const },
    { name: "Botón de reserva visible", status: "error" as const },
    { name: "WhatsApp visible", status: "warn" as const },
    { name: "Meta description SEO", status: "warn" as const },
    { name: "Precios visibles", status: "ok" as const },
  ];

  const colors = {
    ok: "bg-emerald-50 text-emerald-700",
    warn: "bg-amber-50 text-amber-700",
    error: "bg-red-50 text-red-700",
  };
  const labels = { ok: "Correcto", warn: "Mejora", error: "Atención" };
  const gaugeColor = score >= 80 ? "border-emerald-400" : score >= 60 ? "border-amber-400" : "border-red-400";
  const bandLabel = score >= 80 ? "Bueno" : score >= 60 ? "Mejorable" : "Crítico";
  const bandColor = score >= 80 ? "bg-emerald-100 text-emerald-700" : score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700";

  return (
    <ProductMockupCard className="mx-auto max-w-4xl">
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-6 sm:w-40">
          <p className="text-center text-[10px] font-black uppercase tracking-wider text-slate-400">Puntuación web</p>
          <div className={`flex h-24 w-24 items-center justify-center rounded-full border-[10px] bg-white ${gaugeColor}`}>
            <span className="text-3xl font-black text-[#080A0F]">{score}</span>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-black ${bandColor}`}>{bandLabel}</span>
        </div>
        <div className="flex flex-col gap-2">
          {checks.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2.5"
            >
              <span className="text-sm font-bold text-slate-700">{c.name}</span>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${colors[c.status]}`}>
                {labels[c.status]}
              </span>
            </div>
          ))}
          <p className="mt-1 text-[11px] leading-5 text-slate-400">
            Análisis pasivo y no intrusivo. No sustituye una auditoría profesional avanzada.
          </p>
        </div>
      </div>
    </ProductMockupCard>
  );
}

function WidgetVisual() {
  return (
    <ProductMockupCard className="mx-auto max-w-4xl">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Instalación — una sola línea
            </p>
            <div className="rounded-xl border border-slate-200 bg-[#0B0E14] px-4 py-4 font-mono text-xs leading-7 text-[#D5A84C]">
              <span className="text-white/40">{"<"}script</span>
              <br />
              {"  "}
              <span className="text-[#7ECFFF]">src</span>
              <span className="text-white/40">{"="}</span>
              <span className="text-amber-300">{'"barberiaos.com/widget.js"'}</span>
              <br />
              {"  "}
              <span className="text-[#7ECFFF]">data-barbershop</span>
              <span className="text-white/40">{"="}</span>
              <span className="text-amber-300">{'"tu-barberia"'}</span>
              <br />
              {"  "}
              <span className="text-white/40">async{">"}</span>
              <br />
              <span className="text-white/40">{"</"}script{">"}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {["Sin cookies", "Sin datos del cliente", "CSS aislado"].map((v) => (
              <div
                key={v}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-2 py-2.5 font-bold text-emerald-700"
              >
                {v}
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto h-52 w-full max-w-sm rounded-[28px] border border-slate-200 bg-[#F6F8FB] shadow-sm">
          <div className="flex h-full items-center justify-center">
            <p className="text-sm font-bold text-slate-300">Tu web actual</p>
          </div>
          <div className="absolute bottom-5 right-5">
            <div className="flex items-center gap-2 rounded-full bg-[#080A0F] px-4 py-3 shadow-[0_4px_24px_rgba(8,10,15,0.32)]">
              <QrCode size={14} className="text-[#D5A84C]" />
              <span className="text-xs font-black text-[#D5A84C]">Reservar ahora</span>
            </div>
          </div>
          <div className="absolute left-3 top-3 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-400 shadow-sm">
            barberiaos.com/widget.js
          </div>
        </div>
      </div>
    </ProductMockupCard>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7FAFC] text-[#080A0F]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#D5A84C]">
              <Scissors size={19} />
            </span>
            <span className="font-black">BarberiaOS</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-500 lg:flex">
            <a href="#marketplace">Marketplace</a>
            <a href="#auditoria">Auditoría web</a>
            <a href="#precios">Precios</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <PrimaryButton href="/demo" variant="secondary" className="hidden md:inline-flex">
              Ver cómo funciona
            </PrimaryButton>
            <PrimaryButton href="/login" variant="ghost" className="hidden sm:inline-flex">
              Entrar
            </PrimaryButton>
            <PrimaryButton href="/login" variant="dark">
              Probar gratis
            </PrimaryButton>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <Shell className="pb-14 pt-12 lg:pb-20 lg:pt-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/10 px-4 py-2 text-xs font-black uppercase text-[#2563EB]">
              <Sparkles size={14} /> Agenda online configurada gratis en 48h
            </div>
            <h1 className="mt-7 text-[clamp(2.5rem,6vw,5.2rem)] font-black leading-[0.95] tracking-normal">
              Reservas, caja y presencia online para barberías modernas.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              BarberíaOS une reservas, clientes, barberos, caja, QR, página pública, marketplace local y auditoría web en un solo panel. No es una agenda genérica: está hecho solo para barberías.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/login" variant="primary" className="min-h-12 px-6">
                Probar BarberíaOS gratis <ArrowRight size={17} />
              </PrimaryButton>
              <PrimaryButton href="/demo" variant="secondary" className="min-h-12 px-6">
                Ver cómo funciona
              </PrimaryButton>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
              {["Sin tarjeta", "Sin permanencia", "Configuración guiada", "Soporte por WhatsApp"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-600" /> {item}
                </span>
              ))}
            </div>
          </div>
          <DashboardMockup />
        </div>
      </Shell>

      {/* ── Dolores ── */}
      <Shell>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="El problema real"
            title="Tu barbería pierde clientes y dinero cuando depende de WhatsApp, papel y plataformas que no son tuyas."
            description="El problema no es solo reservar. Es saber qué cliente viene, quién no aparece, qué barbero rinde más, si tu web convierte y si los clientes nuevos te encuentran."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ownerPains.slice(0, 4).map((pain) => (
              <article key={pain.title} className="bento-card">
                <div className="metric-icon bg-red-50 text-red-600">
                  <X size={17} />
                </div>
                <h3 className="mt-5 text-xl font-black leading-snug">{pain.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{pain.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {ownerPains.slice(4).map((pain) => (
              <article key={pain.title} className="bento-card">
                <div className="metric-icon bg-red-50 text-red-600">
                  <X size={17} />
                </div>
                <h3 className="mt-5 text-xl font-black leading-snug">{pain.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{pain.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── Errores caros ── */}
      <Shell className="bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Fugas de dinero"
            title="10 errores que están costando dinero a tu barbería ahora mismo"
            description="No necesitas vender humo para crecer. Necesitas cerrar estas fugas: agenda, QR, datos, caja, presencia online y conversión."
            align="center"
          />
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {moneyLeaks.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="metric-icon bg-red-50 text-red-600 shrink-0">
                  <X size={16} />
                </div>
                <p className="text-sm font-black text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── Setup ── */}
      <Shell id="setup" className="bg-[#080A0F] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Setup Seguro BarberiaOS"
              title="No te damos un software vacío. Te dejamos tu barbería lista para recibir reservas."
              description="Configuramos la base para que puedas empezar sin perder tardes peleándote con tecnología."
              variant="dark"
            />
            <PrimaryButton href="/login" variant="gold" className="mt-8 min-h-12 px-7">
              Activar mi barbería <ArrowRight size={17} />
            </PrimaryButton>
          </div>
          <SetupVisual />
        </div>
      </Shell>

      {/* ── Proceso ── */}
      <Shell>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Proceso simple"
            title="De WhatsApp saturado a reservas online, marketplace y auditoría web en 3 pasos"
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="bento-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#080A0F] text-sm font-black text-[#D5A84C]">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-2xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── Antes y después ── */}
      <Shell className="bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Antes y después"
            title="Pasas de agenda desordenada a negocio controlado y con presencia online"
            align="center"
          />
          <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
            {beforeAfter.map(([area, before, after]) => (
              <div key={area} className="grid gap-4 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[160px_1fr_1fr] md:items-center">
                <p className="text-sm font-black uppercase text-[#2563EB]">{area}</p>
                <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold leading-6 text-red-800">{before}</p>
                <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">{after}</p>
              </div>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── Módulos ── */}
      <Shell id="modulos">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Sistema completo"
            title="Todo lo que una barbería moderna necesita en un solo panel"
            description="Reservas, caja, clientes, barberos, página pública, marketplace local, auditoría web y widget instalable. Sin comisiones. Sin depender de terceros."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modules.map(([title, text, Icon]) => {
              const TypedIcon = Icon as typeof CalendarClock;
              return (
                <article key={title as string} className="bento-card">
                  <div className="metric-icon bg-[#2563EB]/10 text-[#2563EB]">
                    <TypedIcon size={18} />
                  </div>
                  <h3 className="mt-5 text-xl font-black">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </Shell>

      {/* ── Marketplace ── */}
      <Shell id="marketplace" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Mini Marketplace local"
                title="Tu barbería visible donde los clientes nuevos buscan."
                description="BarberíaOS incluye un marketplace local donde las barberías publicadas aparecen ordenadas por ciudad. Tu perfil tiene logo, portada, descripción, ubicación, servicios y botón de reserva."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Página SEO optimizada por ciudad y barrio",
                  "Botones de reservar y WhatsApp directos",
                  "Logo, portada, descripción y dirección",
                  "Tu página privada /r/tu-barberia nunca muestra competidores",
                  "El marketplace /barberias es opcional y se activa por separado",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <PrimaryButton href="/login" variant="primary" className="mt-8 min-h-12 px-6">
                Activar mi perfil público <ArrowRight size={17} />
              </PrimaryButton>
            </div>
            <MarketplaceMockup />
          </div>
        </div>
      </Shell>

      {/* ── Página pública + QR ── */}
      <Shell id="qr">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <QRVisual />
            <div>
              <SectionHeader
                eyebrow="Página pública + QR"
                title="Una página profesional de reservas para tu barbería."
                description="Tu cliente entra en barberiaos.com/r/tu-barberia, elige servicio, barbero y hora. Tú dejas de perseguir mensajes."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Enlace propio: barberiaos.com/r/tu-barberia",
                  "QR descargable para Instagram, Google, mostrador o tarjetas",
                  "Logo, descripción, barrio y WhatsApp visibles",
                  "Servicios, barberos y botón de reservar",
                  "Diseño responsive optimizado para móvil",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <PrimaryButton href="/login" variant="dark" className="mt-8 min-h-12 px-6">
                Crear mi página pública <ArrowRight size={17} />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Shell>

      {/* ── Auditoría web ── */}
      <Shell id="auditoria" className="bg-[#080A0F] text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                eyebrow="Auditoría web básica"
                title="Detecta fallos en tu web antes de perder clientes."
                description="BarberíaOS analiza de forma pasiva y no intrusiva la web de tu barbería para identificar qué está fallando técnicamente, qué falta para posicionar en Google y qué frena a los clientes a reservar."
                variant="dark"
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Técnica", ["HTTPS", "Certificado SSL", "Cabeceras de seguridad"]],
                  ["SEO básico", ["Título de la página", "Meta descripción", "Encabezado H1"]],
                  ["Conversión", ["Botón de reserva visible", "WhatsApp visible", "Precios visibles"]],
                  ["Presencia", ["Google Maps", "BarberíaOS instalado", "Canonical"]],
                ].map(([cat, items]) => (
                  <div key={cat as string} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#D5A84C]">{cat as string}</p>
                    <ul className="space-y-1">
                      {(items as string[]).map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs font-bold text-white/70">
                          <ShieldCheck size={11} className="shrink-0 text-[#D5A84C]" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs leading-5 text-white/50">
                Análisis completamente pasivo y no intrusivo. Lee tu web como lo haría un cliente o buscador. No accede a datos privados ni modifica nada. No sustituye una auditoría de seguridad profesional avanzada.
              </div>
              <PrimaryButton href="/login" variant="gold" className="mt-6 min-h-12 px-6">
                Analizar mi web <ArrowRight size={17} />
              </PrimaryButton>
            </div>
            <div>
              <AuditMockup />
            </div>
          </div>
        </div>
      </Shell>

      {/* ── Widget ── */}
      <Shell id="widget" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <WidgetVisual />
            <div>
              <SectionHeader
                eyebrow="Widget instalable"
                title="Instala BarberíaOS en tu web actual."
                description="¿Ya tienes web? No la cambies. Añade un botón flotante de reservas con una sola línea de código. El widget se conecta automáticamente con tu página pública y funciona en cualquier CMS o plataforma."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Botón flotante 'Reservar ahora' en cualquier rincón de la pantalla",
                  "Se conecta a tu página pública /r/tu-barberia",
                  "CSS completamente aislado — no rompe el diseño de tu web",
                  "Sin cookies, sin datos del usuario, sin carga adicional",
                  "Funciona en WordPress, Wix, Squarespace y cualquier web",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <PrimaryButton href="/login" variant="dark" className="mt-8 min-h-12 px-6">
                Instalar el widget <ArrowRight size={17} />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Shell>

      {/* ── Diferenciación / Comparativa ── */}
      <Shell id="comparativa">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Diferenciación"
            title="Mientras otras plataformas son agendas genéricas, BarberíaOS está pensado solo para barberías."
            description="WhatsApp sirve para hablar. Una barbería que quiere crecer necesita reservas, datos propios, caja, página pública, marketplace, auditoría web y widget. Todo en un panel."
            align="center"
          />
          <div className="mt-10 overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
            <div className="min-w-[880px]">
              <div className="grid grid-cols-[1.6fr_repeat(5,0.68fr)] border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-xs font-black uppercase text-slate-500">
                <span className="text-left">Función</span>
                <span>WhatsApp</span>
                <span>Papel</span>
                <span>Excel</span>
                <span>Marketplace</span>
                <span className="text-[#2563EB]">BarberiaOS</span>
              </div>
              {traditionalComparison.map(([feature, whatsapp, paper, excel, marketplace, barberiaos]) => (
                <div
                  key={feature as string}
                  className="grid grid-cols-[1.6fr_repeat(5,0.68fr)] items-center border-b border-slate-100 px-4 py-3.5 last:border-b-0"
                >
                  <p className="font-bold text-slate-700">{feature as string}</p>
                  <BooleanMark value={Boolean(whatsapp)} />
                  <BooleanMark value={Boolean(paper)} />
                  <BooleanMark value={Boolean(excel)} />
                  <BooleanMark value={Boolean(marketplace)} />
                  <BooleanMark value={Boolean(barberiaos)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Shell>

      {/* ── Calculadora ── */}
      <LostMoneyCalculator />

      {/* ── Clientes dormidos ── */}
      <Shell className="bg-[#080A0F] text-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Clientes dormidos"
            title="Detecta clientes que antes venían y ahora llevan semanas sin volver"
            description="BarberiaOS te ayuda a pasar de nombres sueltos a una base de datos propia con clientes frecuentes, nuevos y dormidos."
            align="center"
            variant="dark"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              ["Cliente frecuente", "Vino 5 veces. Ofrécele bono o membresía.", Star],
              ["Cliente dormido", "45 días sin volver. Envíale una campaña.", Clock],
              ["Huecos libres", "Esta tarde hay horas disponibles. Compártelas.", Zap],
            ].map(([title, text, Icon]) => {
              const TypedIcon = Icon as typeof Star;
              return (
                <article key={title as string} className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6">
                  <TypedIcon size={22} className="text-[#D5A84C]" />
                  <h3 className="mt-5 text-xl font-black">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </Shell>

      {/* ── Oferta fundadores ── */}
      <Shell id="fundadores">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#D5A84C]/30 bg-[#080A0F] p-8 text-center text-white shadow-[var(--shadow-card)] md:p-12">
          <Crown className="mx-auto text-[#D5A84C]" size={34} />
          <p className="mt-5 text-sm font-black uppercase text-[#D5A84C]">Oferta fundadores</p>
          <h2 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
            Primeras 10 barberías: configuración inicial gratis.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/65">
            Te ayudamos con servicios, barberos, horarios, QR, página pública y prueba de reserva real. Listos para empezar en menos de 48 horas.
          </p>
          <PrimaryButton href="/login" variant="gold" className="mt-8 min-h-12 px-7">
            Quiero mi plaza fundador <ArrowRight size={17} />
          </PrimaryButton>
        </div>
      </Shell>

      {/* ── Planes ── */}
      <Shell id="precios" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Planes"
            title="Precios claros según el momento de tu barbería"
            description="Empieza con lo esencial y sube cuando necesites marketplace, auditoría web, widget y automatizaciones."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex h-full flex-col rounded-[28px] border p-6 shadow-[var(--shadow-soft)] ${
                  plan.featured
                    ? "border-[#2563EB]/30 bg-[#F7FAFC] ring-1 ring-[#2563EB]/15"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-5 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-black text-white">
                    Más recomendado
                  </span>
                )}
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{plan.forWho}</p>
                <p className="mt-6 text-5xl font-black">{plan.price}</p>
                <div className="my-6 h-px bg-slate-200" />
                <ul className="flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm font-bold leading-6 text-slate-700">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <PrimaryButton
                  href="/login"
                  variant={plan.featured ? "primary" : "dark"}
                  className="mt-8 min-h-12 w-full"
                >
                  Activar mi barbería
                </PrimaryButton>
              </article>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── FAQ ── */}
      <Shell id="faq">
        <div className="mx-auto max-w-5xl">
          <SectionHeader eyebrow="FAQ" title="Preguntas antes de activar tu barbería" align="center" />
          <div className="mt-10 grid gap-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer text-base font-black text-[#080A0F]">{question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-500">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── CTA final ── */}
      <Shell className="pt-4">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[var(--shadow-card)] md:p-12">
          <ReceiptText className="mx-auto text-[#2563EB]" size={34} />
          <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            Reservas, caja, marketplace y auditoría web. Todo en un panel para tu barbería.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500">
            Te configuramos la agenda online gratis en menos de 48 horas para que empieces con una base sólida y crezcas desde ahí.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/login" variant="primary" className="min-h-12 px-7">
              Probar BarberíaOS gratis <ArrowRight size={17} />
            </PrimaryButton>
            <PrimaryButton href="/demo" variant="secondary" className="min-h-12 px-7">
              Ver cómo funciona
            </PrimaryButton>
          </div>
        </div>
      </Shell>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#D5A84C]">
                <Scissors size={18} />
              </span>
              <span className="font-black">BarberiaOS</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              SaaS vertical para barberías. Reservas, caja, marketplace y auditoría web en un solo panel.
            </p>
          </div>
          <nav className="grid gap-2 text-sm font-bold text-slate-500 sm:grid-cols-2 lg:grid-cols-3">
            {publicLegalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-[#080A0F]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

    </main>
  );
}
