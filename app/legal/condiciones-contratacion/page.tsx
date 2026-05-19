import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Condiciones de contratación | BarberíaOS",
  description: "Condiciones de planes, suscripciones, facturación, cambios de plan, impuestos, impagos y baja del servicio.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/condiciones-contratacion` },
};

export default function Page() {
  return <LegalDocumentPage slug="condiciones-contratacion" />;
}
