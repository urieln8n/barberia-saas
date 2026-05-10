"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export function FAQAccordion({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid gap-3">
      {items.map(([question, answer], i) => (
        <div
          key={question}
          className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition-colors duration-200 hover:border-slate-300"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left"
            aria-expanded={open === i}
          >
            <span className="text-base font-black text-[#080A0F]">{question}</span>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                open === i
                  ? "border-[#C9922A]/30 bg-[#C9922A]/10 text-[#C9922A]"
                  : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              {open === i ? <X size={13} /> : <Plus size={13} />}
            </span>
          </button>
          {open === i && (
            <div className="border-t border-slate-100 px-5 pb-5 pt-4">
              <p className="text-sm leading-7 text-slate-500">{answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
