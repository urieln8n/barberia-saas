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
        ? "border-white/25 bg-white/[0.08] text-white"
        : "border-amber-200/40 bg-[linear-gradient(180deg,#F8F3EA_0%,#F3EDE1_100%)] text-slate-950 shadow-[var(--shadow-soft)]"
    } ${className}`}>
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#D5A84C]/45 to-transparent" />
      {Icon && (
        <div className={iconClass}>
          <Icon size={22} className={tone === "success" ? "text-emerald-600" : dark ? "text-white" : "text-[#C9922A]"} />
        </div>
      )}
      <p className={dark ? "mt-4 text-xl font-black text-white" : "mt-4 text-xl font-black text-slate-950"}>{title}</p>
      <p className={dark ? "mt-2 max-w-md text-base leading-7 text-slate-300" : "mt-2 max-w-md text-base leading-7 text-slate-600"}>
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
