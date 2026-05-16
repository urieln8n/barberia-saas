import { InstitutionalPage } from "@/components/marketing/InstitutionalPage";
import { getInstitutionalMetadata } from "@/src/lib/institutional-metadata";
import { institutionalPages } from "@/src/lib/institutional-pages";

const page = institutionalPages.academia;

export const metadata = getInstitutionalMetadata(page);

export default function AcademiaPage() {
  return <InstitutionalPage page={page} />;
}
