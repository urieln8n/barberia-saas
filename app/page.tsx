import Link from "next/link";
import type { HTMLAttributes } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  Minus,
  QrCode,
  ReceiptText,
  Scissors,
  ShieldCheck,
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

const ownerPains = [
  {
    title: "Reservas perdidas por WhatsApp",
    text: "Mensajes mezclados, cambios de hora sin control y clientes que se quedan esperando respuesta.",
  },
  {
    title: "No-shows y huecos vacíos",
    text: "Cada cita olvidada bloquea una hora que otro cliente sí habría reservado.",
  },
  {
    title: "Clientes que dejan de venir",
    text: "Sin base de datos clara, no sabes quién era frecuente y lleva semanas sin volver.",
  },
  {
    title: "Barberos sin medición",
    text: "Difícil saber quién vende más, qué servicios salen y cómo se reparte la caja.",
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
    text: "Dejamos lista tu agenda online, QR, página pública y panel principal.",
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
  ["Recuperación", "Detecta clientes que llevan semanas sin volver.", TrendingUp],
];

const beforeAfter = [
  ["Agenda", "Mensajes sueltos y cambios difíciles de seguir", "Reservas ordenadas por barbero y hora"],
  ["Clientes", "Nombres perdidos en WhatsApp o papel", "Base de datos con historial y frecuencia"],
  ["Huecos", "Te enteras tarde de las horas libres", "Ves huecos y los puedes compartir rápido"],
  ["Caja", "Ventas poco claras al final del día", "Cobros y ventas por barbero en un panel"],
];

const traditionalComparison = [
  ["Reservas online 24/7", false, false, false, true, true],
  ["Clientes propios", false, false, true, false, true],
  ["QR para el local", false, false, false, false, true],
  ["Recordatorios y confirmación", false, false, false, true, true],
  ["Ventas por barbero", false, false, true, false, true],
  ["Recuperar clientes dormidos", false, false, false, false, true],
  ["Control sin depender de terceros", true, true, true, false, true],
];

const plans = [
  {
    name: "Básico",
    price: "39 €/mes",
    forWho: "Para barbería pequeña o autónomo",
    features: ["Agenda online", "Página pública", "QR de reservas", "Servicios y barberos", "Soporte básico"],
  },
  {
    name: "Pro",
    price: "79 €/mes",
    forWho: "Para barbería con equipo",
    featured: true,
    features: ["Todo en Básico", "Caja diaria", "Ventas por barbero", "Clientes frecuentes y dormidos", "Acciones recomendadas"],
  },
  {
    name: "Premium",
    price: "149 €/mes",
    forWho: "Para barbería que quiere marketing y automatización",
    features: ["Todo en Pro", "Reseñas", "Campañas de recuperación", "Automatizaciones", "Prioridad en soporte"],
  },
];

const faqs = [
  ["¿Necesito saber de tecnología?", "No. La idea es que no recibas un software vacío: te guiamos con servicios, barberos, horarios, QR y página pública."],
  ["¿Puedo usarlo con Instagram?", "Sí. Puedes poner tu link de reservas en la bio, historias, destacados, mensajes de WhatsApp, Google Business Profile o QR físico."],
  ["¿Puedo poner el QR en el local?", "Sí. BarberiaOS genera una página pública para que el cliente reserve desde el móvil al escanear el QR."],
  ["¿Puedo usarlo si ya tengo Booksy o Treatwell?", "Sí. Puedes usar BarberiaOS para recuperar control de tus clientes, tu QR y tus datos, sin depender solo de marketplaces."],
  ["¿Cuánto tarda la configuración?", "La oferta de entrada es dejar la agenda online configurada en menos de 48h cuando tenemos la información necesaria."],
  ["¿Tiene permanencia?", "No. La propuesta comercial es sin permanencia y sin tarjeta para la configuración inicial gratuita."],
  ["¿Los clientes son míos?", "Sí. El posicionamiento de BarberiaOS es ayudarte a construir una base de datos propia de clientes de tu barbería."],
  ["¿Puedo controlar ventas por barbero?", "Sí. BarberiaOS incluye vistas para caja, ventas por barbero y rendimiento diario."],
];

const publicLegalLinks = [
  { href: "/legal/aviso-legal", label: "Aviso Legal" },
  { href: "/legal/privacidad", label: "Privacidad" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/terminos", label: "Términos" },
  { href: "/legal/condiciones-contratacion", label: "Condiciones de contratación" },
  { href: "/legal/contacto", label: "Contacto legal" },
];

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
            <p className="mt-1 text-xl font-black text-white">Agenda online lista</p>
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
              {["3 citas sin confirmar mañana", "8 clientes llevan 45 días sin volver", "Martes con baja ocupación"].map((alert) => (
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

function BooleanMark({ value }: { value: boolean }) {
  return (
    <div className={value ? "flex justify-center text-emerald-600" : "flex justify-center text-slate-300"}>
      {value ? <Check size={18} /> : <Minus size={18} />}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7FAFC] text-[#080A0F]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#D5A84C]">
              <Scissors size={19} />
            </span>
            <span className="font-black">BarberiaOS</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-500 lg:flex">
            <a href="#setup">Setup gratis</a>
            <a href="#comparativa">Comparativa</a>
            <a href="#calculadora">Calculadora</a>
            <a href="#precios">Precios</a>
          </nav>
          <div className="flex items-center gap-2">
            <PrimaryButton href="/demo" variant="secondary" className="hidden md:inline-flex">
              Ver demo
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

      <Shell className="pb-14 pt-12 lg:pb-20 lg:pt-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/10 px-4 py-2 text-xs font-black uppercase text-[#2563EB]">
              <Sparkles size={14} /> Agenda online configurada gratis
            </div>
            <h1 className="mt-7 text-[clamp(2.7rem,6.7vw,5.8rem)] font-black leading-[0.95] tracking-normal">
              Te configuramos tu agenda online GRATIS en menos de 48h.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              BarberiaOS es el sistema exclusivo para barberías con reservas online, QR, clientes, barberos, recordatorios, caja, ventas por barbero y recuperación de clientes dormidos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/login" variant="primary" className="min-h-12 px-6">
                Probar BarberiaOS gratis <ArrowRight size={17} />
              </PrimaryButton>
              <PrimaryButton href="/demo" variant="secondary" className="min-h-12 px-6">
                Ver demo
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

      <Shell>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Dolor real"
            title="Tu barbería pierde dinero cuando la agenda depende de memoria, papel o mensajes sueltos."
            description="El problema no es solo reservar. Es saber qué cliente viene, quién no aparece, qué barbero tiene huecos y qué clientes se están enfriando."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ownerPains.map((pain) => (
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

      <Shell className="bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Errores caros"
            title="Errores que están costando dinero a tu barbería"
            description="No necesitas vender humo para crecer. Necesitas cerrar fugas básicas: agenda, confirmaciones, QR, datos y seguimiento."
            align="center"
          />
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {moneyLeaks.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="metric-icon bg-red-50 text-red-600">
                  <X size={16} />
                </div>
                <p className="text-sm font-black text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Shell>

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

      <Shell>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Proceso simple"
            title="De WhatsApp saturado a reservas online en 3 pasos"
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

      <Shell className="bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Antes y después"
            title="Pasas de agenda desordenada a negocio controlado"
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

      <Shell id="modulos">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Sistema operativo"
            title="Todo lo que el dueño necesita ver para dirigir mejor la barbería"
            description="No es una agenda genérica. Está pensado alrededor de reservas, barberos, caja, QR, clientes y huecos de una barbería real."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      <Shell id="comparativa" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Comparativa"
            title="BarberiaOS vs WhatsApp, papel, Excel y marketplaces"
            description="WhatsApp sirve para hablar. Una barbería que quiere crecer necesita reservas online, datos propios, QR, caja y seguimiento."
            align="center"
          />
          <div className="mt-10 overflow-x-auto rounded-[28px] border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[1.4fr_repeat(5,0.8fr)] border-b border-slate-200 bg-slate-50 px-4 py-4 text-center text-xs font-black uppercase text-slate-500">
                <span className="text-left">Función</span>
                <span>WhatsApp</span>
                <span>Papel</span>
                <span>Excel</span>
                <span>Marketplace</span>
                <span className="text-[#2563EB]">BarberiaOS</span>
              </div>
              {traditionalComparison.map(([feature, whatsapp, paper, excel, marketplace, barberiaos]) => (
                <div key={feature as string} className="grid grid-cols-[1.4fr_repeat(5,0.8fr)] items-center border-b border-slate-100 px-4 py-4 last:border-b-0">
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

      <LostMoneyCalculator />

      <Shell id="qr" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="QR y reservas online"
            title="Recibe reservas desde Instagram, Google, WhatsApp y el QR de tu local"
            description="Tu cliente escanea, elige servicio, barbero y hora. Tú dejas de perseguir mensajes para cerrar citas."
            align="center"
          />
          <div className="mt-12">
            <QRVisual />
          </div>
        </div>
      </Shell>

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

      <Shell id="fundadores">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#D5A84C]/30 bg-[#080A0F] p-8 text-center text-white shadow-[var(--shadow-card)] md:p-12">
          <Crown className="mx-auto text-[#D5A84C]" size={34} />
          <p className="mt-5 text-sm font-black uppercase text-[#D5A84C]">Oferta fundadores</p>
          <h2 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
            Primeras 10 barberías: configuración inicial gratis.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/65">
            Te ayudamos con servicios, barberos, horarios, QR, página pública y prueba de reserva real para salir funcionando.
          </p>
          <PrimaryButton href="/login" variant="gold" className="mt-8 min-h-12 px-7">
            Quiero mi plaza fundador <ArrowRight size={17} />
          </PrimaryButton>
        </div>
      </Shell>

      <Shell id="precios" className="bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Planes"
            title="Precios claros según el momento de tu barbería"
            description="Empieza con lo esencial y sube cuando necesites más control, marketing y automatización."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex h-full flex-col rounded-[28px] border p-6 shadow-[var(--shadow-soft)] ${
                  plan.featured ? "border-[#2563EB]/30 bg-[#F7FAFC] ring-1 ring-[#2563EB]/15" : "border-slate-200 bg-white"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-5 rounded-full bg-[#2563EB] px-3 py-1 text-xs font-black text-white">
                    Más recomendado
                  </span>
                )}
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{plan.forWho}</p>
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
                <PrimaryButton href="/login" variant={plan.featured ? "primary" : "dark"} className="mt-8 min-h-12 w-full">
                  Activar mi barbería
                </PrimaryButton>
              </article>
            ))}
          </div>
        </div>
      </Shell>

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

      <Shell className="pt-4">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[var(--shadow-card)] md:p-12">
          <ReceiptText className="mx-auto text-[#2563EB]" size={34} />
          <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            Pasa de WhatsApp saturado a reservas online, QR profesional y negocio medible.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500">
            Te configuramos la agenda online gratis en menos de 48h para que puedas empezar con una base clara.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/login" variant="primary" className="min-h-12 px-7">
              Probar BarberiaOS gratis <ArrowRight size={17} />
            </PrimaryButton>
            <PrimaryButton href="/demo" variant="secondary" className="min-h-12 px-7">
              Ver demo
            </PrimaryButton>
          </div>
        </div>
      </Shell>

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
              SaaS vertical para barberías. Documentación legal modelo pendiente de revisión profesional.
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
