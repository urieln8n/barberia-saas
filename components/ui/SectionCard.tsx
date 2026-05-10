import type { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  variant?: "default" | "dark" | "muted" | "glass";
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
      ? "section-band-dark"
      : variant === "muted"
        ? "rounded-[24px] border border-slate-200 bg-slate-50 shadow-[var(--shadow-soft)]"
        : variant === "glass"
          ? "rounded-[24px] glass-panel"
          : "panel";

  return (
    <section className={`${variantClass} overflow-hidden p-0 ${className}`}>
      {hasHeader && (
        <div className={variant === "dark" ? "border-b border-white/10 bg-white/[0.04] px-5 py-4 md:px-6" : "border-b border-slate-200 bg-slate-50/80 px-5 py-4 md:px-6"}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {title && (
                <h2 className={variant === "dark" ? "text-lg font-black text-white" : "section-heading"}>
                  {title}
                </h2>
              )}
              {description && (
                <p className={variant === "dark" ? "mt-1 text-sm leading-6 text-white/55" : "section-subtext"}>
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
