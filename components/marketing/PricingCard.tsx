import { CheckCircle2, Sparkles } from "lucide-react";

type FeatureStatus = "Incluido" | "MVP" | "Próximamente" | "Growth" | "Premium";

type PricingFeature =
  | string
  | {
      label: string;
      status?: FeatureStatus;
    };

type PricingCardProps = {
  name: string;
  price: string;
  setup?: string;
  eyebrow?: string;
  badge?: string;
  cta?: string;
  note?: string;
  description?: string;
  features: PricingFeature[];
  highlighted?: boolean;
};

export function PricingCard({
  name,
  price,
  setup,
  eyebrow,
  badge,
  cta = "Quiero este plan",
  note,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  const statusClass: Record<FeatureStatus, string> = {
    Incluido: "border-emerald-200 bg-emerald-50 text-emerald-700",
    MVP: "border-[#2F6FEB]/20 bg-[#2F6FEB]/10 text-[#2459bd]",
    Próximamente: "border-amber-200 bg-amber-50 text-amber-700",
    Growth: "border-sky-200 bg-sky-50 text-sky-700",
    Premium: "border-slate-300 bg-slate-100 text-slate-700",
  };

  return (
    <div
      className={[
        "relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border p-6 transition-all duration-200",
        highlighted
          ? "border-[#2F6FEB]/30 bg-[linear-gradient(180deg,rgba(47,111,235,0.06),rgba(255,255,255,1))] text-neutral-950 shadow-xl shadow-[#2F6FEB]/10 ring-1 ring-[#2F6FEB]/15 lg:-translate-y-2"
          : "border-[#E5E7EB] bg-white text-neutral-950 shadow-sm hover:-translate-y-1 hover:border-[#C9D4E3] hover:shadow-lg",
      ].join(" ")}
    >
      {(badge || highlighted) && (
        <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#2F6FEB] px-3 py-1 text-xs font-black text-white shadow-sm">
          <Sparkles size={14} />
          {badge ?? "Más recomendado"}
        </div>
      )}

      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#2F6FEB]">
            {eyebrow}
          </p>
        )}
        <h3 className="text-2xl font-black tracking-tight text-slate-950">{name}</h3>

        {description && (
          <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
            {description}
          </p>
        )}

        <div className="mt-6">
          <p className="font-mono text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            {price}
          </p>
          {setup && (
            <p className="mt-2 text-sm font-semibold text-[#2F6FEB]">
              {setup}
            </p>
          )}
        </div>
      </div>

      <div
        className={[
          "my-7 h-px",
          highlighted ? "bg-[#DDE7FB]" : "bg-neutral-200",
        ].join(" ")}
      />

      <ul className="flex flex-1 flex-col gap-4">
        {features.map((feature) => {
          const label = typeof feature === "string" ? feature : feature.label;
          const status = typeof feature === "string" ? "Incluido" : feature.status ?? "Incluido";

          return (
          <li key={label} className="flex gap-3">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-[#2F6FEB]"
            />
            <span className="min-w-0 text-sm leading-6 text-slate-700">
              {label}
              <span className={`ml-2 inline-flex rounded-full border px-2 py-0.5 align-middle text-[10px] font-black uppercase tracking-wide ${statusClass[status]}`}>
                {status}
              </span>
            </span>
          </li>
          );
        })}
      </ul>

      {note && (
        <p className="mt-6 rounded-2xl border border-[#DDE7FB] bg-[#F8FAFC] px-4 py-3 text-xs font-semibold leading-5 text-slate-600">
          {note}
        </p>
      )}

      <a
        href="#contacto"
        className={[
          "mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-black transition",
          highlighted
            ? "bg-[#2F6FEB] text-white hover:bg-[#2459bd] hover:shadow-md"
            : "bg-[#111827] text-white hover:bg-[#0F172A] hover:shadow-md",
        ].join(" ")}
      >
        {cta}
      </a>
    </div>
  );
}
