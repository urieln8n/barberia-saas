import type { Metadata } from "next";
import { UltraVipLanding } from "@/components/landing/UltraVipLanding";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

const faqs = [
  [
    "¿BarberíaOS es solo una agenda?",
    "No. BarberíaOS une reservas, agenda, caja, clientes, barberos, huecos libres, QR, marketing e IA en un solo panel operativo.",
  ],
  [
    "¿Cobra comisión por reserva?",
    "No. BarberíaOS funciona con plan mensual y setup inicial. Tus reservas, clientes y datos siguen siendo tuyos.",
  ],
  [
    "¿Mis clientes tienen que instalar una app?",
    "No. Reservan desde tu link público, tu QR, Instagram, Google Business o WhatsApp, directamente desde el navegador.",
  ],
  [
    "¿También podéis crear la web premium de mi barbería?",
    "Sí. Podemos plantear una Web VIP con SEO local, WhatsApp, QR de reservas, agenda online y BarberíaOS conectado.",
  ],
] as const;

export const metadata: Metadata = {
  title: "BarberíaOS | Software para barberías con reservas, caja y QR sin comisión",
  description:
    "Controla reservas, caja, clientes, barberos y huecos libres desde un solo panel. BarberíaOS es el software para barberías que quieren agenda online, QR propio y cero comisiones por reserva.",
  keywords: [
    "software para barberías",
    "agenda online barberías",
    "reservas barbería",
    "caja para barberías",
    "QR reservas barbería",
    "software barbería sin comisión",
    "app para barberías",
    "sistema de reservas barbería",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/` },
  openGraph: {
    title: "BarberíaOS | Software para barberías con reservas, caja y QR sin comisión",
    description:
      "Reservas, agenda, caja, clientes, barberos, huecos libres, QR y marketing en un solo panel para barberías.",
    url: `${BUSINESS_CONFIG.siteUrl}/`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BarberíaOS dashboard para barberías con reservas, caja y QR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BarberíaOS | Reservas, caja y QR para barberías",
    description:
      "Controla reservas, caja, clientes, barberos y huecos libres desde un solo panel.",
    images: ["/opengraph-image"],
  },
};

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BUSINESS_CONFIG.commercialName,
    url: BUSINESS_CONFIG.siteUrl,
    email: BUSINESS_CONFIG.legalEmail,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: BUSINESS_CONFIG.supportEmail,
      url: `${BUSINESS_CONFIG.siteUrl}/pedir-demo`,
      areaServed: "ES",
      availableLanguage: ["es"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BUSINESS_CONFIG.commercialName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: BUSINESS_CONFIG.siteUrl,
    description:
      "Software SaaS para barberías con reservas online, agenda, caja, clientes, barberos, huecos libres, QR, marketing e IA.",
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
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <UltraVipLanding />
    </>
  );
}
