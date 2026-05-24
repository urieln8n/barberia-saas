import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import { buildBarberPerformance } from "@/src/lib/cash/barber-performance";
import { buildTodayBarberAvailability } from "@/src/lib/booking/barber-availability";
import {
  CalendarCheck,
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
  Sparkles,
  Bot,
  Tv,
  RotateCcw,
} from "lucide-react";
import { StatCard }   from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BarberPerformance } from "@/components/dashboard/BarberPerformance";
import { TodayAvailability } from "@/components/dashboard/TodayAvailability";
import { ActivationChecklist } from "@/components/dashboard/ActivationChecklist";
import { GrowthScoreCard } from "@/components/dashboard/GrowthScoreCard";
import { SmartAlerts } from "@/components/dashboard/SmartAlerts";
import { WelcomePanel } from "@/components/dashboard/WelcomePanel";
import { QuickActionsRow } from "@/components/dashboard/QuickActionsRow";
import { RecommendedActionCard } from "@/components/dashboard/RecommendedActionCard";
import {
  PremiumDashboardItem,
  PremiumDashboardMotion,
} from "@/components/dashboard/PremiumDashboardMotion";

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
    supabase
      .from("barbershops")
      .select("id, name, slug")
      .eq("id", barbershopId)
      .maybeSingle(),

    supabase
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
      .in("status", ["scheduled", "confirmed"] as const)
      .order("start_time", { ascending: true }),

    supabase
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
      .in("status", ["scheduled", "confirmed"] as const)
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(6),

    supabase
      .from("payments")
      .select("amount")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),

    supabase
      .from("appointments")
      .select("appointment_date, start_time, status, services(name), barbers(name)")
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", monthStart)
      .lte("appointment_date", monthEnd),

    supabase
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),

    supabase
      .from("cash_movements")
      .select(
        "amount, discount_amount, tip_amount, payment_method, movement_type, barber_id, client_id, service_id, services(name)"
      )
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),

    supabase
      .from("cash_sessions")
      .select("id, status, opening_amount, opened_at")
      .eq("barbershop_id", barbershopId)
      .eq("status", "open")
      .order("opened_at", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .eq("active", true),

    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId),

    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .gte("visit_count", 2),

    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .lt("last_visit_at", new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()),

    supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("business_id", barbershopId),

    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", monthStart)
      .lte("appointment_date", monthEnd)
      .eq("status", "no_show"),

    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", today)
      .eq("status", "confirmed"),
  ]);

  // ── Data for QuickActionsRow (services list for panel, barbers reused from activeBarbersResult) ──
  const quickServicesResult = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .eq("barbershop_id", barbershopId)
    .eq("active", true)
    .order("name", { ascending: true });

  const quickServices = ((quickServicesResult.data as { id: string; name: string; duration_minutes: number | null; price: number | null }[]) ?? []);
  const quickBarbers = ((activeBarbersResult.data as { id: string; name: string }[]) ?? []);

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
    topServiceTodayCount > 0
      ? `${topServiceTodayName} es el servicio con más cobros hoy. Úsalo como gancho para horas flojas.`
      : "Aún no hay servicio líder hoy. Registra cobros para detectar qué empujar.",
    `${clientsAttendedToday} clientes atendidos y ${cashPaymentsCount} pagos en efectivo registrados hoy.`,
    cashSessionOpen
      ? "Cierra caja al final del día para evitar descuadres."
      : "Abre caja antes de registrar cobros para controlar el efectivo.",
  ];
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
      title: dormantClientsCount > 0
        ? `${dormantClientsCount} clientes sin volver en +45 días`
        : "Sin clientes dormidos detectados",
      description:
        dormantClientsCount > 0
          ? "El Agente Retención IA genera su WhatsApp personalizado en segundos. El 30% vuelve con un mensaje bien redactado."
          : "Cuando tengas clientes con más de 45 días sin visita, el Agente Retención IA los detectará aquí.",
      href: dormantClientsCount > 0 ? "/dashboard/agents" : "/dashboard/clientes",
      icon: Users,
    },
    {
      title: confirmedUpcomingCount > 0
        ? `${confirmedUpcomingCount} citas futuras confirmadas`
        : "Sin citas confirmadas próximas",
      description:
        confirmedUpcomingCount > 0
          ? "Agenda activa. Cuando terminen las citas de hoy, el Agente Reseñas IA tendrá solicitudes listas para enviar."
          : "Revisa las reservas pendientes y confirma para reducir no-shows.",
      href: "/dashboard/agenda",
      icon: CalendarCheck,
    },
    {
      title: totalFreeSlotsToday > 0
        ? `${totalFreeSlotsToday} huecos libres hoy`
        : "Agenda completa hoy",
      description:
        totalFreeSlotsToday > 0
          ? "El Agente Huecos IA genera el copy de Instagram Stories y WhatsApp en 10 segundos para llenar esos huecos."
          : "Sin huecos libres detectados. Buen ritmo — revisa próximos días para anticiparte.",
      href: totalFreeSlotsToday > 0 ? "/dashboard/agents" : "/dashboard/huecos",
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
      title: totalClientsCount > 0
        ? `Agente Marketing listo — ${totalClientsCount} clientes en tu base`
        : "Activa el Marketing Studio IA",
      description:
        totalClientsCount > 0
          ? "El Agente Marketing Studio genera tu plan de contenido semanal usando tus servicios y datos reales. Sin copywriting manual."
          : "Cuando tengas clientes y servicios registrados, el Agente Marketing genera campañas personalizadas automáticamente.",
      href: "/dashboard/agents",
      icon: Megaphone,
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <section className="surface-frame overflow-hidden">
        <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C89B3C]/20 bg-[#C89B3C]/10 px-3 py-1 text-xs font-bold text-[#8A641F]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#16A34A]" />
              Sistema operativo activo
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#111111] md:text-4xl">
              {barbershop?.name ?? "Tu barbería"}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              Agenda, caja, huecos y clientes en una vista. Tus agentes IA trabajan en segundo plano mientras tú cortas.
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

      {/* ── Quick Actions Row ── */}
      <QuickActionsRow services={quickServices} barbers={quickBarbers} />

      {/* ── AaaS Agents teaser ── */}
      <Link
        href="/dashboard/agents"
        className="group flex cursor-pointer items-center justify-between gap-4 rounded-[24px] border border-[#D5A84C]/20 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] px-5 py-4 shadow-sm transition-all hover:border-[#D5A84C]/40 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#C9922A]/30 bg-[#C9922A]/10">
            <Sparkles size={16} className="text-[#C9922A]" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#D4AF66]">
              Agentes IA activos
            </p>
            <p className="text-sm font-semibold text-white/80">
              4 agentes analizando tu barbería ahora mismo — Retención, Huecos, Reseñas, Marketing
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition-colors group-hover:bg-white/10">
          Ver agentes <ArrowRight size={13} />
        </div>
      </Link>

      {/* ── Tus agentes IA — resumen ── */}
      <section className="surface-frame p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-[#C9922A]" />
              <p className="label-section">Tus agentes IA</p>
            </div>
            <h2 className="section-heading mt-1">Inteligencia trabajando</h2>
            <p className="section-subtext">
              Activa los agentes IA para automatizar retención, reseñas, huecos y más.
            </p>
          </div>
          <Link href="/dashboard/agents" className="btn-dark shrink-0">
            Ver agentes IA <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Recepcionista IA", status: "Beta", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100" },
            { label: "Reseñas IA", status: "Activo", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Retención IA", status: "Activo", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Lounge Agent", status: "Próximamente", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" },
          ].map(({ label, status, color, bg, border }) => (
            <div key={label} className={`flex items-center justify-between gap-2 rounded-2xl border px-4 py-3 ${bg} ${border}`}>
              <div className="flex items-center gap-2">
                <Sparkles size={13} className={color} />
                <p className="text-sm font-black text-[#080A0F]">{label}</p>
              </div>
              <span className={`text-[11px] font-black ${color}`}>{status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lounge card ── */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/lounge"
          className="group flex cursor-pointer items-start gap-4 rounded-[24px] border border-[#D5A84C]/20 bg-[FDF8EE] p-5 shadow-sm transition-all hover:border-[#D5A84C]/40 hover:shadow-md bg-white"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D5A84C]/25 bg-[#FDF8EE]">
            <Tv size={20} className="text-[#C9922A]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-black text-[#080A0F]">BarberíaOS Lounge</p>
              <span className="rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-2 py-0.5 text-[10px] font-black uppercase text-[#8A641F]">
                Nuevo
              </span>
            </div>
            <p className="mt-1 text-sm leading-5 text-[#080A0F]/60">
              Convierte tu sala de espera en un canal de reservas, ventas y reseñas.
            </p>
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#C9922A] transition-colors group-hover:text-[#8A641F]">
              Activar Lounge <ArrowRight size={12} />
            </p>
          </div>
        </Link>

        {/* ── RecommendedActionCard ── */}
        <RecommendedActionCard
          title={
            dormantClientsCount > 0
              ? `${dormantClientsCount} clientes pueden volver con un mensaje`
              : totalFreeSlotsToday > 0
              ? `${totalFreeSlotsToday} huecos libres hoy — activa una campaña`
              : "Activa el Agente Reseñas para mejorar tu reputación"
          }
          description={
            dormantClientsCount > 0
              ? "Activa el Agente Retención IA para preparar mensajes de WhatsApp personalizados. El 30% vuelve."
              : totalFreeSlotsToday > 0
              ? "El Agente Huecos genera el copy de Instagram Stories y WhatsApp en 10 segundos."
              : "Las reseñas de Google determinan si te encuentran. Un mensaje bien redactado tarda 10 segundos."
          }
          cta="Ver agentes IA"
          ctaHref="/dashboard/agents"
          icon={
            dormantClientsCount > 0
              ? RotateCcw
              : totalFreeSlotsToday > 0
              ? Clock
              : Star
          }
          variant="gold"
        />
      </div>

      <section className="surface-frame p-5 md:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label-section">Panel de Hoy</p>
            <h2 className="section-heading mt-1">Control operativo</h2>
            <p className="section-subtext">
              Reservas, caja, huecos, clientes y barberos en menos de 5 segundos.
            </p>
          </div>
          <Link href="/dashboard/ia" className="btn-outline">
            IA del Dueño <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Control diario ── */}
      <PremiumDashboardMotion className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <PremiumDashboardItem className="md:col-span-2 xl:col-span-1">
          <StatCard
            kicker="Prioridad 1"
            title="Reservas de hoy"
            value={String(todayAppointments.length)}
            hint={todayAppointments.length > 0 ? `${weekApptsCount} citas esta semana` : "Agenda sin reservas activas hoy"}
            icon={CalendarCheck}
            iconBg="bg-[#C9922A]/10"
            iconColor="text-[#C9922A]"
            footer={
              <Link href="/dashboard/agenda" className="inline-flex items-center gap-1 text-sm font-black text-[#B98B2F]">
                Abrir agenda <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>
        <PremiumDashboardItem>
          <StatCard
            kicker="Prioridad 2"
            title="Caja del día"
            value={formatCurrency(salesToday)}
            hint={cashSessionOpen ? "Caja abierta y lista para cobros" : "Caja cerrada: abre sesión antes de cobrar"}
            icon={Wallet}
            iconBg={cashSessionOpen ? "bg-emerald-50" : "bg-amber-50"}
            iconColor={cashSessionOpen ? "text-emerald-600" : "text-amber-700"}
            tone={cashSessionOpen ? "success" : "warning"}
            footer={
              <Link href="/dashboard/caja" className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                Ver caja <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>
        <PremiumDashboardItem>
          <StatCard
            kicker="Oportunidad"
            title="Próximos huecos libres"
            value={String(totalFreeSlotsToday)}
            hint={barberWithMostSlots ? `${barberWithMostSlots.barberName} tiene más disponibilidad` : "Configura barberos para calcular huecos"}
            icon={Clock}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            footer={
              <Link href="/dashboard/huecos" className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                Llenar huecos <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>
        <PremiumDashboardItem>
          <StatCard
            kicker="Retención"
            title="Clientes que podrían volver"
            value={String(dormantClientsCount)}
            hint={dormantClientsCount > 0 ? "Más de 45 días sin visita registrada" : "No hay clientes dormidos detectados"}
            icon={Users}
            iconBg="bg-[#C89B3C]/10"
            iconColor="text-[#8A641F]"
            footer={
              <Link href="/dashboard/recuperacion" className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                Recuperar clientes <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>
        <PremiumDashboardItem>
          <StatCard
            kicker="Equipo"
            title="Barberos activos"
            value={String(activeBarbersCount)}
            hint={topDailyBarber ? `Top hoy: ${topDailyBarber.barberName}` : "Sin ventas asignadas todavía"}
            icon={User}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-700"
            footer={
              <Link href="/dashboard/barberos" className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                Ver equipo <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>
      </PremiumDashboardMotion>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="surface-frame overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-section">Reservas de hoy</p>
                <h2 className="section-heading mt-1">Lo próximo en agenda</h2>
                <p className="section-subtext">
                  Primer vistazo para saber quién llega, a qué hora y con qué barbero.
                </p>
              </div>
              <Link href="/dashboard/reservas" className="btn-outline px-4 py-2.5">
                Ver reservas <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="p-5 md:p-6">
              <EmptyState
                icon={CalendarCheck}
                title="Sin reservas activas hoy"
                description="Usa el Agente Huecos para generar el copy de Instagram y WhatsApp en segundos, o comparte tu QR de reservas."
                action={
                  <div className="flex flex-wrap gap-2">
                    <Link href="/dashboard/agents" className="btn-primary">
                      <Sparkles size={15} /> Agente Huecos IA
                    </Link>
                    <Link href="/dashboard/huecos" className="btn-outline">
                      <Clock size={15} /> Ver huecos
                    </Link>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todayAppointments.slice(0, 5).map((appointment) => (
                <article
                  key={appointment.id}
                  className="grid gap-3 bg-white p-4 transition-colors hover:bg-slate-50 sm:grid-cols-[88px_1fr_auto] sm:items-center md:px-6"
                >
                  <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900">
                    <Clock size={14} className="text-[#C9922A]" />
                    <span className="text-sm font-black">{formatTime(appointment.start_time)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-900">
                      {appointment.clients?.name ?? "Cliente sin nombre"}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      {appointment.services?.name ?? "Servicio sin definir"} · {appointment.barbers?.name ?? "Sin barbero"}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-5">
          <div className="surface-frame p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="label-section">Caja del día</p>
                <p className="mt-2 text-4xl font-black leading-none text-slate-900">{formatCurrency(salesToday)}</p>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  {cashSessionOpen ? "Sesión abierta. Mantén cobros y efectivo sincronizados." : "La caja está cerrada. Abre sesión para controlar efectivo y descuadres."}
                </p>
              </div>
              <div className={cashSessionOpen ? "badge-success" : "badge-warning"}>
                {cashSessionOpen ? "Abierta" : "Cerrada"}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase text-slate-600">Clientes atendidos</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{clientsAttendedToday}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase text-slate-600">Efectivo</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{cashPaymentsCount}</p>
              </div>
            </div>
          </div>

          <div className="surface-frame">
            <p className="label-section">Clientes para recuperar</p>
            <h2 className="section-heading mt-1">{dormantClientsCount} podrían volver</h2>
            <p className="section-subtext">
              {dormantClientsCount > 0
                ? "Activa una campaña corta para clientes sin visita en más de 45 días."
                : "Cuando haya clientes inactivos, aparecerán aquí como oportunidad de recuperación."}
            </p>
            <Link href="/dashboard/recuperacion" className="mt-4 btn-outline w-full">
              Abrir recuperación <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="surface-frame">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="label-section">Recomendación de BarberíaOS IA</p>
            <h2 className="section-heading mt-1">Insight inteligente</h2>
            <p className="section-subtext">
              Hoy {barberWithMostSlots?.barberName ?? "tu equipo"} tiene {barberWithMostSlots?.freeSlots.length ?? totalFreeSlotsToday} huecos libres entre las 15:00 y 18:00. Puedes llenarlos con una promoción rápida.
            </p>
          </div>
          <Link href="/dashboard/caja" className="btn-outline shrink-0">
            Ver caja <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {recommendedActions.map((action) => (
            <div key={action} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
              {action}
            </div>
          ))}
        </div>
      </section>

      <section className="surface-frame overflow-hidden">
        <div className="grid gap-5 p-5 md:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="label-section">Huecos libres</p>
            <h2 className="section-heading mt-1">Disponibilidad rápida de hoy</h2>
            <p className="section-subtext">
              {totalFreeSlotsToday} huecos libres hoy · {barberWithMostSlots?.barberName ?? "Sin barbero"} es quien tiene más disponibilidad.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[auto_auto_auto] sm:items-center">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase text-slate-600">Total huecos</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{totalFreeSlotsToday}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-black uppercase text-slate-600">Más huecos</p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {barberWithMostSlots?.barberName ?? "—"}
              </p>
            </div>
            <Link href="/dashboard/huecos" className="btn-dark">
              Ver huecos libres <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <BarberPerformance items={barberPerformanceItems} compact />

      <TodayAvailability items={todayAvailabilityItems} />

      <WelcomePanel />

      <ActivationChecklist percent={activationPercent} items={activationItems} />

      <GrowthScoreCard score={growthScore} factors={growthFactors} />

      <SmartAlerts alerts={smartAlerts} />

      {/* ── Próximas citas + Panel lateral ── */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

        {/* Próximas citas */}
        <div className="surface-frame overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="section-heading">Próximas citas</h2>
              <p className="text-base leading-7 text-slate-600">Reservas activas desde hoy, ordenadas por fecha y hora.</p>
            </div>
            <Link
              href="/dashboard/agenda"
              className="btn-outline px-4 py-2.5"
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
                  className="btn-primary"
                >
                  <QrCode size={15} /> Ver QR de reservas
                </Link>
              }
            />
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {upcomingAppointments.map((appointment) => (
                <article
                  key={appointment.id}
                  className="flex items-start gap-3 bg-white p-4 transition-colors hover:bg-slate-50 md:px-6"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-center">
                    <span className="text-[9px] font-bold uppercase text-[#C9922A]">
                      {new Date(appointment.appointment_date + "T00:00:00").toLocaleDateString("es-ES", { month: "short" })}
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {new Date(appointment.appointment_date + "T00:00:00").getDate()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold leading-tight text-slate-900">
                        {appointment.clients?.name ?? "Cliente sin nombre"}
                      </p>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {appointment.services?.name ?? "—"} · {appointment.barbers?.name ?? "Sin barbero"} · {formatTime(appointment.start_time)}
                    </p>
                    {appointment.clients?.phone && (
                      <p className="mt-0.5 text-xs font-medium text-slate-400">{appointment.clients.phone}</p>
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
          <div className="surface-frame p-5 md:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C9922A]/20 bg-[#C9922A]/10 text-[#C9922A]">
                <QrCode size={18} />
              </div>
              <div>
            <p className="label-section">Tu link de reservas</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Compártelo en Instagram, WhatsApp, Google o imprímelo en un QR para tu local.
            </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="break-all font-mono text-xs font-semibold text-slate-700">
                {publicBookingFullUrl}
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
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all duration-150 hover:bg-slate-100 active:scale-[0.98]"
              >
                Abrir página pública <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="surface-frame">
            <p className="label-section">Acciones rápidas</p>
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
                  className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Icon size={15} className="shrink-0 text-slate-500" />
                  {label}
                  <span className="ml-auto text-slate-400">→</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
