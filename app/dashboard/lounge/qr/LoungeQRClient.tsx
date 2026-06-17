"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Printer,
  QrCode,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

type Props = {
  barbershopName: string;
  barbershopSlug: string;
  loungeUrl: string;
};

export function LoungeQRClient({ barbershopName, barbershopSlug, loungeUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const qrImageUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
        loungeUrl
      )}&margin=20`,
    [loungeUrl]
  );

  async function handleCopy() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(loungeUrl);
      } else {
        const ta = document.createElement("textarea");
        ta.value = loungeUrl;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // silently fail
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lounge QR"
        title="QR del BarberíaOS Lounge"
        description="Imprime este QR y colócalo en tu sala de espera, espejo o mostrador para que tus clientes lo escaneen mientras esperan."
        action={
          <Link href="/dashboard/lounge" className="btn-outline">
            <ArrowLeft size={15} /> Volver al Lounge
          </Link>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── QR grande ── */}
        <div className="flex w-full flex-col items-center gap-5 rounded-[28px] border border-white/[0.07] bg-[#0E0E1C] p-6 lg:w-96 lg:shrink-0">
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                Lounge QR
              </p>
              <h2 className="mt-0.5 font-black text-white/90">QR del Lounge</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
              <QrCode size={18} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Image
              src={qrImageUrl}
              alt={`QR Lounge de ${barbershopName}`}
              width={300}
              height={300}
              unoptimized
              className="w-full max-w-[260px] rounded-2xl border border-white/[0.08]"
            />
            <div className="text-center">
              <p className="font-black text-white/90">{barbershopName}</p>
              <p className="mt-0.5 text-xs text-white/45">Escanear para ver el Lounge</p>
            </div>
          </div>

          <div className="grid w-full gap-2">
            <a
              href={qrImageUrl}
              download={`qr-lounge-${barbershopSlug}.png`}
              className="btn-dark"
            >
              <Download size={15} /> Descargar QR
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-outline"
            >
              <Printer size={15} /> Imprimir cartel
            </button>
          </div>

          {/* Enlace copiable */}
          <div className="w-full">
            <p className="mb-2 text-xs font-bold text-white/45">URL del Lounge</p>
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5">
              <span className="min-w-0 flex-1 break-all font-mono text-[11px] text-white/55">
                {loungeUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                title="Copiar enlace"
                className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.05] p-1.5 transition-colors hover:bg-white/[0.09]"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} className="text-white/45" />
                )}
              </button>
              <a
                href={loungeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.05] p-1.5 transition-colors hover:bg-white/[0.09]"
                title="Abrir Lounge"
              >
                <ExternalLink size={14} className="text-white/45" />
              </a>
            </div>
            {copied && (
              <p className="mt-1.5 text-xs font-semibold text-emerald-400">
                Enlace copiado al portapapeles
              </p>
            )}
          </div>
        </div>

        {/* ── Instrucciones + Cartel premium ── */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* Instrucciones */}
          <div className="surface-frame p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-[#C9922A]" />
              <p className="label-section">Dónde colocar el QR del Lounge</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  lugar: "Sala de espera",
                  detalle: "Ponlo en la silla de espera o en la pared a la vista del cliente.",
                },
                {
                  lugar: "Espejo del puesto",
                  detalle: "El cliente lo ve mientras le cortas. Puede escanear sin moverse.",
                },
                {
                  lugar: "Mostrador de entrada",
                  detalle: "El primer punto de contacto. Aprovecha para que exploren el Lounge.",
                },
                {
                  lugar: "Productos y accesorios",
                  detalle: "Al lado de los productos que vendes. El Lounge amplía la info.",
                },
              ].map(({ lugar, detalle }) => (
                <div
                  key={lugar}
                  className="rounded-2xl border border-[#D5A84C]/15 bg-[#FDF8EE] p-4"
                >
                  <p className="text-sm font-black text-[#080A0F]">{lugar}</p>
                  <p className="mt-1 text-xs leading-5 text-[#080A0F]/60">{detalle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview cartel premium */}
          <div
            className="relative overflow-hidden rounded-[28px] border border-[#D5A84C]/30 p-8 text-center shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, #0F2040 0%, #1A3A6B 50%, #0B1A2E 100%)",
            }}
          >
            {/* Gold accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(212,175,102,0.7) 50%, transparent 100%)",
              }}
            />

            <div className="flex flex-col items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#D4AF66]/40 bg-[#D4AF66]/15">
                <QrCode size={28} className="text-[#D4AF66]" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF66]">
                  BarberíaOS Lounge
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {barbershopName}
                </h3>
                <p className="mt-2 text-sm font-semibold text-white/60">
                  Mientras esperas, descubre más
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="h-24 w-24 rounded-2xl border-2 border-[#D4AF66]/50 bg-white/10 p-2 backdrop-blur-sm">
                  <div className="h-full w-full rounded-xl border border-white/20 bg-white/5" />
                </div>
                <p className="text-xs font-bold text-white/50">Escanea para reservar, ver productos y más</p>
              </div>

              <div className="grid w-full gap-2 text-left">
                {["Reservar próxima cita", "Ver servicios y upgrades", "Dejar reseña en Google"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF66]" />
                      {item}
                    </div>
                  )
                )}
              </div>

              <p className="text-[11px] font-semibold text-white/30">
                Powered by BarberíaOS
              </p>
            </div>
          </div>

          {/* CTA actions */}
          <div className="flex flex-wrap gap-3">
            <a
              href={loungeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark"
            >
              <ExternalLink size={15} /> Ver Lounge público
            </a>
            <Link href="/dashboard/lounge" className="btn-outline">
              Configurar Lounge <ArrowRight size={14} />
            </Link>
            <Link href="/dashboard/qr" className="btn-outline">
              QR de reservas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
