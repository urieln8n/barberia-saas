import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Política de IA | BarberíaOS",
  description: "Modelo de política para funciones presentes o futuras de inteligencia artificial en BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/ia` },
};

export default function Page() {
  return <LegalDocumentPage slug="ia" />;
}
