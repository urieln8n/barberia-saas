import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Scissors, Zap } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SITE_URL } from "@/src/lib/site-url";

export const metadata: Metadata = {
  title: "Programa de Reservas para Barberías | BarberíaOS",
  description:
    "Programa de reservas para barberías: gestiona citas, barberos y clientes desde un panel. Reservas online 24h, QR, página pública y sin comisión por cita.",
  alternates: { canonical: `${SITE_URL}/programa-reservas-barberia` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/programa-reservas-barberia`,
    title: "Programa de Reservas para Barberías | BarberíaOS",
    description:
      "El programa de reservas para barberías que gestiona agenda, caja y clientes. Sin comisión.",
    siteName: "BarberíaOS",
  },
};

const included = [
  "Reservas online desde móvil, Instagram o QR",
  "Agenda por barbero con control de huecos",
  "Confirmaciones automáticas de cita",
  "Detección de no-show y huecos libres",
  "Caja diaria con cobros por barbero",
  "Base de datos de clientes propia",
  "Enlace público de reservas de cada barbería",
  "QR descargable para el local",
  "Panel de control en tiempo real",
];

const problems = [
  {
    problem: "Reservas por WhatsApp",
    solution: "Agenda online 24h — los clientes reservan solos",
  },
  {
    problem: "No-show sin aviso",
    solution: "Confirmación de cita con recordatorio automático",
  },
  {
    problem: "Agenda en papel confusa",
    solution: "Panel digital por barbero, visible en cualquier dispositivo",
  },
  {
    problem: "No saber qué entra al día",
    solution: "Resumen diario y caja cuadrada sin Excel",
  },
];

const faqs = [
  {
    q: "¿El programa de reservas funciona desde el móvil?",
    a: "Sí. Tanto tú como tus clientes pueden usar BarberíaOS desde cualquier dispositivo — móvil, tablet u ordenador. No hay app que instalar.",
  },
  {
    q: "¿Necesito instalar algo para usar el programa?",
    a: "No. BarberíaOS funciona en el navegador. Solo necesitas una cuenta y ya puedes gestionar tu barbería desde cualquier dispositivo.",
  },
  {
    q: "¿Puedo probar el programa antes de pagar?",
    a: "Sí. Hay un periodo gratuito para que puedas comprobar cómo funciona antes de comprometerte con ningún pago.",
  },
  {
    q: "¿Cuánto tarda la configuración inicial?",
    a: "48 horas. Te ayudamos a configurar los barberos, los servicios y la página pública para que empieces a recibir reservas cuanto antes.",
  },
];

export default function ProgramaReservasBarberiaPage() {
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
            Programa de reservas para barbería
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            El programa de reservas para barberías que gestiona todo desde un panel.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
            BarberíaOS gestiona las reservas de tu barbería de principio a fin: el cliente reserva,
            el sistema confirma, tú ves la agenda en tiempo real. Sin papel, sin WhatsApp, sin confusión.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/login" variant="gold" className="min-h-12 px-7">
              Activar gratis <ArrowRight size={17} />
            </PrimaryButton>
          </div>
          <p className="mt-5 text-xs text-white/35">Sin tarjeta · Sin permanencia · Setup en 48h</p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black text-[#080A0F] md:text-4xl">
            Problemas reales que resuelve el programa de reservas
          </h2>
          <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            {problems.map(({ problem, solution }, i) => (
              <div
                key={problem}
                className={`grid gap-3 p-5 md:grid-cols-2 md:items-center ${
                  i < problems.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 text-sm">
                    ✕
                  </div>
                  <span className="text-sm font-bold text-slate-700">{problem}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">{solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black text-[#080A0F] md:text-3xl">
            ¿Qué incluye el programa BarberíaOS?
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#F6F8FB] px-4 py-3">
                <Zap size={15} className="shrink-0 text-[#C9922A]" />
                <span className="text-sm font-bold text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black text-[#080A0F] md:text-3xl">
            Preguntas frecuentes sobre el programa de reservas
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
            Activa el programa de reservas para tu barbería.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/65">
            Configurado en 48 horas. Sin conocimientos técnicos. Sin contrato.
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
        <p className="mt-2">© {new Date().getFullYear()} BarberíaOS — Programa de reservas para barberías.</p>
      </footer>
    </main>
  );
}
