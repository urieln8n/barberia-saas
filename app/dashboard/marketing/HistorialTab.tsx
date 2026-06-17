"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  Trash2,
  Clock,
  FileText,
  Megaphone,
  AlertCircle,
  History,
  BarChart3,
} from "lucide-react";
import {
  getMarketingHistory,
  removeMarketingHistoryItem,
  clearMarketingHistory,
  type MarketingHistoryItem,
} from "@/src/lib/marketing/history";
import {
  clearMarketingTemplateStats,
  getTopMarketingTemplates,
  type MarketingTemplateStat,
} from "@/src/lib/marketing/stats";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const diffMins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMins < 1)  return "Ahora mismo";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffH = Math.floor(diffMins / 60);
  if (diffH < 24)    return `Hace ${diffH} h`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HistorialTab({ historyVersion }: { historyVersion: number }) {
  const [items, setItems]   = useState<MarketingHistoryItem[]>([]);
  const [copiedId, setCopied] = useState<string | null>(null);
  const [topTemplate, setTopTemplate] = useState<MarketingTemplateStat | null>(null);

  useEffect(() => {
    setItems(getMarketingHistory());
    setTopTemplate(getTopMarketingTemplates(1)[0] ?? null);
  }, [historyVersion]);

  const templateCopies = items.filter((item) => item.source === "template").length;
  const campaignCopies = items.filter((item) => item.source === "campaign").length;

  async function handleCopyAgain(item: MarketingHistoryItem) {
    await navigator.clipboard.writeText(item.text);
    setCopied(item.id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleRemove(id: string) {
    removeMarketingHistoryItem(id);
    setItems(getMarketingHistory());
  }

  function handleClear() {
    clearMarketingHistory();
    setItems([]);
  }

  function handleClearStats() {
    const confirmed = window.confirm(
      "¿Limpiar las estadísticas de plantillas? El historial no se borrará.",
    );
    if (!confirmed) return;

    clearMarketingTemplateStats();
    setTopTemplate(null);
  }

  // ── List ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div
        className="rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-5"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
              <BarChart3 size={16} className="text-[#D4AF37]" />
            </span>
            <div>
              <p className="font-black text-white">Resumen local</p>
              <p className="text-xs text-white/40">
                Actividad guardada solo en este navegador
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearStats}
            className="self-start rounded-xl border border-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/50 transition-colors hover:border-red-500/30 hover:text-red-400"
          >
            Limpiar estadísticas
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          <SummaryCard label="Total mensajes copiados" value={items.length} />
          <SummaryCard label="Plantillas copiadas" value={templateCopies} />
          <SummaryCard label="Campañas copiadas" value={campaignCopies} />
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Plantilla más usada
            </p>
            {topTemplate ? (
              <>
                <p className="mt-1 line-clamp-1 text-sm font-black text-white">
                  {topTemplate.templateTitle}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#D4AF37]">
                  {topTemplate.copiedCount} copia
                  {topTemplate.copiedCount === 1 ? "" : "s"}
                </p>
              </>
            ) : (
              <p className="mt-2 text-xs text-white/40">Sin datos aún</p>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-black text-white">Historial reciente</p>
          <p className="text-xs text-white/40">
            Tus últimos mensajes copiados
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border border-white/[0.08] px-3 py-1.5 text-xs font-semibold text-white/40 transition-colors hover:border-red-500/30 hover:text-red-400"
          >
            Limpiar historial
          </button>
        )}
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-white/[0.12] py-14 text-center">
          <History size={32} className="mx-auto text-white/20" />
          <p className="mt-3 text-sm font-bold text-white/40">
            Todavía no has copiado ningún mensaje.
          </p>
          <p className="mt-1 text-xs text-white/30">
            Cuando copies una plantilla o campaña, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const copied     = copiedId === item.id;
            const isTemplate = item.source === "template";

            return (
              <div
                key={item.id}
                className="flex flex-col rounded-[20px] border border-white/[0.08] bg-white/[0.04]"
                style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
              >
                {/* Item header */}
                <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-3">
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
                        isTemplate
                          ? "border-blue-500/20 bg-blue-500/[0.08]"
                          : "border-[#D4AF37]/25 bg-[#D4AF37]/10"
                      }`}
                    >
                      {isTemplate ? (
                        <FileText size={12} className="text-blue-400" />
                      ) : (
                        <Megaphone size={12} className="text-[#D4AF37]" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-white">
                        {item.title}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                            isTemplate
                              ? "bg-blue-500/[0.08] text-blue-400"
                              : "bg-[#D4AF37]/10 text-[#D4AF37]"
                          }`}
                        >
                          {isTemplate ? "Plantilla" : "Campaña"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-white/40">
                          <Clock size={10} />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    title="Eliminar del historial"
                    className="mt-0.5 shrink-0 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/[0.08] hover:text-red-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Text preview — faded bottom */}
                <pre
                  className="max-h-28 overflow-hidden whitespace-pre-wrap px-5 py-3 font-sans text-xs leading-5 text-white/60"
                  style={{
                    maskImage:       "linear-gradient(to bottom, black 60%, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent)",
                  }}
                >
                  {item.text}
                </pre>

                {/* Unresolved warning */}
                {item.unresolvedPlaceholders.length > 0 && (
                  <div className="mx-5 mb-3 flex items-start gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.08] px-3 py-2">
                    <AlertCircle size={12} className="mt-0.5 shrink-0 text-amber-400" />
                    <p className="text-[10px] font-semibold text-amber-400">
                      Pendiente:{" "}
                      {item.unresolvedPlaceholders.join(", ")}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-white/[0.08] px-5 py-3">
                  <button
                    type="button"
                    onClick={() => handleCopyAgain(item)}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all duration-150 ${
                      copied
                        ? "bg-emerald-500/[0.08] text-emerald-400"
                        : "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/15"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={13} /> ¡Copiado de nuevo!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copiar de nuevo
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
