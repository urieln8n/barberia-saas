import type { LucideIcon } from "lucide-react";
import { Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

type InsightCardProps = {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: "blue" | "gold" | "success" | "danger" | "dark";
  className?: string;
};

const toneClasses = {
  blue: "border-blue-100 bg-blue-50 text-blue-900",
  gold: "border-[#D5A84C]/25 bg-[#D5A84C]/10 text-[#5B4212]",
  success: "border-emerald-100 bg-emerald-50 text-emerald-900",
  danger: "border-red-100 bg-red-50 text-red-900",
  dark: "border-white/10 bg-white/[0.06] text-white",
};

const iconClasses = {
  blue: "bg-blue-500/10 text-blue-700",
  gold: "bg-[#D5A84C]/15 text-[#8A641F]",
  success: "bg-emerald-500/10 text-emerald-700",
  danger: "bg-red-500/10 text-red-700",
  dark: "bg-white/10 text-white",
};

export function InsightCard({
  title = "Insight inteligente",
  children,
  action,
  icon: Icon = Lightbulb,
  tone = "blue",
  className = "",
}: InsightCardProps) {
  return (
    <aside className={`rounded-[24px] border p-4 ${toneClasses[tone]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconClasses[tone]}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black">{title}</p>
          <div className="mt-1 text-sm leading-6 opacity-[0.78]">{children}</div>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </aside>
  );
}
