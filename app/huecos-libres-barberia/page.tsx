import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Huecos libres en barbería | BarberíaOS",
  description:
    "Detecta y publica automáticamente los huecos libres de tu agenda para llenar cancelaciones y maximizar ingresos sin llamar a nadie.",
  keywords: [
    "huecos libres barbería",
    "cancelaciones barbería",
    "ocupar agenda barbería",
    "llenar huecos barbería",
    "gestión agenda barbería",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/huecos-libres-barberia` },
  openGraph: {
    title: "Huecos libres en barbería | BarberíaOS",
    description:
      "Detecta y publica automáticamente los huecos libres de tu agenda para llenar cancelaciones y maximizar ingresos.",
    url: `${BUSINESS_CONFIG.siteUrl}/huecos-libres-barberia`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      eyebrow="Huecos libres en barbería"
      h1="Detecta huecos libres y llénalos antes de que cuesten dinero."
      intro="Cada cancelación o hueco sin reserva es ingreso perdido. BarberíaOS muestra los huecos disponibles en tiempo real para que puedas publicarlos, compartirlos o dejar que los clientes los reserven directamente."
      benefits={[
        "Vista de huecos libres por barbero y por hora.",
        "Comparte huecos disponibles en WhatsApp o Instagram en un clic.",
        "Los clientes pueden reservar huecos desde tu página pública.",
        "El sistema evita solapamientos y dobles reservas automáticamente.",
      ]}
      sections={[
        {
          title: "Vista operativa de la agenda",
          text: "El panel de BarberíaOS muestra qué barbero tiene hueco, cuándo y cuánto tiempo libre tiene antes de la siguiente cita.",
        },
        {
          title: "Publicación de huecos",
          text: "Comparte el link de tu hueco libre directo desde el panel. El cliente entra, ve el slot disponible y reserva al instante.",
        },
        {
          title: "Anti solapamiento",
          text: "El sistema bloquea automáticamente los huecos ya reservados para que nunca haya dos citas en el mismo slot con el mismo barbero.",
        },
      ]}
      faq={[
        {
          q: "¿Cómo sabe el sistema qué huecos están libres?",
          a: "BarberíaOS calcula los huecos a partir de la agenda real: reservas confirmadas, duración de servicios y horario del barbero.",
        },
        {
          q: "¿Puedo marcar manualmente un hueco como no disponible?",
          a: "Sí. Puedes bloquear horas desde el panel para descansos, tareas del local o cualquier motivo.",
        },
        {
          q: "¿Los huecos libres se actualizan en tiempo real?",
          a: "Sí. En cuanto entra una reserva, el hueco desaparece de la página pública para evitar conflictos.",
        },
      ]}
    />
  );
}
