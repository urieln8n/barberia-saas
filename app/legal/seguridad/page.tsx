import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = { title: "Política de Seguridad | BarberíaOS" };

export default function Page() {
  return <LegalDocumentPage slug="seguridad" />;
}
