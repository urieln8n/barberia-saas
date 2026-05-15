"use client";

import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function LandingExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
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

  useEffect(() => {
    if (prefersReducedMotion || !rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-gsap-premium='hero']",
        { y: 34, scale: 0.985, filter: "blur(8px)" },
        {
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-gsap-premium='feature']").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 54, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              once: true,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <main ref={rootRef} className="min-h-screen overflow-hidden bg-[#FAFBFF] text-[#080A0F]">
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
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      {...motionProps}
    >
      {children}
    </motion.section>
  );
}
