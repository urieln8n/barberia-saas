"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Props = {
  message: string;
};

export function CopyAvailabilityMessageButton({ message }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn-outline min-h-0 px-3 py-2"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copiado" : "Copiar mensaje"}
    </button>
  );
}
