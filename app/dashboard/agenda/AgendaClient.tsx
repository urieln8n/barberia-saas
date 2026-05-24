"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Euro,
  Plus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import type {
  AgendaAppointment,
  AgendaBarber,
  AgendaClient as AgendaClientRow,
  AgendaDay,
  AgendaMetrics,
  AgendaRecommendation,
  AgendaService,
  AgendaView,
  FreeSlot,
  MonthData,
} from "@/src/lib/agenda/types";
import { buildBarberWorkloads } from "@/src/lib/agenda/barber-workload";
import { detectOpportunities } from "@/src/lib/agenda/opportunities";
import { getTodayISO } from "@/src/lib/agenda/agenda-utils";
import { createAppointment, updateAppointmentStatus } from "./actions";
import { AgendaStatCard } from "@/components/agenda/AgendaStatCard";
import { AgendaFilters, type AgendaFilter } from "@/components/agenda/AgendaFilters";
import { WeeklyCalendarGrid } from "@/components/agenda/WeeklyCalendarGrid";
import { AppointmentDetailsPanel } from "@/components/agenda/AppointmentDetailsPanel";
import { AgendaRecommendedAction } from "@/components/agenda/AgendaRecommendedAction";
import { AgendaViewSwitcher } from "@/components/agenda/AgendaViewSwitcher";
import { AgendaDateNavigator } from "@/components/agenda/AgendaDateNavigator";
import { DailyTimelineView } from "@/components/agenda/DailyTimelineView";
import { MonthlyCalendarGrid } from "@/components/agenda/MonthlyCalendarGrid";
import { BarberWorkloadView } from "@/components/agenda/BarberWorkloadView";
import { AgendaOpportunitiesView } from "@/components/agenda/AgendaOpportunitiesView";
import { AgendaMotionShell } from "@/components/agenda/AgendaMotionShell";

type Props = {
  days: AgendaDay[];
  appointments: AgendaAppointment[];
  clients: AgendaClientRow[];
  services: AgendaService[];
  barbers: AgendaBarber[];
  freeSlots: FreeSlot[];
  metrics: AgendaMetrics;
  recommendation: AgendaRecommendation;
  view: AgendaView;
  dateISO: string;
  barbershopId: string;
  monthData: MonthData | null;
  errors: string[];
};

