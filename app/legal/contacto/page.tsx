import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Contacto legal | BarberíaOS",
  description: "Canales de contacto para asuntos legales, privacidad, soporte y comunicaciones formales de BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/contacto` },
};

export default function Page() {
  return <LegalDocumentPage slug="contacto" />;
}
