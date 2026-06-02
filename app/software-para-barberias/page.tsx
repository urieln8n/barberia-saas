import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Software para barberías | BarberíaOS",
  description:
    "Software para barberías con reservas online, agenda, caja, clientes, productos, QR, marketing e IA. Sin comisión por reserva.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/software-para-barberias` },
  openGraph: {
    type: "website",
    url: `${BUSINESS_CONFIG.siteUrl}/software-para-barberias`,
    title: "Software para barberías | BarberíaOS",
    description:
      "Reservas, agenda, caja, clientes, productos, QR, marketing e IA para barberías modernas.",
    siteName: BUSINESS_CONFIG.commercialName,
  },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/software-para-barberias`}
      eyebrow="Software para barberías"
      h1="El software para barberías que conecta reservas, caja y clientes."
      intro="BarberíaOS es un SaaS vertical para dueños de barberías que necesitan controlar agenda, barberos, servicios, caja, productos, clientes, marketing y reservas online en un solo panel."
      benefits={[
        "Reservas online con enlace público de reservas de cada barbería.",
        "Agenda por barbero, estados de cita y huecos visibles.",
        "Caja diaria, productos, propinas y rendimiento por servicio.",
        "Clientes propios, campañas de recuperación y Marketing Studio.",
      ]}
      sections={[
        {
          title: "Reservas",
          text: "Convierte visitas de Instagram, WhatsApp, Google y QR en citas reales dentro de tu agenda.",
        },
        {
          title: "Operaciones",
          text: "Une barberos, servicios, caja, productos y clientes para saber qué pasa cada día.",
        },
        {
          title: "Crecimiento",
          text: "Detecta clientes dormidos, huecos y acciones comerciales con Marketing Studio e IA del dueño.",
        },
      ]}
      faq={[
        {
          q: "¿BarberíaOS es solo una agenda online?",
          a: "No. La agenda es una parte del sistema. También incluye caja, clientes, productos, QR, marketing e IA del dueño.",
        },
        {
          q: "¿Cobra comisión por reserva?",
          a: "No. BarberíaOS está planteado con plan mensual para que la barbería mantenga sus clientes y su relación comercial.",
        },
      ]}
    />
  );
}
