import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Scissors, XCircle } from "lucide-react";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Barberías fundadoras | BarberíaOS",
  description:
    "Buscamos 5 barberías fundadoras para activar BarberíaOS con acompañamiento directo: reservas online, QR, caja, clientes y control de barberos sin comisiones.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/barberias-fundadoras` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Barberías fundadoras | BarberíaOS",
    description:
      "Activación guiada de BarberíaOS para las primeras 5 barberías fundadoras.",
    url: `${BUSINESS_CONFIG.siteUrl}/barberias-fundadoras`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
  },
};

const recibe = [
  "Activación guiada",
  "Configuración de servicios y barberos",
  "QR de reservas",
  "Página pública de reservas",
  "Revisión del flujo de agenda",
  "Acompañamiento inicial",
  "Acceso preferente a nuevas funciones",
];

const paraQuien = [
  "Barberías con 1 a 8 barberos",
  "Negocios que reciben reservas por WhatsApp o Instagram",
  "Barberías que quieren controlar clientes y caja",
  "Negocios que quieren reducir dependencia de plataformas externas",
];

const noEs = [
  "Quien solo quiere aparecer en un marketplace",
  "Quien no quiere gestionar su propia base de clientes",
  "Quien no está dispuesto a probar un sistema nuevo",
];

export default function BarberiasFundadorasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué incluye una barbería fundadora?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Incluye activación guiada, configuración de servicios y barberos, QR, página pública de reservas y acompañamiento inicial.",
        },
      },
      {
        "@type": "Question",
        name: "¿Se garantizan resultados?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No se prometen resultados garantizados. La oferta se centra en acompañamiento y configuración profesional del sistema.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-[#D5A84C]">
            <Scissors size={16} /> BarberíaOS
          </Link>
          <div className="mt-12 max-w-4xl">
            <p className="text-xs font-black uppercase text-[#38BDF8]">Programa fundador</p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Buscamos 5 barberías fundadoras para activar BarberíaOS con acompañamiento directo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              Te ayudamos a montar reservas online, QR, caja, clientes y control de barberos sin comisiones por reserva.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pedir-demo?interest=barberia-fundadora" className="btn-premium-blue min-h-12 px-7">
                Solicitar plaza fundadora <ArrowRight size={17} />
              </Link>
              <Link href="/r/demo-barber" className="btn-ghost premium-cta-glass min-h-12 px-7">
                Ver demo interactiva
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          <ListCard title="Qué recibe" items={recibe} />
          <ListCard title="Para quién es" items={paraQuien} />
          <ListCard title="Para quién no es" items={noEs} negative />
        </div>
      </section>

      <section className="px-5 pb-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-[#D5A84C]/25 bg-[#D5A84C]/[0.06] p-7 md:p-10">
          <p className="text-xs font-black uppercase text-[#D5A84C]">Oferta fundadora</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">Primeras 5 barberías.</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/62">
            Campaña manual con activación guiada y condiciones especiales. No mostramos plazas dinámicas ni resultados garantizados.
          </p>
          <Link href="/pedir-demo?interest=barberia-fundadora" className="btn-premium-blue mt-7 min-h-12 px-7">
            Solicitar plaza fundadora <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function ListCard({
  title,
  items,
  negative = false,
}: {
  title: string;
  items: string[];
  negative?: boolean;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-white/72">
            {negative ? (
              <XCircle size={17} className="mt-0.5 shrink-0 text-red-300" />
            ) : (
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#38BDF8]" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