function money(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function matchesFilter(appointment: AgendaAppointment, filter: AgendaFilter) {
  if (filter === "all") return true;
  if (filter === "new") return (appointment.client?.visit_count ?? 0) <= 1;
  if (filter === "cancelled")
    return ["cancelled", "no_show"].includes(appointment.status);
  return appointment.status === filter;
}

export function AgendaClient({
  days,
  appointments,
  clients,
  services,
  barbers,
  freeSlots,
  metrics,
  recommendation,
  view: initialView,
  dateISO: initialDate,
  barbershopId,
  monthData,
  errors,
}: Props) {
  const router = useRouter();

  const [view, setView] = useState<AgendaView>(initialView);
  const [dateISO, setDateISO] = useState(initialDate);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AgendaAppointment | null>(null);
  const [activeFilter, setActiveFilter] = useState<AgendaFilter>("all");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const slots = generateTimeSlots(9, 20, 30);

  function pushURL(newView: AgendaView, newDate: string) {
    const params = new URLSearchParams();
    params.set("view", newView);
    params.set("date", newDate);
    router.push(`/dashboard/agenda?${params.toString()}`);
  }

  function handleViewChange(newView: AgendaView) {
    setView(newView);
    pushURL(newView, dateISO);
  }

  function handleDateChange(newDate: string) {
    setDateISO(newDate);
    pushURL(view, newDate);
  }

  function handleDayClick(iso: string) {
    setDateISO(iso);
    setView("day");
    pushURL("day", iso);
  }

  function handleViewBarberAgenda(barberId: string) {
    setSelectedBarber(barberId);
    setView("week");
    pushURL("week", dateISO);
  }

  const visibleAppointments = useMemo(() => {
    if (activeFilter === "free") return [];
    return appointments.filter((a) => {
      const byStatus = matchesFilter(a, activeFilter);
      const byBarber = selectedBarber ? a.barber?.id === selectedBarber : true;
      const byService = selectedService
        ? a.service?.id === selectedService
        : true;
      return byStatus && byBarber && byService;
    });
  }, [activeFilter, appointments, selectedBarber, selectedService]);

  const visibleFreeSlots = useMemo(() => {
    return freeSlots.filter((s) => {
      const byFilter = activeFilter === "free" || activeFilter === "all";
      const byBarber = selectedBarber ? s.barber?.id === selectedBarber : true;
      return byFilter && byBarber;
    });
  }, [activeFilter, freeSlots, selectedBarber]);

  const barberWorkloads = useMemo(
    () => buildBarberWorkloads(barbers, appointments, freeSlots),
    [barbers, appointments, freeSlots],
  );

  const opportunities = useMemo(
    () => detectOpportunities(metrics, appointments, freeSlots, barberWorkloads),
    [metrics, appointments, freeSlots, barberWorkloads],
  );

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setFormError("");
    const result = await createAppointment(formData);
    setSaving(false);
    if (result?.error) {
      setFormError(result.error);
      return;
    }
    setShowModal(false);
    router.refresh();
  }

  async function handleStatus(id: string, status: string) {
    setUpdating(id);
    const result = await updateAppointmentStatus(id, status);
    setUpdating(null);
    if (!result?.error) {
      setSelectedAppointment((cur) =>
        cur?.id === id
          ? { ...cur, status: status as AgendaAppointment["status"] }
          : cur,
      );
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8">
      <div className="space-y-5">
        {/* Header */}
        <div className="rounded-2xl border border-[#080A0F]/8 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D5A84C]">
                  Agenda Pro
                </p>
                <h1 className="text-xl font-black text-[#080A0F] md:text-2xl">
                  Controla citas, huecos, barberos y oportunidades.
                </h1>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormError("");
                  setShowModal(true);
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-[#080A0F] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#1a1d26] active:scale-95"
              >
                <Plus size={14} />
                <span className="hidden sm:block">Nueva cita</span>
              </button>
            </div>

            <AgendaViewSwitcher current={view} onChange={handleViewChange} />

            <AgendaDateNavigator
              view={view}
              dateISO={dateISO}
              onDateChange={handleDateChange}
            />
          </div>
        </div>

        {/* Error banner */}
        {errors.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Algunos datos no se cargaron: {errors.join(" · ")}
          </div>
        )}

        {/* KPI stats */}
        {view !== "opportunities" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <AgendaStatCard
              label="Citas hoy"
              value={metrics.todayAppointments}
              description="Reservas activas para hoy."
              icon={CalendarDays}
              accent="blue"
            />
            <AgendaStatCard
              label="Ingresos estimados"
              value={money(metrics.estimatedRevenue)}
              description="Calculado con precios de servicios."
              icon={Euro}
              accent="gold"
            />
            <AgendaStatCard
              label="Huecos libres"
              value={metrics.freeSlots}
              description="Huecos detectados esta semana."
              icon={Clock}
              accent="green"
            />
            <AgendaStatCard
              label="Pendientes"
              value={metrics.pendingAppointments}
              description="Citas por confirmar."
              icon={UserPlus}
              accent="red"
            />
            <AgendaStatCard
              label="Clientes nuevos"
              value={metrics.newClients}
              description="Detectado por historial de visitas."
              icon={Users}
              accent="slate"
            />
          </div>
        )}

        {/* View body with motion */}
        <AgendaMotionShell view={view}>
          {view === "day" && (
            <DailyTimelineView
              dateISO={dateISO}
              appointments={appointments}
              freeSlots={freeSlots}
              onAppointmentClick={setSelectedAppointment}
              onNewAppointment={() => {
                setFormError("");
                setShowModal(true);
              }}
            />
          )}

          {view === "week" && (
            <div className="space-y-4">
              {appointments.length === 0 && (
                <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <CalendarDays size={22} />
                  </div>
                  <h2 className="mt-4 text-xl font-black text-slate-950">
                    Sin citas esta semana.
                  </h2>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Crea la primera reserva o comparte tu link para recibir reservas online.
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800"
                    >
                      <Plus size={16} /> Crear primera reserva
                    </button>
                    <Link
                      href="/dashboard/qr"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      Ver link de reservas
                    </Link>
                  </div>
                </section>
              )}

              {barbers.length === 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="font-black text-slate-950">
                    Añade barberos para ver la ocupación por barbero.
                  </h2>
                </section>
              )}

              <AgendaFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                selectedBarber={selectedBarber}
                selectedService={selectedService}
                onBarberChange={setSelectedBarber}
                onServiceChange={setSelectedService}
                barbers={barbers}
                services={services}
              />

              <WeeklyCalendarGrid
                days={days}
                appointments={visibleAppointments}
                freeSlots={visibleFreeSlots}
                selectedDay={dateISO}
                onSelectedDayChange={handleDateChange}
                onAppointmentClick={setSelectedAppointment}
              />

              <AgendaRecommendedAction recommendation={recommendation} />
            </div>
          )}

          {view === "month" && monthData ? (
            <MonthlyCalendarGrid
              monthData={monthData}
              onDayClick={handleDayClick}
            />
          ) : view === "month" ? (
            <div className="rounded-2xl border border-dashed border-[#080A0F]/12 bg-white p-8 text-center">
              <p className="text-[#080A0F]/50">Cargando datos del mes...</p>
            </div>
          ) : null}

          {view === "barbers" && (
            <BarberWorkloadView
              workloads={barberWorkloads}
              onViewBarberAgenda={handleViewBarberAgenda}
            />
          )}

          {view === "opportunities" && (
            <AgendaOpportunitiesView opportunities={opportunities} />
          )}
        </AgendaMotionShell>
      </div>

      {/* Appointment details panel */}
      <AppointmentDetailsPanel
        appointment={selectedAppointment}
        updating={updating}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatus}
      />

      {/* New appointment modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080A0F]/50 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white text-[#080A0F] shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#B8892A]">
                    Agenda Pro
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-[#080A0F]">
                    Nueva reserva
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  aria-label="Cerrar"
                  className="rounded-xl p-2 transition-colors hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
                <input
                  type="hidden"
                  name="barbershop_id"
                  value={barbershopId}
                />

                <div>
                  <label className="mb-1.5 block text-sm font-black text-slate-700">
                    Cliente *
                  </label>
                  <select name="client_id" required className="input-field py-3">
                    <option value="">Seleccionar cliente...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.phone ? ` · ${c.phone}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-black text-slate-700">
                    Servicio *
                  </label>
                  <select
                    name="service_id"
                    required
                    className="input-field py-3"
                  >
                    <option value="">Seleccionar servicio...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {s.price} EUR · {s.duration_minutes} min
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-black text-slate-700">
                    Barbero
                  </label>
                  <select name="barber_id" className="input-field py-3">
                    <option value="">Cualquiera / Sin asignar</option>
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-black text-slate-700">
                      Fecha *
                    </label>
                    <input
                      name="appointment_date"
                      type="date"
                      defaultValue={view === "day" ? dateISO : getTodayISO()}
                      required
                      className="input-field py-3"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-black text-slate-700">
                      Hora *
                    </label>
                    <select
                      name="start_time"
                      required
                      className="input-field py-3"
                    >
                      <option value="">Hora...</option>
                      {slots.map((slot) => (
                        <option key={slot.time} value={slot.time}>
                          {slot.time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-black text-slate-700">
                    Notas
                  </label>
                  <input
                    name="notes"
                    placeholder="Ej: Trae referencia de foto"
                    className="input-field py-3"
                  />
                </div>

                {formError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    {formError}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#080A0F] px-4 text-sm font-black text-white transition hover:bg-[#1a1d26] disabled:opacity-50"
                  >
                    {saving ? "Guardando..." : "Crear cita"}
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
