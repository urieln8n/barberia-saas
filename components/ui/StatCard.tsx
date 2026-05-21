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
      ? "border-white/10 bg-[#151D2E] text-white shadow-[0_22px_70px_rgba(5,10,20,0.26)]"
      : effectiveTone === "success"
        ? "border-emerald-200/70 bg-[linear-gradient(180deg,#F8F3EA_0%,#ECFDF5_100%)] shadow-[var(--shadow-warm)] hover:shadow-[var(--shadow-card)]"
        : effectiveTone === "warning"
          ? "border-amber-200/70 bg-[linear-gradient(180deg,#F8F3EA_0%,#FEF3C7_100%)] shadow-[var(--shadow-warm)] hover:shadow-[var(--shadow-card)]"
          : effectiveTone === "highlight"
            ? "border-[#D5CEBC] bg-[linear-gradient(180deg,#F8F3EA_0%,#EEF4FF_100%)] ring-1 ring-[#2563EB]/10 shadow-[var(--shadow-warm)] hover:shadow-[var(--shadow-card)]"
            : "border-amber-200/40 bg-[#F6F1E8] shadow-[var(--shadow-warm)] hover:border-amber-300/60 hover:shadow-[var(--shadow-card)]";

  const topLabel = label ?? title;
  const supportingText = hint ?? description;

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border p-5 transition-all duration-200 hover:-translate-y-0.5 md:p-6 ${containerClass} ${className}`}
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${isDark ? "via-white/25" : "via-[#D4AF66]/45"} to-transparent opacity-70`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          {kicker && (
            <p className={isDark ? "text-xs font-black uppercase text-[#D4AF66]" : "text-xs font-black uppercase text-[#B98B2F]"}>
              {kicker}
            </p>
          )}
          {topLabel && (
            <p className={isDark ? "text-xs font-bold uppercase text-slate-300" : "text-xs font-bold uppercase text-slate-600"}>
              {topLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`metric-icon ${isDark ? "bg-white/10" : iconBg}`}>
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>
      <p className={`mt-4 text-[clamp(2.25rem,5vw,3.25rem)] font-black leading-none ${isDark ? "text-white" : "text-slate-950"}`}>
        {value}
      </p>
      {(supportingText || trend) && (
        <div className={`mt-3 flex flex-wrap items-center gap-2 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          {supportingText && <span>{supportingText}</span>}
          {trend && <span className="font-bold text-emerald-700">{trend}</span>}
        </div>
      )}
      {footer && <div className="mt-4">{footer}</div>}
    </article>
  );
}
