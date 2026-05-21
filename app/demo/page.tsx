import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  MessageCircle,
  PackageCheck,
  QrCode,
  ReceiptText,
  Scissors,
  Sparkles,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BUSINESS_CONFIG, CONVERSION_EVENTS } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Demo guiada de BarberíaOS",
  description:
    "Recorrido comercial por BarberíaOS: dashboard, reserva pública, agenda, caja, productos, clientes e IA del dueño para barberías.",
  alternates: { canonical: `${BUSINESS_CONFIG.siteUrl}/demo` },
  openGraph: {
    title: "Demo guiada de BarberíaOS",
    description:
      "Mira cómo una barbería usa BarberíaOS para reservar, ordenar la agenda, cerrar caja, vender productos y recuperar clientes.",
    url: `${BUSINESS_CONFIG.siteUrl}/demo`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
  },
};

const journey = [
  {
    title: "Dashboard del dueño",
    text: "Empieza por la vista de mando: reservas de hoy, caja, ocupación, productos vendidos y próximos pasos.",
    icon: BarChart3,
    proof: "Lo verás en la demo guiada, sin necesitar acceso técnico.",
  },
  {
    title: "Reserva pública",
    text: "Prueba la experiencia que verá un cliente desde Instagram, Google, QR o WhatsApp.",
    icon: QrCode,
    proof: "Sin login para el cliente.",
  },
  {
    title: "Agenda por barbero",
    text: "Comprueba cómo se ordenan citas, huecos y estados para no depender de mensajes sueltos.",
    icon: CalendarDays,
    proof: "Te enseñamos el flujo en una llamada corta.",
  },
  {
    title: "Caja y cierre diario",
    text: "Mira cobros, métodos de pago, propinas y cierre para saber qué entra cada día.",
    icon: ReceiptText,
    proof: "Ejemplo visual de operación diaria.",
  },
  {
    title: "Productos e inventario",
    text: "Conecta venta en mostrador con stock básico para no perder margen en productos.",
    icon: PackageCheck,
    proof: "Ingresos extra visibles.",
  },
  {
    title: "IA del dueño",
    text: "Revisa sugerencias para huecos, clientes dormidos, campañas y mensajes comerciales.",
    icon: Bot,
    proof: "Ideas accionables, siempre revisadas por el dueño.",
  },
] as const;

const outcomes = [
  ["Reservas 24/7", "El cliente reserva cuando quiere y la barbería mantiene el control."],
  ["Caja conectada", "Cada servicio, producto y propina queda en el cierre del día."],
  ["Clientes propios", "La barbería conserva su base de clientes y no paga comisión por cita."],
] as const;

const demoNotes = [
  "Datos de ejemplo: las cifras del panel sirven para enseñar el flujo, no son resultados prometidos.",
  "La reserva pública sí se puede probar desde el enlace demo.",
  "Para ver el dashboard completo, pide demo y lo revisamos contigo sin que tengas que configurar nada.",
] as const;

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(37,99,235,0.12),transparent_28rem),radial-gradient(circle_at_90%_10%,rgba(212,175,102,0.16),transparent_24rem),linear-gradient(180deg,#FFFFFF_0%,#FAF8F4_48%,#F1ECE3_100%)] px-5 py-8 text-[#050A14] lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Volver a BarberíaOS">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAF8F4] text-[#B98B2F]">
              <Scissors size={18} />
            </span>
            <span className="font-black text-[#050A14]">BarberíaOS</span>
          </Link>
          <nav aria-label="Acciones de demo">
            <ul className="flex flex-wrap gap-2">
              <li><PrimaryButton href="/" variant="secondary">Volver</PrimaryButton></li>
              <li>
                <a
                  href={BUSINESS_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark"
                >
                  Pedir demo
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[var(--shadow-card)]">
          <div className="grid gap-0 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="p-6 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/10 px-4 py-2 text-xs font-black uppercase text-[#2563EB]">
                <CheckCircle2 size={14} />
                Demo comercial sin login
              </div>
              <h1 className="mt-6 text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95]">
                Entiende en 10 minutos si BarberíaOS encaja con tu barbería.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Prueba la reserva pública y revisa qué vería el dueño: agenda, caja, clientes, QR, Kit de activación y crecimiento. Los datos del panel son ejemplos para explicar el producto, no resultados inventados.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={BUSINESS_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-event={CONVERSION_EVENTS.openWhatsappDemo}
                  className="btn-primary min-h-12 px-6"
                >
                  <MessageCircle size={16} />
                  Pedir demo por WhatsApp
                </a>
                <PrimaryButton
                  href={BUSINESS_CONFIG.demoBookingUrl}
                  variant="secondary"
                  className="min-h-12 px-6"
                  data-event={CONVERSION_EVENTS.openPublicBookingDemo}
                >
                  Ver demo interactiva <ArrowRight size={16} />
                </PrimaryButton>
              </div>
              <div className="mt-6 grid gap-2">
                {demoNotes.map((note) => (
                  <p key={note} className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-600">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#2563EB]" />
                    {note}
                  </p>
                ))}
              </div>
            </div>
            <div className="border-t border-black/5 bg-[linear-gradient(135deg,#101827_0%,#1D2433_100%)] p-6 text-white lg:border-l lg:border-t-0 md:p-10">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-xs font-black uppercase text-[#38BDF8]">Panel demo · datos de ejemplo</p>
                    <h2 className="mt-1 text-2xl font-black">Demo Barber Studio</h2>
                  </div>
                  <Sparkles className="text-[#38BDF8]" />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ["Reservas", "31"],
                    ["Caja", "1.248 €"],
                    ["Productos", "186 €"],
                    ["Clientes a recuperar", "14"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                      <p className="text-[11px] font-black uppercase text-white/40">{label}</p>
                      <p className="mt-3 text-2xl font-black">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 rounded-2xl border border-[#D5A84C]/25 bg-[#D5A84C]/10 p-4 text-sm font-semibold leading-6 text-white/75">
                  Ejemplo de IA del dueño: mañana hay huecos entre 16:00 y 18:00. Publica corte + barba y escribe a clientes frecuentes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {outcomes.map(([title, text]) => (
            <article key={title} className="rounded-[24px] border border-black/5 bg-white p-5 shadow-[var(--shadow-soft)]">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-[#2563EB]">Recorrido recomendado</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Qué revisar en menos de 10 minutos</h2>
            </div>
            <PrimaryButton href={BUSINESS_CONFIG.demoBookingUrl} variant="secondary">
              Probar reserva pública
            </PrimaryButton>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journey.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="rounded-[2rem] border border-black/5 bg-[#FAF8F4] p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-amber-200/60 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="metric-icon bg-[#2563EB]/10 text-[#2563EB]">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{step.text}</p>
                  <p className="mt-4 text-sm font-black text-[#111827]">{step.proof}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#2563EB]">
                    Incluido en la demo <CheckCircle2 size={14} />
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-[#D5A84C]/30 bg-[#FFF7E6] p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-black">Siguiente paso lógico</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Prueba primero la reserva pública. Después pide una demo por WhatsApp para ver cómo quedaría con servicios, equipo, horarios, caja y materiales QR de tu barbería.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-[#080A0F] px-5 text-sm font-black text-white"
              >
                <MessageCircle size={16} />
                Pedir demo por WhatsApp
              </a>
              <PrimaryButton href={BUSINESS_CONFIG.demoBookingUrl} variant="secondary">
                Ver demo interactiva
              </PrimaryButton>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
