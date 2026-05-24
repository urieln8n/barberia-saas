"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { AgendaView } from "@/src/lib/agenda/types";

type Props = {
  view: AgendaView;
  children: React.ReactNode;
};

export function AgendaMotionShell({ view, children }: Props) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div key={view}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
