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
  green: "border-emerald-500/25 bg-emerald-500/[0.10] text-emerald-400",
  blue:  "border-violet-500/25 bg-violet-500/[0.10] text-violet-400",
  red:   "border-red-500/25 bg-red-500/[0.10] text-red-400",
  slate: "border-white/[0.10] bg-white/[0.06] text-white/50",
};

const VALUE_ACCENTS = {
  gold:  "text-[#D4AF37]",
  green: "text-emerald-400",
  blue:  "text-violet-400",
  red:   "text-red-400",
  slate: "text-white",
};

export function AgendaStatCard({ label, value, description, icon: Icon, accent = "slate" }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-5 transition hover:border-white/[0.12]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">{label}</p>
          <p className={`mt-2 text-3xl font-black tracking-tight tabular-nums ${VALUE_ACCENTS[accent]}`}>
            {value}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${ICON_ACCENTS[accent]}`}>
          <Icon size={17} />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-white/40">{description}</p>
    </article>
  );
}
