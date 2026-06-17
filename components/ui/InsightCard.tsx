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
  blue: "border-violet-500/25 bg-violet-500/[0.08] text-violet-300",
  gold: "border-[#D4AF37]/25 bg-[#D4AF37]/[0.08] text-[#D4AF37]",
  success: "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300",
  danger: "border-red-500/25 bg-red-500/[0.08] text-red-300",
  dark: "border-white/[0.10] bg-white/[0.06] text-white",
};

const iconClasses = {
  blue: "bg-violet-500/[0.12] text-violet-400",
  gold: "bg-[#D4AF37]/[0.12] text-[#D4AF37]",
  success: "bg-emerald-500/[0.12] text-emerald-400",
  danger: "bg-red-500/[0.12] text-red-400",
  dark: "bg-white/[0.10] text-white",
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
