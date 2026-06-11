"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import {
  Clock,
  ChevronLeft,
  CalendarDays,
  CalendarPlus,
  CheckCircle,
  Download,
  Navigation,
  User,
  Scissors,
  Phone,
  BadgeCheck,
  Mail,
  CreditCard,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import {
  PUBLIC_BOOKING_FALLBACK_END_HOUR,
  PUBLIC_BOOKING_FALLBACK_START_HOUR,
  PUBLIC_BOOKING_SLOT_INTERVAL_MINUTES,
} from "@/src/lib/booking/real-availability";
import { createPublicBooking, getUnavailableSlots } from "./actions";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  image_url?: string | null;
};

type Barber = {
  id: string;
  name: string;
  photo_url?: string | null;
};

type Props = {
  barbershopId: string;
  barbershopSlug: string;
  barbershopName: string;
  barbershopCity: string;
  barbershopPhone: string | null;
  barbershopMapsHref: string | null;
  services: Service[];
  barbers: Barber[];
  initialServiceId?: string | null;
  initialBarberId?: string | null;
};

const STEP_LABELS = ["Servicio", "Barbero", "Fecha y hora", "Datos", "Confirmar"];
const LAST_BOOKING_STORAGE_KEY = "barberiaos:last-public-booking";

type LastBookingStorage = {
  businessSlug: string;
  serviceId: string;
  barberId: string | null;
};

function StepProgress({ step }: { step: number }) {
  if (step > 5) return null;

  return (
    <div className="mt-5 rounded-2xl border border-amber-200/40 bg-[#F8F5EF] p-3">
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? "bg-[#D4AF37]" : "bg-[#F3EDE1]"
            }`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-500">Paso {step} de 5</span>
        <span className="font-black text-slate-950">{STEP_LABELS[step - 1]}</span>
      </div>
      <div className="mt-3 hidden grid-cols-5 gap-2 text-xs font-black uppercase text-slate-500 sm:grid">
        {STEP_LABELS.map((label, index) => (
          <span key={label} className={index + 1 <= step ? "text-[#111827]" : ""}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-3">
      {[
        { icon: BadgeCheck, label: "Sin cuenta necesaria", tone: "text-emerald-600" },
        { icon: Clock, label: "Reserva en segundos", tone: "text-[#2F6FEB]" },
        { icon: ShieldCheck, label: "Directo con la barberia", tone: "text-[#2F6FEB]" },
      ].map(({ icon: Icon, label, tone }) => (
        <span
          key={label}
          className="flex items-center gap-2 rounded-2xl border border-amber-200/40 bg-[#F8F5EF] px-3 py-2 text-xs font-semibold text-slate-600"
        >
          <Icon size={13} className={tone} />
          {label}
        </span>
      ))}
    </div>
  );
}

function BookingHeader({
  barbershopName,
  barbershopCity,
}: {
  barbershopName: string;
  barbershopCity: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0B1220] text-[#D4AF37] shadow-[0_12px_28px_rgba(15,23,42,0.18)]">
        <Scissors size={22} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm text-slate-600">
          {barbershopCity ? `Reserva online · ${barbershopCity}` : "Reserva online"}
        </p>
        <h1 className="truncate text-3xl font-black tracking-normal text-slate-950">
          {barbershopName}
        </h1>
      </div>
    </div>
  );
}

function StepTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <p className="mt-2 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function ChoiceButton({
  children,
  onClick,
  selected = false,
}: {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
        selected
          ? "border-[#0B1220] bg-[#0B1220] text-white shadow-lg shadow-slate-900/10"
          : "border-black/5 bg-[#F8F3EA] hover:border-[#D4AF37] hover:bg-[#F6F1E8]"
      }`}
    >
      {children}
    </button>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  strong = false,
}: {
  icon: typeof Clock;
  label?: string;
  value: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Icon size={14} className="shrink-0 text-slate-500" />
      {label && <span className="font-medium text-slate-500">{label}</span>}
      <span className={strong ? "font-bold text-[#111827]" : ""}>{value}</span>
    </div>
  );
}

