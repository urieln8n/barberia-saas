"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Phone, ToggleLeft, ToggleRight, User, BadgeEuro, CalendarClock, Scissors, TrendingUp } from "lucide-react";
import { createBarber, updateBarber, deleteBarber, toggleBarber } from "./actions";
import type { PlanUsage } from "@/src/lib/plans/limits";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

type Barber = {
  id: string;
  name: string;
  phone: string | null;
  active: boolean;
};

type Props = {
  barbers: Barber[];
  barbershopId: string;
  planUsage: PlanUsage;
};

function formatLimit(limit: number | null) {
  return limit === null ? "Ilimitado" : String(limit);
}

export function BarberosClient({ barbers, barbershopId, planUsage }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Barber | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [toggling,  setToggling]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState("");

  const barberLimit = planUsage.limits.maxBarbers;
  const isAtBarberLimit = barberLimit !== null && barbers.length >= barberLimit;

  function openCreate() {
    setEditing(null);
    setFormError("");
    setShowModal(true);
  }
  function openEdit(b: Barber) {
    setEditing(b);
    setFormError("");
    setShowModal(true);
  }
  function closeModal() { setShowModal(false); setEditing(null); setFormError(""); }

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
      const result = await updateBarber(formData);
      if (result?.error) {
        setFormError(result.error);
        setSaving(false);
        return;
      }
    } else {
      const result = await createBarber(formData);
      if (result?.error) {
        setFormError(result.error);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    closeModal();
  }

  return (
    <div className="space-y-5">

      <PageHeader
        section="Barberos"
        title="Tu equipo"
        description="Añade tu equipo, asigna citas y controla la agenda de cada barbero desde una vista simple."
        action={
          <PrimaryButton
            type="button"
            onClick={openCreate}
            disabled={isAtBarberLimit}
            variant="primary"
          >
            <Plus size={16} /> Añadir barbero
          </PrimaryButton>
        }
      />

      <div className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] px-4 py-3 text-sm text-neutral-600">
        Plan <span className="font-black text-[#111827]">{planUsage.label}</span> · Barberos usados{" "}
        <span className="font-black text-[#111827]">{barbers.length}</span> / {formatLimit(barberLimit)}
        {isAtBarberLimit && (
          <span className="ml-2 font-semibold text-amber-700">
            Límite alcanzado. Sube de plan para añadir más equipo.
          </span>
        )}
      </div>

      {barbers.length === 0 ? (
        <EmptyState
          icon={User}
          title="Sin barberos todavía"
          description="Añade tu primer barbero para poder organizar reservas por profesional. Ejemplo: Carlos atiende cortes, Miguel barba y Andrés degradados."
          action={
            <PrimaryButton
              type="button"
              onClick={openCreate}
              disabled={isAtBarberLimit}
              variant="primary"
            >
              <Plus size={16} /> Añadir primer barbero
            </PrimaryButton>
          }
        />
      ) : (
        <SectionCard
          title="Equipo"
          description={`${barbers.length} barberos configurados.`}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((b) => (
              <article
                key={b.id}
                className={`rounded-[18px] border bg-white p-5 shadow-sm transition-opacity ${
                  !b.active ? "border-neutral-200 opacity-60" : "border-[#E7E2D8]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#111111] text-xl font-black uppercase text-[#D9B766]">
                    {b.name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(b)}
                      className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#FAF8F4] hover:text-[#111827]"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(b.id)}
                      disabled={deleting === b.id}
                      className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black text-[#111827]">{b.name}</p>
                    {b.phone && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
                        <Phone size={13} /> {b.phone}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={b.active ? "active" : "inactive"} />
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(b.id, b.active)}
                  disabled={toggling === b.id}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-[#111827] disabled:opacity-40"
                >
                  {b.active
                    ? <><ToggleRight size={18} className="text-green-600" /> Activo</>
                    : <><ToggleLeft size={18} /> Inactivo</>
                  }
                </button>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    { label: "Servicios", value: b.active ? "8" : "0", icon: Scissors },
                    { label: "Ventas", value: b.active ? "240 EUR" : "0 EUR", icon: BadgeEuro },
                    { label: "Comisión", value: b.active ? "60 EUR" : "0 EUR", icon: TrendingUp },
                    { label: "Horas libres", value: b.active ? "3 h" : "-", icon: CalendarClock },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] p-3">
                      <Icon size={14} className="text-[#2563EB]" />
                      <p className="mt-2 text-[10px] font-bold uppercase text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-black text-[#080A0F]">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-[#2563EB]/10 bg-[#2563EB]/5 p-3">
                  <p className="text-xs font-black uppercase text-[#2563EB]">Rendimiento semanal</p>
                  <div className="mt-3 flex items-end gap-1.5">
                    {[42, 64, 38, 78, 58, 88, 72].map((height, index) => (
                      <span
                        key={index}
                        className="w-full rounded-t-lg bg-[#2563EB]"
                        style={{ height: `${height}px`, opacity: 0.35 + index * 0.08 }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    Próximas reservas: {b.active ? "4 citas pendientes" : "sin actividad"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E7E2D8] bg-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-section">Barberos</p>
                  <h2 className="section-heading mt-0.5">
                    {editing ? "Editar barbero" : "Nuevo barbero"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
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
                    placeholder="Ej: Miguel"
                    className="input-field py-3"
                  />
                </div>

                <div>
                  <label className="form-label">Teléfono (opcional)</label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={editing?.phone ?? ""}
                    placeholder="+34 600 000 000"
                    className="input-field py-3"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <PrimaryButton
                    type="button"
                    onClick={closeModal}
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
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Añadir barbero"}
                  </PrimaryButton>
                </div>
                {formError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
