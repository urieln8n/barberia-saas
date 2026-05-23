import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  variant?: "default" | "dark" | "light" | "premium" | "muted" | "glass";
};

export function SectionCard({
  children,
  title,
  description,
  action,
  className = "",
  bodyClassName = "",
  variant = "default",
}: SectionCardProps) {
  const hasHeader = title || description || action;
  const variantClass =
    variant === "dark"
      ? "rounded-[2rem] border border-slate-200 bg-white text-slate-900 shadow-sm"
    : variant === "premium"
        ? "rounded-[2rem] border border-slate-200 bg-white text-slate-900 shadow-sm"
    : variant === "light"
        ? "rounded-[2rem] border border-slate-200 bg-white text-slate-900 shadow-sm"
    : variant === "muted"
        ? "rounded-[2rem] border border-slate-200 bg-slate-50 text-slate-900 shadow-sm"
        : variant === "glass"
          ? "rounded-[2rem] border border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur-xl"
          : "rounded-[2rem] border border-slate-200 bg-white text-slate-900 shadow-sm";

  return (
    <section className={`${variantClass} overflow-hidden p-0 ${className}`}>
      {hasHeader && (
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {title && (
                <h2 className="section-heading">
                  {title}
                </h2>
              )}
              {description && (
                <p className="section-subtext">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      )}
      <div className={bodyClassName || "p-5 md:p-6"}>{children}</div>
    </section>
  );
}
