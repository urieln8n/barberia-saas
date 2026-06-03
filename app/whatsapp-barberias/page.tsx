import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "WhatsApp para barberías | BarberíaOS",
  description:
    "Usa WhatsApp como canal de reservas y comunicación sin depender de mensajes sueltos. BarberíaOS centraliza la agenda para que WhatsApp sea un canal, no el sistema.",
  keywords: [
    "WhatsApp barberías",
    "reservas WhatsApp barbería",
    "gestión barbería WhatsApp",
    "citas WhatsApp barbería",
    "barbería sin mensajes perdidos",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/whatsapp-barberias` },
  openGraph: {
    title: "WhatsApp para barberías | BarberíaOS",
    description:
      "Usa WhatsApp como canal de reservas sin depender de mensajes sueltos. BarberíaOS centraliza la agenda.",
    url: `${BUSINESS_CONFIG.siteUrl}/whatsapp-barberias`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/whatsapp-barberias`}
      eyebrow="WhatsApp para barberías"
      h1="WhatsApp como canal de reservas, no como agenda caótica."
      intro="Muchas barberías gestionan citas por WhatsApp: notas de voz, capturas, mensajes perdidos y dobles reservas. BarberíaOS da a tus clientes un link y un QR para reservar solos, y WhatsApp vuelve a ser un canal de comunicación, no el sistema de gestión."
      benefits={[
        "Link de reservas para compartir por WhatsApp en un clic.",
        "Los clientes reservan solos sin esperar respuesta.",
        "Cero doble reserva: el sistema bloquea slots automáticamente.",
        "Panel de agenda en tiempo real para ver el día sin buscar mensajes.",
      ]}
      sections={[
        {
          title: "El problema de gestionar con WhatsApp",
          text: "Los mensajes se pierden, las confirmaciones se olvidan y los huecos se solapan. Cada vez que un cliente escribe hay que reconstruir el estado de la agenda a mano.",
        },
        {
          title: "WhatsApp como canal, BarberíaOS como sistema",
          text: "Comparte tu link de BarberíaOS por WhatsApp y el cliente completa la reserva solo. Tú ves la cita en el panel al instante, sin intercambio de mensajes.",
        },
        {
          title: "Confirmaciones automáticas",
          text: "Cuando entra una reserva, el cliente recibe confirmación inmediata. Sin respuestas manuales ni riesgo de olvido.",
        },
      ]}
      faq={[
        {
          q: "¿Tengo que dejar de usar WhatsApp?",
          a: "No. WhatsApp sigue siendo un buen canal para comunicarte con clientes. BarberíaOS evita que la agenda dependa de mensajes sueltos.",
        },
        {
          q: "¿Cómo saben mis clientes que hay un sistema nuevo?",
          a: "Comparte el link de reservas en tu bio de Instagram, en el estado de WhatsApp o como respuesta automática. El cambio es invisible para ellos.",
        },
        {
          q: "¿Funciona también con Google Business?",
          a: "Sí. Puedes añadir el link de reservas de BarberíaOS a tu ficha de Google My Business para recibir citas directas desde la búsqueda.",
        },
      ]}
    />
  );
}
