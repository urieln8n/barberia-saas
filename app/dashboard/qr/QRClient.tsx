"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Instagram,
  MessageCircle,
  Printer,
  QrCode,
  Scissors,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";

type Props = { name: string; slug: string };

type CopyKey =
  | "publicUrl"
  | "instagramText"
  | "instagramLink"
  | "whatsapp"
  | "google"
  | "widget";

const configuredAppUrl = getConfiguredSiteUrl();

export function QRClient({ name, slug }: Props) {
  const [appUrl] = useState(configuredAppUrl);
  const [copied, setCopied] = useState<CopyKey | null>(null);

  const publicUrl = `${appUrl}/r/${slug}`;
  const instagramText = "Reserva tu cita online aquí";
  const whatsappMessage = `Hola  Puedes reservar tu cita en nuestra barbería desde este enlace: ${publicUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
  const widgetSnippet = `<a href="${publicUrl}">Reservar cita</a>`;

  const qrUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        publicUrl
      )}`,
    [publicUrl]
  );

  async function copyToClipboard(key: CopyKey, text: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 2500);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Canales de reserva"
        title="QR de reservas online"
        description="Comparte este QR en Instagram, WhatsApp, Google o en el mostrador para recibir reservas sin responder mensajes manualmente."
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col items-center gap-5 rounded-[28px] border border-white/[0.08] bg-[#0E0E1C] p-6 lg:w-96 lg:shrink-0">
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">QR</p>
              <h2 className="mt-0.5 font-black text-white">QR de reservas</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
              <QrCode size={18} />
            </div>
          </div>

          <Image
            src={qrUrl}
            alt={`QR de reservas de ${name}`}
            width={300}
            height={300}
            unoptimized
            className="w-full max-w-[260px] rounded-2xl"
          />

          <div className="text-center">
            <p className="font-black text-white">{name}</p>
            <p className="mt-0.5 text-xs text-white/50">Escanear para reservar</p>
          </div>

          <div className="grid w-full gap-2">
            <a
              href={qrUrl}
              download={`qr-reservas-${slug}.png`}
              className="btn-dark"
            >
              <Download size={15} /> Descargar QR
            </a>
            <button type="button" onClick={() => window.print()} className="btn-outline">
              <Printer size={15} /> Imprimir cartel
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Enlace público</p>
            <h2 className="mt-0.5 font-black text-white">Tu enlace de reservas</h2>
            <p className="mt-1 text-sm text-white/50">
              Copia y pega este link donde quieras. Tus clientes reservan sin crear cuenta.
            </p>

            <div className="mt-4 flex min-w-0 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
              <span className="min-w-0 flex-1 break-all font-mono text-sm text-white/70">{publicUrl}</span>

              <button
                type="button"
                onClick={() => copyToClipboard("publicUrl", publicUrl)}
                className="shrink-0 rounded-xl border border-white/[0.10] p-2 transition-colors hover:bg-white/[0.06]"
                title="Copiar enlace"
              >
                {copied === "publicUrl" ? (
                  <Check size={15} className="text-emerald-400" />
                ) : (
                  <Copy size={15} className="text-white/40" />
                )}
              </button>

              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-xl border border-white/[0.10] p-2 transition-colors hover:bg-white/[0.06]"
                title="Abrir página pública"
              >
                <ExternalLink size={15} className="text-white/40" />
              </a>
            </div>

            {copied === "publicUrl" && (
              <p className="mt-2 text-xs font-semibold text-emerald-400">✓ Enlace copiado al portapapeles</p>
            )}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ChannelCard
              icon={Instagram}
              iconClassName="bg-pink-500/[0.10] text-pink-400"
              title="Consigue reservas desde Instagram"
              description="Pega este enlace en la bio de Instagram."
              body={instagramText}
              actions={
                <>
                  <CopyButton
                    copied={copied === "instagramText"}
                    label="Copiar texto"
                    onClick={() => copyToClipboard("instagramText", instagramText)}
                  />
                  <CopyButton
                    copied={copied === "instagramLink"}
                    label="Copiar enlace"
                    onClick={() => copyToClipboard("instagramLink", publicUrl)}
                  />
                </>
              }
            />

            <ChannelCard
              icon={MessageCircle}
              iconClassName="bg-emerald-500/[0.10] text-emerald-400"
              title="Convierte WhatsApp en canal de reservas"
              description="Envía este mensaje a clientes o grupos."
              body={whatsappMessage}
              actions={
                <>
                  <CopyButton
                    copied={copied === "whatsapp"}
                    label="Copiar"
                    onClick={() => copyToClipboard("whatsapp", whatsappMessage)}
                  />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.08]"
                  >
                    <ExternalLink size={15} /> Abrir WhatsApp
                  </a>
                </>
              }
            />

            <ChannelCard
              icon={Globe}
              iconClassName="bg-blue-500/[0.10] text-blue-400"
              title="Añade tu botón de citas en Google"
              description="Añade este enlace como URL de citas en tu perfil de Google Business."
              body={publicUrl}
              actions={
                <CopyButton
                  copied={copied === "google"}
                  label="Copiar enlace"
                  onClick={() => copyToClipboard("google", publicUrl)}
                />
              }
            />

            <ChannelCard
              icon={Scissors}
              iconClassName="bg-[#D4AF37]/10 text-[#D4AF37]"
              title="Widget web simple"
              description="Usa este enlace como botón básico en tu web."
              body={widgetSnippet}
              code
              actions={
                <CopyButton
                  copied={copied === "widget"}
                  label="Copiar snippet"
                  onClick={() => copyToClipboard("widget", widgetSnippet)}
                />
              }
            />
          </div>

          <SectionCard
            title="Dónde colocar el QR"
            description="Consejos rápidos para convertir tráfico del local y canales sociales en reservas."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {["Recepción", "Espejo", "Instagram", "WhatsApp", "Google"].map((place) => (
                <div key={place} className="rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] p-4 text-sm font-black text-white/80">
                  Pon este QR en {place}.
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function ChannelCard({
  icon: Icon,
  iconClassName,
  title,
  description,
  body,
  actions,
  code = false,
}: {
  icon: typeof Instagram;
  iconClassName: string;
  title: string;
  description: string;
  body: string;
  actions: React.ReactNode;
  code?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-[#0E0E1C] p-5">
      <div className="flex gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <h3 className="font-black leading-snug text-white">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-white/50">{description}</p>
        </div>
      </div>

      <div
        className={`mt-4 min-h-[76px] rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-sm leading-6 text-white/70 ${
          code ? "break-all font-mono text-xs" : "break-words"
        }`}
      >
        {body}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">{actions}</div>
    </div>
  );
}

function CopyButton({
  copied,
  label,
  onClick,
}: {
  copied: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/[0.08]"
    >
      {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
      {copied ? "Copiado" : label}
    </button>
  );
}
