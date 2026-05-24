"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

/**
 * Activates Lenis smooth scroll on desktop pointer devices.
 * Skips automatically when:
 *  - prefers-reduced-motion is set
 *  - device uses touch/coarse pointer (mobile, tablet)
 * Safe to nest inside Server Components as children prop.
 * Never applied to /dashboard — only imported from landing layouts.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (
      prefersReducedMotion ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
