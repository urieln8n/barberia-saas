"use client";

import { useState } from "react";
import { Clock, ChevronLeft, CalendarDays, CheckCircle, User, Scissors, Phone, BadgeCheck } from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";
import { createPublicBooking } from "./actions";

type Service = { id: string; name: string; price: number; duration_minutes: number };
type Barber  = { id: string; name: string };

type Props = {
  barbershopId: string;
  barbershopName: string;
  barbershopCity: string;
  services: Service[];
  barbers: Barber[];
};

const STEP_LABELS = ["Servicio", "Barbero", "Fecha y hora", "Tus datos"];

export function BookingForm({ barbershopId, barbershopName, barbershopCity, services, barbers }: Props) {
  const [step,      setStep]      = useState(1);
  const [service,   setService]   = useState<Service | null>(null);
  const [barber,    setBarber]    = useState<Barber | null>(null);
  const [date,      setDate]      = useState("");
  const [time,      setTime]      = useState("");
  const [name,      setName]      = useState("");
  const [phone,     setPhone]     = useState("");
  const [saving,    setSaving]    = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const slots = generateTimeSlots();
  const today = new Date().toISOString().split("T")[0];

  function reset() {
    setStep(1); setService(null); setBarber(null);
    setDate(""); setTime(""); setName(""); setPhone("");
    setFormError(null);
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl md:p-10">

      {/* ── Cabecera ── */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
          <Scissors size={22} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-neutral-500">{barbershopCity ? `Reserva online · ${barbershopCity}` : "Reserva online"}</p>
          <h1 className="truncate text-2xl font-black">{barbershopName}</h1>
        </div>
      </div>

      {/* ── Garantías ── */}
      {step === 1 && (
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
            <BadgeCheck size={13} className="text-emerald-500" /> Sin cuenta necesaria
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
            <Clock size={13} className="text-amber-500" /> Solo 30 segundos
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">
            <Phone size={13} className="text-blue-500" /> Solo nombre y teléfono
          </span>
        </div>
      )}

      {/* ── Barra de progreso con etiqueta ── */}
      {step < 5 && (
        <div className="mt-5">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s < step ? "bg-ink" : s === step ? "bg-ink" : "bg-neutral-100"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            Paso {step} de 4 ·{" "}
            <span className="font-semibold text-neutral-600">{STEP_LABELS[step - 1]}</span>
          </p>
        </div>
      )}

      {/* ── Volver ── */}
      {step > 1 && step < 5 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-3 flex items-center gap-1 text-sm text-neutral-400 hover:text-ink"
        >
          <ChevronLeft size={15} /> Volver
        </button>
      )}

      {/* ── Paso 1: Servicio ── */}
      {step === 1 && (
        <section className="mt-6">
          <h2 className="text-xl font-black">¿Qué servicio quieres?</h2>
          <p className="mt-1 text-sm text-neutral-500">Toca el servicio para continuar.</p>
          <div className="mt-4 grid gap-3">
            {services.length === 0 && (
              <p className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-400">
                Esta barbería no tiene servicios disponibles aún.
              </p>
            )}
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => { setService(s); setStep(2); }}
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

      {/* ── Paso 2: Barbero ── */}
      {step === 2 && (
        <section className="mt-6">
          <h2 className="text-xl font-black">¿Con quién quieres ir?</h2>
          <p className="mt-1 text-sm text-neutral-500">Elige tu barbero o selecciona el primero disponible.</p>
          <div className="mt-4 grid gap-3">
            <button
              onClick={() => { setBarber({ id: "any", name: "Cualquiera" }); setStep(3); }}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left transition-all hover:border-ink hover:bg-neutral-50 active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100">
                <User size={18} className="text-neutral-400" />
              </div>
              <div>
                <p className="font-bold">Cualquiera</p>
                <p className="text-sm text-neutral-500">Primer barbero disponible</p>
              </div>
            </button>
            {barbers.map((b) => (
              <button
                key={b.id}
                onClick={() => { setBarber(b); setStep(3); }}
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

      {/* ── Paso 3: Fecha y hora ── */}
      {step === 3 && (
        <section className="mt-6">
          <h2 className="text-xl font-black">¿Cuándo vienes?</h2>
          <p className="mt-1 text-sm text-neutral-500">Elige el día y la hora que prefieras.</p>
          <label className="mt-4 block text-sm font-semibold text-neutral-700">Día</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => { setDate(e.target.value); setTime(""); }}
            className="mt-1 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
          />
          {date && (
            <>
              <p className="mt-5 text-sm font-semibold text-neutral-700">Hora</p>
              <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => { setTime(slot.time); setStep(4); }}
                    className={`rounded-xl border py-3 text-sm font-semibold transition-all active:scale-[0.96] ${
                      time === slot.time
                        ? "border-ink bg-ink text-white"
                        : "border-neutral-200 hover:border-ink hover:bg-neutral-50"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* ── Paso 4: Datos ── */}
      {step === 4 && (
        <section className="mt-6">
          <h2 className="text-xl font-black">¿A nombre de quién?</h2>
          <p className="mt-1 text-sm text-neutral-500">Solo necesitamos tu nombre y teléfono. Sin contraseñas.</p>

          <div className="mt-5 grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-neutral-700">Nombre completo</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Carlos García"
                autoComplete="name"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-neutral-700">Teléfono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                autoComplete="tel"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-ink"
              />
            </div>
          </div>

          {/* Resumen */}
          <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm">
            <p className="mb-2 font-bold text-neutral-700">Resumen de tu reserva</p>
            <div className="space-y-1 text-neutral-600">
              <p>✂️ <span className="font-semibold">{service?.name}</span> · {service?.price} €</p>
              <p>👤 {barber?.id === "any" ? "Primer barbero disponible" : barber?.name}</p>
              <p>📅 {date} a las {time}</p>
            </div>
          </div>

          {formError && (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
              {formError}
            </p>
          )}

          <button
            onClick={async () => {
              if (!name.trim() || !phone.trim() || !service || !date || !time) return;
              setSaving(true);
              setFormError(null);
              const result = await createPublicBooking({
                barbershopId,
                serviceId: service.id,
                barberId: barber?.id ?? null,
                date,
                time,
                name,
                phone,
              });
              setSaving(false);
              if (result.error) {
                setFormError(result.error);
              } else {
                setStep(5);
              }
            }}
            disabled={!name.trim() || !phone.trim() || saving}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-4 text-base font-black text-white shadow-lg shadow-neutral-900/10 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
          >
            <CalendarDays size={18} />
            {saving ? "Enviando reserva..." : "Confirmar reserva"}
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            Al confirmar aceptas que la barbería guarde tu nombre y teléfono.
          </p>
        </section>
      )}

      {/* ── Paso 5: Confirmación ── */}
      {step === 5 && (
        <section className="mt-8">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle size={36} className="text-green-600" />
            </div>
            <h2 className="mt-4 text-2xl font-black">¡Reserva recibida!</h2>
            <p className="mt-2 text-neutral-500">
              Tu cita en <span className="font-semibold text-ink">{barbershopName}</span> está registrada.
            </p>
          </div>

          {/* Detalle de la cita */}
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-400">Detalle de tu cita</p>
            <div className="space-y-2 text-sm text-neutral-700">
              <div className="flex items-center gap-2">
                <Scissors size={14} className="shrink-0 text-neutral-400" />
                <span className="font-bold">{service?.name}</span>
                <span className="text-neutral-500">· {service?.price} €</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="shrink-0 text-neutral-400" />
                <span>{barber?.id === "any" ? "Primer barbero disponible" : barber?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="shrink-0 text-neutral-400" />
                <span>{date} a las <span className="font-bold">{time}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-neutral-400" />
                <span>{name} · {phone}</span>
              </div>
            </div>
          </div>

          {/* Estado pendiente */}
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-800">La barbería confirmará tu cita en breve.</p>
            <p className="mt-1 text-sm text-amber-700">
              Si tienes alguna duda, contacta directamente con {barbershopName}.
            </p>
          </div>

          <button
            onClick={reset}
            className="mt-5 w-full rounded-2xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
          >
            Hacer otra reserva
          </button>
        </section>
      )}
    </div>
  );
}
