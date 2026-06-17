import type { Metadata } from "next";
import { SITE_URL } from "@/src/lib/site-url";
import { CalculadoraBooksyClient } from "./CalculadoraBooksyClient";

export const metadata: Metadata = {
  title: "Calculadora Booksy — ¿Cuánto pagas de verdad? | BarberíaOS",
  description:
    "Calcula cuánto pagas realmente con Booksy sumando plan mensual y comisiones Boost, y compáralo con el precio fijo de BarberíaOS. Sin sorpresas.",
  keywords: [
    "calculadora booksy",
    "cuánto cobra booksy",
    "comisiones booksy",
    "coste booksy barbería",
    "alternativa booksy precio",
    "software barbería precio fijo",
  ],
  alternates: { canonical: `${SITE_URL}/calculadora-booksy` },
  openGraph: {
    title: "Calculadora Booksy — ¿Cuánto pagas de verdad? | BarberíaOS",
    description:
      "Introduce tus reservas y ticket medio y descubre cuánto te cuesta Booksy vs BarberíaOS. Precio fijo sin comisiones.",
    url: `${SITE_URL}/calculadora-booksy`,
    type: "website",
    siteName: "BarberíaOS",
  },
};

const calculadoraJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Calculadora Booksy vs BarberíaOS",
    description: "Calcula el coste real de Booksy con comisiones Boost y compáralo con BarberíaOS.",
    url: `${SITE_URL}/calculadora-booksy`,
    inLanguage: "es-ES",
    isPartOf: { "@type": "WebSite", name: "BarberíaOS", url: SITE_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Alternativa a Booksy", item: `${SITE_URL}/alternativa-a-booksy` },
      { "@type": "ListItem", position: 3, name: "Calculadora Booksy", item: `${SITE_URL}/calculadora-booksy` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuánto cobra Booksy de comisión?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Booksy cobra hasta un 30% de comisión por las primeras reservas gestionadas a través de su función Boost, además de la cuota mensual del plan (desde ~29€/mes). El coste real mensual puede superar los 150-200€ para barberías con volumen medio.",
        },
      },
      {
        "@type": "Question",
        name: "¿BarberíaOS cobra comisión por reserva?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. BarberíaOS tiene precio fijo mensual desde 39€/mes sin ninguna comisión por reserva. Cuantas más citas gestiones, más rentable te sale.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué incluye el precio fijo de BarberíaOS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Reservas online, agenda por barbero, caja diaria, gestión de clientes, QR de reservas, página pública de la barbería y soporte por WhatsApp. Sin límite de reservas ni costes adicionales.",
        },
      },
    ],
  },
];

export default function CalculadoraBooksyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculadoraJsonLd) }}
      />
      <CalculadoraBooksyClient />
    </>
  );
}
