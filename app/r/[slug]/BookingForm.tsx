"use client";

import { useState } from "react";
import { Clock, ChevronLeft, CalendarDays, CheckCircle, User, Scissors } from "lucide-react";
import { generateTimeSlots } from "@/src/lib/booking/time-slots";

type Service = { id: string; name: string; price: number; duration_minutes: number };
type Barber  = { id: string; name: string };

type Props = {
  barbershopName: string;
  barbershopCity: string;
  services: Service[];
  barbers: Barber[];
};

export function BookingForm({ barbershopName, barbershopCity, services, barbers }: Props) {
  const [step,    setStep]    = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [barber,  setBarber]  = useState<Barber | null>(null);
  const [date,    setDate]    = useState("");
  const [time,    setTime]    = useState("");
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");

  const slots = generateTimeSlots();
  const today = new Date().toISOString().split("T")[0];

  function reset() {
    setStep(1); setService(null); setBarber(null);
    setDate(""); setTime(""); setName(""); setPhone("");
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 text-ink shadow-2xl md:p-10">

      {/* Cabecera */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
          <Scissors />
        </div>
        <div>
          <p className="text-sm text-neutral-500">Reserva online · {barbershopCity}</p>
          <h1 className="text-2xl font-black">{barbershopName}</h1>
        </div>
      </div>

      {/* Progreso */}
      {step < 5 && (
        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-ink" : "bg-neutral-100"}`} />
          ))}
        </div>
      )}

      {/* Volver */}
      {step > 1 && step < 5 && (
        <button onClick={() => setStep(step - 1)} className="mt-4 flex items-center gap-1 text-sm text-neutral-400 hover:text-ink">
          <ChevronLeft size={16} /> Volver
        </button>
      )}

      {/* Paso 1 — Servicio */}
      {step === 1 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold">Elige un servicio</h2>
          <div className="mt-4 grid gap-3">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => { setService(s); setStep(2); }}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 p-4 text-left transition-colors hover:border-ink hover:bg-neutral-50"
              >
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="flex items-center gap-1.5 text-sm text-neutral-500">
                    <Clock size={13} /> {s.duration_minutes} min
                  </p>
                </div>
                <span className="text-lg font-black">{s.price} €</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Paso 2 — Barbero */}
      {step === 2 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold">Elige un barbero</h2>
          <div className="mt-4 grid gap-3">
            <button
              onClick={() => { setBarber({ id: "any", name: "Cualquiera" }); setStep(3); }}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left transition-colors hover:border-ink hover:bg-neutral-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                <User size={18} className="text-neutral-400" />
              </div>
              <div>
                <p className="font-bold">Cualquiera</p>
                <p className="text-sm text-neutral-500">Primer disponible</p>
              </div>
            </button>
            {barbers.map((b) => (
              <button
                key={b.id}
                onClick={() => { setBarber(b); setStep(3); }}
                className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 text-left transition-colors hover:border-ink hover:bg-neutral-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-sm font-bold uppercase">
                  {b.name.charAt(0)}
                </div>
                <p className="font-bold">{b.name}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Paso 3 — Fecha y hora */}
      {step === 3 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold">Elige fecha y hora</h2>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => { setDate(e.target.value); setTime(""); }}
            className="mt-4 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-ink"
          />
          {date && (
            <>
              <p className="mt-5 text-sm font-semibold text-neutral-500">Horas disponibles</p>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => { setTime(slot.time); setStep(4); }}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                      time === slot.time ? "border-ink bg-ink text-white" : "border-neutral-200 hover:border-ink"
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

      {/* Paso 4 — Datos de contacto */}
      {step === 4 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold">Tus datos</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-neutral-700">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-neutral-700">Teléfono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-ink"
              />
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm">
            <p className="font-semibold text-neutral-700">Resumen de tu reserva</p>
            <p className="mt-2 text-neutral-600">{service?.name} · {service?.price} €</p>
            <p className="text-neutral-600">
              {barber?.id === "any" ? "Primer barbero disponible" : barber?.name} · {date} · {time}
            </p>
          </div>

          <button
            onClick={() => { if (name.trim() && phone.trim()) setStep(5); }}
            disabled={!name.trim() || !phone.trim()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-4 font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            <CalendarDays size={18} /> Confirmar reserva
          </button>
        </section>
      )}

      {/* Paso 5 — Confirmación */}
      {step === 5 && (
        <section className="mt-8 text-center">
          <div className="flex justify-center">
            <CheckCircle size={56} className="text-green-500" />
          </div>
          <h2 className="mt-4 text-2xl font-black">¡Reserva confirmada!</h2>
          <p className="mt-2 text-neutral-500">Te esperamos en {barbershopName}</p>

          <div className="mt-6 rounded-2xl bg-neutral-50 p-5 text-left text-sm">
            <p className="font-bold">{service?.name} · {service?.price} €</p>
            <p className="mt-1 text-neutral-500">
              {barber?.id === "any" ? "Primer barbero disponible" : barber?.name}
            </p>
            <p className="text-neutral-500">{date} a las {time}</p>
            <p className="mt-2 text-neutral-500">A nombre de <span className="font-semibold text-ink">{name}</span> · {phone}</p>
          </div>

          <button
            onClick={reset}
            className="mt-6 w-full rounded-2xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Hacer otra reserva
          </button>
        </section>
      )}
    </div>
  );
}
