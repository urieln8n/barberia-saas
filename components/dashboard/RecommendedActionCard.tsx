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
    titleColor: string;
    descColor: string;
    ctaClass: string;
  }
> = {
  gold: {
    wrapper:
      "border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/[0.07] to-[#D4AF37]/[0.02] backdrop-blur-sm",
    iconWrapper: "border-[#D4AF37]/25 bg-[#D4AF37]/[0.12]",
    iconColor: "text-[#D4AF37]",
    titleColor: "text-white",
    descColor: "text-white/50",
    ctaClass:
      "bg-[#D4AF37] text-[#09090B] hover:bg-[#F5D060] shadow-[0_4px_14px_rgba(212,175,55,0.30)]",
  },
  blue: {
    wrapper:
      "border-blue-500/20 bg-gradient-to-br from-blue-500/[0.07] to-blue-500/[0.02] backdrop-blur-sm",
    iconWrapper: "border-blue-500/25 bg-blue-500/[0.12]",
    iconColor: "text-blue-400",
    titleColor: "text-white",
    descColor: "text-white/50",
    ctaClass:
      "bg-blue-600 text-white hover:bg-blue-500",
  },
  green: {
    wrapper:
      "border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.07] to-emerald-500/[0.02] backdrop-blur-sm",
    iconWrapper: "border-emerald-500/25 bg-emerald-500/[0.12]",
    iconColor: "text-emerald-400",
    titleColor: "text-white",
    descColor: "text-white/50",
    ctaClass:
      "bg-emerald-600 text-white hover:bg-emerald-500",
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
          <p className={`font-black leading-snug ${styles.titleColor}`}>{title}</p>
          <p className={`mt-1.5 text-sm leading-6 ${styles.descColor}`}>
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
