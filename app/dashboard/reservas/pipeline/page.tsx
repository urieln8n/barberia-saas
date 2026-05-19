import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarClock, Check, MessageCircle, MoveRight, Phone, Scissors, UserRound, X } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { updatePipelineAppointmentStatus } from "./actions";

export const dynamic = "force-dynamic";

type Relation<T> = T | T[] | null | undefined;

type AppointmentRow = {
  id: string;
  appointment_date: string;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
  clients: Relation<{ name: string | null; phone: string | null }>;
  services: Relation<{ name: string | null; price: number | string | null }>;
  barbers: Relation<{ name: string | null }>;
};

const columns = [
  { id: "received", title: "Solicitud recibida", statuses: ["pending"] },
  { id: "pending", title: "Pendiente de confirmar", statuses: ["scheduled"] },
  { id: "confirmed", title: "Confirmada", statuses: ["confirmed"] },
  { id: "in_progress", title: "En curso", statuses: [] },
  { id: "completed", title: "Completada", statuses: ["completed"] },
  { id: "cancelled", title: "Cancelada", statuses: ["cancelled"] },
  { id: "no_show", title: "No asistio", statuses: ["no_show"] },
  { id: "reschedule", title: "Reprogramar", statuses: [] },
];

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
}

function whatsappHref(phone: string | null, name: string) {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (!digits) return null;
  const message = encodeURIComponent(`Hola ${name}, te escribimos de la barberia sobre tu cita.`);
  return `https://wa.me/${digits}?text=${message}`;
}

function StatusButton({ appointmentId, status, children }: { appointmentId: string; status: string; children: React.ReactNode }) {
  return (
    <form action={updatePipelineAppointmentStatus}>
      <input type="hidden" name="appointment_id" value={appointmentId} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E7E2D8] bg-white text-neutral-500 transition hover:border-[#C9922A]/40 hover:bg-[#C9922A]/5 hover:text-[#8A641F]"
      >
        {children}
      </button>
    </form>
  );
}

export default async function PipelineReservasPage() {
  const authClient = await createServerClient();
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(authClient, user.id);
  if (!barbershopId) redirect("/onboarding");

  const supabase = createServiceRoleClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      start_time,
      end_time,
      status,
      clients ( name, phone ),
      services ( name, price ),
      barbers ( name )
    `,
    )
    .eq("barbershop_id", barbershopId)
    .gte("appointment_date", today)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(120);

  const appointments = ((data ?? []) as AppointmentRow[]).map((appointment) => ({
    ...appointment,
    client: firstRelation(appointment.clients),
    service: firstRelation(appointment.services),
    barber: firstRelation(appointment.barbers),
  }));

  const countByStatus = new Map<string, number>();
  for (const appointment of appointments) {
    const status = appointment.status ?? "scheduled";
    countByStatus.set(status, (countByStatus.get(status) ?? 0) + 1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        section="Pipeline de citas"
        title="Reservas como flujo operativo"
        description="Gestiona cada cita como una oportunidad: confirmar, completar, recuperar no-shows y abrir WhatsApp sin salir del panel."
        action={
          <Link href="/dashboard/agenda" className="btn-outline">
            Abrir agenda <MoveRight size={14} />
          </Link>
        }
      />

      {appointmentsError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          No se pudo leer el pipeline: {appointmentsError.message}
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Pendientes", (countByStatus.get("pending") ?? 0) + (countByStatus.get("scheduled") ?? 0)],
          ["Confirmadas", countByStatus.get("confirmed") ?? 0],
          ["Completadas", countByStatus.get("completed") ?? 0],
          ["No asistio", countByStatus.get("no_show") ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#080A0F]">{value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-x-auto pb-3">
        <div className="grid min-w-[1180px] grid-cols-8 gap-3">
          {columns.map((column) => {
            const columnAppointments = appointments.filter((appointment) => column.statuses.includes(appointment.status ?? "scheduled"));
            return (
              <div key={column.id} className="rounded-2xl border border-[#E7E2D8] bg-[#F8F5EF] p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-black text-[#111827]">{column.title}</h2>
                  <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-neutral-500">
                    {columnAppointments.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnAppointments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#E7E2D8] bg-white/60 p-4 text-center text-xs font-semibold leading-5 text-neutral-400">
                      Sin citas en esta columna.
                    </div>
                  ) : (
                    columnAppointments.map((appointment) => {
                      const clientName = appointment.client?.name ?? "Cliente sin nombre";
                      const phone = appointment.client?.phone ?? null;
                      const wa = whatsappHref(phone, clientName);

                      return (
                        <article key={appointment.id} className="rounded-2xl border border-[#E7E2D8] bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-black text-[#111827]">{clientName}</p>
                              <p className="mt-1 text-xs font-semibold text-neutral-500">
                                {formatDate(appointment.appointment_date)} · {(appointment.start_time ?? "").slice(0, 5) || "--:--"}
                              </p>
                            </div>
                            <CalendarClock size={16} className="shrink-0 text-[#C9922A]" />
                          </div>

                          <div className="mt-3 space-y-1.5 text-xs text-neutral-500">
                            <p className="flex items-center gap-1.5"><Scissors size={12} /> {appointment.service?.name ?? "Servicio"}</p>
                            <p className="flex items-center gap-1.5"><UserRound size={12} /> {appointment.barber?.name ?? "Sin barbero"}</p>
                            <p className="flex items-center gap-1.5"><Phone size={12} /> {phone ?? "Sin telefono"}</p>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-black text-[#111827]">
                              {formatCurrency(appointment.service?.price)}
                            </span>
                            <div className="flex gap-1">
                              <StatusButton appointmentId={appointment.id} status="confirmed"><Check size={14} /></StatusButton>
                              <StatusButton appointmentId={appointment.id} status="completed"><Scissors size={14} /></StatusButton>
                              <StatusButton appointmentId={appointment.id} status="no_show"><X size={14} /></StatusButton>
                              {wa && (
                                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                                  <MessageCircle size={14} />
                                </a>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
