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
      ? "dashboard-hero"
      : variant === "glass"
        ? "dashboard-hero dashboard-hero-glass"
        : "dashboard-hero";

  return (
    <section className={`${variantClass} px-5 py-5 md:px-6 ${className}`}>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="min-w-0">
          {label && (
            <p className="text-[11px] font-black uppercase text-[#D5A84C]">
              {label}
            </p>
          )}
          <h1 className="mt-1.5 text-[clamp(1.9rem,2.6vw,3rem)] font-black leading-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/62">
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
