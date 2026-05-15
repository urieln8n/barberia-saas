"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  CalendarDays,
  CalendarCheck,
  CheckCircle,
  User,
  Scissors,
  Phone,
  BadgeCheck,
  Mail,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import { createPublicBooking, getUnavailableSlots } from "./actions";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
};

type Barber = {
  id: string;
  name: string;
};

type Props = {
  barbershopId: string;
  barbershopSlug: string;
  barbershopName: string;
  barbershopCity: string;
  services: Service[];
  barbers: Barber[];
  initialServiceId?: string | null;
  initialBarberId?: string | null;
};

const STEP_LABELS = ["Servicio", "Barbero", "Día y hora", "Tus datos"];
const LAST_BOOKING_STORAGE_KEY = "barberiaos:last-public-booking";

type LastBookingStorage = {
  businessSlug: string;
  serviceId: string;
  barberId: string | null;
};

function StepProgress({ step }: { step: number }) {
  if (step >= 5) return null;

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? "bg-[#D9B766] shadow-[0_0_18px_rgba(217,183,102,0.25)]" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-semibold text-white/50">Paso {step} de 4</span>
        <span className="font-black text-white">{STEP_LABELS[step - 1]}</span>
      </div>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="mt-5 grid gap-2">
      {[
        { icon: BadgeCheck, label: "Sin cuenta necesaria", tone: "text-emerald-600" },
        { icon: Clock, label: "Reserva en menos de 30 segundos", tone: "text-[#C9922A]" },
        { icon: ShieldCheck, label: "Directo con la barbería", tone: "text-[#2563EB]" },
      ].map(({ icon: Icon, label, tone }) => (
        <span
          key={label}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-semibold text-white/70"
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
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D9B766]/25 bg-[#D9B766]/12 text-[#F4D98F] shadow-[0_14px_34px_rgba(217,183,102,0.12)]">
        <Scissors size={22} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm text-white/50">
          {barbershopCity ? `Reserva online · ${barbershopCity}` : "Reserva online"}
        </p>
        <h1 className="truncate text-2xl font-black tracking-normal text-white">
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
      <h2 className="text-xl font-black text-white">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-white/58">{description}</p>
    </div>
  );
}

function ChoiceButton({
  children,
  onClick,
  selected = false,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all focus-visible:outline-[#D9B766] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        selected
          ? "border-[#D9B766]/60 bg-[#D9B766]/14 text-white shadow-[0_18px_54px_rgba(217,183,102,0.16)]"
          : "border-white/10 bg-white/[0.055] text-white hover:border-[#D9B766]/35 hover:bg-white/[0.085]"
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
    <div className="flex items-center gap-2 text-sm text-white/62">
      <Icon size={14} className="shrink-0 text-[#D9B766]" />
      {label && <span className="text-white/38">{label}</span>}
      <span className={strong ? "font-bold text-white" : ""}>{value}</span>
    </div>
  );
}

function formatPrice(value: number | undefined) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(Number(value ?? 0)) ? 0 : 2,
  }).format(Number(value ?? 0));
}

function StepPanel({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}

function ElegantError({ message }: { message: string }) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-300/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <p className="font-medium">{message}</p>
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
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055]">
      <div className="border-b border-white/10 bg-white/[0.045] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-[#D9B766]">
          Resumen de reserva
        </p>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <InfoRow icon={Scissors} value={service?.name ?? "Servicio"} strong />
          <span className="shrink-0 text-base font-black text-white">
            {formatPrice(service?.price)}
          </span>
        </div>
        <InfoRow icon={Clock} value={`${service?.duration_minutes ?? "--"} min de duración`} />
        <InfoRow
          icon={User}
          value={barber?.id === "any" ? "Primer barbero disponible" : barber?.name ?? "Barbero"}
        />
        <InfoRow icon={CalendarDays} value={`${formattedDate}${time ? ` · ${time}h` : ""}`} />

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/15 px-3 py-2.5 text-sm">
          <CreditCard size={14} className="shrink-0 text-[#D9B766]" />
          <span className="font-medium text-white/78">Pago en el local</span>
          <span className="ml-auto text-xs text-white/38">sin pago online</span>
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
  icon = "calendar",
}: {
  saving: boolean;
  disabled: boolean;
  onClick: () => void;
  label?: string;
  icon?: "calendar" | "check";
}) {
  const Icon = icon === "check" ? CheckCircle : CalendarCheck;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D9B766] py-4 text-base font-black text-[#080A0F] shadow-[0_18px_48px_rgba(217,183,102,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#E8C978] active:scale-[0.98] disabled:translate-y-0 disabled:opacity-40"
    >
      {saving ? <Clock size={18} /> : <Icon size={18} />}
      {saving ? "Comprobando disponibilidad..." : label}
    </motion.button>
  );
}

