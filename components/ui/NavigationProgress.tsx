"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const navigating = useRef(false);
  const isFirstRender = useRef(true);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const q = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  // Detect navigation start via link clicks — fires BEFORE pathname changes
  useEffect(() => {
    function onLinkClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor?.href) return;

      // Skip external links and non-navigating targets
      if (anchor.target === "_blank") return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;

      // Start bar immediately on click
      clear();
      navigating.current = true;
      setVisible(true);
      setWidth(12);
      q(() => setWidth(35), 60);
      q(() => setWidth(58), 300);
      q(() => setWidth(75), 800);
      q(() => setWidth(86), 1600);
    }

    document.addEventListener("click", onLinkClick);
    return () => document.removeEventListener("click", onLinkClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Complete bar when pathname actually changes (navigation done)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!navigating.current) return;
    navigating.current = false;

    clear();
    setWidth(100);
    q(() => {
      setVisible(false);
      setWidth(0);
    }, 380);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] w-full"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
    >
      {/* Progress bar */}
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          background:
            "linear-gradient(90deg, #9A6F10, #D4AF37, #F5D36D, #D4AF37, #9A6F10)",
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
          transition:
            "left 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
        }}
      />
    </div>
  );
}
