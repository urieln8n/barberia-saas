"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  Euro,
  Plus,
  Scissors,
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
import { formatTime, getTodayISO, isActiveAppointment, timeToMinutes } from "@/src/lib/agenda/agenda-utils";
import { getAgendaNotifications } from "@/src/lib/notifications/get-agenda-notifications";
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
import { AgendaNotificationsBell } from "@/components/agenda/AgendaNotificationsBell";
import { AgendaNowCard } from "@/components/agenda/AgendaNowCard";
import { QuickBookingPanel } from "@/components/dashboard/QuickBookingPanel";

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
  initialSelectedBarber?: string;
  initialSelectedService?: string;
  errors: string[];
};

type QuickBookingDefaults = {
  date: string;
  time: string;
  barberId: string;
  serviceId: string;
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
  initialSelectedBarber = "",
  initialSelectedService = "",
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
  const [selectedBarber, setSelectedBarber] = useState(initialSelectedBarber);
  const [selectedService, setSelectedService] = useState(initialSelectedService);
  const [quickBookingDefaults, setQuickBookingDefaults] =
    useState<QuickBookingDefaults | null>(null);

  const slots = generateTimeSlots(9, 20, 30);

  // On mobile, default to day view so the agenda is usable without horizontal scroll
  useEffect(() => {
    if (initialView === "week" && window.innerWidth < 768) {
      setView("day");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pushURL(newView: AgendaView, newDate: string, barberId = selectedBarber, serviceId = selectedService) {
    const params = new URLSearchParams();
    params.set("view", newView);
    params.set("date", newDate);
    if (barberId) params.set("barber", barberId);
    if (serviceId) params.set("service", serviceId);
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
    pushURL("week", dateISO, barberId, selectedService);
  }

  function handleBarberChange(barberId: string) {
    setSelectedBarber(barberId);
    pushURL(view, dateISO, barberId, selectedService);
  }

  function handleServiceChange(serviceId: string) {
    setSelectedService(serviceId);
    pushURL(view, dateISO, selectedBarber, serviceId);
  }

  const selectedBarberRow = barbers.find((barber) => barber.id === selectedBarber) ?? null;
  const selectedServiceRow = services.find((service) => service.id === selectedService) ?? null;

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
      const byService = selectedServiceRow
        ? timeToMinutes(formatTime(s.end_time)) - timeToMinutes(formatTime(s.start_time)) >= selectedServiceRow.duration_minutes
        : true;
      return byFilter && byBarber && byService;
    });
  }, [activeFilter, freeSlots, selectedBarber, selectedServiceRow]);

  const filteredAppointmentsForMetrics = useMemo(() => {
    return appointments.filter((a) => {
      const byBarber = selectedBarber ? a.barber?.id === selectedBarber : true;
      const byService = selectedService ? a.service?.id === selectedService : true;
      return byBarber && byService;
    });
  }, [appointments, selectedBarber, selectedService]);

  const filteredFreeSlotsForMetrics = useMemo(() => {
    return freeSlots.filter((s) => {
      const byBarber = selectedBarber ? s.barber?.id === selectedBarber : true;
      const byService = selectedServiceRow
        ? timeToMinutes(formatTime(s.end_time)) - timeToMinutes(formatTime(s.start_time)) >= selectedServiceRow.duration_minutes
        : true;
      return byBarber && byService;
    });
  }, [freeSlots, selectedBarber, selectedServiceRow]);

  const visibleMetrics = useMemo<AgendaMetrics>(() => {
    const today = getTodayISO();
    const activeAppointments = filteredAppointmentsForMetrics.filter(isActiveAppointment);
    return {
      todayAppointments: filteredAppointmentsForMetrics.filter((appointment) => appointment.appointment_date === today).length,
      weekAppointments: activeAppointments.length,
      estimatedRevenue: activeAppointments.reduce((sum, appointment) => sum + Number(appointment.service?.price ?? 0), 0),
      freeSlots: filteredFreeSlotsForMetrics.length,
      pendingAppointments: filteredAppointmentsForMetrics.filter((appointment) =>
        ["pending", "scheduled"].includes(appointment.status),
      ).length,
      newClients: filteredAppointmentsForMetrics.filter((appointment) => (appointment.client?.visit_count ?? 0) <= 1).length,
      completedAppointments: filteredAppointmentsForMetrics.filter((appointment) => appointment.status === "completed").length,
      cancelledAppointments: filteredAppointmentsForMetrics.filter((appointment) =>
        ["cancelled", "no_show"].includes(appointment.status),
      ).length,
    };
  }, [filteredAppointmentsForMetrics, filteredFreeSlotsForMetrics]);

  const barberWorkloads = useMemo(
    () => buildBarberWorkloads(barbers, appointments, freeSlots),
    [barbers, appointments, freeSlots],
  );

  const agendaNotifications = useMemo(
    () => getAgendaNotifications({ appointments, freeSlots, selectedDate: dateISO }),
    [appointments, freeSlots, dateISO],
  );

  const nextApptLabel = useMemo(() => {
    const dayAppts = visibleAppointments
      .filter(
        (a) =>
          a.appointment_date === dateISO &&
          ["scheduled", "confirmed", "pending"].includes(a.status),
      )
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    return dayAppts[0]?.start_time.slice(0, 5) ?? "—";
  }, [visibleAppointments, dateISO]);

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

  function getSuggestedServiceId(slot: FreeSlot) {
    const duration = Math.max(
      15,
      Number(slot.end_time.slice(0, 2)) * 60 +
        Number(slot.end_time.slice(3, 5)) -
        (Number(slot.start_time.slice(0, 2)) * 60 + Number(slot.start_time.slice(3, 5))),
    );

    return services.find((service) => service.duration_minutes <= duration)?.id ?? "";
  }

  function handleFreeSlotBook(slot: FreeSlot) {
    setFormError("");
    setQuickBookingDefaults({
      date: slot.date,
      time: slot.start_time.slice(0, 5),
      barberId: slot.barber?.id ?? "",
      serviceId: getSuggestedServiceId(slot),
    });
  }

  function handleEmptySlotClick(day: string, hour: string) {
    setFormError("");
    setQuickBookingDefaults({
      date: day,
      time: hour.slice(0, 5),
      barberId: selectedBarber ?? "",
      serviceId: selectedService ?? "",
    });
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
    <div className="min-h-screen bg-[#F7F3EA] pb-8">
      <div className="space-y-5">
        {/* Header */}
        <div className="rounded-2xl border border-[#080A0F]/8 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  Agenda Pro
                </p>
                <h1 className="text-xl font-black text-[#080A0F] md:text-2xl">
                  Controla citas, huecos, barberos y oportunidades.
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <AgendaNotificationsBell notifications={agendaNotifications} />
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
              value={visibleMetrics.todayAppointments}
              description="Reservas activas para hoy."
              icon={CalendarDays}
              accent="blue"
            />
            <AgendaStatCard
              label="Ingresos estimados"
              value={money(visibleMetrics.estimatedRevenue)}
              description="Calculado con precios de servicios."
              icon={Euro}
              accent="gold"
            />
            <AgendaStatCard
              label="Huecos libres"
              value={visibleMetrics.freeSlots}
              description="Huecos detectados esta semana."
              icon={Clock}
              accent="green"
            />
            <AgendaStatCard
              label="Barberos activos"
              value={barbers.length}
              description={barbers.length > 0 ? barbers.map((b) => b.name).join(", ") : "Sin barberos configurados."}
              icon={Users}
              accent="gold"
            />
            <AgendaStatCard
              label="Próxima cita"
              value={nextApptLabel}
              description={nextApptLabel === "—" ? "Sin citas activas hoy." : "Hora de la siguiente reserva activa."}
              icon={Scissors}
              accent="blue"
            />
          </div>
        )}

        {/* View body with motion */}
        <AgendaMotionShell view={view}>
          {view === "day" && (
            <div className="space-y-4">
              <AgendaNowCard
                appointments={visibleAppointments}
                freeSlots={visibleFreeSlots}
                dateISO={dateISO}
              />
              <AgendaFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                selectedBarber={selectedBarber}
                selectedService={selectedService}
                onBarberChange={handleBarberChange}
                onServiceChange={handleServiceChange}
                barbers={barbers}
                services={services}
              />
              <DailyTimelineView
                dateISO={dateISO}
                appointments={visibleAppointments}
                freeSlots={visibleFreeSlots}
                barbers={barbers}
                services={services}
                selectedBarberName={selectedBarberRow?.name ?? null}
                onAppointmentClick={setSelectedAppointment}
                onFreeSlotBook={handleFreeSlotBook}
                onNewAppointment={() => {
                  setFormError("");
                  setShowModal(true);
                }}
              />
            </div>
          )}

          {view === "week" && (
            <div className="space-y-4">
              <AgendaNowCard
                appointments={visibleAppointments}
                freeSlots={visibleFreeSlots}
                dateISO={dateISO}
              />
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
                onBarberChange={handleBarberChange}
                onServiceChange={handleServiceChange}
                barbers={barbers}
                services={services}
              />

              <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-4 py-3 text-sm font-bold text-slate-700">
                {selectedBarberRow
                  ? `Mostrando agenda de ${selectedBarberRow.name}.`
                  : "Mostrando agenda de todos los barberos."}
                {selectedServiceRow ? ` Filtrada por ${selectedServiceRow.name}.` : ""}
              </div>

              <WeeklyCalendarGrid
                days={days}
                appointments={visibleAppointments}
                freeSlots={visibleFreeSlots}
                services={services}
                selectedDay={dateISO}
                onSelectedDayChange={handleDateChange}
                onAppointmentClick={setSelectedAppointment}
                onFreeSlotBook={handleFreeSlotBook}
                onEmptySlotClick={handleEmptySlotClick}
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

      <QuickBookingPanel
        open={quickBookingDefaults !== null}
        onOpenChange={(open) => {
          if (!open) setQuickBookingDefaults(null);
        }}
        services={services}
        barbers={barbers}
        defaultDate={quickBookingDefaults?.date}
        defaultTime={quickBookingDefaults?.time}
        defaultBarberId={quickBookingDefaults?.barberId}
        defaultServiceId={quickBookingDefaults?.serviceId}
        onSuccess={() => {
          setQuickBookingDefaults(null);
          router.refresh();
        }}
      />

      {/* New appointment modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080A0F]/50 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white text-[#080A0F] shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#B88917]">
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
