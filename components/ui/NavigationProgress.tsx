"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setVisible(true);
    setWidth(10);

    const q = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    q(() => setWidth(52), 80);
    q(() => setWidth(76), 450);
    q(() => setWidth(91), 1100);
    q(() => setWidth(100), 1900);
    q(() => { setVisible(false); setWidth(0); }, 2250);

    return () => timers.current.forEach(clearTimeout);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] w-full"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.45s ease" }}
    >
      {/* Progress bar */}
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
          background: "linear-gradient(90deg, #9A6F10, #D4AF37, #F5D36D, #D4AF37, #9A6F10)",
          boxShadow:
            "0 0 14px rgba(212,175,55,0.70), 0 0 4px rgba(245,211,109,0.90)",
        }}
      />
      {/* Glowing tip */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `calc(${width}% - 5px)`,
          transform: "translateY(-50%)",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#F5D36D",
          boxShadow:
            "0 0 10px rgba(245,211,109,1), 0 0 22px rgba(212,175,55,0.75)",
          opacity: visible && width > 5 && width < 100 ? 1 : 0,
          transition: "left 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
        }}
      />
    </div>
  );
}
