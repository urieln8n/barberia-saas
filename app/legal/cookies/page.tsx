import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Información sobre cookies necesarias, preferencias, analítica y gestión de consentimiento en BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/cookies` },
};

export default function Page() {
  return <LegalDocumentPage slug="cookies" />;
}
