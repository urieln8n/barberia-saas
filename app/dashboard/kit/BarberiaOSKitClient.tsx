"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Instagram,
  MessageCircle,
  PackageCheck,
  Printer,
  QrCode,
  ReceiptText,
  ScanBarcode,
  ShieldCheck,
  Smartphone,
  Tablet,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";

type Props = {
  name: string;
  slug: string;
  servicesCount: number;
  barbersCount: number;
  appointmentsCount: number;
};

type CopyKey = "publicUrl" | "instagramText" | "whatsappText";
type LocalStepKey = "posterDownloaded" | "instagramUpdated";

const appUrl = getConfiguredSiteUrl();

const materialCards = [
  {
    title: "Cartel A4 para mostrador",
    description: "Para colocar junto a caja o recepción y reducir preguntas repetidas.",
    format: "A4 · mostrador",
  },
  {
    title: "Pegatina QR para espejo",
    description: "Visible mientras el cliente espera o termina el servicio.",
    format: "Sticker · espejo",
  },
  {
    title: "Flyer para clientes",
    description: "Una pieza pequeña para entregar al salir y traerlos de vuelta al link.",
    format: "A6 · mano",
  },
  {
    title: "Historia de Instagram",
    description: "Mensaje listo para recordar que la reserva online está activa.",
    format: "Story · 9:16",
  },
] as const;

const hardwareCards = [
  {
    title: "Tablet",
    description: "Para agenda rápida en mostrador o zona de caja. Mejor 10 pulgadas o más.",
    icon: Tablet,
  },
  {
    title: "Soporte de tablet",
    description: "Base estable y visible para consultar reservas sin ocupar espacio de trabajo.",
    icon: Smartphone,
  },
  {
    title: "Impresora de tickets",
    description: "Recomendada si la barbería imprime comprobantes o cierres diarios.",
    icon: Printer,
  },
  {
    title: "Cajón portamonedas",
    description: "Útil si el local trabaja con efectivo y necesita cierre de caja ordenado.",
    icon: WalletCards,
  },
  {
    title: "Lector de código de barras",
    description: "Para acelerar ventas de productos cuando el inventario crece.",
    icon: ScanBarcode,
  },
] as const;

