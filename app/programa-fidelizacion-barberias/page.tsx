import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  QrCode,
  Scissors,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Programa de fidelización para barberías | BarberíaOS",
  description:
    "Tarjeta de puntos digital, sellos automáticos y recompensas para barberías. BarberíaOS convierte clientes ocasionales en clientes fijos sin que ellos instalen ninguna app.",
  keywords: [
    "programa fidelización barberías",
    "fidelizar clientes barbería",
    "tarjeta puntos barbería",
    "retención clientes barbería",
    "historial clientes barbería",
    "CRM barbería",
    "sellos digitales barbería",
  ],
  alternates: {
    canonical: `${BUSINESS_CONFIG.siteUrl}/programa-fidelizacion-barberias`,
  },
  openGraph: {
    title: "Programa de fidelización para barberías | BarberíaOS",
    description:
      "Tarjeta de puntos digital con sellos automáticos, recompensas y QR. Sin app para el cliente, sin trabajo extra para el barbero.",
    url: `${BUSINESS_CONFIG.siteUrl}/programa-fidelizacion-barberias`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Hay tarjeta de puntos o programa de sellos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. BarberíaOS incluye tarjeta de puntos digital con sellos automáticos al completar cita, recompensas personalizadas y acceso por QR o link. El cliente lo ve desde el móvil sin descargar ninguna app.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo exportar los datos de mis clientes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Los datos son tuyos y puedes exportarlos en cualquier momento.",
        },
      },
      {
        "@type": "Question",
        name: "¿Funciona con varios barberos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. El historial registra qué barbero atendió cada cita para un seguimiento personalizado.",
        },
      },
    ],
  },
];

const pillars = [
  {
    icon: Star,
    title: "Tarjeta de puntos digital",
    text: "Cada visita completada suma un sello automáticamente. El cliente ve su progreso y sus recompensas desde un link o QR sin instalar nada.",
    badge: "Activo",
    badgeColor: "green",
    link: "/tarjeta-puntos-digital-barberia",
    linkText: "Ver tarjeta de puntos →",
  },
  {
    icon: Users,
    title: "Historial completo de cliente",
    text: "Cada cliente tiene su ficha con visitas, servicios, importes, barbero y notas privadas. El barbero lo ve antes de cada cita.",
    badge: "Activo",
    badgeColor: "green",
    link: "/crm-clientes-barberia",
    linkText: "Ver CRM de clientes →",
  },
  {
    icon: TrendingUp,
    title: "Seguimiento de actividad",
    text: "Clientes frecuentes, clientes perdidos, recencia y frecuencia. Saber quién no ha vuelto en semanas para activar una acción concreta.",
    badge: "Activo",
    badgeColor: "green",
    link: "/huecos-libres-barberia",
    linkText: "Ver huecos libres →",
  },
  {
    icon: Zap,
    title: "Campañas de recuperación",
    text: "Marketing Studio prepara mensajes de WhatsApp para clientes dormidos con contexto real: última visita, servicio recibido y recompensa pendiente.",
    badge: "Activo",
    badgeColor: "green",
    link: "/marketing-para-barberias",
    linkText: "Ver Marketing Studio →",
  },
];

const badgeColors: Record<string, string> = {
  green: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25",
  gold: "text-[#D4AF66] bg-[#D4AF66]/10 border-[#D4AF66]/25",
};

const metrics = [
  { label: "Clientes que vuelven en 30 días", before: "Sin dato", after: "+34%", positive: true },
  { label: "Clientes perdidos detectados", before: "Nunca", after: "Automático", positive: true },
  { label: "Ticket medio cliente fidelizado", before: "Igual", after: "+12%", positive: true },
  { label: "Coste por retención vs captación", before: "Igual", after: "−80%", positive: true },
];

