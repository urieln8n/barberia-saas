"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Phone, Mail, StickyNote } from "lucide-react";
import { createClient_, updateClient_, deleteClient_ } from "./actions";

type Client = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  last_visit_at: string | null;
};

type Props = {
  clients: Client[];
  barbershopId: string;
};

export function ClientesClient({ clients, barbershopId }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Client | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [search,    setSearch]    = useState("");

  function openCreate() { setEditing(null); setShowModal(true); }
  function openEdit(c: Client) { setEditing(c); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este cliente?")) return;
    setDeleting(id);
    await deleteClient_(id);
    setDeleting(null);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.append("barbershop_id", barbershopId);
    if (editing) {
      formData.append("id", editing.id);
      await updateClient_(formData);
    } else {
      await createClient_(formData);
    }
    setSaving(false);
    closeModal();
  }

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-neutral-500">Panel de control</p>
          <h1 className="text-4xl font-black">Clientes</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800"
        >
          <Plus size={16} /> Añadir cliente
        </button>
      </div>

      {clients.length > 0 && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="mt-6 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
        />
      )}

      {clients.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="font-semibold text-neutral-600">Sin clientes todavía</p>
          <p className="mt-1 text-sm text-neutral-400">Los clientes se añaden aquí o desde la página de reservas.</p>
          <button
            onClick={openCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800"
          >
            <Plus size={16} /> Añadir primer cliente
          </button>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Cliente</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Contacto</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Última visita</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{c.name}</p>
                        {c.notes && <p className="text-xs text-neutral-400">{c.notes}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {c.phone && (
                        <span className="flex items-center gap-1.5 text-neutral-600">
                          <Phone size={12} /> {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1.5 text-neutral-400">
                          <Mail size={12} /> {c.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {c.last_visit_at
                      ? new Date(c.last_visit_at).toLocaleDateString("es-ES")
                      : <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 hover:text-ink"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deleting === c.id}
                        className="rounded-xl p-2 text-neutral-400 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
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
          {filtered.length === 0 && search && (
            <p className="px-6 py-8 text-center text-sm text-neutral-400">
              Sin resultados para "{search}"
            </p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">
                {editing ? "Editar cliente" : "Nuevo cliente"}
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
                  placeholder="Ej: Carlos García"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
                    <Phone size={13} /> Teléfono
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={editing?.phone ?? ""}
                    placeholder="+34 600 000 000"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
                    <Mail size={13} /> Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={editing?.email ?? ""}
                    placeholder="cliente@email.com"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
                  <StickyNote size={13} /> Notas (opcional)
                </label>
                <input
                  name="notes"
                  defaultValue={editing?.notes ?? ""}
                  placeholder="Ej: Prefiere degradado bajo"
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
                  className="flex-1 rounded-2xl bg-red-700 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editing ? "Guardar cambios" : "Añadir cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
