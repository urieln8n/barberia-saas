"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, CalendarDays, Clock, User, Scissors } from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import { createAppointment, updateAppointmentStatus } from "./actions";
import { PageHeader }  from "@/components/dashboard/PageHeader";
import { EmptyState }  from "@/components/dashboard/empty-state";

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

const STATUS_COLOR: Record<string, string> = {
  pending:   "bg-amber-50 text-amber-700 border border-amber-100",
  scheduled: "bg-amber-50 text-amber-700 border border-amber-100",
  confirmed: "bg-blue-50  text-blue-700  border border-blue-100",
  completed: "bg-green-50 text-green-700 border border-green-100",
  cancelled: "bg-red-50   text-red-700   border border-red-100",
  no_show:   "bg-red-50   text-red-700   border border-red-100",
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
    <div className="panel">
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
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-sm font-black text-[#111827]">
              {formatTime(appointment.start_time)}
            </div>
          )}

          <div className="min-w-0">
            <p className="font-bold text-[#111827]">
              {appointment.clients?.name ?? "Cliente sin nombre"}
            </p>

            <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
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
              <p className="mt-1 text-xs text-neutral-400">
                Fecha: {formatDate(appointment.appointment_date)}
              </p>
            )}
            {appointment.clients?.phone && (
              <p className="mt-1 text-xs text-neutral-400">Tel: {appointment.clients.phone}</p>
            )}
            {appointment.notes && (
              <p className="mt-1 text-xs text-neutral-400">{appointment.notes}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_COLOR[appointment.status] ?? "bg-neutral-100 text-neutral-600 border border-neutral-200"
          }`}>
            {STATUS_LABEL[appointment.status] ?? appointment.status}
          </span>

          {NEXT_ACTIONS[appointment.status]?.map((action) => (
            <button
              key={action.status}
              onClick={() => onStatusChange(appointment.id, action.status)}
              disabled={updating === appointment.id}
              className="rounded-xl border border-[#E5E7EB] px-3 py-1 text-xs font-semibold transition-colors hover:bg-[#F8FAFC] hover:text-[#111827] disabled:opacity-40"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
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

  return (
    <div className="space-y-5">

      <PageHeader
        section="Agenda"
        title="Citas del día"
        description={`${allAppointments.length} citas registradas en total.`}
        action={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="date"
              value={fecha}
              onChange={(e) => handleDateChange(e.target.value)}
              className="input"
            />
            <button
              type="button"
              onClick={() => { setFormError(""); setShowModal(true); }}
              className="btn-dark"
            >
              <Plus size={16} /> Nueva cita
            </button>
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
        {[
          { title: "Citas hoy",          value: appointments.length         },
          { title: "Próximas citas",     value: upcomingAppointments.length },
          { title: "Total registradas",  value: allAppointments.length      },
          { title: "Pendientes",         value: pendingCount                },
        ].map(({ title, value }) => (
          <div key={title} className="metric-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{title}</p>
            <p className="mt-3 text-4xl font-black text-[#111827]">{value}</p>
          </div>
        ))}
      </div>

      {/* Citas de la fecha seleccionada */}
      <section>
        <div className="mb-3">
          <p className="label-section">Fecha seleccionada</p>
          <h2 className="section-heading mt-0.5">Citas del {fecha}</h2>
        </div>
        {appointments.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Sin citas para este día"
            description="Crea una nueva cita o selecciona otra fecha."
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
      </section>

      {/* Próximas citas */}
      <section>
        <div className="mb-3">
          <p className="label-section">Agenda futura</p>
          <h2 className="section-heading mt-0.5">Próximas citas</h2>
          <p className="text-sm text-neutral-500">
            Se muestran siempre, aunque haya citas en la fecha seleccionada.
          </p>
        </div>
        {upcomingAppointments.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No hay próximas citas"
            description="Cuando entren nuevas reservas futuras, aparecerán aquí."
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
      </section>

      {/* Modal nueva cita */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-section">Agenda</p>
                  <h2 className="section-heading mt-0.5">Nueva cita</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl p-2 transition-colors hover:bg-[#F8FAFC]"
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
                    className="input py-3"
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
                    className="input py-3"
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
                    className="input py-3"
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
                      className="input py-3"
                    />
                  </div>
                  <div>
                    <label className="form-label">Hora *</label>
                    <select
                      name="start_time"
                      required
                      className="input py-3"
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
                    className="input py-3"
                  />
                </div>

                {formError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-dark flex-1"
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
