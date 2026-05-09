import type { ReactNode } from "react";

type ProductMockupCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
};

export function ProductMockupCard({
  title,
  description,
  children,
  className = "",
  dark = false,
}: ProductMockupCardProps) {
  return (
    <div className={`overflow-hidden rounded-[30px] border p-3 shadow-[var(--shadow-card)] ${
      dark ? "border-white/10 bg-[#080A0F]" : "border-slate-200 bg-white"
    } ${className}`}>
      {(title || description) && (
        <div className={dark ? "border-b border-white/10 px-3 pb-3 pt-1" : "border-b border-slate-100 px-3 pb-3 pt-1"}>
          {title && (
            <p className={dark ? "text-sm font-black text-white" : "text-sm font-black text-[#080A0F]"}>
              {title}
            </p>
          )}
          {description && (
            <p className={dark ? "mt-1 text-xs leading-5 text-white/45" : "mt-1 text-xs leading-5 text-slate-500"}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className="p-2">{children}</div>
    </div>
  );
}
