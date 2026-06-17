import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Link2,
  MessageCircle,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { SITE_URL } from "@/src/lib/site-url";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import { BarberiaOSLogo } from "@/components/brand/BarberiaOSLogo";

export const metadata: Metadata = {
  title: "Cómo Migrar de Booksy a BarberíaOS sin Perder Clientes | Guía 2026",
  description:
    "Guía paso a paso para migrar de Booksy a BarberíaOS: exporta tus clientes, conserva el historial, avisa sin perder reservas y queda operativo en 48 horas.",
  keywords: [
    "migrar de booksy",
    "cómo dejar booksy",
    "dejar booksy",
    "migrar booksy a otro sistema",
    "exportar clientes booksy",
    "cambiar de booksy a otro software",
  ],
  alternates: { canonical: `${SITE_URL}/migrar-de-booksy` },
  openGraph: {
    title: "Cómo Migrar de Booksy a BarberíaOS sin Perder Clientes",
    description:
      "Guía paso a paso: exporta tus clientes de Booksy, impórtalos en BarberíaOS y queda operativo en 48 horas sin perder reservas ni historial.",
    url: `${SITE_URL}/migrar-de-booksy`,
    type: "article",
    siteName: "BarberíaOS",
  },
};

const steps = [
  {
    n: "1",
    title: "Exporta tus clientes de Booksy",
    tag: "10 minutos",
    icon: FileSpreadsheet,
    text:
      "Desde el panel de administración de Booksy puedes exportar tu base de clientes en formato CSV. Es información que ya es tuya — Booksy te permite descargarla en pocos minutos.",
  },
  {
    n: "2",
    title: "Configuramos tu barbería en BarberíaOS",
    tag: "Día 1 — lo hacemos nosotros",
    icon: Scissors,
    text:
      "Subimos tus servicios, barberos, horarios y precios. Generamos tu página pública de reservas y tu QR personalizado. Tú solo revisas que todo esté correcto.",
  },
  {
    n: "3",
    title: "Importamos tu CSV de clientes",
    tag: "Sin pérdida de datos",
    icon: Download,
    text:
      "Con el archivo exportado de Booksy, importamos tu lista de clientes en BarberíaOS. Los contactos se mantienen; lo que no se traslada es el histórico de citas ya registradas dentro de Booksy, porque esa información vive en su plataforma, no en la tuya.",
  },
  {
    n: "4",
    title: "Avisas a tus clientes sin perderlos",
    tag: "Antes de cambiar el link",
    icon: MessageCircle,
    text:
      "Antes de mover el enlace, manda un mensaje a tu lista de WhatsApp o publica una historia en Instagram explicando que ahora reservan desde un nuevo link, igual de simple, sin necesidad de instalar nada nuevo.",
  },
  {
    n: "5",
    title: "Cambias el link en Instagram, WhatsApp y Google",
    tag: "5 minutos",
    icon: Link2,
    text:
      "Actualizas el enlace de reservas en tu bio de Instagram, en tu WhatsApp Business y en tu ficha de Google Business. A partir de ese momento, las reservas nuevas llegan a BarberíaOS sin comisión.",
  },
  {
    n: "6",
    title: "Mantienes Booksy activo el tiempo que necesites",
    tag: "Sin prisa",
    icon: ShieldCheck,
    text:
      "No tienes que cancelar Booksy el primer día. Puedes tener ambos sistemas en paralelo mientras honras las reservas ya confirmadas allí, y cancelar cuando estés seguro de que todo funciona en BarberíaOS.",
  },
];

const objections = [
  {
    title: "“Voy a perder mis reseñas y mi historial”",
    text:
      "Las reseñas que ves dentro del perfil de Booksy son de Booksy, no se transfieren porque pertenecen a su plataforma. Las reseñas de tu ficha de Google Business son tuyas y no dependen de qué sistema de reservas uses — se mantienen igual antes y después de migrar. El historial de clientes (nombre, teléfono, contacto) sí se traslada vía el CSV exportado; el registro detallado de citas pasadas dentro de Booksy se queda en Booksy.",
  },
  {
    title: "“Mis clientes no van a encontrar el nuevo link”",
    text:
      "Por eso el paso 4 va antes del paso 5: avisas primero, cambias el link después. Un aviso simple por WhatsApp o una historia de Instagram explicando que el sistema de reservas cambió es suficiente para la mayoría de barberías. El nuevo link funciona igual o más simple que Booksy — se reserva desde el navegador del móvil, sin instalar ninguna app.",
  },
  {
    title: "“Voy a tener un tiempo muerto sin poder recibir reservas”",
    text:
      "No es necesario. Puedes mantener Booksy operativo mientras configuramos BarberíaOS en paralelo. Solo cuando tu nueva página pública y tu QR estén listos y verificados, cambias el link de difusión. No hay un punto en el proceso donde tu barbería se quede sin sistema de reservas activo.",
  },
];

