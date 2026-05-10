import type { ReactNode } from "react";

type DashboardCardProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  variant?: "default" | "dark" | "muted" | "glass";
};

export function DashboardCard({
  title,
  description,
  action,
  children,
  className = "",
  bodyClassName = "",
  variant = "default",
}: DashboardCardProps) {
  const wrapperClass =
    variant === "dark"
      ? "dashboard-card premium-dark"
      : variant === "muted"
        ? "dashboard-card bg-slate-50"
        : variant === "glass"
          ? "dashboard-card glass-panel"
          : "dashboard-card";

  return (
    <section className={`${wrapperClass} overflow-hidden ${className}`}>
      {(title || description || action) && (
        <div className={variant === "dark" ? "border-b border-white/10 px-5 py-4 md:px-6" : "border-b border-slate-200 px-5 py-4 md:px-6"}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {title && (
                <h2 className={variant === "dark" ? "text-lg font-black text-white" : "text-lg font-black text-[#080A0F]"}>
                  {title}
                </h2>
              )}
              {description && (
                <p className={variant === "dark" ? "mt-1 text-sm leading-6 text-white/55" : "mt-1 text-sm leading-6 text-slate-500"}>
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
