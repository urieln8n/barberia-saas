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
  FreeSlot,
} from "@/src/lib/agenda/types";
import { createAppointment, updateAppointmentStatus } from "./actions";
import { AgendaPageHeader } from "@/components/agenda/AgendaPageHeader";
import { AgendaStatCard } from "@/components/agenda/AgendaStatCard";
import { AgendaFilters, type AgendaFilter } from "@/components/agenda/AgendaFilters";
import { AgendaLegend } from "@/components/agenda/AgendaLegend";
import { WeeklyCalendarGrid } from "@/components/agenda/WeeklyCalendarGrid";
import { AppointmentDetailsPanel } from "@/components/agenda/AppointmentDetailsPanel";
import { AgendaRecommendedAction } from "@/components/agenda/AgendaRecommendedAction";

type Props = {
  days: AgendaDay[];
  appointments: AgendaAppointment[];
  clients: AgendaClientRow[];
  services: AgendaService[];
  barbers: AgendaBarber[];
  freeSlots: FreeSlot[];
  metrics: AgendaMetrics;
  recommendation: AgendaRecommendation;
  selectedDate: string;
  barbershopId: string;
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
  if (filter === "cancelled") return ["cancelled", "no_show"].includes(appointment.status);
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
  selectedDate,
  barbershopId,
  errors,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AgendaAppointment | null>(null);
  const [activeFilter, setActiveFilter] = useState<AgendaFilter>("all");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDay, setSelectedDay] = useState(selectedDate);

  const slots = generateTimeSlots(9, 20, 30);

  const visibleAppointments = useMemo(() => {
    if (activeFilter === "free") return [];

    return appointments.filter((appointment) => {
      const byStatus = matchesFilter(appointment, activeFilter);
      const byBarber = selectedBarber ? appointment.barber?.id === selectedBarber : true;
      const byService = selectedService ? appointment.service?.id === selectedService : true;
      return byStatus && byBarber && byService;
    });
  }, [activeFilter, appointments, selectedBarber, selectedService]);

  const visibleFreeSlots = useMemo(() => {
    return freeSlots.filter((slot) => {
      const byFilter = activeFilter === "free" || activeFilter === "all";
      const byBarber = selectedBarber ? slot.barber?.id === selectedBarber : true;
      return byFilter && byBarber;
    });
  }, [activeFilter, freeSlots, selectedBarber]);

  function handleDateChange(date: string) {
    setSelectedDay(date);
    router.push(`/dashboard/agenda?fecha=${date}`);
  }

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
      setSelectedAppointment((current) =>
        current?.id === id ? { ...current, status: status as AgendaAppointment["status"] } : current,
      );
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-8">
      <div className="space-y-5">
        <AgendaPageHeader
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onNewAppointment={() => {
            setFormError("");
            setShowModal(true);
          }}
        />

        {errors.length > 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Algunos datos no se pudieron cargar: {errors.join(" · ")}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <AgendaStatCard
            label="Citas hoy"
            value={metrics.todayAppointments}
            description="Reservas activas y registradas para hoy."
            icon={CalendarDays}
            accent="blue"
          />
          <AgendaStatCard
            label="Ingresos estimados"
            value={money(metrics.estimatedRevenue)}
            description="Calculado con precios de servicios visibles."
            icon={Euro}
            accent="gold"
          />
          <AgendaStatCard
            label="Huecos libres"
            value={metrics.freeSlots}
            description="Huecos visuales detectados esta semana."
            icon={Clock}
            accent="green"
          />
          <AgendaStatCard
            label="Pendientes"
            value={metrics.pendingAppointments}
            description="Citas por confirmar o revisar."
            icon={UserPlus}
            accent="red"
          />
          <AgendaStatCard
            label="Nuevos clientes"
            value={metrics.newClients}
            description="Detectado por historial de visitas."
            icon={Users}
            accent="slate"
          />
        </div>

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

        <AgendaLegend />

        {appointments.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <CalendarDays size={22} />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950">Todavia no tienes citas en esta semana.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Cuando entren reservas, BarberiaOS las organizara aqui por dia, hora, barbero y estado.
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
        ) : null}

        {barbers.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black text-slate-950">Anade tus barberos para ver la ocupacion.</h2>
            <p className="mt-1 text-sm text-slate-500">La agenda semanal puede mostrar columnas y huecos por barbero cuando el equipo esta creado.</p>
          </section>
        ) : null}

        {services.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-black text-slate-950">Anade servicios para calcular duracion e ingresos estimados.</h2>
            <p className="mt-1 text-sm text-slate-500">Los precios y duraciones se usan solo para metricas visuales y lectura operativa.</p>
          </section>
        ) : null}

        <WeeklyCalendarGrid
          days={days}
          appointments={visibleAppointments}
          freeSlots={visibleFreeSlots}
          selectedDay={selectedDay}
          onSelectedDayChange={setSelectedDay}
          onAppointmentClick={setSelectedAppointment}
        />

        <AgendaRecommendedAction recommendation={recommendation} />
      </div>

      <AppointmentDetailsPanel
        appointment={selectedAppointment}
        updating={updating}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatus}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#8A641F]">Agenda Visual Pro</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Nueva reserva</h2>
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
                <input type="hidden" name="barbershop_id" value={barbershopId} />

                <div>
                  <label className="mb-1.5 block text-sm font-black text-slate-700">Cliente *</label>
                  <select name="client_id" required className="input-field py-3">
                    <option value="">Seleccionar cliente...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}{client.phone ? ` · ${client.phone}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-black text-slate-700">Servicio *</label>
                  <select name="service_id" required className="input-field py-3">
                    <option value="">Seleccionar servicio...</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} · {service.price} EUR · {service.duration_minutes} min
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-black text-slate-700">Barbero</label>
                  <select name="barber_id" className="input-field py-3">
                    <option value="">Cualquiera / Sin asignar</option>
                    {barbers.map((barber) => (
                      <option key={barber.id} value={barber.id}>
                        {barber.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-black text-slate-700">Fecha *</label>
                    <input name="appointment_date" type="date" defaultValue={selectedDay} required className="input-field py-3" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-black text-slate-700">Hora *</label>
                    <select name="start_time" required className="input-field py-3">
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
                  <label className="mb-1.5 block text-sm font-black text-slate-700">Notas</label>
                  <input name="notes" placeholder="Ej: Trae referencia de foto" className="input-field py-3" />
                </div>

                {formError ? (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{formError}</p>
                ) : null}

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
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-50"
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
