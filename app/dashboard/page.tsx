import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildBarberPerformance } from "@/src/lib/cash/barber-performance";
import { buildTodayBarberAvailability } from "@/src/lib/booking/barber-availability";
import { DashboardClient } from "./DashboardClient";

export const revalidate = 60;

type Relation<T> = T | T[] | null | undefined;

type AppointmentItem = {
  id: string;
  client_id: string | null;
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
    client_id:        item.client_id ?? null,
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
      .select(`id, client_id, barber_id, appointment_date, start_time, end_time, status,
        clients (name, phone), services (name, price), barbers (name)`)
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today)
      .in("status", ["scheduled", "confirmed"] as const)
      .order("start_time", { ascending: true }),

    supabase.from("appointments")
      .select(`id, client_id, appointment_date, start_time, end_time, status,
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

  // ─── Render — pasar todos los datos a DashboardClient ─────────────────────

  return (
    <DashboardClient
      barbershop={barbershop}
      today={today}
      todayAppointments={todayAppointments}
      upcomingAppointments={upcomingAppointments}
      salesToday={salesToday}
      todayRevenue={todayRevenue}
      activeServicesCount={activeServicesCount}
      activeBarbersCount={activeBarbersCount}
      totalClientsCount={totalClientsCount}
      dormantClientsCount={dormantClientsCount}
      totalFreeSlotsToday={totalFreeSlotsToday}
      confirmedUpcomingCount={confirmedUpcomingCount}
      cashSessionOpen={cashSessionOpen}
      clientsAttendedToday={clientsAttendedToday}
      cashPaymentsCount={cashPaymentsCount}
      barberPerformanceItems={barberPerformanceItems}
      todayAvailabilityItems={todayAvailabilityItems}
      activationItems={activationItems}
      activationPercent={activationPercent}
      publicBookingUrl={publicBookingUrl}
      hasPublicBooking={hasPublicBooking}
      quickServices={quickServices}
      quickBarbers={quickBarbers}
      barberWithMostSlots={barberWithMostSlots}
    />
  );
}
