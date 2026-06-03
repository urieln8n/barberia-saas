import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Software para barberías en Barcelona | BarberíaOS",
  description:
    "Software para barberías en Barcelona con reservas online, QR, agenda, caja, clientes y marketing sin comisión por cita.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/software-barberias-barcelona` },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/software-barberias-barcelona`}
      city="Barcelona"
      eyebrow="Barberías en Barcelona"
      h1="Software para barberías en Barcelona que quieren reservas propias."
      intro="BarberíaOS ayuda a barberías urbanas a convertir búsquedas locales, Instagram, WhatsApp y QR de mostrador en reservas controladas por el negocio."
      benefits={[
        "Ideal para barberías con tráfico local, redes sociales y clientes recurrentes.",
        "Enlace público de reservas para compartir en Google, Instagram y WhatsApp.",
        "Caja, agenda, productos y clientes en un panel para el dueño.",
        "Sin comisión por reserva y sin perder la relación con el cliente.",
      ]}
      sections={[
        {
          title: "Captación local",
          text: "Prepara tu presencia para búsquedas de clientes que quieren reservar desde el móvil cerca de su zona.",
        },
        {
          title: "Operativa diaria",
          text: "Controla agenda por barbero, caja del día, productos y clientes recurrentes desde el mismo panel.",
        },
        {
          title: "Crecimiento",
          text: "Usa Marketing Studio e IA del dueño para recuperar clientes y llenar huecos de la semana.",
        },
      ]}
      faq={[
        {
          q: "¿BarberíaOS sirve para barberías pequeñas de Barcelona?",
          a: "Sí. Puede usarse desde una barbería de un solo barbero hasta equipos con varias agendas.",
        },
        {
          q: "¿Ayuda con reservas desde Google o Instagram?",
          a: "Sí. El enlace público de reservas puede compartirse en perfiles, mensajes, QR y campañas locales.",
        },
      ]}
    />
  );
}
