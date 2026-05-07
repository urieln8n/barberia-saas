import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Globe,
  Instagram,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  QrCode,
  Scissors,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { PricingCard } from "@/components/marketing/PricingCard";

const painPoints = [
  {
    icon: MessageCircle,
    title: "WhatsApp se convierte en agenda",
    text: "Reservas, cambios y cancelaciones se mezclan en chats sin trazabilidad.",
  },
  {
    icon: Clock3,
    title: "Huecos vacíos en la agenda",
    text: "Cuando nadie confirma, el día se rompe y el tiempo facturable se pierde.",
  },
  {
    icon: Smartphone,
    title: "Todo depende del móvil",
    text: "No tienes una vista clara del día, de los clientes ni de lo que entra en caja.",
  },
  {
    icon: Instagram,
    title: "Tu tráfico social no convierte",
    text: "La gente te ve en Instagram o Google, pero no siempre encuentra un camino directo para reservar.",
  },
];

const benefits = [
  "Reservas por link y QR sin llamar.",
  "Agenda clara por barbero, día y estado.",
  "Clientes con historial, notas y contacto.",
  "Servicios y precios ordenados desde un panel simple.",
];

const features = [
  {
    icon: QrCode,
    title: "Reservas por QR",
    text: "Imprímelo en el local o compártelo en redes para captar reservas 24/7.",
  },
  {
    icon: Globe,
    title: "Página pública",
    text: "Cada barbería tiene su enlace de reservas listo para usar en Instagram, Google o WhatsApp.",
  },
  {
    icon: LayoutDashboard,
    title: "Panel de gestión",
    text: "Una vista central para agenda, clientes, servicios, barberos e ingresos básicos.",
  },
  {
    icon: CalendarCheck,
    title: "Agenda por barbero",
    text: "Organiza citas por hora, servicio, profesional y estado sin fricción.",
  },
  {
    icon: Users,
    title: "CRM de clientes",
    text: "Guarda teléfono, notas e historial para seguir mejor cada cliente.",
  },
  {
    icon: Scissors,
    title: "Servicios y equipo",
    text: "Configura servicios, duración y barberos sin depender de soporte técnico.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Configuras la barbería",
    text: "Añades servicios, barberos y datos básicos del negocio.",
  },
  {
    number: "02",
    title: "Compartes el link o el QR",
    text: "Lo colocas en Instagram, Google, WhatsApp o en el local.",
  },
  {
    number: "03",
    title: "El cliente reserva",
    text: "Elige fecha, hora, servicio y barbero desde su móvil.",
  },
  {
    number: "04",
    title: "Gestionas desde BarberiaOS",
    text: "La agenda, los clientes y los ingresos quedan en un solo panel.",
  },
];

const productTiles = [
  {
    title: "Agenda de hoy",
    icon: CalendarCheck,
    items: ["10:00 Corte + barba", "11:30 Degradado", "13:00 Barba"],
  },
  {
    title: "Clientes",
    icon: Users,
    items: ["Teléfono y notas", "Historial de visitas", "Seguimiento manual"],
  },
  {
    title: "Ingresos básicos",
    icon: BarChart3,
    items: ["12 citas", "340 € estimados", "4 nuevos clientes"],
  },
  {
    title: "Reservas activas",
    icon: QrCode,
    items: ["QR visible", "Link público", "Reserva sin cuenta"],
  },
];

const proofPoints = [
  "Sin apps que instalar",
  "Soporte en español",
  "Configuración guiada",
  "Enfocado en barberías reales",
];

const serviceCards = [
  {
    icon: Instagram,
    title: "Canal de entrada claro",
    text: "Convierte la bio de Instagram y el perfil de Google en reservas directas.",
  },
  {
    icon: Megaphone,
    title: "Recuperación de clientes",
    text: "Usa el historial y las notas para reactivar clientes de forma manual y ordenada.",
  },
  {
    icon: Star,
    title: "Presentación premium",
    text: "Tu barbería se ve más seria, más organizada y más fácil de reservar.",
  },
  {
    icon: Zap,
    title: "Puesta en marcha rápida",
    text: "Empiezas con una base funcional sin depender de una implantación larga.",
  },
];

