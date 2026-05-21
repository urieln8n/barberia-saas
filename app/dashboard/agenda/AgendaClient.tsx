"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, CalendarDays, Clock, User, Scissors, UserPlus } from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import { createAppointment, updateAppointmentStatus } from "./actions";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

export type Appointment = {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string | null;
  status: string;
  notes: string | null;
  clients: { name: string; phone: string | null } | null;
  services: { name: string; price: number } | null;
  barbers: { name: string } | null;
};

type Client  = { id: string; name: string; phone: string | null };
type Service = { id: string; name: string; price: number; duration_minutes: number };
type Barber  = { id: string; name: string };

type Props = {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  allAppointments: Appointment[];
  clients: Client[];
  services: Service[];
  barbers: Barber[];
  barbershopId: string;
  fecha: string;
  errorMessage?: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending:   "Por confirmar",
  scheduled: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show:   "No apareció",
};

const NEXT_ACTIONS: Record<string, { label: string; status: string }[]> = {
  pending: [
    { label: "Confirmar",   status: "confirmed" },
    { label: "Cancelar",    status: "cancelled"  },
  ],
  scheduled: [
    { label: "Confirmar",   status: "confirmed" },
    { label: "Cancelar",    status: "cancelled"  },
  ],
  confirmed: [
    { label: "Completar",   status: "completed" },
    { label: "No apareció", status: "no_show"   },
    { label: "Cancelar",    status: "cancelled"  },
  ],
  completed: [],
  cancelled: [],
  no_show:   [],
};

