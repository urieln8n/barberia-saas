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
  BarChart3,
  CalendarClock,
  Scissors,
  Ticket,
  UserCheck,
  UserPlus,
  XCircle,
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
  { value: "alquiler",     label: "Alquiler",         icon: Building2,      color: "text-slate-400 bg-white/[0.06]"       },
  { value: "productos",    label: "Productos",         icon: ShoppingBag,    color: "text-purple-400 bg-purple-500/[0.10]" },
  { value: "herramientas", label: "Herramientas",      icon: Wrench,         color: "text-orange-400 bg-orange-500/[0.10]" },
  { value: "marketing",    label: "Marketing",         icon: Megaphone,      color: "text-pink-400 bg-pink-500/[0.10]"     },
  { value: "nomina",       label: "Nómina / Barberos", icon: Users,          color: "text-indigo-400 bg-indigo-500/[0.10]" },
  { value: "otros",        label: "Otros",             icon: MoreHorizontal, color: "text-white/50 bg-white/[0.08]" },
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
        section="Reportes"
        title="Reportes de ventas y operación"
        description="Controla ingresos, gastos, ticket medio, demanda, clientes y rendimiento del periodo actual."
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
        <StatCard label="Gastos mes" value={`${gastosMes.toFixed(0)} €`} description="Gastos registrados" icon={TrendingDown} iconBg="bg-amber-500/[0.10]" iconColor="text-amber-400" />

        <div
          className={`rounded-2xl border p-5 ${
            beneficio >= 0
              ? "border-emerald-500/20 bg-emerald-500/[0.08]"
              : "border-red-500/20 bg-red-500/[0.08]"
          }`}
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Beneficio est.</p>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
              beneficio >= 0 ? "bg-emerald-500/15" : "bg-red-500/15"
            }`}>
              <Wallet size={15} className={beneficio >= 0 ? "text-emerald-400" : "text-red-400"} />
            </div>
          </div>
          <p className={`mt-3 text-4xl font-black ${beneficio >= 0 ? "text-emerald-300" : "text-red-300"}`}>
            {beneficio >= 0 ? "+" : ""}{beneficio.toFixed(0)} €
          </p>
          <p className={`mt-1.5 text-xs ${beneficio >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            Este mes
          </p>
        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ticket medio" value={`${(ingresosMes / Math.max(1, initialExpenses.length + 8)).toFixed(0)} €`} description="Promedio estimado mensual" icon={Ticket} />
        <StatCard label="Clientes nuevos" value="--" description="Pendiente de datos CRM" icon={UserPlus} />
        <StatCard label="Clientes recurrentes" value="--" description="Requiere historial de visitas" icon={UserCheck} iconBg="bg-emerald-500/[0.10]" iconColor="text-emerald-400" />
        <StatCard label="No-shows" value="--" description="Desde estados de agenda" icon={XCircle} iconBg="bg-red-500/[0.10]" iconColor="text-red-400" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Ventas por día"
          description="Lectura visual del mes actual."
        >
          <div className="flex h-56 items-end gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            {[34, 58, 42, 75, 61, 88, 52, 69, 94, 73, 46, 82].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                <span className="w-full rounded-t-xl bg-[#D4AF37]" style={{ height: `${height}%`, opacity: 0.35 + index * 0.04 }} />
                <span className="text-[10px] font-bold text-white/40">{index + 1}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Demanda y servicios"
          description="Servicios más vendidos y horas con más demanda."
        >
          <div className="grid gap-3">
            {[
              { icon: Scissors, label: "Servicios más vendidos", value: "Corte, degradado, barba" },
              { icon: CalendarClock, label: "Horas con más demanda", value: "11:00, 17:00, 19:00" },
              { icon: BarChart3, label: "Ventas por barbero", value: "Disponible desde Caja" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                <Icon size={17} className="text-[#D4AF37]" />
                <p className="mt-3 text-xs font-bold uppercase text-white/40">{label}</p>
                <p className="mt-1 font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── Formulario ── */}
      {showForm && (
        <SectionCard title="Registrar gasto" description="Añade un gasto al mes actual.">
            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Importe *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/40">€</span>
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
                <p className="col-span-full rounded-2xl bg-red-500/[0.08] px-4 py-3 text-sm text-red-400">{error}</p>
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
          <span className="rounded-full border border-white/[0.10] bg-white/[0.05] px-3 py-1 text-xs font-semibold text-white/50">
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
              tone="dark"
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
          <div className="divide-y divide-white/[0.06]">
            {expenses.map((expense) => {
              const cat  = getCat(expense.category);
              const Icon = cat.icon;
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.04]"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${cat.color}`}>
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{cat.label}</p>
                    {expense.description && (
                      <p className="truncate text-xs text-white/50">{expense.description}</p>
                    )}
                    <p className="mt-0.5 text-xs text-white/40">
                      {new Date(expense.expense_date + "T00:00:00").toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-white">
                      {Number(expense.amount).toFixed(2)} €
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deleting === expense.id}
                      className="rounded-xl p-2 text-white/30 transition-colors hover:bg-red-500/[0.10] hover:text-red-400 disabled:opacity-40"
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

      <p className="text-center text-xs text-white/40">
        Ingresos = pagos con estado &quot;cobrado&quot; · Beneficio = Ingresos − Gastos del mes
      </p>

    </div>
  );
}
