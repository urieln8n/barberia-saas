"use client";

import { useState } from "react";
import { Plus, X, Trash2, Banknote } from "lucide-react";
import { createPayment, deletePayment } from "./actions";

type Payment = {
  id: string;
  amount: number;
  method: string;
  notes: string | null;
  status: string;
  created_at: string;
  clients: { name: string } | null;
};

type Client = { id: string; name: string };

type Props = {
  payments: Payment[];
  clients: Client[];
  barbershopId: string;
};

const METHOD_LABEL: Record<string, string> = {
  cash:     "Efectivo",
  card:     "Tarjeta",
  bizum:    "Bizum",
  transfer: "Transferencia",
  other:    "Otro",
};

const METHOD_COLOR: Record<string, string> = {
  cash:     "bg-green-50 text-green-700",
  card:     "bg-blue-50 text-blue-700",
  bizum:    "bg-purple-50 text-purple-700",
  transfer: "bg-orange-50 text-orange-700",
  other:    "bg-neutral-100 text-neutral-600",
};

export function PagosClient({ payments, clients, barbershopId }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const total = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setFormError("");
    formData.append("barbershop_id", barbershopId);
    const result = await createPayment(formData);
    setSaving(false);
    if (result?.error) {
      setFormError(result.error);
    } else {
      setShowModal(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este pago?")) return;
    setDeleting(id);
    await deletePayment(id);
    setDeleting(null);
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-neutral-500">Panel de control</p>
          <h1 className="text-4xl font-black">Pagos</h1>
        </div>
        <button
          onClick={() => { setFormError(""); setShowModal(true); }}
          className="flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:opacity-80"
        >
          <Plus size={16} /> Registrar pago
        </button>
      </div>

      {/* Resumen del día */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Total cobrado hoy</p>
          <p className="mt-1 text-3xl font-black">{total.toFixed(2)} €</p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Nº de cobros</p>
          <p className="mt-1 text-3xl font-black">{payments.length}</p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Ticket medio</p>
          <p className="mt-1 text-3xl font-black">
            {payments.length > 0 ? (total / payments.length).toFixed(2) : "0.00"} €
          </p>
        </div>
      </div>

      {/* Lista de pagos */}
      {payments.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <Banknote className="mx-auto mb-3 text-neutral-300" size={36} />
          <p className="font-semibold text-neutral-600">Sin pagos registrados hoy</p>
          <p className="mt-1 text-sm text-neutral-400">Registra cobros manuales aquí.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Hora</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Cliente</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Método</th>
                <th className="px-6 py-4 text-left font-semibold text-neutral-500">Notas</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-500">Importe</th>
                <th className="px-6 py-4 text-right font-semibold text-neutral-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 text-neutral-500">
                    {new Date(p.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {p.clients?.name ?? <span className="text-neutral-300">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${METHOD_COLOR[p.method] ?? METHOD_COLOR.other}`}>
                      {METHOD_LABEL[p.method] ?? p.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">{p.notes ?? "—"}</td>
                  <td className="px-6 py-4 text-right font-bold">{p.amount.toFixed(2)} €</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="rounded-xl p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
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
              <h2 className="text-xl font-black">Registrar pago</h2>
              <button onClick={() => setShowModal(false)} className="rounded-xl p-2 hover:bg-neutral-100">
                <X size={18} />
              </button>
            </div>

            <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">Importe (€) *</label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Ej: 18.00"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">Método de pago *</label>
                <select name="method" required className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink">
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                  <option value="bizum">Bizum</option>
                  <option value="transfer">Transferencia</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">Cliente (opcional)</label>
                <select name="client_id" className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink">
                  <option value="">Sin vincular</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">Notas (opcional)</label>
                <input
                  name="notes"
                  placeholder="Ej: Corte + barba"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              {formError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-2xl border border-neutral-200 py-3 text-sm font-semibold hover:bg-neutral-50">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 rounded-2xl bg-ink py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50">
                  {saving ? "Guardando..." : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