const faqs = [
  {
    q: "¿Hay tarjeta de puntos o programa de sellos?",
    a: "Sí. BarberíaOS incluye tarjeta de puntos digital con sellos automáticos al completar cita, recompensas personalizadas y acceso por QR o link. El cliente lo ve desde el móvil sin descargar ninguna app.",
  },
  {
    q: "¿El cliente tiene que instalar una app para ver sus puntos?",
    a: "No. El cliente accede a su tarjeta desde un link directo o escaneando el QR del mostrador. No hay descarga ni registro adicional.",
  },
  {
    q: "¿Puedo personalizar las recompensas?",
    a: "Sí. Configuras cuántas visitas equivalen a una recompensa y qué tipo de recompensa ofreces: corte gratis, descuento en porcentaje o servicio a elegir.",
  },
  {
    q: "¿Puedo exportar los datos de mis clientes?",
    a: "Sí. Los datos son tuyos y puedes exportarlos en cualquier momento desde el panel.",
  },
  {
    q: "¿Funciona con varios barberos?",
    a: "Sí. El historial registra qué barbero atendió cada cita. Los sellos se suman independientemente del barbero que atiende.",
  },
  {
    q: "¿La fidelización está conectada con la caja?",
    a: "Sí. Cuando se canjea una recompensa queda registrada en la caja con su valor para que el cierre diario sea exacto.",
  },
];

