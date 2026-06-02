import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, CalendarDays, CheckCircle2, Scissors, Users } from "lucide-react";
import { InstagramLeadForm } from "./InstagramLeadForm";
import { SITE_URL } from "@/src/lib/site-url";

export const metadata: Metadata = {
  title: "Instagram para barberías | BarberíaOS",
  description:
    "Convierte visitas desde Instagram en reservas reales para tu barbería. BarberíaOS: agenda online, caja y CRM sin comisión por reserva.",
  alternates: {
    canonical: `${SITE_URL}/instagram`,
  },
  openGraph: {
    title: "Instagram para barberías | BarberíaOS",
    description:
      "Convierte el link de tu bio de Instagram en reservas reales. Sin comisión por cita. Configuración en 48h.",
    url: `${SITE_URL}/instagram`,
    type: "website",
    siteName: "BarberíaOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram para barberías | BarberíaOS",
    description: "Convierte Instagram en reservas automáticas para tu barbería. Sin comisiones.",
  },
};

const instagramJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Instagram para barberías | BarberíaOS",
  description:
    "Convierte visitas desde Instagram en reservas reales para tu barbería. BarberíaOS: agenda online, caja y CRM sin comisión por reserva.",
  url: `${SITE_URL}/instagram`,
  inLanguage: "es-ES",
  isPartOf: {
    "@type": "WebSite",
    name: "BarberíaOS",
    url: SITE_URL,
  },
};

const blocks = [
  {
    title: "Reservas",
    text: "Convierte el link de la bio, stories y DMs en citas reales sin comisiones por reserva.",
    icon: CalendarDays,
  },
  {
    title: "Caja",
    text: "Controla ingresos, métodos de pago y rendimiento por barbero desde el mismo panel.",
    icon: Banknote,
  },
  {
    title: "Clientes",
    text: "Guarda historial, detecta clientes perdidos y activa campañas para que vuelvan.",
    icon: Users,
  },
];

export default function InstagramPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(instagramJsonLd) }}
      />
    <main className="min-h-screen overflow-hidden bg-[#05070D] text-white">
      <section className="relative px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 14% 8%, rgba(213,168,76,0.20), transparent 28rem), radial-gradient(circle at 84% 10%, rgba(47,111,235,0.12), transparent 24rem), linear-gradient(180deg,#05070D 0%,#080A0F 56%,#0C111C 100%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-6xl min-w-0">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D5A84C]/35 bg-[#D5A84C]/12">
                <Scissors size={18} className="text-[#D5A84C]" />
              </span>
              <span className="text-sm font-black tracking-tight">BarberíaOS</span>
            </Link>
            <a
              href="#demo"
              className="hidden rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-4 py-2 text-sm font-black text-[#D5A84C] transition hover:bg-[#D5A84C]/16 sm:inline-flex"
            >
              Pedir demo
            </a>
          </header>

          <div className="grid w-full min-w-0 grid-cols-1 gap-8 pb-4 pt-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:pt-16">
            <div className="min-w-0">
              <p className="inline-flex rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#D5A84C]">
                Captación desde Instagram
              </p>
              <h1 className="mt-5 max-w-[20rem] break-words text-[1.75rem] font-black leading-[1.1] tracking-normal [overflow-wrap:anywhere] sm:max-w-3xl sm:text-5xl lg:text-7xl">
                Convierte Instagram en demos para BarberíaOS.
              </h1>
              <p className="mt-5 max-w-[20rem] break-words text-base leading-8 text-white/64 [overflow-wrap:anywhere] sm:max-w-2xl sm:text-lg">
                Una landing directa para dueños de barbería: explica el valor, captura el lead con UTM
                y lo guarda en el CRM comercial para seguimiento.
              </p>

              <div className="mt-7 flex max-w-[20rem] flex-col gap-3 sm:max-w-none sm:flex-row">
                <a
                  href="#demo"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#D5A84C] px-6 py-3 text-sm font-black text-[#080A0F] transition hover:bg-[#E8C675]"
                >
                  Pedir demo
                </a>
                <Link
                  href="/r/demo-barber?utm_source=instagram&utm_medium=organic_social&utm_campaign=instagram_landing"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] px-6 py-3 text-sm font-black text-white transition hover:bg-white/[0.10]"
                >
                  Ver demo interactiva
                </Link>
              </div>

              <div className="mt-8 grid gap-3 text-sm font-bold text-white/70 sm:grid-cols-3">
                {["Sin comisión", "Sin app para clientes", "CRM + caja + agenda"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-[#D5A84C]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div id="demo" className="scroll-mt-6">
              <InstagramLeadForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.035] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 md:grid-cols-3">
            {blocks.map((block) => {
              const Icon = block.icon;
              return (
                <article
                  key={block.title}
                  className="rounded-[24px] border border-white/[0.09] bg-[#0B111D] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.20)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D5A84C]/25 bg-[#D5A84C]/10">
                    <Icon size={19} className="text-[#D5A84C]" />
                  </div>
                  <h2 className="mt-5 text-xl font-black">{block.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/58">{block.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
