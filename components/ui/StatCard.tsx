import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatCardProps = {
  kicker?: string;
  label?: string;
  title?: string;
  value: string | number;
  description?: ReactNode;
  hint?: ReactNode;
  trend?: ReactNode;
  footer?: ReactNode;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  tone?: "default" | "dark" | "success" | "warning";
  variant?: "default" | "dark" | "premium" | "highlight";
  className?: string;
};

export function StatCard({
  kicker,
  label,
  title,
  value,
  description,
  hint,
  trend,
  footer,
  icon: Icon,
  iconBg = "bg-[#C9922A]/10",
  iconColor = "text-[#C9922A]",
  tone,
  variant = "default",
  className = "",
}: StatCardProps) {
  const effectiveTone =
    tone ?? (variant === "dark" ? "dark" : variant === "highlight" ? "highlight" : "default");
  const isDark = effectiveTone === "dark";

  const containerClass =
    effectiveTone === "dark"
      ? "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:shadow-md"
      : effectiveTone === "success"
        ? "border-emerald-200/70 bg-white shadow-sm hover:shadow-md"
        : effectiveTone === "warning"
          ? "border-amber-200/70 bg-white shadow-sm hover:shadow-md"
          : effectiveTone === "highlight"
            ? "border-[#2563EB]/20 bg-white ring-1 ring-[#2563EB]/10 shadow-sm hover:shadow-md"
            : "border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md";

  const topLabel = label ?? title;
  const supportingText = hint ?? description;

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border p-5 transition-all duration-200 hover:-translate-y-0.5 md:p-6 ${containerClass} ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9922A]/30 to-transparent opacity-70" />
      <div className="flex items-start justify-between gap-3">
        <div>
          {kicker && (
            <p className="text-xs font-black uppercase text-[#C9922A]">
              {kicker}
            </p>
          )}
          {topLabel && (
            <p className="text-xs font-bold uppercase text-slate-500">
              {topLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`metric-icon ${iconBg}`}>
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>
      <p className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-none text-slate-900">
        {value}
      </p>
      {(supportingText || trend) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm leading-6 text-slate-600">
          {supportingText && <span>{supportingText}</span>}
          {trend && <span className="font-bold text-emerald-700">{trend}</span>}
        </div>
      )}
      {footer && <div className="mt-4">{footer}</div>}
    </article>
  );
}
