import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildBarberPerformance } from "@/src/lib/cash/barber-performance";
import { buildTodayBarberAvailability } from "@/src/lib/booking/barber-availability";
import {
  CalendarCheck,
  Users,
  Clock,
  Wallet,
  QrCode,
  ArrowRight,
  Sparkles,
  Star,
  RotateCcw,
} from "lucide-react";
import { StatCard }   from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BarberPerformance } from "@/components/dashboard/BarberPerformance";
import { ActivationChecklist } from "@/components/dashboard/ActivationChecklist";
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

function formatDateSpanish(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const days   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const date   = new Date(Number(year), Number(month) - 1, Number(day));
  return `${days[date.getDay()]}, ${Number(day)} de ${months[Number(month) - 1]}`;
}

function cashMovementTotal(movement: CashMovementPerformanceRow) {
  const amount   = Number(movement.amount ?? 0);
  const discount = Number(movement.discount_amount ?? 0);
  const tip      = Number(movement.tip_amount ?? 0);
  const total    = amount - discount + tip;
  if (movement.movement_type === "refund" || movement.movement_type === "expense") return -total;
  return total;
}

function normalizeAppointment(item: any): AppointmentItem {
  const client  = firstRelation(item.clients);
  const service = firstRelation(item.services);
  const barber  = firstRelation(item.barbers);
  return {
    id:               item.id,
    appointment_date: item.appointment_date,
    start_time:       item.start_time,
    end_time:         item.end_time,
    status:           item.status ?? "pending",
    clients:  client  ? { name: client.name  ?? "Cliente sin nombre",      phone: client.phone  ?? null } : null,
    services: service ? { name: service.name ?? "Servicio no definido", price: service.price ?? null } : null,
    barbers:  barber  ? { name: barber.name  ?? "Sin barbero" }                                        : null,
  };
}

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today      = getLocalDateISO();
  const weekStart  = getWeekStartISO();
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
    supabase.from("barbershops").select("id, name, slug").eq("id", barbershopId).maybeSingle(),

    supabase.from("appointments")
      .select(`id, barber_id, appointment_date, start_time, end_time, status,
        clients (name, phone), services (name, price), barbers (name)`)
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today)
      .in("status", ["scheduled", "confirmed"] as const)
      .order("start_time", { ascending: true }),

    supabase.from("appointments")
      .select(`id, appointment_date, start_time, end_time, status,
        clients (name, phone), services (name, price), barbers (name)`)
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", today)
      .in("status", ["scheduled", "confirmed"] as const)
      .order("appointment_date", { ascending: true })
      .order("start_time",       { ascending: true })
      .limit(6),

    supabase.from("payments").select("amount")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),

    supabase.from("appointments")
      .select("appointment_date, start_time, status, services(name), barbers(name)")
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", monthStart)
      .lte("appointment_date", monthEnd),

    supabase.from("barbers").select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),

    supabase.from("cash_movements")
      .select("amount, discount_amount, tip_amount, payment_method, movement_type, barber_id, client_id, service_id, services(name)")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),

    supabase.from("cash_sessions").select("id, status, opening_amount, opened_at")
      .eq("barbershop_id", barbershopId)
      .eq("status", "open")
      .order("opened_at", { ascending: false })
      .limit(1).maybeSingle(),

    supabase.from("services").select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId).eq("active", true),

    supabase.from("clients").select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId),

    supabase.from("clients").select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId).gte("visit_count", 2),

    supabase.from("clients").select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .lt("last_visit_at", new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()),

    supabase.from("reviews").select("id", { count: "exact", head: true })
      .eq("business_id", barbershopId),

    supabase.from("appointments").select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", monthStart)
      .lte("appointment_date", monthEnd)
      .eq("status", "no_show"),

    supabase.from("appointments").select("id", { count: "exact", head: true })
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", today)
      .eq("status", "confirmed"),
  ]);

  const quickServicesResult = await supabase
    .from("services").select("id, name, duration_minutes, price")
    .eq("barbershop_id", barbershopId).eq("active", true)
    .order("name", { ascending: true });

  const quickServices = ((quickServicesResult.data as { id: string; name: string; duration_minutes: number | null; price: number | null }[]) ?? []);
  const quickBarbers  = ((activeBarbersResult.data  as { id: string; name: string }[]) ?? []);

  const barbershop           = barbershopResult.data;
  const todayAppointments    = ((todayAppointmentsResult.data    as any[]) ?? []).map(normalizeAppointment);
  const upcomingAppointments = ((upcomingAppointmentsResult.data as any[]) ?? []).map(normalizeAppointment);

  const todayRevenue      = ((paymentsResult.data as any[]) ?? []).reduce((t, p) => t + Number(p.amount ?? 0), 0);
  const publicBookingUrl  = `/r/${barbershop?.slug ?? "demo-barber"}`;
  const activeServicesCount  = activeServicesResult.count  ?? 0;
  const activeBarbersCount   = ((activeBarbersResult.data  as { id: string; name: string }[]) ?? []).length;
  const totalClientsCount    = totalClientsResult.count    ?? 0;
  const recurrentClientsCount = recurrentClientsResult.count ?? 0;
  const dormantClientsCount  = dormantClientsResult.count  ?? 0;
  const reviewsCount         = reviewsResult.count         ?? 0;
  const noShowsMonthCount    = noShowsMonthResult.count    ?? 0;
  const confirmedUpcomingCount = confirmedUpcomingResult.count ?? 0;
  const hasPublicBooking     = Boolean(barbershop?.slug);

  const monthAppts      = (monthApptsResult.data as any[]) ?? [];
  const weekApptsCount  = monthAppts.filter((a: any) => a.appointment_date >= weekStart).length;

  const todayCashMovements   = ((todayCashMovementsResult.data as CashMovementPerformanceRow[]) ?? []);
  const todayPaymentMovements = todayCashMovements.filter((m) => m.movement_type === "payment");
  const cashSalesToday        = todayPaymentMovements.reduce((s, m) => s + cashMovementTotal(m), 0);
  const salesToday            = cashSalesToday > 0 ? cashSalesToday : todayRevenue;

  const attendedClientIds   = new Set(todayPaymentMovements.map((m) => m.client_id).filter((id): id is string => Boolean(id)));
  const anonymousPayments   = todayPaymentMovements.filter((m) => !m.client_id).length;
  const clientsAttendedToday = attendedClientIds.size + anonymousPayments;
  const cashPaymentsCount    = todayPaymentMovements.filter((m) => m.payment_method === "cash").length;

  const cashSessionOpen = Boolean(activeCashSessionResult.data);

  const activeBarbers = ((activeBarbersResult.data as { id: string; name: string }[]) ?? []).map((b) => ({ id: b.id, name: b.name }));

  const barberPerformanceItems = buildBarberPerformance(
    activeBarbers,
    todayPaymentMovements.map((m) => ({
      amount: m.amount, discount_amount: m.discount_amount, tip_amount: m.tip_amount,
      payment_method: m.payment_method, movement_type: m.movement_type,
      barber_id: m.barber_id, client_id: m.client_id, service_id: m.service_id,
    }))
  );

  const todayAvailabilityItems = buildTodayBarberAvailability({
    barbers:       activeBarbers,
    appointments:  ((todayAppointmentsResult.data as TodayAvailabilityAppointmentRow[]) ?? []).map((a) => ({
      barber_id: a.barber_id, start_time: a.start_time, end_time: a.end_time, status: a.status,
    })),
    todayIso:         today,
    startHour:        9,
    endHour:          20,
    intervalMinutes:  30,
  });

  const totalFreeSlotsToday = todayAvailabilityItems.reduce((s, i) => s + i.freeSlots.length, 0);
  const topDailyBarber      = barberPerformanceItems.find((i) => i.totalSold > 0);
  const barberWithMostSlots = todayAvailabilityItems.reduce(
    (top, i) => (!top || i.freeSlots.length > top.freeSlots.length ? i : top),
    null as (typeof todayAvailabilityItems)[number] | null
  );

  // Activation checklist
  const activationItems = [
    { label: "Añadir datos de la barbería", href: "/dashboard/ajustes",        done: Boolean(barbershop?.name && barbershop?.slug), description: "Nombre, slug, teléfono y datos de tu barbería.",         actionLabel: "Completar perfil"   },
    { label: "Añadir servicios",            href: "/dashboard/servicios",       done: activeServicesCount > 0,                        description: "Cortes, barba, combos, precios y duración.",             actionLabel: "Crear servicios"    },
    { label: "Añadir barberos",             href: "/dashboard/barberos",        done: activeBarbersCount > 0,                         description: "Crea tu equipo para asignar reservas.",                  actionLabel: "Añadir equipo"      },
    { label: "Configurar horarios",         href: "/dashboard/ajustes",         done: activeBarbersCount > 0 && activeServicesCount > 0, description: "Define cuándo se puede reservar.",                 actionLabel: "Configurar horarios"},
    { label: "Crear QR",                    href: "/dashboard/qr",              done: hasPublicBooking,                               description: "Genera el QR para mostrador, Instagram y WhatsApp.",    actionLabel: "Generar QR"         },
    { label: "Probar una reserva",          href: publicBookingUrl,             done: upcomingAppointments.length > 0 || todayAppointments.length > 0, description: "Haz una prueba como cliente.", actionLabel: "Probar reserva" },
    { label: "Compartir link en Instagram", href: "/dashboard/qr",              done: Boolean(barbershop?.slug && barbershop?.name), description: "Copia el link público y úsalo en bio o stories.",       actionLabel: "Copiar link"        },
    { label: "Activar recordatorios",       href: "/dashboard/automatizaciones",done: confirmedUpcomingCount > 0,                    description: "Reduce olvidos confirmando próximas citas.",             actionLabel: "Ver recordatorios"  },
    { label: "Lanzar primera promoción",    href: "/dashboard/marketing",       done: totalClientsCount > 0 && totalFreeSlotsToday > 0, description: "Usa huecos o clientes dormidos para crear demanda.", actionLabel: "Crear promoción"    },
  ];

  // Suppress unused variable warnings — kept for future use or conditional display
  void recurrentClientsCount;
  void reviewsCount;
  void noShowsMonthCount;
  void weekApptsCount;
  void topDailyBarber;

  const activationPercent = Math.round((activationItems.filter((i) => i.done).length / activationItems.length) * 100);

  // ─── JSX ─────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* 1 ── Hero compacto */}
      <section className="surface-frame overflow-hidden p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="label-section">{formatDateSpanish(today)}</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-[#111111] md:text-4xl">
              {barbershop?.name ?? "Tu barbería"}
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              Esto es lo que está pasando hoy en tu barbería.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/dashboard/agenda" className="btn-dark">
              Ver agenda hoy
            </Link>
            <Link href="/dashboard/qr" className="btn-outline">
              <QrCode size={15} /> QR
            </Link>
            <Link href={publicBookingUrl} target="_blank" className="btn-outline">
              Página pública <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Agentes IA — inline, no sección separada */}
        <Link
          href="/dashboard/agents"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-[#D5A84C]/20 bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-4 py-3 transition-colors hover:border-[#D5A84C]/40 hover:from-[#111f3d]"
        >
          <Sparkles size={14} className="shrink-0 text-[#C9922A]" />
          <span className="text-xs font-semibold text-white/70">
            <span className="font-bold text-[#D4AF66]">4 Agentes IA activos</span>
            {" — Retención · Huecos · Reseñas · Marketing"}
          </span>
          <ArrowRight size={12} className="ml-auto shrink-0 text-white/40" />
        </Link>
      </section>

      {/* 2 ── Acciones rápidas */}
      <QuickActionsRow services={quickServices} barbers={quickBarbers} />

      {/* 3 ── KPI Bar — 4 métricas del día */}
      <PremiumDashboardMotion className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PremiumDashboardItem>
          <StatCard
            kicker="Ingresos de hoy"
            title="Caja del día"
            value={formatCurrency(salesToday)}
            hint={
              cashSessionOpen
                ? `Sesión abierta · ${clientsAttendedToday} clientes atendidos`
                : "Sesión cerrada — abre antes de cobrar"
            }
            icon={Wallet}
            iconBg={cashSessionOpen ? "bg-emerald-50" : "bg-amber-50"}
            iconColor={cashSessionOpen ? "text-emerald-600" : "text-amber-700"}
            tone={cashSessionOpen ? "success" : "warning"}
            className="shadow-[inset_4px_0_0_rgba(212,175,102,0.45)]"
            footer={
              <Link href="/dashboard/caja" className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                Ver caja <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>

        <PremiumDashboardItem>
          <StatCard
            kicker="Agenda de hoy"
            title="Reservas activas"
            value={String(todayAppointments.length)}
            hint={
              todayAppointments.length > 0
                ? `${confirmedUpcomingCount} citas futuras confirmadas`
                : "Sin reservas hoy — revisa huecos libres"
            }
            icon={CalendarCheck}
            iconBg="bg-[#C9922A]/10"
            iconColor="text-[#C9922A]"
            footer={
              <Link href="/dashboard/agenda" className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                Abrir agenda <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>

        <PremiumDashboardItem>
          <StatCard
            kicker="Oportunidad"
            title="Huecos libres hoy"
            value={String(totalFreeSlotsToday)}
            hint={
              totalFreeSlotsToday > 0
                ? `${barberWithMostSlots?.barberName ?? "Equipo"} tiene más disponibilidad`
                : "Agenda completa hoy"
            }
            icon={Clock}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            footer={
              <Link href="/dashboard/agents" className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                Llenar huecos <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>

        <PremiumDashboardItem>
          <StatCard
            kicker="Retención"
            title="Clientes para recuperar"
            value={String(dormantClientsCount)}
            hint={
              dormantClientsCount > 0
                ? "Más de 45 días sin visita registrada"
                : "Sin clientes dormidos detectados"
            }
            icon={Users}
            iconBg="bg-[#C89B3C]/10"
            iconColor="text-[#8A641F]"
            footer={
              <Link href="/dashboard/recuperacion" className="inline-flex items-center gap-1 text-xs font-black text-slate-700">
                Ver clientes <ArrowRight size={12} />
              </Link>
            }
          />
        </PremiumDashboardItem>
      </PremiumDashboardMotion>

      {/* 4 ── Agenda de hoy + Panel lateral */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_0.75fr]">

        {/* Agenda de hoy */}
        <div className="surface-frame overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-section">Reservas de hoy</p>
                <h2 className="section-heading mt-1">Lo próximo en agenda</h2>
              </div>
              <Link href="/dashboard/agenda" className="btn-outline px-4 py-2.5">
                Ver agenda completa <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="p-5 md:p-6">
              <EmptyState
                icon={CalendarCheck}
                title="Sin reservas activas hoy"
                description="Usa el Agente Huecos para generar el copy de Instagram y WhatsApp en segundos, o comparte tu QR."
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
              {todayAppointments.slice(0, 6).map((appointment) => (
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
                      {appointment.services?.name ?? "Sin servicio"} · {appointment.barbers?.name ?? "Sin barbero"}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Panel lateral — acción recomendada + caja */}
        <div className="flex flex-col gap-4">
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
                ? "Activa el Agente Retención IA para preparar mensajes personalizados. El 30% vuelve."
                : totalFreeSlotsToday > 0
                ? "El Agente Huecos genera el copy de Stories y WhatsApp en 10 segundos."
                : "Las reseñas de Google determinan si te encuentran. Un mensaje bien redactado tarda 10 segundos."
            }
            cta="Ver agentes IA"
            ctaHref="/dashboard/agents"
            icon={dormantClientsCount > 0 ? RotateCcw : totalFreeSlotsToday > 0 ? Clock : Star}
            variant="gold"
          />

          {/* Caja resumen */}
          <div className="surface-frame p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="label-section">Caja del día</p>
                <p className="mt-2 font-display text-4xl font-black leading-none text-slate-900">
                  {formatCurrency(salesToday)}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {cashSessionOpen
                    ? "Sesión abierta. Mantén cobros sincronizados."
                    : "La caja está cerrada. Ábrela antes de cobrar."}
                </p>
              </div>
              <div className={cashSessionOpen ? "badge-success" : "badge-warning"}>
                {cashSessionOpen ? "Abierta" : "Cerrada"}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase text-slate-600">Clientes</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{clientsAttendedToday}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase text-slate-600">Efectivo</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{cashPaymentsCount}</p>
              </div>
            </div>
            <Link href="/dashboard/caja" className="btn-dark mt-4 w-full">
              Ir a Caja <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5 ── Barberos hoy */}
      <BarberPerformance items={barberPerformanceItems} compact />

      {/* 6 ── Checklist de configuración — solo si activación incompleta */}
      {activationPercent < 80 && (
        <ActivationChecklist percent={activationPercent} items={activationItems} />
      )}

    </div>
  );
}
