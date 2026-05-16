import { InstitutionalPage } from "@/components/marketing/InstitutionalPage";
import { getInstitutionalMetadata } from "@/src/lib/institutional-metadata";
import { institutionalPages } from "@/src/lib/institutional-pages";

const page = institutionalPages.impacto;

export const metadata = getInstitutionalMetadata(page);

export default function ImpactoPage() {
  return <InstitutionalPage page={page} />;
}
