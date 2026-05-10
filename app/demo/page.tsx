import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  QrCode,
  Scissors,
  Settings,
  Users,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const demoSteps = [
  {
    title: "Panel del dueño",
    text: "Vista general con reservas, huecos, clientes, caja y próximos pasos.",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Reservas",
    text: "Mira citas del día, confirma reservas y detecta huecos libres por barbero.",
    href: "/dashboard/agenda",
    icon: CalendarDays,
  },
  {
    title: "Clientes",
    text: "Consulta clientes guardados, visitas, teléfono y acciones de recuperación.",
    href: "/dashboard/clientes",
    icon: Users,
  },
  {
    title: "Barberos",
    text: "Añade tu equipo y mantén la agenda organizada por cada barbero.",
    href: "/dashboard/barberos",
    icon: Scissors,
  },
  {
    title: "Servicios",
    text: "Configura cortes, barba, combos, precios y duración para reservar online.",
    href: "/dashboard/servicios",
    icon: Settings,
  },
  {
    title: "QR Reservas",
    text: "Copia el link, descarga el QR y compártelo en Instagram, WhatsApp o Google.",
    href: "/dashboard/qr",
    icon: QrCode,
  },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#F7FAFC] px-5 py-8 text-[#080A0F] lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#D5A84C]">
              <Scissors size={18} />
            </span>
            <span className="font-black">BarberiaOS</span>
          </Link>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton href="/" variant="secondary">Volver a la landing</PrimaryButton>
            <PrimaryButton href="/login" variant="dark">Entrar al panel</PrimaryButton>
          </div>
        </header>

        <section className="mt-12 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)] md:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/10 px-4 py-2 text-xs font-black uppercase text-[#2563EB]">
              <CheckCircle2 size={14} />
              Demo guiada segura
            </div>
            <h1 className="mt-6 text-[clamp(2.6rem,6vw,5.2rem)] font-black leading-[0.95]">
              Explora BarberiaOS sin perderte.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Esta guía te enseña qué mirar primero: dashboard, reservas, clientes, barberos, servicios, QR y configuración. Para proteger datos reales, el panel completo requiere una cuenta y una barbería propia.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/login" variant="primary" className="min-h-12 px-6">
                Crear cuenta de prueba <ArrowRight size={16} />
              </PrimaryButton>
              <PrimaryButton href="/login" variant="secondary" className="min-h-12 px-6">
                Entrar al panel
              </PrimaryButton>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#DDE7FB] bg-[#EFF6FF] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="metric-icon bg-white text-[#2563EB]">
              <LockKeyhole size={17} />
            </div>
            <div>
              <h2 className="font-black text-[#111827]">Cómo probar sin tocar datos reales</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Crea una cuenta, completa el onboarding con una barbería ficticia y usa servicios/barberos de prueba. Cada cuenta trabaja sobre su propia barbería.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demoSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.title}
                href={step.href}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[var(--shadow-card)]"
              >
                <div className="metric-icon bg-[#2563EB]/10 text-[#2563EB]">
                  <Icon size={18} />
                </div>
                <h2 className="mt-5 text-xl font-black">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">{step.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#2563EB]">
                  Abrir sección <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
