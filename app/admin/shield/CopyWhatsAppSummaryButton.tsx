"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyWhatsAppSummaryButton({
  text,
  className = "btn-gold w-full",
  idleLabel = "Copiar resumen WhatsApp",
  copiedLabel = "Resumen copiado",
}: {
  text: string;
  className?: string;
  idleLabel?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function copy() {
    setError(false);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(true);
    }
  }

  return (
    <div className="space-y-1">
      <button type="button" onClick={copy} className={className}>
        <Copy size={14} />
        {copied ? copiedLabel : idleLabel}
      </button>
      {error && (
        <p className="text-xs font-semibold text-red-600 print:hidden">
          No se pudo copiar. Revisa los permisos del navegador.
        </p>
      )}
    </div>
  );
}
