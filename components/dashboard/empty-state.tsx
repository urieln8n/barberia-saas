import type { LucideIcon } from "lucide-react";

type Props = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-6 py-12 text-center">
      {Icon && (
        <div className="metric-icon bg-[#2F6FEB]/10">
          <Icon size={22} className="text-[#2F6FEB]" />
        </div>
      )}
      <p className="mt-4 font-bold text-neutral-700">{title}</p>
      <p className="mt-1 max-w-md text-sm leading-6 text-neutral-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
