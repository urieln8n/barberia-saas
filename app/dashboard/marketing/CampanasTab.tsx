"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  Trash2,
  Plus,
  Megaphone,
  Calendar,
  Tag,
  Sparkles,
  QrCode,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { ServiceItem, BarberItem } from "./MarketingStudioClient";
import {
  resolveMarketingTemplate,
  getUnresolvedPlaceholders,
  type MarketingVariables,
} from "@/src/lib/marketing/variables";
import { addMarketingHistoryItem } from "@/src/lib/marketing/history";
import { createMarketingId } from "@/src/lib/marketing/id";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoCampana  = "descuento" | "reactivacion" | "evento" | "temporada";
type CanalCampana = "whatsapp" | "instagram" | "ambos";

type Campana = {
  id: string;
  canal: CanalCampana;
  tipo: TipoCampana;
  nombre: string;
  descuento?: number;
  servicio?: string;
  barber?: string;
  mencionar_qr?: boolean;
  fechaInicio: string;
  fechaFin: string;
  texto: string;
  creadaEn: string;
};

type GeneratorContext = {
  barbershopName: string | null;
  bookingUrl: string | null;
  city: string | null;
  phone: string | null;
};

type Props = {
  services: ServiceItem[];
  barbers: BarberItem[];
  barbershopName: string | null;
  bookingUrl: string | null;
  city: string | null;
  phone: string | null;
  onCopied?: () => void;
};

// ─── Generator helpers ────────────────────────────────────────────────────────

function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 9 && (digits.startsWith("6") || digits.startsWith("7"))) {
    return `34${digits}`;
  }
  if (digits.startsWith("34") && digits.length === 11) return digits;
  return digits;
}

export function generateFinalCTA(
  canal: CanalCampana,
  ctx: GeneratorContext,
): string {
  const url = ctx.bookingUrl ?? "[LINK_RESERVAS]";
  if (canal === "instagram" || canal === "ambos") {
    return `Reserva en nuestra bio 👆 o directo:\n${url}`;
  }
  const waLine =
    ctx.phone
      ? `\nO escríbeme directamente: wa.me/${formatPhoneForWhatsApp(ctx.phone)}`
      : "";
  return `Reserva ahora: ${url}${waLine}`;
}

