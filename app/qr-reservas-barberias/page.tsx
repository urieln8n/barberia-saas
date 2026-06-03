import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "QR de reservas para barberías | BarberíaOS",
  description:
    "Genera un QR único para tu barbería y que tus clientes reserven cita desde el móvil sin llamadas, sin apps y sin comisión.",
  keywords: [
    "QR reservas barbería",
    "código QR barbería",
    "reservas QR barbería",
    "QR cita barbería",
    "reservas sin app barbería",
  ],
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/qr-reservas-barberias` },
  openGraph: {
    title: "QR de reservas para barberías | BarberíaOS",
    description:
      "Genera un QR único para tu barbería y que tus clientes reserven cita desde el móvil sin llamadas, sin apps y sin comisión.",
    url: `${BUSINESS_CONFIG.siteUrl}/qr-reservas-barberias`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/qr-reservas-barberias`}
      eyebrow="QR de reservas para barberías"
      h1="Tu QR propio. Tus clientes reservan desde el móvil en segundos."
      intro="BarberíaOS genera un QR único para tu barbería que puedes poner en el escaparate, en Instagram o en la mesa del local. El cliente lo escanea, elige barbero, servicio y hora, y confirma al instante."
      benefits={[
        "QR propio generado desde el panel sin configuración extra.",
        "Página de reservas adaptada a móvil y sin app que descargar.",
        "Cero llamadas para confirmar cita: el sistema lo hace solo.",
        "El QR funciona en impresión, pantalla y redes sociales.",
      ]}
      sections={[
        {
          title: "QR en el escaparate",
          text: "Imprime el QR y pégalo en la puerta, el espejo o la caja. El cliente lo escanea antes de entrar y reserva sin esperar.",
        },
        {
          title: "QR en Instagram y Google",
          text: "Comparte el link de tu página pública en bio, stories o ficha de Google Business para recibir reservas directas sin intermediarios.",
        },
        {
          title: "Sin comisión por reserva",
          text: "BarberíaOS funciona con plan mensual fijo. Cada reserva que entra por QR es tuya. Sin porcentajes ni tarifas por cita.",
        },
      ]}
      faq={[
        {
          q: "¿Necesito una app para usar el QR?",
          a: "No. El cliente accede a una página web desde su móvil. No hay nada que instalar.",
        },
        {
          q: "¿Puedo personalizar la página de reservas con mi logo?",
          a: "Sí. La página pública muestra el nombre, servicios y barberos de tu barbería.",
        },
        {
          q: "¿El QR cambia si modifico mis servicios?",
          a: "No. El QR apunta a tu URL permanente. Los cambios en servicios y horarios se reflejan al instante sin generar un QR nuevo.",
        },
      ]}
    />
  );
}
