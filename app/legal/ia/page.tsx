import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = { title: "Política de IA | BarberíaOS" };

export default function Page() {
  return <LegalDocumentPage slug="ia" />;
}
