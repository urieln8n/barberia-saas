"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

type Props = { name: string; slug: string };

export function QRClient({ name, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "")}/r/${slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicUrl)}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div>
        <p className="text-sm text-neutral-500">Panel de control</p>
        <h1 className="text-4xl font-black">QR de reservas</h1>
      </div>

      <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-start">
        {/* QR */}
        <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-4 sm:p-8 lg:w-auto">
          <img
            src={qrUrl}
            alt={`QR de reservas para ${name}`}
            className="w-full max-w-[250px] rounded-2xl"
          />
          <p className="text-sm font-semibold text-neutral-600">{name}</p>
          <a
            href={qrUrl}
            download={`qr-${slug}.png`}
            className="w-full rounded-2xl border border-neutral-200 px-5 py-2.5 text-center text-sm font-semibold hover:bg-neutral-50 sm:w-auto"
          >
            Descargar QR
          </a>
        </div>

        {/* Info */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-bold">Tu enlace de reservas</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Comparte este enlace en Instagram, Google, WhatsApp o imprímelo en tu barbería.
            </p>
            <div className="mt-4 flex min-w-0 items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <span className="min-w-0 flex-1 break-all text-sm text-neutral-700">{publicUrl}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-xl p-1.5 hover:bg-neutral-200"
                title="Copiar enlace"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-xl p-1.5 hover:bg-neutral-200"
                title="Abrir en nueva pestaña"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-bold">Cómo usarlo</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">1</span>
                Descarga el QR e imprímelo en tu local.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">2</span>
                Añade el enlace en la bio de Instagram y en Google Maps.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">3</span>
                Envíalo por WhatsApp a tus clientes para reservas directas.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
