import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Comunicaciones comerciales | BarberíaOS",
  description: "Información sobre emails transaccionales, comunicaciones comerciales y mensajes por WhatsApp o SMS en BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/comunicaciones-comerciales` },
};

export default function Page() {
  return <LegalDocumentPage slug="comunicaciones-comerciales" />;
}
