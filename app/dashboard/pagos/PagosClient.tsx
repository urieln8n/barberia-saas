"use client";

import { useState } from "react";
import { Plus, X, Trash2, Banknote, TrendingUp, CreditCard } from "lucide-react";
import { createPayment, deletePayment } from "./actions";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";

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
  cash:     "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20",
  card:     "bg-violet-500/[0.08] text-violet-400 border-violet-500/20",
  bizum:    "bg-amber-500/[0.08] text-amber-400 border-amber-500/20",
  transfer: "bg-orange-500/[0.08] text-orange-400 border-orange-500/20",
  other:    "bg-white/[0.04] text-white/50 border-white/[0.10]",
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
        description="Registra cobros manuales y revisa la caja diaria."
        action={
          <PrimaryButton
            type="button"
            onClick={() => { setFormError(""); setShowModal(true); }}
            variant="primary"
          >
            <Plus size={16} /> Registrar pago
          </PrimaryButton>
        }
        metrics={
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="Total cobrado hoy" value={`${total.toFixed(2)} €`} description="Pagos con estado cobrado" icon={TrendingUp} />
            <StatCard label="Nº de cobros" value={payments.length} description="Registros del día" icon={CreditCard} />
            <StatCard label="Ticket medio" value={`${ticketMedio} €`} description="Importe medio por cobro" icon={Banknote} />
          </div>
        }
      />

      {/* Lista de pagos */}
      {payments.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title="Sin pagos registrados hoy"
          description="Registra cobros manuales aquí para llevar el control diario."
          action={
            <PrimaryButton
              type="button"
              onClick={() => setShowModal(true)}
              variant="primary"
            >
              <Plus size={15} /> Registrar primer cobro
            </PrimaryButton>
          }
        />
      ) : (
        <SectionCard
          title="Pagos registrados"
          description="Cobros creados hoy."
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-500">Hora</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-500">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-500">Método</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-neutral-500">Notas</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-neutral-500">Importe</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-neutral-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {payments.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-[#F8FAFC]/50">
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {new Date(p.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#111827]">
                      {p.clients?.name ?? <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${METHOD_COLOR[p.method] ?? METHOD_COLOR.other}`}>
                        {METHOD_LABEL[p.method] ?? p.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{p.notes ?? "—"}</td>
                    <td className="px-6 py-4 text-right font-black text-[#111827]">{p.amount.toFixed(2)} €</td>
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
        </SectionCard>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0E0E1C] shadow-2xl">
            <div className="h-px w-full bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37] to-[#D4AF37]/40" />
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Pagos</p>
                  <h2 className="mt-0.5 text-xl font-black text-white">Registrar pago</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  aria-label="Cerrar"
                  className="rounded-xl p-2 text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label htmlFor="pago-amount" className="form-label">Importe (€) *</label>
                  <input
                    id="pago-amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="Ej: 18.00"
                    className="input py-3"
                  />
                </div>

                <div>
                  <label htmlFor="pago-method" className="form-label">Método de pago *</label>
                  <select
                    id="pago-method"
                    name="method"
                    required
                    className="input py-3"
                  >
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                    <option value="bizum">Bizum</option>
                    <option value="transfer">Transferencia</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="pago-client" className="form-label">Cliente (opcional)</label>
                  <select
                    id="pago-client"
                    name="client_id"
                    className="input py-3"
                  >
                    <option value="">Sin vincular</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="pago-notes" className="form-label">Notas (opcional)</label>
                  <input
                    id="pago-notes"
                    name="notes"
                    placeholder="Ej: Corte + barba"
                    className="input py-3"
                  />
                </div>

                {formError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <PrimaryButton
                    type="button"
                    onClick={() => setShowModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancelar
                  </PrimaryButton>
                  <PrimaryButton
                    type="submit"
                    disabled={saving}
                    variant="primary"
                    className="flex-1"
                  >
                    {saving ? "Guardando..." : "Registrar"}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
