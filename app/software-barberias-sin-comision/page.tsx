import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Software para barberías sin comisión | BarberíaOS",
  description:
    "Software para barberías sin comisión por reserva: agenda, enlace público, QR, caja, clientes y marketing en un plan mensual.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/software-barberias-sin-comision` },
};

export default function Page() {
  return (
    <SeoLandingPage
      canonicalUrl={`${BUSINESS_CONFIG.siteUrl}/software-barberias-sin-comision`}
      eyebrow="Sin comisión por reserva"
      h1="Software para barberías sin comisión por cada cita."
      intro="BarberíaOS te da reservas online, agenda, caja, QR y clientes propios con precio mensual. La relación con el cliente sigue siendo tuya."
      benefits={[
        "Plan mensual fijo sin porcentaje por reserva.",
        "Clientes propios dentro de tu base de datos.",
        "Enlace público y QR de reservas de tu barbería.",
        "Marketing y recuperación sin depender de marketplaces.",
      ]}
      sections={[
        {
          title: "Clientes tuyos",
          text: "La barbería mantiene sus datos, su marca y la relación directa con cada cliente.",
        },
        {
          title: "Reserva directa",
          text: "El cliente reserva desde el enlace público de reservas de la barbería, no desde un marketplace.",
        },
        {
          title: "Control completo",
          text: "Además de reservas, BarberíaOS une caja, productos, agenda, clientes y marketing.",
        },
      ]}
      faq={[
        {
          q: "¿BarberíaOS cobra comisión por cita?",
          a: "No. BarberíaOS se plantea como SaaS con plan mensual, no como marketplace con comisión por reserva.",
        },
        {
          q: "¿Puedo migrar desde una plataforma con comisión?",
          a: "Sí. La demo sirve para revisar cómo quedaría tu flujo de reservas, agenda y clientes propios.",
        },
      ]}
    />
  );
}
