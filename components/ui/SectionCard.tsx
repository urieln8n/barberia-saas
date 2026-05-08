import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function SectionCard({
  children,
  title,
  description,
  action,
  className = "",
  bodyClassName = "",
}: SectionCardProps) {
  const hasHeader = title || description || action;

  return (
    <section className={`panel overflow-hidden p-0 ${className}`}>
      {hasHeader && (
        <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {title && <h2 className="section-heading">{title}</h2>}
              {description && <p className="section-subtext">{description}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      )}
      <div className={bodyClassName || "p-5 md:p-6"}>{children}</div>
    </section>
  );
}
