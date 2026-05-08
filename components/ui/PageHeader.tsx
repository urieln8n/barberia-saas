import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  section?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow,
  section,
  title,
  description,
  action,
}: PageHeaderProps) {
  const label = eyebrow ?? section;

  return (
    <section className="section-band flex flex-col justify-between gap-5 px-5 py-5 md:flex-row md:items-center md:px-6">
      <div className="min-w-0">
        {label && <p className="label-section">{label}</p>}
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {action}
        </div>
      )}
    </section>
  );
}
