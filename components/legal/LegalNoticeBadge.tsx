import { AlertTriangle } from "lucide-react";

export function LegalNoticeBadge() {
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-800">
      <AlertTriangle size={14} className="shrink-0" />
      <span>Documento modelo pendiente de revisión legal profesional</span>
    </div>
  );
}
