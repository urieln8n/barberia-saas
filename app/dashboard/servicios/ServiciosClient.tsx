"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Clock, Scissors, BadgeEuro, TrendingUp, Users } from "lucide-react";
import { createService, updateService, deleteService } from "./actions";
import type { PlanUsage } from "@/src/lib/plans/limits";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  active: boolean;
};

type Props = {
  services: Service[];
  barbershopId: string;
  planUsage: PlanUsage;
};

function formatLimit(limit: number | null) {
  return limit === null ? "Ilimitado" : String(limit);
}

export function ServiciosClient({ services, barbershopId, planUsage }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Service | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState("");

  const serviceLimit = planUsage.limits.maxServices;
  const isAtServiceLimit = serviceLimit !== null && services.length >= serviceLimit;
  const activeServices = services.filter((service) => service.active).length;
  const topService = services[0];
  const bestMarginService = [...services].sort((a, b) => Number(b.price) - Number(a.price))[0];

  function openCreate() { setEditing(null); setFormError(""); setShowModal(true); }
  function openEdit(s: Service) { setEditing(s); setFormError(""); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); setFormError(""); }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return;
    setDeleting(id);
    await deleteService(id);
    setDeleting(null);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.append("barbershop_id", barbershopId);
    if (editing) {
      formData.append("id", editing.id);
      const result = await updateService(formData);
      if (result?.error) {
        setFormError(result.error);
        setSaving(false);
        return;
      }
    } else {
      const result = await createService(formData);
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
        section="Servicios"
        title="Gestión de servicios"
        description="Configura cortes, barba, combos, precios y duración para que tus clientes puedan reservar online sin escribirte por WhatsApp."
        action={
          <PrimaryButton
            type="button"
            onClick={openCreate}
            disabled={isAtServiceLimit}
            variant="primary"
          >
            <Plus size={16} /> Añadir servicio
          </PrimaryButton>
        }
      />

      <div className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] px-4 py-3 text-sm text-neutral-600">
        Plan <span className="font-black text-[#111827]">{planUsage.label}</span> · Servicios usados{" "}
        <span className="font-black text-[#111827]">{services.length}</span> / {formatLimit(serviceLimit)}
        {isAtServiceLimit && (
          <span className="ml-2 font-semibold text-amber-700">
            Límite alcanzado. Sube de plan para añadir más servicios.
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Servicios activos" value={activeServices} description="Disponibles para reservar" icon={Scissors} />
        <StatCard label="Más vendido" value={topService?.name ?? "--"} description="Basado en el catálogo actual" icon={TrendingUp} />
        <StatCard label="Mejor margen" value={bestMarginService?.name ?? "--"} description={bestMarginService ? `${bestMarginService.price} EUR` : "Sin servicios"} icon={BadgeEuro} iconBg="bg-emerald-50" iconColor="text-emerald-700" />
        <StatCard label="Barberos asignados" value="Todos" description="Asignación global actual" icon={Users} iconBg="bg-[#D5A84C]/10" iconColor="text-[#8A641F]" />
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title="Crea tu catálogo de servicios"
          description="Sin servicios no hay reservas online. Añade tus cortes, barba y combos con precio y duración — BarberíaOS organiza los turnos y los agentes IA usan estos datos para generar campañas automáticas."
          action={
            <PrimaryButton
              type="button"
              onClick={openCreate}
              disabled={isAtServiceLimit}
              variant="primary"
            >
              <Plus size={16} /> Crear primer servicio
            </PrimaryButton>
          }
        />
      ) : (
        <SectionCard
          title="Catálogo de servicios"
          description={`${services.length} servicios configurados.`}
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#E7E2D8] bg-[#F8F5EF]">
                <tr>
                  <th className="table-header-cell">Servicio</th>
                  <th className="table-header-cell">Duración</th>
                  <th className="table-header-cell">Precio</th>
                  <th className="table-header-cell">Barberos</th>
                  <th className="table-header-cell">Estado</th>
                  <th className="table-header-cell text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8]">
                {services.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-[#FAF8F4]">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#111827]">{s.name}</p>
                      {s.description && <p className="mt-0.5 text-xs text-neutral-400">{s.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Clock size={13} className="text-neutral-400" /> {s.duration_minutes} min
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-[#111827]">{s.price} €</td>
                    <td className="px-6 py-4 text-neutral-600">Todos los activos</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={s.active ? "active" : "inactive"} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(s)}
                          aria-label={`Editar ${s.name}`}
                          className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#FAF8F4] hover:text-[#111827]"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          disabled={deleting === s.id}
                          aria-label={`Eliminar ${s.name}`}
                          className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
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
          <div className="w-full max-w-md rounded-2xl border border-[#E7E2D8] bg-[#FAF8F4] shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-section">Servicios</p>
                  <h2 className="section-heading mt-0.5">
                    {editing ? "Editar servicio" : "Nuevo servicio"}
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
                  <label htmlFor="svc-name" className="form-label">Nombre *</label>
                  <input
                    id="svc-name"
                    name="name"
                    required
                    defaultValue={editing?.name ?? ""}
                    placeholder="Ej: Corte clásico"
                    className="input-field py-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="svc-price" className="form-label">Precio (€) *</label>
                    <input
                      id="svc-price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.5"
                      required
                      defaultValue={editing?.price ?? ""}
                      placeholder="15"
                      className="input-field py-3"
                    />
                  </div>
                  <div>
                    <label htmlFor="svc-duration" className="form-label">Duración (min) *</label>
                    <input
                      id="svc-duration"
                      name="duration_minutes"
                      type="number"
                      min="5"
                      step="5"
                      required
                      defaultValue={editing?.duration_minutes ?? ""}
                      placeholder="30"
                      className="input-field py-3"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="svc-description" className="form-label">Descripción (opcional)</label>
                  <input
                    id="svc-description"
                    name="description"
                    defaultValue={editing?.description ?? ""}
                    placeholder="Ej: Incluye lavado y secado"
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
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear servicio"}
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
