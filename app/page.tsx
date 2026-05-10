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
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  QrCode,
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
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { SITE_URL } from "@/src/lib/site-url";

// ── Data ─────────────────────────────────────────────────────────────────────

const ownerPains = [
  {
    title: "El teléfono que no para",
    text: "\"¿Tienes hora para mañana?\" — te lo preguntan 40 veces por semana. Y cuando no contestas, la cita va al de al lado.",
  },
  {
    title: "Los no-show que no avisan",
    text: "Llegas el martes a las 10, la silla vacía, el cliente no llegó. Sin aviso. Sin compensación. Tiempo y dinero perdidos.",
  },
  {
    title: "No sabes cuánto ganaste hoy",
    text: "Cerraste el día con efectivo en el bolsillo, pero el número real está en tu cabeza, no en ningún sistema.",
  },
  {
    title: "Tu barbería no aparece en Google",
    text: "Alguien en tu ciudad busca \"barbería cerca\". Aparecen los de siempre. Tú no. No es porque seas peor — es presencia digital.",
  },
  {
    title: "Agenda en papel que nadie entiende",
    text: "Tú sabes leerla. Tu barbero del domingo, no. Y cuando alguien llama buscando hueco, tienes que buscar en tres páginas.",
  },
  {
    title: "No sabes qué barbero vende más",
    text: "Sin datos claros no puedes reconocer a los mejores ni detectar huecos por barbero. Todo va al feeling.",
  },
  {
    title: "Depende de plataformas que no son tuyas",
    text: "En Booksy o Treatwell los datos, la visibilidad y la relación con el cliente no son tuyos. Si cambian las reglas, lo pagas tú.",
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
  "No saber si tu web convierte a nuevos clientes",
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
    text: "Servicios, precios, horarios, barberos y datos básicos. Tú hablas, nosotros configuramos.",
  },
  {
    title: "Te dejamos todo listo",
    text: "Agenda online, QR, página pública, directorio y panel principal. Listo para recibir reservas en 48h.",
  },
  {
    title: "Empiezas a recibir citas",
    text: "Compartes el link en Instagram, Google, WhatsApp o en el local con tu QR. Tú cortas, el sistema trabaja.",
  },
];

const WHATSAPP_URL = "https://wa.me/34600000000?text=Hola%2C%20me%20interesa%20BarberíaOS";
const CONTACT_EMAIL = "hola@barberiaos.com";

const forWhom = [
  {
    title: "Gestionas reservas por WhatsApp",
    text: "Estás respondiendo mensajes a todas horas, buscando huecos en el papel y perdiendo citas cuando no contestas. Hay una forma mejor.",
  },
  {
    title: "Pierdes citas sin aviso",
    text: "Los no-show te cuestan tiempo y dinero. BarberíaOS permite que los clientes confirmen su cita y tú veas la agenda en tiempo real.",
  },
  {
    title: "No controlas lo que entra cada día",
    text: "Sabes que ganas dinero pero no exactamente cuánto, ni quién vende más, ni qué servicios son los más rentables.",
  },
  {
    title: "Tienes 2 o más barberos",
    text: "Coordinar agendas, medir rendimiento y repartir trabajo sin un sistema es imposible de escalar. Y tarde o temprano algo falla.",
  },
  {
    title: "Quieres reservas desde Instagram y Google",
    text: "Tienes Instagram, apareces en Maps, pero cuando alguien quiere reservar no hay dónde hacerlo. Pierdes esa conversión.",
  },
  {
    title: "Buscas alternativa a Booksy o Treatwell",
    text: "No quieres pagar comisión por cada cita ni ceder la relación con tus clientes a una plataforma que controla la agenda.",
  },
];

const modules = [
  ["Reservas sin esfuerzo", "Tus clientes reservan solos, a cualquier hora. Sin llamadas, sin mensajes.", CalendarClock],
  ["QR profesional", "Escanean, eligen y reservan. En mostrador, escaparate, Instagram o tarjeta.", QrCode],
  ["Tus clientes, tus datos", "Base de datos propia: frecuentes, nuevos y dormidos. Sin depender de nadie.", Users],
  ["Control por barbero", "Ventas, huecos, servicios y rendimiento de cada persona de tu equipo.", BarChart3],
  ["Caja siempre cuadrada", "Registra cada cobro, método de pago y propina. Cierre del día sin sorpresas.", WalletCards],
  ["Tu página pública", "/r/tu-barberia con servicios, precios, barberos y botón de reserva directo.", Globe],
  ["Directorio local", "Opcional: aparece en búsquedas locales por ciudad y barrio. Tu página privada nunca muestra otras barberías.", ShoppingBag],
  ["Auditoría web", "Analizamos tu web: HTTPS, SEO, velocidad y si inspira confianza para reservar.", ShieldCheck],
  ["Widget instalable", "Un botón flotante de reservas en tu web actual con una sola línea de código.", Code2],
  ["Estadísticas reales", "Ocupación, huecos libres y rendimiento en tiempo real. No hojas de Excel.", Gauge],
  ["Clientes dormidos", "Detecta quién lleva semanas sin volver y actúa antes de que se vayan para siempre.", TrendingUp],
  ["Recordatorios automáticos", "Reduce no-shows con confirmaciones antes de cada cita. Agenda siempre llena.", Zap],
];

