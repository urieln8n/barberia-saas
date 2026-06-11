"use client";

import { useEffect } from "react";
import { CalendarX, RefreshCw } from "lucide-react";

export default function ReservasError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ReservasError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#B88917]/20 bg-[#B88917]/10">
        <CalendarX size={28} className="text-[#D4AF37]" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-[#09090B]">No pudimos cargar las reservas</h2>
        <p className="max-w-sm text-sm text-[#52525B]">
          Puede ser un problema temporal de conexión con el servidor.
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#09090B] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-80"
      >
        <RefreshCw size={16} />
        Reintentar
      </button>
    </div>
  );
}
