"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Phone, Mail, MapPin } from "lucide-react";
import { createLead, updateLead, deleteLead } from "./actions";

type Lead = {
  id: string;
  business_name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  country: string | null;
  source: string | null;
  status: string;
  potential_mrr: number | null;
  notes: string | null;
  last_contacted_at: string | null;
  next_action_at: string | null;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  nuevo:             "Nuevo",
  contactado:        "Contactado",
  demo_agendada:     "Demo agendada",
  propuesta_enviada: "Propuesta enviada",
  trial_activo:      "Trial activo",
  ganado:            "Ganado",
  perdido:           "Perdido",
};

const STATUS_COLORS: Record<string, string> = {
  nuevo:             "bg-neutral-100 text-neutral-600",
  contactado:        "bg-blue-50 text-blue-700 border border-blue-200",
  demo_agendada:     "bg-purple-50 text-purple-700 border border-purple-200",
  propuesta_enviada: "bg-amber-50 text-amber-700 border border-amber-200",
  trial_activo:      "bg-[#2F6FEB]/10 text-[#2459bd] border border-[#2F6FEB]/30",
  ganado:            "bg-green-50 text-green-700 border border-green-200",
  perdido:           "bg-red-50 text-red-500 border border-red-200",
};

const SOURCE_LABELS: Record<string, string> = {
  directo:   "Directo",
  instagram: "Instagram",
  referido:  "Referido",
  google:    "Google",
  linkedin:  "LinkedIn",
  feria:     "Feria/Evento",
  otro:      "Otro",
};

