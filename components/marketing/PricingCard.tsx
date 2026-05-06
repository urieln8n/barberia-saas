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
          ? "border-[#C89B3C] bg-[#1A1A1A] text-white shadow-2xl shadow-[#C89B3C]/20 lg:-translate-y-4"
          : "border-neutral-200 bg-white text-neutral-950 shadow-sm hover:-translate-y-1 hover:shadow-xl",
      ].join(" ")}
    >
      {highlighted && (
        <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-3 py-1 text-xs font-black text-[#0D0D0D]">
          <Sparkles size={14} />
          Más recomendado
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
              highlighted ? "text-[#C89B3C]" : "text-[#C89B3C]",
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
              className={highlighted ? "text-[#C89B3C]" : "text-emerald-600"}
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
            ? "bg-[#00C2A8] text-[#0D0D0D] hover:bg-[#009e88]"
            : "bg-[#0D0D0D] text-white hover:bg-[#1A1A1A]",
        ].join(" ")}
      >
        Quiero este plan
      </a>
    </div>
  );
}