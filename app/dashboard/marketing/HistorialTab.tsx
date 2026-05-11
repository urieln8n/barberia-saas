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
} from "lucide-react";
import {
  getMarketingHistory,
  removeMarketingHistoryItem,
  clearMarketingHistory,
  type MarketingHistoryItem,
} from "@/src/lib/marketing/history";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const diffMins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMins < 1)  return "Ahora mismo";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffH = Math.floor(diffMins / 60);
  if (diffH < 24)    return `Hace ${diffH} h`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HistorialTab({ historyVersion }: { historyVersion: number }) {
  const [items, setItems]   = useState<MarketingHistoryItem[]>([]);
  const [copiedId, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setItems(getMarketingHistory());
  }, [historyVersion]);

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

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-slate-200 py-14 text-center">
        <History size={32} className="mx-auto text-slate-200" />
        <p className="mt-3 text-sm font-bold text-neutral-400">
          Todavía no has copiado ningún mensaje.
        </p>
        <p className="mt-1 text-xs text-neutral-300">
          Cuando copies una plantilla o campaña, aparecerá aquí.
        </p>
      </div>
    );
  }

  // ── List ────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="font-black text-[#080A0F]">Historial reciente</p>
          <p className="text-xs text-neutral-400">
            Tus últimos mensajes copiados
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-neutral-400 transition-colors hover:border-red-200 hover:text-red-500"
        >
          Limpiar historial
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => {
          const copied     = copiedId === item.id;
          const isTemplate = item.source === "template";

          return (
            <div
              key={item.id}
              className="flex flex-col rounded-[20px] border border-slate-200 bg-white shadow-sm"
            >
              {/* Item header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-3">
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
                      isTemplate
                        ? "border-blue-100 bg-blue-50"
                        : "border-[#C9922A]/25 bg-[#C9922A]/10"
                    }`}
                  >
                    {isTemplate ? (
                      <FileText size={12} className="text-blue-500" />
                    ) : (
                      <Megaphone size={12} className="text-[#C9922A]" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[#080A0F]">
                      {item.title}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                          isTemplate
                            ? "bg-blue-50 text-blue-500"
                            : "bg-[#C9922A]/10 text-[#8A641F]"
                        }`}
                      >
                        {isTemplate ? "Plantilla" : "Campaña"}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-neutral-400">
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
                  className="mt-0.5 shrink-0 rounded-lg p-1.5 text-neutral-300 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Text preview — faded bottom */}
              <pre
                className="max-h-28 overflow-hidden whitespace-pre-wrap px-5 py-3 font-sans text-xs leading-5 text-neutral-500"
                style={{
                  maskImage:       "linear-gradient(to bottom, black 60%, transparent)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent)",
                }}
              >
                {item.text}
              </pre>

              {/* Unresolved warning */}
              {item.unresolvedPlaceholders.length > 0 && (
                <div className="mx-5 mb-3 flex items-start gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                  <AlertCircle size={12} className="mt-0.5 shrink-0 text-amber-500" />
                  <p className="text-[10px] font-semibold text-amber-700">
                    Pendiente:{" "}
                    {item.unresolvedPlaceholders.join(", ")}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-slate-100 px-5 py-3">
                <button
                  type="button"
                  onClick={() => handleCopyAgain(item)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all duration-150 ${
                    copied
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-[#C9922A]/8 text-[#C9922A] hover:bg-[#C9922A]/15"
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
    </div>
  );
}
