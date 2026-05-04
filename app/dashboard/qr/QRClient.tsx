"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Printer, Instagram, MessageCircle, Globe } from "lucide-react";

type Props = { name: string; slug: string };

export function QRClient({ name, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== "undefined" ? window.location.origin : "")}/r/${slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div>
        <p className="text-sm text-neutral-500">Panel de control</p>
        <h1 className="text-4xl font-black">QR de reservas</h1>
        <p className="mt-1 text-neutral-500">
          Comparte este QR en Instagram, WhatsApp, Google o en tu local. Tus clientes reservan en 30 segundos.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* QR card */}
        <div className="flex w-full flex-col items-center gap-5 rounded-3xl border border-neutral-200 bg-white p-6 lg:w-72 lg:shrink-0">
          <img
            src={qrUrl}
            alt={`QR de reservas de ${name}`}
            className="w-full max-w-[260px] rounded-2xl"
          />
          <div className="text-center">
            <p className="font-black text-neutral-950">{name}</p>
            <p className="mt-0.5 text-xs text-neutral-400">Escanear para reservar</p>
          </div>
          <a
            href={qrUrl}
            download={`qr-reservas-${slug}.png`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 py-3 text-sm font-bold text-white hover:bg-red-800"
          >
            <Printer size={15} /> Descargar QR
          </a>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">

          {/* Enlace */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="font-black text-neutral-950">Tu enlace de reservas</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Copia y pega este link donde quieras. Tus clientes reservan sin crear cuenta.
            </p>
            <div className="mt-4 flex min-w-0 items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <span className="min-w-0 flex-1 break-all font-mono text-sm text-neutral-700">{publicUrl}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-xl border border-neutral-200 p-2 hover:bg-neutral-100"
                title="Copiar enlace"
              >
                {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-xl border border-neutral-200 p-2 hover:bg-neutral-100"
                title="Abrir página pública"
              >
                <ExternalLink size={15} />
              </a>
            </div>
            {copied && (
              <p className="mt-2 text-xs font-semibold text-green-600">✓ Enlace copiado al portapapeles</p>
            )}
          </div>

          {/* Cómo usarlo */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="font-black text-neutral-950">Dónde compartirlo</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { icon: Instagram,      color: "bg-pink-50 text-pink-600",    title: "Instagram",    text: "Añade el link en tu bio y comparte el QR en historias." },
                { icon: MessageCircle,  color: "bg-green-50 text-green-700",  title: "WhatsApp",     text: "Envía el link a grupos y clientes para reservas directas." },
                { icon: Globe,          color: "bg-blue-50 text-blue-700",    title: "Google Maps",  text: "Añade el link de reservas en tu ficha de Google Business." },
                { icon: Printer,        color: "bg-neutral-100 text-neutral-600", title: "Tu local", text: "Imprime el QR y colócalo en el mostrador o la vitrina." },
              ].map(({ icon: Icon, color, title, text }) => (
                <div key={title} className="flex gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-neutral-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
