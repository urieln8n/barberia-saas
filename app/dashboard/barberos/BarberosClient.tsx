"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Phone, ToggleLeft, ToggleRight } from "lucide-react";
import { createBarber, updateBarber, deleteBarber, toggleBarber } from "./actions";

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
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-neutral-500">Panel de control</p>
          <h1 className="text-4xl font-black">Barberos</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:opacity-80"
        >
          <Plus size={16} /> Añadir barbero
        </button>
      </div>

      {barbers.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="font-semibold text-neutral-600">Sin barberos todavía</p>
          <p className="mt-1 text-sm text-neutral-400">Añade tu equipo para asignarles citas.</p>
          <button
            onClick={openCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:opacity-80"
          >
            <Plus size={16} /> Añadir primer barbero
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((b) => (
            <div
              key={b.id}
              className={`rounded-3xl border bg-white p-6 transition-opacity ${!b.active ? "opacity-50" : "border-neutral-200"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-xl font-black uppercase">
                  {b.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(b)}
                    className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-ink"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deleting === b.id}
                    className="rounded-xl p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-lg font-bold">{b.name}</p>
              {b.phone && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                  <Phone size={13} /> {b.phone}
                </p>
              )}

              <button
                onClick={() => handleToggle(b.id, b.active)}
                disabled={toggling === b.id}
                className="mt-4 flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-ink disabled:opacity-40"
              >
                {b.active
                  ? <><ToggleRight size={18} className="text-green-500" /> Activo</>
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
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                {editing ? "Editar barbero" : "Nuevo barbero"}
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
                  placeholder="Ej: Miguel"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Teléfono (opcional)
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={editing?.phone ?? ""}
                  placeholder="+34 600 000 000"
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
                  {saving ? "Guardando..." : editing ? "Guardar cambios" : "Añadir barbero"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