const faqItems = [
  {
    q: "¿Cuánto tarda la migración completa de Booksy a BarberíaOS?",
    a: "La configuración de tu barbería en BarberíaOS — servicios, barberos, horarios, página pública y QR — se hace en 48 horas. La exportación e importación de tus clientes (CSV) se hace en paralelo y toma minutos, no días. El único tiempo que depende de ti es decidir cuándo avisas a tus clientes y cambias el link de difusión.",
  },
  {
    q: "¿Necesito saber programar o tener conocimientos técnicos para migrar?",
    a: "No. El equipo de BarberíaOS configura tu barbería por ti durante la migración asistida. Tu única tarea técnica es exportar el CSV de clientes desde el panel de Booksy, y te explicamos exactamente dónde está ese botón.",
  },
  {
    q: "¿Puedo migrar solo una parte de mis datos, por ejemplo solo los clientes y no el histórico de citas?",
    a: "Sí. La migración estándar traslada tu base de clientes (nombre, teléfono y contacto) vía CSV. El histórico de citas ya realizadas en Booksy no se traslada porque queda registrado en su plataforma — no afecta a las citas nuevas que vayas a gestionar desde BarberíaOS en adelante.",
  },
  {
    q: "¿Qué pasa con las reservas que ya tengo confirmadas en Booksy mientras migro?",
    a: "Las honras con normalidad dentro de Booksy. No es necesario cancelarlas ni reprogramarlas. La recomendación es simple: las reservas futuras que ya existen se cumplen donde se hicieron, y las reservas nuevas a partir del cambio de link entran directamente en BarberíaOS.",
  },
  {
    q: "¿Tengo que cancelar Booksy el mismo día que activo BarberíaOS?",
    a: "No. Puedes mantener ambos sistemas activos en paralelo durante el tiempo que necesites. La mayoría de barberías cancelan Booksy solo después de comprobar, durante unas semanas, que el nuevo flujo de reservas funciona bien para ellas y sus clientes.",
  },
];

const migrarJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Alternativa a Booksy", item: `${SITE_URL}/alternativa-a-booksy` },
      { "@type": "ListItem", position: 3, name: "Cómo migrar de Booksy", item: `${SITE_URL}/migrar-de-booksy` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
];

