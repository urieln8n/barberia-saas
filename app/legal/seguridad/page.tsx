import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Política de seguridad | BarberíaOS",
  description: "Resumen de medidas técnicas y organizativas, buenas prácticas y gestión de incidencias en BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/seguridad` },
};

export default function Page() {
  return <LegalDocumentPage slug="seguridad" />;
}
