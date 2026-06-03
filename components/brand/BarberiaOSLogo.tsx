"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export type LogoVariant = "full" | "icon" | "sidebar" | "isotipo" | "horizontal" | "small" | "favicon";
export type LogoSize = "sm" | "md" | "lg";
export type LogoTone = "light" | "dark";

type Props = {
  variant?: LogoVariant;
  size?: LogoSize | number;
  showText?: boolean;
  tone?: LogoTone;
  className?: string;
};

const MARK_SIZE: Record<LogoSize, number> = {
  sm: 28,
  md: 38,
  lg: 48,
};

const TEXT_SIZE: Record<LogoSize, string> = {
  sm: "text-[13px]",
  md: "text-[16px]",
  lg: "text-[20px]",
};

function normalizeVariant(variant: LogoVariant): "full" | "icon" | "sidebar" {
  if (variant === "horizontal" || variant === "small") return "full";
  if (variant === "isotipo" || variant === "favicon") return "icon";
  return variant;
}

function normalizeSize(size: LogoSize | number | undefined, variant: "full" | "icon" | "sidebar") {
  if (typeof size === "number") return { px: size, token: "md" as LogoSize };
  if (size) return { px: MARK_SIZE[size], token: size };
  if (variant === "sidebar") return { px: 34, token: "md" as LogoSize };
  if (variant === "full") return { px: 40, token: "md" as LogoSize };
  return { px: 38, token: "md" as LogoSize };
}

function PremiumBMark({ px, uid }: { px: number; uid: string }) {
  const gold = `barberia-gold-${uid}`;
  const goldDark = `barberia-gold-dark-${uid}`;
  const shine = `barberia-shine-${uid}`;
  const shadow = `barberia-shadow-${uid}`;

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[#E8DDBF] bg-[#FFFEFB] shadow-[0_10px_24px_rgba(17,17,17,0.12),0_1px_0_rgba(255,255,255,0.92)_inset]"
      style={{
        width: px,
        height: px,
        borderRadius: Math.max(12, Math.round(px * 0.34)),
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width={Math.round(px * 0.68)}
        height={Math.round(px * 0.68)}
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        className="block"
      >
        <defs>
          <linearGradient id={gold} x1="20%" y1="10%" x2="78%" y2="88%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="34%" stopColor="#F5D76E" />
            <stop offset="62%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#8F6508" />
          </linearGradient>
          <linearGradient id={goldDark} x1="25%" y1="0%" x2="75%" y2="100%">
            <stop offset="0%" stopColor="#FFF0A8" />
            <stop offset="42%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#8A5F08" />
          </linearGradient>
          <linearGradient id={shine} x1="12%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.78" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id={shadow} x="-18%" y="-14%" width="136%" height="132%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#111111" floodOpacity="0.22" />
          </filter>
        </defs>

        <path
          d="M31 16H51.5C65.5 16 74.4 23.2 74.4 34.2C74.4 42 70.2 47.5 63.9 50C72.8 52.2 78.5 59.5 78.5 69.2C78.5 82.1 68.6 90 52.2 90H31V16ZM48.7 45.2C57.4 45.2 62.2 41.3 62.2 34.8C62.2 28.7 57.5 25.2 49.4 25.2H42.7V45.2H48.7ZM51.5 80.5C61.4 80.5 66.8 76.1 66.8 68.6C66.8 61.2 61.1 56.8 51.2 56.8H42.7V80.5H51.5Z"
          fill={`url(#${gold})`}
          filter={`url(#${shadow})`}
        />
        <path
          d="M42.7 25.2H49.4C57.5 25.2 62.2 28.7 62.2 34.8C62.2 41.3 57.4 45.2 48.7 45.2H42.7V25.2ZM42.7 56.8H51.2C61.1 56.8 66.8 61.2 66.8 68.6C66.8 76.1 61.4 80.5 51.5 80.5H42.7V56.8Z"
          fill={`url(#${goldDark})`}
          opacity="0.38"
        />
        <path
          d="M37.8 18.6H52.8C64.5 18.6 71 24.4 71 34.1C71 40.5 67.2 45.6 60.5 48.4"
          fill="none"
          stroke={`url(#${shine})`}
          strokeWidth="4.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function BarberiaOSLogo({
  variant = "icon",
  size,
  showText,
  tone = "light",
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const normalizedVariant = normalizeVariant(variant);
  const { px, token } = normalizeSize(size, normalizedVariant);
  const shouldShowText = showText ?? normalizedVariant === "full";
  const textTone = tone === "dark" ? "text-white" : "text-[#111111]";
  const subTone = tone === "dark" ? "text-white/45" : "text-slate-400";

  if (!shouldShowText || normalizedVariant === "icon" || normalizedVariant === "sidebar") {
    return (
      <span className={cn("inline-flex items-center", className)} aria-label="BarberíaOS" role="img">
        <PremiumBMark px={px} uid={uid} />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)} aria-label="BarberíaOS" role="img">
      <PremiumBMark px={px} uid={uid} />
      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span className={cn("select-none font-bold tracking-normal", TEXT_SIZE[token], textTone)}>
          Barbería<span className="bg-gradient-to-br from-[#B8860B] via-[#F5D76E] to-[#C9A227] bg-clip-text text-transparent">OS</span>
        </span>
        {normalizedVariant === "full" && token === "lg" && (
          <span className={cn("mt-1 text-[10px] font-semibold uppercase tracking-[0.14em]", subTone)}>
            Sistema operativo para barberías
          </span>
        )}
      </span>
    </span>
  );
}

export { BarberiaOSLogo as BarberiasOSIsotipo };
