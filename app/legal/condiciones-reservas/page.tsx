import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";

export const metadata: Metadata = { title: "Condiciones de Reservas | BarberíaOS" };

export default function Page() {
  return <LegalDocumentPage slug="condiciones-reservas" />;
}
