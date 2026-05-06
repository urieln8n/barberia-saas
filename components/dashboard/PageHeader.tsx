import type { ReactNode } from "react";

type Props = {
  section?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  section = "Panel de control",
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
          {section}
        </p>
        <h1 className="mt-1.5 text-3xl font-black tracking-tight text-[#0D0D0D] md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-neutral-500">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-3">{action}</div>
      )}
    </div>
  );
}
