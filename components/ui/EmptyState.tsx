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
    <div className={`flex flex-col items-center justify-center rounded-[24px] border border-dashed px-6 py-10 text-center ${
      dark
        ? "border-white/15 bg-white/[0.04] text-white"
        : "border-[#D5CEBC] bg-[#FAF8F4] text-slate-950"
    } ${className}`}>
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
