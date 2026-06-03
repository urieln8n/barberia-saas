import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Marketing digital para barberías | BarberíaOS",
  description:
    "Estrategia de marketing digital para barberías: Google Business, Instagram, WhatsApp, SEO local y reservas online desde un solo sistema.",
  keywords: [
    "marketing digital barberías",
    "marketing para barberías",
    "SEO local barbería",
    "Google Business barbería",
    "Instagram barberías",
    "reservas online barbería marketing",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/marketing-para-barberias` },
  openGraph: {
    title: "Marketing digital para barberías | BarberíaOS",
    description:
      "Estrategia de marketing digital para barberías: Google Business, Instagram, WhatsApp, SEO local y reservas online.",
    url: `${BUSINESS_CONFIG.siteUrl}/marketing-para-barberias`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/marketing-para-barberias`}
      eyebrow="Marketing digital para barberías"
      h1="Más clientes desde Google, Instagram y WhatsApp. Sin agencia."
      intro="Las barberías que más llenan no son las mejores necesariamente, son las más fáciles de encontrar y reservar. BarberíaOS te da las herramientas para aparecer donde buscan tus clientes y que reserven en el acto."
      benefits={[
        "Página pública de reservas optimizada para SEO local.",
        "Link directo para Instagram Bio, Google Business y WhatsApp.",
        "QR propio para imprimir, pegar y compartir en redes.",
        "Sin comisión por reserva: el cliente es tuyo, no de la plataforma.",
      ]}
      sections={[
        {
          title: "SEO local para barberías",
          text: "Tu página pública de BarberíaOS está construida para que Google la indexe con tu nombre, ciudad y servicios. Sin pagar por publicidad.",
        },
        {
          title: "Reservas desde Instagram y WhatsApp",
          text: "Añade el link de reservas a tu bio de Instagram o como respuesta automática en WhatsApp. El cliente hace clic y reserva directamente.",
        },
        {
          title: "Google Business optimizado",
          text: "Añade tu link de reservas de BarberíaOS a tu ficha de Google My Business para recibir reservas directas desde la búsqueda local.",
        },
      ]}
      faq={[
        {
          q: "¿BarberíaOS hace publicidad en mi nombre?",
          a: "No. BarberíaOS te da la infraestructura: página pública, QR y link de reservas. La distribución (Instagram, Google, WhatsApp) la controlas tú.",
        },
        {
          q: "¿Hay algún coste extra por las reservas que entran desde redes?",
          a: "No. BarberíaOS cobra un plan mensual fijo. Puedes recibir todas las reservas que quieras sin coste adicional.",
        },
        {
          q: "¿Puedo tener varias barberías con páginas distintas?",
          a: "Sí. Cada barbería tiene su propia URL, su QR y su panel de gestión.",
        },
      ]}
    />
  );
}
