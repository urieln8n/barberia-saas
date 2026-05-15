import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Reservas online para barberías | BarberíaOS",
  description:
    "Reservas online para barberías con enlace público, QR, agenda por barbero y clientes propios. Sin comisión por cita.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/reservas-online-barberia` },
};

export default function Page() {
  return (
    <SeoLandingPage
      eyebrow="Reservas online para barberías"
      h1="Reservas online para barberías sin llamadas ni comisiones."
      intro="BarberíaOS convierte Instagram, WhatsApp, Google y el QR del local en citas ordenadas dentro de la agenda de cada barbero."
      benefits={[
        "Enlace público de reservas de cada barbería listo para compartir.",
        "Agenda por barbero con servicios, precios y horarios visibles.",
        "QR para mostrador, escaparate, tarjetas e Instagram.",
        "Clientes propios y relación directa con la barbería.",
      ]}
      sections={[
        {
          title: "Reserva pública",
          text: "El cliente elige servicio, barbero y hora desde el móvil, sin instalar apps y sin depender de llamadas.",
        },
        {
          title: "Agenda conectada",
          text: "Las citas entran al panel para que el equipo vea huecos, estados y reservas del día.",
        },
        {
          title: "Sin comisión",
          text: "El modelo es plan mensual. No se cobra un porcentaje por cada cita creada.",
        },
      ]}
      faq={[
        {
          q: "¿Mis clientes tienen que descargar una app?",
          a: "No. Reservan desde el navegador con el enlace público de reservas o escaneando el QR.",
        },
        {
          q: "¿Puedo compartirlo en Instagram y WhatsApp?",
          a: "Sí. El enlace está pensado para bio de Instagram, mensajes de WhatsApp, Google Business Profile y QR físico.",
        },
      ]}
    />
  );
}