function ReservationSummary({
  service,
  barber,
  date,
  time,
  compact = false,
}: {
  service: Service | null;
  barber: Barber | null;
  date: string;
  time: string;
  compact?: boolean;
}) {
  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
        weekday: compact ? "short" : "long",
        day: "numeric",
        month: compact ? "short" : "long",
      })
    : "";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#D5CEBC] bg-[#F6F1E8]">
      <div className="border-b border-amber-200/40 bg-[#F3EDE1] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[#B98B2F]">
          Resumen de reserva
        </p>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <InfoRow icon={Scissors} value={service?.name ?? "Servicio"} strong />
          <span className="shrink-0 text-lg font-black text-slate-950">
            {service?.price} €
          </span>
        </div>
        <InfoRow icon={Clock} value={`${service?.duration_minutes ?? "--"} min de duración`} />
        <InfoRow
          icon={User}
          value={barber?.id === "any" ? "Primer barbero disponible" : barber?.name ?? "Barbero"}
        />
        <InfoRow icon={CalendarDays} value={`${formattedDate}${time ? ` · ${time}h` : ""}`} />

        <div className="flex items-center gap-2 rounded-xl border border-[#D5CEBC] bg-[#F8F3EA] px-3 py-2.5 text-sm">
          <CreditCard size={14} className="shrink-0 text-slate-500" />
          <span className="font-medium text-neutral-700">Pago en el local</span>
          <span className="ml-auto text-xs font-medium text-slate-500">sin pago online</span>
        </div>
      </div>
    </div>
  );
}

function ConfirmButton({
  saving,
  disabled,
  onClick,
  label = "Confirmar reserva",
}: {
  saving: boolean;
  disabled: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-4 text-base font-black text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/25 transition-all hover:bg-[#E5C04C] active:scale-[0.98] disabled:opacity-40"
    >
      <CalendarDays size={18} />
      {saving ? "Comprobando disponibilidad..." : label}
    </button>
  );
}

// ─── Avatar color palette para barberos ─────────────────────────────────────
const BARBER_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function getBarberColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return BARBER_COLORS[Math.abs(hash) % BARBER_COLORS.length];
}

// ─── Generadores de calendario ───────────────────────────────────────────────
function buildCalendarTimes(date: string, time: string, durationMinutes: number) {
  const dateCompact = date.replace(/-/g, "");
  const timeCompact = time.replace(":", "");
  const startDT = `${dateCompact}T${timeCompact}00`;
  const [h, m] = time.split(":").map(Number);
  const endTotal = h * 60 + m + durationMinutes;
  const endH = String(Math.floor(endTotal / 60)).padStart(2, "0");
  const endM = String(endTotal % 60).padStart(2, "0");
  const endDT = `${dateCompact}T${endH}${endM}00`;
  return { startDT, endDT };
}

function buildGoogleCalendarUrl(title: string, date: string, time: string, durationMinutes: number, location: string, description: string): string {
  const { startDT, endDT } = buildCalendarTimes(date, time, durationMinutes);
  const params = new URLSearchParams({ text: title, dates: `${startDT}/${endDT}`, details: description, location });
  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
}

