import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Información identificativa, condiciones de uso y marco legal de BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/aviso-legal` },
};

export default function Page() {
  return <LegalDocumentPage slug="aviso-legal" />;
}
