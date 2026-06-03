import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Marketing para barberías | BarberíaOS",
  description:
    "Marketing Studio para barberías: campañas de recuperación de clientes, reseñas, WhatsApp e Instagram. Sin agencia. Desde el panel de BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/marketing-barberias` },
  openGraph: {
    type: "website",
    url: `${BUSINESS_CONFIG.siteUrl}/marketing-barberias`,
    title: "Marketing para barberías | BarberíaOS",
    description:
      "Campañas de recuperación, reseñas, WhatsApp e Instagram para barberías. Sin agencia.",
    siteName: BUSINESS_CONFIG.commercialName,
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/marketing-barberias`}
      eyebrow="Marketing para barberías"
      h1="Llena tu agenda con clientes que ya conoces y clientes nuevos que te encuentran."
      intro="BarberíaOS incluye un Marketing Studio con campañas de recuperación de clientes inactivos, gestión de reseñas, mensajes por WhatsApp e integración con Instagram. Sin agencia. Desde el mismo panel donde gestionas la agenda."
      benefits={[
        "Detecta clientes que no han vuelto en semanas y lanza campañas de recuperación.",
        "Pide reseñas automáticamente tras cada cita para mejorar tu presencia en Google.",
        "Comparte huecos libres por WhatsApp e Instagram con un clic.",
        "Link de reservas optimizado para bio de Instagram y Google Business.",
      ]}
      sections={[
        {
          title: "Recuperación de clientes",
          text: "El sistema detecta clientes dormidos y te sugiere cuándo y cómo contactarlos para que vuelvan a reservar.",
        },
        {
          title: "Reseñas en Google",
          text: "Tras cada cita completada, BarberíaOS puede enviar un mensaje de seguimiento para pedir valoración en Google Business.",
        },
        {
          title: "Instagram y WhatsApp",
          text: "Comparte tu link de reservas, publica huecos libres y conecta tus redes sociales como canal de captación directo.",
        },
      ]}
      faq={[
        {
          q: "¿Necesito conocimientos de marketing para usar el Marketing Studio?",
          a: "No. BarberíaOS te da plantillas de mensajes y acciones sugeridas. Solo eliges a quién enviar y en qué canal.",
        },
        {
          q: "¿Puedo gestionar Instagram desde BarberíaOS?",
          a: "Sí. Puedes conectar tu cuenta de Instagram para responder comentarios y enviar el link de reservas a potenciales clientes.",
        },
        {
          q: "¿El Marketing Studio está en todos los planes?",
          a: "El Marketing Studio básico (recuperación + reseñas) está en el plan Crece. Las funciones avanzadas de Instagram y campañas en el plan Escala.",
        },
      ]}
    />
  );
}