function downloadICS(title: string, date: string, time: string, durationMinutes: number, location: string, description: string) {
  const { startDT, endDT } = buildCalendarTimes(date, time, durationMinutes);
  const uid = `barberiaos-${date}-${time.replace(":", "")}-${Math.random().toString(36).slice(2)}@barberiaos.com`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BarberíaOS//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${startDT}`,
    `DTEND:${endDT}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    location ? `LOCATION:${location}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cita-barberia.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function BookingForm({
  barbershopId,
  barbershopSlug,
  barbershopName,
  barbershopCity,
  barbershopPhone,
  barbershopMapsHref,
  services,
  barbers,
  initialServiceId = null,
  initialBarberId = null,
}: Props) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [privacyRead, setPrivacyRead] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [slotAvailableCount, setSlotAvailableCount] = useState<Record<string, number>>({});
  const [bookableSlots, setBookableSlots] = useState<string[]>(() =>
    generateTimeSlots(
      PUBLIC_BOOKING_FALLBACK_START_HOUR,
      PUBLIC_BOOKING_FALLBACK_END_HOUR,
      PUBLIC_BOOKING_SLOT_INTERVAL_MINUTES
    ).map((slot) => slot.time)
  );
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [lastBooking, setLastBooking] = useState<LastBookingStorage | null>(null);
  const [showRepeatPrompt, setShowRepeatPrompt] = useState(false);

  const today = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const selectedBarberId =
    barber?.id && barber.id !== "any" ? barber.id : null;
  const visibleSlots = bookableSlots.filter((slot) => {
    if (date !== today) return true;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    return slot > currentTime;
  });

  useEffect(() => {
    const initialService = services.find((item) => item.id === initialServiceId);
    const initialBarber =
      initialBarberId && initialBarberId !== "any"
        ? barbers.find((item) => item.id === initialBarberId)
        : null;

    if (!initialService && !initialBarber) return;

    if (initialService) {
      setService(initialService);
    }

    setBarber(initialBarber ?? { id: "any", name: "Cualquiera" });
    setStep(initialService ? 3 : 1);
  }, [barbers, initialBarberId, initialServiceId, services]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAST_BOOKING_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<LastBookingStorage> | null;
      if (!parsed || typeof parsed !== "object") {
        window.localStorage.removeItem(LAST_BOOKING_STORAGE_KEY);
        return;
      }

      const serviceExists = services.some((item) => item.id === parsed.serviceId);
      const barberExists =
        !parsed.barberId || barbers.some((item) => item.id === parsed.barberId);

      if (
        parsed.businessSlug === barbershopSlug &&
        typeof parsed.serviceId === "string" &&
        serviceExists &&
        barberExists
      ) {
        setLastBooking({
          businessSlug: parsed.businessSlug,
          serviceId: parsed.serviceId,
          barberId: typeof parsed.barberId === "string" ? parsed.barberId : null,
        });
        setShowRepeatPrompt(true);
      }
    } catch {
      window.localStorage.removeItem(LAST_BOOKING_STORAGE_KEY);
    }
  }, [barbers, barbershopSlug, services]);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      if (!date || !barber || !service) {
        setUnavailableSlots([]);
        setClosedReason(null);
        return;
      }

      setCheckingAvailability(true);
      setFormError(null);

      const result = await getUnavailableSlots({
        barbershopId,
        serviceId: service.id,
        barberId: selectedBarberId,
        date,
      });

      if (cancelled) return;

      setCheckingAvailability(false);

      if (result.error) {
        setUnavailableSlots([]);
        setClosedReason(null);
        setFormError(result.error);
        return;
      }

      setUnavailableSlots(result.unavailableSlots);
      setBookableSlots(result.allSlots);
      setSlotAvailableCount(result.slotAvailableCount ?? {});
      setClosedReason(result.closedReason);

      if (time && result.unavailableSlots.includes(time)) {
        setTime("");
        setFormError("La hora seleccionada ya no está disponible.");
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [barbershopId, date, selectedBarberId, barber, service, time]);

  function reset() {
    setStep(1);
    setService(null);
    setBarber(null);
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setPrivacyRead(false);
    setMarketingConsent(false);
    setSaving(false);
    setCheckingAvailability(false);
    setUnavailableSlots([]);
    setSlotAvailableCount({});
    setClosedReason(null);
    setFormError(null);
  }

  function repeatLastBooking() {
    if (!lastBooking) return;

    const repeatedService = services.find((item) => item.id === lastBooking.serviceId);
    const repeatedBarber = lastBooking.barberId
      ? barbers.find((item) => item.id === lastBooking.barberId)
      : null;

    if (!repeatedService) {
      setShowRepeatPrompt(false);
      return;
    }

    setService(repeatedService);
    setBarber(repeatedBarber ?? { id: "any", name: "Cualquiera" });
    setDate("");
    setTime("");
    setUnavailableSlots([]);
    setClosedReason(null);
    setFormError(null);
    setShowRepeatPrompt(false);
    setStep(3);
  }

  async function handleConfirmBooking() {
    if (!service || !date || !time || !name.trim() || !phone.trim()) {
      setFormError("Completa todos los datos para confirmar la reserva.");
      return;
    }

    if (unavailableSlots.includes(time)) {
      setFormError("Esta hora ya no está disponible. Elige otra.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const result = await createPublicBooking({
      barbershopId,
      serviceId: service.id,
      barberId: selectedBarberId,
      date,
      time,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      privacyAccepted: privacyRead,
      website,
    });

    setSaving(false);

    if (result?.error) {
      setFormError(result.error);
      return;
    }

    window.localStorage.setItem(
      LAST_BOOKING_STORAGE_KEY,
      JSON.stringify({
        businessSlug: barbershopSlug,
        serviceId: service.id,
        barberId: selectedBarberId,
      } satisfies LastBookingStorage)
    );

    setStep(6);
  }

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-[#FAF8F4] text-slate-950 shadow-[var(--shadow-card)]">
        <div className="border-b border-amber-200/40 bg-[linear-gradient(180deg,#F8F3EA_0%,#F3EDE1_100%)] p-5 md:p-7">
          <BookingHeader
            barbershopName={barbershopName}
            barbershopCity={barbershopCity}
          />
          {step === 1 && <TrustBadges />}
          <StepProgress step={step} />
        </div>

        <div className="p-5 md:p-7">

        {/* Volver */}
        {step > 1 && step <= 5 && (
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setStep(step - 1);
            }}
            className="mb-5 flex min-h-[44px] items-center gap-1 px-1 text-sm font-bold text-slate-500 hover:text-[#111827]"
          >
            <ChevronLeft size={15} /> Volver
          </button>
        )}

        {/* ── Step 1: Servicio ── */}
        {step === 1 && (
          <section>
            <StepTitle
              title="Elige el servicio que necesitas"
              description="Verás duración, precio y horarios disponibles antes de confirmar."
            />

            {showRepeatPrompt && lastBooking && (
              <div className="mt-4 rounded-2xl border border-[#D9B766]/40 bg-[#FFFBEB] p-4">
                <p className="text-sm font-black text-[#111827]">
                  ¿Quieres repetir tu última cita?
                </p>
                <div className="mt-3 grid gap-2 text-sm text-neutral-700">
                  <p>
                    <span className="font-semibold">Mismo servicio:</span>{" "}
                    {services.find((item) => item.id === lastBooking.serviceId)?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Mismo barbero:</span>{" "}
                    {lastBooking.barberId
                      ? barbers.find((item) => item.id === lastBooking.barberId)?.name
                      : "Primer barbero disponible"}
                  </p>
                  <p className="font-semibold text-[#8A641F]">
                    Solo cambia fecha y hora.
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={repeatLastBooking}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#111827] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0F172A] active:scale-[0.98]"
                  >
                    Repetir cita
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRepeatPrompt(false)}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#D5CEBC] bg-[#F8F3EA] px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-[#F6F1E8]"
                  >
                    Elegir otra cosa
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3">
              {services.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-6 text-center">
                  <Scissors size={22} className="mx-auto text-neutral-300" />
                  <p className="mt-2 text-sm font-semibold text-neutral-500">
                    Esta barbería no tiene servicios disponibles aún.
                  </p>
                </div>
              )}

              {services.map((s) => (
                <ChoiceButton
                  key={s.id}
                  onClick={() => {
                    setService(s);
                    setFormError(null);
                    setStep(2);
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Miniatura del servicio */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/5 bg-[#F3EDE1]">
                      {s.image_url ? (
                        <Image src={s.image_url} alt={s.name} fill sizes="48px" className="object-cover" />
                      ) : (
                        <Scissors size={18} className="text-[#8A641F]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold">{s.name}</p>
                      {s.description && (
                        <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500">
                          {s.description}
                        </p>
                      )}
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-neutral-500">
                        <Clock size={12} /> {s.duration_minutes} min
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xl font-black">{s.price} €</span>
                </ChoiceButton>
              ))}
            </div>
          </section>
        )}

        {/* ── Step 2: Barbero ── */}
        {step === 2 && (
          <section>
            <StepTitle
              title="¿Con quién quieres ir?"
              description="Puedes elegir un barbero concreto o dejar que la barbería asigne el primero disponible."
            />

            <div className="mt-4 grid gap-3">
              <ChoiceButton
                onClick={() => {
                  setBarber({ id: "any", name: "Cualquiera" });
                  setDate("");
                  setTime("");
                  setUnavailableSlots([]);
                  setClosedReason(null);
                  setFormError(null);
                  setStep(3);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100">
                    <User size={18} className="text-slate-500" />
                  </div>

                  <div>
                    <p className="font-bold">Cualquiera</p>
                    <p className="text-sm text-neutral-500">
                      Primer barbero disponible
                    </p>
                  </div>
                </div>
                <BadgeCheck size={17} className="shrink-0 text-emerald-500" />
              </ChoiceButton>

              {barbers.map((b) => (
                <ChoiceButton
                  key={b.id}
                  onClick={() => {
                    setBarber(b);
                    setDate("");
                    setTime("");
                    setUnavailableSlots([]);
                    setClosedReason(null);
                    setFormError(null);
                    setStep(3);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm font-black uppercase ${b.photo_url ? "" : getBarberColor(b.name)}`}>
                      {b.photo_url
                        ? <Image src={b.photo_url} alt={b.name} fill sizes="44px" className="object-cover" />
                        : b.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{b.name}</p>
                      <p className="flex items-center gap-1 text-sm text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Disponible
                      </p>
                    </div>
                  </div>
                </ChoiceButton>
              ))}
            </div>
          </section>
        )}

        {/* ── Step 3: Fecha y hora ── */}
        {step === 3 && (
          <section>
            <StepTitle
              title="¿Cuándo vienes?"
              description="Selecciona un día y después una hora disponible."
            />

            <label htmlFor="booking-date" className="mt-4 block text-sm font-semibold text-neutral-700">
              Día
            </label>

            <input
              id="booking-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
                setUnavailableSlots([]);
                setClosedReason(null);
                setFormError(null);
              }}
              className="input mt-1 py-3"
            />

            {date && (
              <>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-neutral-700">Hora</p>

                  {checkingAvailability && (
                    <p className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-xs font-bold text-slate-500">
                      Comprobando disponibilidad...
                    </p>
                  )}
                </div>

                {formError && (
                  <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    {formError}
                  </p>
                )}

                {closedReason && (
                  <p className="mt-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800">
                    Cerrado: {closedReason}
                  </p>
                )}

                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {visibleSlots.map((slot) => {
                    const isUnavailable = unavailableSlots.includes(slot);
                    const isSelected = time === slot;
                    const freeCount = slotAvailableCount[slot] ?? 0;

                    let badge: { label: string; cls: string } | null = null;
                    if (!isUnavailable && !isSelected && !checkingAvailability) {
                      if (freeCount === 1) {
                        badge = { label: "Última plaza", cls: "text-amber-600 bg-amber-50" };
                      } else if (freeCount >= 2 && freeCount <= 3) {
                        badge = { label: `${freeCount} plazas`, cls: "text-emerald-700 bg-emerald-50" };
                      }
                    }

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={checkingAvailability || isUnavailable}
                        onClick={() => {
                          if (isUnavailable) {
                            setFormError("Esta hora ya no está disponible. Elige otra.");
                            return;
                          }
                          setTime(slot);
                          setFormError(null);
                          setStep(4);
                        }}
                        className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border py-2.5 text-sm font-semibold transition-all active:scale-[0.96] disabled:cursor-not-allowed ${
                          isUnavailable
                            ? "border-red-100 bg-red-50 text-red-300 line-through"
                            : isSelected
                            ? "border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0A] font-black"
                            : "border-neutral-200 hover:border-[#D4AF37] hover:bg-[#FEFCF8]"
                        }`}
                      >
                        <span>{slot}</span>
                        {isUnavailable && <span className="text-[10px] font-normal no-underline">Ocupado</span>}
                        {badge && !isSelected && (
                          <span className={`rounded-full px-1.5 py-px text-[9px] font-black ${badge.cls}`}>
                            {badge.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {visibleSlots.length === 0 && (
                  <div className="mt-3 rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-5 text-center">
                    <CalendarDays size={20} className="mx-auto text-neutral-300" />
                    <p className="mt-2 text-sm font-semibold text-neutral-600">
                      No quedan horas disponibles para este día.
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Prueba con otra fecha.
                    </p>
                  </div>
                )}

                <p className="mt-3 text-xs font-medium text-slate-500">
                  Solo mostramos horas disponibles. Si elegiste "Cualquiera",
                  se comprueba la disponibilidad del equipo.
                </p>
              </>
            )}
          </section>
        )}

        {/* ── Step 4: Datos personales ── */}
        {step === 4 && (
          <section className="pb-32 md:pb-0">
            <StepTitle
              title="Tus datos básicos"
              description="Usaremos tu WhatsApp solo para confirmar tu cita. Sin cuenta, sin contraseña."
            />

            <div className="mt-5 grid gap-4">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="booking-website">Website</label>
                <input
                  id="booking-website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              {/* Nombre */}
              <div>
                <label htmlFor="booking-name" className="mb-1 block text-sm font-semibold text-neutral-700">
                  Nombre completo *
                </label>
                <input
                  id="booking-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="Ej: Carlos García"
                  autoComplete="name"
                  aria-required="true"
                  className="input py-3"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="booking-phone" className="mb-1 block text-sm font-semibold text-neutral-700">
                  Teléfono *
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                  <input
                    id="booking-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="+34 600 000 000"
                    autoComplete="tel"
                    aria-required="true"
                    className="input py-3 pl-10"
                  />
                </div>
              </div>

              {/* Email opcional */}
              <div>
                <label htmlFor="booking-email" className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  Email
                    <span className="rounded-xl bg-neutral-100 px-2 py-0.5 text-xs font-bold text-slate-500">
                    opcional
                  </span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                  <input
                    id="booking-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    className="input py-3 pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Consentimiento marketing */}
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
              <input
                type="checkbox"
                checked={privacyRead}
                onChange={(e) => setPrivacyRead(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#2F6FEB]"
              />
              <span className="text-xs leading-relaxed text-neutral-500">
                He leído la{" "}
                <Link href="/legal/privacidad" className="font-semibold text-[#2F6FEB] hover:text-[#1D4ED8]">
                  Política de Privacidad
                </Link>{" "}
                y las{" "}
                <Link href="/legal/condiciones-reservas" className="font-semibold text-[#2F6FEB] hover:text-[#1D4ED8]">
                  Condiciones de Reservas
                </Link>
                .
              </span>
            </label>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#2F6FEB]"
              />
              <span className="text-xs leading-relaxed text-neutral-500">
                Acepto que{" "}
                <span className="font-semibold text-neutral-700">{barbershopName}</span>{" "}
                pueda contactarme por WhatsApp sobre esta reserva.{" "}
                <span className="text-slate-500">(Opcional)</span>
              </span>
            </label>

            {/* Error */}
            {formError && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                {formError}
              </p>
            )}

            {/* Botón continuar — desktop */}
            <div className="mt-5 hidden md:block">
              <button
                type="button"
                disabled={!name.trim() || !phone.trim() || !privacyRead}
                onClick={() => {
                  if (!name.trim() || !phone.trim()) {
                    setFormError("Añade tu nombre y WhatsApp para continuar.");
                    return;
                  }

                  if (!privacyRead) {
                    setFormError("Debes aceptar la política de privacidad.");
                    return;
                  }

                  setFormError(null);
                  setStep(5);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-4 text-base font-black text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/25 transition-all hover:bg-[#E5C04C] active:scale-[0.98] disabled:opacity-40"
              >
                Continuar
              </button>
            </div>

            {/* Mensaje de confianza — desktop */}
            <p className="mt-3 hidden text-center text-xs font-medium text-slate-500 md:block">
              Revisa tu cita antes de confirmar.
            </p>
          </section>
        )}

        {/* ── Step 5: Resumen y confirmación ── */}
        {step === 5 && (
          <section>
            <StepTitle
              title="Revisa tu cita antes de confirmar"
              description="Comprueba servicio, barbero, fecha y hora. La reserva se registrará al confirmar."
            />

            <div className="mt-5">
              <ReservationSummary
                service={service}
                barber={barber}
                date={date}
                time={time}
              />
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[#D5CEBC] bg-[#F8F3EA] px-4 py-3 text-sm text-neutral-600">
                <Phone size={14} className="shrink-0 text-slate-500" />
                <span>{name} · {phone}</span>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Cancelación:</span>{" "}
                Puedes cancelar o cambiar tu cita contactando directamente con la barbería.
              </p>
            </div>

            {formError && (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                {formError}
              </p>
            )}

            <div className="mt-5">
              <ConfirmButton
                saving={saving}
                disabled={saving}
                onClick={handleConfirmBooking}
                label="Reservar ahora"
              />
            </div>

              <p className="mt-3 text-center text-xs font-medium text-slate-500">
              <ShieldCheck size={12} className="mr-1 inline-block" />
              Reserva segura · Sin comisiones · Directo con {barbershopName}
            </p>
          </section>
        )}

        {/* ── Reserva confirmada ── */}
        {step === 6 && (() => {
          const durationMinutes = service?.duration_minutes ?? 30;
          const barberLabel = barber?.id === "any" ? "Primer barbero disponible" : (barber?.name ?? "");
          const calTitle = `Cita en ${barbershopName}`;
          const calDesc = [`${service?.name ?? ""}`, barberLabel ? `Con ${barberLabel}` : ""].filter(Boolean).join(" · ");
          const calLocation = [barbershopCity].filter(Boolean).join(", ");
          const googleCalUrl = date && time ? buildGoogleCalendarUrl(calTitle, date, time, durationMinutes, calLocation, calDesc) : null;

          return (
            <section className="space-y-4">

              {/* Hero confirmación */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 p-6 text-center">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]">
                  <CheckCircle size={34} className="text-emerald-600" />
                </div>
                <h2 className="mt-4 text-2xl font-black text-slate-950">¡Reserva confirmada!</h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Tu cita en <span className="font-semibold text-slate-800">{barbershopName}</span> está registrada.
                </p>
                {email && (
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-emerald-700">
                    <Mail size={12} />
                    Te enviamos un email de confirmación a <span className="font-semibold">{email}</span>
                  </p>
                )}
              </div>

              {/* Resumen */}
              <ReservationSummary service={service} barber={barber} date={date} time={time} />
              <div className="flex items-center gap-2 rounded-2xl border border-[#D5CEBC] bg-[#F8F3EA] px-4 py-3 text-sm text-neutral-600">
                <Phone size={14} className="shrink-0 text-slate-500" />
                <span>{name} · {phone}</span>
              </div>

              {/* Acciones: calendario, llamar, maps */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {googleCalUrl && (
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#D5CEBC] bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#D4AF37] hover:bg-[#FEFCF8] active:scale-[0.98]"
                  >
                    <CalendarPlus size={15} className="text-[#C9922A]" />
                    Google Calendar
                  </a>
                )}
                {date && time && (
                  <button
                    type="button"
                    onClick={() => downloadICS(calTitle, date, time, durationMinutes, calLocation, calDesc)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#D5CEBC] bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#D4AF37] hover:bg-[#FEFCF8] active:scale-[0.98]"
                  >
                    <Download size={15} className="text-slate-500" />
                    iPhone / Outlook (.ics)
                  </button>
                )}
                {barbershopPhone && (
                  <a
                    href={`tel:${barbershopPhone}`}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#D5CEBC] bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#D4AF37] hover:bg-[#FEFCF8] active:scale-[0.98]"
                  >
                    <Phone size={15} className="text-slate-500" />
                    Llamar a la barbería
                  </a>
                )}
                {barbershopMapsHref && (
                  <a
                    href={barbershopMapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#D5CEBC] bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#D4AF37] hover:bg-[#FEFCF8] active:scale-[0.98]"
                  >
                    <Navigation size={15} className="text-slate-500" />
                    Cómo llegar
                  </a>
                )}
              </div>

              {/* Nota cancelación */}
              <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-slate-400" />
                <p className="text-xs text-slate-500">
                  Para cambiar o cancelar tu cita, contacta directamente con <span className="font-semibold text-slate-600">{barbershopName}</span>.
                </p>
              </div>

              {/* CTA secundarios */}
              <button
                type="button"
                onClick={reset}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] py-3.5 text-sm font-bold text-slate-700 transition hover:bg-[#F8FAFC] active:scale-[0.98]"
              >
                <CalendarDays size={15} />
                Reservar otra cita
              </button>

              <p className="text-center text-xs text-slate-400">
                Reserva gestionada con <span className="font-semibold text-slate-500">BarberíaOS</span> · Sin comisiones
              </p>
            </section>
          );
        })()}
        </div>
      </div>

      {/* ── Botón fijo inferior — solo móvil ── */}
      {step === 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[#07101F]/95 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl md:hidden">
          <button
            type="button"
            disabled={!name.trim() || !phone.trim() || !privacyRead}
            onClick={() => {
              if (!name.trim() || !phone.trim()) {
                setFormError("Añade tu nombre y WhatsApp para continuar.");
                return;
              }

              if (!privacyRead) {
                setFormError("Debes aceptar la política de privacidad.");
                return;
              }

              setFormError(null);
              setStep(5);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-4 text-base font-black text-[#0A0A0A] shadow-lg shadow-[#D4AF37]/25 transition-all active:scale-[0.98] disabled:opacity-40"
          >
            Continuar
          </button>
          <p className="mt-2 text-center text-xs font-medium text-white/35">
            Revisa tu cita antes de confirmar.
          </p>
        </div>
      )}

      {step === 5 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[#07101F]/95 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl md:hidden">
          <ConfirmButton
            saving={saving}
            disabled={saving}
            onClick={handleConfirmBooking}
            label="Reservar ahora"
          />
          <p className="mt-2 text-center text-xs font-medium text-white/35">
            <ShieldCheck size={11} className="mr-1 inline-block" />
            Directo con {barbershopName}
          </p>
        </div>
      )}
    </>
  );
}
