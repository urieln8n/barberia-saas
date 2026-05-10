import type { LucideIcon } from "lucide-react";

type Props = {
  title:      string;
  value:      string;
  hint:       string;
  icon?:      LucideIcon;
  iconBg?:    string;
  iconColor?: string;
};

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  iconBg    = "bg-[#2F6FEB]/10",
  iconColor = "text-[#2F6FEB]",
}: Props) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
          {title}
        </p>
        {Icon && (
          <div className={`metric-icon ${iconBg}`}>
            <Icon size={15} className={iconColor} />
          </div>
        )}
      </div>
      <p className="mt-3 text-[clamp(1.8rem,2.8vw,2.6rem)] font-black leading-none tracking-tight text-[#111827]">{value}</p>
      <p className="mt-2 text-xs leading-5 text-neutral-500">{hint}</p>
    </div>
  );
}
