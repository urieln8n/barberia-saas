import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Programa de fidelización para barberías | BarberíaOS",
  description:
    "Convierte clientes ocasionales en clientes fijos con seguimiento de visitas, historial y herramientas de retención para barberías.",
  keywords: [
    "programa fidelización barberías",
    "fidelizar clientes barbería",
    "retención clientes barbería",
    "historial clientes barbería",
    "CRM barbería",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/programa-fidelizacion-barberias` },
  openGraph: {
    title: "Programa de fidelización para barberías | BarberíaOS",
    description:
      "Convierte clientes ocasionales en clientes fijos con seguimiento de visitas, historial y herramientas de retención.",
    url: `${BUSINESS_CONFIG.siteUrl}/programa-fidelizacion-barberias`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      eyebrow="Fidelización de clientes para barberías"
      h1="Conoce a tus clientes, cuídalos y que vuelvan solos."
      intro="Un cliente que repite vale más que diez que prueban y no vuelven. BarberíaOS guarda el historial de visitas, servicios y notas de cada cliente para que el barbero sepa siempre con quién trabaja y cuándo toca llamarle."
      benefits={[
        "Historial completo de visitas, servicios y gasto por cliente.",
        "Contador de visitas para identificar clientes frecuentes.",
        "Notas privadas del barbero visibles en cada cita.",
        "Alertas de clientes que no han vuelto en semanas.",
      ]}
      sections={[
        {
          title: "Historial de cliente",
          text: "Cada cliente tiene su ficha con todas las citas, servicios recibidos, importes y notas del equipo. La información está disponible antes de cada visita.",
        },
        {
          title: "Seguimiento de actividad",
          text: "El panel de BarberíaOS muestra cuántos clientes han vuelto, quiénes llevan tiempo sin aparecer y cuál es el ticket medio por servicio.",
        },
        {
          title: "Datos propios, sin plataformas intermediarias",
          text: "Con BarberíaOS los datos de tus clientes son tuyos. No hay marketplace, no hay comisión y no hay otra plataforma que se quede con tu base de clientes.",
        },
      ]}
      faq={[
        {
          q: "¿Hay puntos o tarjeta de sellos?",
          a: "El seguimiento de visitas y el historial completo están disponibles desde el primer día. Los programas de puntos avanzados están en la hoja de ruta del plan Premium.",
        },
        {
          q: "¿Puedo exportar los datos de mis clientes?",
          a: "Sí. Los datos son tuyos y puedes exportarlos en cualquier momento.",
        },
        {
          q: "¿Funciona con varios barberos?",
          a: "Sí. El historial registra qué barbero atendió cada cita para un seguimiento personalizado.",
        },
      ]}
    />
  );
}
