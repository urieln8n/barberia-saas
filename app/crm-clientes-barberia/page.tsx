import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "CRM para barberías | BarberíaOS",
  description:
    "Gestiona clientes, historial de visitas, notas y recuperación de clientes inactivos desde el panel de BarberíaOS. Sin CRM externo.",
  keywords: [
    "CRM barbería",
    "gestión clientes barbería",
    "historial clientes barbería",
    "base de datos clientes barbería",
    "recuperar clientes barbería",
    "ficha cliente barbería",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/crm-clientes-barberia` },
  openGraph: {
    title: "CRM para barberías | BarberíaOS",
    description:
      "Gestiona clientes, historial de visitas, notas y recuperación de clientes inactivos desde el panel de BarberíaOS.",
    url: `${BUSINESS_CONFIG.siteUrl}/crm-clientes-barberia`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/crm-clientes-barberia`}
      eyebrow="CRM para barberías"
      h1="Tus clientes, su historial y las próximas acciones en un solo panel."
      intro="BarberíaOS incluye una base de clientes integrada con la agenda: cada visita queda registrada, el barbero ve el historial antes de la cita y el panel detecta clientes que llevan semanas sin aparecer."
      benefits={[
        "Ficha de cliente con historial completo de visitas y servicios.",
        "Notas privadas visibles en cada cita del barbero.",
        "Contador de visitas para identificar clientes frecuentes.",
        "Detección de clientes inactivos para recuperarlos a tiempo.",
      ]}
      sections={[
        {
          title: "Historial por cliente",
          text: "Cada cliente tiene su ficha con fecha de última visita, servicios recibidos, importe acumulado y notas del equipo. Toda la información antes de cada cita.",
        },
        {
          title: "Recuperación de clientes",
          text: "BarberíaOS detecta clientes que no han reservado en semanas para que puedas contactarles antes de que se vayan a la competencia.",
        },
        {
          title: "Datos propios sin intermediario",
          text: "Tu base de clientes vive en BarberíaOS, no en un marketplace. Los datos son tuyos y puedes exportarlos en cualquier momento.",
        },
      ]}
      faq={[
        {
          q: "¿Es diferente al CRM de Booksy o Treatwell?",
          a: "Sí. En BarberíaOS los datos son tuyos. En plataformas de marketplace, el cliente pertenece a la plataforma, no a tu negocio.",
        },
        {
          q: "¿Puedo añadir notas privadas por cliente?",
          a: "Sí. Cada ficha admite notas visibles solo para el equipo, no para el cliente.",
        },
        {
          q: "¿El CRM funciona con varios barberos?",
          a: "Sí. El historial registra qué barbero atendió cada cita y permite ver la actividad por persona.",
        },
      ]}
    />
  );
}
