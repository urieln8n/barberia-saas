import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildBarberPerformance } from "@/src/lib/cash/barber-performance";
import { buildTodayBarberAvailability } from "@/src/lib/booking/barber-availability";
import {
  CalendarCheck,
  TrendingUp,
  Users,
  AlertCircle,
  Clock,
  Wallet,
  QrCode,
  ArrowRight,
  Scissors,
  User,
  CreditCard,
} from "lucide-react";
import { StatCard }   from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BarberPerformance } from "@/components/dashboard/BarberPerformance";
import { TodayAvailability } from "@/components/dashboard/TodayAvailability";

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

type CashMovementPerformanceRow = {
  amount: number | string | null;
  discount_amount: number | string | null;
  tip_amount: number | string | null;
  payment_method: string | null;
  movement_type: string | null;
  barber_id: string | null;
  client_id: string | null;
  service_id: string | null;
  services?: Relation<{ name: string | null }>;
};

type TodayAvailabilityAppointmentRow = {
  barber_id: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string | null;
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

function formatCurrency(value: number) {
  return `${value.toFixed(0)} €`;
}

function cashMovementTotal(movement: CashMovementPerformanceRow) {
  const amount = Number(movement.amount ?? 0);
  const discount = Number(movement.discount_amount ?? 0);
  const tip = Number(movement.tip_amount ?? 0);
  const total = amount - discount + tip;

  if (movement.movement_type === "refund" || movement.movement_type === "expense") {
    return -total;
  }

  return total;
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
    paymentsResult,
    monthApptsResult,
    activeBarbersResult,
    todayCashMovementsResult,
    activeCashSessionResult,
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
        barber_id,
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
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),

    dataClient
      .from("cash_movements")
      .select(
        "amount, discount_amount, tip_amount, payment_method, movement_type, barber_id, client_id, service_id, services(name)"
      )
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),

    dataClient
      .from("cash_sessions")
      .select("id, status, opening_amount, opened_at")
      .eq("barbershop_id", barbershopId)
      .eq("status", "open")
      .order("opened_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const barbershop = barbershopResult.data;
  const todayAppointments = ((todayAppointmentsResult.data as any[]) ?? []).map(
    normalizeAppointment
  );
  const upcomingAppointments = (
    (upcomingAppointmentsResult.data as any[]) ?? []
  ).map(normalizeAppointment);

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
  const todayCashMovements = ((todayCashMovementsResult.data as CashMovementPerformanceRow[]) ?? []);
  const todayPaymentMovements = todayCashMovements.filter(
    (movement) => movement.movement_type === "payment"
  );
  const cashSalesToday = todayPaymentMovements.reduce(
    (sum, movement) => sum + cashMovementTotal(movement),
    0
  );
  const salesToday = cashSalesToday > 0 ? cashSalesToday : todayRevenue;
  const attendedClientIds = new Set(
    todayPaymentMovements
      .map((movement) => movement.client_id)
      .filter((clientId): clientId is string => Boolean(clientId))
  );
  const anonymousPayments = todayPaymentMovements.filter((movement) => !movement.client_id).length;
  const clientsAttendedToday = attendedClientIds.size + anonymousPayments;
  const cashPaymentsCount = todayPaymentMovements.filter(
    (movement) => movement.payment_method === "cash"
  ).length;
  const barberPerformanceItems = buildBarberPerformance(
    ((activeBarbersResult.data as { id: string; name: string }[]) ?? []).map((barber) => ({
      id: barber.id,
      name: barber.name,
    })),
    ((todayCashMovementsResult.data as CashMovementPerformanceRow[]) ?? []).map((movement) => ({
      amount: movement.amount,
      discount_amount: movement.discount_amount,
      tip_amount: movement.tip_amount,
      payment_method: movement.payment_method,
      movement_type: movement.movement_type,
      barber_id: movement.barber_id,
      client_id: movement.client_id,
      service_id: movement.service_id,
    }))
  );
  const activeBarbers = ((activeBarbersResult.data as { id: string; name: string }[]) ?? []).map((barber) => ({
    id: barber.id,
    name: barber.name,
  }));
  const todayAvailabilityItems = buildTodayBarberAvailability({
    barbers: activeBarbers,
    appointments: ((todayAppointmentsResult.data as TodayAvailabilityAppointmentRow[]) ?? []).map((appointment) => ({
      barber_id: appointment.barber_id,
      start_time: appointment.start_time,
      end_time: appointment.end_time,
      status: appointment.status,
    })),
    todayIso: today,
    startHour: 9,
    endHour: 20,
    intervalMinutes: 30,
  });
  const totalFreeSlotsToday = todayAvailabilityItems.reduce(
    (sum, item) => sum + item.freeSlots.length,
    0
  );
  const cashSessionOpen = Boolean(activeCashSessionResult.data);
  const topDailyBarber = barberPerformanceItems.find((item) => item.totalSold > 0);
  const barberWithMostSlots = todayAvailabilityItems.reduce(
    (top, item) => (!top || item.freeSlots.length > top.freeSlots.length ? item : top),
    null as (typeof todayAvailabilityItems)[number] | null
  );
  const serviceSalesCount: Record<string, number> = {};
  for (const movement of todayPaymentMovements) {
    const service = firstRelation(movement.services);
    const name = service?.name ?? (movement.service_id ? "Servicio sin nombre" : "");
    if (name) serviceSalesCount[name] = (serviceSalesCount[name] ?? 0) + 1;
  }
  const topServiceToday = Object.entries(serviceSalesCount).sort((a, b) => b[1] - a[1])[0];
  const topServiceTodayName = topServiceToday?.[0] ?? "Sin ventas";
  const topServiceTodayCount = topServiceToday?.[1] ?? 0;
  const recommendedActions = [
    barberWithMostSlots && barberWithMostSlots.freeSlots.length > 0
      ? `${barberWithMostSlots.barberName} tiene ${barberWithMostSlots.freeSlots.length} huecos libres hoy. Publica una promo.`
      : "La agenda de hoy está bastante completa. Revisa próximas citas.",
    `${clientsAttendedToday} clientes atendidos y ${cashPaymentsCount} pagos en efectivo registrados hoy.`,
    cashSessionOpen
      ? "Cierra caja al final del día para evitar descuadres."
      : "Abre caja antes de registrar cobros para controlar el efectivo.",
  ];

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <section className="section-band overflow-hidden">
        <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C89B3C]/20 bg-[#C89B3C]/10 px-3 py-1 text-xs font-bold text-[#8A641F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
              Panel principal
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#111111] md:text-4xl">
              {barbershop?.name ?? "Tu barbería"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Controla la agenda de hoy, próximos clientes, cobros y canales de reserva desde una vista clara para operar rápido.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[440px]">
            <Link
              href="/dashboard/agenda"
              className="btn-dark"
            >
              Ver agenda hoy
            </Link>
            <Link
              href="/dashboard/qr"
              className="btn-outline"
            >
              Ver QR de reservas
            </Link>
            <Link
              href={publicBookingUrl}
              target="_blank"
              className="btn-outline"
            >
              Página pública <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Control diario ── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ventas hoy"
          value={formatCurrency(salesToday)}
          hint={cashSalesToday > 0 ? "Desde caja" : "Desde pagos"}
          icon={TrendingUp}
          iconBg="bg-[#16A34A]/10"
          iconColor="text-[#16A34A]"
        />
        <StatCard
          title="Caja"
          value={cashSessionOpen ? "Abierta" : "Cerrada"}
          hint={cashSessionOpen ? "Lista para registrar cobros" : "Abre caja para controlar el día"}
          icon={Wallet}
          iconBg={cashSessionOpen ? "bg-emerald-50" : "bg-amber-50"}
          iconColor={cashSessionOpen ? "text-emerald-600" : "text-amber-700"}
        />
        <StatCard
          title="Clientes atendidos hoy"
          value={String(clientsAttendedToday)}
          hint={`${todayPaymentMovements.length} cobros registrados`}
          icon={Users}
          iconBg="bg-[#C89B3C]/10"
          iconColor="text-[#8A641F]"
        />
        <StatCard
          title="Reservas de hoy"
          value={String(todayAppointments.length)}
          hint={`${weekApptsCount} esta semana`}
          icon={CalendarCheck}
          iconBg="bg-[#2563EB]/10"
          iconColor="text-[#2563EB]"
        />
        <StatCard
          title="Huecos libres hoy"
          value={String(totalFreeSlotsToday)}
          hint="Slots disponibles desde ahora"
          icon={Clock}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
        />
        <StatCard
          title="Barbero top del día"
          value={topDailyBarber?.barberName ?? "Sin ventas"}
          hint={topDailyBarber ? formatCurrency(topDailyBarber.totalSold) : "Registra cobros en caja"}
          icon={User}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <StatCard
          title="Barbero con más huecos"
          value={barberWithMostSlots?.barberName ?? "Sin barberos"}
          hint={barberWithMostSlots ? `${barberWithMostSlots.freeSlots.length} huecos libres` : "Crea barberos activos"}
          icon={AlertCircle}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
        />
        <StatCard
          title="Servicio más vendido"
          value={topServiceTodayName}
          hint={topServiceTodayCount > 0 ? `${topServiceTodayCount} ventas hoy` : "Sin cobros vinculados"}
          icon={Scissors}
          iconBg="bg-[#C89B3C]/10"
          iconColor="text-[#8A641F]"
        />
      </section>

      <section className="panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="label-section">Acciones recomendadas</p>
            <h2 className="section-heading mt-1">Qué hacer ahora</h2>
            <p className="section-subtext">Sugerencias rápidas basadas en caja, agenda y huecos libres de hoy.</p>
          </div>
          <Link href="/dashboard/caja" className="btn-outline shrink-0">
            Ver caja <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {recommendedActions.map((action) => (
            <div key={action} className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4 text-sm font-semibold leading-6 text-neutral-700">
              {action}
            </div>
          ))}
        </div>
      </section>

      <BarberPerformance items={barberPerformanceItems} compact />

      <TodayAvailability items={todayAvailabilityItems} />

      {/* ── Próximas citas + Panel lateral ── */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

        {/* Próximas citas */}
        <div className="panel overflow-hidden p-0">
          <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="section-heading">Próximas citas</h2>
              <p className="text-sm text-neutral-500">Reservas activas desde hoy, ordenadas por fecha y hora.</p>
            </div>
            <Link
              href="/dashboard/agenda"
              className="btn-outline min-h-0 px-3 py-2"
            >
              Abrir agenda <ArrowRight size={14} />
            </Link>
          </div>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="px-5 pb-5 md:px-6">
            <EmptyState
              icon={CalendarCheck}
              title="Sin citas próximas"
              description="Comparte tu QR o link público para empezar a llenar la agenda desde Instagram, WhatsApp o Google."
              action={
                <Link
                  href="/dashboard/qr"
                  className="btn-dark"
                >
                  <QrCode size={15} /> Ver QR de reservas
                </Link>
              }
            />
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#E7E2D8]">
              {upcomingAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="flex items-start gap-3 bg-white p-4 transition-colors hover:bg-[#FDFBF7] md:px-6"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#111111] text-center">
                    <span className="text-[9px] font-bold uppercase text-[#D9B766]">
                      {new Date(appointment.appointment_date + "T00:00:00").toLocaleDateString("es-ES", { month: "short" })}
                    </span>
                    <span className="text-base font-black text-white">
                      {new Date(appointment.appointment_date + "T00:00:00").getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold leading-tight text-[#111827]">
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
          <div className="section-band-dark p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D9B766]">
                <QrCode size={18} />
              </div>
              <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#D9B766]">Tu link de reservas</p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Compártelo en Instagram, WhatsApp, Google o imprímelo en un QR para tu local.
            </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
              <p className="break-all font-mono text-xs font-semibold text-white/75">
                {typeof window !== "undefined" ? window.location.origin : "https://barberiaos.com"}{publicBookingUrl}
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <Link
                href="/dashboard/qr"
                className="btn-gold"
              >
                <QrCode size={15} /> Ver y descargar QR
              </Link>
              <Link
                href={publicBookingUrl}
                target="_blank"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white transition-all duration-150 hover:bg-white/10 active:scale-[0.98]"
              >
                Abrir página pública <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="panel">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-neutral-400">Acciones rápidas</p>
            <div className="mt-3 grid gap-1.5">
              {[
                { href: "/dashboard/clientes",  label: "Clientes",  icon: Users      },
                { href: "/dashboard/servicios", label: "Servicios", icon: Scissors   },
                { href: "/dashboard/pagos",     label: "Pagos",     icon: CreditCard },
                { href: "/dashboard/barberos",  label: "Barberos",  icon: User       },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-[#E7E2D8] hover:bg-[#F8F5EF] hover:text-[#111827]"
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
