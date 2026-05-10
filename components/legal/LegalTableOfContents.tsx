type TocItem = {
  id: string;
  title: string;
};

type LegalTableOfContentsProps = {
  items: TocItem[];
};

export function LegalTableOfContents({ items }: LegalTableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6 rounded-[24px] border border-slate-200 bg-white/85 p-4 shadow-[var(--shadow-soft)] backdrop-blur">
        <p className="text-xs font-black uppercase text-[#2563EB]">Indice</p>
        <nav className="mt-3 space-y-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block rounded-xl px-3 py-2 text-sm font-semibold leading-5 text-slate-500 transition hover:bg-slate-50 hover:text-[#080A0F]"
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
