"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarClock,
  CalendarPlus,
  Clock,
  Copy,
  Instagram,
  Megaphone,
  Send,
  Scissors,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { CopyAvailabilityMessageButton } from "@/components/dashboard/CopyAvailabilityMessageButton";
import { QuickBookingPanel } from "@/components/dashboard/QuickBookingPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import type { OperationalFreeSlot, OperationalFreeSlotSummary } from "@/src/lib/agenda/get-free-slots";

type Service = {
  id: string;
  name: string;
  duration_minutes?: number | null;
  price?: number | null;
};

type Barber = {
  id: string;
  name: string;
};

type Props = {
  dateISO: string;
  todayISO: string;
  slots: OperationalFreeSlot[];
  summary: OperationalFreeSlotSummary;
  services: Service[];
  barbers: Barber[];
};

type ScopeFilter = "all" | "now";

const STATUS_META: Record<OperationalFreeSlot["status"] | "unavailable", { label: string; className: string; dot: string }> = {
  free_now: {
    label: "Libre ahora",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  free_soon: {
    label: "Libre pronto",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  later: {
    label: "Con hueco hoy",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    dot: "bg-slate-400",
  },
  unavailable: {
    label: "Sin huecos",
    className: "border-slate-200 bg-slate-100 text-slate-500",
    dot: "bg-slate-300",
  },
};

function formatMoney(value: number | null) {
  if (value == null) return "Sin precio";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatHours(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

function getTomorrowISO(dateISO: string) {
  const date = new Date(`${dateISO}T00:00:00`);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function getMarketingHref(slot: OperationalFreeSlot | null, dateISO: string) {
  if (!slot) return "/dashboard/marketing?context=huecos";
  return `/dashboard/marketing?context=huecos&date=${dateISO}&time=${slot.start_time}&barber=${slot.barber_id}`;
}

function ServiceChips({ slot, limit = 3 }: { slot: OperationalFreeSlot; limit?: number }) {
  const visibleServices = slot.fits_services.slice(0, limit);

  return (
    <div className="flex flex-wrap gap-2">
      {visibleServices.map((service) => (
        <span
          key={service.id}
          className="rounded-full border border-[#D5A84C]/25 bg-white px-2.5 py-1 text-xs font-bold text-slate-700"
        >
          {service.name} · {service.duration_minutes} min
        </span>
      ))}
      {slot.fits_services.length > visibleServices.length && (
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-500">
          +{slot.fits_services.length - visibleServices.length} mas
        </span>
      )}
    </div>
  );
}

function BarberRadarCard({
  barber,
  slot,
  dateISO,
  onCreateBooking,
}: {
  barber: Barber;
  slot: OperationalFreeSlot | null;
  dateISO: string;
  onCreateBooking: (slot: OperationalFreeSlot) => void;
}) {
  const status = slot?.status ?? "unavailable";
  const meta = STATUS_META[status];

  return (
    <article
      className={`rounded-[22px] border bg-white p-4 shadow-card ${
        status === "free_now"
          ? "border-emerald-200 ring-2 ring-emerald-100"
          : status === "free_soon"
            ? "border-amber-200"
            : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-black ${meta.className}`}>
            <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
            {slot?.is_next ? "Proximo hueco" : meta.label}
          </span>
          <h3 className="mt-3 truncate text-lg font-black text-slate-950">{barber.name}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {slot ? `${slot.start_time} - ${slot.end_time} · ${slot.duration_minutes} min` : "Agenda sin huecos vendibles"}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-[#D5A84C]">
          <Scissors size={18} />
        </div>
      </div>

      {slot ? (
        <>
          <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Servicio que cabe</p>
              <div className="mt-2">
                <ServiceChips slot={slot} limit={2} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
              <span className="text-xs font-black uppercase text-slate-500">Potencial</span>
              <span className="text-base font-black text-slate-950">{formatMoney(slot.potential_revenue)}</span>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button type="button" onClick={() => onCreateBooking(slot)} className="btn-primary justify-center sm:col-span-3">
              <CalendarPlus size={15} />
              Agendar ahora
            </button>
            <Link href={getMarketingHref(slot, dateISO)} className="btn-outline justify-center sm:col-span-2">
              <Megaphone size={15} />
              Enviar promo
            </Link>
            <Link href={`/dashboard/agenda?view=day&date=${dateISO}`} className="btn-outline justify-center">
              <CalendarClock size={15} />
              Agenda
            </Link>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-500">
          No hay huecos desde ahora con servicios activos. Revisa la agenda o anticipa manana.
        </div>
      )}
    </article>
  );
}

function SlotRow({
  slot,
  dateISO,
  onCreateBooking,
}: {
  slot: OperationalFreeSlot;
  dateISO: string;
  onCreateBooking: (slot: OperationalFreeSlot) => void;
}) {
  const meta = STATUS_META[slot.status];

  return (
    <article className="grid gap-4 rounded-[22px] border border-slate-200 bg-white p-4 shadow-card transition hover:border-[#D5A84C]/45 lg:grid-cols-[0.7fr_1fr_0.55fr_0.7fr] lg:items-center">
      <div>
        <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-black ${meta.className}`}>
          <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
          {slot.is_next ? "Proximo hueco" : meta.label}
        </span>
        <p className="mt-3 text-2xl font-black text-slate-950">{slot.start_time}</p>
        <p className="text-sm font-semibold text-slate-500">{slot.end_time} · {slot.duration_minutes} min</p>
      </div>
      <div>
        <p className="text-sm font-black text-slate-950">{slot.barber_name}</p>
        <div className="mt-2">
          <ServiceChips slot={slot} limit={3} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">Potencial</p>
        <p className="mt-1 text-xl font-black text-slate-950">{formatMoney(slot.potential_revenue)}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <button type="button" onClick={() => onCreateBooking(slot)} className="btn-primary justify-center">
          <CalendarPlus size={15} />
          Agendar aqui
        </button>
        <CopyAvailabilityMessageButton message={slot.message} />
      </div>
    </article>
  );
}

function OwnerRecommendedAction({
  nextSlot,
  nowCount,
  dateISO,
}: {
  nextSlot: OperationalFreeSlot | null;
  nowCount: number;
  dateISO: string;
}) {
  const service = nextSlot?.fits_services[0]?.name.toLowerCase();
  const message =
    nowCount >= 2
      ? `Tienes ${nowCount} barberos libres ahora. Lanza una promo rapida y agenda el primer cliente que responda.`
      : nextSlot
        ? `${nextSlot.barber_name} queda libre a las ${nextSlot.start_time}. Puedes llenar ese hueco con ${service ?? "un servicio rapido"}.`
        : "No hay huecos operativos ahora. Revisa manana y prepara una campana si baja la ocupacion.";

  return (
    <section className="rounded-[24px] border border-[#D5A84C]/25 bg-[#FFFBF2] p-5 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#8A641F]">
            <Zap size={14} />
            Accion recomendada
          </div>
          <h2 className="mt-2 text-xl font-black text-slate-950">{message}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Prioriza el hueco mas cercano, servicio que cabe e ingreso potencial. Todo queda precargado al agendar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {nextSlot && <CopyAvailabilityMessageButton message={nextSlot.message} />}
          <Link href={getMarketingHref(nextSlot, dateISO)} className="btn-primary">
            <Megaphone size={15} />
            Crear promo rapida
          </Link>
        </div>
      </div>
    </section>
  );
}

function GrowthActions({ nextSlot, dateISO }: { nextSlot: OperationalFreeSlot | null; dateISO: string }) {
  const message = nextSlot?.message ?? "Hoy tenemos huecos disponibles. Responde a este mensaje y te guardamos una cita.";
  const actions = [
    { label: "Copiar WhatsApp", icon: Copy, node: <CopyAvailabilityMessageButton message={message} /> },
    { label: "Crear historia Instagram", icon: Instagram, href: getMarketingHref(nextSlot, dateISO) + "&channel=instagram_story" },
    { label: "Crear promo rapida", icon: Megaphone, href: getMarketingHref(nextSlot, dateISO) },
    { label: "Clientes perdidos", icon: Users, href: "/dashboard/recuperacion?context=huecos" },
  ];

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-black uppercase tracking-wide text-[#C9922A]">Acciones de crecimiento</p>
        <h2 className="text-xl font-black text-slate-950">Convierte huecos en demanda</h2>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          if (action.node) {
            return <div key={action.label}>{action.node}</div>;
          }
          return (
            <Link key={action.label} href={action.href!} className="btn-outline justify-center">
              <Icon size={15} />
              {action.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function HuecosClient({ dateISO, todayISO, slots, summary, services, barbers }: Props) {
  const router = useRouter();
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [selectedBarber, setSelectedBarber] = useState("all");
  const [minDuration, setMinDuration] = useState(0);
  const [panelSlot, setPanelSlot] = useState<OperationalFreeSlot | null>(null);

  const filteredSlots = useMemo(
    () =>
      slots.filter((slot) => {
        if (scope === "now" && slot.status !== "free_now") return false;
        if (selectedBarber !== "all" && slot.barber_id !== selectedBarber) return false;
        if (minDuration > 0 && slot.duration_minutes < minDuration) return false;
        return true;
      }),
    [slots, scope, selectedBarber, minDuration],
  );

  const barberRadar = useMemo(
    () =>
      barbers.map((barber) => ({
        barber,
        slot: slots.find((slot) => slot.barber_id === barber.id) ?? null,
      })),
    [barbers, slots],
  );

  const nextSlot = filteredSlots[0] ?? summary.next_slot;
  const selectedDefaultService = panelSlot?.fits_services[0]?.id;
  const tomorrowISO = getTomorrowISO(todayISO);
  const isToday = dateISO === todayISO;
  const nowCount = slots.filter((slot) => slot.status === "free_now").length;

  function handleBookingSuccess() {
    router.refresh();
  }

  return (
    <>
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-card md:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-[#C9922A]">
              <Send size={14} />
              Radar operativo
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Quien esta libre ahora</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Barbero, hueco, servicio compatible, potencial y accion directa.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => setScope("now")}
              className={scope === "now" ? "btn-primary" : "btn-outline"}
            >
              Ahora
            </button>
            <Link href={`/dashboard/huecos?date=${todayISO}`} className={isToday && scope === "all" ? "btn-primary" : "btn-outline"}>
              Hoy
            </Link>
            <Link href={`/dashboard/huecos?date=${tomorrowISO}`} className={!isToday ? "btn-primary" : "btn-outline"}>
              Manana
            </Link>
            <select
              value={selectedBarber}
              onChange={(event) => setSelectedBarber(event.target.value)}
              className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800"
            >
              <option value="all">Todos los barberos</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
            <select
              value={minDuration}
              onChange={(event) => setMinDuration(Number(event.target.value))}
              className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-800"
            >
              <option value={0}>Cualquier duracion</option>
              <option value={30}>30+ min</option>
              <option value={45}>45+ min</option>
              <option value={60}>60+ min</option>
              <option value={90}>90+ min</option>
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {barberRadar.map(({ barber, slot }) => (
            <BarberRadarCard
              key={barber.id}
              barber={barber}
              slot={slot}
              dateISO={dateISO}
              onCreateBooking={setPanelSlot}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Barberos libres ahora", summary.free_now_barbers, "Disponibles para vender ya", Users],
          ["Proximo hueco", summary.next_slot?.start_time ?? "Completo", summary.next_slot?.barber_name ?? "Sin huecos", Clock],
          ["Horas libres hoy", formatHours(summary.total_free_minutes), "Tiempo vendible desde ahora", CalendarClock],
          ["Ingreso potencial", formatMoney(summary.potential_revenue), "Suma de mejores servicios", TrendingUp],
          ["Huecos hoy", summary.total_slots, "Oportunidades activas", Scissors],
        ].map(([label, value, description, Icon]) => {
          const MetricIcon = Icon as typeof Users;
          return (
            <article key={label as string} className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase text-slate-500">{label as string}</p>
                <MetricIcon size={16} className="text-[#C9922A]" />
              </div>
              <p className="mt-2 text-2xl font-black text-slate-950">{value as string | number}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{description as string}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-card md:p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#C9922A]">Proximos huecos de hoy</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">Prioridad para llenar agenda</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            {filteredSlots.length} oportunidades encontradas
          </p>
        </div>

        <div className="mt-5 grid gap-3">
          {filteredSlots.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="Agenda completa por ahora"
              description="No hay huecos que encajen con los filtros actuales. Puedes revisar manana o crear una reserva manual."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href={`/dashboard/agenda?view=day&date=${dateISO}`} className="btn-primary">
                    Ver agenda
                  </Link>
                  <Link href={`/dashboard/huecos?date=${tomorrowISO}`} className="btn-outline">
                    Ver manana
                  </Link>
                  <Link href="/dashboard/agenda" className="btn-outline">
                    Nueva reserva
                  </Link>
                </div>
              }
            />
          ) : (
            filteredSlots.map((slot) => (
              <SlotRow key={slot.id} slot={slot} dateISO={dateISO} onCreateBooking={setPanelSlot} />
            ))
          )}
        </div>
      </section>

      <OwnerRecommendedAction nextSlot={nextSlot} nowCount={nowCount} dateISO={dateISO} />
      <GrowthActions nextSlot={nextSlot} dateISO={dateISO} />

      <QuickBookingPanel
        open={Boolean(panelSlot)}
        onOpenChange={(open) => !open && setPanelSlot(null)}
        services={services}
        barbers={barbers}
        defaultDate={dateISO}
        defaultBarberId={panelSlot?.barber_id}
        defaultTime={panelSlot?.start_time}
        defaultServiceId={selectedDefaultService}
        onSuccess={handleBookingSuccess}
      />
    </>
  );
}
