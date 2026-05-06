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
import { EmptyState } from "@/components/dashboard/empty-state";

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

      {/* ── Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Finanzas / Caja</p>
          <h1 className="mt-1.5 text-3xl font-black tracking-tight text-[#0D0D0D] md:text-4xl">
            Resumen del mes
          </h1>
        </div>
        <button
          type="button"
          onClick={() => { setShowForm(!showForm); setError(null); }}
          className="flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancelar" : "Registrar gasto"}
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Ingresos hoy</p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#00C2A8]/10">
              <TrendingUp size={15} className="text-[#00C2A8]" />
            </div>
          </div>
          <p className="mt-3 text-4xl font-black text-[#0D0D0D]">{ingresosHoy.toFixed(0)} €</p>
          <p className="mt-1.5 text-xs text-neutral-400">Pagos cobrados</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Ingresos mes</p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C89B3C]/10">
              <TrendingUp size={15} className="text-[#C89B3C]" />
            </div>
          </div>
          <p className="mt-3 text-4xl font-black text-[#0D0D0D]">{ingresosMes.toFixed(0)} €</p>
          <p className="mt-1.5 text-xs text-neutral-400">Pagos registrados</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Gastos mes</p>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <TrendingDown size={15} className="text-amber-600" />
            </div>
          </div>
          <p className="mt-3 text-4xl font-black text-[#0D0D0D]">{gastosMes.toFixed(0)} €</p>
          <p className="mt-1.5 text-xs text-neutral-400">Gastos registrados</p>
        </div>

        <div className={`rounded-3xl border p-5 shadow-sm ${
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
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="h-px w-full bg-gradient-to-r from-[#C89B3C]/60 via-[#00C2A8] to-[#C89B3C]/60" />
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Nuevo gasto</p>
            <h2 className="mt-1 text-lg font-black text-[#0D0D0D]">Registrar gasto</h2>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Importe *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">€</span>
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-8 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Categoría *</label>
                <select
                  name="category"
                  required
                  defaultValue=""
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                >
                  <option value="" disabled>Selecciona categoría</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Descripción</label>
                <input
                  name="description"
                  type="text"
                  placeholder="Ej: Alquiler junio"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-700">Fecha *</label>
                <input
                  name="expense_date"
                  type="date"
                  required
                  defaultValue={today}
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              {error && (
                <p className="col-span-full rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              )}

              <div className="col-span-full flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0D0D0D] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A] disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar gasto"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(null); }}
                  className="rounded-2xl border border-[#E5E2D9] px-5 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:bg-[#F5F2EA]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Lista de gastos ── */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E2D9] px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Este mes</p>
            <h2 className="mt-0.5 font-black text-[#0D0D0D]">Gastos registrados</h2>
          </div>
          <span className="rounded-full border border-neutral-200 bg-[#F5F2EA] px-3 py-1 text-xs font-semibold text-neutral-500">
            {expenses.length} registros
          </span>
        </div>

        {expenses.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={TrendingDown}
              title="Sin gastos registrados"
              description="Registra tus gastos para ver el beneficio real del mes."
              action={
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
                >
                  <Plus size={15} /> Registrar primer gasto
                </button>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E5E2D9]">
            {expenses.map((expense) => {
              const cat  = getCat(expense.category);
              const Icon = cat.icon;
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F5F2EA]/50"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${cat.color}`}>
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#0D0D0D]">{cat.label}</p>
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
                    <span className="text-base font-black text-[#0D0D0D]">
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
      </div>

      <p className="text-center text-xs text-neutral-400">
        Ingresos = pagos con estado "cobrado" · Beneficio = Ingresos − Gastos del mes
      </p>

    </div>
  );
}
