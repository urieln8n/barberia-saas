import { ShieldCheck } from "lucide-react";

export function LegalNoticeBadge() {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-800">
      <ShieldCheck size={14} className="shrink-0" />
      <span>Información legal publicada para clientes y usuarios</span>
    </div>
  );
}
