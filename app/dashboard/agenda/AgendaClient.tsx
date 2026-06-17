"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clapperboard,
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
import { createAppointment, updateAppointmentStatus, getLoyaltyHint } from "./actions";
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
  autoOpen?: boolean;
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
  autoOpen = false,
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
  const [statusError, setStatusError] = useState("");
  // Combobox — modal nueva cita
  const [clientSearch, setClientSearch]   = useState("");
  const [clientComboOpen, setClientComboOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");

  useEffect(() => {
    if (autoOpen) {
      setQuickBookingDefaults({ date: initialDate, time: "", barberId: "", serviceId: "" });
    }
    // Only fires once on mount when ?new=1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [loyaltyHint, setLoyaltyHint] = useState<{
    stamps: number;
    required: number;
    rewardDescription: string | null;
  } | null>(null);

  const slots = generateTimeSlots(9, 20, 30);

  // On mobile, default to day view so the agenda is usable without horizontal scroll
  useEffect(() => {
    if (initialView === "week" && window.innerWidth < 768) {
      setView("day");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load loyalty hint whenever a different client's appointment is selected
  const loadLoyaltyHint = useCallback(async (clientId: string | null | undefined) => {
    if (!clientId) { setLoyaltyHint(null); return; }
    const hint = await getLoyaltyHint(clientId);
    setLoyaltyHint(hint);
  }, []);

  useEffect(() => {
    loadLoyaltyHint(selectedAppointment?.client?.id);
  }, [selectedAppointment?.client?.id, loadLoyaltyHint]);

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

    if (result?.error) {
      setStatusError(result.error);
      setTimeout(() => setStatusError(""), 5000);
      return;
    }

    // Update local state immediately so panel reflects new status
    setSelectedAppointment((cur) =>
      cur?.id === id
        ? { ...cur, status: status as AgendaAppointment["status"] }
        : cur,
    );

    // Auto-close panel on terminal statuses so the agenda grid is visible
    const terminal = ["completed", "cancelled", "no_show"];
    if (terminal.includes(status)) {
      setTimeout(() => setSelectedAppointment(null), 400);
    }

    router.refresh();
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-12">
      {/* Textura radial dorada — esquina inferior derecha, muy sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: [
            "radial-gradient(ellipse 60% 50% at 92% 90%, rgba(201,146,42,0.055) 0%, transparent 70%)",
            "radial-gradient(ellipse 40% 30% at 8% 10%, rgba(212,175,55,0.035) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Marca de agua "B" — desktop únicamente, centrada a la derecha */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 right-0 z-0 hidden select-none md:block"
        style={{
          fontSize: "clamp(280px, 30vw, 480px)",
          fontWeight: 900,
          lineHeight: 0.85,
          color: "#C9A24D",
          opacity: 0.042,
          letterSpacing: "-0.06em",
          userSelect: "none",
          transform: "translate(12%, 8%)",
        }}
      >
        B
      </div>

      <div className="relative z-10 space-y-4">
        {/* ═══ HEADER ═══ */}
        <div className="border-b border-white/[0.07] bg-[#0C0C0F] px-1 pb-3 pt-1">
          {/* Top row: title + actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37] sm:block">
                Agenda · Centro de operaciones
              </p>
              <h1 className="truncate text-lg font-black tracking-tight text-white/90 sm:text-xl">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }).replace(/^\w/, (c) => c.toUpperCase())}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <AgendaNotificationsBell notifications={agendaNotifications} />
              <button
                type="button"
                onClick={() => {
                  setFormError("");
                  setShowModal(true);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-[#D4AF37] px-3 py-2 text-sm font-black text-[#0A0A0A] shadow-[0_2px_8px_rgba(212,175,55,0.30)] transition hover:bg-[#E5C04C] active:scale-95 sm:px-4 sm:py-2.5"
              >
                <Plus size={14} />
                <span className="hidden sm:block">Nueva cita</span>
              </button>
            </div>
          </div>

          {/* KPI strip — scroll horizontal en móvil, 6 chips en una línea */}
          {view !== "opportunities" && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              {[
                { label: "Hoy",        value: visibleMetrics.todayAppointments,    color: "text-white/90" },
                { label: "Sem. €",     value: money(visibleMetrics.estimatedRevenue), color: "text-[#D4AF37]" },
                { label: "Libres",     value: visibleMetrics.freeSlots,            color: "text-emerald-400" },
                { label: "Pend.",      value: visibleMetrics.pendingAppointments,  color: visibleMetrics.pendingAppointments > 0 ? "text-amber-400" : "text-white/40" },
                { label: "Nuevos",     value: visibleMetrics.newClients,           color: "text-[#D4AF37]" },
                { label: "Próxima",    value: nextApptLabel,                       color: "text-white/70" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-2.5 py-1.5">
                  <span className="text-[10px] font-semibold text-white/30">{label}</span>
                  <span className={`text-sm font-black tabular-nums leading-none ${color}`}>{value}</span>
                </div>
              ))}
              {visibleMetrics.freeSlots > 0 && (
                <a
                  href="/dashboard/studio?type=fill_empty_slots"
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#A78BFA]/30 bg-[#A78BFA]/[0.10] px-2.5 py-1.5 text-[11px] font-black text-[#A78BFA] transition hover:bg-[#A78BFA]/[0.18]"
                >
                  <Clapperboard size={11} />
                  Llenar con IA
                </a>
              )}
            </div>
          )}

          {/* View switcher + date navigator */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
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
                <section className="rounded-2xl border border-dashed border-white/[0.10] bg-[#0E0E1C] p-8 text-center" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04)" }}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.05] text-white/30">
                    <CalendarDays size={22} />
                  </div>
                  <h2 className="mt-4 text-xl font-black text-white/80">
                    Sin citas esta semana.
                  </h2>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/50">
                    Crea la primera reserva o comparte tu link para recibir reservas online.
                  </p>
                  <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setShowModal(true)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 text-sm font-black text-[#0A0A0A] shadow-[0_2px_8px_rgba(212,175,55,0.25)] transition hover:bg-[#E5C04C]"
                    >
                      <Plus size={16} /> Crear primera reserva
                    </button>
                    <Link
                      href="/dashboard/qr"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/[0.10] px-4 text-sm font-black text-white/50 transition hover:border-white/[0.20] hover:text-white/80"
                    >
                      Ver link de reservas
                    </Link>
                  </div>
                </section>
              )}

              {barbers.length === 0 && (
                <section className="rounded-2xl border border-white/[0.10] bg-[#0E0E1C] p-5">
                  <h2 className="font-black text-white/70">
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

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/50">
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
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#0E0E1C] p-8 text-center">
              <p className="text-white/40">Cargando datos del mes...</p>
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

      {/* Error inline — reemplaza alert() */}
      {statusError && (
        <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-[#0E0E1C] px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] md:bottom-6">
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
          <p className="text-sm font-semibold text-red-400">{statusError}</p>
          <button type="button" onClick={() => setStatusError("")} className="text-red-400 hover:text-red-300">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Appointment details panel */}
      <AppointmentDetailsPanel
        appointment={selectedAppointment}
        updating={updating}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatus}
        loyaltyHint={loyaltyHint}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.12] bg-[#0E0E1C]" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.8)" }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">Nueva cita</p>
                  <h2 className="mt-0.5 text-lg font-black text-white/90">Crear reserva</h2>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setClientSearch(""); setSelectedClientId(""); setClientComboOpen(false); }}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.10] text-white/30 transition hover:border-white/[0.20] hover:text-white/60"
                >
                  <X size={16} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-5 flex flex-col gap-3.5">
                <input type="hidden" name="barbershop_id" value={barbershopId} />

                {/* ── Combobox cliente con búsqueda ── */}
                <div className="relative">
                  <label className="mb-1.5 block text-xs font-semibold text-white/50">Cliente *</label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o teléfono..."
                    value={clientSearch}
                    autoComplete="off"
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setClientComboOpen(true);
                      setSelectedClientId("");
                    }}
                    onFocus={() => setClientComboOpen(true)}
                    onBlur={() => setTimeout(() => setClientComboOpen(false), 180)}
                    className={`w-full rounded-xl border bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 outline-none transition placeholder:text-white/25 ${
                      selectedClientId
                        ? "border-[#D4AF37] ring-1 ring-[#D4AF37]/20"
                        : "border-white/[0.10] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
                    }`}
                  />
                  <input type="hidden" name="client_id" value={selectedClientId} />
                  {clientComboOpen && (
                    <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-white/[0.10] bg-[#0A0A0D] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                      {(() => {
                        const q = clientSearch.toLowerCase().trim();
                        const matches = q
                          ? clients.filter(c =>
                              c.name.toLowerCase().includes(q) ||
                              (c.phone && c.phone.includes(q))
                            ).slice(0, 8)
                          : clients.slice(0, 8);
                        if (matches.length === 0) return (
                          <p className="px-3 py-3 text-xs text-white/30">Sin resultados</p>
                        );
                        return matches.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onMouseDown={() => {
                              setSelectedClientId(c.id);
                              setClientSearch(`${c.name}${c.phone ? ` · ${c.phone}` : ""}`);
                              setClientComboOpen(false);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
                          >
                            <span className="font-semibold text-sm text-white/80">{c.name}</span>
                            {c.phone && <span className="text-xs text-white/40">{c.phone}</span>}
                          </button>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* ── Servicio + Barbero ── */}
                {[
                  { label: "Servicio *", name: "service_id", required: true,
                    options: [{ value: "", label: "Seleccionar servicio..." }, ...services.map(s => ({ value: s.id, label: `${s.name} · ${s.price}€ · ${s.duration_minutes}min` }))] },
                  { label: "Barbero", name: "barber_id", required: false,
                    options: [{ value: "", label: "Cualquiera / Sin asignar" }, ...barbers.map(b => ({ value: b.id, label: b.name }))] },
                ].map(({ label, name, required, options }) => (
                  <div key={name}>
                    <label className="mb-1.5 block text-xs font-semibold text-white/50">{label}</label>
                    <select
                      name={name}
                      required={required}
                      className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
                    >
                      {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/50">Fecha *</label>
                    <input
                      name="appointment_date"
                      type="date"
                      defaultValue={view === "day" ? dateISO : getTodayISO()}
                      required
                      className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 outline-none transition focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/50">Hora *</label>
                    <select
                      name="start_time"
                      required
                      className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 outline-none transition focus:border-[#D4AF37]/50"
                    >
                      <option value="">Hora...</option>
                      {slots.map((slot) => (
                        <option key={slot.time} value={slot.time}>{slot.time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/50">Notas</label>
                  <input
                    name="notes"
                    placeholder="Ej: Trae referencia de foto"
                    className="w-full rounded-xl border border-white/[0.10] bg-[#0A0A0D] px-3 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none transition focus:border-[#D4AF37]/50"
                  />
                </div>

                {formError && (
                  <p className="rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm font-semibold text-red-400">
                    {formError}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setClientSearch(""); setSelectedClientId(""); setClientComboOpen(false); }}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl border border-white/[0.10] px-4 text-sm font-semibold text-white/40 transition hover:border-white/[0.20] hover:text-white/70"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-xl bg-[#D4AF37] px-4 text-sm font-black text-[#0A0A0A] shadow-[0_2px_8px_rgba(212,175,55,0.25)] transition hover:bg-[#E5C04C] disabled:opacity-50"
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
