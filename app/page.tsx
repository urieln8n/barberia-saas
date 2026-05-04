import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Instagram,
  MessageCircle,
  QrCode,
  Scissors,
  Smartphone,
  Sparkles,
  Users,
  Globe,
  Megaphone,
  Star,
  Zap,
} from "lucide-react";
import { PricingCard } from "@/components/marketing/PricingCard";

/* ─── datos ─────────────────────────────────────── */

const pains = [
  { icon: MessageCircle, text: "Clientes que escriben por WhatsApp y nunca confirman" },
  { icon: CalendarCheck, text: "Citas perdidas por no tener agenda organizada" },
  { icon: Clock, text: "No-shows sin aviso que te dejan huecos vacíos" },
  { icon: Users, text: "Sin historial de clientes ni datos de tu negocio" },
  { icon: Instagram, text: "Redes sociales activas pero sin reservas reales" },
  { icon: Smartphone, text: "Todo depende de que tú respondas el móvil" },
];

const features = [
  { icon: Globe, title: "Página pública de reservas", text: "URL propia para tu barbería. El cliente reserva solo, sin mensajes." },
  { icon: QrCode, title: "QR personalizado", text: "Imprímelo en el local, ponlo en Instagram o compártelo por WhatsApp." },
  { icon: CalendarCheck, title: "Agenda online", text: "Citas por barbero, horario y estado. Todo en tiempo real." },
  { icon: Users, title: "Clientes y historial", text: "Base de datos con teléfono, historial y notas de cada cliente." },
  { icon: Scissors, title: "Servicios y barberos", text: "Configura precios, duraciones y asigna citas a cada barbero." },
  { icon: CreditCard, title: "Pagos manuales", text: "Registra cobros en efectivo, tarjeta, Bizum o transferencia." },
  { icon: BarChart3, title: "Dashboard de negocio", text: "Ingresos, citas, clientes nuevos y servicios más vendidos." },
  { icon: Megaphone, title: "Marketing local", text: "Conecta Instagram, Google, WhatsApp y anuncios locales a tu agenda." },
];

const steps = [
  { number: "01", title: "Configuras tu barbería", text: "Añades servicios, barberos y tu información. En menos de 10 minutos estás listo." },
  { number: "02", title: "Compartes tu QR o link", text: "Lo pones en Instagram, Google, WhatsApp o lo imprimes en el local." },
  { number: "03", title: "El cliente reserva solo", text: "Elige servicio, barbero, fecha y hora. Sin llamadas, sin mensajes." },
  { number: "04", title: "La cita entra a tu panel", text: "Aparece en tu agenda al instante. Gestionas todo desde el dashboard." },
];

const demoCards = [
  {
    label: "QR de reservas",
    icon: QrCode,
    color: "amber",
    lines: ["QR activo y listo", "Compártelo en Instagram", "barberiaos.com/r/tu-barberia"],
  },
  {
    label: "Agenda del día",
    icon: CalendarCheck,
    color: "blue",
    lines: ["10:00 · Carlos · Corte + barba", "11:30 · Miguel · Degradado", "13:00 · Pedro · Barba"],
  },
  {
    label: "Dashboard hoy",
    icon: BarChart3,
    color: "emerald",
    lines: ["12 citas · 340 €", "4 clientes nuevos", "Servicio top: Corte + barba"],
  },
  {
    label: "Página pública",
    icon: Smartphone,
    color: "purple",
    lines: ["Reserva en 3 pasos", "Sin cuenta necesaria", "Confirmación inmediata"],
  },
];

const faq = [
  { q: "¿Necesito instalar algo?", a: "No. BarberíaOS funciona desde cualquier navegador, en móvil o PC. No hay apps que descargar." },
  { q: "¿Mis clientes necesitan crear una cuenta?", a: "No. Reservan con su nombre y teléfono, sin registro. El proceso dura menos de 2 minutos." },
  { q: "¿Puedo usarlo con un QR en el local?", a: "Sí, ese es uno de los usos principales. Generamos un QR personalizado que puedes imprimir o compartir digitalmente." },
  { q: "¿Funciona bien en móvil?", a: "Sí. El panel y la página pública están diseñados primero para móvil. Puedes gestionar tu barbería desde el teléfono." },
  { q: "¿El plan incluye marketing digital?", a: "Los planes Starter y Growth incluyen configuración base. El plan Premium incluye campañas activas. Los anuncios de pago se facturan aparte." },
  { q: "¿Puedo probarlo antes de pagar?", a: "Sí. Solicita una demo y te mostramos el sistema en vivo con tu barbería configurada." },
];

