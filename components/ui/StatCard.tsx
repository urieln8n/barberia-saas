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
  variant?: "default" | "dark" | "highlight";
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
      ? "border-[#111827] bg-[#080A0F] text-white shadow-[0_22px_70px_rgba(8,10,15,0.26)]"
      : effectiveTone === "success"
        ? "border-emerald-100 bg-[linear-gradient(180deg,#FFFFFF_0%,#F0FDF4_100%)] shadow-[var(--shadow-warm)] hover:shadow-[var(--shadow-card)]"
        : effectiveTone === "warning"
          ? "border-amber-100 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEB_100%)] shadow-[var(--shadow-warm)] hover:shadow-[var(--shadow-card)]"
          : effectiveTone === "highlight"
            ? "border-[#E7E2D8] bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F7FF_100%)] ring-1 ring-[#2563EB]/10 shadow-[var(--shadow-warm)] hover:shadow-[var(--shadow-card)]"
            : "border-slate-200/80 bg-white/95 shadow-[var(--shadow-warm)] hover:border-slate-300 hover:shadow-[var(--shadow-card)]";

  const topLabel = label ?? title;
  const supportingText = hint ?? description;

  return (
    <article
      className={`group relative overflow-hidden rounded-[22px] border p-5 transition-all duration-200 hover:-translate-y-0.5 ${containerClass} ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />
      <div className="flex items-start justify-between gap-3">
        <div>
          {kicker && (
            <p className={isDark ? "text-[10px] font-black uppercase text-[#D5A84C]" : "text-[10px] font-black uppercase text-[#C9922A]"}>
              {kicker}
            </p>
          )}
          {topLabel && (
            <p className={isDark ? "text-[11px] font-bold uppercase text-white/45" : "text-[11px] font-bold uppercase text-slate-400"}>
              {topLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`metric-icon ${isDark ? "bg-white/10" : iconBg}`}>
            <Icon size={15} className={iconColor} />
          </div>
        )}
      </div>
      <p className={`mt-3 text-[clamp(1.8rem,2.8vw,2.55rem)] font-black leading-none ${isDark ? "text-white" : "text-[#111827]"}`}>
        {value}
      </p>
      {(supportingText || trend) && (
        <div className={`mt-2 flex flex-wrap items-center gap-2 text-xs leading-5 ${isDark ? "text-white/55" : "text-slate-500"}`}>
          {supportingText && <span>{supportingText}</span>}
          {trend && <span className="font-bold text-emerald-700">{trend}</span>}
        </div>
      )}
      {footer && <div className="mt-4">{footer}</div>}
    </article>
  );
}
