import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  accent?: "gold" | "green" | "blue" | "red" | "slate";
};

const ACCENTS = {
  gold: "border-[#D5A84C]/25 bg-[#D5A84C]/10 text-[#8A641F]",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
  slate: "border-slate-200 bg-slate-100 text-slate-700",
};

export function AgendaStatCard({ label, value, description, icon: Icon, accent = "slate" }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${ACCENTS[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">{description}</p>
    </article>
  );
}
