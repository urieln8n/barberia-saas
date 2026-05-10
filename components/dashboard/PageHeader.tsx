import type { ReactNode } from "react";

type Props = {
  section?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  section = "Panel de control",
  title,
  description,
  action,
}: Props) {
  return (
    <div className="section-band flex flex-col justify-between gap-4 px-5 py-5 md:flex-row md:items-center md:px-6">
      <div className="min-w-0">
        <p className="label-section">{section}</p>
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">{action}</div>
      )}
    </div>
  );
}
