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
  const isDark = variant === "dark" || variant === "glass";
  const variantClass =
    variant === "dark"
      ? "section-band-dark"
    : variant === "premium"
        ? "rounded-[2rem] border border-amber-200/40 bg-[#F6F1E8] text-slate-950 shadow-[var(--shadow-card)]"
    : variant === "light"
        ? "rounded-[2rem] border border-amber-200/40 bg-[#F8F3EA] text-slate-950 shadow-[var(--shadow-soft)]"
    : variant === "muted"
        ? "premium-card-muted"
        : variant === "glass"
          ? "premium-card glass-panel"
          : "rounded-[2rem] border border-amber-200/40 bg-[#F8F3EA] text-slate-950 shadow-[var(--shadow-soft)]";

  return (
    <section className={`${variantClass} overflow-hidden p-0 ${className}`}>
      {hasHeader && (
        <div className={isDark ? "border-b border-white/10 bg-white/[0.05] px-5 py-5 md:px-6" : "border-b border-black/5 bg-[#F3EDE1]/70 px-5 py-5 md:px-6"}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {title && (
                <h2 className={isDark ? "text-xl font-black text-white" : "section-heading"}>
                  {title}
                </h2>
              )}
              {description && (
                <p className={isDark ? "mt-1 text-base leading-7 text-slate-300" : "section-subtext"}>
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
