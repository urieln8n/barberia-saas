import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = { title: "Condiciones de Contratación | BarberíaOS" };

export default function Page() {
  return <LegalDocumentPage slug="condiciones-contratacion" />;
}
