"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

type Props = {
  message: string;
};

export function CustomerCopyMessageButton({ message }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950"
    >
      <Copy size={15} />
      {copied ? "Mensaje copiado" : "Copiar mensaje para volver"}
    </button>
  );
}
