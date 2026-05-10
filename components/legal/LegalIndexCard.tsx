import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

type LegalIndexCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function LegalIndexCard({ title, description, href, icon: Icon }: LegalIndexCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
          <Icon size={19} />
        </div>
        <ArrowRight size={18} className="mt-1 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#2563EB]" />
      </div>
      <h2 className="mt-5 text-lg font-black text-[#080A0F]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}
