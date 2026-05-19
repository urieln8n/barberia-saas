import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Accesibilidad | BarberíaOS",
  description: "Compromiso de accesibilidad, estado de conformidad, limitaciones conocidas y canal de contacto de BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/accesibilidad` },
};

export default function Page() {
  return <LegalDocumentPage slug="accesibilidad" />;
}
