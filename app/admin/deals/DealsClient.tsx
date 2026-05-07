"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createDeal, updateDeal, deleteDeal } from "./actions";

type Lead = { id: string; business_name: string };

type Deal = {
  id: string;
  lead_id: string | null;
  title: string;
  value: number | null;
  stage: string;
  probability: number | null;
  expected_close_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const STAGE_LABELS: Record<string, string> = {
  prospecting:  "Prospecting",
  qualification:"Calificación",
  proposal:     "Propuesta",
  negotiation:  "Negociación",
  closed_won:   "Ganado",
  closed_lost:  "Perdido",
};

const STAGE_COLORS: Record<string, string> = {
  prospecting:  "bg-neutral-100 text-neutral-600",
  qualification:"bg-blue-50 text-blue-700 border border-blue-200",
  proposal:     "bg-amber-50 text-amber-700 border border-amber-200",
  negotiation:  "bg-orange-50 text-orange-700 border border-orange-200",
  closed_won:   "bg-green-50 text-green-700 border border-green-200",
  closed_lost:  "bg-red-50 text-red-500 border border-red-200",
};

const ALL_STAGES = ["prospecting","qualification","proposal","negotiation","closed_won","closed_lost"];

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export function DealsClient({ deals, leads }: { deals: Deal[]; leads: Lead[] }) {
  const [filter, setFilter]     = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Deal | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(d: Deal) { setEditing(d); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este deal?")) return;
    setDeleting(id);
    await deleteDeal(id);
    setDeleting(null);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    if (editing) {
      formData.append("id", editing.id);
      await updateDeal(formData);
    } else {
      await createDeal(formData);
    }
    setSaving(false);
    closeModal();
  }

  const filtered = filter === "all" ? deals : deals.filter(d => d.stage === filter);
  const openValue = deals.filter(d => d.status === "open").reduce((acc, d) => acc + (d.value ?? 0), 0);
  const wonValue  = deals.filter(d => d.status === "won").reduce((acc, d) => acc + (d.value ?? 0), 0);

  const leadMap = Object.fromEntries(leads.map(l => [l.id, l.business_name]));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">CRM</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#0D0D0D]">Pipeline</h1>
          <p className="mt-1 text-sm text-neutral-500">{deals.length} deal{deals.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
        >
          <Plus size={16} /> Nuevo deal
        </button>
      </div>

      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Pipeline abierto</p>
          <p className="mt-1 text-2xl font-black text-[#0D0D0D]">{openValue.toFixed(0)} €</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Valor ganado</p>
          <p className="mt-1 text-2xl font-black text-green-700">{wonValue.toFixed(0)} €</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            filter === "all" ? "bg-[#0D0D0D] text-white" : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
          }`}
        >
          Todos ({deals.length})
        </button>
        {ALL_STAGES.map(s => {
          const count = deals.filter(d => d.stage === s).length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === s ? "bg-[#0D0D0D] text-white" : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
              }`}
            >
              {STAGE_LABELS[s]} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-[#F5F2EA] py-16">
          <p className="font-bold text-neutral-500">
            {filter === "all" ? "Sin deals todavía" : `Sin deals en "${STAGE_LABELS[filter]}"`}
          </p>
          {filter === "all" && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-4 flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-4 py-2 text-sm font-bold text-white"
            >
              <Plus size={14} /> Añadir primer deal
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E2D9] bg-[#F5F2EA]">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Deal</th>
                <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400 md:table-cell">Lead</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Stage</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-neutral-400">Valor</th>
                <th className="hidden px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-neutral-400 lg:table-cell">% prob.</th>
                <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400 lg:table-cell">Cierre est.</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2D9]">
              {filtered.map(deal => (
                <tr key={deal.id} className="transition-colors hover:bg-[#F5F2EA]/50">
                  <td className="px-4 py-3 font-bold text-[#0D0D0D]">{deal.title}</td>
                  <td className="hidden px-4 py-3 text-neutral-500 md:table-cell">
                    {deal.lead_id ? (leadMap[deal.lead_id] ?? "Lead eliminado") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STAGE_COLORS[deal.stage] ?? "bg-neutral-100 text-neutral-500"}`}>
                      {STAGE_LABELS[deal.stage] ?? deal.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-[#0D0D0D]">
                    {deal.value ? `${deal.value} €` : "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-neutral-500 lg:table-cell">
                    {deal.probability != null ? `${deal.probability}%` : "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-neutral-500 lg:table-cell">
                    {formatDate(deal.expected_close_date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => openEdit(deal)}
                        className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#F5F2EA] hover:text-[#0D0D0D]">
                        <Pencil size={14} />
                      </button>
                      <button type="button" onClick={() => handleDelete(deal.id)} disabled={deleting === deal.id}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="h-px w-full bg-gradient-to-r from-[#C89B3C]/60 via-[#00C2A8] to-[#C89B3C]/60" />
            <div className="max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Pipeline</p>
                  <h2 className="mt-0.5 text-xl font-black text-[#0D0D0D]">
                    {editing ? "Editar deal" : "Nuevo deal"}
                  </h2>
                </div>
                <button type="button" onClick={closeModal} className="rounded-xl p-2 transition-colors hover:bg-[#F5F2EA]">
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 space-y-4">

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Título del deal *</label>
                  <input
                    name="title"
                    required
                    defaultValue={editing?.title ?? ""}
                    placeholder="Ej: Barbería El Maestro — Plan Starter"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Lead asociado</label>
                  <select
                    name="lead_id"
                    defaultValue={editing?.lead_id ?? ""}
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  >
                    <option value="">Sin lead asociado</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.business_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Valor (€/mes)</label>
                    <input
                      name="value"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={editing?.value ?? 0}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Probabilidad (%)</label>
                    <input
                      name="probability"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={editing?.probability ?? 0}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Stage</label>
                    <select
                      name="stage"
                      defaultValue={editing?.stage ?? "prospecting"}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                    >
                      {ALL_STAGES.map(s => (
                        <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Estado</label>
                    <select
                      name="status"
                      defaultValue={editing?.status ?? "open"}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                    >
                      <option value="open">Abierto</option>
                      <option value="won">Ganado</option>
                      <option value="lost">Perdido</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Fecha cierre estimada</label>
                  <input
                    name="expected_close_date"
                    type="date"
                    defaultValue={editing?.expected_close_date ?? ""}
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Notas</label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={editing?.notes ?? ""}
                    placeholder="Contexto del deal..."
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeModal}
                    className="flex-1 rounded-2xl border border-[#E5E2D9] py-3 text-sm font-semibold transition-colors hover:bg-[#F5F2EA]">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 rounded-2xl bg-[#0D0D0D] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A] disabled:opacity-50">
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear deal"}
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
