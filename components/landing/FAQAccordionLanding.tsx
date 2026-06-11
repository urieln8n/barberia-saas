"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQAccordionLanding({ items }: { items: readonly [string, string][] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/6">
      {items.map(([question, answer], i) => (
        <div key={i} className="py-4">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-1 text-left text-[15px] font-bold text-white transition hover:text-[#D4AF37]"
          >
            <span>{question}</span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
              {open === i
                ? <Minus size={11} className="text-[#D4AF37]" />
                : <Plus size={11} className="text-white/50" />}
            </span>
          </button>
          {open === i && (
            <p className="mt-3 text-[14px] leading-relaxed text-white/50 animate-fade-in">
              {answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
