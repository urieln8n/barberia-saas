"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, Check, CreditCard, Sparkles, TrendingUp, X,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CREDIT_PACKS } from "@/lib/studio/generate-content";

// ─── Types ────────────────────────────────────────────────────────────────────

type Wallet = { current: number; monthly: number; extra: number; plan: string };
type Transaction = { id: string; type: string; credits: number; description: string; created_at: string };

type Props = { wallet: Wallet; history: Transaction[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  monthly_grant:    { label: "Créditos mensuales",  color: "text-emerald-400 bg-emerald-500/[0.08]"  },
  purchase:         { label: "Compra",               color: "text-violet-400 bg-violet-500/[0.08]"    },
  usage:            { label: "Usado",                color: "text-white/50 bg-white/[0.06]"           },
  refund:           { label: "Devuelto",             color: "text-amber-400 bg-amber-500/[0.08]"      },
  admin_adjustment: { label: "Ajuste",               color: "text-violet-400 bg-violet-500/[0.08]"    },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Buy credits modal ────────────────────────────────────────────────────────

function BuyCreditsModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Comprar créditos</h3>
            <p className="text-xs text-slate-500 mt-0.5">Elige el pack que necesitas</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-2.5">
          {CREDIT_PACKS.map((pack) => (
            <button
              key={pack.id}
              onClick={() => setSelected(pack.id)}
              className={`relative flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                selected === pack.id
                  ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400"
                  : "border-slate-200 bg-white hover:border-violet-200"
              }`}
            >
              {pack.badge && (
                <span className="absolute -top-2 right-3 rounded-full border border-violet-300 bg-violet-600 px-2 py-0.5 text-[10px] font-black text-white">
                  {pack.badge}
                </span>
              )}
              <div>
                <p className="text-sm font-black text-slate-900">{pack.name}</p>
                <p className="text-xs text-slate-500">{pack.credits} créditos · {pack.pricePerCredit.toFixed(2)}€/crédito</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-900">{pack.price}€</p>
                {selected === pack.id && <Check size={14} className="ml-auto text-violet-600" />}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
          <strong>Stripe no configurado todavía.</strong> Para procesar el pago, configura las claves de Stripe en el entorno y conecta el endpoint <code>/api/studio/credits/checkout</code>.
        </div>

        <button
          disabled={!selected}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-black text-white transition disabled:opacity-40 hover:bg-violet-700"
        >
          <CreditCard size={14} />
          Ir al pago
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function CreditsClient({ wallet, history }: Props) {
  const [showModal, setShowModal] = useState(false);
  const usedThisMonth = wallet.monthly - wallet.current + wallet.extra;
  const pct = wallet.monthly > 0 ? Math.min(100, Math.round((wallet.current / wallet.monthly) * 100)) : 0;

  return (
    <>
      {showModal && <BuyCreditsModal onClose={() => setShowModal(false)} />}

      <div className="space-y-5">

          {/* Header */}
          <PageHeader
            variant="studio"
            section="Studio IA"
            title="Créditos Studio IA"
            description="Gestiona y recarga tus créditos para crear reels, ofertas y campañas con IA."
            action={
              <Link href="/dashboard/studio" className="btn-outline text-sm">
                <ArrowLeft size={14} /> Volver a Studio
              </Link>
            }
          />

          {/* Wallet card */}
          <div className="mb-5 rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-600 to-violet-700 p-6 text-white shadow-lg shadow-violet-200">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-violet-200">Créditos disponibles</p>
                <p className="mt-1 text-5xl font-black">{wallet.current}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="mb-3 h-2 rounded-full bg-violet-800/50">
              <div
                className="h-2 rounded-full bg-white/80 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-violet-200">
              <span>{wallet.current} de {wallet.monthly} créditos mensuales</span>
              <span>Plan {wallet.plan}</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{wallet.monthly}</p>
              <p className="text-[11px] text-slate-500">Incluidos/mes</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{wallet.extra}</p>
              <p className="text-[11px] text-slate-500">Extra comprados</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <p className="text-2xl font-black text-slate-900">{Math.max(0, usedThisMonth)}</p>
              <p className="text-[11px] text-slate-500">Usados este mes</p>
            </div>
          </div>

          {/* Buy CTA */}
          <div className="mb-5 rounded-2xl border border-violet-100 bg-violet-50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-violet-600" />
              <p className="text-sm font-black text-slate-900">¿Necesitas más créditos?</p>
            </div>
            <p className="mb-4 text-xs text-slate-600">Compra un pack extra o mejora tu plan para tener más créditos mensuales sin compromiso.</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700"
            >
              <CreditCard size={14} />
              Comprar créditos
            </button>
          </div>

          {/* Packs preview */}
          <div className="mb-5">
            <p className="mb-3 text-sm font-black text-slate-900">Packs disponibles</p>
            <div className="space-y-2">
              {CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className="relative flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {pack.badge && (
                    <span className="absolute -top-2 right-3 rounded-full border border-violet-300 bg-violet-600 px-2 py-0.5 text-[10px] font-black text-white">
                      {pack.badge}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-black text-slate-900">{pack.name}</p>
                    <p className="text-[11px] text-slate-500">{pack.credits} créditos · {pack.pricePerCredit.toFixed(2)}€/crédito</p>
                  </div>
                  <p className="text-base font-black text-slate-900">{pack.price}€</p>
                </div>
              ))}
            </div>
          </div>

          {/* Credits explanation */}
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="mb-3 text-sm font-black text-slate-900">¿Cómo funcionan los créditos?</p>
            <div className="space-y-2">
              {[
                { item: "Reel con plantilla premium", credits: "1 crédito" },
                { item: "Historia Instagram",          credits: "1 crédito" },
                { item: "Post promocional",            credits: "1 crédito" },
                { item: "Copy + hashtags + diseño",    credits: "1 crédito" },
                { item: "Video IA avanzado",           credits: "5 créditos" },
                { item: "Campaña completa semanal",    credits: "10 créditos" },
              ].map(({ item, credits }) => (
                <div key={item} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{item}</span>
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-black text-violet-700">{credits}</span>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div>
            <p className="mb-3 text-sm font-black text-slate-900">Historial de créditos</p>
            {history.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                <Sparkles size={24} className="mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-500">Todavía no hay actividad de créditos.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {history.map((tx, i) => {
                  const meta = TYPE_LABELS[tx.type] ?? { label: tx.type, color: "text-slate-700 bg-slate-100" };
                  return (
                    <div
                      key={tx.id}
                      className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-slate-100" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${meta.color}`}>{meta.label}</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{tx.description}</p>
                          <p className="text-[10px] text-slate-400">{formatDate(tx.created_at)}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-black ${tx.type === "usage" ? "text-slate-500" : "text-emerald-600"}`}>
                        {tx.type === "usage" ? "−" : "+"}{Math.abs(tx.credits)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
      </div>
    </>
  );
}
