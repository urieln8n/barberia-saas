import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  tone?: "default" | "dark" | "success";
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
  tone = "default",
}: EmptyStateProps) {
  const dark = tone === "dark";
  const iconClass =
    tone === "success"
      ? "metric-icon bg-emerald-500/10"
      : dark
        ? "metric-icon bg-white/10"
        : "metric-icon bg-[#C9922A]/10";

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed px-6 py-10 text-center ${
      dark
        ? "border-white/15 bg-white/[0.04] text-white"
        : "border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] text-slate-950 shadow-sm"
    } ${className}`}>
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D5A84C]/45 to-transparent" />
      {Icon && (
        <div className={iconClass}>
          <Icon size={22} className={tone === "success" ? "text-emerald-600" : dark ? "text-white" : "text-[#C9922A]"} />
        </div>
      )}
      <p className={dark ? "mt-4 font-bold text-white" : "mt-4 font-bold text-slate-800"}>{title}</p>
      <p className={dark ? "mt-1 max-w-md text-sm leading-6 text-white/55" : "mt-1 max-w-md text-sm leading-6 text-slate-500"}>
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
