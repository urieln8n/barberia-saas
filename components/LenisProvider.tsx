"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const LENIS_MARKETING_PATHS = new Set([
  "/",
  "/caja-para-barberias",
  "/reservas-online-barberia",
  "/software-barberias-barcelona",
  "/software-barberias-sin-comision",
  "/software-para-barberias",
]);

/**
 * Activates Lenis smooth scroll on landing and marketing pages.
 * Skips automatically when:
 *  - prefers-reduced-motion is set
 *  - device has only touch/coarse pointer (mobile, tablet)
 * Safe to nest inside Server Components as children prop.
 * Never applied to /dashboard, /login or /r/[slug] — only imported from landing and marketing components.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketingPath = pathname ? LENIS_MARKETING_PATHS.has(pathname) : false;

  useEffect(() => {
    if (!isMarketingPath) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches;
    const hasCoarsePointer = window.matchMedia("(any-pointer: coarse)").matches;
    const isTouchOnly = hasCoarsePointer && !hasFinePointer;

    if (prefersReducedMotion || isTouchOnly) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
    });

    console.log("[Lenis] active on landing");

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
  }, [isMarketingPath]);

  return <>{children}</>;
}