export function BarberiaOSKitClient({
  name,
  slug,
  servicesCount,
  barbersCount,
  appointmentsCount,
}: Props) {
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [localSteps, setLocalSteps] = useState<Record<LocalStepKey, boolean>>({
    posterDownloaded: false,
    instagramUpdated: false,
  });

  const publicUrl = `${appUrl}/r/${slug}`;
  const qrUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(
        publicUrl
      )}`,
    [publicUrl]
  );
  const instagramText = `Reservas online activas en ${name}. Elige servicio, barbero y hora desde el enlace de la bio: ${publicUrl}`;
  const whatsappText = `Hola, ya puedes reservar tu cita en ${name} desde este enlace: ${publicUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  useEffect(() => {
    const stored = window.localStorage.getItem(`barberiaos-kit-${slug}`);
    if (!stored) return;

    try {
      setLocalSteps(JSON.parse(stored) as Record<LocalStepKey, boolean>);
    } catch {
      window.localStorage.removeItem(`barberiaos-kit-${slug}`);
    }
  }, [slug]);

  function updateLocalStep(key: LocalStepKey, value: boolean) {
    const next = { ...localSteps, [key]: value };
    setLocalSteps(next);
    window.localStorage.setItem(`barberiaos-kit-${slug}`, JSON.stringify(next));
  }

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
    if (key === "instagramText") updateLocalStep("instagramUpdated", true);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 2200);
  }

  const checklist = [
    { label: "Barbería creada", done: true, detail: name },
    { label: "Servicios añadidos", done: servicesCount > 0, detail: `${servicesCount} servicios` },
    { label: "Barberos añadidos", done: barbersCount > 0, detail: `${barbersCount} barberos` },
    { label: "Enlace de reservas activo", done: Boolean(slug), detail: `/r/${slug}` },
    { label: "QR generado", done: Boolean(slug), detail: "Listo para imprimir" },
    { label: "Cartel QR descargado", done: localSteps.posterDownloaded, detail: "Material físico" },
    { label: "Instagram actualizado", done: localSteps.instagramUpdated, detail: "Bio o story" },
    { label: "Primera reserva creada", done: appointmentsCount > 0, detail: `${appointmentsCount} reservas` },
  ];
  const completedCount = checklist.filter((item) => item.done).length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Activación física y digital"
        title="BarberíaOS Kit"
        description="Un centro de activación para llevar tu enlace de reservas al mostrador, espejos, Instagram, WhatsApp y setup recomendado de la barbería."
        action={
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
            Abrir página pública <ExternalLink size={15} />
          </a>
        }
      />

      <section className="overflow-hidden rounded-[28px] border border-[#BBD7FF] bg-gradient-to-br from-[#07111f] via-[#0D1B2E] to-[#112C55] shadow-[0_24px_80px_rgba(37,99,235,0.16)]">
        <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-3 py-1 text-xs font-black uppercase text-[#BDEBFF]">
              <PackageCheck size={14} />
              Kit de activación
            </div>
            <h2 className="mt-5 text-3xl font-black leading-tight text-white md:text-5xl">
              QR, carteles y mensajes listos para convertir clientes en reservas.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 md:text-base">
              BarberíaOS Kit no promete hardware propio: reúne software, enlace público,
              QR, materiales imprimibles, textos para compartir y recomendaciones de setup.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["Activación", `${completedCount}/8 pasos`],
                ["Canal principal", "QR + link"],
                ["Setup", "Recomendado"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <p className="text-[10px] font-black uppercase text-white/38">{label}</p>
                  <p className="mt-2 text-lg font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] border border-white/12 bg-white p-4 shadow-2xl">
            <div className="rounded-[22px] border border-[#DCEBFF] bg-[#F8FBFF] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-[#2563EB]">Reservas online</p>
                  <p className="mt-1 font-black text-[#080A0F]">{name}</p>
                </div>
                <QrCode size={23} className="text-[#2563EB]" />
              </div>
              <Image
                src={qrUrl}
                alt={`QR de reservas de ${name}`}
                width={420}
                height={420}
                unoptimized
                className="mx-auto mt-4 w-full max-w-[250px] rounded-2xl"
              />
              <p className="mt-4 break-all rounded-2xl border border-[#DCEBFF] bg-white px-4 py-3 font-mono text-xs text-slate-600">
                {publicUrl}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
        <SectionCard
          title="Checklist de activación"
          description="Lo mínimo para que el dueño perciba el valor físico y digital del sistema."
          bodyClassName="p-4 md:p-5"
        >
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  item.done
                    ? "border-[#2F6FEB]/18 bg-[#2F6FEB]/5"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    item.done ? "bg-[#2563EB] text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Check size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-[#111827]">{item.label}</p>
                  <p className="text-xs font-semibold text-slate-500">{item.detail}</p>
                </div>
                {!item.done && (
                  <span className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-black uppercase text-slate-500">
                    Pendiente
                  </span>
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Acciones rápidas"
          description="Comparte el enlace, descarga el QR y prepara Instagram o WhatsApp en segundos."
          bodyClassName="p-4 md:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionButton
              icon={Copy}
              label={copied === "publicUrl" ? "Enlace copiado" : "Copiar enlace"}
              onClick={() => copyToClipboard("publicUrl", publicUrl)}
            />
            <a
              href={qrUrl}
              download={`qr-reservas-${slug}.png`}
              onClick={() => updateLocalStep("posterDownloaded", true)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#080A0F] px-4 py-3 text-sm font-black text-white transition hover:bg-[#172033]"
            >
              <Download size={16} /> Descargar QR
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
            >
              <MessageCircle size={16} /> Compartir por WhatsApp
            </a>
            <ActionButton
              icon={Instagram}
              label={copied === "instagramText" ? "Texto copiado" : "Copiar texto para Instagram"}
              onClick={() => copyToClipboard("instagramText", instagramText)}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-[#DCEBFF] bg-[#F8FBFF] p-4">
            <p className="text-xs font-black uppercase text-[#2563EB]">Texto sugerido</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{instagramText}</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Materiales del kit"
        description="Piezas pensadas para imprimir o adaptar con el QR actual de la barbería."
        bodyClassName="p-4 md:p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {materialCards.map((material) => (
            <article key={material.title} className="rounded-2xl border border-[#DCEBFF] bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-[#2563EB]">
                <ReceiptText size={19} />
              </div>
              <p className="text-[10px] font-black uppercase text-[#2563EB]">{material.format}</p>
              <h3 className="mt-2 font-black leading-snug text-[#111827]">{material.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{material.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Hardware recomendado"
        description="Setup orientativo para operar BarberíaOS en el local. Son recomendaciones, no hardware fabricado por BarberíaOS."
        bodyClassName="p-4 md:p-5"
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {hardwareCards.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#07111f] text-[#38BDF8]">
                <Icon size={19} />
              </div>
              <h3 className="font-black text-[#111827]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="rounded-2xl border border-[#DCEBFF] bg-[#F8FBFF] p-5">
        <div className="flex gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#2563EB]" />
          <p className="text-sm leading-6 text-slate-600">
            El kit usa tus datos actuales de BarberíaOS y el enlace público existente. No cambia base de datos,
            pagos, auth, Stripe, Supabase ni migraciones.
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#DCEBFF] bg-white px-4 py-3 text-sm font-black text-[#111827] transition hover:border-[#2563EB]/35 hover:bg-[#F8FBFF]"
    >
      <Icon size={16} className="text-[#2563EB]" /> {label}
    </button>
  );
}
