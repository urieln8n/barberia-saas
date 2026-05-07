import { AlertTriangle } from "lucide-react";

type AdminDataErrorProps = {
  title?: string;
  message: string;
};

export function AdminDataError({
  title = "No se pudieron cargar los datos",
  message,
}: AdminDataErrorProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
