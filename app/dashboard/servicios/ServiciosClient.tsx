"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Clock, Scissors } from "lucide-react";
import { createService, updateService, deleteService } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/empty-state";

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
    <div className="space-y-5">

      <PageHeader
        section="Servicios"
        title="Gestión de servicios"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="btn-dark"
          >
            <Plus size={16} /> Añadir servicio
          </button>
        }
      />

      {services.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title="Sin servicios todavía"
          description="Añade el primero para empezar a recibir reservas."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="btn-dark"
            >
              <Plus size={16} /> Crear primer servicio
            </button>
          }
        />
      ) : (
        <div className="table-shell">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <tr>
                  <th className="table-header-cell">Servicio</th>
                  <th className="table-header-cell">Duración</th>
                  <th className="table-header-cell">Precio</th>
                  <th className="table-header-cell text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {services.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#111827]">{s.name}</p>
                      {s.description && <p className="mt-0.5 text-xs text-neutral-400">{s.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Clock size={13} className="text-neutral-400" /> {s.duration_minutes} min
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-[#111827]">{s.price} €</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          disabled={deleting === s.id}
                          className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40"
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
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-section">Servicios</p>
                  <h2 className="section-heading mt-0.5">
                    {editing ? "Editar servicio" : "Nuevo servicio"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl p-2 transition-colors hover:bg-[#F8FAFC]"
                >
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="form-label">Nombre *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editing?.name ?? ""}
                    placeholder="Ej: Corte clásico"
                    className="input py-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Precio (€) *</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.5"
                      required
                      defaultValue={editing?.price ?? ""}
                      placeholder="15"
                      className="input py-3"
                    />
                  </div>
                  <div>
                    <label className="form-label">Duración (min) *</label>
                    <input
                      name="duration_minutes"
                      type="number"
                      min="5"
                      step="5"
                      required
                      defaultValue={editing?.duration_minutes ?? ""}
                      placeholder="30"
                      className="input py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Descripción (opcional)</label>
                  <input
                    name="description"
                    defaultValue={editing?.description ?? ""}
                    placeholder="Ej: Incluye lavado y secado"
                    className="input py-3"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-outline flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-dark flex-1"
                  >
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear servicio"}
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
