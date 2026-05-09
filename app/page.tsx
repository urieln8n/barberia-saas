import Link from "next/link";
import type { HTMLAttributes } from "react";
import {
  ArrowRight,
  BadgeEuro,
  Banknote,
  BarChart3,
  CalendarClock,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  CreditCard,
  Crown,
  Minus,
  QrCode,
  ReceiptText,
  Scissors,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProductMockupCard } from "@/components/ui/ProductMockupCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

const painCards = [
  "No sabes quién cobró qué.",
  "Pierdes huecos libres durante el día.",
  "No sabes cuánto vende cada barbero.",
  "La caja no siempre cuadra.",
  "Las agendas genéricas no están pensadas solo para barberías.",
];

const barberColumns = [
  { name: "Carlos", slots: ["10:00 Corte", "12:00 Barba", "15:00 Libre", "17:30 Libre"], open: 2 },
  { name: "Miguel", slots: ["09:30 Libre", "11:00 Corte", "14:30 Libre", "18:00 Degradado"], open: 2 },
  { name: "Andrés", slots: ["10:30 Corte", "13:00 Libre", "16:00 Barba", "19:00 Libre"], open: 2 },
];

const salesRows = [
  { barber: "Carlos", services: "12", sales: "385 EUR", commission: "96 EUR" },
  { barber: "Miguel", services: "9", sales: "274 EUR", commission: "68 EUR" },
  { barber: "Andrés", services: "7", sales: "181 EUR", commission: "45 EUR" },
];

const comparison = [
  ["Reservas online", true, true],
  ["Caja diaria", false, true],
  ["Ventas por barbero", false, true],
  ["Huecos por barbero", false, true],
  ["QR", false, true],
  ["Pensado solo para barberías", false, true],
];

const founderBenefits = [
  "Acceso anticipado",
  "Demo personalizada",
  "Configuración inicial",
  "Precio fundador",
  "Prioridad en nuevas funciones",
];

function Shell({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`px-5 py-20 lg:px-8 ${className}`} {...props}>
      {children}
    </section>
  );
}

