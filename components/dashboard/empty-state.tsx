import type { LucideIcon } from "lucide-react";

type Props = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="mt-5 flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-[#F5F2EA]/60 px-6 py-12 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C89B3C]/10">
          <Icon size={22} className="text-[#C89B3C]" />
        </div>
      )}
      <p className="mt-4 font-semibold text-neutral-600">{title}</p>
      <p className="mt-1 text-sm text-neutral-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
