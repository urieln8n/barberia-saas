"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Trash2,
  X,
  Building2,
  ShoppingBag,
  Wrench,
  Megaphone,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { createExpense, deleteExpense } from "./actions";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  expense_date: string;
};

const CATEGORIES = [
  { value: "alquiler",     label: "Alquiler",         icon: Building2,      color: "text-blue-600 bg-blue-50"     },
  { value: "productos",    label: "Productos",         icon: ShoppingBag,    color: "text-purple-600 bg-purple-50" },
  { value: "herramientas", label: "Herramientas",      icon: Wrench,         color: "text-orange-600 bg-orange-50" },
  { value: "marketing",    label: "Marketing",         icon: Megaphone,      color: "text-pink-600 bg-pink-50"     },
  { value: "nomina",       label: "Nómina / Barberos", icon: Users,          color: "text-indigo-600 bg-indigo-50" },
  { value: "otros",        label: "Otros",             icon: MoreHorizontal, color: "text-neutral-600 bg-neutral-100" },
] as const;

function getCat(value: string) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[5];
}

type Props = {
  ingresosHoy: number;
  ingresosMes: number;
  gastosMes:   number;
  expenses:    Expense[];
  today:       string;
};

export function FinanzasClient({
  ingresosHoy,
  ingresosMes,
  gastosMes,
  expenses: initialExpenses,
  today,
}: Props) {
  const router = useRouter();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const beneficio = ingresosMes - gastosMes;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createExpense(formData);

    setSaving(false);
    if (result?.error) { setError(result.error); return; }

    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este gasto?")) return;
    setDeleting(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    await deleteExpense(id);
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">

      <PageHeader
        section="Finanzas / Caja"
        title="Resumen del mes"
        description="Controla ingresos, gastos y beneficio estimado del periodo actual."
        action={
          <PrimaryButton
            type="button"
            onClick={() => { setShowForm(!showForm); setError(null); }}
            variant={showForm ? "secondary" : "primary"}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancelar" : "Registrar gasto"}
          </PrimaryButton>
        }
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Ingresos hoy" value={`${ingresosHoy.toFixed(0)} €`} description="Pagos cobrados" icon={TrendingUp} />
        <StatCard label="Ingresos mes" value={`${ingresosMes.toFixed(0)} €`} description="Pagos registrados" icon={TrendingUp} />
        <StatCard label="Gastos mes" value={`${gastosMes.toFixed(0)} €`} description="Gastos registrados" icon={TrendingDown} iconBg="bg-amber-50" iconColor="text-amber-600" />

        <div className={`rounded-2xl border p-5 shadow-sm ${
          beneficio >= 0
            ? "border-emerald-100 bg-emerald-50"
            : "border-red-100 bg-red-50"
        }`}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Beneficio est.</p>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
              beneficio >= 0 ? "bg-emerald-100" : "bg-red-100"
            }`}>
              <Wallet size={15} className={beneficio >= 0 ? "text-emerald-600" : "text-red-600"} />
            </div>
          </div>
          <p className={`mt-3 text-4xl font-black ${beneficio >= 0 ? "text-emerald-700" : "text-red-700"}`}>
            {beneficio >= 0 ? "+" : ""}{beneficio.toFixed(0)} €
          </p>
          <p className={`mt-1.5 text-xs ${beneficio >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            Este mes
          </p>
        </div>

      </div>

      {/* ── Formulario ── */}
      {showForm && (
        <SectionCard title="Registrar gasto" description="Añade un gasto al mes actual.">
            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Importe *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">€</span>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    className="input py-3 pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Categoría *</label>
                <select
                  name="category"
                  required
                  defaultValue=""
                  className="input py-3"
                >
                  <option value="" disabled>Selecciona categoría</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Descripción</label>
                <input
                  name="description"
                  type="text"
                  placeholder="Ej: Alquiler junio"
                  className="input py-3"
                />
              </div>

              <div>
                <label className="form-label">Fecha *</label>
                <input
                  name="expense_date"
                  type="date"
                  required
                  defaultValue={today}
                  className="input py-3"
                />
              </div>

              {error && (
                <p className="col-span-full rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              )}

              <div className="col-span-full flex gap-3">
                <PrimaryButton
                  type="submit"
                  disabled={saving}
                  variant="primary"
                  className="flex-1"
                >
                  {saving ? "Guardando..." : "Guardar gasto"}
                </PrimaryButton>
                <PrimaryButton
                  type="button"
                  onClick={() => { setShowForm(false); setError(null); }}
                  variant="secondary"
                >
                  Cancelar
                </PrimaryButton>
              </div>
            </form>
        </SectionCard>
      )}

      {/* ── Lista de gastos ── */}
      <SectionCard
        title="Gastos registrados"
        description="Gastos del mes actual."
        action={
          <span className="rounded-full border border-neutral-200 bg-[#F8FAFC] px-3 py-1 text-xs font-semibold text-neutral-500">
            {expenses.length} registros
          </span>
        }
        bodyClassName="p-0"
      >

        {expenses.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={TrendingDown}
              title="Sin gastos registrados"
              description="Registra tus gastos para ver el beneficio real del mes."
              action={
                <PrimaryButton
                  type="button"
                  onClick={() => setShowForm(true)}
                  variant="primary"
                >
                  <Plus size={15} /> Registrar primer gasto
                </PrimaryButton>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {expenses.map((expense) => {
              const cat  = getCat(expense.category);
              const Icon = cat.icon;
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F8FAFC]/50"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${cat.color}`}>
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#111827]">{cat.label}</p>
                    {expense.description && (
                      <p className="truncate text-xs text-neutral-500">{expense.description}</p>
                    )}
                    <p className="mt-0.5 text-xs text-neutral-400">
                      {new Date(expense.expense_date + "T00:00:00").toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-[#111827]">
                      {Number(expense.amount).toFixed(2)} €
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deleting === expense.id}
                      className="rounded-xl p-2 text-neutral-300 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <p className="text-center text-xs text-neutral-400">
        Ingresos = pagos con estado "cobrado" · Beneficio = Ingresos − Gastos del mes
      </p>

    </div>
  );
}