export default function ProgramaFidelizacionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#FAFBFF] text-[#080A0F]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <Link href="/" className="flex items-center gap-3" aria-label="Volver a BarberíaOS">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#C9922A]">
                <Scissors size={19} />
              </span>
              <span className="font-black tracking-tight">BarberíaOS</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/demo" className="hidden text-sm font-black text-slate-600 hover:text-[#080A0F] sm:block">
                Demo
              </Link>
              <PrimaryButton href="/login" variant="gold">
                Probar gratis
              </PrimaryButton>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="bg-[#050A14] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#D4AF66]">
              Fidelización de clientes para barberías
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[1.1] md:text-6xl">
              No solo llenes la agenda.
              <br />
              <span className="text-[#D4AF66]">Haz que tus clientes vuelvan.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
              BarberíaOS combina tarjeta de puntos digital, historial de cliente, seguimiento de
              actividad y campañas de recuperación para que la barbería retenga sin esfuerzo extra.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <PrimaryButton href="/pedir-demo" variant="gold" className="min-h-12 px-8">
                Pedir demo <ArrowRight size={17} />
              </PrimaryButton>
              <PrimaryButton
                href="/tarjeta-puntos-digital-barberia"
                variant="secondary"
                className="min-h-12 px-7"
              >
                Ver tarjeta de puntos <Gift size={17} />
              </PrimaryButton>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                { value: "0", unit: "€", label: "coste adicional de fidelización" },
                { value: "Sin", unit: "", label: "app que instalar para el cliente" },
                { value: "100%", unit: "", label: "automático al completar cita" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-[20px] border border-white/10 bg-white/5 px-5 py-4"
                >
                  <p className="text-3xl font-black tabular-nums text-[#D4AF66]">
                    {s.value}
                    {s.unit && <span className="text-2xl">{s.unit}</span>}
                  </p>
                  <p className="mt-1 text-sm text-white/55">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Pillars */}
        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#C9922A]">
                Sistema completo
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#080A0F] md:text-4xl">
                Fidelización en cuatro módulos
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {pillars.map((p) => {
                const Icon = p.icon;
                const badge = badgeColors[p.badgeColor] ?? badgeColors.green;
                return (
                  <article
                    key={p.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(5,10,20,0.04),0_18px_50px_rgba(15,23,42,0.07)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF66]/25 bg-[#D4AF66]/10">
                        <Icon size={20} className="text-[#D4AF66]" />
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-black ${badge}`}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-black text-[#080A0F]">{p.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{p.text}</p>
                    <Link
                      href={p.link}
                      className="mt-4 inline-flex items-center text-xs font-black text-[#C9922A] hover:text-[#B98B2F]"
                    >
                      {p.linkText}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="bg-[#050A14] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#D4AF66]">
                Antes y después
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Lo que cambia con fidelización activa
              </h2>
            </div>
            <div className="space-y-3">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-[20px] border border-white/10 bg-white/5 px-5 py-4"
                >
                  <span className="text-sm text-white/70">{m.label}</span>
                  <span className="text-sm font-bold text-white/35 line-through">{m.before}</span>
                  <span
                    className={`min-w-[80px] text-right text-base font-black tabular-nums ${
                      m.positive ? "text-[#10B981]" : "text-[#E5484D]"
                    }`}
                  >
                    {m.after}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-white/30">
              Datos orientativos basados en métricas de fidelización en comercio local.
            </p>
          </div>
        </section>

        {/* Benefit blocks */}
        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-black text-[#080A0F] md:text-4xl">
                Datos propios, sin plataformas intermediarias
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
                Con BarberíaOS los datos de tus clientes son tuyos. No hay marketplace, no hay
                comisión y no hay otra plataforma que se quede con tu base de clientes.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Historial completo",
                  text: "Visitas, servicios recibidos, importes, barbero y notas privadas disponibles antes de cada cita.",
                  icon: Users,
                },
                {
                  title: "Sin dependencias",
                  text: "Si decides cambiar de herramienta exportas tus clientes y te llevas todo el historial contigo.",
                  icon: CheckCircle2,
                },
                {
                  title: "Privacidad incluida",
                  text: "RGPD conforme desde el primer día. Las notas del barbero son privadas y los datos del cliente, protegidos.",
                  icon: QrCode,
                },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <article
                    key={b.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(5,10,20,0.04),0_18px_50px_rgba(15,23,42,0.07)]"
                  >
                    <Icon size={20} className="text-[#C9922A]" />
                    <h3 className="mt-4 text-base font-black text-[#080A0F]">{b.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{b.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-50 px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-black text-[#080A0F]">
              Preguntas frecuentes sobre fidelización
            </h2>
            <div className="divide-y divide-slate-200 overflow-hidden rounded-[28px] border border-slate-200 bg-white">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-6">
                  <p className="font-black text-[#080A0F]">{faq.q}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[32px] border border-[#D4AF66]/25 bg-[#050A14] p-8 text-center text-white md:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#D4AF66]">
              Empieza hoy
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Activa la fidelización de BarberíaOS.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/60">
              Tarjeta de puntos digital, historial de cliente y campañas de recuperación. Todo incluido,
              sin coste adicional.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <PrimaryButton href="/pedir-demo" variant="gold" className="min-h-12 px-8">
                Pedir demo gratis <ArrowRight size={17} />
              </PrimaryButton>
              <PrimaryButton
                href="/tarjeta-puntos-digital-barberia"
                variant="secondary"
                className="min-h-12 px-7"
              >
                Ver tarjeta de puntos
              </PrimaryButton>
            </div>
            <p className="mt-4 text-xs text-white/35">
              Sin tarjeta · Sin permanencia · Setup en 48h
            </p>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white px-5 py-8 text-center text-xs text-slate-400 lg:px-8">
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/" className="font-bold text-slate-600 hover:text-[#080A0F]">
              ← BarberíaOS
            </Link>
            <Link
              href="/tarjeta-puntos-digital-barberia"
              className="font-bold text-slate-600 hover:text-[#080A0F]"
            >
              Tarjeta de puntos digital
            </Link>
            <Link
              href="/crm-clientes-barberia"
              className="font-bold text-slate-600 hover:text-[#080A0F]"
            >
              CRM de clientes
            </Link>
            <Link
              href="/marketing-para-barberias"
              className="font-bold text-slate-600 hover:text-[#080A0F]"
            >
              Marketing para barberías
            </Link>
          </div>
          <p className="mt-2">
            © {new Date().getFullYear()} BarberíaOS — Programa de fidelización para barberías.
          </p>
        </footer>
      </main>
    </>
  );
}
