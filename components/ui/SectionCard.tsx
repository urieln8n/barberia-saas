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
    variant === "muted"
      ? "rounded-[20px] border border-white/[0.07] bg-white/[0.03] text-white shadow-none"
      : variant === "glass"
        ? "rounded-[20px] border border-white/[0.08] bg-white/[0.05] text-white shadow-none backdrop-blur-xl"
        : "rounded-[20px] border border-white/[0.07] bg-white/[0.04] text-white shadow-none";

  return (
    <section className={`${variantClass} overflow-hidden p-0 ${className}`}>
      {hasHeader && (
        <div className="border-b border-white/[0.06] bg-white/[0.03] px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {title && (
                <h2
                  className="font-black text-white/85"
                  style={{
                    fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                    letterSpacing: "-0.025em",
                    lineHeight: "1.2",
                  }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1.5 text-sm leading-6 text-white/45">
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