const beforeAfter = [
  ["Agenda", "Mensajes sueltos y cambios difíciles de seguir", "Reservas ordenadas por barbero y hora"],
  ["Clientes", "Nombres perdidos en WhatsApp o papel", "Base de datos con historial y frecuencia"],
  ["Huecos", "Te enteras tarde de las horas libres", "Ves huecos y los puedes compartir rápido"],
  ["Caja", "Ventas poco claras al final del día", "Cobros y ventas por barbero en un panel"],
  ["Presencia", "No sabes si tu web convierte o falla", "Auditoría con puntuación y mejoras concretas"],
];

const traditionalComparison = [
  ["Reservas online 24/7", false, false, false, true, true],
  ["Clientes propios sin comisión", false, false, true, false, true],
  ["QR para el local", false, false, false, false, true],
  ["Recordatorios y confirmación", false, false, false, true, true],
  ["Ventas por barbero", false, false, true, false, true],
  ["Página pública propia", false, false, false, false, true],
  ["Directorio local", false, false, false, true, true],
  ["Auditoría web", false, false, false, false, true],
  ["Widget instalable", false, false, false, false, true],
  ["Recuperar clientes dormidos", false, false, false, false, true],
  ["Control sin depender de terceros", true, true, true, false, true],
];

const plans = [
  {
    name: "Arranca",
    price: "39 €",
    period: "/mes",
    forWho: "Para la barbería que deja el WhatsApp y empieza a gestionar reservas mientras duerme.",
    features: [
      "Página pública /r/tu-barberia: tus clientes reservan solos",
      "QR descargable para mostrador, escaparate e Instagram",
      "Agenda digital para 1 barbero — sin papel ni llamadas",
      "Gestión de servicios y base de clientes propia",
      "Resumen diario: sabes lo que entra cada día",
      "Soporte por chat en español",
    ],
  },
  {
    name: "Crece",
    price: "79 €",
    period: "/mes",
    forWho: "Para la barbería con equipo que quiere más clientes, caja cuadrada y visibilidad local.",
    featured: true,
    features: [
      "Todo en Arranca",
      "Hasta 5 barberos con agenda y rendimiento por persona",
      "Caja diaria: cada cobro registrado, cada propina contada",
      "Directorio local: nuevos clientes te encuentran por ciudad",
      "Auditoría web: sabes si tu web convierte o espanta clientes",
      "Widget de reservas para tu web actual",
      "Detección de clientes frecuentes y dormidos",
    ],
  },
  {
    name: "Domina",
    price: "149 €",
    period: "/mes",
    forWho: "Para la barbería consolidada que necesita datos reales y capacidad de escalar.",
    features: [
      "Todo en Crece",
      "Barberos ilimitados — escala sin límite",
      "Múltiples sedes desde un mismo panel",
      "Recordatorios automáticos: reduce no-show sin esfuerzo",
      "Reportes avanzados por barbero y periodo",
      "Configuración asistida por nuestro equipo",
      "Soporte prioritario — respuesta en menos de 4h",
    ],
  },
];

