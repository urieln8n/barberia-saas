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
import { PrimaryButton } from "@/components/ui/PrimaryButton";
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
    description:
      "Agenda online profesional para barberías. Reservas 24h, QR y página pública. Sin comisión.",
    siteName: "BarberíaOS",
  },
};

const steps = [
  {
    n: "01",
    title: "Configuras tu barbería",
    text: "Servicios, precios, barberos y horarios. Te ayudamos en menos de 48h.",
    icon: Scissors,
  },
  {
    n: "02",
    title: "Compartes el link o QR",
    text: "Funciona en Instagram, Google, WhatsApp y en el mostrador.",
    icon: QrCode,
  },
  {
    n: "03",
    title: "Los clientes reservan solos",
    text: "Eligen servicio, barbero y hora. Tú ves la agenda en tiempo real.",
    icon: CalendarClock,
  },
];

const benefits = [
  { icon: Clock,       text: "Reservas 24h — incluso mientras cortás" },
  { icon: Smartphone,  text: "Sin app — reservan desde el navegador" },
  { icon: Users,       text: "Agenda por barbero con control de huecos" },
  { icon: QrCode,      text: "QR imprimible para mostrador y escaparate" },
  { icon: Zap,         text: "0% comisión — precio fijo mensual" },
  { icon: Instagram,   text: "Tus clientes son tuyos — no van a ninguna plataforma" },
];

const faqs = [
  {
    q: "¿Cómo reservan mis clientes?",
    a: "Escanean tu QR o abren tu link. Eligen barbero, servicio y hora sin llamadas ni mensajes.",
  },
  {
    q: "¿Puedo controlar qué horas ofrezco?",
    a: "Sí. Configuras horarios, descansos y festivos. La agenda solo muestra huecos reales.",
  },
  {
    q: "¿Qué pasa si un cliente no aparece?",
    a: "El sistema lo registra y envía recordatorios automáticos para reducir no-shows.",
  },
  {
    q: "¿Puedo tener varios barberos?",
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
    description:
      "Agenda online para barberías: tus clientes reservan desde Instagram, WhatsApp, QR o tu página pública. Sin llamadas, sin papel.",
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

      <div className="min-h-screen bg-[#F9FAFB] text-[#0A0A0A]">

        {/* Nav */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A0A0A] text-[#C9922A]">
                <Scissors size={17} />
              </span>
              <span className="text-sm font-black tracking-tight text-[#0A0A0A]">BarberíaOS</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/demo" className="hidden text-sm font-semibold text-slate-500 hover:text-[#0A0A0A] sm:block">
                Ver demo
              </Link>
              <Link
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#C9922A] px-4 text-sm font-black text-white transition hover:bg-[#B8811A]"
              >
                Probar gratis
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="border-b border-slate-200 bg-white px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9922A]/25 bg-[#C9922A]/8 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#C9922A]">
              Agenda online para barberías
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] font-black leading-[1.1] tracking-tight text-[#0A0A0A]">
              La agenda que convierte WhatsApp en reservas automáticas.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500">
              Tus clientes reservan solos desde el móvil — sin descargar apps, sin registros, sin llamadas.
              Tú ves la agenda en tiempo real.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#0A0A0A] px-7 text-sm font-black text-white transition hover:bg-[#1A1A1A]"
              >
                Activar mi agenda gratis <ArrowRight size={16} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-[#0A0A0A]"
              >
                Ver demo en vivo
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">Sin tarjeta · Sin permanencia · Setup en 48h</p>
          </div>
        </section>

        {/* Stats strip */}
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-slate-200 px-5">
            {[
              { value: "0%",  label: "comisión por reserva" },
              { value: "48h", label: "setup incluido" },
              { value: "24/7", label: "reservas activas" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-5">
                <span className="text-2xl font-black text-[#0A0A0A]">{value}</span>
                <span className="mt-0.5 text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <section className="px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-black text-[#0A0A0A]">
              En 3 pasos ya tienes reservas automáticas
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map(({ n, title, text, icon: Icon }) => (
                <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A0A0A] text-sm font-black text-[#C9922A]">
                      {n}
                    </span>
                    <Icon size={18} className="text-slate-300" />
                  </div>
                  <h3 className="mt-4 text-base font-black text-[#0A0A0A]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-y border-slate-200 bg-white px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-black text-[#0A0A0A]">
              Por qué los barberos eligen BarberíaOS
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F9FAFB] px-4 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9922A]/10">
                    <Icon size={15} className="text-[#C9922A]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* QR feature */}
        <section className="px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:grid-cols-[auto_1fr]">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C9922A]/10">
                <QrCode size={24} className="text-[#C9922A]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0A0A0A]">QR de reservas para tu barbería</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Obtienes un QR descargable para pegar en el mostrador, escaparate, tarjetas o Instagram.
                  El cliente lo escanea, elige servicio y hora, y reserva en menos de un minuto. Sin apps. Sin registro.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span className="text-sm font-bold text-slate-600">Disponible desde el plan Arranca — 39€/mes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-200 bg-white px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-black text-[#0A0A0A]">
              Preguntas frecuentes
            </h2>
            <div className="mt-7 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
              {faqs.map((faq) => (
                <div key={faq.q} className="px-6 py-5">
                  <p className="text-sm font-black text-[#0A0A0A]">{faq.q}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-[#0A0A0A] p-10 text-center text-white">
            <h2 className="text-2xl font-black md:text-3xl">
              Activa tu agenda online hoy.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-white/60">
              Te lo configuramos en 48 horas. Sin conocimientos técnicos. Sin contrato.
            </p>
            <Link
              href={BUSINESS_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-[#C9922A] px-8 text-sm font-black text-white transition hover:bg-[#B8811A]"
            >
              Empezar gratis <ArrowRight size={16} />
            </Link>
            <p className="mt-4 text-xs text-white/30">Sin tarjeta · Sin permanencia</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-5 py-6 text-center lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="font-semibold text-slate-500 hover:text-[#0A0A0A]">← BarberíaOS</Link>
            <Link href="/software-para-barberias" className="text-slate-400 hover:text-slate-600">Software barberías</Link>
            <Link href="/alternativa-a-booksy" className="text-slate-400 hover:text-slate-600">Alternativa a Booksy</Link>
            <Link href="/barberias" className="text-slate-400 hover:text-slate-600">Directorio</Link>
          </div>
          <p className="mt-4 text-xs text-slate-300">© {new Date().getFullYear()} BarberíaOS — Agenda online para barberías.</p>
        </footer>

      </div>
    </>
  );
}
