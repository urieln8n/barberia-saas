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
    pending:   "bg-amber-50 text-amber-700 border-amber-100",
    scheduled: "bg-amber-50 text-amber-700 border-amber-100",
    confirmed: "bg-blue-50  text-blue-700  border-blue-100",
    completed: "bg-green-50 text-green-700 border-green-100",
    cancelled: "bg-red-50   text-red-700   border-red-100",
    no_show:   "bg-red-50   text-red-700   border-red-100",
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
    <div className="space-y-6">

      {/* ── Hero ── */}
      <section className="overflow-hidden rounded-3xl bg-neutral-950 text-white shadow-lg">
        <div className="h-1 w-full bg-gradient-to-r from-[#8E1F2D] via-[#6B1622] to-[#C6A969]" />
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#C6A969]">Panel principal</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {barbershop?.name ?? "Tu barbería"}
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Gestiona citas, clientes, servicios, barberos y pagos — todo desde aquí.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/agenda"
              className="rounded-2xl bg-[#8E1F2D] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#6B1622]"
            >
              Ver agenda hoy
            </Link>
            <Link
              href="/dashboard/qr"
              className="rounded-2xl border border-white/15 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/10"
            >
              Ver QR de reservas
            </Link>
            <Link
              href={publicBookingUrl}
              target="_blank"
              className="rounded-2xl border border-white/15 px-5 py-3 text-center text-sm font-bold text-white hover:bg-white/10"
            >
              Página pública ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── Métricas ── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Citas hoy</p>
          <p className="mt-3 text-4xl font-black text-neutral-950">{todayAppointments.length}</p>
          <p className="mt-1 text-xs text-neutral-400">{today}</p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Ingresos hoy</p>
          <p className="mt-3 text-4xl font-black text-neutral-950">{todayRevenue.toFixed(0)} €</p>
          <p className="mt-1 text-xs text-neutral-400">Pagos registrados</p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Clientes</p>
          <p className="mt-3 text-4xl font-black text-neutral-950">{totalClients}</p>
          <p className="mt-1 text-xs text-neutral-400">Total en CRM</p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Servicios</p>
          <p className="mt-3 text-4xl font-black text-neutral-950">{totalServices}</p>
          <p className="mt-1 text-xs text-neutral-400">Disponibles online</p>
        </div>
      </section>

      {/* ── Próximas citas + Link ── */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* Próximas citas */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-neutral-950">Próximas citas</h2>
              <p className="text-sm text-neutral-500">Reservas activas desde hoy.</p>
            </div>
            <Link
              href="/dashboard/agenda"
              className="rounded-2xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Abrir agenda →
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
              <p className="font-semibold text-neutral-600">Sin citas próximas</p>
              <p className="mt-1 text-sm text-neutral-400">
                Comparte tu QR o link para recibir reservas.
              </p>
              <Link
                href="/dashboard/qr"
                className="mt-4 inline-flex items-center gap-1 rounded-full bg-neutral-950 px-4 py-2 text-xs font-bold text-white hover:opacity-80"
              >
                Ver QR de reservas
              </Link>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-3">
              {upcomingAppointments.map((appointment) => (
                <article key={appointment.id} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-white text-center shadow-sm">
                        <span className="text-[9px] font-bold uppercase text-neutral-400">
                          {new Date(appointment.appointment_date + "T00:00:00").toLocaleDateString("es-ES", { month: "short" })}
                        </span>
                        <span className="text-base font-black text-neutral-950">
                          {new Date(appointment.appointment_date + "T00:00:00").getDate()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-neutral-950 leading-tight">
                          {appointment.clients?.name ?? "Cliente sin nombre"}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {appointment.services?.name ?? "—"} · {appointment.barbers?.name ?? "Sin barbero"} · {formatTime(appointment.start_time)}
                        </p>
                        {appointment.clients?.phone && (
                          <p className="mt-0.5 text-xs text-neutral-400">{appointment.clients.phone}</p>
                        )}
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(appointment.status)}`}>
                      {statusLabel(appointment.status)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Link de reservas */}
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">Tu link de reservas</p>
            <p className="mt-2 text-sm text-neutral-600">
              Compártelo en Instagram, WhatsApp, Google o imprímelo en un QR para tu local.
            </p>
            <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <p className="break-all font-mono text-xs font-semibold text-neutral-700">
                {typeof window !== "undefined" ? window.location.origin : "https://barberiaos.com"}{publicBookingUrl}
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <Link
                href="/dashboard/qr"
                className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white hover:opacity-80"
              >
                Ver y descargar QR
              </Link>
              <Link
                href={publicBookingUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
              >
                Abrir página pública ↗
              </Link>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">Acciones rápidas</p>
            <div className="mt-3 grid gap-2">
              {[
                { href: "/dashboard/clientes",  label: "Clientes"  },
                { href: "/dashboard/servicios", label: "Servicios" },
                { href: "/dashboard/pagos",     label: "Pagos"     },
                { href: "/dashboard/barberos",  label: "Barberos"  },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  {label} <span className="text-neutral-300">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}