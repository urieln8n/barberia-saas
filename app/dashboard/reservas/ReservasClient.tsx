"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  UserPlus,
  Scissors,
  User,
  Phone,
  MessageCircle,
  ChevronRight,
  QrCode,
  ArrowRight,
  X,
  AlertCircle,
  Star,
  Filter,
  Search,
  LayoutList,
  ExternalLink,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { updateReservationStatus } from "./actions";
import type {
  ReservationItem,
  ReservasKPIs,
  BarberFilter,
  ServiceFilter,
  AppointmentStatus,
} from "./page";

// ─── Types ─────────────────────────────────────────────────────────────────

type Props = {
  appointments: ReservationItem[];
  kpis: ReservasKPIs;
  barbers: BarberFilter[];
  services: ServiceFilter[];
  barbershopId: string;
};

type TabFilter = "all" | "today" | "week" | "pending" | "confirmed" | "completed" | "cancelled";

// ─── Helpers ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; cls: string }
> = {
  scheduled: {
    label: "Pendiente",
    cls: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  pending: {
    label: "Recibida",
    cls: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  confirmed: {
    label: "Confirmada",
    cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  completed: {
    label: "Completada",
    cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  cancelled: {
    label: "Cancelada",
    cls: "bg-red-500/10 text-red-300 border-red-500/20",
  },
  no_show: {
    label: "No asistió",
    cls: "bg-white/[0.05] text-white/35 border-white/10",
  },
};

const SOURCE_LABELS: Record<string, string> = {
  public_booking: "Web",
  qr: "QR",
  instagram: "Instagram",
  google: "Google",
  whatsapp: "WhatsApp",
  dashboard: "Panel",
  other: "Otro",
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

function getTodayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
}

function whatsappHref(phone: string | null, name: string): string | null {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (!digits) return null;
  const msg = encodeURIComponent(
    `Hola ${name}, te escribimos de la barbería sobre tu cita.`
  );
  return `https://wa.me/${digits}?text=${msg}`;
}

// ─── KPI Card ──────────────────────────────────────────────────────────────

type KpiCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: "blue" | "emerald" | "amber" | "green" | "red" | "violet";
};

const COLOR_MAP: Record<
  KpiCardProps["color"],
  { bg: string; icon: string; ring: string }
> = {
  blue: {
    bg: "bg-blue-500/15",
    icon: "text-blue-300",
    ring: "ring-blue-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/15",
    icon: "text-emerald-300",
    ring: "ring-emerald-500/10",
  },
  amber: {
    bg: "bg-amber-500/15",
    icon: "text-amber-300",
    ring: "ring-amber-500/10",
  },
  green: {
    bg: "bg-green-500/15",
    icon: "text-green-300",
    ring: "ring-green-500/10",
  },
  red: { bg: "bg-red-500/15", icon: "text-red-300", ring: "ring-red-500/10" },
  violet: {
    bg: "bg-violet-500/15",
    icon: "text-violet-300",
    ring: "ring-violet-500/10",
  },
};

function KpiCard({ label, value, sub, icon: Icon, color }: KpiCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-5">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ring-4 ${c.bg} ${c.ring}`}
      >
        <Icon size={18} className={c.icon} />
      </div>
      <p
        className="tabular-nums text-2xl font-black tracking-tight text-white/90"
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-white/45">{label}</p>
      {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
    </div>
  );
}

// ─── Alert banner ──────────────────────────────────────────────────────────

function AlertBanner({
  pendingCount,
  upcomingNext3h,
  todayRevenue,
}: {
  pendingCount: number;
  upcomingNext3h: ReservationItem[];
  todayRevenue: number;
}) {
  const alerts: { icon: React.ElementType; msg: string; cls: string }[] = [];

  if (pendingCount > 0) {
    alerts.push({
      icon: Clock,
      msg: `Tienes ${pendingCount} reserva${pendingCount > 1 ? "s" : ""} pendiente${pendingCount > 1 ? "s" : ""} de confirmar.`,
      cls: "border-amber-500/20 bg-amber-500/[0.07] text-amber-300",
    });
  }
  if (upcomingNext3h.length > 0) {
    alerts.push({
      icon: AlertCircle,
      msg: `${upcomingNext3h.length} cita${upcomingNext3h.length > 1 ? "s" : ""} en las próximas 3 horas.`,
      cls: "border-blue-500/20 bg-blue-500/[0.07] text-blue-300",
    });
  }
  if (todayRevenue > 0) {
    alerts.push({
      icon: Banknote,
      msg: `Llevas ${formatCurrency(todayRevenue)} estimados hoy.`,
      cls: "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300",
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map(({ icon: Icon, msg, cls }) => (
        <div
          key={msg}
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium ${cls}`}
        >
          <Icon size={15} className="shrink-0" />
          {msg}
        </div>
      ))}
    </div>
  );
}

// ─── Status action button ───────────────────────────────────────────────────

function ActionButton({
  label,
  variant,
  onClick,
  isPending,
}: {
  label: string;
  variant: "primary" | "outline" | "danger" | "success" | "whatsapp";
  onClick: () => void;
  isPending?: boolean;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50";
  const variants: Record<typeof variant, string> = {
    primary:
      "bg-[#D4AF37] text-[#09090B] hover:bg-[#C9A130] border border-[#C9A130]/30",
    outline:
      "border border-white/[0.10] bg-white/[0.05] text-white/65 hover:bg-white/[0.09] hover:text-white/85",
    danger:
      "border border-red-500/20 bg-red-500/[0.08] text-red-300 hover:bg-red-500/[0.14]",
    success:
      "border border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300 hover:bg-emerald-500/[0.14]",
    whatsapp:
      "border border-green-500/20 bg-green-500/[0.08] text-green-300 hover:bg-green-500/[0.14]",
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]}`}
      onClick={onClick}
      disabled={isPending}
    >
      {isPending ? "..." : label}
    </button>
  );
}

// ─── Reservation Card ──────────────────────────────────────────────────────

type ReservationCardProps = {
  appt: ReservationItem;
  onSelect: (appt: ReservationItem) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  isPending: boolean;
};

function ReservationCard({
  appt,
  onSelect,
  onStatusChange,
  isPending,
}: ReservationCardProps) {
  const statusCfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.scheduled;
  const sourceLbl = appt.source ? SOURCE_LABELS[appt.source] ?? appt.source : null;
  const wa = whatsappHref(appt.client_phone, appt.client_name);
  const isNew = appt.client_visit_count === 1;
  const isVip = appt.client_visit_count >= 8;

  return (
    <article
      className="cursor-pointer rounded-2xl border border-white/[0.07] bg-white/[0.04] transition hover:border-[#D4AF37]/40 hover:bg-white/[0.06]"
      onClick={() => onSelect(appt)}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-black tabular-nums text-white/85">
            {formatTime(appt.start_time)}
          </span>
          <span className="text-xs text-white/25">·</span>
          <span className="truncate text-xs text-white/45">
            {formatDate(appt.appointment_date)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {sourceLbl && (
            <span className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold text-white/45">
              {sourceLbl}
            </span>
          )}
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusCfg.cls}`}
          >
            {statusCfg.label}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-1.5 px-4 py-3">
        {/* Client row */}
        <div className="flex items-center gap-2 min-w-0">
          <User size={13} className="shrink-0 text-white/35" />
          <span className="truncate text-sm font-bold text-white/85">
            {appt.client_name}
          </span>
          {appt.client_phone && (
            <>
              <span className="text-xs text-white/20">·</span>
              <a
                href={`tel:${appt.client_phone}`}
                className="flex items-center gap-1 text-xs text-white/45 hover:text-[#D4AF37]"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone size={11} />
                {appt.client_phone}
              </a>
            </>
          )}
          <span className="ml-auto shrink-0 text-xs text-white/30">
            {appt.client_visit_count} {appt.client_visit_count === 1 ? "visita" : "visitas"}
          </span>
          {isNew && (
            <span className="rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold text-violet-300">
              Nuevo
            </span>
          )}
          {isVip && (
            <span className="flex items-center gap-0.5 rounded-full bg-[#D4AF37]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#D4AF37]/80">
              <Star size={9} /> VIP
            </span>
          )}
        </div>

        {/* Service row */}
        <div className="flex items-center gap-2 text-xs text-white/45">
          <Scissors size={13} className="shrink-0" />
          <span className="truncate">{appt.service_name}</span>
          <span className="text-white/20">·</span>
          <span className="font-bold text-white/65">
            {formatCurrency(appt.service_price)}
          </span>
          <span className="text-white/20">·</span>
          <span>{appt.service_duration} min</span>
        </div>

        {/* Barber row */}
        {appt.barber_name && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <User size={13} className="shrink-0" />
            <span>{appt.barber_name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex flex-wrap items-center gap-1.5 border-t border-white/[0.06] px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        {(appt.status === "scheduled" || appt.status === "pending") && (
          <>
            <ActionButton
              label="Confirmar"
              variant="primary"
              isPending={isPending}
              onClick={() => onStatusChange(appt.id, "confirmed")}
            />
            <ActionButton
              label="Cancelar"
              variant="danger"
              isPending={isPending}
              onClick={() => onStatusChange(appt.id, "cancelled")}
            />
          </>
        )}
        {appt.status === "confirmed" && (
          <>
            <ActionButton
              label="Completar"
              variant="success"
              isPending={isPending}
              onClick={() => onStatusChange(appt.id, "completed")}
            />
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/[0.08] px-3 py-1.5 text-xs font-bold text-green-300 hover:bg-green-500/[0.14]"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
            )}
            <ActionButton
              label="Cancelar"
              variant="danger"
              isPending={isPending}
              onClick={() => onStatusChange(appt.id, "cancelled")}
            />
          </>
        )}
        {appt.status === "completed" && (
          <Link
            href="/dashboard/caja"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-white/65 hover:bg-white/[0.09]"
            onClick={(e) => e.stopPropagation()}
          >
            <Banknote size={12} /> Cobrar
          </Link>
        )}
        <button
          type="button"
          className="ml-auto flex items-center gap-1 text-xs text-white/35 hover:text-[#D4AF37]"
          onClick={() => onSelect(appt)}
        >
          Ver detalle <ChevronRight size={12} />
        </button>
      </div>
    </article>
  );
}

// ─── Side panel ────────────────────────────────────────────────────────────

function SidePanel({
  appt,
  onClose,
  onStatusChange,
  isPending,
}: {
  appt: ReservationItem | null;
  onClose: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  isPending: boolean;
}) {
  if (!appt) return null;

  const statusCfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.scheduled;
  const wa = whatsappHref(appt.client_phone, appt.client_name);
  const sourceLbl = appt.source ? SOURCE_LABELS[appt.source] ?? appt.source : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />
      {/* Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#0F1219] shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-black text-white/90">
              {appt.client_name}
            </p>
            <p className="mt-0.5 text-sm text-white/45">
              {formatTime(appt.start_time)} · {formatDate(appt.appointment_date)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusCfg.cls}`}
            >
              {statusCfg.label}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/35 hover:bg-white/[0.07] hover:text-white/80"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scroll body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white/35">
              Detalle de la cita
            </h3>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] divide-y divide-white/[0.06]">
              <DetailRow label="Servicio" value={appt.service_name} />
              <DetailRow
                label="Precio"
                value={formatCurrency(appt.service_price)}
              />
              <DetailRow
                label="Duración"
                value={`${appt.service_duration} min`}
              />
              {appt.barber_name && (
                <DetailRow label="Barbero" value={appt.barber_name} />
              )}
              {sourceLbl && (
                <DetailRow label="Origen" value={sourceLbl} />
              )}
              {appt.notes && (
                <DetailRow label="Notas" value={appt.notes} />
              )}
            </div>
          </div>

          {/* Client */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white/35">
              Cliente
            </h3>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] divide-y divide-white/[0.06]">
              <DetailRow label="Nombre" value={appt.client_name} />
              {appt.client_phone && (
                <DetailRow label="Teléfono" value={appt.client_phone} />
              )}
              <DetailRow
                label="Visitas"
                value={String(appt.client_visit_count)}
              />
              {appt.client_visit_count === 1 && (
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <span className="text-xs text-violet-300 font-semibold">
                    Primera visita — dale una buena impresión
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-white/35">
              Acciones
            </h3>
            <div className="flex flex-wrap gap-2">
              {(appt.status === "scheduled" || appt.status === "pending") && (
                <>
                  <ActionButton
                    label="Confirmar cita"
                    variant="primary"
                    isPending={isPending}
                    onClick={() => {
                      onStatusChange(appt.id, "confirmed");
                      onClose();
                    }}
                  />
                  <ActionButton
                    label="Cancelar"
                    variant="danger"
                    isPending={isPending}
                    onClick={() => {
                      onStatusChange(appt.id, "cancelled");
                      onClose();
                    }}
                  />
                </>
              )}
              {appt.status === "confirmed" && (
                <>
                  <ActionButton
                    label="Marcar completada"
                    variant="success"
                    isPending={isPending}
                    onClick={() => {
                      onStatusChange(appt.id, "completed");
                      onClose();
                    }}
                  />
                  <ActionButton
                    label="Cancelar"
                    variant="danger"
                    isPending={isPending}
                    onClick={() => {
                      onStatusChange(appt.id, "cancelled");
                      onClose();
                    }}
                  />
                </>
              )}
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/[0.08] px-3 py-1.5 text-xs font-bold text-green-300 hover:bg-green-500/[0.14]"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-1.5">
            <Link
              href="/dashboard/agenda"
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-3 text-sm font-medium text-white/55 hover:bg-white/[0.05] hover:text-white/80"
            >
              <ExternalLink size={14} className="text-white/30" />
              Ver en agenda
            </Link>
            {appt.client_id && (
              <Link
                href={`/dashboard/clientes/${appt.client_id}`}
                className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-3 text-sm font-medium text-white/55 hover:bg-white/[0.05] hover:text-white/80"
              >
                <User size={14} className="text-white/30" />
                Ver ficha del cliente
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-2.5">
      <span className="w-20 shrink-0 text-xs font-semibold text-white/35">
        {label}
      </span>
      <span className="text-xs text-white/70 leading-5">{value}</span>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.02] px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
        <Icon size={22} className="text-white/30" />
      </div>
      <p className="font-bold text-white/60">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-white/35">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-24 rounded bg-white/[0.08]" />
        <div className="h-4 w-16 rounded bg-white/[0.08]" />
      </div>
      <div className="h-3 w-3/4 rounded bg-white/[0.06]" />
      <div className="h-3 w-1/2 rounded bg-white/[0.06]" />
      <div className="flex gap-2 pt-1">
        <div className="h-7 w-20 rounded-lg bg-white/[0.06]" />
        <div className="h-7 w-16 rounded-lg bg-white/[0.06]" />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function ReservasClient({
  appointments,
  kpis,
  barbers,
  services: _services,
  barbershopId: _barbershopId,
}: Props) {
  // Filter state
  const [tab, setTab] = useState<TabFilter>("all");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Side panel
  const [selectedAppt, setSelectedAppt] = useState<ReservationItem | null>(null);

  const router = useRouter();

  // Action feedback
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    id: string;
    ok: boolean;
    msg: string;
  } | null>(null);

  // ── Computed list ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const todayISO = getTodayISO();
    const { start: weekStart, end: weekEnd } = getWeekRange();

    return appointments.filter((a) => {
      // Tab filter
      if (tab === "today" && a.appointment_date !== todayISO) return false;
      if (tab === "week" && (a.appointment_date < weekStart || a.appointment_date > weekEnd)) return false;
      if (tab === "pending" && a.status !== "scheduled" && a.status !== "pending") return false;
      if (tab === "confirmed" && a.status !== "confirmed") return false;
      if (tab === "completed" && a.status !== "completed") return false;
      if (tab === "cancelled" && a.status !== "cancelled" && a.status !== "no_show") return false;

      // Barber filter
      if (selectedBarber && a.barber_id !== selectedBarber) return false;

      // Search
      if (
        search &&
        !a.client_name.toLowerCase().includes(search.toLowerCase()) &&
        !a.service_name.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [appointments, tab, selectedBarber, search]);

  // ── Status action ──────────────────────────────────────────────────────
  function handleStatusChange(id: string, status: AppointmentStatus) {
    startTransition(async () => {
      const result = await updateReservationStatus(id, status);
      setFeedback({
        id,
        ok: result.success,
        msg: result.success
          ? "Estado actualizado"
          : result.error ?? "Error al actualizar",
      });
      if (result.success) {
        router.refresh(); // refresca el server component con datos nuevos
      }
      setTimeout(() => setFeedback(null), 3000);
    });
  }

  // ── Tabs config ────────────────────────────────────────────────────────
  const tabs: { id: TabFilter; label: string; count?: number }[] = [
    { id: "all", label: "Todas", count: appointments.length },
    {
      id: "today",
      label: "Hoy",
      count: kpis.todayAppointments.length,
    },
    { id: "week", label: "Esta semana" },
    { id: "pending", label: "Pendientes", count: kpis.pendingCount },
    { id: "confirmed", label: "Confirmadas", count: kpis.confirmedCount },
    { id: "completed", label: "Completadas" },
    { id: "cancelled", label: "Canceladas", count: kpis.cancelledCount },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* ── Header ────────────────────────────────────────────────── */}
      <PageHeader
        section="Reservas"
        title="Centro de reservas"
        description="Visualiza, confirma y gestiona cada cita de tu barbería sin perder el control."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/agenda" className="btn-primary">
              Nueva reserva <ArrowRight size={14} />
            </Link>
            <Link href="/dashboard/reservas/pipeline" className="btn-outline">
              <LayoutList size={14} /> Ver pipeline
            </Link>
            <Link href="/dashboard/qr" className="btn-outline">
              <QrCode size={14} /> Compartir QR
            </Link>
          </div>
        }
      />

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Reservas hoy"
          value={kpis.todayAppointments.length}
          sub="del día actual"
          icon={CalendarCheck}
          color="blue"
        />
        <KpiCard
          label="Ingresos estimados"
          value={formatCurrency(kpis.todayRevenue)}
          sub="confirmadas + completadas"
          icon={Banknote}
          color="emerald"
        />
        <KpiCard
          label="Pendientes"
          value={kpis.pendingCount}
          sub="por confirmar"
          icon={Clock}
          color="amber"
        />
        <KpiCard
          label="Confirmadas"
          value={kpis.confirmedCount}
          sub="listas para atender"
          icon={CheckCircle}
          color="green"
        />
        <KpiCard
          label="Canceladas"
          value={kpis.cancelledCount}
          sub="canceladas o no-show"
          icon={XCircle}
          color="red"
        />
        <KpiCard
          label="Clientes nuevos"
          value={kpis.newClientsToday}
          sub="primera visita hoy"
          icon={UserPlus}
          color="violet"
        />
      </div>

      {/* ── Alerts ────────────────────────────────────────────────── */}
      <AlertBanner
        pendingCount={kpis.pendingCount}
        upcomingNext3h={kpis.upcomingNext3h}
        todayRevenue={kpis.todayRevenue}
      />

      {/* ── Feedback toast ────────────────────────────────────────── */}
      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
            feedback.ok
              ? "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300"
              : "border-red-500/20 bg-red-500/[0.08] text-red-300"
          }`}
        >
          {feedback.ok ? (
            <CheckCircle size={15} className="shrink-0" />
          ) : (
            <XCircle size={15} className="shrink-0" />
          )}
          {feedback.msg}
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.04]">
        {/* Tab strip */}
        <div className="flex gap-0.5 overflow-x-auto border-b border-white/[0.06] px-3 pt-3 pb-0 scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-bold transition ${
                tab === t.id
                  ? "border-b-2 border-[#D4AF37] text-[#D4AF37]"
                  : "text-white/45 hover:text-white/70"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                    tab === t.id
                      ? "bg-[#D4AF37]/15 text-[#D4AF37]/80"
                      : "bg-white/[0.07] text-white/40"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + barber filter */}
        <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Buscar cliente o servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] py-2 pl-8 pr-3 text-sm text-white/75 placeholder:text-white/25 focus:border-[#D4AF37]/40 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15"
            />
          </div>
          {barbers.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter size={14} className="shrink-0 text-white/30" />
              <select
                value={selectedBarber}
                onChange={(e) => setSelectedBarber(e.target.value)}
                className="rounded-xl border border-white/[0.07] bg-[#0F1219] py-2 pl-3 pr-8 text-sm text-white/70 focus:border-[#D4AF37]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/15"
              >
                <option value="">Todos los barberos</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── List ──────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        tab === "today" && search === "" && selectedBarber === "" ? (
          <EmptyState
            icon={CalendarCheck}
            title="Sin reservas para hoy"
            description="Comparte tu link público o QR para empezar a recibir citas."
            action={
              <Link href="/dashboard/qr" className="btn-primary">
                <QrCode size={14} /> Compartir QR
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon={Filter}
            title="Sin resultados"
            description="Prueba con otros filtros o cambia el término de búsqueda."
          />
        )
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((appt) => (
            <ReservationCard
              key={appt.id}
              appt={appt}
              onSelect={setSelectedAppt}
              onStatusChange={handleStatusChange}
              isPending={isPending}
            />
          ))}
        </div>
      )}

      {/* ── Side panel ────────────────────────────────────────────── */}
      <SidePanel
        appt={selectedAppt}
        onClose={() => setSelectedAppt(null)}
        onStatusChange={handleStatusChange}
        isPending={isPending}
      />
    </div>
  );
}
