import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Condiciones de reservas | BarberíaOS",
  description: "Condiciones aplicables a usuarios finales que reservan en una barbería mediante BarberíaOS.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/legal/condiciones-reservas` },
};

export default function Page() {
  return <LegalDocumentPage slug="condiciones-reservas" />;
}