function formatTime(time?: string | null) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AppointmentCard({
  appointment,
  showDate = false,
  onStatusChange,
  updating,
}: {
  appointment: Appointment;
  showDate?: boolean;
  updating: string | null;
  onStatusChange: (id: string, status: string) => void;
}) {
  return (
    <article className="premium-card p-4 md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {showDate ? (
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#111827]">
              <span className="text-[9px] font-bold uppercase text-[#7AA2FF]">
                {new Date(appointment.appointment_date + "T00:00:00").toLocaleDateString("es-ES", { month: "short" })}
              </span>
              <span className="text-sm font-black text-white">
                {new Date(appointment.appointment_date + "T00:00:00").getDate()}
              </span>
            </div>
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D5CEBC] bg-[#F8F3EA] text-sm font-black text-[#111827] shadow-sm">
              {formatTime(appointment.start_time)}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-bold text-white">
              {appointment.clients?.name ?? "Cliente sin nombre"}
            </p>

              <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <Scissors size={12} />
                {appointment.services?.name ?? "Servicio no definido"}
              </span>
              {appointment.barbers && (
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {appointment.barbers.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {formatTime(appointment.start_time)}
                {appointment.end_time ? `–${formatTime(appointment.end_time)}` : ""}
              </span>
            </p>

            {showDate && (
              <p className="mt-1 text-xs font-medium text-slate-500">
                Fecha: {formatDate(appointment.appointment_date)}
              </p>
            )}
            {appointment.clients?.phone && (
              <p className="mt-1 text-xs font-medium text-slate-500">Tel: {appointment.clients.phone}</p>
            )}
            {appointment.notes && (
              <p className="mt-1 text-xs font-medium text-slate-500">{appointment.notes}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={appointment.status}>
            {STATUS_LABEL[appointment.status] ?? appointment.status}
          </StatusBadge>

          {NEXT_ACTIONS[appointment.status]?.map((action) => (
            <button
              key={action.status}
              onClick={() => onStatusChange(appointment.id, action.status)}
              disabled={updating === appointment.id}
              className="min-h-10 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export function AgendaClient({
  appointments,
  upcomingAppointments,
  allAppointments,
  clients,
  services,
  barbers,
  barbershopId,
  fecha,
  errorMessage,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState("");
  const [updating,  setUpdating]  = useState<string | null>(null);

  const slots = generateTimeSlots(9, 20, 30);

  function handleDateChange(date: string) {
    router.push(`/dashboard/agenda?fecha=${date}`);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setFormError("");
    const result = await createAppointment(formData);
    setSaving(false);
    if (result?.error) { setFormError(result.error); return; }
    setShowModal(false);
    router.refresh();
  }

  async function handleStatus(id: string, status: string) {
    setUpdating(id);
    await updateAppointmentStatus(id, status);
    setUpdating(null);
    router.refresh();
  }

  const pendingCount = allAppointments.filter(
    (a) => a.status === "pending" || a.status === "scheduled"
  ).length;
  const appointmentsByBarber = barbers.map((barber) => {
    const barberAppointments = appointments.filter((appointment) => appointment.barbers?.name === barber.name);
    const busyTimes = new Set(barberAppointments.map((appointment) => formatTime(appointment.start_time)));
    const freeSlots = slots
      .filter((slot) => !busyTimes.has(slot.time))
      .slice(0, 5)
      .map((slot) => slot.time);

    return {
      barber,
      appointments: barberAppointments,
      freeSlots,
    };
  });

  return (
    <div className="space-y-5">

      <PageHeader
        section="Reservas"
        title="Agenda y reservas"
        description="Tu día ordenado por hora, barbero y estado. Confirma, completa o mueve citas sin perder contexto."
        action={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="date"
              value={fecha}
              onChange={(e) => handleDateChange(e.target.value)}
              className="input-field"
            />
            <PrimaryButton
              type="button"
              onClick={() => { setFormError(""); setShowModal(true); }}
              variant="primary"
            >
              <Plus size={16} /> Nueva cita
            </PrimaryButton>
            <PrimaryButton
              type="button"
              onClick={() => { setFormError(""); setShowModal(true); }}
              variant="secondary"
            >
              <UserPlus size={16} /> Walk-in
            </PrimaryButton>
          </div>
        }
      />

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Error leyendo agenda: {errorMessage}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Citas hoy" value={appointments.length} description="Fecha seleccionada" icon={CalendarDays} />
        <StatCard label="Próximas citas" value={upcomingAppointments.length} description="Desde hoy en adelante" icon={Clock} />
        <StatCard label="Total registradas" value={allAppointments.length} description="Histórico cargado" icon={Scissors} />
        <StatCard label="Pendientes" value={pendingCount} description="Por confirmar" icon={User} />
      </div>

      <SectionCard
        title="Vista por barbero"
        description="Agenda operativa para dueño o recepcionista, con huecos libres destacados."
      >
        {barbers.length === 0 ? (
          <EmptyState
            icon={User}
            title="Sin barberos activos"
            description="Añade tu equipo para ver columnas de disponibilidad y asignar citas a cada barbero. Ejemplo: Carlos, Miguel o Andrés con sus huecos del día."
            action={
              <PrimaryButton href="/dashboard/barberos" variant="primary">
                Crear barbero
              </PrimaryButton>
            }
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {appointmentsByBarber.map(({ barber, appointments: barberAppointments, freeSlots }) => (
              <article key={barber.id} className="rounded-[20px] border border-white/10 bg-white/[0.06] p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-sm font-black uppercase text-white">
                      {barber.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-white">{barber.name}</h3>
                      <p className="text-xs font-semibold text-slate-300">
                        {barberAppointments.length} citas · {freeSlots.length} huecos visibles
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={freeSlots.length > 0 ? "confirmed" : "completed"}>
                    {freeSlots.length > 0 ? "Con huecos" : "Completo"}
                  </StatusBadge>
                </div>

                <div className="mt-4 space-y-2">
                  {barberAppointments.slice(0, 4).map((appointment) => (
                    <div key={appointment.id} className="rounded-2xl border border-white/10 bg-[#182033] px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-black text-[#2563EB]">
                          {formatTime(appointment.start_time)}
                        </span>
                        <StatusBadge status={appointment.status} className="px-2 py-0.5 text-[10px]">
                          {STATUS_LABEL[appointment.status] ?? appointment.status}
                        </StatusBadge>
                      </div>
                      <p className="mt-1 truncate text-sm font-bold text-white">
                        {appointment.clients?.name ?? "Cliente sin nombre"}
                      </p>
                      <p className="text-xs text-slate-300">
                        {appointment.services?.name ?? "Servicio no definido"}
                      </p>
                    </div>
                  ))}

                  {freeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => { setFormError(""); setShowModal(true); }}
                    className="flex w-full items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-left text-sm font-black text-emerald-700 transition hover:bg-emerald-100"
                    >
                      <span>{slot} libre</span>
                      <Plus size={14} />
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Citas de la fecha seleccionada */}
      <SectionCard
        title={`Citas del ${fecha}`}
        description="Reservas y citas manuales para la fecha seleccionada."
      >
        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Todavía no tienes reservas para este día"
            description="Cuando tus clientes reserven desde tu link o QR, aparecerán aquí. También puedes crear una cita manual de prueba."
            action={
              <PrimaryButton
                type="button"
                onClick={() => { setFormError(""); setShowModal(true); }}
                variant="primary"
              >
                <Plus size={16} /> Crear reserva de prueba
              </PrimaryButton>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                updating={updating}
                onStatusChange={handleStatus}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* Próximas citas */}
      <SectionCard
        title="Próximas citas"
        description="Se muestran siempre, aunque haya citas en la fecha seleccionada."
      >
        {upcomingAppointments.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No hay próximas citas"
            description="Las reservas futuras aparecerán aquí con cliente, servicio, barbero, hora y estado. Comparte tu QR para empezar a recibirlas."
            action={
              <PrimaryButton href="/dashboard/qr" variant="primary">
                Ver QR de reservas
              </PrimaryButton>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                showDate
                updating={updating}
                onStatusChange={handleStatus}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* Modal nueva cita */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#D5CEBC] bg-[#F8F3EA] text-slate-950 shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-section">Agenda</p>
                  <h2 className="section-heading mt-0.5">Nueva cita</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl p-2 transition-colors hover:bg-[#FAF8F4]"
                >
                  <X size={18} />
                </button>
              </div>

              <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
                <input type="hidden" name="barbershop_id" value={barbershopId} />

                <div>
                  <label className="form-label">Cliente *</label>
                  <select
                    name="client_id"
                    required
                    className="select-field py-3"
                  >
                    <option value="">Seleccionar cliente...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}{c.phone ? ` · ${c.phone}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Servicio *</label>
                  <select
                    name="service_id"
                    required
                    className="select-field py-3"
                  >
                    <option value="">Seleccionar servicio...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {s.price} € · {s.duration_minutes} min
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Barbero</label>
                  <select
                    name="barber_id"
                    className="select-field py-3"
                  >
                    <option value="">Cualquiera / Sin asignar</option>
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="form-label">Fecha *</label>
                    <input
                      name="appointment_date"
                      type="date"
                      defaultValue={fecha}
                      required
                      className="input-field py-3"
                    />
                  </div>
                  <div>
                    <label className="form-label">Hora *</label>
                    <select
                      name="start_time"
                      required
                      className="select-field py-3"
                    >
                      <option value="">Hora...</option>
                      {slots.map((s) => (
                        <option key={s.time} value={s.time}>{s.time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Notas</label>
                  <input
                    name="notes"
                    placeholder="Ej: Trae referencia de foto"
                    className="input-field py-3"
                  />
                </div>

                {formError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <PrimaryButton
                    type="button"
                    onClick={() => setShowModal(false)}
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
                    {saving ? "Guardando..." : "Crear cita"}
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
