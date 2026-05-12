import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import { buildBarberPerformance } from "@/src/lib/cash/barber-performance";
import { buildTodayBarberAvailability } from "@/src/lib/booking/barber-availability";
import {
  CalendarCheck,
  TrendingUp,
  Users,
  Clock,
  Wallet,
  QrCode,
  ArrowRight,
  Scissors,
  User,
  CreditCard,
  Megaphone,
  MessageCircle,
  Star,
} from "lucide-react";
import { StatCard }   from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BarberPerformance } from "@/components/dashboard/BarberPerformance";
import { TodayAvailability } from "@/components/dashboard/TodayAvailability";
import { SmartAlerts } from "@/components/dashboard/SmartAlerts";

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
    confirmed: "bg-slate-100 text-slate-600 border-slate-200",
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
    activeServicesResult,
    totalClientsResult,
    recurrentClientsResult,
    dormantClientsResult,
    reviewsResult,
    noShowsMonthResult,
    confirmedUpcomingResult,
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

    dataClient
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .eq("active", true),

    dataClient
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId),

    dataClient
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .gte("visit_count", 2),

    dataClient
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .lt("last_visit_at", new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()),

    dataClient
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("business_id", barbershopId),

    dataClient
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", monthStart)
      .lte("appointment_date", monthEnd)
      .eq("status", "no_show"),

    dataClient
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", today)
      .eq("status", "confirmed"),
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
  const publicBookingFullUrl = `${getConfiguredSiteUrl()}${publicBookingUrl}`;
  const activeServicesCount = activeServicesResult.count ?? 0;
  const activeBarbersCount = ((activeBarbersResult.data as { id: string; name: string }[]) ?? []).length;
  const totalClientsCount = totalClientsResult.count ?? 0;
  const recurrentClientsCount = recurrentClientsResult.count ?? 0;
  const dormantClientsCount = dormantClientsResult.count ?? 0;
  const reviewsCount = reviewsResult.count ?? 0;
  const noShowsMonthCount = noShowsMonthResult.count ?? 0;
  const confirmedUpcomingCount = confirmedUpcomingResult.count ?? 0;
  const hasPublicBooking = Boolean(barbershop?.slug);

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
  const activationItems = [
    {
      label: "Añadir datos de la barbería",
      href: "/dashboard/ajustes",
      done: Boolean(barbershop?.name && barbershop?.slug),
      description: "Nombre, slug, teléfono y datos visibles para tus clientes.",
      actionLabel: "Completar perfil",
    },
    {
      label: "Añadir servicios",
      href: "/dashboard/servicios",
      done: activeServicesCount > 0,
      description: "Cortes, barba, combos, precios y duración.",
      actionLabel: "Crear servicios",
    },
    {
      label: "Añadir barberos",
      href: "/dashboard/barberos",
      done: activeBarbersCount > 0,
      description: "Crea tu equipo para asignar reservas por profesional.",
      actionLabel: "Añadir equipo",
    },
    {
      label: "Configurar horarios",
      href: "/dashboard/ajustes",
      done: activeBarbersCount > 0 && activeServicesCount > 0,
      description: "Define cuándo se puede reservar y operar la agenda.",
      actionLabel: "Configurar horarios",
    },
    {
      label: "Crear QR",
      href: "/dashboard/qr",
      done: hasPublicBooking,
      description: "Genera el QR para mostrador, Instagram y WhatsApp.",
      actionLabel: "Generar QR",
    },
    {
      label: "Probar una reserva",
      href: publicBookingUrl,
      done: upcomingAppointments.length > 0 || todayAppointments.length > 0,
      description: "Haz una prueba para ver el flujo como cliente.",
      actionLabel: "Probar reserva",
    },
    {
      label: "Compartir link en Instagram",
      href: "/dashboard/qr",
      done: Boolean(barbershop?.slug && barbershop?.name),
      description: "Copia el link público y úsalo en bio o stories.",
      actionLabel: "Copiar link",
    },
    {
      label: "Activar recordatorios",
      href: "/dashboard/automatizaciones",
      done: confirmedUpcomingCount > 0,
      description: "Reduce olvidos confirmando próximas citas.",
      actionLabel: "Ver recordatorios",
    },
    {
      label: "Lanzar primera promoción",
      href: "/dashboard/marketing",
      done: totalClientsCount > 0 && totalFreeSlotsToday > 0,
      description: "Usa huecos libres o clientes dormidos para crear demanda.",
      actionLabel: "Crear promoción",
    },
  ];
  const activationPercent = Math.round(
    (activationItems.filter((item) => item.done).length / activationItems.length) * 100
  );
  const growthFactors = [
    {
      label: "Reservas activas",
      done: todayAppointments.length > 0 || upcomingAppointments.length > 0,
      hint: `${todayAppointments.length + upcomingAppointments.length} reservas visibles entre hoy y próximas citas.`,
    },
    {
      label: "Clientes recurrentes",
      done: recurrentClientsCount > 0,
      hint: `${recurrentClientsCount} clientes con dos o más visitas registradas.`,
    },
    {
      label: "Clientes dormidos detectados",
      done: dormantClientsCount > 0,
      hint: `${dormantClientsCount} clientes llevan más de 45 días sin volver.`,
    },
    {
      label: "Ocupación semanal",
      done: weekApptsCount >= Math.max(5, activeBarbersCount * 3),
      hint: `${weekApptsCount} citas registradas esta semana.`,
    },
    {
      label: "Citas confirmadas",
      done: confirmedUpcomingCount > 0,
      hint: `${confirmedUpcomingCount} citas futuras están confirmadas.`,
    },
    {
      label: "No-shows controlados",
      done: noShowsMonthCount <= 2,
      hint: `${noShowsMonthCount} no-shows registrados este mes.`,
    },
    {
      label: "Reseñas activas",
      done: reviewsCount > 0,
      hint: `${reviewsCount} reseñas o solicitudes de reseña registradas.`,
    },
    {
      label: "Uso del QR",
      done: hasPublicBooking,
      hint: hasPublicBooking ? "Link público listo para compartir en QR." : "Falta activar el link público de reservas.",
    },
    {
      label: "Servicios configurados",
      done: activeServicesCount > 0,
      hint: `${activeServicesCount} servicios activos.`,
    },
    {
      label: "Barberos activos",
      done: activeBarbersCount > 0,
      hint: `${activeBarbersCount} barberos activos.`,
    },
  ];
  const growthScore = Math.round(
    (growthFactors.filter((factor) => factor.done).length / growthFactors.length) * 100
  );
  const smartAlerts = [
    {
      title: `Tienes ${dormantClientsCount} clientes dormidos`,
      description:
        dormantClientsCount > 0
          ? "Llevan más de 45 días sin volver. Puedes lanzar una campaña de recuperación."
          : "Aún no hay clientes dormidos detectados con la información actual.",
      href: "/dashboard/recuperacion",
      icon: Users,
    },
    {
      title: `${confirmedUpcomingCount} citas futuras confirmadas`,
      description:
        confirmedUpcomingCount > 0
          ? "Mantén las confirmaciones al día para reducir olvidos y cambios de última hora."
          : "Revisa las próximas reservas y confirma las citas pendientes.",
      href: "/dashboard/agenda",
      icon: CalendarCheck,
    },
    {
      title: `${totalFreeSlotsToday} huecos libres hoy`,
      description:
        totalFreeSlotsToday > 0
          ? "Comparte disponibilidad por WhatsApp o lanza una promoción rápida."
          : "Hoy no hay huecos libres detectados en la disponibilidad actual.",
      href: "/dashboard/huecos",
      icon: Clock,
    },
    {
      title: `${noShowsMonthCount} no-shows este mes`,
      description:
        noShowsMonthCount > 0
          ? "Revisa patrones y refuerza recordatorios antes de las horas más críticas."
          : "No hay no-shows registrados este mes. Buen momento para mantener el hábito de confirmar.",
      href: "/dashboard/automatizaciones",
      icon: MessageCircle,
    },
    {
      title: topDailyBarber
        ? `${topDailyBarber.barberName} lidera ventas hoy`
        : "Sin barbero top todavía",
      description: topDailyBarber
        ? `Lleva ${formatCurrency(topDailyBarber.totalSold)} vendidos. Revisa servicios y comisiones.`
        : "Registra cobros en caja para ver rendimiento por barbero.",
      href: "/dashboard/caja",
      icon: Star,
    },
    {
      title: "Primera promoción",
      description:
        totalClientsCount > 0
          ? "Usa tu base de clientes para empujar horas flojas sin depender solo de Instagram."
          : "Cuando tengas clientes registrados podrás lanzar promociones más segmentadas.",
      href: "/dashboard/marketing",
      icon: Megaphone,
    },
  ];
  const nextActivationItem = activationItems.find((item) => !item.done);
  const growthPreview = growthFactors.slice(0, 3);
  const visibleTodayAppointments = todayAppointments.slice(0, 5);
  const visibleAlerts = smartAlerts.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="section-band overflow-hidden">
        <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C89B3C]/20 bg-[#C89B3C]/10 px-3 py-1 text-xs font-bold text-[#8A641F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
              Hoy en tu barbería
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#111111] md:text-4xl">
              {barbershop?.name ?? "Tu barbería"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Lo importante de hoy, sin ruido: citas, caja, huecos y la próxima acción para mover el día.
            </p>

            {nextActivationItem && (
              <div className="mt-5 rounded-2xl border border-[#C9922A]/20 bg-[#C9922A]/8 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8A641F]">
                      Configuración pendiente
                    </p>
                    <p className="mt-1 text-sm font-semibold text-neutral-700">
                      Falta completar {activationItems.filter((item) => !item.done).length} pasos para dejar reservas online listas.
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Siguiente paso: {nextActivationItem.label}
                    </p>
                  </div>
                  <Link href={nextActivationItem.href} className="btn-dark shrink-0">
                    Continuar <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
                  <div className="h-full rounded-full bg-[#C9922A]" style={{ width: `${activationPercent}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[440px] lg:grid-cols-1">
            <Link href="/dashboard/agenda" className="btn-dark justify-center">
              Ver agenda de hoy
            </Link>
            <Link href="/dashboard/qr" className="btn-outline justify-center">
              Ver QR de reservas
            </Link>
            <Link href={publicBookingUrl} target="_blank" className="btn-outline justify-center">
              Página pública <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

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
          title="Reservas hoy"
          value={String(todayAppointments.length)}
          hint={`${weekApptsCount} esta semana`}
          icon={CalendarCheck}
          iconBg="bg-[#C9922A]/10"
          iconColor="text-[#C9922A]"
        />
        <StatCard
          title="Huecos libres"
          value={String(totalFreeSlotsToday)}
          hint={barberWithMostSlots ? `Más disponibles: ${barberWithMostSlots.barberName}` : "Slots disponibles desde ahora"}
          icon={Clock}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="panel overflow-hidden p-0">
          <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-section">Día a día</p>
                <h2 className="section-heading mt-1">Citas de hoy</h2>
                <p className="section-subtext">
                  {todayAppointments.length} reservas para atender hoy, ordenadas por hora.
                </p>
              </div>
              <Link href="/dashboard/agenda" className="btn-outline min-h-0 px-3 py-2">
                Abrir agenda <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {visibleTodayAppointments.length === 0 ? (
            <div className="px-5 pb-5 md:px-6">
              <EmptyState
                icon={CalendarCheck}
                title="Sin citas hoy"
                description="Comparte tu QR o link público para empezar a llenar la agenda desde Instagram, WhatsApp o Google."
                action={
                  <Link href="/dashboard/qr" className="btn-dark">
                    <QrCode size={15} /> Ver QR de reservas
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#E7E2D8]">
              {visibleTodayAppointments.map((appointment) => (
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

        <div className="flex flex-col gap-4">
          <div className="section-band-dark p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D9B766]">
                <QrCode size={18} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-[#D9B766]">Tu link de reservas</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Un solo enlace para Instagram, WhatsApp, Google y el QR del local.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
              <p className="break-all font-mono text-xs font-semibold text-white/75">
                {publicBookingFullUrl}
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <Link href="/dashboard/qr" className="btn-gold">
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

          <div className="panel">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-neutral-400">Acciones rápidas</p>
            <div className="mt-3 grid gap-1.5">
              {[
                { href: "/dashboard/caja", label: cashSessionOpen ? "Ir a caja" : "Abrir caja", icon: Wallet },
                { href: "/dashboard/clientes", label: "Clientes", icon: Users },
                { href: "/dashboard/servicios", label: "Servicios", icon: Scissors },
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

      <section className="section-band-dark p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#D9B766]">Crecimiento</p>
            <h2 className="mt-1 text-3xl font-black text-white">{growthScore}/100</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              Indicador rápido de lo preparado que está el negocio para captar reservas, recuperar clientes y reducir huecos vacíos.
            </p>
          </div>
          <Link href="/dashboard/marketing" className="btn-gold shrink-0">
            Ver crecimiento <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-3">
          {growthPreview.map((factor) => (
            <div key={factor.label} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
              <p className="text-sm font-black text-white">{factor.label}</p>
              <p className="mt-1 text-xs leading-5 text-white/50">{factor.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <BarberPerformance items={barberPerformanceItems} compact />

      <TodayAvailability items={todayAvailabilityItems} />

      <SmartAlerts alerts={visibleAlerts} />
    </div>
  );
}
