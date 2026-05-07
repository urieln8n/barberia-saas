"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Phone, ToggleLeft, ToggleRight, User } from "lucide-react";
import { createBarber, updateBarber, deleteBarber, toggleBarber } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/empty-state";

type Barber = {
  id: string;
  name: string;
  phone: string | null;
  active: boolean;
};

type Props = {
  barbers: Barber[];
  barbershopId: string;
};

export function BarberosClient({ barbers, barbershopId }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Barber | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [toggling,  setToggling]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(b: Barber) { setEditing(b); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este barbero?")) return;
    setDeleting(id);
    await deleteBarber(id);
    setDeleting(null);
  }

  async function handleToggle(id: string, current: boolean) {
    setToggling(id);
    await toggleBarber(id, !current);
    setToggling(null);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.append("barbershop_id", barbershopId);
    if (editing) {
      formData.append("id", editing.id);
      await updateBarber(formData);
    } else {
      await createBarber(formData);
    }
    setSaving(false);
    closeModal();
  }

  return (
    <div className="space-y-5">

      <PageHeader
        section="Barberos"
        title="Tu equipo"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="btn-dark"
          >
            <Plus size={16} /> Añadir barbero
          </button>
        }
      />

      {barbers.length === 0 ? (
        <EmptyState
          icon={User}
          title="Sin barberos todavía"
          description="Añade tu equipo para asignarles citas."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="btn-dark"
            >
              <Plus size={16} /> Añadir primer barbero
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border bg-white p-6 shadow-sm transition-opacity ${
                !b.active ? "border-neutral-200 opacity-50" : "border-[#E5E7EB]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111827] text-xl font-black uppercase text-[#7AA2FF]">
                  {b.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(b)}
                    className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#F8FAFC] hover:text-[#111827]"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    disabled={deleting === b.id}
                    className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-lg font-black text-[#111827]">{b.name}</p>
              {b.phone && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                  <Phone size={13} /> {b.phone}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleToggle(b.id, b.active)}
                disabled={toggling === b.id}
                className="mt-4 flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-[#111827] disabled:opacity-40"
              >
                {b.active
                  ? <><ToggleRight size={18} className="text-green-600" /> Activo</>
                  : <><ToggleLeft size={18} /> Inactivo</>
                }
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-section">Barberos</p>
                  <h2 className="section-heading mt-0.5">
                    {editing ? "Editar barbero" : "Nuevo barbero"}
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
                    placeholder="Ej: Miguel"
                    className="input py-3"
                  />
                </div>

                <div>
                  <label className="form-label">Teléfono (opcional)</label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={editing?.phone ?? ""}
                    placeholder="+34 600 000 000"
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
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Añadir barbero"}
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
