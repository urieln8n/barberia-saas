import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, Scissors } from "lucide-react";
import { LegalNoticeBadge } from "@/components/legal/LegalNoticeBadge";
import { LegalTableOfContents } from "@/components/legal/LegalTableOfContents";

type TocItem = {
  id: string;
  title: string;
};

type LegalPageLayoutProps = {
  title: string;
  description: string;
  lastUpdated: string;
  tocItems?: TocItem[];
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  description,
  lastUpdated,
  tocItems = [],
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="premium-grid-bg min-h-screen text-[#080A0F]">
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#D5A84C]">
              <Scissors size={18} />
            </span>
            <span className="font-black">BarberiaOS</span>
          </Link>
          <Link href="/legal" className="btn-ghost">
            <ArrowLeft size={16} />
            Volver a legal
          </Link>
        </div>
      </header>

      <section className="px-5 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="section-band overflow-hidden">
            <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-5 py-7 md:px-8 md:py-9">
              <LegalNoticeBadge />
              <p className="mt-6 text-xs font-black uppercase text-[#2563EB]">Legal BarberiaOS</p>
              <h1 className="mt-2 max-w-4xl text-[clamp(2.25rem,5vw,4.75rem)] font-black leading-none tracking-normal text-[#080A0F]">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{description}</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500">
                <CalendarDays size={14} />
                Ultima actualizacion: {lastUpdated}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-5">{children}</div>
            <LegalTableOfContents items={tocItems} />
          </div>
        </div>
      </section>
    </main>
  );
}
