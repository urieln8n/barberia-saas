"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Check, MessageCircle, Instagram, Hash, AlertCircle } from "lucide-react";
import {
  resolveMarketingTemplate,
  getUnresolvedPlaceholders,
  type MarketingVariables,
} from "@/src/lib/marketing/variables";
import { addMarketingHistoryItem } from "@/src/lib/marketing/history";
import {
  getMarketingTemplateStats,
  incrementMarketingTemplateStat,
  type MarketingTemplateStat,
} from "@/src/lib/marketing/stats";

// ─── Types ────────────────────────────────────────────────────────────────────

type Canal = "whatsapp" | "instagram" | "general";

type Plantilla = {
  id: string;
  canal: Canal;
  categoria: string;
  titulo: string;
  texto: string;
};

type Props = {
  barbershopName: string | null;
  bookingUrl: string | null;
  city: string | null;
  phone: string | null;
  inactiveClientsCount: number;
  totalFreeSlotsToday: number;
  freeSlotText?: string | null;
  onCopied?: () => void;
};

// ─── Plantillas ───────────────────────────────────────────────────────────────

const plantillas: Plantilla[] = [
  // ── WhatsApp ────────────────────────────────────────────────────────────────
  {
    id: "wa-reserva",
    canal: "whatsapp",
    categoria: "Reservas",
    titulo: "Invitación a reservar online",
    texto:
      "¡Hola [NOMBRE]! 👋 Ya puedes reservar tu cita en [NOMBRE_BARBERIA] directamente desde el móvil, sin llamar ni esperar.\n\nEntra aquí: [LINK_RESERVAS]\n\nTe esperamos 💈",
  },
  {
    id: "wa-recordatorio",
    canal: "whatsapp",
    categoria: "Recordatorios",
    titulo: "Recordatorio de cita",
    texto:
      "¡Hola [NOMBRE]! Te recuerdo tu cita en [NOMBRE_BARBERIA] el [FECHA] a las [HORA].\n\nSi necesitas cambiarla o cancelarla: [LINK_RESERVAS] 💈",
  },
  {
    id: "wa-horario",
    canal: "whatsapp",
    categoria: "Novedades",
    titulo: "Comunicar cambio de horario",
    texto:
      "¡Hola! Os informamos que a partir del [FECHA], [NOMBRE_BARBERIA] cambia su horario a [HORARIO].\n\nReservas online disponibles 24 h: [LINK_RESERVAS]",
  },
  {
    id: "wa-reactivacion",
    canal: "whatsapp",
    categoria: "Reactivación",
    titulo: "Recuperar cliente dormido",
    texto:
      "¡Hola [NOMBRE]! Hace tiempo que no te vemos por [NOMBRE_BARBERIA] y te echamos de menos 💈\n\nTenemos huecos esta semana. ¿Te apuntas?\n\n[LINK_RESERVAS]",
  },
  {
    id: "wa-oferta-fiel",
    canal: "whatsapp",
    categoria: "Reactivación",
    titulo: "Oferta para cliente fiel",
    texto:
      "¡Hola [NOMBRE]! Como cliente habitual, queremos ofrecerte [DESCUENTO]% de descuento en tu próxima visita.\n\nVálido hasta el [FECHA]. Reserva aquí: [LINK_RESERVAS] 🎁",
  },
  {
    id: "wa-promo",
    canal: "whatsapp",
    categoria: "Promociones",
    titulo: "Lanzar promoción especial",
    texto:
      "✂️ OFERTA [NOMBRE_BARBERIA]\n\n[DESCUENTO]% de descuento en [SERVICIO] esta semana.\nSolo para reservas antes del [FECHA].\n\nAprovéchalo: [LINK_RESERVAS]",
  },
  // ── Instagram ───────────────────────────────────────────────────────────────
  {
    id: "ig-bio",
    canal: "instagram",
    categoria: "Bio",
    titulo: "Bio optimizada con reservas",
    texto:
      "💈 [NOMBRE_BARBERIA]\n✂️ Cortes, degradados y barbería profesional\n📍 [DIRECCION]\n📅 Reserva online — sin esperas\n👇 [LINK_RESERVAS]",
  },
  {
    id: "ig-hueco",
    canal: "instagram",
    categoria: "Post",
    titulo: "Hueco disponible esta semana",
    texto:
      "📅 HUECO DISPONIBLE\n\n¿Necesitas cortarte el pelo esta semana?\nTenemos citas libres — sin esperas.\n\nReserva en nuestra bio 👆 o directo:\n[LINK_RESERVAS]\n.\n💈 [NOMBRE_BARBERIA]\n#barberia #[CIUDAD] #cortedemelo #barbershop",
  },
  {
    id: "ig-promo",
    canal: "instagram",
    categoria: "Post",
    titulo: "Promo especial en redes",
    texto:
      "✂️ OFERTA ESPECIAL\n\n[DESCUENTO]% de descuento en [SERVICIO].\nVálido hasta el [FECHA].\n\nReserva antes de que se agote:\n[LINK_RESERVAS]\n.\n#barberia #oferta #[CIUDAD] #[NOMBRE_BARBERIA]",
  },
  {
    id: "ig-nuevo-servicio",
    canal: "instagram",
    categoria: "Novedades",
    titulo: "Nuevo servicio disponible",
    texto:
      "🆕 NUEVO SERVICIO\n\nYa disponible: [SERVICIO] en [NOMBRE_BARBERIA].\n\n¿Quieres ser de los primeros en probarlo?\nReserva tu cita: [LINK_RESERVAS]\n.\n#barberia #nuevo #[CIUDAD]",
  },
  // ── General ─────────────────────────────────────────────────────────────────
  {
    id: "gen-google-pos",
    canal: "general",
    categoria: "Google Business",
    titulo: "Respuesta a reseña positiva",
    texto:
      "¡Muchas gracias [NOMBRE]! Es un placer tenerte en [NOMBRE_BARBERIA]. Nos alegra que hayas quedado satisfecho. ¡Te esperamos en tu próxima cita! 💈",
  },
  {
    id: "gen-google-neg",
    canal: "general",
    categoria: "Google Business",
    titulo: "Respuesta a reseña negativa",
    texto:
      "Hola [NOMBRE], lamentamos que tu experiencia no fuese la esperada. Nos tomamos muy en serio cada opinión. Por favor, escríbenos a [EMAIL] para solucionarlo personalmente. Gracias.",
  },
  // ── FASE 1.5 ────────────────────────────────────────────────────────────────
  {
    id: "wa-huecos-hoy",
    canal: "whatsapp",
    categoria: "Huecos",
    titulo: "Huecos libres hoy",
    texto:
      "¡Hola [NOMBRE]! 🔔 Tengo huecos libres HOY en [NOMBRE_BARBERIA].\n\n¿Te vienes? Reserva antes de que se llenen:\n[LINK_RESERVAS] 💈",
  },
  {
    id: "ig-huecos-semana",
    canal: "instagram",
    categoria: "Huecos",
    titulo: "Huecos libres esta semana",
    texto:
      "📅 AGENDA ABIERTA ESTA SEMANA\n\n¿Necesitas un corte antes del finde?\nAún tengo hueco para ti — sin esperas.\n\nReserva en el link de la bio 👆\n[LINK_RESERVAS]\n.\n💈 [NOMBRE_BARBERIA] · [CIUDAD]\n#barberia #[CIUDAD] #cortedepelo #hueco",
  },
  {
    id: "wa-pack-corte-barba",
    canal: "whatsapp",
    categoria: "Promociones",
    titulo: "Promo corte + barba",
    texto:
      "✂️ PACK ESPECIAL [NOMBRE_BARBERIA]\n\nCorte + arreglo de barba por solo [PRECIO]€.\nVálido hasta el [FECHA].\n\nReserva tu hueco antes de que se llene:\n[LINK_RESERVAS] 💈",
  },
  {
    id: "wa-inactivo-corto",
    canal: "whatsapp",
    categoria: "Reactivación",
    titulo: "Cliente inactivo — mensaje corto",
    texto:
      "¡Hola [NOMBRE]! ✂️ ¿Cuándo fue tu último corte?\n\nSi ya toca, tengo hueco esta semana en [NOMBRE_BARBERIA]. Reserva en 30 segundos:\n[LINK_RESERVAS]",
  },
  {
    id: "wa-pedir-resena",
    canal: "whatsapp",
    categoria: "Reseñas",
    titulo: "Pedir reseña en Google",
    texto:
      "¡Hola [NOMBRE]! Espero que estés contento con el corte 😊\n\nSi tienes 2 minutos, me ayudaría mucho que dejaras una reseña en Google. Significa mucho para [NOMBRE_BARBERIA]:\n[LINK_GOOGLE_RESENAS]\n\n¡Gracias de verdad! 💈",
  },
  {
    id: "ig-nueva-semana",
    canal: "instagram",
    categoria: "Agenda",
    titulo: "Nueva semana — agenda abierta",
    texto:
      "🗓️ NUEVA SEMANA, AGENDA ABIERTA\n\n¡Empezamos semana con hueco para ti!\nReserva tu cita y empieza la semana con buen look.\n\nLink en bio 👆 o reserva directo:\n[LINK_RESERVAS]\n.\n💈 [NOMBRE_BARBERIA]\n#barberia #[CIUDAD] #lunesdebarber #semana",
  },
];

