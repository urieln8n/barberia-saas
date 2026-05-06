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
  iconBg    = "bg-[#C89B3C]/10",
  iconColor = "text-[#C89B3C]",
}: Props) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {title}
        </p>
        {Icon && (
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon size={15} className={iconColor} />
          </div>
        )}
      </div>
      <p className="mt-3 text-4xl font-black text-[#0D0D0D]">{value}</p>
      <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>
    </div>
  );
}
