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
  lg: 52,
};

const TEXT_SIZE: Record<LogoSize, string> = {
  sm: "text-[13px]",
  md: "text-[15px]",
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

// ─── Premium B Mark ───────────────────────────────────────────────────────────
// Compound path with evenodd fill — outer B silhouette minus inner counters.
// Proportions: bottom bowl slightly larger than top (optical balance).
// Gold: 7-stop gradient simulating real metal luster from top-left light source.

function PremiumBMark({ px, uid }: { px: number; uid: string }) {
  const ids = {
    bgGrad:    `bg-${uid}`,
    goldMain:  `gm-${uid}`,
    goldInner: `gi-${uid}`,
    shine:     `sh-${uid}`,
    shineB:    `sb-${uid}`,
    rim:       `rm-${uid}`,
    shadow:    `sd-${uid}`,
    clip:      `cl-${uid}`,
  };

  const r = Math.max(10, Math.round(px * 0.26)); // border-radius of container

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={px}
      height={px}
      role="img"
      aria-label="BarberíaOS"
      className="block shrink-0"
    >
      <defs>
        {/* Container background — very subtle cream-to-ivory radial */}
        <radialGradient id={ids.bgGrad} cx="38%" cy="32%" r="70%">
          <stop offset="0%"   stopColor="#FFFEF9" />
          <stop offset="55%"  stopColor="#FFFBF0" />
          <stop offset="100%" stopColor="#FFF4D6" />
        </radialGradient>

        {/* Main gold — 7 stops, top-left to bottom-right light source */}
        <linearGradient id={ids.goldMain} x1="18%" y1="6%" x2="82%" y2="94%">
          <stop offset="0%"   stopColor="#FFF59C" />
          <stop offset="14%"  stopColor="#F5D76E" />
          <stop offset="32%"  stopColor="#D4AF37" />
          <stop offset="50%"  stopColor="#C9A227" />
          <stop offset="68%"  stopColor="#B8870C" />
          <stop offset="84%"  stopColor="#9A6E08" />
          <stop offset="100%" stopColor="#7A5506" />
        </linearGradient>

        {/* Inner highlight — adds depth/dimension to the B face */}
        <linearGradient id={ids.goldInner} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="#FFFDE0" stopOpacity="0.55" />
          <stop offset="40%"  stopColor="#F5D76E" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </linearGradient>

        {/* Diagonal shine — mimics specular highlight on polished gold */}
        <linearGradient id={ids.shine} x1="8%" y1="2%" x2="62%" y2="60%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.82" />
          <stop offset="28%"  stopColor="#FFFFFF" stopOpacity="0.30" />
          <stop offset="60%"  stopColor="#FFFFFF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Shine on B letterform */}
        <linearGradient id={ids.shineB} x1="10%" y1="0%" x2="55%" y2="55%">
          <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.60" />
          <stop offset="40%"  stopColor="#FFFFFF" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Gold rim around container */}
        <linearGradient id={ids.rim} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#E8D070" stopOpacity="0.90" />
          <stop offset="50%"  stopColor="#C9A227" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8A6510" stopOpacity="0.80" />
        </linearGradient>

        {/* Drop shadow for B letterform */}
        <filter id={ids.shadow} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.8" stdDeviation="1.8" floodColor="#5A3A00" floodOpacity="0.35" />
        </filter>

        {/* Clip to rounded-rect container */}
        <clipPath id={ids.clip}>
          <rect x="0" y="0" width="100" height="100" rx={r} />
        </clipPath>
      </defs>

      {/* Container background */}
      <rect x="0" y="0" width="100" height="100" rx={r} fill={`url(#${ids.bgGrad})`} />

      {/* Gold rim / border */}
      <rect x="0.75" y="0.75" width="98.5" height="98.5" rx={r} fill="none" stroke={`url(#${ids.rim})`} strokeWidth="1.5" />

      {/* Inner white rim — creates a "coin edge" depth effect */}
      <rect x="2" y="2" width="96" height="96" rx={Math.max(8, r - 2)} fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.65" />

      <g clipPath={`url(#${ids.clip})`}>
        {/* ── B letterform ────────────────────────────────────────────
            Compound path (evenodd): outer silhouette minus inner counters.

            Outer B:
              Stem runs x=23→36, y=13→88
              Top bump: rightmost ~x=77 at y=31
              Bottom bump: rightmost ~x=80 at y=68 (slightly larger)

            Top counter (hole): x=36→66, y=22→42
            Bottom counter (hole): x=36→70, y=50→80
        ──────────────────────────────────────────────────────────── */}
        <path
          fillRule="evenodd"
          fill={`url(#${ids.goldMain})`}
          filter={`url(#${ids.shadow})`}
          d="
            M 23,13 H 51
            C 70,13 78,21 78,31
            C 78,41 70,48 56,50
            C 72,52 81,60 81,70
            C 81,81 71,88 51,88
            H 23 Z
            M 36,23 H 49
            C 62,23 66,27 66,31
            C 66,37 62,41 49,41
            H 36 Z
            M 36,50 H 51
            C 65,50 69,55 69,70
            C 69,78 65,80 51,80
            H 36 Z
          "
        />

        {/* Inner depth layer — adds dimension to the B face */}
        <path
          fillRule="evenodd"
          fill={`url(#${ids.goldInner})`}
          d="
            M 23,13 H 51
            C 70,13 78,21 78,31
            C 78,41 70,48 56,50
            C 72,52 81,60 81,70
            C 81,81 71,88 51,88
            H 23 Z
            M 36,23 H 49
            C 62,23 66,27 66,31
            C 66,37 62,41 49,41
            H 36 Z
            M 36,50 H 51
            C 65,50 69,55 69,70
            C 69,78 65,80 51,80
            H 36 Z
          "
        />

        {/* Shine highlight on B — top-left specular */}
        <path
          fill="none"
          stroke={`url(#${ids.shineB})`}
          strokeWidth="5"
          strokeLinecap="round"
          d="M 28,16 H 50 C 66,16 74,22 74,31 C 74,39 68,45 57,48"
        />

        {/* Container top-left shine overlay */}
        <rect x="0" y="0" width="100" height="100" rx={r} fill={`url(#${ids.shine})`} />
      </g>
    </svg>
  );
}

// ─── Logo component ───────────────────────────────────────────────────────────

export function BarberiaOSLogo({
  variant = "icon",
  size,
  showText,
  tone = "light",
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "").replace(/-/g, "");
  const normalizedVariant = normalizeVariant(variant);
  const { px, token } = normalizeSize(size, normalizedVariant);
  const shouldShowText = showText ?? normalizedVariant === "full";
  const textColor   = tone === "dark" ? "text-white"       : "text-[#111111]";
  const subColor    = tone === "dark" ? "text-white/40"    : "text-slate-400";

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
        <span className={cn("select-none font-black tracking-tight", TEXT_SIZE[token], textColor)}>
          Barbería
          <span
            style={{
              background: "linear-gradient(135deg, #C9A227 0%, #F5D76E 45%, #C9A227 70%, #8F6508 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            OS
          </span>
        </span>
        {normalizedVariant === "full" && token === "lg" && (
          <span className={cn("mt-1 text-[10px] font-semibold uppercase tracking-[0.14em]", subColor)}>
            Sistema operativo para barberías
          </span>
        )}
      </span>
    </span>
  );
}

export { BarberiaOSLogo as BarberiasOSIsotipo };
