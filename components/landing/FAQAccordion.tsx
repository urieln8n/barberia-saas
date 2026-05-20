"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type FAQAccordionProps = {
  items: ReadonlyArray<readonly [string, string]>;
  dark?: boolean;
};

export function FAQAccordion({ items, dark = false }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid gap-3">
      {items.map(([question, answer], i) => (
        <div
          key={question}
          className={`overflow-hidden rounded-[20px] border transition-colors duration-200 ${
            dark
              ? "border-white/[0.10] bg-white/[0.04] hover:border-white/[0.16]"
              : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left"
            aria-expanded={open === i}
          >
            <span className={`text-base font-black ${dark ? "text-white" : "text-[#080A0F]"}`}>
              {question}
            </span>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                open === i
                  ? dark
                    ? "border-[#D5A84C]/30 bg-[#D5A84C]/10 text-[#D5A84C]"
                    : "border-[#C9922A]/30 bg-[#C9922A]/10 text-[#C9922A]"
                  : dark
                    ? "border-white/10 bg-white/[0.05] text-white/40"
                    : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              {open === i ? <X size={13} /> : <Plus size={13} />}
            </span>
          </button>
          {open === i && (
            <div
              className={`border-t px-5 pb-5 pt-4 ${
                dark ? "border-white/[0.08]" : "border-slate-100"
              }`}
            >
              <p className={`text-sm leading-7 ${dark ? "text-white/60" : "text-slate-500"}`}>
                {answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