const colorMap: Record<string, string> = {
  amber: "text-amber-300 bg-amber-400/10",
  blue: "text-blue-300 bg-blue-400/10",
  emerald: "text-emerald-300 bg-emerald-400/10",
  purple: "text-purple-300 bg-purple-400/10",
};

/* ─── componente ─────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">

      {/* ── 1. HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.20),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_25%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-8 lg:px-8">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20">
                <Scissors size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight">BarberíaOS</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:inline-flex">
                Entrar al panel
              </Link>
              <a href="#precios" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                Ver planes
              </a>
            </div>
          </nav>

          <div className="grid items-center gap-14 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
                <Sparkles size={16} />
                Reservas + QR + marketing para barberías
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Llena tu agenda sin vivir pegado al WhatsApp.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
                Tus clientes reservan desde Instagram, Google, WhatsApp o un QR en el local.
                Tú gestionas citas, clientes, pagos y resultados desde un panel simple.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a href="#contacto" className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-4 font-bold text-neutral-950 shadow-xl shadow-amber-500/20 transition hover:bg-amber-300">
                  Quiero mi sistema <ArrowRight size={19} />
                </a>
                <Link href="/r/demo-barber" className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-4 font-bold text-white transition hover:bg-white/10">
                  Ver demo de reservas
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-amber-400/30 px-7 py-4 font-bold text-amber-300 transition hover:bg-amber-400/10 sm:hidden">
                  Entrar al panel
                </Link>
              </div>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-7">
                <div><p className="text-2xl font-black">24/7</p><p className="mt-1 text-sm text-white/50">Reservas online</p></div>
                <div><p className="text-2xl font-black">QR</p><p className="mt-1 text-sm text-white/50">Listo para local</p></div>
                <div><p className="text-2xl font-black">CRM</p><p className="mt-1 text-sm text-white/50">Clientes y pagos</p></div>
              </div>
            </div>

            {/* Mock dashboard */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-amber-400/10 blur-3xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] border border-white/10 bg-neutral-950 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">Panel de hoy</p>
                      <h2 className="mt-1 text-2xl font-black">12 citas · 340 €</h2>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">Agenda activa</div>
                  </div>
                  <div className="space-y-3">
                    {[["Carlos", "Corte + barba", "10:30"], ["Miguel", "Degradado", "11:15"], ["Andrés", "Barba", "13:00"]].map(([name, svc, time]) => (
                      <div key={time} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                        <div>
                          <p className="font-bold">{name}</p>
                          <p className="text-sm text-white/50">{svc}</p>
                        </div>
                        <p className="font-bold text-amber-300">{time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                    <div className="flex items-center gap-3">
                      <QrCode className="text-amber-300" size={20} />
                      <div>
                        <p className="font-bold text-sm">QR de reservas activo</p>
                        <p className="text-xs text-white/50">Tus clientes reservan sin llamar.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEMA ── */}
      <section className="bg-neutral-900 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">El problema</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              ¿Te suena esto?
            </h2>
            <p className="mt-4 text-lg text-white/60">
              La mayoría de barberías pierden clientes y dinero por no tener un sistema digital. Esto es lo que pasa cada día sin BarberíaOS.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pains.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                  <Icon size={18} className="text-red-400" />
                </div>
                <p className="text-sm leading-6 text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SOLUCIÓN ── */}
      <section className="bg-white py-20 text-neutral-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">Sistema completo</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Todo lo que necesita una barbería moderna.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              No es solo una agenda. Es una estructura digital para captar clientes, convertirlos en reservas y mantenerlos organizados.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="group rounded-3xl border border-neutral-200 bg-neutral-50 p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Icon size={20} />
                </div>
                <h3 className="font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CÓMO FUNCIONA ── */}
      <section className="bg-neutral-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Cómo funciona</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                De la configuración a las reservas en minutos.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                Cuatro pasos. Sin formación técnica. Sin instalar nada. Solo tu barbería funcionando.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step) => (
                <div key={step.number} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-sm font-black text-neutral-950">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{step.title}</h3>
                      <p className="mt-1 leading-7 text-white/60">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. DEMO VISUAL ── */}
      <section className="bg-neutral-100 py-20 text-neutral-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">Vista previa</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Esto es lo que verás cada día.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {demoCards.map(({ label, icon: Icon, color, lines }) => (
              <div key={label} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${colorMap[color]}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-black text-neutral-900">{label}</h3>
                <ul className="mt-3 space-y-2">
                  {lines.map((line) => (
                    <li key={line} className="flex items-center gap-2 text-sm text-neutral-600">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/r/demo-barber" className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-4 font-bold text-white transition hover:bg-neutral-800">
              Probar demo de reservas <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. PLANES ── */}
      <section id="precios" className="bg-neutral-100 pb-20 pt-4 text-neutral-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">Planes</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Elige el plan de tu barbería.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Vende el software solo o con marketing incluido. Los anuncios de pago (Google Ads, Meta Ads) se facturan aparte.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <PricingCard
              name="Starter"
              price="49 €/mes"
              setup="149 € setup"
              description="Para barberías que quieren empezar a recibir reservas online."
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
              name="Growth"
              price="149 €/mes"
              setup="249 € setup"
              highlighted
              description="Para barberías que quieren llenar agenda con marketing digital."
              features={[
                "Todo Starter",
                "Google Business optimizado",
                "Instagram optimizado",
                "Contenido mensual (8 posts)",
                "Reporte mensual de reservas",
                "Soporte mensual incluido",
              ]}
            />
            <PricingCard
              name="Premium"
              price="299 €/mes"
              setup="499 € setup"
              description="Para barberías que quieren crecer con campañas y automatización."
              features={[
                "Todo Growth",
                "Campañas de anuncios locales*",
                "Recuperación de clientes",
                "Automatizaciones activas",
                "CRM y seguimiento",
                "Soporte prioritario",
              ]}
            />
          </div>

          <p className="mt-6 text-center text-sm text-neutral-500">
            * El presupuesto de anuncios (Google Ads, Meta Ads) se factura aparte y lo decides tú.
          </p>
        </div>
      </section>

      {/* ── 7. OFERTA COMBINADA ── */}
      <section className="bg-neutral-950 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Servicio completo</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                Software + marketing digital para barberías.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                Combinamos el sistema de reservas con una estrategia de captación local para que tu agenda se llene sola.
              </p>
              <a href="#contacto" className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-4 font-bold text-neutral-950 transition hover:bg-amber-300">
                Solicitar propuesta <ArrowRight size={18} />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Instagram, title: "Instagram optimizado", text: "Bio, historias y posts diseñados para convertir seguidores en clientes." },
                { icon: Globe, title: "Google Business", text: "Perfil optimizado para aparecer cuando buscan barbería en tu ciudad." },
                { icon: Star, title: "Contenido mensual", text: "Posts y reels para redes sociales cada mes, sin que tengas que hacer nada." },
                { icon: Megaphone, title: "Campañas locales", text: "Anuncios segmentados a personas cerca de tu barbería listos para reservar." },
                { icon: Users, title: "Recuperación de clientes", text: "Mensajes automáticos a clientes que llevan tiempo sin venir." },
                { icon: Zap, title: "Automatizaciones", text: "Confirmaciones, recordatorios y seguimientos sin trabajo manual." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <Icon size={18} className="mb-3 text-amber-300" />
                  <h3 className="font-black text-sm">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-white/50">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="bg-white py-20 text-neutral-950">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">FAQ</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Preguntas frecuentes.
            </h2>
          </div>

          <div className="mt-12 divide-y divide-neutral-200">
            {faq.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black">
                  {q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-black transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-neutral-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA FINAL ── */}
      <section id="contacto" className="relative overflow-hidden bg-neutral-950 px-6 py-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Empieza hoy</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Convierte tus redes y tu QR en reservas reales.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Instalamos el sistema, configuramos tu barbería y te dejamos listo para recibir reservas desde el primer día.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/34600000000?text=Hola,%20quiero%20una%20demo%20de%20BarberíaOS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-4 font-black text-neutral-950 transition hover:bg-amber-300"
            >
              Solicitar demo gratuita <ArrowRight size={18} />
            </a>
            <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 font-black text-white transition hover:bg-white/10">
              Entrar al panel
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Sin permanencia</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Configuración en 24h</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Soporte en español</span>
          </div>
        </div>
      </section>

    </main>
  );
}
