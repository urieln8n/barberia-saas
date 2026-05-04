import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Instagram,
  QrCode,
  Scissors,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { PricingCard } from "@/components/marketing/PricingCard";

const features = [
  {
    icon: QrCode,
    title: "QR de reservas",
    text: "Tus clientes escanean el QR en el local, Instagram o Google y reservan en segundos.",
  },
  {
    icon: CalendarCheck,
    title: "Agenda online",
    text: "Organiza citas por barbero, servicio, horario y estado desde un panel simple.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de negocio",
    text: "Consulta ingresos, citas, clientes nuevos y servicios más vendidos en tiempo real.",
  },
  {
    icon: Instagram,
    title: "Marketing local",
    text: "Convierte Instagram, Google, WhatsApp y anuncios locales en reservas reales.",
  },
];

const steps = [
  {
    number: "01",
    title: "Cliente descubre tu barbería",
    text: "Desde Instagram, Google, WhatsApp, anuncios o un QR en el local.",
  },
  {
    number: "02",
    title: "Reserva online",
    text: "Elige servicio, barbero, fecha y hora desde una página profesional.",
  },
  {
    number: "03",
    title: "La cita entra al panel",
    text: "Tú gestionas agenda, clientes, pagos y resultados desde BarberíaOS.",
  },
];

const demoAppointments = [
  ["Carlos", "Corte + barba", "10:30", "Confirmada"],
  ["Miguel", "Degradado", "11:15", "Confirmada"],
  ["Andrés", "Barba", "12:00", "Pendiente"],
  ["Juan", "Corte premium", "13:30", "Confirmada"],
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.20),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_25%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-8 lg:px-8">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20">
                <Scissors size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight">
                BarberíaOS
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:inline-flex"
              >
                Entrar al panel
              </Link>

              <a
                href="#precios"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
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
                Tus clientes reservan desde Instagram, Google, WhatsApp o un QR
                en el local. Tú gestionas citas, clientes, pagos y resultados
                desde un panel simple y profesional.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-4 font-bold text-neutral-950 shadow-xl shadow-amber-500/20 transition hover:bg-amber-300"
                >
                  Quiero mi sistema <ArrowRight size={19} />
                </a>

                <Link
                  href="/r/demo-barber"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  Ver demo de reservas
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-amber-400/30 px-7 py-4 font-bold text-amber-300 transition hover:bg-amber-400/10 sm:hidden"
                >
                  Entrar al panel
                </Link>
              </div>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-7">
                <div>
                  <p className="text-2xl font-black">24/7</p>
                  <p className="mt-1 text-sm text-white/50">Reservas online</p>
                </div>
                <div>
                  <p className="text-2xl font-black">QR</p>
                  <p className="mt-1 text-sm text-white/50">Listo para local</p>
                </div>
                <div>
                  <p className="text-2xl font-black">CRM</p>
                  <p className="mt-1 text-sm text-white/50">Clientes y pagos</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-amber-400/10 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] border border-white/10 bg-neutral-950 p-5">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">Panel de hoy</p>
                      <h2 className="mt-1 text-2xl font-black">
                        12 citas · 340 €
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                      Agenda activa
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/5 p-4">
                      <Clock className="mb-3 text-amber-300" size={20} />
                      <p className="text-xl font-black">4</p>
                      <p className="text-xs text-white/50">Próximas citas</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <Users className="mb-3 text-amber-300" size={20} />
                      <p className="text-xl font-black">8</p>
                      <p className="text-xs text-white/50">Clientes nuevos</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4">
                      <BarChart3 className="mb-3 text-amber-300" size={20} />
                      <p className="text-xl font-black">31%</p>
                      <p className="text-xs text-white/50">Más reservas</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {demoAppointments.map((item) => (
                      <div
                        key={`${item[0]}-${item[2]}`}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <div>
                          <p className="font-bold">{item[0]}</p>
                          <p className="text-sm text-white/50">{item[1]}</p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-amber-300">{item[2]}</p>
                          <p className="text-xs text-emerald-300">{item[3]}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                    <div className="flex items-center gap-3">
                      <QrCode className="text-amber-300" />
                      <div>
                        <p className="font-bold">QR de reservas activo</p>
                        <p className="text-sm text-white/50">
                          Comparte tu link y recibe citas automáticamente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-neutral-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">
              Sistema completo
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Todo lo que necesita una barbería moderna para vender más.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              No es solo una agenda. Es una estructura digital para captar
              clientes, convertirlos en reservas y mantenerlos organizados.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-neutral-200 bg-neutral-50 p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <Icon size={23} />
                  </div>
                  <h3 className="text-lg font-black">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
                Cómo funciona
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                De las redes sociales a tu agenda.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/60">
                BarberíaOS conecta presencia digital, reservas y gestión para
                que cada canal pueda convertirse en citas reales.
              </p>
            </div>

            <div className="grid gap-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-sm font-black text-neutral-950">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{step.title}</h3>
                      <p className="mt-2 leading-7 text-white/60">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="precios" className="bg-neutral-100 py-20 text-neutral-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-600">
              Planes
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Planes para vender a barberías.
            </h2>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              Puedes venderlo como SaaS, como servicio mensual o como paquete
              con marketing digital incluido.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <PricingCard
              name="Starter"
              price="49 €/mes"
              setup="149 € setup"
              features={[
                "Agenda online",
                "QR de reservas",
                "Página pública",
                "Dashboard básico",
                "Configuración inicial",
              ]}
            />

            <PricingCard
              name="Growth"
              price="149 €/mes"
              setup="249 € setup"
              highlighted
              features={[
                "Todo Starter",
                "Google/Instagram optimizado",
                "Contenido mensual",
                "Reporte de reservas",
                "Soporte mensual",
              ]}
            />

            <PricingCard
              name="Premium"
              price="299 €/mes"
              setup="499 € setup"
              features={[
                "Todo Growth",
                "Campañas Ads",
                "CRM avanzado",
                "Automatizaciones",
                "Soporte prioritario",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 text-neutral-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-3xl border border-neutral-200 p-6">
            <CheckCircle2 className="mb-4 text-emerald-600" />
            <h3 className="text-xl font-black">Menos mensajes manuales</h3>
            <p className="mt-3 leading-7 text-neutral-600">
              Tus clientes reservan solos sin esperar respuesta por WhatsApp.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-6">
            <Smartphone className="mb-4 text-amber-600" />
            <h3 className="text-xl font-black">Reservas desde móvil</h3>
            <p className="mt-3 leading-7 text-neutral-600">
              Página rápida, clara y preparada para clientes que reservan desde
              redes.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-6">
            <Star className="mb-4 text-yellow-500" />
            <h3 className="text-xl font-black">Imagen premium</h3>
            <p className="mt-3 leading-7 text-neutral-600">
              Un sistema moderno hace que la barbería se vea más profesional.
            </p>
          </div>
        </div>
      </section>

      <section
        id="contacto"
        className="relative overflow-hidden bg-neutral-950 px-6 py-24 text-center text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-300">
            Demo comercial
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Convierte tu barbería en una máquina de reservas.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60">
            Instalamos la app, el QR, la página de reservas y la estructura
            digital para captar clientes locales.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:hola@barberiaos.com"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-8 py-4 font-black text-neutral-950 transition hover:bg-amber-300"
            >
              Solicitar demo
            </a>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 font-black text-white transition hover:bg-white/10"
            >
              Entrar al panel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}