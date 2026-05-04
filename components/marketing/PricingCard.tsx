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
        "relative flex h-full flex-col rounded-3xl border p-7 transition",
        highlighted
          ? "border-amber-400 bg-neutral-950 text-white shadow-2xl shadow-amber-500/20 lg:-translate-y-4"
          : "border-neutral-200 bg-white text-neutral-950 shadow-sm hover:-translate-y-1 hover:shadow-xl",
      ].join(" ")}
    >
      {highlighted && (
        <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-neutral-950">
          <Sparkles size={14} />
          Más vendido
        </div>
      )}

      <div>
        <h3 className="text-2xl font-black">{name}</h3>

        {description && (
          <p
            className={[
              "mt-3 min-h-[56px] text-sm leading-6",
              highlighted ? "text-white/60" : "text-neutral-600",
            ].join(" ")}
          >
            {description}
          </p>
        )}

        <div className="mt-7">
          <p className="text-4xl font-black tracking-tight">{price}</p>
          <p
            className={[
              "mt-2 text-sm font-semibold",
              highlighted ? "text-amber-300" : "text-amber-700",
            ].join(" ")}
          >
            {setup}
          </p>
        </div>
      </div>

      <div
        className={[
          "my-7 h-px",
          highlighted ? "bg-white/10" : "bg-neutral-200",
        ].join(" ")}
      />

      <ul className="flex flex-1 flex-col gap-4">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <CheckCircle2
              size={20}
              className={highlighted ? "text-amber-300" : "text-emerald-600"}
            />
            <span
              className={[
                "text-sm leading-6",
                highlighted ? "text-white/80" : "text-neutral-700",
              ].join(" ")}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href="#contacto"
        className={[
          "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-black transition",
          highlighted
            ? "bg-amber-400 text-neutral-950 hover:bg-amber-300"
            : "bg-neutral-950 text-white hover:bg-neutral-800",
        ].join(" ")}
      >
        Quiero este plan
      </a>
    </div>
  );
}