export function generateWhatsAppMessage(
  draft: Omit<Campana, "id" | "texto" | "creadaEn">,
  ctx: GeneratorContext,
): string {
  const nombre   = ctx.barbershopName ?? "[NOMBRE_BARBERIA]";
  const desc     = draft.descuento ? `${draft.descuento}%` : null;
  const servicio = draft.servicio  || "todos los servicios";
  const periodo  = draft.fechaFin
    ? `Válido del ${draft.fechaInicio} al ${draft.fechaFin}`
    : draft.fechaInicio
      ? `Válido desde el ${draft.fechaInicio}`
      : "";
  const cta = generateFinalCTA("whatsapp", ctx);
  const qr  = draft.mencionar_qr ? "\nO escanea el QR del local para reservar. 📲" : "";

  switch (draft.tipo) {
    case "descuento":
      return [
        `✂️ ${(draft.nombre || "OFERTA").toUpperCase()} — ${nombre}`,
        "",
        desc
          ? `${desc} de descuento en ${servicio}.`
          : `Oferta especial en ${servicio}.`,
        periodo,
        "",
        `${cta}${qr}`,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

    case "reactivacion": {
      const barberLine = draft.barber
        ? `Tu barbero ${draft.barber} tiene hueco esta semana.`
        : "";
      return [
        `💈 ¡Hola [NOMBRE]! Hace tiempo que no te vemos por ${nombre} y te echamos de menos.`,
        "",
        barberLine,
        desc
          ? `Como cliente especial, te ofrecemos ${desc} de descuento en ${servicio}.`
          : `Tenemos una oferta esperándote en ${servicio}.`,
        periodo,
        "",
        `${cta}${qr}`,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();
    }

    case "evento":
      return [
        `🎉 ${(draft.nombre || "EVENTO").toUpperCase()}`,
        "",
        draft.fechaInicio ? `Fecha: ${draft.fechaInicio}` : "",
        draft.barber      ? `Con: ${draft.barber}`         : "",
        desc ? `Oferta especial: ${desc} de descuento` : "",
        "",
        "No te quedes sin sitio. Plazas limitadas.",
        "",
        `${cta}${qr}`,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

    case "temporada":
      return [
        `🍂 OFERTA DE TEMPORADA — ${nombre}`,
        "",
        desc
          ? `${desc} de descuento en ${servicio}.`
          : `Oferta de temporada en ${servicio}.`,
        periodo,
        "",
        "Compártelo con un amigo y os aplicamos el descuento a los dos. 👥",
        "",
        `${cta}${qr}`,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();
  }
}

export function generateInstagramCaption(
  draft: Omit<Campana, "id" | "texto" | "creadaEn">,
  ctx: GeneratorContext,
): string {
  if (draft.tipo === "temporada") return generateStoryText(draft, ctx);

  const nombre   = ctx.barbershopName ?? "[NOMBRE_BARBERIA]";
  const ciudad   = ctx.city ?? "[CIUDAD]";
  const desc     = draft.descuento ? `${draft.descuento}%` : null;
  const servicio = draft.servicio  || "todos los servicios";
  const periodo  = draft.fechaFin
    ? `Válido del ${draft.fechaInicio} al ${draft.fechaFin}`
    : draft.fechaInicio
      ? `Válido desde el ${draft.fechaInicio}`
      : "";
  const cta      = generateFinalCTA("instagram", ctx);
  const qr       = draft.mencionar_qr ? "\nO escanea el QR del local para reservar. 📲" : "";
  const slug     = ciudad.toLowerCase().replace(/\s+/g, "");

  switch (draft.tipo) {
    case "descuento":
      return [
        `✂️ ${(draft.nombre || "OFERTA ESPECIAL").toUpperCase()}`,
        "",
        desc
          ? `${desc} de descuento en ${servicio}.`
          : `Oferta especial en ${servicio}.`,
        periodo,
        "",
        `${cta}${qr}`,
        ".",
        `#barberia #${slug} #${nombre.toLowerCase().replace(/\s+/g, "")} #corte`,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

    case "reactivacion":
      return [
        `💈 VUELVE A ${nombre.toUpperCase()}`,
        "",
        desc ? `${desc} de descuento para ti.` : "Tenemos una oferta esperándote.",
        periodo,
        "",
        `${cta}${qr}`,
        ".",
        `#barberia #oferta #${slug}`,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

    case "evento":
      return [
        `🎉 ${(draft.nombre || "EVENTO ESPECIAL").toUpperCase()}`,
        "",
        draft.fechaInicio ? `Fecha: ${draft.fechaInicio}` : "",
        draft.barber      ? `Con: ${draft.barber}`         : "",
        desc ? `Oferta especial: ${desc} de descuento` : "",
        "No te quedes sin sitio.",
        "",
        `${cta}${qr}`,
        ".",
        `#barberia #evento #${slug}`,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

    // temporada handled above via generateStoryText
    default:
      return generateStoryText(draft, ctx);
  }
}

export function generateStoryText(
  draft: Omit<Campana, "id" | "texto" | "creadaEn">,
  ctx: GeneratorContext,
): string {
  const nombre   = ctx.barbershopName ?? "[NOMBRE_BARBERIA]";
  const ciudad   = ctx.city ?? "[CIUDAD]";
  const desc     = draft.descuento ? `${draft.descuento}%` : null;
  const servicio = draft.servicio  || "todos los servicios";
  const periodo  = draft.fechaFin
    ? `Válido hasta el ${draft.fechaFin}`
    : draft.fechaInicio
      ? `Desde el ${draft.fechaInicio}`
      : "";
  const cta  = generateFinalCTA("instagram", ctx);
  const qr   = draft.mencionar_qr ? "\nO escanea el QR del local para reservar. 📲" : "";
  const slug = ciudad.toLowerCase().replace(/\s+/g, "");

  return [
    `🍂 OFERTA DE TEMPORADA — ${nombre}`,
    "",
    desc
      ? `${desc} de descuento en ${servicio}.`
      : `Oferta de temporada en ${servicio}.`,
    periodo,
    "",
    "Compártelo con un amigo y os aplicamos el descuento a los dos. 👥",
    "",
    `${cta}${qr}`,
    ".",
    `#barberia #temporada #${slug} #${nombre.toLowerCase().replace(/\s+/g, "")}`,
  ]
    .filter(Boolean)
    .join("\n")
    .trim();
}

function generarTexto(
  draft: Omit<Campana, "id" | "texto" | "creadaEn">,
  ctx: GeneratorContext,
): string {
  if (draft.canal === "whatsapp") return generateWhatsAppMessage(draft, ctx);
  if (draft.canal === "instagram") return generateInstagramCaption(draft, ctx);
  // ambos
  const wa = generateWhatsAppMessage(draft, ctx);
  const ig = generateInstagramCaption(draft, ctx);
  return `${wa}\n\n— — Instagram — —\n\n${ig}`;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "mkt-campanas";

function loadCampanas(): Campana[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Campana[]) : [];
  } catch {
    return [];
  }
}

function saveCampanas(list: Campana[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const tipoBadge: Record<TipoCampana, { label: string; cls: string }> = {
  descuento:    { label: "Descuento",    cls: "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25"     },
  reactivacion: { label: "Reactivación", cls: "bg-purple-500/[0.08] text-purple-400 border-purple-500/20" },
  evento:       { label: "Evento",       cls: "bg-blue-500/[0.08] text-blue-400 border-blue-500/20"       },
  temporada:    { label: "Temporada",    cls: "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20" },
};

const canalLabel: Record<CanalCampana, string> = {
  whatsapp:  "WhatsApp",
  instagram: "Instagram",
  ambos:     "WhatsApp + Instagram",
};

function CampanaCard({
  campana,
  onDelete,
}: {
  campana: Campana;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(campana.texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const badge = tipoBadge[campana.tipo];

  return (
    <div
      className="flex flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.04]"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div className="min-w-0">
          <p className="truncate font-bold text-white">{campana.nombre}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${badge.cls}`}
            >
              {badge.label}
            </span>
            <span className="text-xs text-white/50">
              {canalLabel[campana.canal]}
            </span>
            {campana.fechaFin && (
              <span className="flex items-center gap-1 text-xs text-white/50">
                <Calendar size={11} />
                hasta {campana.fechaFin}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(campana.id)}
          title="Eliminar campaña"
          className="mt-0.5 shrink-0 rounded-xl p-1.5 text-white/30 transition-colors hover:bg-red-500/[0.08] hover:text-red-400"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Text preview */}
      <pre className="flex-1 whitespace-pre-wrap px-5 py-4 font-sans text-sm leading-6 text-white/60">
        {campana.texto}
      </pre>

      {/* Footer */}
      <div className="border-t border-white/[0.08] px-5 py-3">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all duration-150 ${
            copied
              ? "bg-emerald-500/[0.08] text-emerald-400"
              : "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/15"
          }`}
        >
          {copied ? (
            <>
              <Check size={14} /> ¡Copiado!
            </>
          ) : (
            <>
              <Copy size={14} /> Copiar texto
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const emptyDraft = {
  nombre:       "",
  tipo:         "descuento" as TipoCampana,
  descuento:    undefined as number | undefined,
  servicio:     "",
  barber:       "",
  mencionar_qr: false,
  fechaInicio:  "",
  fechaFin:     "",
  canal:        "whatsapp" as CanalCampana,
};

export function CampanasTab({
  services,
  barbers,
  barbershopName,
  bookingUrl,
  city,
  phone,
  onCopied,
}: Props) {
  const [campanas, setCampanas]         = useState<Campana[]>([]);
  const [draft, setDraft]               = useState({ ...emptyDraft });
  const [preview, setPreview]           = useState<string | null>(null);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [isCustomService, setIsCustomService] = useState(false);
  const [unresolvedInPreview, setUnresolvedInPreview] = useState<string[]>([]);

  useEffect(() => {
    setCampanas(loadCampanas());
  }, []);

  const ctx: GeneratorContext = { barbershopName, bookingUrl, city, phone };

  function handleGenerar() {
    const rawTexto = generarTexto(draft, ctx);
    const resolveVars: MarketingVariables = {
      shopName:            barbershopName,
      bookingUrl,
      city,
      phone,
      selectedServiceName: draft.servicio || null,
      selectedBarberName:  draft.barber   || null,
    };
    const resolved   = resolveMarketingTemplate(rawTexto, resolveVars);
    const unresolved = getUnresolvedPlaceholders(resolved);
    setPreview(resolved);
    setUnresolvedInPreview(unresolved);
    setCopiedPreview(false);
  }

  function handleGuardar() {
    if (!preview) return;
    const nueva: Campana = {
      id: createMarketingId(),
      ...draft,
      texto:    preview,
      creadaEn: new Date().toLocaleDateString("es-ES"),
    };
    const next = [nueva, ...campanas];
    setCampanas(next);
    saveCampanas(next);
    setDraft({ ...emptyDraft });
    setPreview(null);
    setUnresolvedInPreview([]);
    setIsCustomService(false);
  }

  async function handleCopyPreview() {
    if (!preview) return;
    await navigator.clipboard.writeText(preview);
    addMarketingHistoryItem({
      source:                 "campaign",
      title:                  draft.nombre || "Campaña sin nombre",
      text:                   preview,
      unresolvedPlaceholders: unresolvedInPreview,
    });
    onCopied?.();
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
  }

  function handleDelete(id: string) {
    const next = campanas.filter((c) => c.id !== id);
    setCampanas(next);
    saveCampanas(next);
  }

  function handleServiceChange(value: string) {
    if (value === "__otro__") {
      setIsCustomService(true);
      setDraft({ ...draft, servicio: "" });
    } else {
      setIsCustomService(false);
      setDraft({ ...draft, servicio: value });
    }
  }

  return (
    <div className="space-y-8">
      {/* Form */}
      <div
        className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-6"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4AF37]/10">
            <Sparkles size={16} className="text-[#D4AF37]" />
          </div>
          <div>
            <p className="font-black text-white">Nueva campaña</p>
            <p className="text-xs text-white/50">
              Rellena los datos y genera el texto
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Nombre */}
          <div className="sm:col-span-2">
            <label className="form-label">Nombre de la campaña</label>
            <input
              type="text"
              className="input"
              placeholder="Ej. Black Friday barbería"
              value={draft.nombre}
              onChange={(e) => setDraft({ ...draft, nombre: e.target.value })}
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="form-label">Tipo de campaña</label>
            <select
              className="input"
              value={draft.tipo}
              onChange={(e) =>
                setDraft({ ...draft, tipo: e.target.value as TipoCampana })
              }
            >
              <option value="descuento">Descuento</option>
              <option value="reactivacion">Reactivación de clientes</option>
              <option value="evento">Evento especial</option>
              <option value="temporada">Oferta de temporada</option>
            </select>
          </div>

          {/* Canal */}
          <div>
            <label className="form-label">Canal</label>
            <select
              className="input"
              value={draft.canal}
              onChange={(e) =>
                setDraft({ ...draft, canal: e.target.value as CanalCampana })
              }
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="ambos">WhatsApp + Instagram</option>
            </select>
          </div>

          {/* Descuento */}
          <div>
            <label className="form-label">
              Descuento{" "}
              <span className="font-normal text-white/50">(opcional)</span>
            </label>
            <div className="relative">
              <input
                type="number"
                className="input pr-8"
                placeholder="Ej. 20"
                min={0}
                max={100}
                value={draft.descuento ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    descuento: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/40">
                %
              </span>
            </div>
          </div>

          {/* Servicio objetivo */}
          <div>
            <label className="form-label">
              Servicio objetivo{" "}
              <span className="font-normal text-white/50">(opcional)</span>
            </label>

            {services.length > 0 && !isCustomService ? (
              <select
                className="input"
                value={draft.servicio}
                onChange={(e) => handleServiceChange(e.target.value)}
              >
                <option value="">Selecciona un servicio...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                    {s.price != null ? ` · €${s.price}` : ""}
                  </option>
                ))}
                <option value="__otro__">Otro (escribe a mano)</option>
              </select>
            ) : (
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  className="input"
                  placeholder="Ej. Corte + barba"
                  value={draft.servicio}
                  onChange={(e) =>
                    setDraft({ ...draft, servicio: e.target.value })
                  }
                />
                {services.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCustomService(false)}
                    className="self-start text-[11px] font-semibold text-[#D4AF37] underline"
                  >
                    ← Volver a la lista
                  </button>
                )}
                {services.length === 0 && (
                  <p className="text-[11px] text-white/50">
                    <a
                      href="/dashboard/servicios"
                      className="underline hover:text-[#D4AF37]"
                    >
                      Añade servicios
                    </a>{" "}
                    para personalizar mejor tus campañas.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Barbero */}
          <div>
            <label className="form-label">
              Barbero{" "}
              <span className="font-normal text-white/50">(opcional)</span>
            </label>
            {barbers.length > 0 ? (
              <select
                className="input"
                value={draft.barber}
                onChange={(e) =>
                  setDraft({ ...draft, barber: e.target.value })
                }
              >
                <option value="">Sin barbero específico</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  className="input"
                  placeholder="Ej. Carlos"
                  value={draft.barber}
                  onChange={(e) =>
                    setDraft({ ...draft, barber: e.target.value })
                  }
                />
                <p className="text-[11px] text-white/50">
                  <a
                    href="/dashboard/barberos"
                    className="underline hover:text-[#D4AF37]"
                  >
                    Añade barberos
                  </a>{" "}
                  para seleccionarlos aquí.
                </p>
              </div>
            )}
          </div>

          {/* Fechas */}
          <div>
            <label className="form-label">Fecha inicio</label>
            <input
              type="date"
              className="input"
              value={draft.fechaInicio}
              onChange={(e) =>
                setDraft({ ...draft, fechaInicio: e.target.value })
              }
            />
          </div>
          <div>
            <label className="form-label">Fecha fin</label>
            <input
              type="date"
              className="input"
              value={draft.fechaFin}
              onChange={(e) =>
                setDraft({ ...draft, fechaFin: e.target.value })
              }
            />
          </div>

          {/* QR toggle */}
          {bookingUrl && (
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={draft.mencionar_qr}
                  onChange={(e) =>
                    setDraft({ ...draft, mencionar_qr: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#D4AF37]"
                />
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white/70">
                  <QrCode size={14} className="text-white/40" />
                  Mencionar QR del local en el texto
                </span>
              </label>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerar}
          disabled={!draft.nombre}
          className="btn-gold mt-5 gap-2"
        >
          <Sparkles size={16} />
          Generar texto de campaña
        </button>
      </div>

      {/* Preview */}
      {preview !== null && (
        <div
          className="rounded-[24px] border border-[#D4AF37]/25 bg-white/[0.04] p-6"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="font-black text-white">Texto generado</p>
            <span className="rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#D4AF37]">
              Previsualización
            </span>
          </div>

          {unresolvedInPreview.length === 0 ? (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-2.5">
              <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
              <p className="text-xs font-semibold text-emerald-400">
                Mensaje listo para copiar y enviar.
              </p>
            </div>
          ) : (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.08] px-4 py-2.5">
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-xs font-semibold text-amber-400">
                Antes de enviar, completa:{" "}
                {unresolvedInPreview.join(", ")}
              </p>
            </div>
          )}

          <pre className="mb-5 whitespace-pre-wrap rounded-[16px] border border-white/[0.08] bg-[#0A0A0D] px-5 py-4 font-sans text-sm leading-7 text-white/70">
            {preview}
          </pre>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopyPreview}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-150 ${
                copiedPreview
                  ? "bg-emerald-500/[0.08] text-emerald-400"
                  : "border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/15"
              }`}
            >
              {copiedPreview ? (
                <>
                  <Check size={14} /> Copiado
                </>
              ) : (
                <>
                  <Copy size={14} /> Copiar
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleGuardar}
              className="btn-gold gap-2"
            >
              <Plus size={15} />
              Guardar campaña
            </button>
            <button
              type="button"
              onClick={() => { setPreview(null); setUnresolvedInPreview([]); }}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white/40 hover:text-white/70"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* Saved campaigns */}
      {campanas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-[#D4AF37]" />
              <p className="font-black text-white">Campañas guardadas</p>
            </div>
            <span className="text-xs text-white/50">
              {campanas.length} campaña
              {campanas.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {campanas.map((c) => (
              <CampanaCard key={c.id} campana={c} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {campanas.length === 0 && !preview && (
        <div className="rounded-[24px] border border-dashed border-white/[0.12] bg-white/[0.02] py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
            <Megaphone size={18} className="text-[#D4AF37]" />
          </div>
          <p className="mt-4 text-sm font-black text-white">
            Sin campañas todavía
          </p>
          <p className="mx-auto mt-2 max-w-sm px-4 text-xs leading-5 text-white/50">
            Genera tu primera campaña arriba. BarberíaOS usa tus datos reales — servicios, huecos y clientes — para que el texto convierta de verdad.
          </p>
        </div>
      )}

      <p className="text-center text-xs text-white/40">
        Las campañas se guardan en este navegador. Variables entre{" "}
        <span className="font-mono">[corchetes]</span> deben completarse antes
        de enviar.
      </p>
    </div>
  );
}
