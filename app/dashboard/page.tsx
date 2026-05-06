import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import {
  CalendarCheck,
  TrendingUp,
  Users,
  AlertCircle,
  QrCode,
  ArrowRight,
  Scissors,
  User,
  CreditCard,
} from "lucide-react";
import { StatCard }   from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/dashboard/empty-state";

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

function getWeekStartISO() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
}

function getMonthBoundsISO(): { start: string; end: string } {
  const now = new Date();
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
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
  const weekStart = getWeekStartISO();
  const { start: monthStart, end: monthEnd } = getMonthBoundsISO();

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
    monthApptsResult,
    monthPaymentsResult,
    newClientsResult,
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

    dataClient
      .from("appointments")
      .select("appointment_date, start_time, status, services(name), barbers(name)")
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", monthStart)
      .lte("appointment_date", monthEnd),

    dataClient
      .from("payments")
      .select("amount")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${monthStart}T00:00:00`)
      .lte("created_at", `${monthEnd}T23:59:59`),

    dataClient
      .from("clients")
      .select("id", { count: "exact" })
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${monthStart}T00:00:00`),
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

  // ── Stats derivadas del mes ──
  const monthAppts = (monthApptsResult.data as any[]) ?? [];
  const weekApptsCount = monthAppts.filter(
    (a: any) => a.appointment_date >= weekStart
  ).length;
  const monthApptsCount = monthAppts.length;
  const cancelledCount = monthAppts.filter(
    (a: any) => a.status === "cancelled" || a.status === "no_show"
  ).length;

  const monthRevenue = ((monthPaymentsResult.data as any[]) ?? []).reduce(
    (sum: number, p: any) => sum + Number(p.amount ?? 0),
    0
  );
  const newClientsCount = newClientsResult.count ?? 0;

  const serviceCount: Record<string, number> = {};
  for (const a of monthAppts) {
    if (a.status !== "cancelled" && a.status !== "no_show") {
      const svc = Array.isArray(a.services) ? a.services[0] : a.services;
      const name: string = svc?.name ?? "Sin servicio";
      serviceCount[name] = (serviceCount[name] ?? 0) + 1;
    }
  }
  const topServiceEntry = Object.entries(serviceCount).sort((x, y) => y[1] - x[1])[0];
  const topServiceName = topServiceEntry?.[0] ?? "—";
  const topServiceCount = topServiceEntry?.[1] ?? 0;

  const barberCount: Record<string, number> = {};
  for (const a of monthAppts) {
    if (a.status !== "cancelled" && a.status !== "no_show") {
      const brb = Array.isArray(a.barbers) ? a.barbers[0] : a.barbers;
      const name: string = brb?.name ?? "Sin barbero";
      barberCount[name] = (barberCount[name] ?? 0) + 1;
    }
  }
  const topBarberEntry = Object.entries(barberCount).sort((x, y) => y[1] - x[1])[0];
  const topBarberName = topBarberEntry?.[0] ?? "—";
  const topBarberCount = topBarberEntry?.[1] ?? 0;

  return (
    <div className="space-y-5">

      {/* ── Hero ── */}
      <section className="overflow-hidden rounded-3xl bg-[#0D0D0D] text-white shadow-lg">
        <div className="h-px w-full bg-gradient-to-r from-[#C89B3C]/60 via-[#00C2A8] to-[#C89B3C]/60" />
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Panel principal</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {barbershop?.name ?? "Tu barbería"}
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Gestiona citas, clientes, servicios, barberos y pagos — todo desde aquí.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/dashboard/agenda"
              className="rounded-2xl bg-[#00C2A8] px-5 py-3 text-center text-sm font-bold text-[#0D0D0D] transition-colors hover:bg-[#009e88]"
            >
              Ver agenda hoy
            </Link>
            <Link
              href="/dashboard/qr"
              className="rounded-2xl border border-white/15 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Ver QR de reservas
            </Link>
            <Link
              href={publicBookingUrl}
              target="_blank"
              className="rounded-2xl border border-white/15 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Página pública ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── KPI Cards ── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Citas hoy"
          value={String(todayAppointments.length)}
          hint={`${weekApptsCount} esta semana`}
          icon={CalendarCheck}
          iconBg="bg-[#00C2A8]/10"
          iconColor="text-[#00C2A8]"
        />
        <StatCard
          title="Ingresos hoy"
          value={`${todayRevenue.toFixed(0)} €`}
          hint={`${monthRevenue.toFixed(0)} € este mes`}
          icon={TrendingUp}
          iconBg="bg-[#C89B3C]/10"
          iconColor="text-[#C89B3C]"
        />
        <StatCard
          title="Clientes"
          value={String(totalClients)}
          hint={`+${newClientsCount} nuevos este mes`}
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          title="No shows · Canceladas"
          value={String(cancelledCount)}
          hint="Este mes"
          icon={AlertCircle}
          iconBg={cancelledCount > 0 ? "bg-red-50" : "bg-neutral-100"}
          iconColor={cancelledCount > 0 ? "text-[#E5484D]" : "text-neutral-400"}
        />
      </section>

      {/* ── Stats del mes ── */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Citas este mes</p>
          <p className="mt-3 text-4xl font-black text-[#0D0D0D]">{monthApptsCount}</p>
          <p className="mt-1.5 text-xs text-neutral-400">
            {monthApptsCount - cancelledCount} completadas · {cancelledCount} canceladas
          </p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Servicio top</p>
          <p className="mt-3 truncate text-xl font-black leading-tight text-[#0D0D0D]">{topServiceName}</p>
          <p className="mt-1.5 text-xs text-neutral-400">
            {topServiceCount > 0 ? `${topServiceCount} citas este mes` : "Sin datos aún"}
          </p>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Barbero top</p>
          <p className="mt-3 truncate text-xl font-black leading-tight text-[#0D0D0D]">{topBarberName}</p>
          <p className="mt-1.5 text-xs text-neutral-400">
            {topBarberCount > 0 ? `${topBarberCount} citas este mes` : "Sin datos aún"}
          </p>
        </div>
      </section>

      {/* ── Próximas citas + Panel lateral ── */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

        {/* Próximas citas */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-[#0D0D0D]">Próximas citas</h2>
              <p className="text-sm text-neutral-500">Reservas activas desde hoy.</p>
            </div>
            <Link
              href="/dashboard/agenda"
              className="flex items-center gap-1.5 rounded-2xl border border-[#E5E2D9] px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-[#F5F2EA]"
            >
              Abrir agenda <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="Sin citas próximas"
              description="Comparte tu QR o link para recibir reservas."
              action={
                <Link
                  href="/dashboard/qr"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
                >
                  <QrCode size={15} /> Ver QR de reservas
                </Link>
              }
            />
          ) : (
            <div className="mt-4 flex flex-col gap-2.5">
              {upcomingAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="flex items-start gap-3 rounded-2xl border border-[#E5E2D9] bg-[#F5F2EA]/50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#0D0D0D] text-center">
                    <span className="text-[9px] font-bold uppercase text-[#C89B3C]">
                      {new Date(appointment.appointment_date + "T00:00:00").toLocaleDateString("es-ES", { month: "short" })}
                    </span>
                    <span className="text-base font-black text-white">
                      {new Date(appointment.appointment_date + "T00:00:00").getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold leading-tight text-[#0D0D0D]">
                        {appointment.clients?.name ?? "Cliente sin nombre"}
                      </p>
                      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass(appointment.status)}`}>
                        {statusLabel(appointment.status)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {appointment.services?.name ?? "—"} · {appointment.barbers?.name ?? "Sin barbero"} · {formatTime(appointment.start_time)}
                    </p>
                    {appointment.clients?.phone && (
                      <p className="mt-0.5 text-xs text-neutral-400">{appointment.clients.phone}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="flex flex-col gap-4">

          {/* Link de reservas */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-neutral-400">Tu link de reservas</p>
            <p className="mt-2 text-sm text-neutral-600">
              Compártelo en Instagram, WhatsApp, Google o imprímelo en un QR para tu local.
            </p>
            <div className="mt-4 rounded-2xl border border-[#E5E2D9] bg-[#F5F2EA] px-4 py-3">
              <p className="break-all font-mono text-xs font-semibold text-neutral-700">
                {typeof window !== "undefined" ? window.location.origin : "https://barberiaos.com"}{publicBookingUrl}
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <Link
                href="/dashboard/qr"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#0D0D0D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1A1A1A]"
              >
                <QrCode size={15} /> Ver y descargar QR
              </Link>
              <Link
                href={publicBookingUrl}
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#E5E2D9] px-5 py-3 text-sm font-bold text-neutral-700 transition-colors hover:bg-[#F5F2EA]"
              >
                Abrir página pública <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-neutral-400">Acciones rápidas</p>
            <div className="mt-3 grid gap-1">
              {[
                { href: "/dashboard/clientes",  label: "Clientes",  icon: Users      },
                { href: "/dashboard/servicios", label: "Servicios", icon: Scissors   },
                { href: "/dashboard/pagos",     label: "Pagos",     icon: CreditCard },
                { href: "/dashboard/barberos",  label: "Barberos",  icon: User       },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-[#F5F2EA] hover:text-[#0D0D0D]"
                >
                  <Icon size={15} className="shrink-0 text-neutral-400" />
                  {label}
                  <span className="ml-auto text-neutral-300">→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}