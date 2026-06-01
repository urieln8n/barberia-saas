"use client";

import { useMemo, useState } from "react";
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
    <div className="min-h-screen bg-[#0a0a0a] pb-12 text-white">
      <div className="space-y-4">
        {/* ═══ COMMAND CENTER HEADER ═══ */}
        <div className="border-b border-[#1e1e1e] bg-[#0a0a0a] px-1 pb-4 pt-1">
          {/* Top row: title + actions */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-[#D4AF37]">
                Agenda · Centro de operaciones
              </p>
              <h1 className="mt-1 text-xl font-black tracking-tight text-white md:text-2xl">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).replace(/^\w/, (c) => c.toUpperCase())}
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
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-black text-[#070707] shadow-[0_4px_16px_rgba(212,175,55,0.25)] transition hover:bg-[#F4D03F] active:scale-95"
              >
                <Plus size={14} />
                <span className="hidden sm:block">Nueva cita</span>
              </button>
            </div>
          </div>

          {/* KPI strip — inline, compact */}
          {view !== "opportunities" && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {[
                {
                  label: "Citas hoy",
                  value: visibleMetrics.todayAppointments,
                  color: "text-white",
                  sub: "activas",
                },
                {
                  label: "Ingresos sem.",
                  value: money(visibleMetrics.estimatedRevenue),
                  color: "text-[#D4AF37]",
                  sub: "estimados",
                },
                {
                  label: "Huecos libres",
                  value: visibleMetrics.freeSlots,
                  color: "text-[#22C55E]",
                  sub: "esta semana",
                },
                {
                  label: "Pendientes",
                  value: visibleMetrics.pendingAppointments,
                  color: visibleMetrics.pendingAppointments > 0 ? "text-[#F59E0B]" : "text-white",
                  sub: "por confirmar",
                },
                {
                  label: "Clientes nuevos",
                  value: visibleMetrics.newClients,
                  color: "text-[#3B82F6]",
                  sub: "esta semana",
                },
                {
                  label: "Próxima cita",
                  value: nextApptLabel,
                  color: "text-white",
                  sub: "hoy",
                },
              ].map(({ label, value, color, sub }) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#1e1e1e] bg-[#111111] px-3 py-2.5"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#555]">{label}</p>
                  <p className={`mt-1 text-lg font-black tabular-nums leading-none ${color}`}>
                    {value}
                  </p>
                  <p className="mt-0.5 text-[9px] text-[#444]">{sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* View switcher + date navigator */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex-1 min-w-0">
              <AgendaViewSwitcher current={view} onChange={handleViewChange} />
            </div>
            <AgendaDateNavigator
              view={view}
              dateISO={dateISO}
              onDateChange={handleDateChange}
            />
          </div>
        </div>

        {/* Error banner */}
        {errors.length > 0 && (
          <div className="rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/[0.08] px-4 py-3 text-sm font-semibold text-[#F59E0B]">
            Algunos datos no se cargaron: {errors.join(" · ")}
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
                <section className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#111111] p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] text-[#555]">
                    <CalendarDays size={22} />
                  </div>
                  <h2 className="mt-4 text-xl font-black text-white">
                    Sin citas esta semana.
                  </h2>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#666]">
                    Crea la primera reserva o comparte tu link para recibir reservas online.
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 text-sm font-black text-[#070707] transition hover:bg-[#F4D03F]"
                    >
                      <Plus size={16} /> Crear primera reserva
                    </button>
                    <Link
                      href="/dashboard/qr"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 text-sm font-black text-[#888] transition hover:text-white"
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

      {/* New appointment modal — dark premium */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] shadow-[0_32px_100px_rgba(0,0,0,0.80)]">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                    Agenda Pro
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-white">
                    Nueva reserva
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] text-[#666] transition hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-5 flex flex-col gap-3.5">
                <input type="hidden" name="barbershop_id" value={barbershopId} />

                {[
                  { label: "Cliente *", name: "client_id", required: true, isSelect: true,
                    options: [{ value: "", label: "Seleccionar cliente..." }, ...clients.map(c => ({ value: c.id, label: `${c.name}${c.phone ? ` · ${c.phone}` : ""}` }))] },
                  { label: "Servicio *", name: "service_id", required: true, isSelect: true,
                    options: [{ value: "", label: "Seleccionar servicio..." }, ...services.map(s => ({ value: s.id, label: `${s.name} · ${s.price}€ · ${s.duration_minutes}min` }))] },
                  { label: "Barbero", name: "barber_id", required: false, isSelect: true,
                    options: [{ value: "", label: "Cualquiera / Sin asignar" }, ...barbers.map(b => ({ value: b.id, label: b.name }))] },
                ].map(({ label, name, required, isSelect, options }) => (
                  <div key={name}>
                    <label className="mb-1.5 block text-xs font-bold text-[#888]">{label}</label>
                    <select
                      name={name}
                      required={required}
                      className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/25"
                    >
                      {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#888]">Fecha *</label>
                    <input
                      name="appointment_date"
                      type="date"
                      defaultValue={view === "day" ? dateISO : getTodayISO()}
                      required
                      className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#888]">Hora *</label>
                    <select
                      name="start_time"
                      required
                      className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-3 text-sm text-white outline-none transition focus:border-[#D4AF37]/50"
                    >
                      <option value="">Hora...</option>
                      {slots.map((slot) => (
                        <option key={slot.time} value={slot.time}>{slot.time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#888]">Notas</label>
                  <input
                    name="notes"
                    placeholder="Ej: Trae referencia de foto"
                    className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-3 text-sm text-white placeholder-[#444] outline-none transition focus:border-[#D4AF37]/50"
                  />
                </div>

                {formError && (
                  <p className="rounded-xl border border-[#EF4444]/25 bg-[#EF4444]/[0.08] px-4 py-3 text-sm font-bold text-[#EF4444]">
                    {formError}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 text-sm font-black text-[#888] transition hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#D4AF37] px-4 text-sm font-black text-[#070707] transition hover:bg-[#F4D03F] disabled:opacity-50"
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
