"use client";

import Image from "next/image";
import { useState } from "react";
import { Copy, Check, ExternalLink, Printer, Instagram, MessageCircle, Globe } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

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
    <div className="space-y-5">
      <PageHeader
        section="QR Reservas"
        title="Tu código QR"
        description="Comparte este QR en Instagram, WhatsApp, Google o en tu local. Tus clientes reservan en 30 segundos."
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        {/* QR card */}
        <div className="flex w-full flex-col items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:w-72 lg:shrink-0">
          <Image
            src={qrUrl}
            alt={`QR de reservas de ${name}`}
            width={300}
            height={300}
            unoptimized
            className="w-full max-w-[260px] rounded-2xl"
          />

          <div className="text-center">
            <p className="font-black text-[#111827]">{name}</p>
            <p className="mt-0.5 text-xs text-neutral-400">Escanear para reservar</p>
          </div>

          <a
            href={qrUrl}
            download={`qr-reservas-${slug}.png`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0F172A]"
          >
            <Printer size={15} /> Descargar QR
          </a>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {/* Enlace */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">Enlace público</p>
            <h2 className="mt-0.5 font-black text-[#111827]">Tu enlace de reservas</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Copia y pega este link donde quieras. Tus clientes reservan sin crear cuenta.
            </p>

            <div className="mt-4 flex min-w-0 items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
              <span className="min-w-0 flex-1 break-all font-mono text-sm text-neutral-700">{publicUrl}</span>

              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-xl border border-[#E5E7EB] p-2 transition-colors hover:bg-white"
                title="Copiar enlace"
              >
                {copied ? (
                  <Check size={15} className="text-green-600" />
                ) : (
                  <Copy size={15} className="text-neutral-500" />
                )}
              </button>

              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-xl border border-[#E5E7EB] p-2 transition-colors hover:bg-white"
                title="Abrir página pública"
              >
                <ExternalLink size={15} className="text-neutral-500" />
              </a>
            </div>

            {copied && (
              <p className="mt-2 text-xs font-semibold text-green-600">✓ Enlace copiado al portapapeles</p>
            )}
          </div>

          {/* Dónde compartirlo */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">Distribución</p>
            <h2 className="mt-0.5 font-black text-[#111827]">Dónde compartirlo</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Instagram,
                  color: "bg-pink-50 text-pink-600",
                  title: "Instagram",
                  text: "Añade el link en tu bio y comparte el QR en historias.",
                },
                {
                  icon: MessageCircle,
                  color: "bg-green-50 text-green-700",
                  title: "WhatsApp",
                  text: "Envía el link a grupos y clientes para reservas directas.",
                },
                {
                  icon: Globe,
                  color: "bg-blue-50 text-blue-700",
                  title: "Google Maps",
                  text: "Añade el link de reservas en tu ficha de Google Business.",
                },
                {
                  icon: Printer,
                  color: "bg-[#2F6FEB]/10 text-[#2F6FEB]",
                  title: "Tu local",
                  text: "Imprime el QR y colócalo en el mostrador o la vitrina.",
                },
              ].map(({ icon: Icon, color, title, text }) => (
                <div key={title} className="flex gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC]/50 p-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">{title}</p>
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