const faqs: [string, string][] = [
  [
    "¿Necesito conocimientos técnicos para usar BarberíaOS?",
    "No. Si sabes usar WhatsApp, puedes usar BarberíaOS. La configuración inicial guiada tarda menos de 10 minutos. Te ayudamos nosotros con los primeros pasos.",
  ],
  [
    "¿Mis clientes necesitan descargarse una app para reservar?",
    "No. Tus clientes reservan desde el navegador de su móvil — con el enlace que les envías, el QR de tu local o el widget en tu web. Sin apps, sin registros, en menos de un minuto.",
  ],
  [
    "¿BarberíaOS cobra comisión por cada reserva?",
    "No. Tu plan mensual es fijo. No importa cuántas citas tengas — sin comisión, sin sorpresas. Los clientes son tuyos, no de la plataforma.",
  ],
  [
    "¿Puedo tener solo mi enlace privado sin salir en el directorio?",
    "Sí. Puedes publicar tu perfil y tener el enlace /r/tu-barberia activo sin aparecer en el listado general. El directorio es opcional y se activa por separado desde tu panel.",
  ],
  [
    "¿Mis clientes verán otras barberías cuando entren a mi enlace privado?",
    "No. Tu enlace /r/tu-barberia es una página exclusiva de tu barbería. Tus clientes solo ven tus servicios, tus barberos y tu botón de reserva — ningún competidor aparece allí. El directorio /barberias es un espacio separado y opcional, pensado para que nuevos clientes te encuentren si decides activarlo.",
  ],
  [
    "¿Es obligatorio aparecer en el directorio público?",
    "No. El directorio es completamente opcional. Tu enlace privado funciona y tus clientes pueden reservar aunque no actives el directorio. Puedes activarlo o desactivarlo en cualquier momento desde tu panel, sin perder ninguna configuración.",
  ],
  [
    "¿El directorio me posiciona en Google Maps?",
    "No directamente. El directorio de BarberíaOS es una página indexable por buscadores que puede mejorar tu visibilidad en búsquedas como 'barbería en Madrid'. No es un sustituto de Google Business Profile ni garantizamos posicionamiento. Es una capa adicional de presencia digital.",
  ],
  [
    "¿Para qué sirve entonces el directorio?",
    "Para captar clientes nuevos que aún no te conocen. Cuando alguien busca 'barberías en tu ciudad', una página SEO bien estructurada puede aparecer en los resultados. Tus clientes habituales siguen usando tu enlace directo — el directorio está pensado para los que todavía no saben que existes.",
  ],
  [
    "¿La auditoría web es segura?",
    "Sí. Es completamente pasiva y no intrusiva: analiza tu web como lo haría un cliente o buscador. No accede a datos privados ni modifica nada. No es una prueba de penetración.",
  ],
  [
    "¿Necesito cambiar mi web actual para usar BarberíaOS?",
    "No. BarberíaOS te da una página pública propia (/r/tu-barberia) que funciona aunque no tengas web. Si ya tienes web, añades el botón de reservas con una línea de código.",
  ],
  [
    "¿BarberíaOS sustituye a Booksy o Treatwell?",
    "Depende de lo que busques. BarberíaOS está pensado para que controles tus clientes, tu caja y tus datos sin pagar comisión. Puedes usarlo junto a ellos o como alternativa directa.",
  ],
  [
    "¿Puedo probar sin pagar?",
    "Sí. El plan Arranca incluye un período de prueba gratuito. No pedimos tarjeta para empezar. Si quieres las funciones avanzadas, pruébas 14 días gratis con cualquier plan.",
  ],
  [
    "¿Cuánto tarda la configuración inicial?",
    "Menos de 48 horas cuando tenemos toda la información. Te ayudamos con servicios, barberos, horarios, QR y página pública.",
  ],
  [
    "¿Tiene permanencia?",
    "No. Sin permanencia, sin penalización. Cancela cuando quieras desde tu panel. Tus datos son siempre tuyos.",
  ],
  [
    "¿Los clientes son míos o de BarberíaOS?",
    "Son completamente tuyos. BarberíaOS te ayuda a construir tu propia base de datos — no los compartimos con nadie ni te los quitamos si cambias de plan.",
  ],
  [
    "¿Puedo hablar con alguien antes de contratar?",
    "Sí. Puedes escribirnos por WhatsApp o por email antes de tomar ninguna decisión. Te explicamos cómo funciona BarberíaOS para tu caso concreto, sin presión ni venta agresiva.",
  ],
  [
    "¿Tenéis WhatsApp de soporte?",
    "Sí. El soporte principal es por chat desde el panel, pero también puedes contactarnos por WhatsApp para resolver dudas antes de empezar o durante el onboarding inicial.",
  ],
  [
    "¿BarberíaOS sustituye a Booksy?",
    "Depende de tu situación. Si usas Booksy solo por la agenda, BarberíaOS cubre eso y mucho más — caja, barberos, página propia, widget, auditoría — sin pagar comisión por cada reserva. Puedes usarlos en paralelo durante la transición si quieres.",
  ],
  [
    "¿Puedo usarlo aunque aún no tenga web?",
    "Sí, y de hecho ese es el caso más habitual. BarberíaOS te da tu propia página pública /r/tu-barberia — no necesitas web previa. Si ya tienes web, añades el widget de reservas con una sola línea de código.",
  ],
  [
    "¿Qué incluye el programa fundador?",
    "Configuración inicial asistida por nuestro equipo (servicios, barberos, horarios, QR y página pública), soporte cercano durante los primeros meses y precio preferente mientras seas fundador. A cambio, pedimos feedback honesto para mejorar el sistema.",
  ],
  [
    "¿La auditoría web garantiza aparecer en Google?",
    "No. La auditoría analiza tu web — velocidad, seguridad, SEO básico y si convierte a reserva — y te da recomendaciones concretas. El posicionamiento real en Google depende de muchos factores y ninguna herramienta lo garantiza.",
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

// ── Local helpers ─────────────────────────────────────────────────────────────

function Shell({ children, className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`px-5 py-20 lg:px-8 ${className}`} {...props}>
      {children}
    </section>
  );
}

function BooleanMark({ value, gold = false }: { value: boolean; gold?: boolean }) {
  if (!value) {
    return <div className="flex justify-center text-slate-300"><Minus size={18} /></div>;
  }
  return (
    <div className={`flex justify-center ${gold ? "text-[#C9922A]" : "text-emerald-600"}`}>
      <Check size={18} strokeWidth={gold ? 3 : 2} />
    </div>
  );
}

function Kicker({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <p className={`text-[11px] font-black uppercase tracking-[0.06em] ${dark ? "text-[#D4A853]" : "text-[#C9922A]"}`}>
      {children}
    </p>
  );
}

function LandingSection({
  eyebrow,
  title,
  description,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <Kicker dark={dark}>{eyebrow}</Kicker>}
      <h2
        className={`mt-3 text-3xl font-black leading-tight md:text-5xl ${
          dark ? "text-white" : "text-[#080A0F]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-8 ${dark ? "text-white/60" : "text-slate-500"}`}>
          {description}
        </p>
      )}
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
            <p className="text-xs font-black uppercase text-[#C9922A]">BarberíaOS</p>
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
              <CalendarClock size={16} className="text-[#C9922A]" />
            </div>
            <div className="space-y-2">
              {appointments.map(([time, service, barber, status]) => (
                <div
                  key={`${time}-${service}`}
                  className="grid grid-cols-[54px_1fr_auto] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2 text-xs"
                >
                  <span className="font-black text-white">{time}</span>
                  <span className="min-w-0 truncate text-white/65">{service} · {barber}</span>
                  <span className={status === "Compartir" ? "font-black text-[#C9922A]" : "font-bold text-emerald-300"}>
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
                <div
                  key={alert}
                  className="rounded-xl border border-[#C9922A]/20 bg-[#C9922A]/10 p-3 text-xs font-bold text-[#F2D998]"
                >
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
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#080A0F] text-xs font-black text-[#C9922A]">
              {index + 1}
            </span>
            <span className="text-sm font-black text-slate-800">{item}</span>
            <CheckCircle2 size={17} className="ml-auto shrink-0 text-emerald-600" />
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
                className={`rounded-[4px] ${
                  index % 3 === 0 || index % 8 === 0 || index < 7 ? "bg-[#080A0F]" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
          <p className="mt-4 break-all text-center font-mono text-xs font-bold text-slate-500">
            {publicBookingExampleUrl}
          </p>
        </div>
        <div className="mx-auto w-full max-w-[290px] rounded-[30px] border border-slate-200 bg-[#080A0F] p-3 shadow-[var(--shadow-card)]">
          <div className="rounded-[24px] bg-white p-4">
            <p className="text-xs font-black uppercase text-[#C9922A]">Reserva móvil</p>
            <h3 className="mt-2 text-2xl font-black text-[#080A0F]">Black Crown</h3>
            <div className="mt-4 space-y-2">
              {["Corte premium - 22 €", "Corte + barba - 32 €", "Barba - 14 €"].map((service) => (
                <div key={service} className="rounded-2xl border border-slate-200 p-3 text-sm font-bold text-slate-700">
                  {service}
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-2xl bg-[#C9922A] px-4 py-3 text-sm font-black text-[#080A0F]">
              Reservar cita
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
            <p className="text-[10px] font-black uppercase tracking-wider text-[#C9922A]">
              BarberíaOS — Directorio local
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#080A0F] text-[#C9922A]">
                  <Scissors size={18} />
                </div>
                <span className="rounded-full border border-[#C9922A]/25 bg-[#C9922A]/10 px-2.5 py-0.5 text-xs font-bold text-[#7A5218]">
                  {b.score}
                </span>
              </div>
              <h3 className="mt-3 font-black text-[#080A0F]">{b.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={11} className="shrink-0" /> {b.city}
              </p>
              <p className="mt-2 text-xs text-slate-400">{b.services}</p>
              <button className="mt-4 w-full rounded-xl bg-[#C9922A] px-4 py-2.5 text-xs font-black text-[#080A0F]">
                Reservar cita
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
  const gaugeColor =
    score >= 80 ? "border-emerald-400" : score >= 60 ? "border-amber-400" : "border-red-400";
  const bandLabel = score >= 80 ? "Bueno" : score >= 60 ? "Mejorable" : "Crítico";
  const bandColor =
    score >= 80
      ? "bg-emerald-100 text-emerald-700"
      : score >= 60
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

  return (
    <ProductMockupCard className="mx-auto max-w-4xl">
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-6 sm:w-40">
          <p className="text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
            Puntuación web
          </p>
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full border-[10px] bg-white ${gaugeColor}`}
          >
            <span className="text-3xl font-black text-[#080A0F]">{score}</span>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-black ${bandColor}`}>
            {bandLabel}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {checks.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2.5"
            >
              <span className="text-sm font-bold text-slate-700">{c.name}</span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${colors[c.status]}`}
              >
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
            <div className="rounded-xl border border-slate-200 bg-[#0B0E14] px-4 py-4 font-mono text-xs leading-7 text-[#C9922A]">
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
              <QrCode size={14} className="text-[#C9922A]" />
              <span className="text-xs font-black text-[#C9922A]">Reservar ahora</span>
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://barberiaos.com/#software",
      "name": "BarberíaOS",
      "description": "Software de gestión para barberías: reservas online, caja, clientes, barberos, QR y página pública. Sin comisión por reserva.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "inLanguage": "es",
      "url": "https://barberiaos.com",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "39",
        "highPrice": "149",
        "priceCurrency": "EUR",
        "offerCount": "3",
      },
      "featureList": [
        "Reservas online 24h",
        "Agenda digital por barbero",
        "Caja y ventas diarias",
        "Base de clientes propia",
        "QR de reservas descargable",
        "Página pública /r/tu-barberia",
        "Directorio local por ciudad",
        "Auditoría web",
        "Widget instalable",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://barberiaos.com/#organization",
      "name": "BarberíaOS",
      "url": "https://barberiaos.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://barberiaos.com/icon.svg",
        "width": 512,
        "height": 512,
      },
      "description": "Software SaaS para barberías en España: reservas, caja, QR, barberos y presencia digital.",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hola@barberiaos.com",
        "contactType": "customer service",
        "availableLanguage": "es",
      },
      "sameAs": [
        "https://instagram.com/barberiaos",
        "https://tiktok.com/@barberiaos",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://barberiaos.com/#website",
      "name": "BarberíaOS",
      "url": "https://barberiaos.com",
      "inLanguage": "es",
      "publisher": { "@id": "https://barberiaos.com/#organization" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://barberiaos.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Necesito conocimientos técnicos para usar BarberíaOS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Si sabes usar WhatsApp, puedes usar BarberíaOS. La configuración inicial guiada tarda menos de 10 minutos. Te ayudamos nosotros con los primeros pasos.",
          },
        },
        {
          "@type": "Question",
          "name": "¿Mis clientes necesitan descargarse una app para reservar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Tus clientes reservan desde el navegador de su móvil — con el enlace que les envías, el QR de tu local o el widget en tu web. Sin apps, sin registros, en menos de un minuto.",
          },
        },
        {
          "@type": "Question",
          "name": "¿BarberíaOS cobra comisión por cada reserva?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Tu plan mensual es fijo. No importa cuántas citas tengas — sin comisión, sin sorpresas. Los clientes son tuyos, no de la plataforma.",
          },
        },
        {
          "@type": "Question",
          "name": "¿BarberíaOS sustituye a Booksy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Depende de tu situación. Si usas Booksy solo por la agenda, BarberíaOS cubre eso y mucho más — caja, barberos, página propia, widget, auditoría — sin pagar comisión por cada reserva.",
          },
        },
        {
          "@type": "Question",
          "name": "¿Puedo usarlo aunque aún no tenga web?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí. BarberíaOS te da tu propia página pública /r/tu-barberia — no necesitas web previa. Si ya tienes web, añades el widget de reservas con una sola línea de código.",
          },
        },
        {
          "@type": "Question",
          "name": "¿Tiene permanencia?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Sin permanencia, sin penalización. Cancela cuando quieras desde tu panel. Tus datos son siempre tuyos.",
          },
        },
        {
          "@type": "Question",
          "name": "¿La auditoría web garantiza aparecer en Google?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. La auditoría analiza tu web — velocidad, seguridad, SEO básico y si convierte a reserva — y te da recomendaciones concretas. El posicionamiento real en Google depende de muchos factores y ninguna herramienta lo garantiza.",
          },
        },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen overflow-hidden bg-[#FAFBFF] text-[#080A0F]">

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#C9922A]">
              <Scissors size={19} />
            </span>
            <span className="font-black tracking-tight">BarberíaOS</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-500 lg:flex">
            <a href="#marketplace" className="transition-colors hover:text-[#080A0F]">Directorio</a>
            <a href="#auditoria" className="transition-colors hover:text-[#080A0F]">Auditoría web</a>
            <a href="#precios" className="transition-colors hover:text-[#080A0F]">Precios</a>
            <a href="#faq" className="transition-colors hover:text-[#080A0F]">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 xl:inline-flex"
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
            <PrimaryButton href="/demo" variant="secondary" className="hidden md:inline-flex">
              Ver cómo funciona
            </PrimaryButton>
            <PrimaryButton href="/login" variant="ghost" className="hidden sm:inline-flex">
              Entrar
            </PrimaryButton>
            <PrimaryButton href="/login" variant="gold">
              Probar gratis
            </PrimaryButton>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <Shell className="pb-14 pt-12 lg:pb-20 lg:pt-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9922A]/20 bg-[#C9922A]/10 px-4 py-2 text-xs font-black uppercase text-[#C9922A]">
              <Sparkles size={14} /> Agenda online configurada gratis en 48h
            </div>
            <h1 className="mt-7 text-[clamp(2.5rem,6vw,5.2rem)] font-black leading-[0.95] tracking-tight">
              Software para barberías:{" "}
              <br className="hidden sm:block" />
              reservas, caja{" "}
              <br className="hidden sm:block" />
              y presencia online.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              BarberíaOS gestiona tus reservas, controla tu caja y pone tu barbería en Google, Instagram y WhatsApp — todo desde un panel hecho solo para barberías.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/login" variant="gold" className="min-h-12 px-7">
                Empieza gratis hoy <ArrowRight size={17} />
              </PrimaryButton>
              <PrimaryButton href="/demo" variant="secondary" className="min-h-12 px-6">
                Ver cómo funciona
              </PrimaryButton>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-slate-500">
              {[
                "Sin tarjeta de crédito",
                "Sin permanencia",
                "Setup guiado incluido",
                "Soporte en español",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" /> {item}
                </span>
              ))}
            </div>
          </div>
          <DashboardMockup />
        </div>
      </Shell>

      {/* ── Dolores ── */}
      <Shell className="bg-white">
        <div className="mx-auto max-w-7xl">
          <LandingSection
            eyebrow="Para dueños que conocen esto de sobra"
            title="¿Cuánto dinero pierde tu barbería cada semana sin saberlo?"
            description="El problema no es solo reservar. Es saber qué cliente viene, quién no aparece, qué barbero rinde más y si tu web convierte."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ownerPains.slice(0, 4).map((pain) => (
              <article key={pain.title} className="bento-card">
                <div className="metric-icon bg-red-50 text-red-500">
                  <X size={17} />
                </div>
                <h3 className="mt-5 text-lg font-black leading-snug">{pain.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{pain.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {ownerPains.slice(4).map((pain) => (
              <article key={pain.title} className="bento-card">
                <div className="metric-icon bg-red-50 text-red-500">
                  <X size={17} />
                </div>
                <h3 className="mt-5 text-lg font-black leading-snug">{pain.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{pain.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── Para quién es BarberíaOS ── */}
      <Shell id="para-quien" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <LandingSection
            eyebrow="Para quién es"
            title="BarberíaOS está hecho para barberías que reconocen esto."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forWhom.map((item) => (
              <article key={item.title} className="bento-card">
                <div className="metric-icon bg-[#C9922A]/10 text-[#C9922A]">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="mt-5 text-lg font-black leading-snug">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-[24px] border border-[#C9922A]/20 bg-[#C9922A]/5 px-6 py-5 text-center">
            <p className="text-sm font-bold text-[#7A5218]">
              ¿Te identificas con alguno de estos puntos?{" "}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#C9922A]">
                Cuéntanos tu caso por WhatsApp
              </a>{" "}
              — te decimos en 5 minutos si BarberíaOS encaja para ti.
            </p>
          </div>
        </div>
      </Shell>

      {/* ── Fugas de dinero ── */}
      <Shell>
        <div className="mx-auto max-w-7xl">
          <LandingSection
            eyebrow="Fugas de dinero"
            title="10 errores que están costando dinero a tu barbería ahora mismo"
            description="No necesitas vender humo para crecer. Necesitas cerrar estas fugas: agenda, QR, datos, caja y presencia online."
            align="center"
          />
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {moneyLeaks.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <X size={15} />
                </div>
                <p className="text-sm font-bold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── Setup ── */}
      <Shell id="setup" className="bg-[#080A0F] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <LandingSection
              eyebrow="Setup Seguro — 48h"
              title="No te damos un software vacío. Te dejamos la barbería lista para reservas."
              description="Configuramos la base para que puedas empezar sin perder tardes peleándote con tecnología."
              dark
            />
            <PrimaryButton href="/login" variant="gold" className="mt-8 min-h-12 px-7">
              Activar mi barbería <ArrowRight size={17} />
            </PrimaryButton>
          </div>
          <SetupVisual />
        </div>
      </Shell>

      {/* ── Proceso ── */}
      <Shell className="bg-white">
        <div className="mx-auto max-w-7xl">
          <LandingSection
            eyebrow="Proceso simple"
            title="De WhatsApp saturado a reservas automáticas en 3 pasos"
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="bento-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#080A0F] text-sm font-black text-[#C9922A]">
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
      <Shell>
        <div className="mx-auto max-w-7xl">
          <LandingSection
            eyebrow="Antes y después"
            title="Pasas de agenda desordenada a negocio controlado con presencia online"
            align="center"
          />
          <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
            {beforeAfter.map(([area, before, after]) => (
              <div
                key={area}
                className="grid gap-4 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[160px_1fr_1fr] md:items-center"
              >
                <p className="text-sm font-black uppercase text-[#C9922A]">{area}</p>
                <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold leading-6 text-red-800">
                  {before}
                </p>
                <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">
                  {after}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Shell>

      {/* ── Módulos ── */}
      <Shell id="modulos" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <LandingSection
            eyebrow="Sistema completo"
            title="Todo lo que una barbería moderna necesita en un solo panel"
            description="Reservas, caja, clientes, barberos, página pública, directorio local, auditoría web y widget. Sin comisiones. Sin depender de terceros."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {modules.map(([title, text, Icon]) => {
              const TypedIcon = Icon as typeof CalendarClock;
              return (
                <article key={title as string} className="bento-card">
                  <div className="metric-icon bg-[#C9922A]/10 text-[#C9922A]">
                    <TypedIcon size={18} />
                  </div>
                  <h3 className="mt-5 text-lg font-black">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </Shell>

      {/* ── Marketplace ── */}
      <Shell id="marketplace">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <LandingSection
                eyebrow="Directorio local"
                title="Nuevos clientes que llegan solos, sin publicidad."
                description="BarberíaOS incluye un directorio público de barberías organizado por ciudad. Tu perfil tiene logo, portada, servicios, ubicación y botón de reserva directo. Sin comisión por cita."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Página SEO optimizada por ciudad y barrio",
                  "Botones de reservar y WhatsApp directos",
                  "Logo, portada, descripción y dirección",
                  "Tu página privada /r/tu-barberia nunca muestra competidores",
                  "El directorio es opcional — se activa por separado",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <PrimaryButton href="/login" variant="gold" className="mt-8 min-h-12 px-6">
                Activar mi perfil en el directorio <ArrowRight size={17} />
              </PrimaryButton>
            </div>
            <MarketplaceMockup />
          </div>
        </div>
      </Shell>

      {/* ── Página pública + QR ── */}
      <Shell id="qr" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <QRVisual />
            <div>
              <LandingSection
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
              <LandingSection
                eyebrow="Auditoría web"
                title="¿Tu web está perdiendo clientes que nunca sabrás que existieron?"
                description="BarberíaOS analiza la web de tu barbería en minutos: velocidad, seguridad, indexación en Google y si inspira confianza para reservar."
                dark
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Técnica", ["HTTPS", "Certificado SSL", "Cabeceras de seguridad"]],
                  ["SEO básico", ["Título de la página", "Meta descripción", "Encabezado H1"]],
                  ["Conversión", ["Botón de reserva visible", "WhatsApp visible", "Precios visibles"]],
                  ["Presencia", ["Google Maps", "BarberíaOS instalado", "Canonical"]],
                ].map(([cat, items]) => (
                  <div key={cat as string} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#C9922A]">
                      {cat as string}
                    </p>
                    <ul className="space-y-1">
                      {(items as string[]).map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs font-bold text-white/70">
                          <ShieldCheck size={11} className="shrink-0 text-[#C9922A]" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs leading-5 text-white/50">
                Análisis completamente pasivo y no intrusivo. Lee tu web como lo haría un cliente o buscador. No accede a datos privados ni modifica nada.
              </div>
              <PrimaryButton href="/login" variant="gold" className="mt-6 min-h-12 px-6">
                Analizar mi web gratis <ArrowRight size={17} />
              </PrimaryButton>
            </div>
            <AuditMockup />
          </div>
        </div>
      </Shell>

      {/* ── Widget ── */}
      <Shell id="widget">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <WidgetVisual />
            <div>
              <LandingSection
                eyebrow="Widget instalable"
                title="Un botón en tu web. Reservas 24 horas."
                description="¿Ya tienes web? No la cambies. Añade un botón flotante de reservas con una sola línea de código. Funciona en WordPress, Wix, Squarespace y cualquier plataforma."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Botón flotante 'Reservar ahora' siempre visible",
                  "Se conecta a tu agenda de BarberíaOS automáticamente",
                  "CSS completamente aislado — no rompe el diseño de tu web",
                  "Sin cookies, sin datos del visitante, sin carga adicional",
                  "Instalación en 2 minutos — solo una línea de código",
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

      {/* ── Por qué no somos otra agenda ── */}
      <Shell className="bg-[#080A0F] text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <LandingSection
                eyebrow="No somos otra agenda"
                title="Mientras una agenda gestiona horas, BarberíaOS gestiona tu negocio."
                description="Booksy te da agenda. WhatsApp te da mensajes. Excel te da cálculos. BarberíaOS te da un sistema completo pensado solo para barberías."
                dark
              />
              <ul className="mt-8 space-y-3">
                {[
                  "Reservas + caja + clientes en un panel",
                  "Página pública propia sin comisión por cita",
                  "Directorio local para captar clientes nuevos",
                  "Auditoría web con puntuación y mejoras concretas",
                  "Widget de reservas para tu web actual",
                  "Detección de clientes dormidos y base de datos propia",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-white/80">
                    <CheckCircle2 size={15} className="shrink-0 text-[#C9922A]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["WhatsApp", "Mensajes. Sin agenda, sin datos, sin caja.", false],
                ["Excel o papel", "Números. Sin clientes, sin web, sin reservas.", false],
                ["Booksy / Treatwell", "Agenda + comisión. Tus clientes son de ellos.", false],
                ["BarberíaOS", "Reservas + caja + clientes + página + directorio. Tuyos.", true],
              ].map(([name, desc, gold]) => (
                <div
                  key={name as string}
                  className={`rounded-[20px] border p-5 ${
                    gold
                      ? "border-[#C9922A]/40 bg-[#C9922A]/10"
                      : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <p className={`font-black ${gold ? "text-[#C9922A]" : "text-white/50"}`}>
                    {name as string}
                  </p>
                  <p className={`mt-2 text-xs leading-5 ${gold ? "text-white/85" : "text-white/35"}`}>
                    {desc as string}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Shell>

      {/* ── Comparativa ── */}
      <Shell id="comparativa" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <LandingSection
            eyebrow="Por qué BarberíaOS no es otra agenda genérica"
            title="Mientras otras plataformas son agendas genéricas, BarberíaOS está hecho solo para barberías."
            description="WhatsApp sirve para hablar. Una barbería que quiere crecer necesita reservas, datos propios, caja, página pública, directorio, auditoría web y widget. Todo en un panel."
            align="center"
          />
          <div className="mt-10 overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
            <div className="min-w-[880px]">
              <div className="grid grid-cols-[1.6fr_repeat(5,0.68fr)] border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-xs font-black uppercase text-slate-500">
                <span className="text-left">Función</span>
                <span>WhatsApp</span>
                <span>Papel</span>
                <span>Excel</span>
                <span>Booksy</span>
                <span className="text-[#C9922A]">BarberíaOS</span>
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
                  <BooleanMark value={Boolean(barberiaos)} gold />
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
          <LandingSection
            eyebrow="Clientes dormidos"
            title="Detecta clientes que antes venían y ahora llevan semanas sin volver"
            description="BarberíaOS te ayuda a pasar de nombres sueltos a una base de datos propia con clientes frecuentes, nuevos y dormidos."
            align="center"
            dark
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              [
                "Cliente frecuente",
                "Vino 5 veces. Ofrécele bono o membresía antes de que se vaya al de enfrente.",
                Star,
              ],
              [
                "Cliente dormido",
                "45 días sin volver. Envíale una campaña. Es más fácil recuperar que conseguir uno nuevo.",
                Clock,
              ],
              [
                "Huecos libres",
                "Esta tarde hay horas disponibles. Compártelas en Instagram antes de que el día se pierda.",
                Zap,
              ],
            ].map(([title, text, Icon]) => {
              const TypedIcon = Icon as typeof Star;
              return (
                <article
                  key={title as string}
                  className="rounded-[28px] border border-white/10 bg-white/[0.055] p-6"
                >
                  <TypedIcon size={22} className="text-[#C9922A]" />
                  <h3 className="mt-5 text-xl font-black">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </Shell>

      {/* ── Programa Fundadores ── */}
      <Shell id="fundadores">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#C9922A]/25 bg-[#080A0F] p-8 text-white shadow-[var(--shadow-card)] md:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Crown className="text-[#C9922A]" size={34} />
              <p className="mt-5 text-[11px] font-black uppercase tracking-[0.06em] text-[#C9922A]">
                Programa Fundadores BarberíaOS 2026
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
                Construimos BarberíaOS con barberías reales.
              </h2>
              <p className="mt-5 text-base leading-8 text-white/65">
                Estamos incorporando barberías fundadoras para desarrollar el sistema con feedback directo.
                Las barberías fundadoras reciben configuración asistida, soporte cercano y precio preferente.
                A cambio, pedimos honestidad: lo que falla, lo que falta y lo que sobra.
              </p>
            </div>
            <div className="shrink-0 space-y-3 lg:w-72">
              {[
                ["Configuración asistida", "Nosotros lo dejamos listo en 48h"],
                ["Precio preferente", "Bloqueado mientras seas fundador"],
                ["Soporte cercano", "Hablas con quien resuelve el problema"],
                ["Feedback real", "Tu opinión moldea el producto"],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#C9922A]" />
                  <div>
                    <p className="text-sm font-black text-white">{title}</p>
                    <p className="mt-0.5 text-xs text-white/50">{desc}</p>
                  </div>
                </div>
              ))}
              <PrimaryButton href="/login" variant="gold" className="mt-2 min-h-12 w-full px-6">
                Solicitar plaza fundador <ArrowRight size={17} />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Shell>

      {/* ── Sin humo / Honestidad ── */}
      <Shell className="bg-white pt-0">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[28px] border border-slate-200 bg-[#F6F8FB] p-8 text-center md:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.06em] text-[#C9922A]">Sin humo</p>
            <h2 className="mt-3 text-2xl font-black leading-tight text-[#080A0F] md:text-3xl">
              Somos honestos: BarberíaOS está en fase de lanzamiento.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              No tenemos 500 barberías ni montones de reseñas. Lo que tenemos es un sistema funcional,
              serio y construido para barberías reales — y estamos buscando las primeras que quieran
              probarlo con nosotros y crecer juntos.
            </p>
            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              {[
                ["Sistema funcional", "Todo lo que ves en esta página está construido y funcionando: reservas, caja, clientes, barberos, QR, página pública, marketplace y auditoría web."],
                ["Soporte sin bots", "No somos una empresa gigante. Si tienes un problema, hablas con la persona que lo va a resolver — no con una respuesta automática."],
                ["Sin permanencia", "Sin contrato. Sin penalización. Si en algún momento no te funciona, cancelas cuando quieras y tus datos son siempre tuyos."],
              ].map(([title, text]) => (
                <div key={title as string} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="font-black text-[#080A0F]">{title as string}</p>
                  <p className="mt-2 text-xs leading-6 text-slate-500">{text as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Shell>

      {/* ── Planes ── */}
      <Shell id="precios" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <LandingSection
            eyebrow="Precios claros, sin letra pequeña"
            title="Elige el plan para el tamaño de tu ambición."
            description="Empieza gratis. Crece cuando estés listo. Sin tarjeta, sin permanencia, sin sorpresas."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex h-full flex-col rounded-[28px] border p-6 shadow-[var(--shadow-soft)] ${
                  plan.featured
                    ? "border-[#C9922A]/40 bg-[#FAFBFF] ring-1 ring-[#C9922A]/20"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-5 rounded-full bg-[#C9922A] px-3 py-1 text-xs font-black text-[#080A0F]">
                    El más elegido
                  </span>
                )}
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{plan.forWho}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </div>
                <div className="my-6 h-px bg-slate-100" />
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
                  variant={plan.featured ? "gold" : "dark"}
                  className="mt-8 min-h-12 w-full"
                >
                  {plan.featured ? "Quiero el Crece" : `Empezar con ${plan.name}`}
                </PrimaryButton>
                <p className="mt-3 text-center text-xs text-slate-400">
                  Sin tarjeta · Sin contrato
                </p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-400">
            Todos los planes incluyen actualizaciones sin coste adicional. Sin comisión por reserva. Sin cuota de instalación.
          </p>
        </div>
      </Shell>

      {/* ── FAQ ── */}
      <Shell id="faq">
        <div className="mx-auto max-w-5xl">
          <LandingSection
            eyebrow="FAQ"
            title="Lo que los dueños suelen preguntar antes de empezar"
            align="center"
          />
          <div className="mt-10">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </Shell>

      {/* ── CTA final ── */}
      <Shell className="pt-4">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-[#C9922A]/20 bg-[#080A0F] p-8 text-center text-white shadow-[var(--shadow-card)] md:p-16">
          <Scissors className="mx-auto text-[#C9922A]" size={36} />
          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.06em] text-[#C9922A]">
            Empieza hoy
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight text-white md:text-6xl">
            Reservas, caja, directorio y auditoría web.{" "}
            <br className="hidden lg:block" />
            Todo en un panel para tu barbería.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/65">
            Te configuramos la agenda online gratis en menos de 48 horas para que empieces con una base sólida y crezcas desde ahí.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/login" variant="gold" className="min-h-12 px-8">
              Activa tu barbería ahora <ArrowRight size={17} />
            </PrimaryButton>
            <PrimaryButton href="/demo" variant="ghost" className="min-h-12 px-7 text-white/70 hover:bg-white/10 hover:text-white">
              Ver cómo funciona
            </PrimaryButton>
          </div>
          <p className="mt-6 text-sm text-white/40">
            Sin tarjeta · Sin permanencia · Configuración guiada incluida
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-8 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/20"
            >
              <MessageCircle size={15} />
              Hablar por WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <Mail size={15} />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </Shell>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#C9922A]">
                  <Scissors size={18} />
                </span>
                <span className="font-black tracking-tight">BarberíaOS</span>
              </Link>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sistema operativo para barberías modernas. Reservas, caja, directorio y auditoría web en un solo panel. Sin comisiones.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
                >
                  <MessageCircle size={15} />
                  WhatsApp — contacto directo
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#080A0F]"
                >
                  <Mail size={15} />
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://instagram.com/barberiaos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-400 transition hover:text-[#080A0F]"
                >
                  Instagram
                </a>
                <span className="text-slate-200">·</span>
                <a
                  href="https://tiktok.com/@barberiaos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-400 transition hover:text-[#080A0F]"
                >
                  TikTok
                </a>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Producto</p>
                <nav className="flex flex-col gap-2 text-sm font-bold text-slate-500">
                  <Link href="/#modulos" className="transition-colors hover:text-[#080A0F]">Módulos</Link>
                  <Link href="/#precios" className="transition-colors hover:text-[#080A0F]">Precios</Link>
                  <Link href="/#fundadores" className="transition-colors hover:text-[#080A0F]">Programa Fundadores</Link>
                  <Link href="/demo" className="transition-colors hover:text-[#080A0F]">Ver demo</Link>
                </nav>
              </div>
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Legal</p>
                <nav className="flex flex-col gap-2 text-sm font-bold text-slate-500">
                  {publicLegalLinks.slice(0, 5).map((item) => (
                    <Link key={item.href} href={item.href} className="transition-colors hover:text-[#080A0F]">
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} BarberíaOS — Todos los derechos reservados.
            Hecho para barberías que quieren crecer sin depender de terceros.
          </div>
        </div>
      </footer>

    </main>
    </>
  );
}
