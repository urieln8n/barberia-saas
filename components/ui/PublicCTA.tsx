import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type PublicCTAProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  children?: ReactNode;
  variant?: "light" | "dark";
  className?: string;
};

export function PublicCTA({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  children,
  variant = "light",
  className = "",
}: PublicCTAProps) {
  const dark = variant === "dark";

  return (
    <section className={`${dark ? "section-band-dark" : "section-band bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F7FF_100%)]"} px-5 py-8 md:px-8 md:py-10 ${className}`}>
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          {eyebrow && (
            <p className={dark ? "text-[11px] font-black uppercase text-[#D5A84C]" : "label-section"}>
              {eyebrow}
            </p>
          )}
          <h2 className={dark ? "mt-2 text-3xl font-black leading-tight text-white md:text-5xl" : "mt-2 text-3xl font-black leading-tight text-[#080A0F] md:text-5xl"}>
            {title}
          </h2>
          {description && (
            <p className={dark ? "mt-4 max-w-2xl text-base leading-8 text-white/60" : "mt-4 max-w-2xl text-base leading-8 text-slate-500"}>
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <Link href={primaryHref} className={dark ? "btn-gold" : "btn-primary"}>
            {primaryLabel}
            <ArrowRight size={17} />
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref} className={dark ? "btn-outline border-white/15 bg-white/[0.06] text-white hover:bg-white/10 hover:text-white" : "btn-outline"}>
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
