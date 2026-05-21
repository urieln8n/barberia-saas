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
  const isLight = variant === "light";
  const variantClass = isLight
    ? "rounded-[2rem] border border-amber-200/40 bg-[#F6F1E8] shadow-[var(--shadow-warm)]"
    : variant === "glass"
      ? "dashboard-hero dashboard-hero-glass"
      : "dashboard-hero";

  return (
    <section className={`${variantClass} px-5 py-6 md:px-7 md:py-7 ${className}`}>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="min-w-0">
          {label && (
            <p className={isLight ? "text-xs font-black uppercase text-[#B98B2F]" : "text-xs font-black uppercase text-[#D4AF66]"}>
              {label}
            </p>
          )}
          <h1 className={isLight ? "mt-1.5 text-[clamp(2rem,4vw,3.25rem)] font-black leading-tight text-slate-950" : "mt-1.5 text-[clamp(2rem,4vw,3.25rem)] font-black leading-tight text-white"}>
            {title}
          </h1>
          {description && (
            <p className={isLight ? "mt-3 max-w-3xl text-base leading-7 text-slate-600" : "mt-3 max-w-3xl text-base leading-7 text-slate-300"}>
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