const canalConfig: Record<
  Canal,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  whatsapp:  { label: "WhatsApp",  icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100"  },
  instagram: { label: "Instagram", icon: Instagram,     color: "text-pink-600",    bg: "bg-pink-50 border-pink-100"         },
  general:   { label: "General",   icon: Hash,          color: "text-slate-500",   bg: "bg-slate-50 border-slate-100"       },
};

const filtros: { id: Canal | "todos"; label: string }[] = [
  { id: "todos",     label: "Todas"     },
  { id: "whatsapp",  label: "WhatsApp"  },
  { id: "instagram", label: "Instagram" },
  { id: "general",   label: "General"   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderTemplate(texto: string, variables: MarketingVariables) {
  const parts = texto.split(/(\[[A-Z_]+\])/g);
  return parts.map((part, i) => {
    if (!/^\[[A-Z_]+\]$/.test(part)) return <span key={i}>{part}</span>;
    const resolved = resolveMarketingTemplate(part, variables);
    if (resolved !== part) {
      return (
        <span
          key={i}
          className="rounded bg-emerald-100 px-1 font-mono text-[11px] font-bold text-emerald-700"
        >
          {resolved}
        </span>
      );
    }
    return (
      <span
        key={i}
        className="rounded bg-[#C9922A]/15 px-1 font-mono text-[11px] font-bold text-[#8A641F]"
      >
        {part}
      </span>
    );
  });
}

function formatStatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day:   "numeric",
    month: "short",
    hour:  "2-digit",
    minute: "2-digit",
  });
}

