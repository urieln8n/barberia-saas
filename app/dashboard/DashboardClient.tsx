"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Users,
  Clock,
  Wallet,
  QrCode,
  ArrowRight,
  Plus,
  Sparkles,
  Star,
  RotateCcw,
  Bell,
  Scissors,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
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
import type { BarberPerformanceItem } from "@/src/lib/cash/barber-performance";
import type { BarberAvailabilityItem } from "@/src/lib/booking/barber-availability";
import type { ActivationChecklistItem } from "@/components/dashboard/ActivationChecklist";

// ─── Tipos ───────────────────────────────────────────────────────────────────

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

export type DashboardClientProps = {
  barbershop: { id: string; name: string; slug: string } | null;
  today: string;
  todayAppointments: AppointmentItem[];
  upcomingAppointments: AppointmentItem[];
  salesToday: number;
  todayRevenue: number;
  activeServicesCount: number;
  activeBarbersCount: number;
  totalClientsCount: number;
  dormantClientsCount: number;
  totalFreeSlotsToday: number;
  confirmedUpcomingCount: number;
  cashSessionOpen: boolean;
  clientsAttendedToday: number;
  cashPaymentsCount: number;
  barberPerformanceItems: BarberPerformanceItem[];
  todayAvailabilityItems: BarberAvailabilityItem[];
  activationItems: ActivationChecklistItem[];
  activationPercent: number;
  publicBookingUrl: string;
  hasPublicBooking: boolean;
  quickServices: { id: string; name: string; duration_minutes: number | null; price: number | null }[];
  quickBarbers: { id: string; name: string }[];
  barberWithMostSlots: BarberAvailabilityItem | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return `${value.toFixed(0)} €`;
}

function formatTime(time?: string | null) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

function formatDateSpanish(iso: string): string {
  const [year, month, day] = iso.split("-");
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return `${days[date.getDay()]}, ${Number(day)} de ${months[Number(month) - 1]}`;
}

function getMinutesUntil(startTime: string): number {
  const now = new Date();
  const [h, m] = startTime.split(":");
  const appt = new Date();
  appt.setHours(Number(h), Number(m), 0, 0);
  return Math.round((appt.getTime() - now.getTime()) / 60000);
}

// ─── Sub-componentes internos ─────────────────────────────────────────────────

// Card de KPI compacto
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  href,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  iconColor: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{label}</p>
          <Icon size={15} className={iconColor} />
        </div>
        <p className="mt-2.5 text-3xl font-black tabular-nums text-slate-900">{value}</p>
        <p className="mt-0.5 truncate text-xs text-slate-400">{sub}</p>
      </div>
    </Link>
  );
}

// Card de cita compacto
function AppointmentCard({ appointment }: { appointment: AppointmentItem }) {
  const precio = appointment.services?.price;
  return (
    <article className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-colors hover:border-slate-200 hover:bg-slate-50">
      <div className="w-12 shrink-0 text-center">
        <p className="text-sm font-black text-slate-900">{formatTime(appointment.start_time)}</p>
        <p className="text-[10px] text-slate-400">hoy</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-900">
          {appointment.clients?.name ?? "Cliente sin nombre"}
        </p>
        <p className="truncate text-xs text-slate-500">
          {appointment.services?.name ?? "Sin servicio"} · {appointment.barbers?.name ?? "Sin barbero"}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {precio != null && (
          <span className="text-sm font-bold text-emerald-600">{formatCurrency(precio)}</span>
        )}
        <StatusBadge status={appointment.status} />
      </div>
    </article>
  );
}

// Alerta contextual
type AlertType = "warning" | "info" | "success" | "error";

