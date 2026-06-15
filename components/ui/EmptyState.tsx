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
  const isDark = tone === "dark";
  const iconBg =
    tone === "success"
      ? "bg-emerald-50 border border-emerald-200/60 text-emerald-600"
      : isDark
        ? "border border-[#D4AF37]/25 bg-[#D4AF37]/[0.12] text-[#D4AF37]"
        : "bg-[#D4AF37]/8 border border-[#D4AF37]/20 text-[#C9922A]";

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden
        rounded-[24px] px-8 py-12 text-center
        ${isDark
          ? "border border-[#2A2A38] bg-[#0E0E14]"
          : "border border-slate-200/80 bg-white shadow-card"
        }
        ${className}`}
    >
      {/* Gold accent top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px]
        bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />

      {Icon && (
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon size={24} />
        </div>
      )}

      <p className={`mt-5 text-lg font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{title}</p>
      <p className={`mt-2 max-w-sm text-sm leading-6 ${isDark ? "text-white/45" : "text-slate-500"}`}>
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
