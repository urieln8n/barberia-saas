"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, CheckCircle2, Circle, AlertCircle, Clock } from "lucide-react";
import { createTask, updateTask, deleteTask, toggleTaskStatus } from "./actions";

type Lead = { id: string; business_name: string };
type Deal = { id: string; title: string };

type Task = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string;
  status: string;
  related_type: string | null;
  related_id: string | null;
  created_at: string;
};

const PRIORITY_COLORS: Record<string, string> = {
  baja:    "bg-neutral-100 text-neutral-500",
  media:   "bg-amber-50 text-amber-700 border border-amber-200",
  alta:    "bg-orange-50 text-orange-700 border border-orange-200",
  urgente: "bg-red-50 text-red-600 border border-red-200",
};

const PRIORITY_LABELS: Record<string, string> = {
  baja: "Baja", media: "Media", alta: "Alta", urgente: "Urgente",
};

const STATUS_FILTERS = [
  { key: "all",        label: "Todas" },
  { key: "pendiente",  label: "Pendientes" },
  { key: "en_progreso",label: "En progreso" },
  { key: "completada", label: "Completadas" },
];

function toDatetimeLocal(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date();
  const isOverdue = d < now;
  const str = d.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  return { str, isOverdue };
}

export function TareasClient({ tasks, leads, deals }: { tasks: Task[]; leads: Lead[]; deals: Deal[] }) {
  const [filter, setFilter]     = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Task | null>(null);
  const [toggling,  setToggling]  = useState<string | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openCreate() { setEditing(null); setFormError(null); setShowModal(true); }
  function openEdit(t: Task) { setEditing(t); setFormError(null); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); setFormError(null); }

  async function handleToggle(id: string, status: string) {
    setToggling(id);
    const result = await toggleTaskStatus(id, status);
    setToggling(null);
    if (!result.success) alert(`Error: ${result.error}`);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    setDeleting(id);
    const result = await deleteTask(id);
    setDeleting(null);
    if (!result.success) alert(`Error al eliminar: ${result.error}`);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setFormError(null);
    let result;
    if (editing) {
      formData.append("id", editing.id);
      result = await updateTask(formData);
    } else {
      result = await createTask(formData);
    }
    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    closeModal();
  }

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const pending  = tasks.filter(t => t.status === "pendiente" || t.status === "en_progreso").length;
  const done     = tasks.filter(t => t.status === "completada").length;

  const leadMap = Object.fromEntries(leads.map(l => [l.id, l.business_name]));
  const dealMap = Object.fromEntries(deals.map(d => [d.id, d.title]));

  function getRelatedLabel(t: Task) {
    if (!t.related_type || !t.related_id) return null;
    if (t.related_type === "lead") return `Lead: ${leadMap[t.related_id] ?? t.related_id.slice(0, 8)}`;
    if (t.related_type === "deal") return `Deal: ${dealMap[t.related_id] ?? t.related_id.slice(0, 8)}`;
    return null;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">CRM</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-[#111827]">Tareas</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {pending} pendiente{pending !== 1 ? "s" : ""} · {done} completada{done !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary"
        >
          <Plus size={16} /> Nueva tarea
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(({ key, label }) => {
          const count = key === "all" ? tasks.length : tasks.filter(t => t.status === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === key ? "bg-[#2F6FEB] text-white" : "border border-[#E5E7EB] bg-white text-neutral-600 hover:border-[#CBD5E1]"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de tareas */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] py-16">
          <p className="font-bold text-neutral-500">Sin tareas en esta vista</p>
          {filter === "all" && (
            <button
              type="button"
              onClick={openCreate}
              className="btn-primary mt-4"
            >
              <Plus size={14} /> Añadir primera tarea
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const date = formatDate(task.due_date);
            const done = task.status === "completada";
            const related = getRelatedLabel(task);

            return (
              <div
                key={task.id}
                className={`flex items-start gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-opacity ${
                  done ? "opacity-60 border-[#E5E7EB]" : "border-[#E5E7EB]"
                }`}
              >
                {/* Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(task.id, task.status)}
                  disabled={toggling === task.id}
                  className="mt-0.5 shrink-0 text-neutral-400 transition-colors hover:text-[#111827] disabled:opacity-40"
                >
                  {done
                    ? <CheckCircle2 size={20} className="text-green-600" />
                    : <Circle size={20} />
                  }
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-[#111827] ${done ? "line-through text-neutral-400" : ""}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="mt-0.5 text-sm text-neutral-500 line-clamp-2">{task.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${PRIORITY_COLORS[task.priority] ?? "bg-neutral-100 text-neutral-500"}`}>
                      {PRIORITY_LABELS[task.priority] ?? task.priority}
                    </span>
                    {date && (
                      <span className={`flex items-center gap-1 text-[11px] font-semibold ${
                        date.isOverdue && !done ? "text-red-500" : "text-neutral-400"
                      }`}>
                        {date.isOverdue && !done ? <AlertCircle size={11} /> : <Clock size={11} />}
                        {date.str}
                      </span>
                    )}
                    {related && (
                      <span className="rounded-full bg-[#F8FAFC] px-2 py-0.5 text-[11px] font-semibold text-neutral-500">
                        {related}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => openEdit(task)}
                    className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => handleDelete(task.id)} disabled={deleting === task.id}
                    className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="h-px w-full bg-gradient-to-r from-[#2F6FEB]/60 via-[#2F6FEB] to-[#2F6FEB]/60" />
            <div className="max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">Tareas</p>
                  <h2 className="mt-0.5 text-xl font-black text-[#111827]">
                    {editing ? "Editar tarea" : "Nueva tarea"}
                  </h2>
                </div>
                <button type="button" onClick={closeModal} className="rounded-xl p-2 transition-colors hover:bg-[#F8FAFC]">
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 space-y-4">

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Título *</label>
                  <input
                    name="title"
                    required
                    defaultValue={editing?.title ?? ""}
                    placeholder="Ej: Llamar a Juan García de Barbería El Maestro"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Descripción</label>
                  <textarea
                    name="description"
                    rows={2}
                    defaultValue={editing?.description ?? ""}
                    placeholder="Contexto adicional..."
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Fecha límite</label>
                    <input
                      name="due_date"
                      type="datetime-local"
                      defaultValue={toDatetimeLocal(editing?.due_date ?? null)}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Prioridad</label>
                    <select
                      name="priority"
                      defaultValue={editing?.priority ?? "media"}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                </div>

                {editing && (
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Estado</label>
                    <select
                      name="status"
                      defaultValue={editing.status}
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#2F6FEB] focus:ring-2 focus:ring-[#2F6FEB]/10"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_progreso">En progreso</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                )}

                {/* Relacionar con */}
                <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-500">Vincular a (opcional)</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Tipo</label>
                      <select
                        name="related_type"
                        defaultValue={editing?.related_type ?? ""}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#2F6FEB]"
                      >
                        <option value="">Sin vincular</option>
                        <option value="lead">Lead</option>
                        <option value="deal">Deal</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Lead / Deal</label>
                      <select
                        name="related_id"
                        defaultValue={editing?.related_id ?? ""}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#2F6FEB]"
                      >
                        <option value="">—</option>
                        {leads.length > 0 && (
                          <optgroup label="Leads">
                            {leads.map(l => <option key={l.id} value={l.id}>{l.business_name}</option>)}
                          </optgroup>
                        )}
                        {deals.length > 0 && (
                          <optgroup label="Deals">
                            {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {formError && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeModal}
                    className="flex-1 rounded-xl border border-[#E5E7EB] py-3 text-sm font-semibold transition-colors hover:bg-[#F8FAFC]">
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 rounded-xl bg-[#2F6FEB] py-3 text-sm font-bold text-white transition-colors hover:bg-[#2459bd] disabled:opacity-50">
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear tarea"}
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
