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
            className="flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
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
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
            >
              <Plus size={16} /> Crear primer servicio
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E5E2D9] bg-[#F5F2EA]/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Servicio</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Duración</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Precio</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-neutral-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2D9]">
                {services.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-[#F5F2EA]/50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0D0D0D]">{s.name}</p>
                      {s.description && <p className="mt-0.5 text-xs text-neutral-400">{s.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Clock size={13} className="text-neutral-400" /> {s.duration_minutes} min
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-[#0D0D0D]">{s.price} €</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#F5F2EA] hover:text-[#0D0D0D]"
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
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
            <div className="h-px w-full bg-gradient-to-r from-[#C89B3C]/60 via-[#00C2A8] to-[#C89B3C]/60" />
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Servicios</p>
                  <h2 className="mt-0.5 text-xl font-black text-[#0D0D0D]">
                    {editing ? "Editar servicio" : "Nuevo servicio"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl p-2 transition-colors hover:bg-[#F5F2EA]"
                >
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Nombre *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editing?.name ?? ""}
                    placeholder="Ej: Corte clásico"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Precio (€) *</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.5"
                      required
                      defaultValue={editing?.price ?? ""}
                      placeholder="15"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Duración (min) *</label>
                    <input
                      name="duration_minutes"
                      type="number"
                      min="5"
                      step="5"
                      required
                      defaultValue={editing?.duration_minutes ?? ""}
                      placeholder="30"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Descripción (opcional)</label>
                  <input
                    name="description"
                    defaultValue={editing?.description ?? ""}
                    placeholder="Ej: Incluye lavado y secado"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-2xl border border-[#E5E2D9] py-3 text-sm font-semibold transition-colors hover:bg-[#F5F2EA]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-2xl bg-[#0D0D0D] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A] disabled:opacity-50"
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
