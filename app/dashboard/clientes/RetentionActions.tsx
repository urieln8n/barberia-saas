"use client";

import { useState } from "react";
import { CalendarPlus, Copy } from "lucide-react";
import { buildRetentionMessage } from "@/src/lib/retention/messages";

type Props = {
  clientName: string;
  bookingUrl: string;
  canReserveAgain: boolean;
};

export function RetentionActions({
  clientName,
  bookingUrl,
  canReserveAgain,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    const message = buildRetentionMessage({
      name: clientName,
      bookingUrl,
    });

    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
      {canReserveAgain && (
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.10] px-3 py-2 text-xs font-bold text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.18]"
        >
          <CalendarPlus size={14} />
          Reservar de nuevo
        </a>
      )}
      <button
        type="button"
        onClick={copyMessage}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.10] px-3 py-2 text-xs font-bold text-white/50 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
      >
        <Copy size={14} />
        {copied ? "Mensaje copiado" : "Copiar mensaje para volver"}
      </button>
    </div>
  );
}
