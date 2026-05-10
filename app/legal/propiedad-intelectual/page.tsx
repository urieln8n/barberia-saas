import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = { title: "Propiedad Intelectual | BarberíaOS" };

export default function Page() {
  return <LegalDocumentPage slug="propiedad-intelectual" />;
}
