"use client";

import { useId } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LogoVariant = "isotipo" | "horizontal" | "small" | "favicon";

type Props = {
  variant?: LogoVariant;
  /** Explicit pixel size for the mark. Defaults by variant if omitted. */
  size?: number;
  /** Show "BarberíaOS" wordmark next to the mark. Default true for horizontal/small. */
  showText?: boolean;
  className?: string;
};

// ─── Internal: geometric B mark SVG ──────────────────────────────────────────
//
//  Pure SVG paths — no font dependency.
//  viewBox 0 0 100 100.
//
//  Construction:
//   • Background circle with subtle radial gradient.
//   • Two concentric gold rings (outer 0.75px, inner 0.25px whisper).
//   • Geometric B = stem (rect) + upper D-lobe (path) + lower D-lobe (path).
//     A 6-unit gap between the lobes reveals the background, separating them
//     visually. Lower lobe is slightly wider (classic B proportion).
//   • Diagonal razor-accent stroke from lower-left to upper-right,
//     clipped to the inner circle with a gold-to-bright gradient.
//

function Mark({ px, uid }: { px: number; uid: string }) {
  const bgId    = `bg-${uid}`;
  const ringId  = `ring-${uid}`;
  const slashId = `slash-${uid}`;
  const clipId  = `clip-${uid}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={px}
      height={px}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        {/* ── Background: subtle radial — warm dark centre, near-black edge ── */}
        <radialGradient id={bgId} cx="40%" cy="35%" r="65%" fx="40%" fy="35%">
          <stop offset="0%"   stopColor="#1E1B14" />
          <stop offset="55%"  stopColor="#0F0E0B" />
          <stop offset="100%" stopColor="#050503" />
        </radialGradient>

        {/* ── Outer ring: gold gradient, bright at top-right ── */}
        <linearGradient id={ringId} x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%"   stopColor="#F9E98A" stopOpacity="0.85" />
          <stop offset="40%"  stopColor="#D4AF37" stopOpacity="0.60" />
          <stop offset="100%" stopColor="#6B4D0A" stopOpacity="0.18" />
        </linearGradient>

        {/* ── Diagonal stroke: dark origin → rich gold → bright tip ── */}
        <linearGradient id={slashId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#6B4D0A" stopOpacity="0.45" />
          <stop offset="30%"  stopColor="#C49B1F" stopOpacity="0.9"  />
          <stop offset="62%"  stopColor="#D4AF37" />
          <stop offset="82%"  stopColor="#EDD060" />
          <stop offset="100%" stopColor="#FDF2B0" stopOpacity="0.75" />
        </linearGradient>

        {/* ── Clip: stroke ends cleanly at the circle edge ── */}
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="46.5" />
        </clipPath>
      </defs>

      {/* ── Background circle ─────────────────────────────────────────── */}
      <circle cx="50" cy="50" r="50" fill={`url(#${bgId})`} />

      {/* ── Outer gold ring ────────────────────────────────────────────── */}
      <circle
        cx="50" cy="50" r="47"
        fill="none"
        stroke={`url(#${ringId})`}
        strokeWidth="0.8"
      />

      {/* ── Inner whisper ring (adds depth) ────────────────────────────── */}
      <circle
        cx="50" cy="50" r="44.2"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="0.25"
        opacity="0.22"
      />

      {/* ── Geometric B mark ─────────────────────────────────────────────
           Stem   x 19-31  y 15-85  (h 70)
           Upper  M 29,15 → apex (63,32) → 29,46   gap → y 52
           Lower  M 29,52 → apex (66,69) → 29,85  (wider + taller lobe)
      ──────────────────────────────────────────────────────────────────── */}

      {/* Vertical stem */}
      <rect x="19" y="15" width="12" height="70" rx="2.5" fill="white" />

      {/* Upper D-lobe */}
      <path
        d="M 29,15
           C 52,15 63,21 63,32
           C 63,43 52,46 29,46
           Z"
        fill="white"
      />

      {/* Lower D-lobe — 6 units below upper, slightly wider */}
      <path
        d="M 29,52
           C 55,52 66,58 66,69
           C 66,80 55,85 29,85
           Z"
        fill="white"
      />

      {/* ── Diagonal razor-accent stroke ──────────────────────────────────
           Endpoints at 45° exactly on circle r ≈ 46.5:
           cos 45° × 46.5 ≈ 32.9  →  (50-33, 50+33) = (17,83) / (83,17)
      ──────────────────────────────────────────────────────────────────── */}
      <line
        x1="17" y1="83"
        x2="83" y2="17"
        stroke={`url(#${slashId})`}
        strokeWidth="2"
        strokeLinecap="round"
        clipPath={`url(#${clipId})`}
        opacity="0.92"
      />
    </svg>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function BarberiaOSLogo({
  variant  = "isotipo",
  size,
  showText = variant === "horizontal" || variant === "small",
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");

  const defaultSize: Record<LogoVariant, number> = {
    favicon:    64,
    small:      28,
    horizontal: 40,
    isotipo:    40,
  };
  const px = size ?? defaultSize[variant];

  // ── Horizontal: mark + wordmark side by side ──────────────────────────────
  if (variant === "horizontal") {
    const textSize = Math.max(14, Math.round(px * 0.38));
    return (
      <span
        className={`inline-flex items-center gap-3 ${className}`}
        aria-label="BarberíaOS"
        role="img"
      >
        <Mark px={px} uid={uid} />
        {showText && (
          <span
            className="font-black tracking-tight text-white leading-none select-none"
            style={{ fontSize: textSize }}
          >
            BarberíaOS
          </span>
        )}
      </span>
    );
  }

  // ── Small: compact mark + optional label ─────────────────────────────────
  if (variant === "small") {
    return (
      <span
        className={`inline-flex items-center gap-2 ${className}`}
        aria-label="BarberíaOS"
        role="img"
      >
        <Mark px={px} uid={uid} />
        {showText && (
          <span className="text-[13px] font-black tracking-tight text-white leading-none select-none">
            BarberíaOS
          </span>
        )}
      </span>
    );
  }

  // ── Isotipo / Favicon: mark only ─────────────────────────────────────────
  return (
    <span
      className={`inline-block ${className}`}
      aria-label="BarberíaOS"
      role="img"
    >
      <Mark px={px} uid={uid} />
    </span>
  );
}

// ─── Named alias kept for backward compatibility ──────────────────────────────
export { BarberiaOSLogo as BarberiasOSIsotipo };
