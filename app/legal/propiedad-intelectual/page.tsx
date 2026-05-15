import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Propiedad Intelectual",
  description: "Condiciones sobre marca, software, contenidos, licencia de uso y feedback en BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/propiedad-intelectual` },
};

export default function Page() {
  return <LegalDocumentPage slug="propiedad-intelectual" />;
}
