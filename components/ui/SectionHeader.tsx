import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  variant?: "default" | "dark";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  variant = "default",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow && (
        <p className={variant === "dark" ? "section-kicker text-[#D5A84C]" : "section-kicker"}>
          {eyebrow}
        </p>
      )}
      <div className={`${action ? "mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" : ""}`}>
        <div>
          <h2 className={variant === "dark" ? "text-3xl font-black leading-tight text-white md:text-5xl" : "text-3xl font-black leading-tight text-[#080A0F] md:text-5xl"}>
            {title}
          </h2>
          {description && (
            <p className={variant === "dark" ? "mt-4 text-base leading-8 text-white/60" : "mt-4 text-base leading-8 text-slate-500"}>
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
