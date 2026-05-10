import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  QrCode,
  Scissors,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SITE_URL } from "@/src/lib/site-url";

export const metadata: Metadata = {
  title: "Software para Barberías | BarberíaOS",
  description:
    "BarberíaOS es el software para barberías más completo de España: reservas online, agenda, caja, clientes, barberos, QR y página pública. Sin comisión por reserva.",
  alternates: { canonical: `${SITE_URL}/software-para-barberias` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/software-para-barberias`,
    title: "Software para Barberías | BarberíaOS",
    description:
      "Software completo para barberías: reservas, caja, clientes, barberos y presencia online. Sin comisión.",
    siteName: "BarberíaOS",
  },
};

const features = [
  {
    icon: CalendarClock,
    title: "Agenda digital para barberías",
    text: "Tus clientes reservan solos, a cualquier hora, sin llamadas ni mensajes. Ves la agenda de cada barbero en tiempo real.",
  },
  {
    icon: WalletCards,
    title: "Caja y ventas por barbero",
    text: "Registra cada cobro, método de pago y propina. Cierre del día limpio sin hojas de Excel ni cuentas de cabeza.",
  },
  {
    icon: Users,
    title: "Base de datos de clientes propia",
    text: "Clientes frecuentes, nuevos y dormidos en un panel. Sin depender de Booksy ni Treatwell — los datos son tuyos.",
  },
  {
    icon: QrCode,
    title: "QR profesional de reservas",
    text: "Imprime el QR y ponlo en el mostrador, el escaparate o en Instagram. Escanean, eligen y reservan en segundos.",
  },
  {
    icon: ShieldCheck,
    title: "Auditoría web para barberías",
    text: "Analizamos tu web: velocidad, seguridad, SEO básico y si convierte a reserva. Puntuación y mejoras concretas.",
  },
  {
    icon: Scissors,
    title: "Página pública de reservas",
    text: "Tu barbería en /r/tu-barberia con servicios, barberos, precios y botón de reserva. Sin web previa necesaria.",
  },
];

const modules = [
  "Software de reservas para barbería",
  "Agenda online para barberos",
  "Control de caja y ventas",
  "Gestión de clientes frecuentes",
  "QR de reservas imprimible",
  "Página pública de barbería",
  "Directorio local por ciudad",
  "Auditoría web para barberías",
  "Widget instalable en tu web",
];

const faqs = [
  {
    q: "¿El software para barberías funciona sin conocimientos técnicos?",
    a: "Sí. BarberíaOS está diseñado para que cualquier barbero lo use desde el primer día. No necesitas saber de tecnología — te configuramos todo en 48 horas.",
  },
  {
    q: "¿Puedo gestionar varios barberos desde el mismo panel?",
    a: "Sí. Cada barbero tiene su propia agenda, sus propios servicios y su caja individual. Todo visible desde un único panel de control.",
  },
  {
    q: "¿Hay contrato de permanencia?",
    a: "No. BarberíaOS es mes a mes. Puedes cancelar cuando quieras sin penalización.",
  },
  {
    q: "¿Mis clientes necesitan descargar una app para reservar?",
    a: "No. Los clientes reservan desde su móvil a través de tu enlace /r/tu-barberia o escaneando el QR del local. Sin apps, sin registro obligatorio.",
  },
];

export default function SoftwareParaBarberiasPage() {
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
            Software para barberías
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            El software para barberías que gestiona reservas, caja y clientes.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
            BarberíaOS es un software vertical para barberías: agenda online, caja diaria, clientes propios,
            QR de reservas, página pública y directorio local. Sin comisión por reserva.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/login" variant="gold" className="min-h-12 px-7">
              Empezar gratis <ArrowRight size={17} />
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
            ¿Qué incluye el software para barberías?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-slate-500">
            Un sistema completo pensado para que el dueño de barbería controle todo desde un panel.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <article
                  key={f.title}
                  className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C9922A]/10 text-[#C9922A]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-[#080A0F]">{f.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{f.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black text-[#080A0F] md:text-3xl">
            Todo lo que incluye el software BarberíaOS
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <li key={m} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[#F6F8FB] px-4 py-3">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span className="text-sm font-bold text-slate-700">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black text-[#080A0F] md:text-3xl">
            Preguntas frecuentes sobre el software para barberías
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
            ¿Buscas software para tu barbería?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/65">
            BarberíaOS está configurado en 48h. Sin conocimientos técnicos. Sin contrato.
          </p>
          <PrimaryButton href="/login" variant="gold" className="mt-8 min-h-12 px-8">
            Activar mi barbería gratis <ArrowRight size={17} />
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
        <p className="mt-2">© {new Date().getFullYear()} BarberíaOS — Software para barberías modernas.</p>
      </footer>
    </main>
  );
}
