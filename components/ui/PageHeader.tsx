import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  section?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  variant?: "default" | "dark" | "light" | "glass";
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
  const variantClass = variant === "glass"
    ? "dashboard-hero dashboard-hero-glass"
    : "dashboard-hero";

  return (
    <section className={`${variantClass} px-5 py-6 md:px-7 md:py-7 ${className}`}>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="min-w-0">
          {label && (
            <p className="text-xs font-black uppercase text-[#C9922A]">
              {label}
            </p>
          )}
          <h1 className="mt-1.5 text-[clamp(2rem,4vw,3.25rem)] font-black leading-tight text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
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
