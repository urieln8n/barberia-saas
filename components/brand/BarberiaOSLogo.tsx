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

// ─── Design system ────────────────────────────────────────────────────────────
//
//  MONOLINE B — 100 × 100 viewBox
//  ────────────────────────────────────────────────────────────────────────────
//  Philosophy: strokes, not fills. Every element is a single-weight line.
//  Precedent: Bang & Olufsen, Braun, Leica, Inter typeface construction.
//
//  GOLDEN RATIO SEMICIRCLES (SVG arc commands — not bezier approximation):
//    Upper arc  r=12  y 16 → 40  height 24  peak x=48
//    Lower arc  r=19  y 46 → 84  height 38  peak x=55
//    38 ÷ 24 = 1.583 ≈ φ (golden ratio — same proportion as the Parthenon)
//
//  STROKE SYSTEM:
//    B strokes   : 5.5 px (white, rounded caps & joins)
//    Razor accent: 2.0 px (gold gradient, rounded caps)
//    Outer ring  : 0.72px (gold gradient)
//    Whisper ring: 0.22px (gold, 24% opacity)
//
//  TERMINAL DETAIL:
//    Rounded stroke caps at y=40 and y=46 create "ball terminals" —
//    the micro-detail that separates a designed letterform from a typeface.
//
//  RAZOR ACCENT:
//    45° line (18,82)→(82,18). At stem x=36 it intersects at y=64,
//    cutting through the lower arc's body — reads as a precision cut.
//    Endpoints are inside the circle (r≈45.3 < 46.5) — no clip needed.

function Mark({ px, uid }: { px: number; uid: string }) {
  const bgId   = `g-bg-${uid}`;
  const ringId = `g-rg-${uid}`;

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
        {/* ── Background: warm dark coal centre, near-black edge ── */}
        <radialGradient id={bgId} cx="42%" cy="38%" r="62%" fx="42%" fy="38%">
          <stop offset="0%"   stopColor="#201D16" />
          <stop offset="55%"  stopColor="#0D0C09" />
          <stop offset="100%" stopColor="#030302" />
        </radialGradient>

        {/* ── Gold ring: brilliant top-right → vanishing bottom-left ── */}
        <linearGradient id={ringId} x1="12%" y1="12%" x2="88%" y2="88%">
          <stop offset="0%"   stopColor="#F8E882" stopOpacity="0.92" />
          <stop offset="30%"  stopColor="#D4AF37" stopOpacity="0.70" />
          <stop offset="100%" stopColor="#3E2203" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* ── LAYER 1 ── Background sphere ─────────────────────────────── */}
      <circle cx="50" cy="50" r="50" fill={`url(#${bgId})`} />

      {/* ── LAYER 2 ── Two-depth gold ring system ────────────────────── */}
      <circle cx="50" cy="50" r="47"   fill="none" stroke={`url(#${ringId})`} strokeWidth="0.72" />
      <circle cx="50" cy="50" r="44.4" fill="none" stroke="#D4AF37"           strokeWidth="0.22" opacity="0.28" />

      {/* ── LAYER 3 ── Monoline B ─────────────────────────────────────
          All strokes white, 5.5px, rounded caps.
          The stem runs full height; arcs are attached at their endpoints.
          Ball terminals at y=40 and y=46 signal craftsmanship.
      ──────────────────────────────────────────────────────────────── */}

      {/* Spine — the backbone of the B */}
      <line
        x1="36" y1="16"
        x2="36" y2="84"
        stroke="white"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* Upper arc — perfect semicircle, r=12, height=24 */}
      <path
        d="M 36,16 A 12,12 0 0 1 36,40"
        fill="none"
        stroke="white"
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* Lower arc — perfect semicircle, r=19, height=38 ≈ φ × upper */}
      <path
        d="M 36,46 A 19,19 0 0 1 36,84"
        fill="none"
        stroke="white"
        strokeWidth="5.5"
        strokeLinecap="round"
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

export { BarberiaOSLogo as BarberiasOSIsotipo };
