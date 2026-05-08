import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-[18px] border border-dashed border-[#D8CEBE] bg-[#F8F5EF]/70 px-6 py-10 text-center ${className}`}>
      {Icon && (
        <div className="metric-icon bg-[#2563EB]/10">
          <Icon size={22} className="text-[#2563EB]" />
        </div>
      )}
      <p className="mt-4 font-bold text-neutral-800">{title}</p>
      <p className="mt-1 max-w-md text-sm leading-6 text-neutral-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
