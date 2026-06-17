"use client";

import { useEffect } from "react";
import { CalendarX, RefreshCw } from "lucide-react";

export default function AgendaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AgendaError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
        <CalendarX size={22} className="text-red-400" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-black text-white">No pudimos cargar la agenda</h2>
        <p className="max-w-sm text-sm text-white/40">
          Puede ser un problema temporal. Tus citas están a salvo.
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.06] px-4 text-sm font-bold text-white/70 transition hover:bg-white/[0.10]"
      >
        <RefreshCw size={15} />
        Reintentar
      </button>
    </div>
  );
}
