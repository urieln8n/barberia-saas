import { CheckCircle2, Sparkles } from "lucide-react";

type PricingCardProps = {
  name: string;
  price: string;
  setup: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
};

export function PricingCard({
  name,
  price,
  setup,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={[
        "relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-7 transition-all duration-200",
        highlighted
          ? "border-[#2F6FEB]/25 bg-[linear-gradient(180deg,rgba(47,111,235,0.04),rgba(255,255,255,1))] text-neutral-950 shadow-xl shadow-[#2F6FEB]/10 ring-1 ring-[#2F6FEB]/10 lg:-translate-y-2"
          : "border-[#E5E7EB] bg-white text-neutral-950 shadow-sm hover:-translate-y-1 hover:border-[#C9D4E3] hover:shadow-lg",
      ].join(" ")}
    >
      {highlighted && (
        <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#2F6FEB] px-3 py-1 text-xs font-black text-white shadow-sm">
          <Sparkles size={14} />
          Más recomendado
        </div>
      )}

      <div>
        <h3 className="text-2xl font-black tracking-tight text-slate-950">{name}</h3>

        {description && (
          <p
            className={[
              "mt-3 min-h-[56px] text-sm leading-6 text-slate-600",
            ].join(" ")}
          >
            {description}
          </p>
        )}

        <div className="mt-7">
          <p className="font-mono text-4xl font-black tracking-tight text-slate-950">
            {price}
          </p>
          <p className="mt-2 text-sm font-semibold text-[#2F6FEB]">
            {setup}
          </p>
        </div>
      </div>

      <div
        className={[
          "my-7 h-px",
          highlighted ? "bg-[#DDE7FB]" : "bg-neutral-200",
        ].join(" ")}
      />

      <ul className="flex flex-1 flex-col gap-4">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-[#2F6FEB]"
            />
            <span className="text-sm leading-6 text-slate-700">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href="#contacto"
        className={[
          "mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-black transition",
          highlighted
            ? "bg-[#2F6FEB] text-white hover:bg-[#2459bd] hover:shadow-md"
            : "bg-[#111827] text-white hover:bg-[#0F172A] hover:shadow-md",
        ].join(" ")}
      >
        Quiero este plan
      </a>
    </div>
  );
}
