"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function BookingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[BookingError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#FAFAF7] p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
        <AlertTriangle size={28} className="text-amber-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-[#09090B]">No pudimos cargar la reserva</h2>
        <p className="max-w-sm text-sm text-[#52525B]">
          Puede ser un error temporal. No se ha realizado ningún cargo.
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#09090B] transition-opacity hover:opacity-80"
      >
        <RefreshCw size={16} />
        Volver a intentar
      </button>
    </div>
  );
}
