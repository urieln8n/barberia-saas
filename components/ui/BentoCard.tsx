import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type BentoCardProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "dark" | "glass" | "accent";
};

export function BentoCard({
  title,
  description,
  eyebrow,
  icon: Icon,
  action,
  children,
  className = "",
  variant = "default",
}: BentoCardProps) {
  const variantClass =
    variant === "dark"
      ? "bento-card premium-dark"
      : variant === "glass"
        ? "bento-card glass-panel"
        : variant === "accent"
          ? "bento-card bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F7FF_100%)] ring-1 ring-[#2563EB]/10"
          : "bento-card";

  return (
    <article className={`${variantClass} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className={variant === "dark" ? "text-[11px] font-black uppercase text-[#D5A84C]" : "label-section"}>
              {eyebrow}
            </p>
          )}
          <h3 className={variant === "dark" ? "mt-2 text-xl font-black text-white" : "mt-2 text-xl font-black text-[#080A0F]"}>
            {title}
          </h3>
          {description && (
            <p className={variant === "dark" ? "mt-2 text-sm leading-6 text-white/58" : "mt-2 text-sm leading-6 text-slate-500"}>
              {description}
            </p>
          )}
        </div>
        {Icon && (
          <div className={variant === "dark" ? "metric-icon bg-white/10" : "metric-icon bg-[#2563EB]/10"}>
            <Icon size={18} className={variant === "dark" ? "text-white" : "text-[#2563EB]"} />
          </div>
        )}
      </div>
      {children && <div className="mt-5">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </article>
  );
}
