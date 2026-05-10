import { notFound } from "next/navigation";
import { LegalCard } from "@/components/legal/LegalCard";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getLegalPage, type LegalSection } from "@/components/legal/legal-content";

function LegalTable({ section }: { section: LegalSection }) {
  if (!section.table) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs font-black uppercase text-slate-400">
            <tr>
              {section.table.headers.map((header) => (
                <th key={header} className="whitespace-nowrap px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row, rowIndex) => (
              <tr key={`${section.id}-${rowIndex}`} className="border-t border-slate-100 align-top">
                {row.map((cell, cellIndex) => (
                  <td key={`${section.id}-${rowIndex}-${cellIndex}`} className="min-w-40 px-4 py-3 text-slate-600">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LegalSectionContent({ section }: { section: LegalSection }) {
  return (
    <>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.bullets && (
        <ul className="space-y-2">
          {section.bullets.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      <LegalTable section={section} />
    </>
  );
}

export function LegalDocumentPage({ slug }: { slug: string }) {
  const page = getLegalPage(slug);

  if (!page) notFound();

  const tocItems = page.sections.map((section) => ({
    id: section.id,
    title: section.title,
  }));

  return (
    <LegalPageLayout
      title={page.title}
      description={page.description}
      lastUpdated={page.lastUpdated}
      tocItems={tocItems}
    >
      <section className="rounded-[24px] border border-[#2563EB]/15 bg-[#2563EB]/5 p-5 md:p-6">
        <p className="text-xs font-black uppercase text-[#2563EB]">Resumen</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {page.summary.map((item) => (
            <li key={item} className="rounded-2xl border border-white/70 bg-white p-4 text-sm font-semibold leading-6 text-slate-600 shadow-sm">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {page.sections.map((section) => (
        <LegalCard key={section.id} id={section.id} title={section.title}>
          <LegalSectionContent section={section} />
        </LegalCard>
      ))}
    </LegalPageLayout>
  );
}
