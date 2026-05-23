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
  const iconClass =
    tone === "success"
      ? "metric-icon bg-emerald-500/10"
      : "metric-icon bg-[#C9922A]/10";

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center shadow-sm ${className}`}>
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C9922A]/30 to-transparent" />
      {Icon && (
        <div className={iconClass}>
          <Icon size={22} className={tone === "success" ? "text-emerald-600" : "text-[#C9922A]"} />
        </div>
      )}
      <p className="mt-4 text-xl font-black text-slate-900">{title}</p>
      <p className="mt-2 max-w-md text-base leading-7 text-slate-600">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
