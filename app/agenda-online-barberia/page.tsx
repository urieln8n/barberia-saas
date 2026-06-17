import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Instagram,
  QrCode,
  Scissors,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { SITE_URL } from "@/src/lib/site-url";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Agenda Online para Barberías | BarberíaOS",
  description:
    "Agenda online para barberías: tus clientes reservan desde Instagram, WhatsApp, QR o tu página pública. Sin llamadas, sin papel. Configurada en 48h.",
  alternates: { canonical: `${SITE_URL}/agenda-online-barberia` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/agenda-online-barberia`,
    title: "Agenda Online para Barberías | BarberíaOS",
    description: "Agenda online profesional para barberías. Reservas 24h, QR y página pública. Sin comisión.",
    siteName: "BarberíaOS",
  },
};

const steps = [
  {
    n: "1",
    title: "Configuras tu barbería",
    text: "Subes servicios, precios, barberos y horarios. Te ayudamos en menos de 48 horas.",
    icon: Scissors,
  },
  {
    n: "2",
    title: "Compartes el link o el QR",
    text: "Funciona en Instagram, Google Business, WhatsApp y en el mostrador.",
    icon: QrCode,
  },
  {
    n: "3",
    title: "Los clientes reservan solos",
    text: "Eligen servicio, barbero y hora. Tú ves la agenda en tiempo real.",
    icon: CalendarClock,
  },
];

const benefits = [
  { icon: Clock,      text: "Reservas 24h — incluso mientras estás cortando" },
  { icon: Smartphone, text: "Sin app — reservan desde el navegador del móvil" },
  { icon: Users,      text: "Agenda por barbero con control de huecos" },
  { icon: QrCode,     text: "QR imprimible para mostrador y escaparate" },
  { icon: Zap,        text: "0% comisión — precio fijo mensual, sin sorpresas" },
  { icon: Instagram,  text: "Tus clientes son tuyos — no van a ninguna plataforma" },
];

const faqs = [
  {
    q: "¿Cómo reservan mis clientes?",
    a: "Escanean tu QR o abren tu link. Eligen barbero, servicio y hora sin llamadas ni mensajes de WhatsApp.",
  },
  {
    q: "¿Puedo controlar qué horas ofrezco?",
    a: "Sí. Configuras horarios, descansos y festivos. La agenda solo muestra huecos reales disponibles.",
  },
  {
    q: "¿Qué pasa si un cliente no aparece?",
    a: "El sistema registra el no-show y envía recordatorios automáticos para reducir ausencias.",
  },
  {
    q: "¿Puedo tener varios barberos con agendas separadas?",
    a: "Sí. Cada barbero tiene su columna y los clientes eligen con quién quieren su cita.",
  },
];

const agendaJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BarberíaOS — Agenda Online para Barberías",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/agenda-online-barberia`,
    description: "Agenda online para barberías: tus clientes reservan desde Instagram, WhatsApp, QR o tu página pública.",
    offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: "39", highPrice: "149", offerCount: "3" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Agenda online para barberías", item: `${SITE_URL}/agenda-online-barberia` },
    ],
  },
];

