"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { LenisProvider } from "@/components/LenisProvider";

export function LandingExperience({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <main className="min-h-screen overflow-hidden bg-gradient-to-br from-[#05070d] via-[#07111f] to-[#02030a] text-white">
        {children}
      </main>
    </LenisProvider>
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
