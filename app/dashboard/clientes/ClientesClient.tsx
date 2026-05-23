"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Phone, Mail, StickyNote, Users, MessageCircle, RotateCcw, Star, Sparkles, ArrowRight } from "lucide-react";
import { createClient_, updateClient_, deleteClient_ } from "./actions";
import { PageHeader }  from "@/components/ui/PageHeader";
import { EmptyState }  from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";

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
  const frequentClients = clients.filter((client) => client.last_visit_at).length;
  const lostClients = clients.filter((client) => {
    if (!client.last_visit_at) return false;
    const days = Math.floor((Date.now() - new Date(client.last_visit_at).getTime()) / 86400000);
    return days >= 42;
  }).length;
  const insightClient = clients.find((client) => {
    if (!client.last_visit_at) return false;
    const days = Math.floor((Date.now() - new Date(client.last_visit_at).getTime()) / 86400000);
    return days >= 42;
  });

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow="Clientes"
        title="Gestión de clientes"
        description="Detecta a quién cuidar, a quién recuperar y qué acción tomar después de cada visita."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="btn-dark"
          >
            <Plus size={16} /> Añadir cliente
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clientes frecuentes" value={frequentClients} description="Con visitas registradas" icon={Users} />
        <StatCard label="Clientes perdidos" value={lostClients} description="Más de 42 días sin venir" icon={RotateCcw} iconBg="bg-amber-50" iconColor="text-amber-700" />
        <StatCard label="Total gastado" value="--" description="Disponible al vincular ventas" icon={Sparkles} />
        <StatCard label="Servicio favorito" value="Corte" description="Estimación del catálogo" icon={Star} iconBg="bg-[#D5A84C]/10" iconColor="text-[#8A641F]" />
      </div>

      {insightClient && (
        <div className="flex flex-col gap-3 rounded-[24px] border border-[#D5A84C]/25 bg-[linear-gradient(135deg,#F8F3EA_0%,#FEF3C7_100%)] px-5 py-4 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C9922A]/10">
              <RotateCcw size={15} className="text-[#C9922A]" />
            </div>
            <p className="text-sm font-semibold leading-6 text-slate-700">
              <span className="font-black text-[#8A641F]">{insightClient.name}</span>{" "}
              lleva más de 42 días sin volver. El Agente Retención IA genera su WhatsApp en segundos.
            </p>
          </div>
          <Link
            href="/dashboard/agents"
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-[#C9922A]/30 bg-white px-3 py-2 text-xs font-bold text-[#8A641F] transition-colors hover:bg-[#C9922A]/10"
          >
            <Sparkles size={13} /> Agente Retención <ArrowRight size={11} />
          </Link>
        </div>
      )}

      {clients.length > 0 && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="input-field py-3 shadow-sm"
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
              className="btn-dark"
            >
              <Plus size={16} /> Añadir primer cliente
            </button>
          }
        />
      ) : (
        <div className="premium-card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 md:px-6">
            <p className="label-section">CRM</p>
            <h2 className="section-heading mt-1">Base de clientes</h2>
            <p className="section-subtext">Contacto, última visita y acciones rápidas de retención.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50">
                <tr>
                  <th className="table-header-cell">Cliente</th>
                  <th className="table-header-cell">Contacto</th>
                  <th className="table-header-cell">Última visita</th>
                  <th className="table-header-cell">Valor</th>
                  <th className="table-header-cell text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="bg-white transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-100 text-xs font-black uppercase text-[#C9922A]">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{c.name}</p>
                          {c.notes && <p className="text-xs font-medium text-slate-500">{c.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {c.phone && (
                          <span className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Phone size={12} /> {c.phone}
                          </span>
                        )}
                        {c.email && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <Mail size={12} /> {c.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {c.last_visit_at
                        ? new Date(c.last_visit_at).toLocaleDateString("es-ES")
                        : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-black text-slate-900">-- EUR</p>
                        <p className="text-xs font-medium text-slate-500">Favorito: Corte</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {c.phone && (
                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                            title="Enviar WhatsApp"
                          >
                            <MessageCircle size={15} />
                          </a>
                        )}
                        <Link
                          href="/dashboard/agents"
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-yellow-50 hover:text-yellow-600"
                          title="Pedir reseña — Agente Reseñas IA"
                        >
                          <Star size={15} />
                        </Link>
                        <Link
                          href="/dashboard/agents"
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-[#C9922A]/10 hover:text-[#C9922A]"
                          title="Reactivar con Agente Retención IA"
                        >
                          <RotateCcw size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id)}
                          disabled={deleting === c.id}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40"
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
            <p className="px-6 py-8 text-center text-sm font-medium text-slate-500">
              Sin resultados para &quot;{search}&quot;
            </p>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#D5CEBC] bg-[#F8F3EA] text-slate-950 shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-section">Clientes</p>
                  <h2 className="section-heading mt-0.5">
                    {editing ? "Editar cliente" : "Nuevo cliente"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Cerrar"
                  className="rounded-xl p-2 transition-colors hover:bg-[#FAF8F4]"
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
                    placeholder="Ej: Carlos García"
                    className="input-field py-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label flex items-center gap-1.5">
                      <Phone size={13} /> Teléfono
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      defaultValue={editing?.phone ?? ""}
                      placeholder="+34 600 000 000"
                      className="input-field py-3"
                    />
                  </div>
                  <div>
                    <label className="form-label flex items-center gap-1.5">
                      <Mail size={13} /> Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={editing?.email ?? ""}
                      placeholder="cliente@email.com"
                      className="input-field py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label flex items-center gap-1.5">
                    <StickyNote size={13} /> Notas (opcional)
                  </label>
                  <input
                    name="notes"
                    defaultValue={editing?.notes ?? ""}
                    placeholder="Ej: Prefiere degradado bajo"
                    className="input-field py-3"
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
