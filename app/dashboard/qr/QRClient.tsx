"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

type Props = { name: string; slug: string };

type CopyKey =
  | "publicUrl"
  | "instagramText"
  | "instagramLink"
  | "whatsapp"
  | "google"
  | "widget";

const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

export function QRClient({ name, slug }: Props) {
  const [appUrl, setAppUrl] = useState(configuredAppUrl ?? "");
  const [copied, setCopied] = useState<CopyKey | null>(null);

  useEffect(() => {
    if (!configuredAppUrl && typeof window !== "undefined") {
      setAppUrl(window.location.origin);
    }
  }, []);

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
        title="Reservas online"
        description="Comparte tu link público, QR y mensajes listos para captar citas desde Instagram, WhatsApp, Google y tu web."
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col items-center gap-5 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[var(--shadow-card)] lg:w-96 lg:shrink-0">
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">QR</p>
              <h2 className="mt-0.5 font-black text-[#111827]">QR de reservas</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111827] text-white">
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
            <p className="font-black text-[#111827]">{name}</p>
            <p className="mt-0.5 text-xs text-neutral-400">Escanear para reservar</p>
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
                onClick={() => copyToClipboard("publicUrl", publicUrl)}
                className="shrink-0 rounded-xl border border-[#E5E7EB] p-2 transition-colors hover:bg-white"
                title="Copiar enlace"
              >
                {copied === "publicUrl" ? (
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

            {copied === "publicUrl" && (
              <p className="mt-2 text-xs font-semibold text-green-600">✓ Enlace copiado al portapapeles</p>
            )}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ChannelCard
              icon={Instagram}
              iconClassName="bg-pink-50 text-pink-600"
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
              iconClassName="bg-green-50 text-green-700"
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
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-[#F8FAFC]"
                  >
                    <ExternalLink size={15} /> Abrir WhatsApp
                  </a>
                </>
              }
            />

            <ChannelCard
              icon={Globe}
              iconClassName="bg-blue-50 text-blue-700"
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
              iconClassName="bg-[#2F6FEB]/10 text-[#2F6FEB]"
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
                <div key={place} className="rounded-2xl border border-[#2563EB]/10 bg-[#2563EB]/5 p-4 text-sm font-black text-[#080A0F]">
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
    <div className="flex min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <h3 className="font-black leading-snug text-[#111827]">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-neutral-500">{description}</p>
        </div>
      </div>

      <div
        className={`mt-4 min-h-[76px] rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-sm leading-6 text-neutral-700 ${
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
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-[#F8FAFC]"
    >
      {copied ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
      {copied ? "Copiado" : label}
    </button>
  );
}
