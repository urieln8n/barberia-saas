"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, CalendarDays, Clock, User, Scissors } from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import { createAppointment, updateAppointmentStatus } from "./actions";

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

type Client = { id: string; name: string; phone: string | null };
type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};
type Barber = { id: string; name: string };

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
  pending: "Por confirmar",
  scheduled: "Pendiente",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No apareció",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  scheduled: "bg-neutral-100 text-neutral-600 border border-neutral-200",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-100",
  completed: "bg-green-50 text-green-700 border border-green-100",
  cancelled: "bg-red-50 text-red-500 border border-red-100",
  no_show: "bg-orange-50 text-orange-600 border border-orange-100",
};

const NEXT_ACTIONS: Record<string, { label: string; status: string }[]> = {
  pending: [
    { label: "Confirmar", status: "confirmed" },
    { label: "Cancelar", status: "cancelled" },
  ],
  scheduled: [
    { label: "Confirmar", status: "confirmed" },
    { label: "Cancelar", status: "cancelled" },
  ],
  confirmed: [
    { label: "Completar", status: "completed" },
    { label: "No apareció", status: "no_show" },
    { label: "Cancelar", status: "cancelled" },
  ],
  completed: [],
  cancelled: [],
  no_show: [],
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
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-neutral-100 text-sm font-bold">
            {showDate ? (
              <>
                <span className="text-[10px] font-semibold uppercase text-neutral-400">
                  {new Date(
                    appointment.appointment_date + "T00:00:00"
                  ).toLocaleDateString("es-ES", { month: "short" })}
                </span>
                <span className="text-sm font-black">
                  {new Date(
                    appointment.appointment_date + "T00:00:00"
                  ).getDate()}
                </span>
              </>
            ) : (
              formatTime(appointment.start_time)
            )}
          </div>

          <div className="min-w-0">
            <p className="font-bold text-neutral-950">
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
                {appointment.end_time
                  ? `–${formatTime(appointment.end_time)}`
                  : ""}
              </span>
            </p>

            {showDate && (
              <p className="mt-1 text-xs text-neutral-400">
                Fecha: {formatDate(appointment.appointment_date)}
              </p>
            )}

            {appointment.clients?.phone && (
              <p className="mt-1 text-xs text-neutral-400">
                Tel: {appointment.clients.phone}
              </p>
            )}

            {appointment.notes && (
              <p className="mt-1 text-xs text-neutral-400">
                {appointment.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              STATUS_COLOR[appointment.status] ??
              "bg-neutral-100 text-neutral-600 border border-neutral-200"
            }`}
          >
            {STATUS_LABEL[appointment.status] ?? appointment.status}
          </span>

          {NEXT_ACTIONS[appointment.status]?.map((action) => (
            <button
              key={action.status}
              onClick={() => onStatusChange(appointment.id, action.status)}
              disabled={updating === appointment.id}
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold hover:bg-neutral-100 disabled:opacity-40"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center">
      <CalendarDays className="mx-auto mb-3 text-neutral-300" size={36} />
      <p className="font-semibold text-neutral-600">{title}</p>
      <p className="mt-1 text-sm text-neutral-400">{text}</p>
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
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const slots = generateTimeSlots(9, 20, 30);

  function handleDateChange(date: string) {
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

    await updateAppointmentStatus(id, status);

    setUpdating(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-neutral-500">Panel de control</p>
          <h1 className="text-4xl font-black">Agenda</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {allAppointments.length} citas registradas en total.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="date"
            value={fecha}
            onChange={(event) => handleDateChange(event.target.value)}
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />

          <button
            onClick={() => {
              setFormError("");
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:opacity-80"
          >
            <Plus size={16} /> Nueva cita
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error leyendo agenda: {errorMessage}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Citas en esta fecha</p>
          <p className="mt-2 text-3xl font-black">{appointments.length}</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Próximas citas</p>
          <p className="mt-2 text-3xl font-black">
            {upcomingAppointments.length}
          </p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total registradas</p>
          <p className="mt-2 text-3xl font-black">{allAppointments.length}</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Pendientes</p>
          <p className="mt-2 text-3xl font-black">
            {
              allAppointments.filter(
                (appointment) =>
                  appointment.status === "pending" ||
                  appointment.status === "scheduled"
              ).length
            }
          </p>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-xl font-black">Citas de la fecha seleccionada</h2>
          <p className="text-sm text-neutral-500">{fecha}</p>
        </div>

        {appointments.length === 0 ? (
          <EmptyState
            title="Sin citas para este día"
            text="Crea una nueva cita o selecciona otra fecha."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                updating={updating}
                onStatusChange={handleStatus}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-3">
          <h2 className="text-xl font-black">Próximas citas</h2>
          <p className="text-sm text-neutral-500">
            Se muestran siempre, aunque haya citas en la fecha seleccionada.
          </p>
        </div>

        {upcomingAppointments.length === 0 ? (
          <EmptyState
            title="No hay próximas citas"
            text="Cuando entren nuevas reservas futuras, aparecerán aquí."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showDate
                updating={updating}
                onStatusChange={handleStatus}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-3">
          <h2 className="text-xl font-black">Todas las citas registradas</h2>
          <p className="text-sm text-neutral-500">
            Esta sección sirve para comprobar que la agenda está leyendo
            Supabase correctamente.
          </p>
        </div>

        {allAppointments.length === 0 ? (
          <EmptyState
            title="Todavía no hay citas registradas"
            text="Crea una reserva desde el enlace público de la barbería."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {allAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showDate
                updating={updating}
                onStatusChange={handleStatus}
              />
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Nueva cita</h2>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <form action={handleSubmit} className="mt-6 flex flex-col gap-4">
              <input type="hidden" name="barbershop_id" value={barbershopId} />

              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Cliente *
                </label>

                <select
                  name="client_id"
                  required
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                      {client.phone ? ` · ${client.phone}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Servicio *
                </label>

                <select
                  name="service_id"
                  required
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
                >
                  <option value="">Seleccionar servicio...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} · {service.price} € ·{" "}
                      {service.duration_minutes} min
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Barbero
                </label>

                <select
                  name="barber_id"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
                >
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
                  <label className="mb-1 block text-sm font-semibold text-neutral-700">
                    Fecha *
                  </label>

                  <input
                    name="appointment_date"
                    type="date"
                    defaultValue={fecha}
                    required
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-neutral-700">
                    Hora *
                  </label>

                  <select
                    name="start_time"
                    required
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
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
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Notas
                </label>

                <input
                  name="notes"
                  placeholder="Ej: Trae referencia de foto"
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-900"
                />
              </div>

              {formError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl border border-neutral-200 py-3 text-sm font-semibold hover:bg-neutral-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-neutral-950 py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Crear cita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}