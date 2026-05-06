"use client";

import { useState } from "react";
import { Plus, X, Trash2, Banknote, TrendingUp, CreditCard } from "lucide-react";
import { createPayment, deletePayment } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/empty-state";

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
  cash:     "bg-green-50 text-green-700 border-green-100",
  card:     "bg-blue-50 text-blue-700 border-blue-100",
  bizum:    "bg-amber-50 text-amber-700 border-amber-100",
  transfer: "bg-orange-50 text-orange-700 border-orange-100",
  other:    "bg-neutral-100 text-neutral-600 border-neutral-200",
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

  const ticketMedio = payments.length > 0 ? (total / payments.length).toFixed(2) : "0.00";

  return (
    <div className="space-y-5">

      <PageHeader
        section="Pagos"
        title="Cobros del día"
        action={
          <button
            type="button"
            onClick={() => { setFormError(""); setShowModal(true); }}
            className="flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
          >
            <Plus size={16} /> Registrar pago
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Total cobrado hoy</p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#00C2A8]/10">
              <TrendingUp size={15} className="text-[#00C2A8]" />
            </div>
          </div>
          <p className="mt-3 text-4xl font-black text-[#0D0D0D]">{total.toFixed(2)} €</p>
          <p className="mt-1.5 text-xs text-neutral-400">Pagos con estado cobrado</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Nº de cobros</p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C89B3C]/10">
              <CreditCard size={15} className="text-[#C89B3C]" />
            </div>
          </div>
          <p className="mt-3 text-4xl font-black text-[#0D0D0D]">{payments.length}</p>
          <p className="mt-1.5 text-xs text-neutral-400">Registros del día</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Ticket medio</p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Banknote size={15} className="text-blue-500" />
            </div>
          </div>
          <p className="mt-3 text-4xl font-black text-[#0D0D0D]">{ticketMedio} €</p>
          <p className="mt-1.5 text-xs text-neutral-400">Importe medio por cobro</p>
        </div>
      </div>

      {/* Lista de pagos */}
      {payments.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title="Sin pagos registrados hoy"
          description="Registra cobros manuales aquí para llevar el control diario."
          action={
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
            >
              <Plus size={15} /> Registrar primer cobro
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-[#E5E2D9] px-6 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Hoy</p>
            <h2 className="mt-0.5 font-black text-[#0D0D0D]">Pagos registrados</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E5E2D9] bg-[#F5F2EA]/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Hora</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Método</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-400">Notas</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-neutral-400">Importe</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-neutral-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E2D9]">
                {payments.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-[#F5F2EA]/50">
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(p.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0D0D0D]">
                      {p.clients?.name ?? <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${METHOD_COLOR[p.method] ?? METHOD_COLOR.other}`}>
                        {METHOD_LABEL[p.method] ?? p.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400">{p.notes ?? "—"}</td>
                    <td className="px-6 py-4 text-right font-black text-[#0D0D0D]">{p.amount.toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deleting === p.id}
                        className="rounded-xl p-2 text-neutral-300 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
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
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Pagos</p>
                  <h2 className="mt-0.5 text-xl font-black text-[#0D0D0D]">Registrar pago</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl p-2 transition-colors hover:bg-[#F5F2EA]"
                >
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Importe (€) *</label>
                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="Ej: 18.00"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Método de pago *</label>
                  <select
                    name="method"
                    required
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                    <option value="bizum">Bizum</option>
                    <option value="transfer">Transferencia</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Cliente (opcional)</label>
                  <select
                    name="client_id"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  >
                    <option value="">Sin vincular</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Notas (opcional)</label>
                  <input
                    name="notes"
                    placeholder="Ej: Corte + barba"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>

                {formError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-2xl border border-[#E5E2D9] py-3 text-sm font-semibold transition-colors hover:bg-[#F5F2EA]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-2xl bg-[#0D0D0D] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A] disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "Registrar"}
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
