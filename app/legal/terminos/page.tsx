import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Condiciones generales de uso del SaaS BarberíaOS para barberías y usuarios autorizados.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/terminos` },
};

export default function Page() {
  return <LegalDocumentPage slug="terminos" />;
}
