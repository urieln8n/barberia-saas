"use client";

import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import Lenis from "lenis";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

export function LandingExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) {
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

  return (
    <main ref={rootRef} className="min-h-screen overflow-hidden bg-gradient-to-br from-[#05070d] via-[#07111f] to-[#02030a] text-white">
      {children}
    </main>
  );
}

export function MotionSection({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = props as HTMLMotionProps<"section">;

  return (
    <motion.section
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      {...motionProps}
    >
      {children}
    </motion.section>
  );
}
