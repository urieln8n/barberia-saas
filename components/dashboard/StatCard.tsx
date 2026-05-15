import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title:      string;
  value:      string;
  hint:       string;
  icon?:      LucideIcon;
  iconBg?:    string;
  iconColor?: string;
  tone?: "default" | "dark" | "success" | "warning";
  kicker?: string;
  footer?: ReactNode;
};

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  iconBg    = "bg-[#C9922A]/10",
  iconColor = "text-[#C9922A]",
  tone = "default",
  kicker,
  footer,
}: Props) {
  const toneClass =
    tone === "dark"
      ? "border-[#111827] bg-[#080A0F] text-white shadow-[0_22px_70px_rgba(8,10,15,0.26)]"
      : tone === "success"
        ? "border-emerald-100 bg-[linear-gradient(180deg,#FFFFFF_0%,#F0FDF4_100%)]"
        : tone === "warning"
          ? "border-amber-100 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEB_100%)]"
          : "border-slate-200 bg-white";

  return (
    <div className={`group relative overflow-hidden rounded-[24px] border p-5 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] ${toneClass}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />
      <div className="flex items-start justify-between gap-3">
        <div>
          {kicker && (
            <p className={tone === "dark" ? "text-[10px] font-black uppercase text-[#D5A84C]" : "text-[10px] font-black uppercase text-[#C9922A]"}>
              {kicker}
            </p>
          )}
          <p className={tone === "dark" ? "text-[11px] font-bold uppercase text-white/45" : "text-[11px] font-bold uppercase text-slate-400"}>
            {title}
          </p>
        </div>
        {Icon && (
          <div className={`metric-icon ${tone === "dark" ? "bg-white/10" : iconBg}`}>
            <Icon size={15} className={iconColor} />
          </div>
        )}
      </div>
      <p className={tone === "dark" ? "mt-3 text-[clamp(1.8rem,2.8vw,2.55rem)] font-black leading-none text-white" : "mt-3 text-[clamp(1.8rem,2.8vw,2.55rem)] font-black leading-none text-[#111827]"}>
        {value}
      </p>
      <p className={tone === "dark" ? "mt-2 text-xs leading-5 text-white/55" : "mt-2 text-xs leading-5 text-slate-500"}>
        {hint}
      </p>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
