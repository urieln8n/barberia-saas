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
  tone?: "default" | "dark" | "success" | "warning" | "gold";
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

  const containerClass =
    effectiveTone === "success"
      ? "border-emerald-500/40 bg-[#152A20] hover:border-emerald-500/60 hover:bg-[#1C3228]"
      : effectiveTone === "warning"
        ? "border-amber-500/40 bg-[#2E1E08] hover:border-amber-500/60 hover:bg-[#38240A]"
        : effectiveTone === "gold"
          ? "border-[#D4AF37]/40 bg-[#281A08] hover:border-[#D4AF37]/60 hover:bg-[#30200A]"
          : effectiveTone === "highlight"
            ? "border-[#2563EB]/40 bg-[#101838] hover:border-[#2563EB]/60 hover:bg-[#141E44]"
            : "border-[#2A2A38] bg-[#1D1D2C] hover:border-[#36364A] hover:bg-[#22222E]";

  const topLabel = label ?? title;
  const supportingText = hint ?? description;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border p-5 shadow-card
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover
        md:p-6 ${containerClass} ${className}`}
    >
      {/* Gold accent line at top — se intensifica en hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px]
        bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent opacity-60
        transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {kicker && (
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#C9922A]">
              {kicker}
            </p>
          )}
          {topLabel && (
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
              {topLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl
            shadow-[0_1px_3px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.04)]
            transition-transform duration-200 group-hover:scale-105 ${iconBg}`}>
            <Icon size={19} className={iconColor} />
          </div>
        )}
      </div>

      {/* El número — el protagonista visual */}
      <p
        className="mt-4 font-display leading-none text-white/90"
        style={{
          fontSize: "clamp(2.25rem,5vw,3rem)",
          fontWeight: 900,
          letterSpacing: "-0.035em",
          fontVariantNumeric: "tabular-nums lining-nums",
          fontFeatureSettings: '"tnum","lnum","cv11","ss01"',
        }}
      >
        {value}
      </p>

      {(supportingText || trend) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs leading-5 text-white/50">
          {supportingText && <span>{supportingText}</span>}
          {trend && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-[10px] font-black text-emerald-300">
              {trend}
            </span>
          )}
        </div>
      )}

      {footer && (
        <div className="mt-4 border-t border-white/[0.07] pt-3 [&_a]:inline-flex [&_a]:items-center [&_a]:gap-1 [&_a]:rounded-lg [&_a]:px-2.5 [&_a]:py-1.5 [&_a]:text-xs [&_a]:font-black [&_a]:text-white/50 [&_a]:transition [&_a:hover]:bg-white/[0.06] [&_a:hover]:text-white/85">
          {footer}
        </div>
      )}
    </article>
  );
}