function MobileStepCta({
  step,
  saving,
  disabled,
  onConfirm,
  barbershopName,
}: {
  step: number;
  saving: boolean;
  disabled: boolean;
  onConfirm: () => void;
  barbershopName: string;
}) {
  if (step < 1 || step > 4) return null;

  const labels: Record<number, string> = {
    1: "Selecciona un servicio",
    2: "Selecciona barbero",
    3: "Elige día y hora",
    4: "Confirmar reserva",
  };
  const handleClick = () => {
    if (step === 4) {
      onConfirm();
      return;
    }

    document.getElementById("reservar")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 z-30 px-4 pb-3 pt-3 md:hidden bottom-[env(safe-area-inset-bottom)]">
      <div className="rounded-[24px] border border-white/10 bg-[#07111F]/90 p-3 shadow-[0_-18px_54px_rgba(0,0,0,0.30)] backdrop-blur-xl">
        <ConfirmButton
          saving={saving}
          disabled={step === 4 && disabled}
          onClick={handleClick}
          label={labels[step]}
          icon={step === 4 ? "check" : "calendar"}
        />
        {step === 4 && (
          <p className="mt-2 text-center text-xs text-white/42">
            <ShieldCheck size={11} className="mr-1 inline-block" />
            Reserva segura · Sin comisiones · Directo con {barbershopName}
          </p>
        )}
      </div>
    </div>
  );
}

