import type { ReactNode } from "react";

type LegalCardProps = {
  title: string;
  children: ReactNode;
  id?: string;
  className?: string;
};

export function LegalCard({ title, children, id, className = "" }: LegalCardProps) {
  return (
    <section id={id} className={`scroll-mt-24 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)] md:p-6 ${className}`}>
      <h2 className="text-xl font-black text-[#080A0F]">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}
