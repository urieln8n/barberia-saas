import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import { PedirDemoClient } from "./PedirDemoClient";

export const metadata: Metadata = {
  title: "Pedir demo de BarberíaOS | Diagnóstico gratis para barberías",
  description:
    "Solicita una demo de BarberíaOS y recibe un diagnóstico para activar reservas online, QR, caja, clientes y control de barberos sin comisión por reserva.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/pedir-demo` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pedir demo de BarberíaOS",
    description:
      "Diagnóstico gratis para barberías que quieren ordenar reservas, caja, clientes y barberos.",
    url: `${BUSINESS_CONFIG.siteUrl}/pedir-demo`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
  },
};

export default function PedirDemoPage({
  searchParams,
}: {
  searchParams?: { interest?: string };
}) {
  return <PedirDemoClient initialInterest={searchParams?.interest} />;
}
