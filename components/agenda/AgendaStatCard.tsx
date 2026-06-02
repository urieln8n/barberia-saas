import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  accent?: "gold" | "green" | "blue" | "red" | "slate";
  trend?: "up" | "down" | "neutral";
};

const ICON_ACCENTS = {
  gold:  "border-[#D4AF37]/25 bg-[#D4AF37]/[0.10] text-[#D4AF37]",
  green: "border-emerald-200 bg-emerald-50 text-emerald-600",
  blue:  "border-blue-200 bg-blue-50 text-blue-600",
  red:   "border-red-200 bg-red-50 text-red-500",
  slate: "border-slate-200 bg-slate-100 text-slate-500",
};

const VALUE_ACCENTS = {
  gold:  "text-[#C9922A]",
  green: "text-emerald-600",
  blue:  "text-blue-600",
  red:   "text-red-500",
  slate: "text-slate-900",
};

export function AgendaStatCard({ label, value, description, icon: Icon, accent = "slate" }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className={`mt-2 text-3xl font-black tracking-tight tabular-nums ${VALUE_ACCENTS[accent]}`}>
            {value}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${ICON_ACCENTS[accent]}`}>
          <Icon size={17} />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}
