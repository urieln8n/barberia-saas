import { Check } from "lucide-react";

export function PricingCard({
  name,
  price,
  setup,
  features,
  highlighted = false
}: {
  name: string;
  price: string;
  setup: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div className={highlighted ? "rounded-3xl bg-ink p-6 text-white shadow-xl" : "rounded-3xl bg-white p-6 shadow-sm"}>
      <p className="text-lg font-bold">{name}</p>
      <p className="mt-4 text-4xl font-black">{price}</p>
      <p className={highlighted ? "mt-1 text-white/50" : "mt-1 text-neutral-500"}>{setup}</p>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm">
            <Check size={16} className="text-gold" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