// ─── VarChip ──────────────────────────────────────────────────────────────────

function VarChip({
  varName,
  value,
  copiedVar,
  onCopy,
}: {
  varName: string;
  value: string;
  copiedVar: string | null;
  onCopy: (name: string, value: string) => void;
}) {
  const copied = copiedVar === varName;
  return (
    <button
      type="button"
      onClick={() => onCopy(varName, value)}
      title={`Copiar: ${value}`}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-all duration-150 ${
        copied
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white hover:border-[#C9922A]/30 hover:bg-[#C9922A]/5"
      }`}
    >
      <span
        className={`font-mono font-bold ${copied ? "text-emerald-600" : "text-[#8A641F]"}`}
      >
        {varName}
      </span>
      <span className="text-neutral-200">→</span>
      <span
        className={`max-w-[160px] truncate ${copied ? "text-emerald-600" : "text-neutral-600"}`}
      >
        {copied ? "¡Copiado!" : value}
      </span>
    </button>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PlantillasTab({
  barbershopName,
  bookingUrl,
  city,
  phone,
  inactiveClientsCount,
  totalFreeSlotsToday,
  freeSlotText,
  onCopied,
}: Props) {
  const [filtro, setFiltro]     = useState<Canal | "todos">("todos");
  const [copiedState, setCopied] = useState<{ id: string; unresolvedCount: number } | null>(null);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [templateStats, setTemplateStats] = useState<MarketingTemplateStat[]>([]);

  useEffect(() => {
    setTemplateStats(getMarketingTemplateStats());
  }, []);

  const variables: MarketingVariables = {
    shopName:  barbershopName,
    bookingUrl,
    city,
    phone,
    todaySlotsSummary: freeSlotText,
  };

  const visibles =
    filtro === "todos"
      ? plantillas
      : plantillas.filter((p) => p.canal === filtro);

  const statByTemplateId = useMemo(() => {
    return new Map(templateStats.map((stat) => [stat.templateId, stat]));
  }, [templateStats]);

  const topTemplates = templateStats.slice(0, 3);
  const topTemplateIds = new Set(topTemplates.map((stat) => stat.templateId));

  async function handleCopy(p: Plantilla) {
    const resolved   = resolveMarketingTemplate(p.texto, variables);
    const unresolved = getUnresolvedPlaceholders(resolved);
    await navigator.clipboard.writeText(resolved);
    addMarketingHistoryItem({
      source:                  "template",
      title:                   p.titulo,
      text:                    resolved,
      unresolvedPlaceholders:  unresolved,
    });
    incrementMarketingTemplateStat(p.id, p.titulo);
    setTemplateStats(getMarketingTemplateStats());
    onCopied?.();
    setCopied({ id: p.id, unresolvedCount: unresolved.length });
    setTimeout(() => setCopied(null), 2500);
  }

  async function handleCopyVar(name: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedVar(name);
    setTimeout(() => setCopiedVar(null), 2000);
  }

  // Build var chips from real data
  const vars: { varName: string; value: string }[] = [];
  if (barbershopName) vars.push({ varName: "[NOMBRE_BARBERIA]", value: barbershopName });
  if (bookingUrl)     vars.push({ varName: "[LINK_RESERVAS]",   value: bookingUrl });
  if (city)           vars.push({ varName: "[CIUDAD]",          value: city });
  if (phone)          vars.push({ varName: "[WHATSAPP]",        value: phone });

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="rounded-[20px] border border-[#C9922A]/20 bg-[#C9922A]/5 px-5 py-4">
        <p className="text-sm leading-6 text-[#080A0F]">
          Las variables de tu barbería se{" "}
          <span className="font-bold">sustituyen automáticamente</span> al
          copiar.{" "}
          <span className="rounded bg-emerald-100 px-1 font-mono text-[11px] font-bold text-emerald-700">
            así
          </span>{" "}
          = ya sustituido.{" "}
          <span className="rounded bg-[#C9922A]/15 px-1 font-mono text-[11px] font-bold text-[#8A641F]">
            [NOMBRE]
          </span>{" "}
          = completa antes de enviar.
        </p>
      </div>

      {/* Tus variables */}
      {vars.length > 0 && (
        <div className="rounded-[20px] border border-slate-100 bg-slate-50 px-5 py-4">
          <p className="mb-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Tus variables — haz clic para copiar el valor
          </p>
          <div className="flex flex-wrap gap-2">
            {vars.map((v) => (
              <VarChip
                key={v.varName}
                varName={v.varName}
                value={v.value}
                copiedVar={copiedVar}
                onCopy={handleCopyVar}
              />
            ))}
          </div>
          {(inactiveClientsCount > 0 || totalFreeSlotsToday > 0) && (
            <div className="mt-3 flex flex-wrap gap-3">
              {inactiveClientsCount > 0 && (
                <p className="text-xs text-neutral-500">
                  💤{" "}
                  <strong className="text-neutral-700">
                    {inactiveClientsCount} clientes
                  </strong>{" "}
                  sin visita en +30 días — usa las plantillas de{" "}
                  <strong>Reactivación</strong>.
                </p>
              )}
              {totalFreeSlotsToday > 0 && (
                <p className="text-xs text-neutral-500">
                  🕐{" "}
                  <strong className="text-neutral-700">
                    {totalFreeSlotsToday} huecos libres
                  </strong>{" "}
                  hoy — usa las plantillas de <strong>Huecos</strong>.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="rounded-[20px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="font-black text-[#080A0F]">
              Tus plantillas más usadas
            </p>
            <p className="text-xs text-neutral-400">
              Basado en las copias hechas en este navegador
            </p>
          </div>
        </div>

        {topTemplates.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-3">
            {topTemplates.map((stat) => (
              <div
                key={stat.templateId}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <p className="line-clamp-2 text-sm font-bold text-[#080A0F]">
                  {stat.templateTitle}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#8A641F]">
                  {stat.copiedCount} copia
                  {stat.copiedCount === 1 ? "" : "s"}
                </p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  Última vez: {formatStatDate(stat.lastCopiedAt)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm text-neutral-400">
              Cuando copies plantillas, tus más usadas aparecerán aquí.
            </p>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            className={`rounded-2xl border px-4 py-1.5 text-xs font-bold transition-all duration-150 ${
              filtro === f.id
                ? "border-[#C9922A]/40 bg-[#C9922A]/10 text-[#080A0F]"
                : "border-slate-200 bg-white text-neutral-500 hover:border-slate-300 hover:text-neutral-800"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-neutral-400">
          {visibles.length} plantillas
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {visibles.map((p) => {
          const canal    = canalConfig[p.canal];
          const CanalIcon = canal.icon;
          const isCopied = copiedState?.id === p.id;
          const unresolvedCount = isCopied ? (copiedState?.unresolvedCount ?? 0) : 0;
          const stat = statByTemplateId.get(p.id);
          const isTopTemplate = topTemplateIds.has(p.id);

          return (
            <div
              key={p.id}
              className="flex flex-col rounded-[20px] border border-slate-200 bg-white shadow-sm transition-shadow duration-150 hover:shadow-md"
            >
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl border ${canal.bg}`}
                  >
                    <CanalIcon size={14} className={canal.color} />
                  </span>
                  <span className="text-xs font-bold text-neutral-400">
                    {canal.label}
                  </span>
                  <span className="text-neutral-200">·</span>
                  <span className="text-xs text-neutral-400">{p.categoria}</span>
                </div>
                {isTopTemplate && (
                  <span className="rounded-full border border-[#C9922A]/25 bg-[#C9922A]/10 px-2 py-0.5 text-[10px] font-bold text-[#8A641F]">
                    ⭐ Más usada
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="font-bold text-[#080A0F]">{p.titulo}</p>
                  {stat && stat.copiedCount > 0 && (
                    <p className="mt-1 text-xs text-neutral-400">
                      Copiada {stat.copiedCount} vez
                      {stat.copiedCount === 1 ? "" : "es"}
                    </p>
                  )}
                </div>
                <p className="flex-1 whitespace-pre-line text-sm leading-6 text-neutral-500">
                  {renderTemplate(p.texto, variables)}
                </p>
              </div>

              {/* Card footer */}
              <div className="border-t border-slate-100 px-5 py-3">
                <button
                  type="button"
                  onClick={() => handleCopy(p)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all duration-150 ${
                    isCopied
                      ? unresolvedCount === 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-700"
                      : "bg-[#C9922A]/8 text-[#C9922A] hover:bg-[#C9922A]/15"
                  }`}
                >
                  {isCopied ? (
                    unresolvedCount === 0 ? (
                      <>
                        <Check size={14} /> Listo para enviar ✓
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} /> Copiado —{" "}
                        {unresolvedCount} var
                        {unresolvedCount === 1 ? "" : "s"} pendiente
                        {unresolvedCount === 1 ? "" : "s"}
                      </>
                    )
                  ) : (
                    <>
                      <Copy size={14} /> Copiar texto
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
