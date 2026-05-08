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
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#D9B766]/40 bg-[#FFFBEB] px-3 py-2 text-xs font-bold text-[#8A641F] transition hover:bg-[#FEF3C7]"
        >
          <CalendarPlus size={14} />
          Reservar de nuevo
        </a>
      )}
      <button
        type="button"
        onClick={copyMessage}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-bold text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-950"
      >
        <Copy size={14} />
        {copied ? "Mensaje copiado" : "Copiar mensaje para volver"}
      </button>
    </div>
  );
}