const ALL_STATUSES = ["nuevo","contactado","demo_agendada","propuesta_enviada","trial_activo","ganado","perdido"];
const ALL_SOURCES  = ["directo","instagram","referido","google","linkedin","feria","otro"];

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export function LeadsClient({ leads }: { leads: Lead[] }) {
  const [filter, setFilter]     = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Lead | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openCreate() { setEditing(null); setFormError(null); setShowModal(true); }
  function openEdit(l: Lead) { setEditing(l); setFormError(null); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); setFormError(null); }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este lead?")) return;
    setDeleting(id);
    const result = await deleteLead(id);
    setDeleting(null);
    if (!result.success) alert(`Error al eliminar: ${result.error}`);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setFormError(null);
    let result;
    if (editing) {
      formData.append("id", editing.id);
      result = await updateLead(formData);
    } else {
      result = await createLead(formData);
    }
    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    closeModal();
  }

  const filtered = filter === "all" ? leads : leads.filter(l => l.status === filter);

  const counts: Record<string, number> = { all: leads.length };
  ALL_STATUSES.forEach(s => { counts[s] = leads.filter(l => l.status === s).length; });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">CRM</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#111827]">Leads</h1>
          <p className="mt-1 text-sm text-neutral-500">{leads.length} lead{leads.length !== 1 ? "s" : ""} en el sistema</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary"
        >
          <Plus size={16} /> Nuevo lead
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            filter === "all" ? "bg-[#2F6FEB] text-white" : "border border-[#E5E7EB] bg-white text-neutral-600 hover:border-[#CBD5E1]"
          }`}
        >
          Todos ({counts.all})
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
            {STATUS_LABELS[s]} {counts[s] > 0 && `(${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] py-16">
          <p className="font-bold text-neutral-500">
            {filter === "all" ? "Sin leads todavía" : `Sin leads en "${STATUS_LABELS[filter]}"`}
          </p>
          {filter === "all" && (
            <button
              type="button"
              onClick={openCreate}
              className="btn-primary mt-4"
            >
              <Plus size={14} /> Añadir primer lead
            </button>
          )}
        </div>
      ) : (
        <div className="table-shell">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Barbería</th>
                <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400 md:table-cell">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Estado</th>
                <th className="hidden px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-neutral-400 lg:table-cell">MRR pot.</th>
                <th className="hidden px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-neutral-400 lg:table-cell">Próx. acción</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map(lead => (
                <tr key={lead.id} className="transition-colors hover:bg-[#F8FAFC]/70">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#111827]">{lead.business_name}</p>
                    {lead.city && (
                      <p className="flex items-center gap-1 text-xs text-neutral-400">
                        <MapPin size={10} /> {lead.city}
                      </p>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <p className="font-medium text-neutral-700">{lead.contact_name ?? "—"}</p>
                    <div className="flex flex-col gap-0.5">
                      {lead.phone && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <Phone size={10} /> {lead.phone}
                        </span>
                      )}
                      {lead.email && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <Mail size={10} /> {lead.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_COLORS[lead.status] ?? "bg-neutral-100 text-neutral-500"}`}>
                      {STATUS_LABELS[lead.status] ?? lead.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono text-sm font-semibold text-[#111827] lg:table-cell">
                    {lead.potential_mrr ? `${lead.potential_mrr} €` : "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-neutral-500 lg:table-cell">
                    {formatDate(lead.next_action_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(lead)}
                        className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(lead.id)}
                        disabled={deleting === lead.id}
                        className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40"
                      >
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
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="h-px w-full bg-gradient-to-r from-[#2F6FEB]/60 via-[#2F6FEB] to-[#2F6FEB]/60" />
            <div className="max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">CRM</p>
                  <h2 className="mt-0.5 text-xl font-black text-[#111827]">
                    {editing ? "Editar lead" : "Nuevo lead"}
                  </h2>
                </div>
                <button type="button" onClick={closeModal} className="rounded-xl p-2 transition-colors hover:bg-[#F8FAFC]">
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 space-y-4">

                {/* Fila 1 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Nombre barbería *</label>
                    <input
                      name="business_name"
                      required
                      defaultValue={editing?.business_name ?? ""}
                      placeholder="Barbería El Maestro"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Persona de contacto</label>
                    <input
                      name="contact_name"
                      defaultValue={editing?.contact_name ?? ""}
                      placeholder="Juan García"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                </div>

                {/* Fila 2 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Teléfono</label>
                    <input
                      name="phone"
                      type="tel"
                      defaultValue={editing?.phone ?? ""}
                      placeholder="+34 600 000 000"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={editing?.email ?? ""}
                      placeholder="juan@barberia.com"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                </div>

                {/* Fila 3 */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Ciudad</label>
                    <input
                      name="city"
                      defaultValue={editing?.city ?? ""}
                      placeholder="Madrid"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">País</label>
                    <input
                      name="country"
                      defaultValue={editing?.country ?? "ES"}
                      placeholder="ES"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">MRR potencial (€)</label>
                    <input
                      name="potential_mrr"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={editing?.potential_mrr ?? 0}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                </div>

                {/* Fila 4 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Origen</label>
                    <select
                      name="source"
                      defaultValue={editing?.source ?? "directo"}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    >
                      {ALL_SOURCES.map(s => (
                        <option key={s} value={s}>{SOURCE_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Estado</label>
                    <select
                      name="status"
                      defaultValue={editing?.status ?? "nuevo"}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fila 5 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Último contacto</label>
                    <input
                      name="last_contacted_at"
                      type="datetime-local"
                      defaultValue={toDatetimeLocal(editing?.last_contacted_at ?? null)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Próxima acción</label>
                    <input
                      name="next_action_at"
                      type="datetime-local"
                      defaultValue={toDatetimeLocal(editing?.next_action_at ?? null)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Notas</label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={editing?.notes ?? ""}
                    placeholder="Contexto, observaciones, próximos pasos..."
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
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-xl border border-[#E5E7EB] py-3 text-sm font-semibold transition-colors hover:bg-[#F8FAFC]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-[#2F6FEB] py-3 text-sm font-bold text-white transition-colors hover:bg-[#2459bd] disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear lead"}
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