const faqs = [
  {
    q: "¿Necesito instalar algo?",
    a: "No. BarberiaOS funciona desde el navegador en móvil y en ordenador.",
  },
  {
    q: "¿Mis clientes crean cuenta?",
    a: "No. Reservan con su nombre y datos básicos, sin registro.",
  },
  {
    q: "¿Puedo usar un QR en el local?",
    a: "Sí. El sistema está pensado para que el QR y el enlace público sean parte de la captación.",
  },
  {
    q: "¿Esto sustituye todo el trabajo de la barbería?",
    a: "No. Ordena reservas, clientes, barberos, servicios e ingresos básicos para que el negocio fluya mejor.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(47,111,235,0.08),transparent_28%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_46%,#F3F6FA_100%)] text-[#111827]">
      <section className="border-b border-[#DDE7FB] bg-white/80">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <nav className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2F6FEB]/20 bg-[#2F6FEB] text-white shadow-sm">
                <Scissors size={20} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#2F6FEB]">
                  BarberiaOS
                </p>
                <p className="text-sm text-neutral-500">
                  Sistema para barberías
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <a
                href="#precios"
                className="hidden rounded-xl border border-[#DCE3EE] bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#C9D4E3] hover:bg-[#F8FAFC] sm:inline-flex"
              >
                Planes
              </a>
              <Link
                href="/login"
                className="btn-dark"
              >
                Entrar
              </Link>
            </div>
          </nav>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F6FEB]/20 bg-[#2F6FEB]/8 px-4 py-2 text-sm font-semibold text-[#2F6FEB]">
              <Sparkles size={15} />
              Reservas + agenda + clientes + ingresos básicos
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-[#111827] sm:text-6xl lg:text-7xl">
                Organiza tu barbería y convierte visitas en reservas reales.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                BarberiaOS es el sistema para barberías que ordena reservas por
                link y QR, agenda, clientes, barberos, servicios y ingresos
                básicos en un solo lugar.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#contacto" className="btn-primary px-7 py-4">
                Pedir demo / piloto <ArrowRight size={18} />
              </a>
              <Link
                href="/r/demo-barber"
                className="btn-outline px-7 py-4"
              >
                Ver demo de reservas
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#C9D4E3] hover:shadow-md"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-[linear-gradient(135deg,rgba(47,111,235,0.10),rgba(255,255,255,0))] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#DDE7FB] bg-[#0F172A] p-4 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
              <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/50">Dashboard de hoy</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">
                      12 citas · 340 €
                    </h2>
                  </div>
                  <div className="rounded-full border border-[#2F6FEB]/25 bg-[#2F6FEB]/12 px-3 py-1 text-xs font-bold text-[#9BBCFF]">
                    Agenda activa
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {productTiles.map(({ title, icon: Icon, items }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-[#2F6FEB]/30 hover:bg-white/[0.06]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6FEB]/15 text-[#8EB4FF]">
                          <Icon size={18} />
                        </div>
                        <p className="text-sm font-bold text-white">{title}</p>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-white/60">
                        {items.map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#2F6FEB]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F6FEB]/15 text-[#8EB4FF]">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        QR de reservas listo
                      </p>
                      <p className="text-xs text-white/50">
                        Un acceso simple para imprimir o compartir.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#2F6FEB]/20 bg-[#2F6FEB]/10 px-4 py-3 text-center text-sm font-bold text-[#9BBCFF]">
                    Reservas 24/7
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5E7EB] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-sm font-semibold text-slate-500 lg:px-8">
          {proofPoints.map((item) => (
            <span key={item} className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#2F6FEB]" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="label-section">El problema</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                La barbería pierde dinero cuando la agenda vive en chats.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                El negocio se vuelve más lento cuando no hay una vista clara de
                reservas, clientes, barberos y servicios.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {painPoints.map(({ icon: Icon, title, text }) => (
                <div key={title} className="panel transition hover:-translate-y-1 hover:border-[#C9D4E3] hover:shadow-md">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F6FEB]/10 text-[#2F6FEB]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-black text-[#111827]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F172A] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="label-section">La solución</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                BarberiaOS ordena la operación y hace visible el negocio.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                Diseñado para barberías que quieren una experiencia más premium
                para el cliente y más control para el equipo.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Reservas por link y QR",
                  "Clientes con historial",
                  "Servicios y barberos",
                  "Ingresos básicos y panel",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/85 transition hover:border-[#2F6FEB]/35 hover:bg-white/[0.06]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#precios" className="btn-primary px-7 py-4">
                  Ver planes <ArrowRight size={18} />
                </a>
                <Link href="/r/demo-barber" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/10 active:scale-[0.98]">
                  Probar reservas
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, text }) => (
                <div key={title} className="card-dark p-5 transition hover:-translate-y-1 hover:border-white/20">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6FEB]/15 text-[#8EB4FF]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="label-section">Cómo funciona</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Cuatro pasos para pasar de la llamada al sistema.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Sin apps nuevas, sin procesos pesados y sin prometer más de lo que
              el negocio necesita hoy.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {workflow.map((step) => (
              <div key={step.number} className="panel transition hover:-translate-y-1 hover:border-[#C9D4E3] hover:shadow-md">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2F6FEB] font-mono text-sm font-black text-white">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#111827]">{step.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-slate-600">{step.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="label-section">Vista del producto</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                El producto se ve claro desde el primer scroll.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              La landing enseña la interfaz y el valor de negocio, no solo
              promesas vacías.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Dashboard",
                icon: BarChart3,
                text: "Citas, ingresos estimados y actividad del día.",
              },
              {
                title: "Agenda",
                icon: CalendarCheck,
                text: "Vista operativa para mover la barbería sin fricción.",
              },
              {
                title: "Clientes",
                icon: Users,
                text: "Notas, historial y contacto en una sola ficha.",
              },
              {
                title: "Reservas",
                icon: QrCode,
                text: "Link público y QR para captar reservas sin conversación manual.",
              },
            ].map(({ title, icon: Icon, text }) => (
              <div key={title} className="panel transition hover:-translate-y-1 hover:border-[#C9D4E3] hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F6FEB]/10 text-[#2F6FEB]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-black text-[#111827]">{title}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-[#DDE7FB] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                    Mockup del panel
                  </p>
                  <h3 className="mt-1 text-lg font-black text-[#111827]">
                    Agenda, clientes y reservas activas
                  </h3>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-[#DCE3EE] bg-white px-3 py-1.5 text-xs font-bold text-slate-600 sm:inline-flex">
                  <span className="h-2 w-2 rounded-full bg-[#2F6FEB]" />
                  Vista premium
                </div>
              </div>
            </div>
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b border-[#E5E7EB] bg-[#0F172A] p-5 text-white lg:border-b-0 lg:border-r">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-white/50">Hoy</p>
                  <p className="mt-1 text-3xl font-black">12 citas</p>
                  <p className="mt-1 text-sm text-white/55">340 € estimados</p>
                </div>

                <div className="mt-4 grid gap-3">
                  {[
                    { time: "10:00", name: "Carlos", service: "Corte + barba" },
                    { time: "11:30", name: "Miguel", service: "Degradado" },
                    { time: "13:00", name: "Andrés", service: "Barba" },
                  ].map((item) => (
                    <div key={item.time} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-sm text-white/50">{item.service}</p>
                      </div>
                      <p className="font-mono text-sm font-bold text-[#8EB4FF]">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="text-sm font-bold text-[#111827]">Reservas por QR</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    El cliente entra, elige y reserva sin fricción.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="text-sm font-bold text-[#111827]">Clientes</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Guardas el historial para dar un seguimiento mejor.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="text-sm font-bold text-[#111827]">Servicios</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Precios, duración y orden visibles para todo el equipo.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="text-sm font-bold text-[#111827]">Ingresos básicos</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Una lectura rápida del negocio sin complicar el panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="precios" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="label-section">Pricing</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              39 €, 79 € y 149 €.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Tres niveles claros para empezar simple o añadir más acompañamiento
              comercial.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <PricingCard
              name="Básico"
              price="39 €/mes"
              setup="Puesta en marcha asistida"
              description="Para barberías que quieren reservas online, agenda clara y un panel básico desde el primer día."
              features={[
                "Agenda online",
                "QR de reservas",
                "Página pública personalizada",
                "Dashboard básico",
                "Clientes y servicios",
                "Configuración inicial incluida",
              ]}
            />
            <PricingCard
              name="Pro"
              price="79 €/mes"
              setup="Puesta en marcha asistida"
              highlighted
              description="Para barberías que quieren una operación más ordenada y un mejor seguimiento comercial."
              features={[
                "Todo Básico",
                "Revisión de Google Business",
                "Instagram con link de reservas",
                "Seguimiento mensual de citas",
                "Acciones comerciales recomendadas",
                "Soporte mensual",
              ]}
            />
            <PricingCard
              name="Premium"
              price="149 €/mes"
              setup="Puesta en marcha asistida"
              description="Para barberías que quieren más acompañamiento y control del crecimiento del negocio."
              features={[
                "Todo Pro",
                "Plan de captación local",
                "Seguimiento de clientes inactivos",
                "Revisión avanzada de métricas",
                "Acompañamiento gestionado",
                "Soporte prioritario",
              ]}
            />
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            * El presupuesto de anuncios se factura aparte y lo decides tú.
          </p>
        </div>
      </section>

      <section className="bg-[#0F172A] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="label-section">Demo / piloto</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                Pide una demo y vemos si encaja con tu barbería.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                Te enseñamos el sistema, configuramos la base y dejamos una
                propuesta simple para empezar con tus reservas.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://wa.me/34600000000?text=Hola,%20quiero%20una%20demo%20de%20BarberiaOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-7 py-4"
                >
                  Solicitar demo gratuita <ArrowRight size={18} />
                </a>
                <Link
                  href="/login"
                  className="btn-outline border-white/15 bg-white/[0.04] px-7 py-4 text-white hover:border-white/20 hover:bg-white/10"
                >
                  Entrar al panel
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {serviceCards.map(({ icon: Icon, title, text }) => (
                <div key={title} className="card-dark p-5 transition hover:-translate-y-1 hover:border-white/20">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6FEB]/15 text-[#8EB4FF]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center">
            <p className="label-section">FAQ</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="mt-12 divide-y divide-[#E5E7EB] rounded-[1.75rem] border border-[#E5E7EB] bg-white px-6 shadow-sm">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-[#111827]">
                  {q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-lg font-black transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 leading-7 text-slate-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contacto"
        className="border-t border-[#DDE7FB] bg-[#0F172A] px-6 py-24 text-center text-white"
      >
        <div className="mx-auto max-w-4xl">
          <p className="label-section">Empieza hoy</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Convierte tu QR en reservas y tu agenda en un sistema.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">
            BarberiaOS te deja una base clara para vender mejor, atender mejor y
            controlar mejor tu barbería.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quiero%20una%20demo%20de%20BarberiaOS"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4"
            >
              Solicitar demo gratuita <ArrowRight size={18} />
            </a>
            <Link
              href="/r/demo-barber"
              className="btn-outline border-white/15 bg-white/[0.04] px-8 py-4 text-white hover:border-white/20 hover:bg-white/10"
            >
              Ver demo de reservas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
