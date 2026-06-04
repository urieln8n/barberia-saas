"use client";

import { useState } from "react";
import { Camera, Loader2, Plus, Pencil, Trash2, X, Phone, ToggleLeft, ToggleRight, User, BadgeEuro, CalendarClock, Scissors, TrendingUp, Save, CalendarX } from "lucide-react";
import { createBarber, updateBarber, deleteBarber, toggleBarber, updateBarberSchedules, createClosure, deleteClosure, uploadBarberPhoto } from "./actions";
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
  photo_url?: string | null;
};

type BarberSchedule = {
  id: string;
  barber_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  active: boolean;
};

type BarbershopClosure = {
  id: string;
  closure_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
};

type Props = {
  barbers: Barber[];
  schedules: BarberSchedule[];
  closures: BarbershopClosure[];
  barbershopId: string;
  planUsage: PlanUsage;
};

const WEEKDAYS = [
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

function formatLimit(limit: number | null) {
  return limit === null ? "Ilimitado" : String(limit);
}

export function BarberosClient({ barbers, schedules, closures, barbershopId, planUsage }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [editing,   setEditing]   = useState<Barber | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [toggling,  setToggling]  = useState<string | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [savingSchedule, setSavingSchedule] = useState<string | null>(null);
  const [closureSaving, setClosureSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [closureError, setClosureError] = useState("");

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

  function schedulesForBarber(barberId: string) {
    return schedules.filter((schedule) => schedule.barber_id === barberId);
  }

  function scheduleForDay(barberId: string, weekday: number) {
    return schedulesForBarber(barberId).find(
      (schedule) => schedule.weekday === weekday && schedule.active
    );
  }

  async function handleScheduleSubmit(formData: FormData) {
    const barberId = String(formData.get("barber_id") ?? "");
    setSavingSchedule(barberId);
    setScheduleError("");

    const result = await updateBarberSchedules(formData);
    if (result?.error) {
      setScheduleError(result.error);
    }

    setSavingSchedule(null);
  }

  async function handleClosureSubmit(formData: FormData) {
    setClosureSaving(true);
    setClosureError("");

    const result = await createClosure(formData);
    if (result?.error) {
      setClosureError(result.error);
    }

    setClosureSaving(false);
  }

  async function handleDeleteClosure(id: string) {
    setClosureError("");
    const result = await deleteClosure(id);
    if (result?.error) {
      setClosureError(result.error);
    }
  }

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

  async function handlePhotoUpload(barberId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(barberId);
    setPhotoError(null);
    const result = await uploadBarberPhoto(barberId, file);
    if (result.error) setPhotoError(result.error);
    setUploadingPhoto(null);
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

      <SectionCard
        title="Cierres y festivos"
        description="Bloquea días completos o franjas concretas para que no entren reservas públicas."
      >
        <form action={handleClosureSubmit} className="grid gap-3 md:grid-cols-[1fr_140px_140px_1fr_auto] md:items-end">
          <div>
            <label className="form-label">Fecha</label>
            <input name="closure_date" type="date" required className="input-field py-3" />
          </div>
          <div>
            <label className="form-label">Desde</label>
            <input name="start_time" type="time" defaultValue="09:00" className="input-field py-3" />
          </div>
          <div>
            <label className="form-label">Hasta</label>
            <input name="end_time" type="time" defaultValue="20:00" className="input-field py-3" />
          </div>
          <div>
            <label className="form-label">Motivo</label>
            <input name="reason" placeholder="Festivo, vacaciones..." className="input-field py-3" />
          </div>
          <div className="grid gap-2">
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[#E7E2D8] px-3 text-sm font-semibold text-neutral-600">
              <input name="full_day" type="checkbox" defaultChecked className="accent-[#2563EB]" />
              Día completo
            </label>
            <PrimaryButton type="submit" disabled={closureSaving} variant="primary">
              <CalendarX size={16} /> {closureSaving ? "Guardando" : "Bloquear"}
            </PrimaryButton>
          </div>
        </form>

        {closureError && (
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {closureError}
          </p>
        )}

        <div className="mt-4 grid gap-2">
          {closures.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[#E7E2D8] bg-[#F8F5EF] px-4 py-3 text-sm text-neutral-500">
              No hay cierres próximos configurados.
            </p>
          ) : (
            closures.map((closure) => (
              <div
                key={closure.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E2D8] bg-[#FAF8F4] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-black text-[#111827]">
                    {new Date(`${closure.closure_date}T00:00:00`).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      weekday: "short",
                    })}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {!closure.start_time || !closure.end_time
                      ? "Día completo"
                      : `${closure.start_time.slice(0, 5)}-${closure.end_time.slice(0, 5)}`}
                    {closure.reason ? ` · ${closure.reason}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteClosure(closure.id)}
                  className="rounded-xl p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Eliminar cierre"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      {barbers.length === 0 ? (
        <EmptyState
          icon={User}
          title="Añade tu equipo"
          description="Cada barbero tiene su agenda y sus reservas propias. Sin barberos configurados, los agentes IA no pueden detectar huecos ni optimizar tu ocupación diaria."
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
          {photoError && (
          <p className="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{photoError}</p>
        )}
        <p className="mb-3 text-xs text-neutral-400">Haz clic en la foto del barbero para cambiarla · JPG, PNG o WebP · máx. 2 MB</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {barbers.map((b) => (
              <article
                key={b.id}
                className={`rounded-[18px] border p-5 shadow-sm transition-opacity ${
                  !b.active ? "border-neutral-200 bg-[#FDFBF7] opacity-60" : "border-[#E7E2D8] bg-[#FAF8F4]"
                }`}
              >
                <div className="flex items-start justify-between">
                  {/* Avatar con foto o inicial + botón de upload */}
                  <label
                    htmlFor={`photo-barber-${b.id}`}
                    className="group relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/12"
                    title="Subir foto del barbero"
                  >
                    {b.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.photo_url} alt={b.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl font-black uppercase text-[#8A641F]">{b.name.charAt(0)}</span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition group-hover:opacity-100">
                      {uploadingPhoto === b.id
                        ? <Loader2 size={18} className="animate-spin text-white" />
                        : <Camera size={18} className="text-white" />}
                    </span>
                    <input
                      id={`photo-barber-${b.id}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => handlePhotoUpload(b.id, e)}
                    />
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(b)}
                      aria-label={`Editar ${b.name}`}
                      className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-[#FAF8F4] hover:text-[#111827]"
                    >
                      <Pencil size={15} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(b.id)}
                      disabled={deleting === b.id}
                      aria-label={`Eliminar ${b.name}`}
                      className="rounded-xl p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-[#E5484D] disabled:opacity-40"
                    >
                      <Trash2 size={15} aria-hidden="true" />
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

                <form action={handleScheduleSubmit} className="mt-5 rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-3">
                  <input type="hidden" name="barber_id" value={b.id} />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase text-[#2563EB]">Horario semanal</p>
                      <p className="mt-1 text-xs text-neutral-500">
                        Activa los días que trabaja este barbero.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={savingSchedule === b.id}
                      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 text-xs font-black text-white transition hover:bg-slate-700 disabled:opacity-40"
                    >
                      <Save size={14} />
                      {savingSchedule === b.id ? "Guardando" : "Guardar"}
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {WEEKDAYS.map((day) => {
                      const schedule = scheduleForDay(b.id, day.value);
                      return (
                        <div
                          key={day.value}
                          className="grid grid-cols-[52px_1fr_1fr] items-center gap-2 rounded-xl bg-[#F8F5EF] p-2 text-sm"
                        >
                          <label className="flex items-center gap-2 font-bold text-neutral-700">
                            <input
                              name={`open_${day.value}`}
                              type="checkbox"
                              defaultChecked={Boolean(schedule)}
                              className="accent-[#2563EB]"
                            />
                            {day.label}
                          </label>
                          <input
                            name={`start_${day.value}`}
                            type="time"
                            defaultValue={schedule?.start_time.slice(0, 5) ?? "10:00"}
                            className="min-h-10 rounded-lg border border-[#E7E2D8] px-2 text-sm font-semibold"
                          />
                          <input
                            name={`end_${day.value}`}
                            type="time"
                            defaultValue={schedule?.end_time.slice(0, 5) ?? "20:00"}
                            className="min-h-10 rounded-lg border border-[#E7E2D8] px-2 text-sm font-semibold"
                          />
                        </div>
                      );
                    })}
                  </div>
                </form>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[
                    { label: "Servicios", value: b.active ? "8" : "0", icon: Scissors },
                    { label: "Ventas", value: b.active ? "240 EUR" : "0 EUR", icon: BadgeEuro },
                    { label: "Comisión", value: b.active ? "60 EUR" : "0 EUR", icon: TrendingUp },
                    { label: "Horas libres", value: b.active ? "3 h" : "-", icon: CalendarClock },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] p-3">
                      <Icon size={14} className="text-[#2563EB]" />
                      <p className="mt-2 text-[10px] font-bold uppercase text-slate-500">{label}</p>
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
          {scheduleError && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {scheduleError}
            </p>
          )}
        </SectionCard>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E7E2D8] bg-[#FAF8F4] shadow-2xl">
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
                  aria-label="Cerrar"
                  className="rounded-xl p-2 transition-colors hover:bg-[#FAF8F4]"
                >
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div>
                  <label htmlFor="barber-name" className="form-label">Nombre *</label>
                  <input
                    id="barber-name"
                    name="name"
                    required
                    defaultValue={editing?.name ?? ""}
                    placeholder="Ej: Miguel"
                    className="input-field py-3"
                  />
                </div>

                <div>
                  <label htmlFor="barber-phone" className="form-label">Teléfono (opcional)</label>
                  <input
                    id="barber-phone"
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
