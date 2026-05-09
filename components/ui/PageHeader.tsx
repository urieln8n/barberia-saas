import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  section?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  variant?: "default" | "dark" | "glass";
  className?: string;
};

export function PageHeader({
  eyebrow,
  section,
  title,
  description,
  action,
  children,
  variant = "default",
  className = "",
}: PageHeaderProps) {
  const label = eyebrow ?? section;
  const variantClass =
    variant === "dark"
      ? "section-band-dark"
      : variant === "glass"
        ? "section-band glass-panel"
        : "section-band";

  return (
    <section className={`${variantClass} px-5 py-5 md:px-6 ${className}`}>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="min-w-0">
          {label && (
            <p className={variant === "dark" ? "text-[11px] font-black uppercase text-[#D5A84C]" : "label-section"}>
              {label}
            </p>
          )}
          <h1 className={variant === "dark" ? "mt-1.5 text-[clamp(1.75rem,2vw,2.5rem)] font-black text-white" : "page-title"}>
            {title}
          </h1>
          {description && (
            <p className={variant === "dark" ? "mt-2 max-w-3xl text-sm leading-6 text-white/60" : "page-description"}>
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {action}
          </div>
        )}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}
