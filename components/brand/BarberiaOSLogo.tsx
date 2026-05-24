"use client";

import { useId } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LogoVariant = "isotipo" | "horizontal" | "small" | "favicon";

type Props = {
  variant?: LogoVariant;
  /** Pixel size of the mark. Derived from variant if omitted. */
  size?: number;
  /** Show "BarberíaOS" wordmark beside the mark. */
  showText?: boolean;
  className?: string;
};

// ─── Mark geometry ────────────────────────────────────────────────────────────
//
//  100 × 100 viewBox. Pure SVG arcs — no bezier approximations.
//
//  GOLDEN RATIO B
//  ──────────────
//  Total B height : 70 (y 15 → 85)
//  Gap            :  6 (y 39 → 45)
//  Upper lobe     : height 24, radius 12  (y 15 → 39, peak x 54)
//  Lower lobe     : height 40, radius 20  (y 45 → 85, peak x 62)
//  Lower ÷ upper  : 40 ÷ 24 ≈ 1.667  ≈  φ  (golden ratio)
//
//  STEM   x 31 → 42  (width 11)
//  CIRCLE r 47 (outer ring), r 44.2 (whisper ring), r 46.5 (clip)
//
//  RAZOR ACCENT
//  ─────────────
//  A thin diamond parallelogram at 45°, not a stroke.
//  Half-width 2.5 px perpendicular to the diagonal direction.
//  Perpendicular unit of 45°: (±0.707, ±0.707)
//  Base points on circle: (17,83) → (83,17)
//  Corner offsets: 2.5 × 0.707 ≈ 1.77
//  Corners: A(15.2,81.2)  B(18.8,84.8)  C(84.8,18.8)  D(81.2,15.2)
//  The diagonal passes through the lower-lobe area of the B,
//  exits above the upper lobe — reads as a precision blade.

function Mark({ px, uid }: { px: number; uid: string }) {
  const bgId    = `g-bg-${uid}`;
  const ringId  = `g-rg-${uid}`;
  const slashId = `g-sl-${uid}`;
  const clipId  = `g-cl-${uid}`;

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
        {/* ── Background: warm dark-coal centre, deep black edge ── */}
        <radialGradient id={bgId} cx="42%" cy="38%" r="62%" fx="42%" fy="38%">
          <stop offset="0%"   stopColor="#1D1A14" />
          <stop offset="58%"  stopColor="#0C0B08" />
          <stop offset="100%" stopColor="#030302" />
        </radialGradient>

        {/* ── Outer ring: brilliant gold top-right → near-invisible bottom-left ── */}
        <linearGradient id={ringId} x1="12%" y1="12%" x2="88%" y2="88%">
          <stop offset="0%"   stopColor="#F8E882" stopOpacity="0.85" />
          <stop offset="32%"  stopColor="#D4AF37" stopOpacity="0.60" />
          <stop offset="100%" stopColor="#4A2E05" stopOpacity="0.12" />
        </linearGradient>

        {/* ── Razor accent: ember → gold → champagne tip ── */}
        <linearGradient id={slashId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#4A2E05" stopOpacity="0.30" />
          <stop offset="22%"  stopColor="#A8820C" stopOpacity="0.92" />
          <stop offset="52%"  stopColor="#D4AF37" />
          <stop offset="76%"  stopColor="#E8D060" />
          <stop offset="100%" stopColor="#FCF2BC" stopOpacity="0.65" />
        </linearGradient>

        {/* ── Clip: razor diamond stays within the circle ── */}
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="46.5" />
        </clipPath>
      </defs>

      {/* ──────────────────────────────────────────────────────────────────────
          LAYER 1 — Background sphere
      ────────────────────────────────────────────────────────────────────── */}
      <circle cx="50" cy="50" r="50" fill={`url(#${bgId})`} />

      {/* ──────────────────────────────────────────────────────────────────────
          LAYER 2 — Gold ring (two-ring depth system)
      ────────────────────────────────────────────────────────────────────── */}
      <circle cx="50" cy="50" r="47"   fill="none" stroke={`url(#${ringId})`} strokeWidth="0.72" />
      <circle cx="50" cy="50" r="44.4" fill="none" stroke="#D4AF37"           strokeWidth="0.22" opacity="0.24" />

      {/* ──────────────────────────────────────────────────────────────────────
          LAYER 3 — Golden-ratio B mark
          Using SVG arc commands for mathematically perfect semicircles.
          All white fills; gap y=39-45 lets background show between lobes.
      ────────────────────────────────────────────────────────────────────── */}

      {/* Stem — vertical backbone */}
      <rect x="31" y="15" width="11" height="70" rx="2.5" fill="white" />

      {/* Upper D-lobe — smaller lobe, radius 12
          Arc: from (42,15) clockwise to (42,39), sweeps RIGHT to peak (54,27)
          Height 24 — the MINOR lobe by φ proportion */}
      <path
        d="M 42,15
           A 12,12 0 0 1 42,39
           Z"
        fill="white"
      />

      {/* Lower D-lobe — dominant lobe, radius 20  (20/12 = 1.667 ≈ φ)
          Arc: from (42,45) clockwise to (42,85), sweeps RIGHT to peak (62,65)
          Height 40 — the MAJOR lobe */}
      <path
        d="M 42,45
           A 20,20 0 0 1 42,85
           Z"
        fill="white"
      />

      {/* ──────────────────────────────────────────────────────────────────────
          LAYER 4 — Razor-precision diagonal accent
          Thin diamond parallelogram (not a round-capped line) — gives the
          mark a sense of craft. Clipped cleanly to the circle edge.
      ────────────────────────────────────────────────────────────────────── */}
      <polygon
        points="15.2,81.2  18.8,84.8  84.8,18.8  81.2,15.2"
        fill={`url(#${slashId})`}
        clipPath={`url(#${clipId})`}
        opacity="0.90"
      />
    </svg>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function BarberiaOSLogo({
  variant   = "isotipo",
  size,
  showText  = variant === "horizontal" || variant === "small",
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");

  const defaultPx: Record<LogoVariant, number> = {
    favicon:    64,
    small:      28,
    horizontal: 40,
    isotipo:    40,
  };
  const px = size ?? defaultPx[variant];

  // ── Horizontal ────────────────────────────────────────────────────────────
  if (variant === "horizontal") {
    const textPx = Math.max(14, Math.round(px * 0.38));
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
            style={{ fontSize: textPx }}
          >
            BarberíaOS
          </span>
        )}
      </span>
    );
  }

  // ── Small ─────────────────────────────────────────────────────────────────
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

  // ── Isotipo / Favicon ─────────────────────────────────────────────────────
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

// Alias for backward compatibility
export { BarberiaOSLogo as BarberiasOSIsotipo };
