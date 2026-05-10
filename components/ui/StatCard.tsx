import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatCardProps = {
  label?: string;
  title?: string;
  value: string | number;
  description?: ReactNode;
  hint?: ReactNode;
  trend?: ReactNode;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  variant?: "default" | "dark" | "highlight";
  className?: string;
};

export function StatCard({
  label,
  title,
  value,
  description,
  hint,
  trend,
  icon: Icon,
  iconBg = "bg-[#2563EB]/10",
  iconColor = "text-[#2563EB]",
  variant = "default",
  className = "",
}: StatCardProps) {
  const textLabel = label ?? title;
  const supportingText = description ?? hint;
  const wrapperClass =
    variant === "dark"
      ? "metric-card premium-dark"
      : variant === "highlight"
        ? "metric-card bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F7FF_100%)] ring-1 ring-[#2563EB]/10"
        : "metric-card";

  return (
    <article className={`${wrapperClass} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        {textLabel && (
          <p className={variant === "dark" ? "text-[11px] font-bold uppercase text-white/40" : "text-[11px] font-bold uppercase text-slate-400"}>
            {textLabel}
          </p>
        )}
        {Icon && (
          <div className={`metric-icon ${iconBg}`}>
            <Icon size={15} className={iconColor} />
          </div>
        )}
      </div>
      <p className={variant === "dark" ? "mt-3 text-[clamp(1.8rem,2.8vw,2.6rem)] font-black leading-none text-white" : "mt-3 text-[clamp(1.8rem,2.8vw,2.6rem)] font-black leading-none tracking-normal text-[#080A0F]"}>
        {value}
      </p>
      {(supportingText || trend) && (
        <div className={variant === "dark" ? "mt-2 flex flex-wrap items-center gap-2 text-xs leading-5 text-white/55" : "mt-2 flex flex-wrap items-center gap-2 text-xs leading-5 text-slate-500"}>
          {supportingText && <span>{supportingText}</span>}
          {trend && <span className="font-bold text-emerald-700">{trend}</span>}
        </div>
      )}
    </article>
  );
}
