"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, ChevronDown } from "lucide-react";
import {
  createSubscription, updateSubscription,
  updateSubscriptionStatus, deleteSubscription,
} from "./actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type Barbershop = { id: string; name: string };

type Subscription = {
  id: string;
  barbershop_id: string;
  plan_name: string;
  amount_monthly: number;
  currency: string;
  billing_cycle: string;
  status: string;
  started_at: string | null;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancelled_at: string | null;
  notes: string | null;
  stripe_subscription_id: string | null;
  barbershop_name?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_DEFAULTS: Record<string, number> = {
  starter: 39, growth: 79, premium: 149, custom: 0,
};

const PLAN_LABELS: Record<string, string> = {
  starter: "Básico", growth: "Pro", premium: "Premium", custom: "Custom",
};

const PLAN_COLORS: Record<string, string> = {
  starter: "border border-[#2F6FEB]/30 bg-[#2F6FEB]/10 text-[#2F6FEB]",
  growth:  "border border-[#2F6FEB]/30 bg-[#2F6FEB]/10 text-[#2459bd]",
  premium: "bg-[#0F172A] text-white",
  custom:  "border border-neutral-300 bg-neutral-100 text-neutral-600",
};

const STATUS_LABELS: Record<string, string> = {
  trial:     "Trial",
  active:    "Activa",
  paused:    "Pausada",
  cancelled: "Cancelada",
};

const STATUS_COLORS: Record<string, string> = {
  trial:     "bg-purple-50 text-purple-700 border border-purple-200",
  active:    "bg-green-50 text-green-700 border border-green-200",
  paused:    "bg-amber-50 text-amber-700 border border-amber-200",
  cancelled: "bg-red-50 text-red-500 border border-red-200",
};

const ALL_STATUSES = ["trial","active","paused","cancelled"];
const ALL_PLANS    = ["starter","growth","premium","custom"];

function toLocal(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtEur(n: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SuscripcionesClient({
  subscriptions,
  barbershops,
  mrr,
  byStatus,
}: {
  subscriptions: Subscription[];
  barbershops:   Barbershop[];
  mrr:           number;
  byStatus:      Record<string, number>;
}) {
  const [filter, setFilter]       = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Subscription | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [updating,  setUpdating]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [planAmount, setPlanAmount] = useState<number>(39);
  const [formError, setFormError]  = useState<string | null>(null);

  function openCreate() { setEditing(null); setPlanAmount(39); setFormError(null); setShowModal(true); }
  function openEdit(s: Subscription) { setEditing(s); setPlanAmount(s.amount_monthly); setFormError(null); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); setFormError(null); }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta suscripción?")) return;
    setDeleting(id);
    const result = await deleteSubscription(id);
    setDeleting(null);
    if (!result.success) alert(`Error al eliminar: ${result.error}`);
  }

  async function handleStatusChange(id: string, status: string) {
    setUpdating(id);
    const result = await updateSubscriptionStatus(id, status);
    setUpdating(null);
    if (!result.success) alert(`Error al cambiar estado: ${result.error}`);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setFormError(null);
    let result;
    if (editing) {
      formData.append("id", editing.id);
      result = await updateSubscription(formData);
    } else {
      result = await createSubscription(formData);
    }
    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    closeModal();
  }

  const filtered = filter === "all"
    ? subscriptions
    : subscriptions.filter(s => s.status === filter);

  const barbershopMap = Object.fromEntries(barbershops.map(b => [b.id, b.name]));

  return (
    <div className="space-y-6">

      {/* Header ──────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">Admin</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#111827]">Suscripciones</h1>
          <p className="mt-1 text-sm text-neutral-500">Gestión manual de planes activos de BarberiaOS</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary"
        >
          <Plus size={16} /> Nueva suscripción
        </button>
      </div>

      {/* MRR total ───────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#DDE7FB] bg-white shadow-sm">
        <div className="h-px w-full bg-gradient-to-r from-[#2F6FEB]/60 via-[#2F6FEB] to-[#2F6FEB]/60" />
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">MRR Real</p>
            <p className="mt-1 text-4xl font-black text-[#111827]">{fmtEur(mrr)}</p>
            <p className="mt-1 text-sm text-slate-500">
              Solo suscripciones con status = <span className="font-semibold text-slate-700">active</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ALL_STATUSES.map(s => (
              <div key={s} className="text-center">
                <p className="text-xl font-black text-[#111827]">{byStatus[s] ?? 0}</p>
                <p className="text-[11px] font-semibold text-slate-500">{STATUS_LABELS[s]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            filter === "all" ? "bg-[#2F6FEB] text-white" : "border border-[#E5E7EB] bg-white text-neutral-600 hover:border-[#CBD5E1]"
          }`}
        >
          Todas ({subscriptions.length})
        </button>
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === s ? "bg-[#2F6FEB] text-white" : "border border-[#E5E7EB] bg-white text-neutral-600 hover:border-[#CBD5E1]"
            }`}
          >
            {STATUS_LABELS[s]} ({byStatus[s] ?? 0})
          </button>
        ))}
      </div>

      {/* Tabla ───────────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] py-16">
          <p className="font-bold text-neutral-500">Sin suscripciones todavía</p>
          {filter === "all" && (
            <button
              type="button"
              onClick={openCreate}
              className="btn-primary mt-4"
            >
              <Plus size={14} /> Añadir primera suscripción
            </button>
          )}
        </div>
      ) : (
        <div className="table-shell">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Barbería</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-neutral-400">MRR</th>
                <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400 lg:table-cell">Período</th>
                <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400 lg:table-cell">Trial hasta</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map(sub => (
                <tr key={sub.id} className="transition-colors hover:bg-[#F8FAFC]/70">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#111827]">
                      {sub.barbershop_name ?? barbershopMap[sub.barbershop_id] ?? sub.barbershop_id.slice(0, 8)}
                    </p>
                    {sub.stripe_subscription_id && (
                      <p className="font-mono text-[10px] text-neutral-400">{sub.stripe_subscription_id}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${PLAN_COLORS[sub.plan_name] ?? PLAN_COLORS.custom}`}>
                      {PLAN_LABELS[sub.plan_name] ?? sub.plan_name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_COLORS[sub.status] ?? "bg-neutral-100 text-neutral-500"}`}>
                        {STATUS_LABELS[sub.status] ?? sub.status}
                      </span>
                      {/* Quick status change */}
                      <div className="relative">
                        <button
                          type="button"
                          disabled={updating === sub.id}
                          className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-[#F8FAFC] hover:text-[#111827] disabled:opacity-40"
                          onClick={e => {
                            const el = e.currentTarget.nextElementSibling as HTMLElement;
                            el?.classList.toggle("hidden");
                          }}
                        >
                          <ChevronDown size={12} />
                        </button>
                        <div className="absolute left-0 top-7 z-10 hidden min-w-[120px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
                          {ALL_STATUSES.filter(s => s !== sub.status).map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={async (e) => {
                                (e.currentTarget.closest(".relative")?.querySelector(".hidden") as HTMLElement)?.classList.add("hidden");
                                await handleStatusChange(sub.id, s);
                              }}
                              className="block w-full px-3 py-2 text-left text-xs font-semibold text-neutral-700 transition-colors hover:bg-[#F8FAFC]"
                            >
                              → {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono text-sm font-black ${sub.status === "active" ? "text-[#111827]" : "text-neutral-400"}`}>
                      {sub.status === "active" ? fmtEur(sub.amount_monthly) : "—"}
                    </span>
                    {sub.status !== "active" && (
                      <p className="text-[10px] text-neutral-400">{fmtEur(sub.amount_monthly)} (inactivo)</p>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-neutral-500 lg:table-cell">
                    {sub.current_period_start
                      ? `${fmt(sub.current_period_start)} → ${fmt(sub.current_period_end)}`
                      : "—"
                    }
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-neutral-500 lg:table-cell">
                    {sub.status === "trial" ? fmt(sub.trial_ends_at) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => openEdit(sub)}
                        className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]">
                        <Pencil size={14} />
                      </button>
                      <button type="button" onClick={() => handleDelete(sub.id)} disabled={deleting === sub.id}
                        className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nota Stripe ─────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">Integración Stripe</p>
        <p className="mt-1 text-sm text-neutral-500">
          El campo <code className="rounded bg-neutral-100 px-1 font-mono text-xs">stripe_subscription_id</code> se
          rellena automáticamente cuando se conecte Stripe Billing. Hasta entonces, gestión manual desde esta pantalla.
        </p>
      </div>

      {/* Modal ───────────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="h-px w-full bg-gradient-to-r from-[#2F6FEB]/60 via-[#2F6FEB] to-[#2F6FEB]/60" />
            <div className="max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">Suscripciones</p>
                  <h2 className="mt-0.5 text-xl font-black text-[#111827]">
                    {editing ? "Editar suscripción" : "Nueva suscripción"}
                  </h2>
                </div>
                <button type="button" onClick={closeModal} className="rounded-xl p-2 transition-colors hover:bg-[#F8FAFC]">
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 space-y-4">

                {/* Barbería */}
                {!editing && (
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Barbería *</label>
                    <select
                      name="barbershop_id"
                      required
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    >
                      <option value="">Selecciona una barbería</option>
                      {barbershops.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {editing && (
                  <input type="hidden" name="barbershop_id" value={editing.barbershop_id} />
                )}

                {/* Plan + Importe */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Plan *</label>
                    <select
                      name="plan_name"
                      defaultValue={editing?.plan_name ?? "starter"}
                      onChange={e => setPlanAmount(PLAN_DEFAULTS[e.target.value] ?? 0)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    >
                      {ALL_PLANS.map(p => (
                        <option key={p} value={p}>{PLAN_LABELS[p]} {PLAN_DEFAULTS[p] ? `(${PLAN_DEFAULTS[p]} €)` : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Importe/mes (€) *</label>
                    <input
                      name="amount_monthly"
                      type="number"
                      step="0.01"
                      min="0"
                      value={planAmount}
                      onChange={e => setPlanAmount(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Ciclo</label>
                    <select
                      name="billing_cycle"
                      defaultValue={editing?.billing_cycle ?? "monthly"}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    >
                      <option value="monthly">Mensual</option>
                      <option value="annual">Anual</option>
                    </select>
                  </div>
                </div>

                {/* Estado */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Estado *</label>
                    <select
                      name="status"
                      defaultValue={editing?.status ?? "trial"}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Moneda</label>
                    <input
                      name="currency"
                      defaultValue={editing?.currency ?? "EUR"}
                      placeholder="EUR"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Inicio suscripción</label>
                    <input
                      name="started_at"
                      type="date"
                      defaultValue={toLocal(editing?.started_at ?? null)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Trial hasta</label>
                    <input
                      name="trial_ends_at"
                      type="date"
                      defaultValue={toLocal(editing?.trial_ends_at ?? null)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Inicio período actual</label>
                    <input
                      name="current_period_start"
                      type="date"
                      defaultValue={toLocal(editing?.current_period_start ?? null)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Fin período actual</label>
                    <input
                      name="current_period_end"
                      type="date"
                      defaultValue={toLocal(editing?.current_period_end ?? null)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Notas internas</label>
                  <textarea
                    name="notes"
                    rows={2}
                    defaultValue={editing?.notes ?? ""}
                    placeholder="Condiciones especiales, descuentos, contexto..."
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                  />
                </div>

                {formError && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {formError}
                  </p>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeModal}
                    className="flex-1 rounded-xl border border-[#E5E7EB] py-3 text-sm font-semibold transition-colors hover:bg-[#F8FAFC]">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 rounded-xl bg-[#2F6FEB] py-3 text-sm font-bold text-white transition-colors hover:bg-[#2459bd] disabled:opacity-50">
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear suscripción"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
