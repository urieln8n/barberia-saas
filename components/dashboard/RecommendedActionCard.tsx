import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

type Variant = "gold" | "blue" | "green";

type Props = {
  title: string;
  description: string;
  cta: string;
  ctaHref: string;
  icon: LucideIcon;
  variant?: Variant;
};

const VARIANT_STYLES: Record<
  Variant,
  {
    wrapper: string;
    iconWrapper: string;
    iconColor: string;
    ctaClass: string;
  }
> = {
  gold: {
    wrapper:
      "border-[#D5A84C]/20 bg-gradient-to-br from-[#FDF8EE] to-white",
    iconWrapper: "border-[#D5A84C]/25 bg-[#D5A84C]/10",
    iconColor: "text-[#8A641F]",
    ctaClass:
      "bg-[#D5A84C] text-[#080A0F] hover:bg-[#c49a3d]",
  },
  blue: {
    wrapper:
      "border-blue-100 bg-gradient-to-br from-blue-50 to-white",
    iconWrapper: "border-blue-100 bg-blue-50",
    iconColor: "text-blue-700",
    ctaClass:
      "bg-blue-600 text-white hover:bg-blue-700",
  },
  green: {
    wrapper:
      "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    iconWrapper: "border-emerald-100 bg-emerald-50",
    iconColor: "text-emerald-700",
    ctaClass:
      "bg-emerald-600 text-white hover:bg-emerald-700",
  },
};

export function RecommendedActionCard({
  title,
  description,
  cta,
  ctaHref,
  icon: Icon,
  variant = "gold",
}: Props) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`flex flex-col gap-4 rounded-[20px] border p-5 shadow-sm transition-all duration-200 hover:shadow-md ${styles.wrapper}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${styles.iconWrapper}`}
        >
          <Icon size={18} className={styles.iconColor} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-[#080A0F] leading-snug">{title}</p>
          <p className="mt-1.5 text-sm leading-6 text-[#080A0F]/60">
            {description}
          </p>
        </div>
      </div>

      <Link
        href={ctaHref}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-colors active:scale-[0.98] ${styles.ctaClass}`}
      >
        {cta}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
