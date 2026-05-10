import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = { title: "Cancelación y Reembolsos | BarberíaOS" };

export default function Page() {
  return <LegalDocumentPage slug="cancelacion-reembolsos" />;
}
