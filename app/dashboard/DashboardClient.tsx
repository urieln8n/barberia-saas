"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Clapperboard,
  Gift,
  Monitor,
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
  TrendingUp,
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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 13) return "Buenos días";
  if (h < 21) return "Buenas tardes";
  return "Buenas noches";
}

// ─── OccupancyBar ─────────────────────────────────────────────────────────────

function OccupancyBar({ pct }: { pct: number }) {
  const color =
    pct >= 80 ? "from-emerald-500 to-emerald-400" :
    pct >= 50 ? "from-[#C9A227] to-[#F5D76E]" :
                "from-slate-300 to-slate-200";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  );
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
    return mins >= -15;
  });
  const minsUntilNext = nextAppointment ? getMinutesUntil(nextAppointment.start_time) : null;

  // ── Ocupación y revenue estimado ─────────────────────────────────────────
  const totalSlotsToday = todayAppointments.length + totalFreeSlotsToday;
  const occupancyPct = totalSlotsToday > 0
    ? Math.round((todayAppointments.length / totalSlotsToday) * 100)
    : 0;
  const estimatedRevenue = salesToday > 0
    ? salesToday
    : todayAppointments.reduce((s, a) => s + (a.services?.price ?? 0), 0);
  const greeting = getGreeting();

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
    <div className="space-y-4">

      {/* ══════════════════════════════════════════════════════════════════
          EXECUTIVE HEADER — Stripe/Linear/Apple Wallet inspired
          Compacto, denso, toda la info del día visible sin scroll.
      ══════════════════════════════════════════════════════════════════ */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.04)]">

        {/* ── Fila 1: Saludo + fecha + status pills ── */}
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4 md:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B8A990]">
              {greeting} · {formatDateSpanish(today)}
            </p>
            <h1 className="mt-0.5 truncate text-xl font-black tracking-tight text-[#111111] md:text-2xl">
              {barbershop?.name ?? "Tu barbería"}
            </h1>
          </div>

          {/* Status chips — desktop */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <span className={`inline-flex h-7 items-center rounded-full border px-2.5 text-[10px] font-black ${
              cashSessionOpen
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}>
              Caja {cashSessionOpen ? "abierta" : "cerrada"}
            </span>
            <Link
              href="/dashboard/qr"
              className="flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2.5 text-[10px] font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
            >
              <QrCode size={11} /> QR
            </Link>
            <Link
              href={publicBookingUrl}
              target="_blank"
              className="flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2.5 text-[10px] font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
            >
              Web <ArrowRight size={9} />
            </Link>
          </div>
        </div>

        {/* ── Fila 2: 3 métricas inline ── */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 pb-3 md:px-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tabular-nums text-[#111111]">
              {todayAppointments.length}
            </span>
            <span className="text-xs text-slate-500">reservas hoy</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tabular-nums text-[#C9922A]">
              {formatCurrency(estimatedRevenue)}
            </span>
            <span className="text-xs text-slate-500">
              {salesToday > 0 ? "cobrados" : "previstos"}
            </span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tabular-nums text-slate-700">
              {clientsAttendedToday}
            </span>
            <span className="text-xs text-slate-500">atendidos</span>
          </div>
        </div>

        {/* ── Fila 3: Barra de ocupación ── */}
        <div className="px-5 pb-3 md:px-6">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
              Ocupación del día
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-slate-700">{occupancyPct}%</span>
              {/* TODO: conectar variación real comparando con semana anterior */}
              {occupancyPct > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                  <TrendingUp size={10} />
                  {occupancyPct >= 80 ? "Alta demanda" : occupancyPct >= 50 ? "Buena ocupación" : "Huecos disponibles"}
                </span>
              )}
            </div>
          </div>
          <OccupancyBar pct={occupancyPct} />
          {totalFreeSlotsToday > 0 && (
            <p className="mt-1 text-[10px] text-slate-400">
              {totalFreeSlotsToday} huecos libres · {todayAppointments.length} de {totalSlotsToday} ocupados
            </p>
          )}
        </div>

        {/* ── Fila 4: CTAs + próxima cita chip ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-[#FAFAF8] px-5 py-3 md:px-6">
          {/* CTAs */}
          <div className="flex flex-wrap gap-2">
            {/* CTA principal dorado — "Nueva Reserva" */}
            <Link
              href="/dashboard/reservas"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#C9A227] px-4 text-[13px] font-black text-[#111111] shadow-[0_2px_8px_rgba(201,162,39,0.30)] transition hover:-translate-y-px hover:bg-[#D4AF37] hover:shadow-[0_4px_12px_rgba(201,162,39,0.40)] active:scale-[0.98]"
            >
              <Plus size={13} strokeWidth={2.5} />
              Nueva Reserva
            </Link>
            <Link
              href="/dashboard/agenda"
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              Ver agenda hoy
            </Link>
          </div>

          {/* Próxima cita chip */}
          {nextAppointment ? (
            <Link
              href="/dashboard/agenda"
              className="flex items-center gap-2.5 rounded-xl border border-[#D4AF37]/25 bg-[#FFFBEB] px-3 py-1.5 transition hover:border-[#D4AF37]/50 hover:bg-[#FFF8E1]"
            >
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#C9922A]">
                  {minsUntilNext !== null && minsUntilNext >= 0
                    ? `en ${minsUntilNext} min`
                    : "Ahora"}
                </span>
                <span className="text-[12px] font-black text-slate-900 leading-tight">
                  {formatTime(nextAppointment.start_time)} — {nextAppointment.clients?.name ?? "Cliente"}
                </span>
                <span className="text-[10px] text-slate-500">
                  {nextAppointment.services?.name ?? "Sin servicio"}
                  {nextAppointment.services?.price != null && (
                    <> · <span className="font-bold text-emerald-600">{formatCurrency(nextAppointment.services.price)}</span></>
                  )}
                </span>
              </div>
              <ArrowRight size={12} className="shrink-0 text-[#C9922A]" />
            </Link>
          ) : (
            <Link
              href={publicBookingUrl}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            >
              Sin citas activas · Compartir link <ArrowRight size={10} />
            </Link>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          KPI CARDS — 4 tarjetas compactas (de 6 a 4, -33% altura)
          Layout: 2×2 en mobile, 4 columnas en desktop
      ══════════════════════════════════════════════════════════════════ */}
      <PremiumDashboardMotion className="grid gap-3 grid-cols-2 xl:grid-cols-4">

        {/* KPI 1 — Caja */}
        <PremiumDashboardItem>
          <Link href="/dashboard/caja" className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Caja del día</p>
                  <p className="mt-2 text-[1.65rem] font-black tabular-nums leading-none text-[#111111]">
                    {formatCurrency(salesToday)}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {cashSessionOpen
                      ? <span className="text-emerald-600 font-semibold">Sesión abierta</span>
                      : <span className="text-amber-600 font-semibold">Sesión cerrada</span>}
                    {clientsAttendedToday > 0 && ` · ${clientsAttendedToday} clientes`}
                  </p>
                </div>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cashSessionOpen ? "bg-emerald-50" : "bg-amber-50"}`}>
                  <Wallet size={16} className={cashSessionOpen ? "text-emerald-600" : "text-amber-500"} />
                </div>
              </div>
              {/* Mini barra de progreso caja */}
              {salesToday > 0 && (
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300" style={{ width: "100%" }} />
                </div>
              )}
            </div>
          </Link>
        </PremiumDashboardItem>

        {/* KPI 2 — Reservas + ocupación */}
        <PremiumDashboardItem>
          <Link href="/dashboard/agenda" className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Reservas hoy</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-[1.65rem] font-black tabular-nums leading-none text-[#111111]">
                      {todayAppointments.length}
                    </p>
                    <span className="text-xs font-bold text-slate-400">
                      / {totalSlotsToday > 0 ? totalSlotsToday : "—"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {confirmedUpcomingCount > 0
                      ? `${confirmedUpcomingCount} confirmadas`
                      : "Sin pendientes"}
                  </p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <CalendarCheck size={16} className="text-blue-600" />
                </div>
              </div>
              {/* Barra ocupación inline */}
              <div className="mt-3">
                <OccupancyBar pct={occupancyPct} />
                <p className="mt-1 text-[10px] text-slate-400">{occupancyPct}% ocupado</p>
              </div>
            </div>
          </Link>
        </PremiumDashboardItem>

        {/* KPI 3 — Huecos libres */}
        <PremiumDashboardItem>
          <Link href="/dashboard/huecos" className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Huecos libres</p>
                  <p className={`mt-2 text-[1.65rem] font-black tabular-nums leading-none ${totalFreeSlotsToday > 0 ? "text-violet-600" : "text-slate-400"}`}>
                    {totalFreeSlotsToday}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {totalFreeSlotsToday > 0
                      ? barberWithMostSlots
                        ? `Más: ${barberWithMostSlots.barberName}`
                        : "Disponibles hoy"
                      : "Agenda completa"}
                  </p>
                </div>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${totalFreeSlotsToday > 0 ? "bg-violet-50" : "bg-slate-100"}`}>
                  <Clock size={16} className={totalFreeSlotsToday > 0 ? "text-violet-600" : "text-slate-400"} />
                </div>
              </div>
              {totalFreeSlotsToday > 0 && (
                <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-violet-600">
                  <Clapperboard size={10} />
                  <span>Crea una promo para llenarlos</span>
                </div>
              )}
            </div>
          </Link>
        </PremiumDashboardItem>

        {/* KPI 4 — Clientes + equipo */}
        <PremiumDashboardItem>
          <Link href="/dashboard/clientes" className="group block">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Clientes</p>
                  <p className="mt-2 text-[1.65rem] font-black tabular-nums leading-none text-[#111111]">
                    {totalClientsCount}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {dormantClientsCount > 0
                      ? <span className="text-amber-600 font-semibold">{dormantClientsCount} sin volver +45d</span>
                      : "Base activa"}
                  </p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <Users size={16} className="text-slate-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Scissors size={10} />
                  {activeBarbersCount} barberos · {activeServicesCount} servicios
                </span>
              </div>
            </div>
          </Link>
        </PremiumDashboardItem>

      </PremiumDashboardMotion>

      {/* ── ACCIONES RÁPIDAS ──────────────────────────────────────────────── */}
      <QuickActionsRow services={quickServices} barbers={quickBarbers} />

      {/* ── STUDIO IA + SALA DE ESPERA + FIDELIZACIÓN ────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">

        {/* Studio IA card */}
        <Link
          href="/dashboard/studio"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6D28D9] to-[#5B21B6] p-5 text-white shadow-lg shadow-violet-200/50 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-200/70 sm:col-span-1"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#A78BFA]/20" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                <Clapperboard size={14} />
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide">
                Nuevo
              </span>
            </div>
            <p className="text-xs font-black text-white/70">Studio IA</p>
            <p className="mt-1 text-sm font-black leading-snug">
              Crea un reel para llenar huecos esta semana
            </p>
            <p className="mt-1.5 text-[11px] text-white/60">
              Genera una promo lista para Instagram, TikTok o WhatsApp en minutos.
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-black text-white/80 group-hover:text-white">
              Crear video ahora <ArrowRight size={11} />
            </div>
          </div>
        </Link>

        {/* Sala de espera card */}
        <Link
          href="/dashboard/lounge"
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
        >
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
            <Monitor size={14} className="text-slate-600" />
          </div>
          <p className="text-xs font-black text-slate-500">Sala de espera</p>
          <p className="mt-1 text-sm font-black text-slate-900 leading-snug">
            Activa ventas mientras tus clientes esperan
          </p>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Muestra productos, promos y QR de reserva en pantalla.
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-black text-slate-600 group-hover:text-slate-900">
            Configurar <ArrowRight size={11} />
          </div>
        </Link>

        {/* Fidelización card */}
        <Link
          href="/dashboard/fidelizacion"
          className="group relative overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#FFFBEB] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37]/50 hover:shadow-md"
        >
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4AF37]/15">
            <Gift size={14} className="text-[#C9922A]" />
          </div>
          <p className="text-xs font-black text-[#C9922A]">Fidelización</p>
          <p className="mt-1 text-sm font-black text-slate-900 leading-snug">
            Premia a tus clientes y haz que vuelvan
          </p>
          <p className="mt-1.5 text-[11px] text-slate-600">
            Tarjetas de sellos, puntos y recompensas activadas.
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-black text-[#C9922A] group-hover:text-[#92650A]">
            Ver fidelización <ArrowRight size={11} />
          </div>
        </Link>
      </div>

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