export function BookingForm({
  barbershopId,
  barbershopSlug,
  barbershopName,
  barbershopCity,
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
  const [privacyRead, setPrivacyRead] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [lastBooking, setLastBooking] = useState<LastBookingStorage | null>(null);
  const [showRepeatPrompt, setShowRepeatPrompt] = useState(false);

  const slots = generateTimeSlots();

  const today = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const selectedBarberId =
    barber?.id && barber.id !== "any" ? barber.id : null;

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
      if (!date || !barber) {
        setUnavailableSlots([]);
        return;
      }

      setCheckingAvailability(true);
      setFormError(null);

      const result = await getUnavailableSlots({
        barbershopId,
        barberId: selectedBarberId,
        date,
      });

      if (cancelled) return;

      setCheckingAvailability(false);

      if (result.error) {
        setUnavailableSlots([]);
        setFormError(result.error);
        return;
      }

      setUnavailableSlots(result.unavailableSlots);

      if (time && result.unavailableSlots.includes(time)) {
        setTime("");
        setFormError("La hora seleccionada ya no está disponible.");
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [barbershopId, date, selectedBarberId, barber, time]);

  function reset() {
    setStep(1);
    setService(null);
    setBarber(null);
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setEmail("");
    setPrivacyRead(false);
    setMarketingConsent(false);
    setSaving(false);
    setCheckingAvailability(false);
    setUnavailableSlots([]);
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

    setStep(5);
  }

  return (
    <>
      <div className="overflow-hidden rounded-[28px] border border-white/12 bg-[#07111F]/82 text-white shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_12%_0%,rgba(217,183,102,0.14),transparent_24rem),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] p-5 md:p-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9B766]/30 bg-[#D9B766]/10 px-3 py-1 text-xs font-black text-[#F4D98F]">
            <Sparkles size={13} />
            Elige tu servicio y confirma tu hora
          </div>
          <BookingHeader
            barbershopName={barbershopName}
            barbershopCity={barbershopCity}
          />
          {step === 1 && <TrustBadges />}
          <StepProgress step={step} />
        </div>

        <div className="p-5 md:p-7">

        {/* Volver */}
        {step > 1 && step < 5 && (
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setStep(step - 1);
            }}
            className="mb-5 flex items-center gap-1 text-sm font-semibold text-white/45 transition hover:text-white"
          >
            <ChevronLeft size={15} /> Volver
          </button>
        )}

        <AnimatePresence mode="wait">
        {/* Step 1: Servicio */}
        {step === 1 && (
          <StepPanel key="service">
            <StepTitle
              title="¿Qué servicio quieres?"
              description="Reserva en menos de 30 segundos. Elige el servicio y verás precio, duración y disponibilidad."
            />

            {showRepeatPrompt && lastBooking && (
              <div className="mt-4 rounded-2xl border border-[#D9B766]/35 bg-[#D9B766]/10 p-4">
                <p className="text-sm font-black text-white">
                  ¿Quieres repetir tu última cita?
                </p>
                <div className="mt-3 grid gap-2 text-sm text-white/70">
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
                  <p className="font-semibold text-[#F4D98F]">
                    Solo cambia fecha y hora.
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={repeatLastBooking}
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#D9B766] px-4 py-2.5 text-sm font-bold text-[#080A0F] transition hover:bg-[#E8C978] active:scale-[0.98]"
                  >
                    Repetir cita
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRepeatPrompt(false)}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Elegir otra cosa
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3">
              {services.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.045] p-6 text-center">
                  <Scissors size={24} className="mx-auto text-[#D9B766]" />
                  <p className="mt-3 font-black text-white">
                    Aún no hay servicios publicados
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Esta barbería está preparando su catálogo online. Contacta por WhatsApp o vuelve más tarde.
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
                  <div>
                    <p className="font-bold text-white">{s.name}</p>
                    {s.description && (
                      <p className="mt-1 text-sm leading-5 text-white/55">
                        {s.description}
                      </p>
                    )}
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/45">
                      <Clock size={12} /> {s.duration_minutes} min
                    </p>
                  </div>

                  <span className="shrink-0 text-xl font-black text-[#F4D98F]">{formatPrice(s.price)}</span>
                </ChoiceButton>
              ))}
            </div>
          </StepPanel>
        )}

        {/* Step 2: Barbero */}
        {step === 2 && (
          <StepPanel key="barber">
            <StepTitle
              title="¿Con quién quieres ir?"
              description="Puedes elegir un barbero concreto o dejar que la barbería asigne el primero disponible."
            />

            <div className="mt-4 grid gap-3">
              {barbers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.045] p-6 text-center">
                  <User size={24} className="mx-auto text-[#D9B766]" />
                  <p className="mt-3 font-black text-white">
                    Equipo no disponible online
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    Esta barbería aún no ha publicado barberos activos para reservas.
                  </p>
                </div>
              ) : (
                <>
                  <ChoiceButton
                    onClick={() => {
                      setBarber({ id: "any", name: "Cualquiera" });
                      setDate("");
                      setTime("");
                      setUnavailableSlots([]);
                      setFormError(null);
                      setStep(3);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                        <User size={18} className="text-[#D9B766]" />
                      </div>

                      <div>
                        <p className="font-bold text-white">Cualquiera</p>
                        <p className="text-sm text-white/52">
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
                        setFormError(null);
                        setStep(3);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D9B766]/20 bg-[#D9B766]/10 text-sm font-black uppercase text-[#F4D98F]">
                          {b.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-bold text-white">{b.name}</p>
                          <p className="text-sm text-white/52">Barbero</p>
                        </div>
                      </div>
                    </ChoiceButton>
                  ))}
                </>
              )}
            </div>
          </StepPanel>
        )}

        {/* Step 3: Fecha y hora */}
        {step === 3 && (
          <StepPanel key="datetime">
            <StepTitle
              title="¿Cuándo vienes?"
              description="Selecciona un día y después una hora disponible."
            />

            <label className="mt-4 block text-sm font-semibold text-white/78">
              Día
            </label>

            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
                setUnavailableSlots([]);
                setFormError(null);
              }}
              className="mt-1 w-full rounded-[14px] border border-white/10 bg-white/[0.075] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#D9B766] focus:ring-4 focus:ring-[#D9B766]/10 [color-scheme:dark]"
            />

            {date && (
              <>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white/78">Hora</p>

                  {checkingAvailability && (
                    <p className="rounded-full border border-white/10 bg-white/[0.055] px-2.5 py-1 text-xs font-medium text-white/45">
                      Comprobando disponibilidad...
                    </p>
                  )}
                </div>

                {formError && <ElegantError message={formError} />}

                <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {slots.map((slot) => {
                    const isUnavailable = unavailableSlots.includes(slot.time);

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={checkingAvailability || isUnavailable}
                        onClick={() => {
                          if (isUnavailable) {
                            setFormError(
                              "Esta hora ya no está disponible. Elige otra."
                            );
                            return;
                          }

                          setTime(slot.time);
                          setFormError(null);
                          setStep(4);
                        }}
                        className={`min-h-12 rounded-xl border py-2 text-sm font-semibold transition-all active:scale-[0.96] disabled:cursor-not-allowed ${
                          isUnavailable
                            ? "border-red-300/15 bg-red-500/10 text-red-200/55 line-through"
                          : time === slot.time
                            ? "border-[#D9B766] bg-[#D9B766] text-[#080A0F] shadow-[0_12px_34px_rgba(217,183,102,0.18)]"
                            : "border-white/10 bg-white/[0.055] text-white hover:border-[#D9B766]/40 hover:bg-white/[0.085]"
                        }`}
                      >
                        <span>{slot.time}</span>
                        {isUnavailable && (
                          <span className="block text-[10px] no-underline">
                            Ocupado
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {date && !checkingAvailability && unavailableSlots.length >= slots.length && (
                  <div className="mt-4 rounded-2xl border border-[#D9B766]/25 bg-[#D9B766]/10 p-4 text-sm text-[#F4D98F]">
                    <p className="font-black">No quedan horarios disponibles este día</p>
                    <p className="mt-1 text-white/62">Prueba otro día para encontrar un hueco libre.</p>
                  </div>
                )}

                <p className="mt-3 text-xs text-white/38">
                  Las horas ocupadas no se pueden seleccionar. Si elegiste "Cualquiera",
                  se comprueba la disponibilidad del equipo.
                </p>
              </>
            )}
          </StepPanel>
        )}

        {/* Step 4: Datos personales */}
        {step === 4 && (
          <StepPanel key="customer">
          <div>
            <StepTitle
              title="Último paso: tus datos"
              description="Solo necesitamos tu nombre y teléfono. Sin cuenta, sin contraseña."
            />

            <div className="mt-5 grid gap-4">
              {/* Nombre */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-white/78">
                  Nombre completo *
                </label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="Ej: Carlos García"
                  autoComplete="name"
                  className="w-full rounded-[14px] border border-white/10 bg-white/[0.075] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#D9B766] focus:ring-4 focus:ring-[#D9B766]/10"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-white/78">
                  Teléfono *
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="+34 600 000 000"
                    autoComplete="tel"
                    className="w-full rounded-[14px] border border-white/10 bg-white/[0.075] px-4 py-3 pl-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#D9B766] focus:ring-4 focus:ring-[#D9B766]/10"
                  />
                </div>
              </div>

              {/* Email opcional */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-white/78">
                  Email
                  <span className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-white/38">
                    opcional
                  </span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    className="w-full rounded-[14px] border border-white/10 bg-white/[0.075] px-4 py-3 pl-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#D9B766] focus:ring-4 focus:ring-[#D9B766]/10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <ReservationSummary
                service={service}
                barber={barber}
                date={date}
                time={time}
                compact
              />
            </div>

            {/* Política de cancelación */}
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#D9B766]/20 bg-[#D9B766]/10 px-4 py-3">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#D9B766]" />
              <p className="text-xs text-white/68">
                <span className="font-semibold">Cancelación:</span>{" "}
                Puedes cancelar o cambiar tu cita contactando directamente con la barbería.
              </p>
            </div>

            {/* Consentimiento marketing */}
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3">
              <input
                type="checkbox"
                checked={privacyRead}
                onChange={(e) => setPrivacyRead(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#D9B766]"
              />
              <span className="text-xs leading-relaxed text-white/55">
                He leído la{" "}
                <Link href="/legal/privacidad" className="font-semibold text-[#F4D98F] hover:text-[#FFE7A6]">
                  Política de Privacidad
                </Link>{" "}
                y las{" "}
                <Link href="/legal/condiciones-reservas" className="font-semibold text-[#F4D98F] hover:text-[#FFE7A6]">
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
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#D9B766]"
              />
              <span className="text-xs leading-relaxed text-white/55">
                Acepto que{" "}
                <span className="font-semibold text-white/78">{barbershopName}</span>{" "}
                pueda contactarme por WhatsApp sobre esta reserva.{" "}
                <span className="text-white/35">(Opcional)</span>
              </span>
            </label>

            {/* Error */}
            {formError && <ElegantError message={formError} />}

            {/* Botón confirmar — desktop */}
            <div className="mt-5 hidden md:block">
              <ConfirmButton
                saving={saving}
                disabled={!name.trim() || !phone.trim() || saving}
                onClick={handleConfirmBooking}
              />
            </div>

            {/* Mensaje de confianza — desktop */}
            <p className="mt-3 hidden text-center text-xs text-white/38 md:block">
              <ShieldCheck size={12} className="mr-1 inline-block" />
              Reserva segura · Sin comisiones · Directo con {barbershopName}
            </p>
          </div>
          </StepPanel>
        )}

        {/* Step 5: Confirmación */}
        {step === 5 && (
          <StepPanel key="confirmed">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10">
                <CheckCircle size={36} className="text-emerald-300" />
              </div>

              <h2 className="mt-4 text-2xl font-black text-white">Reserva confirmada</h2>

              <p className="mt-2 text-white/58">
                Tu cita en{" "}
                <span className="font-semibold text-white">{barbershopName}</span>{" "}
                está registrada. Tu barbería te espera.
              </p>
            </div>

            <div className="mt-6">
              <ReservationSummary
                service={service}
                barber={barber}
                date={date}
                time={time}
              />
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white/65">
                <Phone size={14} className="shrink-0 text-[#D9B766]" />
                <span>{name} · {phone}</span>
              </div>
            </div>

            {/* Aviso confirmación */}
            <div className="mt-4 rounded-2xl border border-[#D9B766]/25 bg-[#D9B766]/10 p-4">
              <p className="text-sm font-bold text-[#F4D98F]">
                La barbería confirmará tu cita en breve.
              </p>
              <p className="mt-1 text-sm text-white/62">
                Si tienes alguna duda, contacta directamente con {barbershopName}.
              </p>
            </div>

            {/* Botón compartir por WhatsApp */}
            {(() => {
              const waText = encodeURIComponent(
                `Hola, acabo de reservar en ${barbershopName}:\n` +
                  `• ${service?.name} · ${formatPrice(service?.price)}\n` +
                `• ${barber?.id === "any" ? "Primer barbero disponible" : barber?.name}\n` +
                `• ${date} a las ${time}h\n` +
                `¡Nos vemos!`
              );
              return (
                <a
                  href={`https://wa.me/?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/15 active:scale-[0.98]"
                >
                  <MessageCircle size={16} />
                  Compartir cita por WhatsApp
                </a>
              );
            })()}

            <button
              type="button"
              onClick={reset}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold text-white/62 transition hover:bg-white/[0.08] hover:text-white"
            >
              Hacer otra reserva
            </button>
          </StepPanel>
        )}
        </AnimatePresence>
        </div>
      </div>

      <MobileStepCta
        step={step}
        saving={saving}
        disabled={!name.trim() || !phone.trim() || saving}
        onConfirm={handleConfirmBooking}
        barbershopName={barbershopName}
      />
    </>
  );
}
