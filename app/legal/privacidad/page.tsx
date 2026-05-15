import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Tratamiento de datos personales, bases legales, derechos y contacto de privacidad de BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/privacidad` },
};

export default function Page() {
  return <LegalDocumentPage slug="privacidad" />;
}