export default function AgendaOnlineBarberiaPage() {
  return (
    <>
      {agendaJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="min-h-screen bg-white text-slate-900">

        {/* ── Nav ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5 text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <Scissors size={15} className="text-[#C9922A]" />
              </span>
              <span className="text-sm font-black tracking-tight">BarberíaOS</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/demo" className="hidden text-sm font-medium text-slate-500 hover:text-slate-900 sm:block">
                Demo
              </Link>
              <Link
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                Probar gratis
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Hero ────────────────────────────────────────── */}
        <section className="border-b border-slate-100 px-5 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9922A]/20 bg-[#C9922A]/6 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#C9922A]">
              Agenda online · Barberías
            </span>
            <h1 className="mt-5 text-[clamp(1.85rem,5vw,3rem)] font-black leading-[1.1] tracking-tight text-slate-900">
              La agenda online que convierte{" "}
              <span className="text-[#C9922A]">WhatsApp en reservas</span>{" "}
              automáticas.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-500">
              Tus clientes reservan desde el móvil — sin descargar apps, sin registros, sin llamadas. Tú ves la agenda en tiempo real.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-7 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                Activar mi agenda gratis <ArrowRight size={15} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-7 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              >
                Ver demo en vivo
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">Sin tarjeta de crédito · Sin permanencia · Setup en 48h</p>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────── */}
        <section className="border-b border-slate-100 bg-slate-50">
          <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-slate-200 px-5">
            {[
              { value: "0%",   label: "comisión por reserva" },
              { value: "48h",  label: "setup incluido" },
              { value: "24/7", label: "reservas activas" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-6">
                <span className="text-2xl font-black text-slate-900">{value}</span>
                <span className="mt-1 text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cómo funciona ───────────────────────────────── */}
        <section className="px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#C9922A]">Cómo funciona</p>
            <h2 className="mt-3 text-center text-2xl font-black text-slate-900">
              En 3 pasos tienes reservas automáticas
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map(({ n, title, text, icon: Icon }) => (
                <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-[#C9922A]">
                      {n}
                    </span>
                    <Icon size={17} className="text-slate-200" />
                  </div>
                  <h3 className="mt-4 text-sm font-black text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Beneficios ──────────────────────────────────── */}
        <section className="border-y border-slate-100 bg-slate-50 px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#C9922A]">Por qué eligen BarberíaOS</p>
            <h2 className="mt-3 text-center text-2xl font-black text-slate-900">
              Todo lo que necesita tu barbería
            </h2>
            <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9922A]/8 border border-[#C9922A]/15">
                    <Icon size={14} className="text-[#C9922A]" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── QR feature ──────────────────────────────────── */}
        <section className="px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-7 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C9922A]/20 bg-[#C9922A]/8">
                <QrCode size={22} className="text-[#C9922A]" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">QR de reservas para tu barbería</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Obtienes un QR descargable para pegar en el mostrador, escaparate, tarjetas o Instagram.
                  El cliente lo escanea, elige y reserva en menos de un minuto. Sin apps. Sin registro.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-600">Disponible desde 39€/mes — plan Arranca</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────── */}
        <section className="border-t border-slate-100 bg-slate-50 px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-black text-slate-900">Preguntas frecuentes</h2>
            <div className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {faqs.map((faq) => (
                <div key={faq.q} className="px-6 py-5">
                  <p className="text-sm font-black text-slate-900">{faq.q}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────── */}
        <section className="px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#C9922A]">Empieza hoy</p>
            <h2 className="mt-3 text-2xl font-black text-slate-900">
              Activa tu agenda online en 48h.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
              Sin conocimientos técnicos. Sin contrato. Te lo configuramos nosotros.
            </p>
            <Link
              href={BUSINESS_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-8 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Empezar gratis <ArrowRight size={15} />
            </Link>
            <p className="mt-3 text-xs text-slate-400">Sin tarjeta · Sin permanencia</p>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="border-t border-slate-100 px-5 py-8 lg:px-8">
          <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900">
              <Scissors size={13} className="text-[#C9922A]" />
              BarberíaOS
            </Link>
            <nav className="flex flex-wrap gap-5 text-sm text-slate-400">
              <Link href="/reservas-online-barberia" className="hover:text-slate-600">Reservas online</Link>
              <Link href="/programa-reservas-barberia" className="hover:text-slate-600">Programa de reservas</Link>
              <Link href="/software-para-barberias" className="hover:text-slate-600">Software barberías</Link>
              <Link href="/alternativa-a-booksy" className="hover:text-slate-600">Alternativa Booksy</Link>
              <Link href="/calculadora-booksy" className="hover:text-slate-600">Calculadora</Link>
              <Link href="/barberias" className="hover:text-slate-600">Directorio</Link>
            </nav>
          </div>
        </footer>

      </div>
    </>
  );
}
