import type { Metadata } from "next";
import { SquirePremiumLanding } from "@/components/landing/SquirePremiumLanding";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

const faqs = [
  [
    "¿Necesito conocimientos técnicos para usar BarberíaOS?",
    "No. BarberíaOS está diseñado para dueños de barberías, no para técnicos. La configuración inicial tarda menos de 30 minutos y tienes soporte por WhatsApp si necesitas ayuda.",
  ],
  [
    "¿Mis clientes tienen que instalar una app?",
    "No. Reservan desde cualquier navegador — desde tu link, QR, Instagram o Google Business. Sin descargas ni registros de ningún tipo.",
  ],
  [
    "¿Puedo poner mi QR en la puerta de la barbería?",
    "Sí. Cada barbería tiene su propio QR único e imprimible. Ponlo en la puerta, en el mostrador, en tarjetas o en Instagram — los clientes escanean y reservan en 2 minutos.",
  ],
  [
    "¿Puedo recibir reservas desde Instagram y Google?",
    "Sí. Compartes tu link de reservas en la bio de Instagram, en tu ficha de Google Business y por WhatsApp. Sin configuraciones avanzadas.",
  ],
  [
    "¿Puedo gestionar varios barberos?",
    "Sí. Cada barbero tiene su horario propio, agenda individual y estadísticas. Los planes Pro y Elite permiten equipos sin límite de barberos.",
  ],
  [
    "¿El plan Elite incluye página web?",
    "Sí. El plan Elite incluye una web premium con SEO local optimizado para que tu barbería aparezca en Google cuando alguien busca barberías en tu ciudad.",
  ],
  [
    "¿BarberíaOS cobra comisión por cada reserva?",
    "No. Cuota mensual fija. Tus reservas, clientes y datos son siempre tuyos. Sin sorpresas ni cargos ocultos.",
  ],
  [
    "¿Puedo cancelar cuando quiera?",
    "Sí. Sin permanencia, sin penalizaciones, sin preguntas. Puedes cancelar desde el panel en cualquier momento.",
  ],
] as const;

export const metadata: Metadata = {
  title: "BarberíaOS | Sistema de reservas y gestión para barberías modernas",
  description:
    "Gestiona reservas online, agenda, clientes, barberos, caja y crea contenido para Instagram con IA. Software premium para barberías. Desde 39 €/mes sin comisiones.",
  keywords: [
    "software para barberías",
    "sistema de reservas barberías",
    "app para barberías",
    "agenda para barberías",
    "gestión de barberías",
    "reservas online barbería",
    "barbería software España",
    "software barbería sin comisión",
    "BarberíaOS",
    "QR reservas barbería",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/` },
  openGraph: {
    title: "BarberíaOS | Sistema de reservas y gestión para barberías modernas",
    description:
      "Reservas online, agenda, clientes, barberos, caja, reseñas y Studio IA en un solo panel. Desde 39 €/mes sin comisiones.",
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
      <SquirePremiumLanding />
    </>
  );
}
