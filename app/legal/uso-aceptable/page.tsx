import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Política de uso aceptable | BarberíaOS",
  description: "Reglas mínimas para proteger BarberíaOS, sus clientes, usuarios finales y terceros.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/uso-aceptable` },
};

export default function Page() {
  return <LegalDocumentPage slug="uso-aceptable" />;
}
