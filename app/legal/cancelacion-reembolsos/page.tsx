import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Cancelación y reembolsos | BarberíaOS",
  description: "Condiciones de cancelación, baja del servicio, reembolsos y efectos operativos para clientes de BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/cancelacion-reembolsos` },
};

export default function Page() {
  return <LegalDocumentPage slug="cancelacion-reembolsos" />;
}