function AlertBanner({
  type,
  text,
  action,
  href,
}: {
  type: AlertType;
  text: string;
  action?: string;
  href?: string;
}) {
  const styles: Record<AlertType, { wrapper: string; icon: React.ReactNode }> = {
    warning: {
      wrapper: "border-amber-200 bg-amber-50 text-amber-800",
      icon: <AlertTriangle size={14} className="shrink-0 text-amber-600" />,
    },
    info: {
      wrapper: "border-blue-200 bg-blue-50 text-blue-800",
      icon: <Info size={14} className="shrink-0 text-blue-600" />,
    },
    success: {
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
      icon: <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />,
    },
    error: {
      wrapper: "border-red-200 bg-red-50 text-red-800",
      icon: <XCircle size={14} className="shrink-0 text-red-600" />,
    },
  };

  const s = styles[type];

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold ${s.wrapper}`}>
      {s.icon}
      <span className="flex-1">{text}</span>
      {action && href && (
        <Link href={href} className="ml-2 shrink-0 font-black underline underline-offset-2 hover:no-underline">
          {action} →
        </Link>
      )}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function DashboardClient({
  barbershop,
  today,
  todayAppointments,
  upcomingAppointments,
  salesToday,
  activeServicesCount,
  activeBarbersCount,
  totalClientsCount,
  dormantClientsCount,
  totalFreeSlotsToday,
  confirmedUpcomingCount,
  cashSessionOpen,
  clientsAttendedToday,
  cashPaymentsCount,
  barberPerformanceItems,
  activationItems,
  activationPercent,
  publicBookingUrl,
  quickServices,
  quickBarbers,
  barberWithMostSlots,
}: DashboardClientProps) {

  // ── Próxima cita ──────────────────────────────────────────────────────────
  const nextAppointment = todayAppointments.find((a) => {
    const mins = getMinutesUntil(a.start_time ?? "00:00");
    return mins >= -15; // incluir citas que empezaron hace menos de 15 min
  });
  const minsUntilNext = nextAppointment ? getMinutesUntil(nextAppointment.start_time) : null;

  // ── Alertas contextuales ─────────────────────────────────────────────────
  const alerts: Array<{ type: AlertType; text: string; action?: string; href?: string }> = [];

  if (!cashSessionOpen && salesToday === 0) {
    alerts.push({
      type: "warning",
      text: "La caja está cerrada. Ábrela para registrar cobros.",
      action: "Ir a caja",
      href: "/dashboard/caja",
    });
  }
  if (dormantClientsCount > 0) {
    alerts.push({
      type: "info",
      text: `${dormantClientsCount} clientes sin volver hace +45 días — reactívalos.`,
      action: "Ver clientes",
      href: "/dashboard/recuperacion",
    });
  }
  if (totalFreeSlotsToday > 0) {
    alerts.push({
      type: "success",
      text: `${totalFreeSlotsToday} huecos libres hoy — puedes rellenarlos con WhatsApp o Instagram.`,
      action: "Ver huecos",
      href: "/dashboard/huecos",
    });
  }
  if (confirmedUpcomingCount > 0) {
    alerts.push({
      type: "info",
      text: `${confirmedUpcomingCount} reservas confirmadas próximas pendientes de gestión.`,
      action: "Ver agenda",
      href: "/dashboard/agenda",
    });
  }

  // máx 4 alertas
  const visibleAlerts = alerts.slice(0, 4);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = [
    {
      label: "Caja del día",
      value: formatCurrency(salesToday),
      icon: Wallet,
      iconColor: cashSessionOpen ? "text-emerald-600" : "text-amber-600",
      sub: cashSessionOpen
        ? `${clientsAttendedToday} clientes · sesión abierta`
        : "Sesión cerrada",
      href: "/dashboard/caja",
    },
    {
      label: "Reservas hoy",
      value: todayAppointments.length,
      icon: CalendarCheck,
      iconColor: "text-blue-600",
      sub:
        todayAppointments.length === 0
          ? "Sin reservas activas"
          : `${confirmedUpcomingCount} confirmadas`,
      href: "/dashboard/agenda",
    },
    {
      label: "Huecos libres",
      value: totalFreeSlotsToday,
      icon: Clock,
      iconColor: totalFreeSlotsToday > 0 ? "text-violet-600" : "text-slate-400",
      sub:
        totalFreeSlotsToday > 0
          ? barberWithMostSlots
            ? `${barberWithMostSlots.barberName} tiene más disponibilidad`
            : "Puedes rellenarlos hoy"
          : "Agenda completa",
      href: "/dashboard/huecos",
    },
    {
      label: "Clientes",
      value: totalClientsCount,
      icon: Users,
      iconColor: "text-slate-500",
      sub:
        dormantClientsCount > 0
          ? `${dormantClientsCount} sin volver +45 días`
          : "Base activa",
      href: "/dashboard/clientes",
    },
    {
      label: "Equipo activo",
      value: activeBarbersCount,
      icon: Scissors,
      iconColor: "text-slate-500",
      sub:
        activeServicesCount > 0
          ? `${activeServicesCount} servicios activos`
          : "Sin servicios",
      href: "/dashboard/barberos",
    },
    {
      label: "Pendientes",
      value: confirmedUpcomingCount,
      icon: Bell,
      iconColor: confirmedUpcomingCount > 0 ? "text-amber-600" : "text-slate-400",
      sub:
        confirmedUpcomingCount > 0
          ? "Próximas confirmadas"
          : "Todo al día",
      href: "/dashboard/reservas",
    },
  ] as const;

  return (
    <div className="space-y-6">

      {/* ── A. HEADER PREMIUM ─────────────────────────────────────────────── */}
      <section className="surface-frame overflow-hidden">
        {/* Top band */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3 md:px-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#C9922A]">
              {formatDateSpanish(today)}
            </p>
            <div className="flex items-center gap-2">
              {cashSessionOpen !== undefined && (
                <span
                  className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[10px] font-black ${
                    cashSessionOpen
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  Caja {cashSessionOpen ? "abierta" : "cerrada"}
                </span>
              )}
              <Link
                href="/dashboard/qr"
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              >
                <QrCode size={13} /> QR
              </Link>
              <Link
                href={publicBookingUrl}
                target="_blank"
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              >
                Web pública <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="px-6 pb-5 pt-6 md:px-8 md:pb-6 md:pt-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1
                className="font-display font-black leading-[0.95] text-slate-900 tracking-tight"
                style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", letterSpacing: "-0.04em" }}
              >
                {barbershop?.name ?? "Tu barbería"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Así va tu barbería hoy · Todo bajo control.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link href="/dashboard/agenda" className="btn-dark">
                Ver agenda hoy
              </Link>
              <Link
                href="/dashboard/reservas"
                className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/8 px-4 py-2.5 text-sm font-bold text-[#C9922A] transition hover:bg-[#D4AF37]/14 hover:border-[#D4AF37]/50"
              >
                <Plus size={14} />
                Nueva cita
              </Link>
            </div>
          </div>

          {/* Agentes IA inline */}
          <Link
            href="/dashboard/agents"
            className="mt-5 flex items-center gap-3 rounded-2xl border border-[#D4AF37]/22 bg-[#FDFAF3] px-4 py-3 transition-all hover:border-[#D4AF37]/38 hover:bg-[#FDF8EC] hover:shadow-[0_2px_8px_rgba(212,175,55,0.10)]"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#D4AF37]/20 bg-[#D4AF37]/12">
              <Sparkles size={13} className="text-[#C9922A]" />
            </div>
            <span className="text-xs text-slate-600">
              <span className="font-black text-slate-900">4 Agentes IA activos</span>
              {" — Retención · Huecos · Reseñas · Marketing"}
            </span>
            <ArrowRight size={12} className="ml-auto shrink-0 text-slate-400" />
          </Link>
        </div>
      </section>

      {/* ── B. BLOQUE "AHORA MISMO" (protagonista) ──────────────────────── */}
      {nextAppointment ? (
        <section className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#FDF8EE] to-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#C9922A]">
                {minsUntilNext !== null && minsUntilNext >= 0
                  ? `Próxima cita en ${minsUntilNext} min`
                  : "En curso ahora mismo"}
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900">
                {nextAppointment.clients?.name ?? "Cliente sin nombre"}
              </h2>
              <p className="mt-0.5 text-sm text-slate-600">
                {nextAppointment.services?.name ?? "Sin servicio"}
                {nextAppointment.services?.price != null && (
                  <> · <span className="font-bold text-emerald-600">{formatCurrency(nextAppointment.services.price)}</span></>
                )}
                {nextAppointment.barbers?.name && (
                  <> · {nextAppointment.barbers.name}</>
                )}
              </p>
              <p className="mt-1 text-sm font-black text-slate-700">
                {formatTime(nextAppointment.start_time)}
                {nextAppointment.end_time && ` → ${formatTime(nextAppointment.end_time)}`}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <StatusBadge status={nextAppointment.status} />
              <Link
                href="/dashboard/agenda"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 text-xs font-black text-white transition hover:bg-slate-700"
              >
                Ver en agenda <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Ahora mismo
              </p>
              <p className="mt-1 font-black text-slate-700">Sin más citas hoy</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Comparte tu link para captar reservas de última hora.
              </p>
            </div>
            <Link
              href={publicBookingUrl}
              target="_blank"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Link de reserva <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* ── C. 6 KPI CARDS EN GRID ──────────────────────────────────────── */}
      <PremiumDashboardMotion className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <PremiumDashboardItem key={kpi.label}>
            <KpiCard {...kpi} />
          </PremiumDashboardItem>
        ))}
      </PremiumDashboardMotion>

      {/* ── ACCIONES RÁPIDAS ──────────────────────────────────────────────── */}
      <QuickActionsRow services={quickServices} barbers={quickBarbers} />

      {/* ── D. AGENDA DEL DÍA + PANEL LATERAL ──────────────────────────── */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_0.75fr]">

        {/* Agenda del día compacta */}
        <div className="surface-frame overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-section">Reservas de hoy</p>
                <h2 className="section-heading mt-1">
                  {todayAppointments.length > 0
                    ? `${todayAppointments.length} citas en agenda`
                    : "Lo próximo en agenda"}
                </h2>
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
              <div className="grid gap-2 p-4 md:p-5">
                {todayAppointments.slice(0, 8).map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
              {todayAppointments.length > 8 && (
                <div className="px-5 py-3">
                  <Link
                    href="/dashboard/agenda"
                    className="inline-flex items-center gap-1 text-xs font-black text-[#C9922A] hover:underline"
                  >
                    Ver todas {todayAppointments.length} reservas <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="flex flex-col gap-4">
          {/* Acción recomendada IA */}
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

          {/* Resumen de caja */}
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

          {/* Alertas inteligentes */}
          {visibleAlerts.length > 0 && (
            <div className="surface-frame p-4 md:p-5">
              <p className="label-section mb-3">Alertas del día</p>
              <div className="flex flex-col gap-2">
                {visibleAlerts.map((alert, i) => (
                  <AlertBanner key={i} {...alert} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── E. KPI PREMIUM (4 cards grandes con StatCard) ────────────────── */}
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

      {/* ── F. RENDIMIENTO DEL EQUIPO ────────────────────────────────────── */}
      <BarberPerformance items={barberPerformanceItems} compact />

      {/* ── G. CHECKLIST DE ACTIVACIÓN (solo si < 80%) ───────────────────── */}
      {activationPercent < 80 && (
        <ActivationChecklist percent={activationPercent} items={activationItems} />
      )}

      {/* ── H. UPCOMING — próximas reservas (si hay más allá de hoy) ─────── */}
      {upcomingAppointments.length > 0 && (
        <section className="surface-frame overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 md:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="label-section">Próximas reservas</p>
                <h2 className="section-heading mt-1">Confirmadas próximamente</h2>
              </div>
              <Link href="/dashboard/reservas" className="btn-outline px-4 py-2.5">
                Ver todas <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="grid gap-2 p-4 md:p-5">
            {upcomingAppointments.slice(0, 5).map((appointment) => (
              <article
                key={appointment.id}
                className="grid gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:grid-cols-[100px_1fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-xs font-black text-slate-900">{appointment.appointment_date}</p>
                  <p className="text-xs text-slate-500">{formatTime(appointment.start_time)}</p>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900">
                    {appointment.clients?.name ?? "Cliente sin nombre"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {appointment.services?.name ?? "Sin servicio"} · {appointment.barbers?.name ?? "Sin barbero"}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </article>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