function DashboardMockup() {
  return (
    <ProductMockupCard dark className="relative mx-auto max-w-3xl rounded-[28px]">
      <div className="rounded-[22px] border border-white/10 bg-[#0B0E14] p-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-black uppercase text-[#D5A84C]">BarberíaOS</p>
            <p className="mt-1 text-xl font-black text-white">Panel de control</p>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            Caja cuadrada
          </span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {[
            ["Reservas", "24"],
            ["Ventas", "840 EUR"],
            ["Caja", "940 EUR"],
            ["Huecos", "6"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
              <p className="text-[10px] font-bold uppercase text-white/40">{label}</p>
              <p className="mt-2 text-xl font-black text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black text-white">Agenda por barbero</p>
              <CalendarClock size={16} className="text-[#D5A84C]" />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {barberColumns.map((barber) => (
                <div key={barber.name} className="rounded-xl border border-white/10 bg-white/[0.035] p-2">
                  <p className="text-xs font-black text-white">{barber.name}</p>
                  <div className="mt-2 space-y-1.5">
                    {barber.slots.slice(0, 3).map((slot) => (
                      <div
                        key={slot}
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold ${
                          slot.includes("Libre")
                            ? "bg-[#D5A84C]/15 text-[#D5A84C]"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-black text-white">Ventas por barbero</p>
            <div className="mt-4 space-y-3">
              {salesRows.map((row, index) => (
                <div key={row.barber}>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-white">{row.barber}</span>
                    <span className="font-black text-[#D5A84C]">{row.sales}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#D5A84C]" style={{ width: `${92 - index * 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProductMockupCard>
  );
}

function CashAssistantVisual() {
  const items = [
    ["Caja inicial", "100 EUR", Banknote],
    ["Efectivo", "420 EUR", WalletCards],
    ["Tarjeta", "310 EUR", CreditCard],
    ["Bizum", "110 EUR", Smartphone],
    ["Total del día", "840 EUR", CircleDollarSign],
    ["Diferencia de caja", "0 EUR", BadgeEuro],
  ];

  return (
    <ProductMockupCard dark title="Asistente de Caja" description="Hoy empezaste con 100 EUR. Has cobrado 840 EUR. Cierre estimado: 940 EUR.">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value, Icon]) => {
          const TypedIcon = Icon as typeof Banknote;
          return (
            <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <TypedIcon size={17} className="text-[#D5A84C]" />
              <p className="mt-3 text-xs font-bold uppercase text-white/40">{label as string}</p>
              <p className="mt-1 text-2xl font-black text-white">{value as string}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
        <div className="flex items-center gap-2 text-sm font-black text-emerald-300">
          <CheckCircle2 size={17} /> Estado: Caja cuadrada
        </div>
      </div>
    </ProductMockupCard>
  );
}

function QRVisual() {
  return (
    <ProductMockupCard className="mx-auto max-w-4xl">
      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="grid aspect-square grid-cols-7 gap-1.5 rounded-2xl bg-white p-4">
            {Array.from({ length: 49 }).map((_, index) => (
              <span
                key={index}
                className={`rounded-[4px] ${index % 3 === 0 || index % 8 === 0 || index < 7 ? "bg-[#080A0F]" : "bg-slate-200"}`}
              />
            ))}
          </div>
          <p className="mt-4 break-all text-center font-mono text-xs font-bold text-slate-500">
            barberiaos.com/r/black-crown
          </p>
        </div>
        <div className="mx-auto w-full max-w-[290px] rounded-[30px] border border-slate-200 bg-[#080A0F] p-3 shadow-[var(--shadow-card)]">
          <div className="rounded-[24px] bg-white p-4">
            <p className="text-xs font-black uppercase text-[#2563EB]">Reserva móvil</p>
            <h3 className="mt-2 text-2xl font-black text-[#080A0F]">Black Crown</h3>
            <div className="mt-4 space-y-2">
              {["Corte premium - 22 EUR", "Corte + barba - 32 EUR", "Barba - 14 EUR"].map((service) => (
                <div key={service} className="rounded-2xl border border-slate-200 p-3 text-sm font-bold text-slate-700">
                  {service}
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-2xl bg-[#2563EB] px-4 py-3 text-sm font-black text-white">
              Reservar
            </button>
          </div>
        </div>
      </div>
    </ProductMockupCard>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F7FAFC] text-[#080A0F]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#D5A84C]">
              <Scissors size={19} />
            </span>
            <span className="font-black">BarberíaOS</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-500 lg:flex">
            <a href="#caja">Caja</a>
            <a href="#huecos">Huecos</a>
            <a href="#qr">Reservas online</a>
            <a href="#fundadores">Fundadores</a>
          </nav>
          <div className="flex items-center gap-2">
            <PrimaryButton href="/login" variant="ghost" className="hidden sm:inline-flex">
              Entrar
            </PrimaryButton>
            <PrimaryButton href="/login" variant="dark">
              Probar gratis
            </PrimaryButton>
          </div>
        </div>
      </header>

      <Shell className="pb-14 pt-12 lg:pb-20 lg:pt-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/10 px-4 py-2 text-xs font-black uppercase text-[#2563EB]">
              <Sparkles size={14} /> SaaS vertical para barberías
            </div>
            <h1 className="mt-7 text-[clamp(3rem,7vw,5.8rem)] font-black leading-[0.95] tracking-normal">
              Reservas, caja y control de barberos en un solo panel.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              BarberíaOS ayuda a dueños de barberías a controlar reservas, cobros, barberos, servicios, clientes y ventas diarias desde un panel simple y profesional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/login" variant="primary" className="min-h-12 px-6">
                Probar BarberíaOS gratis <ArrowRight size={17} />
              </PrimaryButton>
              <PrimaryButton href="#caja" variant="secondary" className="min-h-12 px-6">
                Ver demo de caja y agenda
              </PrimaryButton>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
              {["Sin tarjeta", "Demo personalizada", "Mobile-first"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-600" /> {item}
                </span>
              ))}
            </div>
          </div>
          <DashboardMockup />
        </div>
      </Shell>

      <Shell>
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Problema"
            title="Tu barbería no necesita solo una agenda. Necesita control."
            description="Una agenda genérica te dice quién viene. BarberíaOS te dice qué está pasando con el negocio."
            align="center"
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {painCards.map((pain) => (
              <article key={pain} className="bento-card">
                <div className="metric-icon bg-red-50 text-red-600">
                  <X size={17} />
                </div>
                <p className="mt-5 text-lg font-black leading-snug">{pain}</p>
              </article>
            ))}
          </div>
        </div>
      </Shell>

      <Shell id="caja" className="bg-[#080A0F] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionHeader
            eyebrow="Asistente de Caja"
            title="Abre caja al empezar el día, registra cada cobro por barbero y cierra con control real."
            description="Caja inicial, efectivo, tarjeta, Bizum, total del día, diferencia de caja y estado de cierre en una sola vista."
            variant="dark"
          />
          <CashAssistantVisual />
        </div>
      </Shell>

      <Shell id="huecos">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Huecos disponibles"
            title="Cuando entra un cliente sin cita, sabes al instante qué barbero tiene hueco libre."
            align="center"
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {barberColumns.map((barber) => (
              <article key={barber.name} className="bento-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black">{barber.name}</p>
                    <p className="text-sm font-bold text-slate-500">{barber.open} huecos libres hoy</p>
                  </div>
                  <Clock className="text-[#2563EB]" />
                </div>
                <div className="mt-5 space-y-2">
                  {barber.slots.map((slot) => (
                    <div
                      key={slot}
                      className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                        slot.includes("Libre")
                          ? "border-[#D5A84C]/30 bg-[#D5A84C]/10 text-[#8A641F]"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }`}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Shell>

      <Shell className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <SectionHeader
            eyebrow="Ventas por barbero"
            title="Mide rendimiento, servicios y comisión estimada sin hojas sueltas."
            description="El dueño ve al instante quién está produciendo, qué servicios salen más y dónde reforzar la agenda."
          />
          <div className="table-shell overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Barbero</th>
                  <th>Servicios</th>
                  <th>Ventas</th>
                  <th>Comisión estimada</th>
                </tr>
              </thead>
              <tbody>
                {salesRows.map((row) => (
                  <tr key={row.barber}>
                    <td className="font-black text-[#080A0F]">{row.barber}</td>
                    <td>{row.services}</td>
                    <td className="font-black">{row.sales}</td>
                    <td>{row.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Shell>

      <Shell id="qr">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="QR y reservas online"
            title="Tus clientes reservan solos desde un QR, Instagram, WhatsApp o Google."
            description="Comparte tu enlace público, muestra servicios con precio y deja que el cliente reserve desde el móvil."
            align="center"
          />
          <div className="mt-12">
            <QRVisual />
          </div>
        </div>
      </Shell>

      <Shell className="bg-white">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow="Comparativa"
            title="Agenda genérica vs BarberíaOS"
            align="center"
          />
          <div className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[var(--shadow-soft)]">
            {comparison.map(([feature, generic, barberiaos]) => (
              <div key={feature as string} className="grid grid-cols-[1fr_110px_110px] items-center border-b border-slate-100 px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_160px_160px]">
                <p className="font-bold text-slate-700">{feature as string}</p>
                <div className="flex justify-center text-slate-400">
                  {generic ? <Check size={18} /> : <Minus size={18} />}
                </div>
                <div className="flex justify-center text-emerald-600">
                  {barberiaos ? <Check size={18} /> : <Minus size={18} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Shell>

      <Shell id="fundadores" className="bg-[#080A0F] text-white">
        <div className="mx-auto max-w-5xl text-center">
          <Crown className="mx-auto text-[#D5A84C]" size={34} />
          <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            Primeras barberías fundadoras con acceso especial.
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {founderBenefits.map((benefit) => (
              <div key={benefit} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm font-black">
                <CheckCircle2 size={18} className="mx-auto mb-3 text-[#D5A84C]" />
                {benefit}
              </div>
            ))}
          </div>
          <PrimaryButton href="/login" variant="gold" className="mt-10 min-h-12 px-7">
            Quiero probar BarberíaOS gratis <ArrowRight size={17} />
          </PrimaryButton>
        </div>
      </Shell>

      <Shell>
        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[var(--shadow-card)] md:p-12">
          <ReceiptText className="mx-auto text-[#2563EB]" size={34} />
          <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            Convierte tu barbería en un negocio controlado, medible y más rentable.
          </h2>
          <div className="mt-8">
            <PrimaryButton href="/login" variant="primary" className="min-h-12 px-7">
              Probar BarberíaOS gratis <ArrowRight size={17} />
            </PrimaryButton>
          </div>
        </div>
      </Shell>
    </main>
  );
}
