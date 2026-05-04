import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";

export const dynamic = "force-dynamic";

type Relation<T> = T | T[] | null | undefined;

type AppointmentItem = {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string | null;
  status: string;
  clients: { name: string; phone: string | null } | null;
  services: { name: string; price: number | null } | null;
  barbers: { name: string } | null;
};

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function getLocalDateISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(time?: string | null) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    scheduled: "Programada",
    confirmed: "Confirmada",
    completed: "Completada",
    cancelled: "Cancelada",
    no_show: "No apareció",
  };

  return labels[status] ?? status;
}

function statusClass(status: string) {
  const classes: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    scheduled: "bg-blue-50 text-blue-700 border-blue-100",
    confirmed: "bg-green-50 text-green-700 border-green-100",
    completed: "bg-neutral-100 text-neutral-700 border-neutral-200",
    cancelled: "bg-red-50 text-red-700 border-red-100",
    no_show: "bg-orange-50 text-orange-700 border-orange-100",
  };

  return classes[status] ?? "bg-neutral-100 text-neutral-700 border-neutral-200";
}

function normalizeAppointment(item: any): AppointmentItem {
  const client = firstRelation(item.clients);
  const service = firstRelation(item.services);
  const barber = firstRelation(item.barbers);

  return {
    id: item.id,
    appointment_date: item.appointment_date,
    start_time: item.start_time,
    end_time: item.end_time,
    status: item.status ?? "pending",
    clients: client
      ? {
          name: client.name ?? "Cliente sin nombre",
          phone: client.phone ?? null,
        }
      : null,
    services: service
      ? {
          name: service.name ?? "Servicio no definido",
          price: service.price ?? null,
        }
      : null,
    barbers: barber
      ? {
          name: barber.name ?? "Sin barbero",
        }
      : null,
  };
}

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);

  if (!barbershopId) {
    redirect("/onboarding");
  }

  const today = getLocalDateISO();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const dataClient =
    supabaseUrl && serviceRoleKey
      ? createServiceClient(supabaseUrl, serviceRoleKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        })
      : supabase;

  const [
    barbershopResult,
    todayAppointmentsResult,
    upcomingAppointmentsResult,
    clientsResult,
    servicesResult,
    paymentsResult,
  ] = await Promise.all([
    dataClient
      .from("barbershops")
      .select("id, name, slug")
      .eq("id", barbershopId)
      .maybeSingle(),

    dataClient
      .from("appointments")
      .select(
        `
        id,
        appointment_date,
        start_time,
        end_time,
        status,
        clients (
          name,
          phone
        ),
        services (
          name,
          price
        ),
        barbers (
          name
        )
      `
      )
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today)
      .in("status", ["pending", "scheduled", "confirmed"])
      .order("start_time", { ascending: true }),

    dataClient
      .from("appointments")
      .select(
        `
        id,
        appointment_date,
        start_time,
        end_time,
        status,
        clients (
          name,
          phone
        ),
        services (
          name,
          price
        ),
        barbers (
          name
        )
      `
      )
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", today)
      .in("status", ["pending", "scheduled", "confirmed"])
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(6),

    dataClient
      .from("clients")
      .select("id", { count: "exact" })
      .eq("barbershop_id", barbershopId),

    dataClient
      .from("services")
      .select("id", { count: "exact" })
      .eq("barbershop_id", barbershopId)
      .eq("active", true),

    dataClient
      .from("payments")
      .select("amount")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),
  ]);

  const barbershop = barbershopResult.data;
  const todayAppointments = ((todayAppointmentsResult.data as any[]) ?? []).map(
    normalizeAppointment
  );
  const upcomingAppointments = (
    (upcomingAppointmentsResult.data as any[]) ?? []
  ).map(normalizeAppointment);

  const totalClients = clientsResult.count ?? 0;
  const totalServices = servicesResult.count ?? 0;

  const todayRevenue = ((paymentsResult.data as any[]) ?? []).reduce(
    (total, payment) => total + Number(payment.amount ?? 0),
    0
  );

  const publicBookingUrl = `/r/${barbershop?.slug ?? "demo-barber"}`;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-neutral-950 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-400">
              Panel principal
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {barbershop?.name ?? "Tu barbería"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Gestiona reservas, clientes, servicios, barberos y pagos desde un
              solo lugar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/agenda"
              className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-neutral-950 hover:bg-neutral-100"
            >
              Ver agenda
            </Link>

            <Link
              href={publicBookingUrl}
              className="rounded-2xl border border-white/20 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/10"
            >
              Ver página pública
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Citas de hoy</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">
            {todayAppointments.length}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{today}</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Ingresos de hoy</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">
            {todayRevenue.toFixed(2)} €
          </p>
          <p className="mt-1 text-xs text-neutral-400">Pagos registrados</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Clientes</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">
            {totalClients}
          </p>
          <p className="mt-1 text-xs text-neutral-400">Total guardados</p>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Servicios activos</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">
            {totalServices}
          </p>
          <p className="mt-1 text-xs text-neutral-400">Disponibles online</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-neutral-950">
                Próximas citas
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                Reservas reales desde hoy en adelante.
              </p>
            </div>

            <Link
              href="/dashboard/agenda"
              className="rounded-2xl border border-neutral-200 px-4 py-2 text-center text-sm font-semibold hover:bg-neutral-50"
            >
              Abrir agenda
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <p className="font-semibold text-neutral-700">
                No hay próximas citas
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                Cuando un cliente reserve desde el QR o link público, aparecerá
                aquí.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              {upcomingAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="rounded-3xl border border-neutral-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-neutral-100 text-center">
                        <span className="text-[10px] font-semibold uppercase text-neutral-400">
                          {formatDate(appointment.appointment_date).split(" ")[1]}
                        </span>
                        <span className="text-lg font-black text-neutral-950">
                          {new Date(
                            appointment.appointment_date + "T00:00:00"
                          ).getDate()}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-neutral-950">
                          {appointment.clients?.name ?? "Cliente sin nombre"}
                        </p>

                        {appointment.clients?.phone && (
                          <p className="text-xs text-neutral-400">
                            {appointment.clients.phone}
                          </p>
                        )}

                        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                          <span>
                            {appointment.services?.name ??
                              "Servicio no definido"}
                          </span>
                          <span>·</span>
                          <span>
                            {appointment.barbers?.name ??
                              "Sin barbero asignado"}
                          </span>
                          <span>·</span>
                          <span>{formatTime(appointment.start_time)}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                        appointment.status
                      )}`}
                    >
                      {statusLabel(appointment.status)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black text-neutral-950">
            Link de reservas
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Comparte este enlace con clientes o úsalo en tu QR.
          </p>

          <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
            <p className="break-all text-sm font-semibold text-neutral-800">
              {publicBookingUrl}
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            <Link
              href="/dashboard/qr"
              className="rounded-2xl bg-neutral-950 px-5 py-3 text-center text-sm font-bold text-white hover:opacity-80"
            >
              Ver QR de reservas
            </Link>

            <Link
              href={publicBookingUrl}
              className="rounded-2xl border border-neutral-200 px-5 py-3 text-center text-sm font-bold hover:bg-neutral-50"
            >
              Abrir página pública
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}