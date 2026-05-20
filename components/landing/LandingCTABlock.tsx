import { ArrowRight, MessageCircle } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type LandingCTABlockProps = {
  primaryHref: string;
  primaryLabel?: string;
  secondaryHref: string;
  secondaryLabel?: string;
  className?: string;
};

export function LandingCTABlock({
  primaryHref,
  primaryLabel = "Pedir demo por WhatsApp",
  secondaryHref,
  secondaryLabel = "Ver demo interactiva",
  className = "",
}: LandingCTABlockProps) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <PrimaryButton href={primaryHref} variant="premiumBlue" className="min-h-12 px-7">
        {primaryLabel} <MessageCircle size={17} />
      </PrimaryButton>
      <PrimaryButton
        href={secondaryHref}
        variant="ghost"
        className="premium-cta-glass min-h-12 px-7 hover:bg-white/[0.12] hover:text-white"
      >
        {secondaryLabel} <ArrowRight size={17} />
      </PrimaryButton>
    </div>
  );
}
