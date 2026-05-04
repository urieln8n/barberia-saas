"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Clock } from "lucide-react";
import { createService, updateService, deleteService } from "./actions";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  active: boolean;
};

type Props = {
  services: Service[];
  barbershopId: string;
};

const emptyForm = { name: "", price: "", duration_minutes: "", description: "" };

export function ServiciosClient({ services, barbershopId }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Service | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(s: Service) { setEditing(s); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return;
    setDeleting(id);
    await deleteService(id);
    setDeleting(null);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.append("barbershop_id", barbershopId);
    if (editing) {
      formData.append("id", editing.id);
      await updateService(formData);
    } else {
      await createService(formData);
    }
    setSaving(false);
    closeModal();
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-neutral-500">Panel de control</p>
          <h1 className="text-4xl font-black">Servicios</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:opacity-80"
        >
          <Plus size={16} /> Añadir servicio
        </button>
      </div>

      {services.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="font-semibold text-neutral-600">Sin servicios todavía</p>
          <p className="mt-1 text-sm text-neutral-400">Añade el primero para empezar a recibir reservas.</p>
          <button
            onClick={openCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:opacity-80"
          >
            <Plus size={16} /> Crear primer servicio
          </button>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Servicio</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Duración</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Precio</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{s.name}</p>
                    {s.description && <p className="text-neutral-400">{s.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> {s.duration_minutes} min
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{s.price} €</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100 hover:text-ink"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleting === s.id}
                        className="rounded-xl p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                      >
                        <Trash2 size={15} />
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
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                {editing ? "Editar servicio" : "Nuevo servicio"}
              </h2>
              <button onClick={closeModal} className="rounded-xl p-2 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>

            <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Nombre *
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editing?.name ?? ""}
                  placeholder="Ej: Corte clásico"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700">
                    Precio (€) *
                  </label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    defaultValue={editing?.price ?? ""}
                    placeholder="15"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700">
                    Duración (min) *
                  </label>
                  <input
                    name="duration_minutes"
                    type="number"
                    min="5"
                    step="5"
                    required
                    defaultValue={editing?.duration_minutes ?? ""}
                    placeholder="30"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Descripción (opcional)
                </label>
                <input
                  name="description"
                  defaultValue={editing?.description ?? ""}
                  placeholder="Ej: Incluye lavado y secado"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl border border-neutral-200 py-3 text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-ink py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear servicio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
