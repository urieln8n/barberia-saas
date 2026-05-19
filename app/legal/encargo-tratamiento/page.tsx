import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Acuerdo de encargo de tratamiento | BarberíaOS",
  description: "Condiciones del encargo de tratamiento de datos para barberías que usan BarberíaOS como herramienta SaaS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/encargo-tratamiento` },
};

export default function Page() {
  return <LegalDocumentPage slug="encargo-tratamiento" />;
}