export default function MigrarDeBooksyPage() {
  return (
    <>
      {migrarJsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="min-h-screen bg-[#09090B] text-white">
        {/* ── Nav ─────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09090B]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
            <Link href="/" aria-label="Volver a BarberíaOS">
              <BarberiaOSLogo variant="full" size="md" tone="dark" />
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/demo" className="hidden text-sm font-medium text-white/60 hover:text-white sm:block">
                Demo
              </Link>
              <Link
                href={BUSINESS_CONFIG.demoUrl}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#D4AF37] px-4 text-sm font-bold text-[#09090B] transition hover:bg-[#C9A227]"
              >
                Probar gratis
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="mx-auto max-w-4xl px-5 pt-6 text-xs text-white/40 lg:px-8">
          <Link href="/" className="hover:text-white/70">Inicio</Link>
          {" / "}
          <Link href="/alternativa-a-booksy" className="hover:text-white/70">Alternativa a Booksy</Link>
          {" / "}
          <span className="text-white/60">Cómo migrar de Booksy</span>
        </nav>

        {/* ── Hero ────────────────────────────────────────── */}
        <section className="px-5 py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
              Guía de migración
            </span>
            <h1 className="mt-5 text-[clamp(1.85rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight text-white">
              Cómo migrar de Booksy a BarberíaOS{" "}
              <span className="text-[#D4AF37]">sin perder un solo cliente</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/65">
              Guía paso a paso: exportas tus clientes, configuramos tu barbería, avisas a tu lista y cambias el link de reservas. Sin tiempo muerto, sin comisiones desde el primer día.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={BUSINESS_CONFIG.demoUrl}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#D4AF37] px-7 text-sm font-bold text-[#09090B] transition hover:bg-[#C9A227]"
              >
                Empezar mi migración <ArrowRight size={15} />
              </Link>
              <a
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 px-7 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                <MessageCircle size={15} />
                Hablar por WhatsApp
              </a>
            </div>
            <p className="mt-4 text-xs text-white/40">Sin tarjeta de crédito · Sin permanencia · Operativo en 48 horas</p>
          </div>
        </section>

        {/* ── Stats ───────────────────────────────────────── */}
        <section className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto grid max-w-3xl grid-cols-3 divide-x divide-white/10 px-5">
            {[
              { value: "48h", label: "barbería operativa" },
              { value: "0%", label: "comisión por reserva" },
              { value: "0", label: "clientes perdidos" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center py-6">
                <span className="text-2xl font-extrabold text-white">{value}</span>
                <span className="mt-1 text-xs text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pasos de migración ──────────────────────────── */}
        <section className="px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Proceso de migración</p>
            <h2 className="mt-3 text-center text-2xl font-extrabold text-white md:text-3xl">
              6 pasos para dejar Booksy sin sobresaltos
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-white/55">
              No hace falta cancelar nada el primer día. El proceso está pensado para que mantengas el control en todo momento.
            </p>

            <ol className="mt-10 space-y-5">
              {steps.map(({ n, title, tag, icon: Icon, text }) => (
                <li
                  key={n}
                  className="flex gap-5 rounded-2xl border border-white/10 bg-[#0E0E1C] p-6"
                >
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-extrabold text-[#09090B]">
                      {n}
                    </span>
                    <Icon size={16} className="text-white/25" />
                  </div>
                  <div>
                    <h3 className="flex flex-wrap items-center gap-2 text-base font-extrabold text-white">
                      {title}
                      <span className="inline-flex items-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#D4AF37]">
                        {tag}
                      </span>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Objeciones ──────────────────────────────────── */}
        <section className="border-y border-white/10 bg-white/[0.03] px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Dudas honestas</p>
            <h2 className="mt-3 text-center text-2xl font-extrabold text-white md:text-3xl">
              Los tres miedos reales antes de migrar
            </h2>
            <div className="mt-8 space-y-4">
              {objections.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-[#0E0E1C] p-6">
                  <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Checklist rápido ────────────────────────────── */}
        <section className="px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0E0E1C] p-7">
            <h2 className="text-base font-extrabold text-white">Checklist antes de cambiar el link de reservas</h2>
            <ul className="mt-5 space-y-3">
              {[
                "Exportaste el CSV de clientes desde el panel de Booksy",
                "Tu página pública y tu QR de BarberíaOS están configurados y probados",
                "Avisaste a tu lista de WhatsApp o publicaste el cambio en Instagram",
                "Tienes claro qué reservas ya confirmadas en Booksy debes honrar",
                "Actualizaste el link en Instagram, WhatsApp Business y Google Business",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                  <span className="text-sm leading-6 text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────── */}
        <section className="border-t border-white/10 bg-white/[0.03] px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-extrabold text-white">Preguntas frecuentes sobre la migración</h2>
            <div className="mt-8 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#0E0E1C]">
              {faqItems.map((item) => (
                <div key={item.q} className="px-6 py-5">
                  <p className="text-sm font-extrabold text-white">{item.q}</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────── */}
        <section className="px-5 py-14 lg:px-8">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#0E0E1C] p-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Empieza hoy</p>
            <h2 className="mt-3 text-2xl font-extrabold text-white">
              Migra de Booksy y queda operativo en 48 horas.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-white/60">
              Te ayudamos a exportar, importar y configurar tu barbería. Tú solo avisas a tus clientes.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={BUSINESS_CONFIG.demoUrl}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#D4AF37] px-8 text-sm font-bold text-[#09090B] transition hover:bg-[#C9A227]"
              >
                Empezar mi migración <ArrowRight size={15} />
              </Link>
              <Link
                href={BUSINESS_CONFIG.demoBookingUrl}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 px-8 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                Crear reserva de prueba
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/40">Sin tarjeta · Sin permanencia · Soporte en español</p>
          </div>
        </section>

        {/* ── Páginas relacionadas ────────────────────────── */}
        <section className="border-t border-white/10 px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-lg font-extrabold text-white">También te puede interesar</h2>
            <ul className="mt-5 flex flex-wrap justify-center gap-3">
              {[
                { label: "Alternativa a Booksy", href: "/alternativa-a-booksy" },
                { label: "¿Cuánto cobra Booksy?", href: "/blog/cuanto-cobra-booksy" },
                { label: "Calculadora de comisiones", href: "/calculadora-booksy" },
                { label: "Agenda online para barberías", href: "/agenda-online-barberia" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-[#D4AF37]/40 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="border-t border-white/10 px-5 py-8 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-white">
              <BarberiaOSLogo variant="icon" size="sm" tone="dark" />
              BarberíaOS
            </Link>
            <nav className="flex flex-wrap gap-5 text-sm text-white/40">
              <Link href="/alternativa-a-booksy" className="hover:text-white/70">Alternativa a Booksy</Link>
              <Link href="/calculadora-booksy" className="hover:text-white/70">Calculadora</Link>
              <Link href="/blog/cuanto-cobra-booksy" className="hover:text-white/70">¿Cuánto cobra Booksy?</Link>
              <Link href="/agenda-online-barberia" className="hover:text-white/70">Agenda online</Link>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
