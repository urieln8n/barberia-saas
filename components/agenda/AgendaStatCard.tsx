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
  gold: "border-[#D4AF37]/25 bg-[#D4AF37]/[0.10] text-[#D4AF37]",
  green: "border-[#22C55E]/25 bg-[#22C55E]/[0.10] text-[#22C55E]",
  blue: "border-[#3B82F6]/25 bg-[#3B82F6]/[0.10] text-[#3B82F6]",
  red: "border-[#EF4444]/25 bg-[#EF4444]/[0.10] text-[#EF4444]",
  slate: "border-[#333] bg-[#1a1a1a] text-[#888]",
};

const VALUE_ACCENTS = {
  gold: "text-[#D4AF37]",
  green: "text-[#22C55E]",
  blue: "text-[#3B82F6]",
  red: "text-[#EF4444]",
  slate: "text-white",
};

export function AgendaStatCard({ label, value, description, icon: Icon, accent = "slate" }: Props) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#111111] p-5 transition-colors hover:border-[#333] hover:bg-[#141414]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#666]">{label}</p>
          <p className={`mt-2 text-3xl font-black tracking-tight ${VALUE_ACCENTS[accent]}`}>
            {value}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${ICON_ACCENTS[accent]}`}>
          <Icon size={17} />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#666]">{description}</p>
    </article>
  );
}
