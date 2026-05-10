import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = { title: "Acuerdo de Encargo de Tratamiento | BarberíaOS" };

export default function Page() {
  return <LegalDocumentPage slug="encargo-tratamiento" />;
}
