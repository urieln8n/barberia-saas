import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Subencargados | BarberíaOS",
  description: "Listado de proveedores tecnológicos usados o potenciales, con estado operativo de cada servicio.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/subencargados` },
};

export default function Page() {
  return <LegalDocumentPage slug="subencargados" />;
}
