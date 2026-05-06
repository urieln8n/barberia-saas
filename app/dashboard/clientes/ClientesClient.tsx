"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Phone, Mail, StickyNote, Users } from "lucide-react";
import { createClient_, updateClient_, deleteClient_ } from "./actions";
import { PageHeader }  from "@/components/dashboard/PageHeader";
import { EmptyState }  from "@/components/dashboard/empty-state";

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
    <div className="space-y-5">

      <PageHeader
        section="Clientes"
        title="Gestión de clientes"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
          >
            <Plus size={16} /> Añadir cliente
          </button>
        }
      />

      {clients.length > 0 && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
        />
      )}

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin clientes todavía"
          description="Los clientes se añaden aquí o desde la página de reservas."
          action={
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
            >
              <Plus size={16} /> Añadir primer cliente
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E5E2D9] bg-[#F5F2EA]/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Contacto</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Última visita</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-neutral-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2D9]">
                {filtered.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-[#F5F2EA]/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0D0D0D] text-xs font-bold uppercase text-[#C89B3C]">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0D0D0D]">{c.name}</p>
                          {c.notes && <p className="text-xs text-neutral-400">{c.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {c.phone && (
                          <span className="flex items-center gap-1.5 text-sm text-neutral-600">
                            <Phone size={12} /> {c.phone}
                          </span>
                        )}
                        {c.email && (
                          <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                            <Mail size={12} /> {c.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {c.last_visit_at
                        ? new Date(c.last_visit_at).toLocaleDateString("es-ES")
                        : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#F5F2EA] hover:text-[#0D0D0D]"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          disabled={deleting === c.id}
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
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
            <div className="h-px w-full bg-gradient-to-r from-[#C89B3C]/60 via-[#00C2A8] to-[#C89B3C]/60" />
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Clientes</p>
                  <h2 className="mt-0.5 text-xl font-black text-[#0D0D0D]">
                    {editing ? "Editar cliente" : "Nuevo cliente"}
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
                    placeholder="Ej: Carlos García"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
                      <Phone size={13} /> Teléfono
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      defaultValue={editing?.phone ?? ""}
                      placeholder="+34 600 000 000"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
                      <Mail size={13} /> Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={editing?.email ?? ""}
                      placeholder="cliente@email.com"
                      className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
                    <StickyNote size={13} /> Notas (opcional)
                  </label>
                  <input
                    name="notes"
                    defaultValue={editing?.notes ?? ""}
                    placeholder="Ej: Prefiere degradado bajo"
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
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Añadir cliente"}
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
