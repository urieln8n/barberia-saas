import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type StatCardProps = {
  label?: string;
  title?: string;
  value: string | number;
  description?: ReactNode;
  hint?: ReactNode;
  trend?: ReactNode;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
};

export function StatCard({
  label,
  title,
  value,
  description,
  hint,
  trend,
  icon: Icon,
  iconBg = "bg-[#2563EB]/10",
  iconColor = "text-[#2563EB]",
}: StatCardProps) {
  const textLabel = label ?? title;
  const supportingText = description ?? hint;

  return (
    <article className="metric-card">
      <div className="flex items-start justify-between gap-3">
        {textLabel && (
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            {textLabel}
          </p>
        )}
        {Icon && (
          <div className={`metric-icon ${iconBg}`}>
            <Icon size={15} className={iconColor} />
          </div>
        )}
      </div>
      <p className="mt-3 text-[clamp(1.8rem,2.8vw,2.6rem)] font-black leading-none tracking-normal text-[#111827]">
        {value}
      </p>
      {(supportingText || trend) && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs leading-5 text-neutral-500">
          {supportingText && <span>{supportingText}</span>}
          {trend && <span className="font-bold text-emerald-700">{trend}</span>}
        </div>
      )}
    </article>
  );
}
