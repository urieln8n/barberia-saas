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
  const iconBg =
    tone === "success"
      ? "bg-emerald-50 border border-emerald-200/60 text-emerald-600"
      : "bg-[#D4AF37]/8 border border-[#D4AF37]/20 text-[#C9922A]";

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden
        rounded-[24px] border border-slate-200/80 bg-white px-8 py-12 text-center shadow-card
        ${className}`}
    >
      {/* Gold accent top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px]
        bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />

      {Icon && (
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.08),0_0_0_1px_rgba(15,23,42,0.04)] ${iconBg}`}>
          <Icon size={24} />
        </div>
      )}

      <p className="mt-5 text-lg font-black text-slate-900 tracking-tight">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
