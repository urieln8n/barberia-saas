"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon?: LucideIcon;
  badge?: string;
  badgeCls?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  icon: Icon,
  badge,
  badgeCls = "bg-white/[0.06] text-white/50 border-white/[0.10]",
  defaultOpen = false,
  children,
  className = "",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(defaultOpen ? "auto" : 0);

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      const h = contentRef.current.scrollHeight;
      setHeight(h);
      const t = setTimeout(() => setHeight("auto"), 300);
      return () => clearTimeout(t);
    } else {
      setHeight(contentRef.current.scrollHeight);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
    }
  }, [open]);

  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-[#0E0E1C] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
              <Icon size={15} className="text-white/60" />
            </div>
          )}
          <span className="truncate text-sm font-black text-white">{title}</span>
          {badge && (
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${badgeCls}`}>
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-white/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        ref={contentRef}
        style={{ height: height === "auto" ? "auto" : `${height}px` }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div className="border-t border-white/[0.06] px-5 pb-5 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
