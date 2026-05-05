"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  ChevronLeft,
  CalendarDays,
  CheckCircle,
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
import { createPublicBooking, getUnavailableSlots } from "./actions";

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

type Barber = {
  id: string;
  name: string;
};

type Props = {
  barbershopId: string;
  barbershopName: string;
  barbershopCity: string;
  services: Service[];
  barbers: Barber[];
};

const STEP_LABELS = ["Servicio", "Barbero", "Fecha y hora", "Tus datos"];

export function BookingForm({
  barbershopId,
  barbershopName,
  barbershopCity,
  services,
  barbers,
}: Props) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

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
    setMarketingConsent(false);
    setSaving(false);
    setCheckingAvailability(false);
    setUnavailableSlots([]);
    setFormError(null);
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

    setStep(5);
  }

  return (
    <>
      <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl md:p-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
            <Scissors size={22} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm text-neutral-500">
              {barbershopCity
                ? `Reserva online · ${barbershopCity}`
                : "Reserva online"}
            </p>
            <h1 className="truncate text-2xl font-black">{barbershopName}</h1>
          </div>
        </div>

        {/* Badges intro — solo step 1 */}
        {step === 1 && (
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
              <BadgeCheck size={13} className="text-emerald-500" /> Sin cuenta
              necesaria
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
              <Clock size={13} className="text-amber-500" /> Solo 30 segundos
            </span>

            <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
              <Phone size={13} className="text-blue-500" /> Solo nombre y teléfono
            </span>
          </div>
        )}

        {/* Progress bar */}
        {step < 5 && (
          <div className="mt-5">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? "bg-[#8E1F2D]" : "bg-neutral-100"
                  }`}
                />
              ))}
            </div>

            <p className="mt-2 text-xs text-neutral-400">
              Paso {step} de 4 ·{" "}
              <span className="font-semibold text-neutral-600">
                {STEP_LABELS[step - 1]}
              </span>
            </p>
          </div>
        )}

        {/* Volver */}
        {step > 1 && step < 5 && (
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setStep(step - 1);
            }}
            className="mt-3 flex items-center gap-1 text-sm text-neutral-400 hover:text-ink"
          >
            <ChevronLeft size={15} /> Volver
          </button>
        )}

        {/* ── Step 1: Servicio ── */}
        {step === 1 && (
          <section className="mt-6">
            <h2 className="text-xl font-black">¿Qué servicio quieres?</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Toca el servicio para continuar.
            </p>

            <div className="mt-4 grid gap-3">
              {services.length === 0 && (
                <p className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
                  Esta barbería no tiene servicios disponibles aún.
                </p>
              )}

              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setService(s);
                    setFormError(null);
                    setStep(2);
                  }}
                  className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 text-left transition-all hover:border-ink hover:bg-neutral-50 active:scale-[0.98]"
                >
                  <div>
                    <p className="font-bold">{s.name}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-neutral-500">
                      <Clock size={12} /> {s.duration_minutes} min
                    </p>
                  </div>

                  <span className="text-xl font-black">{s.price} €</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Step 2: Barbero ── */}
        {step === 2 && (
          <section className="mt-6">
            <h2 className="text-xl font-black">¿Con quién quieres ir?</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Elige tu barbero o selecciona el primero disponible.
            </p>

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setBarber({ id: "any", name: "Cualquiera" });
                  setDate("");
                  setTime("");
                  setUnavailableSlots([]);
                  setFormError(null);
                  setStep(3);
                }}
                className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left transition-all hover:border-ink hover:bg-neutral-50 active:scale-[0.98]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100">
                  <User size={18} className="text-neutral-400" />
                </div>

                <div>
                  <p className="font-bold">Cualquiera</p>
                  <p className="text-sm text-neutral-500">
                    Primer barbero disponible
                  </p>
                </div>
              </button>

              {barbers.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBarber(b);
                    setDate("");
                    setTime("");
                    setUnavailableSlots([]);
                    setFormError(null);
                    setStep(3);
                  }}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left transition-all hover:border-ink hover:bg-neutral-50 active:scale-[0.98]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-sm font-black uppercase">
                    {b.name.charAt(0)}
                  </div>

                  <p className="font-bold">{b.name}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Step 3: Fecha y hora ── */}
        {step === 3 && (
          <section className="mt-6">
            <h2 className="text-xl font-black">¿Cuándo vienes?</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Elige el día y la hora que prefieras.
            </p>

            <label className="mt-4 block text-sm font-semibold text-neutral-700">
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
              className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
            />

            {date && (
              <>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-neutral-700">Hora</p>

                  {checkingAvailability && (
                    <p className="text-xs font-medium text-neutral-400">
                      Comprobando disponibilidad...
                    </p>
                  )}
                </div>

                {formError && (
                  <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                    {formError}
                  </p>
                )}

                <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
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
                        className={`rounded-xl border py-3 text-sm font-semibold transition-all active:scale-[0.96] disabled:cursor-not-allowed ${
                          isUnavailable
                            ? "border-red-100 bg-red-50 text-red-300 line-through"
                            : time === slot.time
                            ? "border-[#8E1F2D] bg-[#8E1F2D] text-white"
                            : "border-neutral-200 hover:border-ink hover:bg-neutral-50"
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

                <p className="mt-3 text-xs text-neutral-400">
                  Las horas marcadas como ocupadas ya tienen todos los barberos
                  disponibles reservados o el barbero elegido está ocupado.
                </p>
              </>
            )}
          </section>
        )}

        {/* ── Step 4: Datos personales ── */}
        {step === 4 && (
          <section className="mt-6 pb-32 md:pb-0">
            <h2 className="text-xl font-black">Último paso: tus datos</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Solo necesitamos tu nombre y teléfono. Sin contraseñas.
            </p>

            <div className="mt-5 grid gap-4">
              {/* Nombre */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
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
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-neutral-700">
                  Teléfono *
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="+34 600 000 000"
                    autoComplete="tel"
                    className="w-full rounded-2xl border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Email opcional */}
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  Email
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-400">
                    opcional
                  </span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>
            </div>

            {/* Resumen de reserva mejorado */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="border-b border-neutral-100 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
                  Resumen de tu reserva
                </p>
              </div>

              <div className="space-y-3 px-4 py-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-neutral-800">
                    <Scissors size={13} className="shrink-0 text-neutral-400" />
                    {service?.name}
                  </span>
                  <span className="font-black text-neutral-900">{service?.price} €</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-500">
                  <Clock size={13} className="shrink-0 text-neutral-400" />
                  {service?.duration_minutes} min de duración
                </div>

                <div className="flex items-center gap-2 text-neutral-600">
                  <User size={13} className="shrink-0 text-neutral-400" />
                  {barber?.id === "any" ? "Primer barbero disponible" : barber?.name}
                </div>

                <div className="flex items-center gap-2 text-neutral-600">
                  <CalendarDays size={13} className="shrink-0 text-neutral-400" />
                  {date
                    ? new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })
                    : date}{" "}
                  · {time}h
                </div>

                <div className="mt-1 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
                  <CreditCard size={14} className="shrink-0 text-neutral-400" />
                  <span className="font-medium text-neutral-700">Pago en el local</span>
                  <span className="ml-auto text-xs text-neutral-400">efectivo · Bizum</span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2.5">
                  <CreditCard size={14} className="shrink-0 text-neutral-300" />
                  <span className="text-xs text-neutral-400">Tarjeta · Google Pay</span>
                  <span className="ml-auto rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                    Próximamente
                  </span>
                </div>
              </div>
            </div>

            {/* Política de cancelación */}
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Cancelación:</span>{" "}
                Puedes cancelar o cambiar tu cita contactando directamente con la barbería.
              </p>
            </div>

            {/* Consentimiento marketing */}
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#8E1F2D]"
              />
              <span className="text-xs leading-relaxed text-neutral-500">
                Acepto recibir recordatorios y comunicaciones de{" "}
                <span className="font-semibold text-neutral-700">{barbershopName}</span>{" "}
                por WhatsApp.{" "}
                <span className="text-neutral-400">(Opcional)</span>
              </span>
            </label>

            {/* Error */}
            {formError && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                {formError}
              </p>
            )}

            {/* Botón confirmar — desktop */}
            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={!name.trim() || !phone.trim() || saving}
              className="mt-5 hidden w-full items-center justify-center gap-2 rounded-2xl bg-[#8E1F2D] py-4 text-base font-black text-white shadow-lg shadow-[#8E1F2D]/20 transition-all hover:bg-[#6B1622] active:scale-[0.98] disabled:opacity-40 md:flex"
            >
              <CalendarDays size={18} />
              {saving ? "Comprobando disponibilidad..." : "Confirmar reserva"}
            </button>

            {/* Mensaje de confianza — desktop */}
            <p className="mt-3 hidden text-center text-xs text-neutral-400 md:block">
              <ShieldCheck size={12} className="mr-1 inline-block" />
              Reserva segura · Sin comisiones · Directo con {barbershopName}
            </p>
          </section>
        )}

        {/* ── Step 5: Confirmación ── */}
        {step === 5 && (
          <section className="mt-8">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={36} className="text-green-600" />
              </div>

              <h2 className="mt-4 text-2xl font-black">¡Reserva recibida!</h2>

              <p className="mt-2 text-neutral-500">
                Tu cita en{" "}
                <span className="font-semibold text-ink">{barbershopName}</span>{" "}
                está registrada.
              </p>
            </div>

            {/* Detalle de la cita */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="border-b border-neutral-100 px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
                  Detalle de tu cita
                </p>
              </div>

              <div className="space-y-3 px-5 py-4 text-sm text-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold">
                    <Scissors size={14} className="shrink-0 text-neutral-400" />
                    {service?.name}
                  </span>
                  <span className="font-black">{service?.price} €</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-500">
                  <Clock size={14} className="shrink-0 text-neutral-400" />
                  {service?.duration_minutes} min de duración
                </div>

                <div className="flex items-center gap-2">
                  <User size={14} className="shrink-0 text-neutral-400" />
                  <span>
                    {barber?.id === "any"
                      ? "Primer barbero disponible"
                      : barber?.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="shrink-0 text-neutral-400" />
                  <span>
                    {date
                      ? new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })
                      : date}{" "}
                    a las <span className="font-bold">{time}h</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={14} className="shrink-0 text-neutral-400" />
                  <span>
                    {name} · {phone}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
                  <CreditCard size={14} className="shrink-0 text-neutral-400" />
                  <span className="font-medium">Pago en el local</span>
                </div>
              </div>
            </div>

            {/* Aviso confirmación */}
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-800">
                La barbería confirmará tu cita en breve.
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Si tienes alguna duda, contacta directamente con {barbershopName}.
              </p>
            </div>

            {/* Botón compartir por WhatsApp */}
            {(() => {
              const waText = encodeURIComponent(
                `Hola, acabo de reservar en ${barbershopName}:\n` +
                `• ${service?.name} · ${service?.price} €\n` +
                `• ${barber?.id === "any" ? "Primer barbero disponible" : barber?.name}\n` +
                `• ${date} a las ${time}h\n` +
                `¡Nos vemos!`
              );
              return (
                <a
                  href={`https://wa.me/?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 active:scale-[0.98]"
                >
                  <MessageCircle size={16} />
                  Compartir cita por WhatsApp
                </a>
              );
            })()}

            <button
              type="button"
              onClick={reset}
              className="mt-3 w-full rounded-2xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              Hacer otra reserva
            </button>
          </section>
        )}
      </div>

      {/* ── Botón fijo inferior — solo móvil, solo Step 4 ── */}
      {step === 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-100 bg-white px-4 pb-6 pt-4 shadow-[0_-4px_32px_rgba(0,0,0,0.08)] md:hidden">
          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={!name.trim() || !phone.trim() || saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8E1F2D] py-4 text-base font-black text-white shadow-lg shadow-[#8E1F2D]/20 transition-all hover:bg-[#6B1622] active:scale-[0.98] disabled:opacity-40"
          >
            <CalendarDays size={18} />
            {saving ? "Comprobando disponibilidad..." : "Confirmar reserva"}
          </button>
          <p className="mt-2 text-center text-xs text-neutral-400">
            <ShieldCheck size={11} className="mr-1 inline-block" />
            Reserva segura · Sin comisiones · Directo con {barbershopName}
          </p>
        </div>
      )}
    </>
  );
}
