import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Software para barberías en Valencia | BarberíaOS",
  description:
    "Software de gestión para barberías en Valencia con reservas online, agenda, caja, QR y página pública. Sin comisión por reserva.",
  keywords: [
    "software barberías Valencia",
    "reservas online barbería Valencia",
    "agenda barbería Valencia",
    "gestión barbería Valencia",
    "app barbería Valencia",
    "sistema reservas barbería Valencia",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/software-barberias-valencia` },
  openGraph: {
    title: "Software para barberías en Valencia | BarberíaOS",
    description:
      "Software de gestión para barberías en Valencia con reservas online, agenda, caja, QR y página pública.",
    url: `${BUSINESS_CONFIG.siteUrl}/software-barberias-valencia`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      eyebrow="Software para barberías en Valencia"
      h1="Gestiona tu barbería en Valencia desde un solo panel. Sin comisiones."
      intro="Las barberías de Valencia que usan BarberíaOS reciben reservas desde Instagram, Google y WhatsApp, controlan caja y barberos, y tienen su propia página pública con QR. Todo sin pagar comisión por cada cita."
      benefits={[
        "Reservas online 24h desde móvil sin app que instalar.",
        "Panel de gestión para agenda, barberos, caja y clientes.",
        "QR propio para escaparate, publicidad y redes sociales.",
        "Página pública con SEO local para barberías en Valencia.",
      ]}
      sections={[
        {
          title: "Agenda para barberías en Valencia",
          text: "Controla la agenda semanal de tu barbería en Valencia, asigna citas por barbero y detecta huecos libres en tiempo real.",
        },
        {
          title: "Reservas sin comisión en Valencia",
          text: "A diferencia de plataformas como Booksy o Treatwell, BarberíaOS cobra un plan mensual fijo. Tus clientes son tuyos.",
        },
        {
          title: "Caja y cierre diario",
          text: "Registra cobros, propinas y ventas de productos. Consulta el cierre del día sin hojas de Excel ni cuadernos.",
        },
      ]}
      faq={[
        {
          q: "¿BarberíaOS tiene soporte en Valencia?",
          a: "BarberíaOS es un software SaaS que funciona por completo online. El soporte es por email y chat sin importar la ciudad.",
        },
        {
          q: "¿Cuánto cuesta para una barbería en Valencia?",
          a: "El plan Starter comienza en 39 €/mes e incluye reservas, QR, agenda y página pública. Sin comisión por reserva.",
        },
        {
          q: "¿Puedo probar BarberíaOS antes de pagar?",
          a: "Sí. Puedes solicitar una demo gratuita para ver el sistema antes de decidirte.",
        },
      ]}
    />
  );
}
