"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type MotionGroupProps = {
  children: ReactNode;
  className?: string;
};

export function PremiumDashboardMotion({ children, className = "" }: MotionGroupProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.055,
            delayChildren: 0.04,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function PremiumDashboardItem({ children, className = "" }: MotionGroupProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
