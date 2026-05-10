import { CheckCircle2, Gauge, MinusCircle } from "lucide-react";

export type GrowthScoreFactor = {
  label: string;
  done: boolean;
  hint: string;
};

type GrowthScoreCardProps = {
  score: number;
  factors: GrowthScoreFactor[];
};

export function GrowthScoreCard({ score, factors }: GrowthScoreCardProps) {
  return (
    <section className="section-band-dark p-5 md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-black text-[#D9B766]">
            <Gauge size={14} />
            Barbería Growth Score
          </div>
          <h2 className="mt-3 text-3xl font-black text-white">{score}/100</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Indicador orientativo de qué tan preparada está tu barbería para captar reservas, controlar clientes y reducir huecos vacíos.
          </p>
        </div>
        <div className="h-24 w-24 shrink-0 rounded-full border-[10px] border-[#D9B766] bg-white/[0.06] text-center">
          <div className="flex h-full items-center justify-center text-2xl font-black text-white">{score}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-2 md:grid-cols-2">
        {factors.map((factor) => (
          <div key={factor.label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
            <div className="flex items-start gap-3">
              {factor.done ? (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" />
              ) : (
                <MinusCircle size={18} className="mt-0.5 shrink-0 text-white/35" />
              )}
              <div>
                <p className="text-sm font-black text-white">{factor.label}</p>
                <p className="mt-1 text-xs leading-5 text-white/50">{factor.hint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
