"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera, CalendarDays, ChevronDown, ChevronUp,
  Loader2, Plus, Pencil, Trash2, X, Phone,
  ToggleLeft, ToggleRight, Users, Wallet,
  CalendarX, Save, TrendingUp, Instagram, Sparkles,
} from "lucide-react";
import {
  createBarber, updateBarber, deleteBarber, toggleBarber,
  updateBarberSchedules, createClosure, deleteClosure, uploadBarberPhoto,
} from "./actions";
import type { PlanUsage } from "@/src/lib/plans/limits";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

// ─── Types ───────────────────────────────────────────────────────────────────

type Barber = {
  id: string;
  name: string;
  phone: string | null;
  active: boolean;
  photo_url?: string | null;
  specialty?: string | null;
  bio?: string | null;
  instagram_url?: string | null;
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
  todayCountByBarber: Record<string, number>;
  weekCountByBarber: Record<string, number>;
  weekRevenueByBarber: Record<string, number>;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WEEKDAYS = [
  { value: 1, label: "Lun" }, { value: 2, label: "Mar" },
  { value: 3, label: "Mié" }, { value: 4, label: "Jue" },
  { value: 5, label: "Vie" }, { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700", "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700", "bg-cyan-100 text-cyan-700",
];

function getAvatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function money(n: number) {
  return n > 0
    ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)
    : "—";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatChip({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <span className={`text-xl font-black tabular-nums ${accent ? "text-[#C9922A]" : "text-slate-900"}`}>{value}</span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BarberosClient({
  barbers, schedules, closures, barbershopId, planUsage,
  todayCountByBarber, weekCountByBarber, weekRevenueByBarber,
}: Props) {

  const [showModal,       setShowModal]       = useState(false);
  const [editing,         setEditing]         = useState<Barber | null>(null);
  const [deleting,        setDeleting]        = useState<string | null>(null);
  const [toggling,        setToggling]        = useState<string | null>(null);
  const [saving,          setSaving]          = useState(false);
  const [uploadingPhoto,  setUploadingPhoto]  = useState<string | null>(null);
  const [photoError,      setPhotoError]      = useState<string | null>(null);
  const [expandedBarber,  setExpandedBarber]  = useState<string | null>(null);
  const [savingSchedule,  setSavingSchedule]  = useState<string | null>(null);
  const [showClosures,    setShowClosures]    = useState(false);
  const [closureSaving,   setClosureSaving]   = useState(false);
  const [formError,       setFormError]       = useState("");
  const [scheduleError,   setScheduleError]   = useState("");
  const [closureError,    setClosureError]    = useState("");

  const router = useRouter();

  const barberLimit    = planUsage.limits.maxBarbers;
  const isAtBarberLimit = barberLimit !== null && barbers.length >= barberLimit;
  const activeBarbers  = barbers.filter((b) => b.active);
  const totalToday     = Object.values(todayCountByBarber).reduce((s, n) => s + n, 0);
  const totalWeek      = Object.values(weekCountByBarber).reduce((s, n) => s + n, 0);
  const totalRevenue   = Object.values(weekRevenueByBarber).reduce((s, n) => s + n, 0);

  function schedulesForBarber(bid: string) {
    return schedules.filter((s) => s.barber_id === bid);
  }
  function scheduleForDay(bid: string, weekday: number) {
    return schedulesForBarber(bid).find((s) => s.weekday === weekday && s.active);
  }

  function openCreate() { setEditing(null); setFormError(""); setShowModal(true); }
  function openEdit(b: Barber) { setEditing(b); setFormError(""); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditing(null); setFormError(""); }

  async function handleToggle(id: string, current: boolean) {
    setToggling(id);
    await toggleBarber(id, !current);
    setToggling(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este barbero? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    await deleteBarber(id);
    setDeleting(null);
  }

  async function handlePhotoUpload(barberId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset input para permitir re-selección del mismo archivo

    if (!file) {
      setPhotoError("No se seleccionó ningún archivo.");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Solo se aceptan imágenes JPG, PNG o WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("La imagen no puede superar 5 MB.");
      return;
    }

    setUploadingPhoto(barberId);
    setPhotoError(null);

    const fd = new FormData();
    fd.append("barber_id", barberId);
    fd.append("file", file);

    const result = await uploadBarberPhoto(fd);
    if (result.error) {
      setPhotoError(result.error);
    } else {
      router.refresh(); // revalida el Server Component y muestra la foto nueva
    }
    setUploadingPhoto(null);
  }

  async function handleScheduleSubmit(formData: FormData) {
    const bid = String(formData.get("barber_id") ?? "");
    setSavingSchedule(bid);
    setScheduleError("");
    const result = await updateBarberSchedules(formData);
    if (result?.error) setScheduleError(result.error);
    setSavingSchedule(null);
  }

  async function handleClosureSubmit(formData: FormData) {
    setClosureSaving(true);
    setClosureError("");
    const result = await createClosure(formData);
    if (result?.error) setClosureError(result.error);
    setClosureSaving(false);
  }

  async function handleDeleteClosure(id: string) {
    setClosureError("");
    const result = await deleteClosure(id);
    if (result?.error) setClosureError(result.error);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.append("barbershop_id", barbershopId);
    if (editing) {
      formData.append("id", editing.id);
      const r = await updateBarber(formData);
      if (r?.error) { setFormError(r.error); setSaving(false); return; }
    } else {
      const r = await createBarber(formData);
      if (r?.error) { setFormError(r.error); setSaving(false); return; }
    }
    setSaving(false);
    closeModal();
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <PageHeader
        section="Equipo"
        title="Gestión del equipo"
        description="Rendimiento, horarios y acciones rápidas por barbero."
        action={
          <PrimaryButton type="button" onClick={openCreate} disabled={isAtBarberLimit} variant="primary">
            <Plus size={16} /> Añadir barbero
          </PrimaryButton>
        }
        metrics={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatChip label="Barberos" value={barbers.length} />
            <StatChip label="Activos hoy" value={activeBarbers.length} />
            <StatChip label="Citas esta semana" value={totalWeek} />
            <StatChip label="Facturado (sem.)" value={money(totalRevenue)} accent />
          </div>
        }
      />

      {/* ── Aviso de límite de plan ── */}
      {isAtBarberLimit && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Límite de barberos alcanzado en el plan <strong>{planUsage.label}</strong>. Sube de plan para añadir más equipo.
        </p>
      )}

      {/* ── Error de foto ── */}
      {photoError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{photoError}</p>
      )}

      {/* ── Lista de barberos ── */}
      {barbers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Añade tu primer barbero"
          description="Sin barberos configurados no hay reservas online ni gestión de agenda. Añade el equipo y empieza a recibir citas."
          action={
            <PrimaryButton type="button" onClick={openCreate} variant="primary">
              <Plus size={16} /> Añadir primer barbero
            </PrimaryButton>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((b) => {
            const todayCount   = todayCountByBarber[b.id]   ?? 0;
            const weekCount    = weekCountByBarber[b.id]    ?? 0;
            const weekRevenue  = weekRevenueByBarber[b.id]  ?? 0;
            const isExpanded   = expandedBarber === b.id;
            const barberSched  = schedulesForBarber(b.id);
            const activeDays   = WEEKDAYS.filter((d) => scheduleForDay(b.id, d.value)).map((d) => d.label);

            return (
              <article
                key={b.id}
                className={`group relative rounded-[20px] border bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] ${
                  b.active ? "border-slate-200" : "border-slate-200 opacity-60"
                }`}
              >
                {/* Card body */}
                <div className="p-5">
                  {/* Top row: avatar + acciones */}
                  <div className="flex items-start justify-between">
                    {/* Avatar con upload */}
                    <label
                      htmlFor={`photo-${b.id}`}
                      className={`group/avatar relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-2xl text-xl font-black ${
                        b.photo_url ? "" : getAvatarColor(b.name)
                      } border border-black/5`}
                      title="Cambiar foto"
                    >
                      {b.photo_url
                        ? <Image src={b.photo_url} alt={b.name} fill sizes="56px" className="object-cover" />
                        : <span>{b.name.charAt(0).toUpperCase()}</span>
                      }
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover/avatar:opacity-100">
                        {uploadingPhoto === b.id
                          ? <Loader2 size={18} className="animate-spin text-white" />
                          : <Camera size={16} className="text-white" />}
                      </span>
                      <input id={`photo-${b.id}`} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => handlePhotoUpload(b.id, e)} />
                    </label>

                    {/* Acciones */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(b)}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggle(b.id, b.active)}
                        disabled={toggling === b.id}
                        className={`rounded-xl p-2 transition ${
                          b.active
                            ? "text-emerald-500 hover:bg-emerald-50"
                            : "text-slate-400 hover:bg-slate-100"
                        } disabled:opacity-40`}
                        title={b.active ? "Desactivar" : "Activar"}
                      >
                        {b.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id)}
                        disabled={deleting === b.id}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Nombre + estado */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black text-slate-900">{b.name}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
                        b.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {b.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    {b.specialty && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#C9922A]">
                        <Sparkles size={10} /> {b.specialty}
                      </p>
                    )}
                    {b.phone && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone size={11} /> {b.phone}
                      </p>
                    )}
                    {b.instagram_url && (
                      <a href={b.instagram_url} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-600 transition">
                        <Instagram size={11} /> Instagram
                      </a>
                    )}
                    {activeDays.length > 0 && (
                      <p className="mt-1 text-[11px] text-slate-400">
                        {activeDays.join(" · ")}
                      </p>
                    )}
                  </div>

                  {/* Stats reales */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center">
                      <p className="text-base font-black tabular-nums text-slate-900">{todayCount}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Hoy</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center">
                      <p className="text-base font-black tabular-nums text-slate-900">{weekCount}</p>
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Semana</p>
                    </div>
                    <div className="rounded-xl border border-[#D4AF37]/20 bg-[#FEF9EE] px-3 py-2.5 text-center">
                      <p className="text-base font-black tabular-nums text-[#C9922A]">
                        {weekRevenue > 0 ? `${weekRevenue}€` : "—"}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-wide text-[#C9922A]/60">€ sem.</p>
                    </div>
                  </div>

                  {/* Acciones rápidas */}
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/dashboard/agenda?barber=${b.id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-[11px] font-black text-slate-600 transition hover:border-[#D4AF37]/40 hover:bg-[#FEF9EE] hover:text-[#8A641F]"
                    >
                      <CalendarDays size={12} /> Agenda
                    </Link>
                    <Link
                      href={`/dashboard/clientes?barber=${b.id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-[11px] font-black text-slate-600 transition hover:border-[#D4AF37]/40 hover:bg-[#FEF9EE] hover:text-[#8A641F]"
                    >
                      <Users size={12} /> Clientes
                    </Link>
                    <Link
                      href="/dashboard/estadisticas"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-[11px] font-black text-slate-600 transition hover:border-[#D4AF37]/40 hover:bg-[#FEF9EE] hover:text-[#8A641F]"
                    >
                      <TrendingUp size={12} /> Stats
                    </Link>
                  </div>

                  {/* Expandir horario */}
                  <button
                    type="button"
                    onClick={() => setExpandedBarber(isExpanded ? null : b.id)}
                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] font-black text-slate-500 transition hover:bg-slate-100"
                  >
                    <span>Horario y disponibilidad</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {/* Formulario de horario (colapsable) */}
                  {isExpanded && (
                    <form action={handleScheduleSubmit} className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <input type="hidden" name="barber_id" value={b.id} />
                      <div className="space-y-2">
                        {WEEKDAYS.map((day) => {
                          const sched = scheduleForDay(b.id, day.value);
                          return (
                            <div key={day.value} className="grid grid-cols-[52px_1fr_1fr] items-center gap-2 rounded-xl bg-white px-2 py-1.5 text-sm shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                              <label className="flex items-center gap-2 font-bold text-slate-700">
                                <input name={`open_${day.value}`} type="checkbox" defaultChecked={Boolean(sched)} className="accent-[#D4AF37]" />
                                {day.label}
                              </label>
                              <input name={`start_${day.value}`} type="time" defaultValue={sched?.start_time.slice(0, 5) ?? "10:00"} className="min-h-9 rounded-lg border border-slate-200 px-2 text-xs font-semibold" />
                              <input name={`end_${day.value}`} type="time" defaultValue={sched?.end_time.slice(0, 5) ?? "20:00"} className="min-h-9 rounded-lg border border-slate-200 px-2 text-xs font-semibold" />
                            </div>
                          );
                        })}
                      </div>
                      <button
                        type="submit"
                        disabled={savingSchedule === b.id}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2 text-xs font-black text-white transition hover:bg-slate-700 disabled:opacity-40"
                      >
                        <Save size={13} />
                        {savingSchedule === b.id ? "Guardando..." : "Guardar horario"}
                      </button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {scheduleError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{scheduleError}</p>
      )}

      {/* ── Cierres y festivos (colapsable al final) ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={() => setShowClosures((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4"
        >
          <div className="text-left">
            <p className="font-black text-slate-900">Cierres y festivos</p>
            <p className="text-xs text-slate-400">Bloquea días o franjas — {closures.length} configurados</p>
          </div>
          {showClosures ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>

        {showClosures && (
          <div className="border-t border-slate-100 px-5 pb-5 pt-4">
            <form action={handleClosureSubmit} className="grid gap-3 md:grid-cols-[1fr_130px_130px_1fr_auto] md:items-end">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Fecha</label>
                <input name="closure_date" type="date" required className="input-field py-2.5" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Desde</label>
                <input name="start_time" type="time" defaultValue="09:00" className="input-field py-2.5" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Hasta</label>
                <input name="end_time" type="time" defaultValue="20:00" className="input-field py-2.5" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Motivo</label>
                <input name="reason" placeholder="Festivo, vacaciones..." className="input-field py-2.5" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600">
                  <input name="full_day" type="checkbox" defaultChecked className="accent-[#D4AF37]" />
                  Día completo
                </label>
                <button
                  type="submit"
                  disabled={closureSaving}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-black text-white transition hover:bg-slate-700 disabled:opacity-40"
                >
                  <CalendarX size={13} /> {closureSaving ? "Guardando" : "Bloquear"}
                </button>
              </div>
            </form>

            {closureError && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{closureError}</p>
            )}

            <div className="mt-4 space-y-2">
              {closures.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                  Sin cierres próximos configurados.
                </p>
              ) : (
                closures.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        {new Date(`${c.closure_date}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short", weekday: "short" })}
                      </p>
                      <p className="text-xs text-slate-500">
                        {!c.start_time || !c.end_time ? "Día completo" : `${c.start_time.slice(0, 5)} – ${c.end_time.slice(0, 5)}`}
                        {c.reason ? ` · ${c.reason}` : ""}
                      </p>
                    </div>
                    <button type="button" onClick={() => handleDeleteClosure(c.id)} className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal añadir/editar barbero ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#C9922A]">Equipo</p>
                <h2 className="mt-0.5 text-xl font-black text-slate-900">
                  {editing ? "Editar barbero" : "Nuevo barbero"}
                </h2>
              </div>
              <button type="button" onClick={closeModal} className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <form action={handleSubmit} className="flex flex-col gap-4 p-6">
              <div>
                <label htmlFor="barber-name" className="mb-1 block text-sm font-semibold text-slate-700">Nombre *</label>
                <input id="barber-name" name="name" required defaultValue={editing?.name ?? ""} placeholder="Ej: Carlos" className="input-field py-3" />
              </div>
              <div>
                <label htmlFor="barber-phone" className="mb-1 block text-sm font-semibold text-slate-700">Teléfono (opcional)</label>
                <input id="barber-phone" name="phone" type="tel" defaultValue={editing?.phone ?? ""} placeholder="+34 600 000 000" className="input-field py-3" />
              </div>
              <div>
                <label htmlFor="barber-specialty" className="mb-1 block text-sm font-semibold text-slate-700">Especialidad (visible en página pública)</label>
                <input id="barber-specialty" name="specialty" defaultValue={editing?.specialty ?? ""} placeholder="Ej: Fades, Diseños y Barba" className="input-field py-3" maxLength={60} />
              </div>
              <div>
                <label htmlFor="barber-bio" className="mb-1 block text-sm font-semibold text-slate-700">Bio corta (visible en página pública)</label>
                <textarea id="barber-bio" name="bio" rows={2} defaultValue={editing?.bio ?? ""} placeholder="Ej: 8 años cortando en Madrid. Especialista en skin fades y diseños geométricos." className="input-field py-3 resize-none" maxLength={160} />
              </div>
              <div>
                <label htmlFor="barber-instagram" className="mb-1 block text-sm font-semibold text-slate-700">Instagram (opcional)</label>
                <input id="barber-instagram" name="instagram_url" type="url" defaultValue={editing?.instagram_url ?? ""} placeholder="https://instagram.com/tu_usuario" className="input-field py-3" />
              </div>
              {formError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}
              <div className="flex gap-3 pt-1">
                <PrimaryButton type="button" onClick={closeModal} variant="secondary" className="flex-1">Cancelar</PrimaryButton>
                <PrimaryButton type="submit" disabled={saving} variant="primary" className="flex-1">
                  {saving ? "Guardando..." : editing ? "Guardar" : "Añadir barbero"}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
