import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  QrCode,
  Scissors,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SITE_URL } from "@/src/lib/site-url";

export const metadata: Metadata = {
  title: "Agenda Online para Barberías | BarberíaOS",
  description:
    "Agenda online para barberías: tus clientes reservan desde Instagram, WhatsApp, QR o tu página pública. Sin llamadas, sin papel. Configurada en 48h.",
  alternates: { canonical: `${SITE_URL}/agenda-online-barberia` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/agenda-online-barberia`,
    title: "Agenda Online para Barberías | BarberíaOS",
    description:
      "Agenda online profesional para barberías. Reservas 24h, QR y página pública. Sin comisión.",
    siteName: "BarberíaOS",
  },
};

const howWorks = [
  {
    step: "1",
    title: "Configuras tu barbería",
    text: "Servicios, precios, barberos y horarios. Nosotros te ayudamos en menos de 48 horas.",
  },
  {
    step: "2",
    title: "Compartes el enlace o el QR",
    text: "Tu enlace público de reservas funciona en Instagram, Google, WhatsApp y en el mostrador con QR.",
  },
  {
    step: "3",
    title: "Los clientes reservan solos",
    text: "Eligen servicio, barbero y hora. Confirman con un clic. Tú ves la agenda en tiempo real.",
  },
];

const benefits = [
  "Reservas 24 horas — incluso cuando estás cortando",
  "Sin llamadas, sin mensajes en WhatsApp",
  "Agenda por barbero con control de huecos",
  "QR imprimible para mostrador y escaparate",
  "Sin comisión por reserva — precio fijo mensual",
  "Tus clientes son tuyos — los datos no van a ninguna plataforma",
];

const faqs = [
  {
    q: "¿Cómo reservan mis clientes con la agenda online?",
    a: "Comparten el enlace público de reservas de tu barbería o escanean el QR del local. El cliente elige barbero, servicio y hora, sin llamadas ni mensajes de WhatsApp.",
  },
  {
    q: "¿Puedo controlar qué horas ofrezco para reservas?",
    a: "Sí. Tú configuras los horarios de trabajo, los descansos y los días festivos. La agenda solo muestra los huecos reales disponibles.",
  },
  {
    q: "¿Qué pasa si un cliente no aparece?",
    a: "El sistema registra el no-show en el historial del cliente. BarberíaOS envía recordatorios automáticos antes de la cita para reducir las ausencias.",
  },
  {
    q: "¿Puedo tener varios barberos con agendas separadas?",
    a: "Sí. Cada barbero tiene su propia columna en la agenda y los clientes pueden elegir con quién quieren su cita.",
  },
];

export default function AgendaOnlineBarberiaPage() {
  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#080A0F]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#C9922A]">
              <Scissors size={19} />
            </span>
            <span className="font-black tracking-tight">BarberíaOS</span>
          </Link>
          <PrimaryButton href="/login" variant="gold">
            Probar gratis
          </PrimaryButton>
        </div>
      </header>

      <section className="bg-[#080A0F] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.06em] text-[#C9922A]">
            Agenda online para barbería
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            La agenda online que convierte WhatsApp en reservas automáticas.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
            BarberíaOS te da una agenda online para tu barbería donde los clientes reservan solos,
            a cualquier hora, desde su móvil — sin descargar apps, sin registros, sin llamadas.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/login" variant="gold" className="min-h-12 px-7">
              Activar mi agenda gratis <ArrowRight size={17} />
            </PrimaryButton>
            <PrimaryButton href="/" variant="ghost" className="min-h-12 px-6 text-white/70 hover:bg-white/10 hover:text-white">
              Ver cómo funciona
            </PrimaryButton>
          </div>
          <p className="mt-5 text-xs text-white/35">Sin tarjeta · Sin permanencia · Setup en 48h</p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-black text-[#080A0F] md:text-4xl">
            ¿Cómo funciona la agenda online de BarberíaOS?
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {howWorks.map((h) => (
              <article
                key={h.step}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#080A0F] text-sm font-black text-[#C9922A]">
                  {h.step}
                </span>
                <h3 className="mt-5 text-xl font-black text-[#080A0F]">{h.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{h.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black text-[#080A0F] md:text-3xl">
            Por qué las barberías eligen BarberíaOS como su agenda online
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-[#F6F8FB] px-5 py-4">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                <span className="text-sm font-bold leading-6 text-slate-700">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8">
            <div className="flex items-start gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#C9922A]/10">
                <QrCode size={22} className="text-[#C9922A]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#080A0F]">
                  QR de reservas para tu barbería
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Con BarberíaOS obtienes un QR descargable que puedes pegar en el mostrador,
                  el escaparate, las tarjetas o Instagram. El cliente lo escanea, elige servicio y hora, y reserva.
                  Sin apps. Sin registro. En menos de un minuto.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <CalendarClock size={15} className="text-[#C9922A]" />
                  <span className="text-sm font-bold text-slate-600">
                    Disponible desde el plan Arranca — 39 €/mes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black text-[#080A0F] md:text-3xl">
            Preguntas frecuentes sobre la agenda online para barberías
          </h2>
          <div className="mt-8 divide-y divide-slate-100 rounded-[28px] border border-slate-200 bg-[#F6F8FB]">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5 md:p-6">
                <p className="font-black text-[#080A0F]">{faq.q}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#C9922A]/25 bg-[#080A0F] p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-black md:text-4xl">
            Activa tu agenda online hoy.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/65">
            Te lo configuramos en 48 horas. Sin conocimientos técnicos. Sin contrato.
          </p>
          <PrimaryButton href="/login" variant="gold" className="mt-8 min-h-12 px-8">
            Empezar gratis <ArrowRight size={17} />
          </PrimaryButton>
          <p className="mt-4 text-xs text-white/35">Sin tarjeta · Sin permanencia</p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 text-center text-xs text-slate-400 lg:px-8">
        <div className="flex flex-wrap justify-center gap-5">
          <Link href="/" className="font-bold text-slate-600 hover:text-[#080A0F]">
            ← BarberíaOS
          </Link>
          <Link href="/barberias" className="font-bold text-slate-600 hover:text-[#080A0F]">
            Directorio de barberías
          </Link>
        </div>
        <p className="mt-2">© {new Date().getFullYear()} BarberíaOS — Agenda online para barberías.</p>
      </footer>
    </main>
  );
}
