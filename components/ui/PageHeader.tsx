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

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white px-6 py-6 shadow-card md:px-8 md:py-7 ${className}`}
    >
      {/* Gold accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px]
        bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          {label && (
            <p className="label-section">{label}</p>
          )}
          <h1
            className="text-slate-900 font-black tracking-tight leading-tight"
            style={{
              fontSize: "clamp(1.625rem, 3.5vw, 2.5rem)",
              letterSpacing: "-0.03em",
              marginTop: label ? "0.375rem" : "0",
            }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
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
