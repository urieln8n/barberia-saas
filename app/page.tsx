import Link from "next/link";
import {
  ArrowRight,
  BadgeEuro,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Crown,
  Gauge,
  LockKeyhole,
  MessageCircle,
  QrCode,
  ReceiptText,
  Scissors,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";

const heroBullets = [
  "Mira cuánto vende cada barbero",
  "Detecta huecos libres al instante",
  "Controla pagos y caja diaria",
  "Reservas online con QR",
  "Todo desde un único panel",
];

const painCards = [
  {
    icon: BarChart3,
    title: "No sabes cuánto factura cada barbero",
    text: "Si todo termina en efectivo, WhatsApp y memoria, no tienes control real del rendimiento.",
  },
  {
    icon: Timer,
    title: "Pierdes citas por huecos vacíos",
    text: "Un barbero parado media tarde es dinero que se escapa sin hacer ruido.",
  },
  {
    icon: WalletCards,
    title: "No tienes control real de caja",
    text: "Cobros sueltos, métodos mezclados y cierre diario sin una lectura clara.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp te vuelve loco",
    text: "Reservas, cambios, dudas y clientes perdidos en conversaciones infinitas.",
  },
  {
    icon: Crown,
    title: "Booksy cobra mientras tú pierdes control",
    text: "Tu barbería necesita sistema propio, datos propios y una operación más seria.",
  },
];

const cashRows = [
  ["10:00", "Corte + barba", "Kevin", "Efectivo", "28 €"],
  ["11:30", "Degradado", "Miguel", "Tarjeta", "18 €"],
  ["12:15", "Barba premium", "Kevin", "Bizum", "14 €"],
];

const availabilityRows = [
  { name: "Carlos", state: "Lleno", slots: ["10:00", "11:30", "16:00"], tone: "bg-emerald-400" },
  { name: "Miguel", state: "2 huecos libres", slots: ["13:00", "15:30"], tone: "bg-amber-300" },
  { name: "Andrés", state: "Disponible 17:00", slots: ["17:00", "18:30"], tone: "bg-blue-300" },
];

const barberSales = [
  { name: "Kevin", sales: "214 €", tickets: "7 tickets", progress: "w-[92%]" },
  { name: "Miguel", sales: "146 €", tickets: "5 tickets", progress: "w-[68%]" },
  { name: "Andrés", sales: "92 €", tickets: "3 tickets", progress: "w-[42%]" },
];

const founderBenefits = [
  "Acceso anticipado",
  "Soporte prioritario",
  "Precio fundador futuro",
  "Acceso a nuevas funciones",
];

const footerTrust = [
  "Pensado solo para barberías",
  "Sin tarjeta",
  "Configuración rápida",
  "Acceso desde móvil",
];

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D9B766]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-black leading-tight tracking-normal text-white md:text-5xl">
        {title}
      </h2>
      {text && (
        <p className="mt-5 text-base leading-8 text-white/60 md:text-lg">
          {text}
        </p>
      )}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[24px] border border-white/10 bg-white/[0.055] shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function MetricPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function DashboardMockup() {
  return (
    <GlassCard className="relative overflow-hidden p-4 landing-fade landing-delay-2">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#D9B766] to-transparent" />
      <div className="rounded-[20px] border border-white/10 bg-[#090B10] p-4">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9B766] text-[#080A0F]">
              <Scissors size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-white">BarberíaOS</p>
              <p className="text-xs text-white/40">Control diario</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
            Caja abierta
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <MetricPill label="Ventas hoy" value="452 €" />
          <MetricPill label="Reservas" value="18" />
          <MetricPill label="Huecos" value="7" />
          <MetricPill label="Top" value="Kevin" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-white">Agenda de hoy</p>
              <CalendarClock size={16} className="text-[#D9B766]" />
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["10:00", "Corte + barba", "Kevin", "Confirmada"],
                ["11:30", "Degradado", "Miguel", "En local"],
                ["13:00", "Barba premium", "Andrés", "Pendiente"],
              ].map(([time, service, barber, status]) => (
                <div
                  key={`${time}-${barber}`}
                  className="grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
                >
                  <span className="font-mono text-sm font-black text-[#D9B766]">
                    {time}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{service}</p>
                    <p className="text-xs text-white/40">{barber}</p>
                  </div>
                  <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/60 sm:inline-flex">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-white">Ventas por barbero</p>
              <TrendingUp size={16} className="text-emerald-300" />
            </div>
            <div className="mt-4 space-y-4">
              {barberSales.map((barber) => (
                <div key={barber.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-white">{barber.name}</span>
                    <span className="text-sm font-black text-[#D9B766]">{barber.sales}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full bg-[#D9B766] ${barber.progress}`} />
                  </div>
                  <p className="mt-1 text-xs text-white/40">{barber.tickets}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function CashAssistantMockup() {
  return (
    <GlassCard className="overflow-hidden p-5">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricPill label="Caja inicial" value="100 €" />
        <MetricPill label="Ventas del día" value="452 €" />
        <MetricPill label="Efectivo esperado" value="238 €" />
      </div>
      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <div className="grid grid-cols-5 bg-white/[0.06] px-4 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-white/40">
          <span>Hora</span>
          <span>Servicio</span>
          <span>Barbero</span>
          <span>Método</span>
          <span className="text-right">Total</span>
        </div>
        {cashRows.map(([time, service, barber, method, total]) => (
          <div
            key={`${time}-${barber}`}
            className="grid grid-cols-5 border-t border-white/10 px-4 py-3 text-sm text-white/70"
          >
            <span className="font-mono text-[#D9B766]">{time}</span>
            <span>{service}</span>
            <span>{barber}</span>
            <span>{method}</span>
            <span className="text-right font-black text-white">{total}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-emerald-400/10 p-4">
          <p className="text-xs font-bold text-emerald-300">Total efectivo</p>
          <p className="mt-1 text-2xl font-black text-white">138 €</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-blue-400/10 p-4">
          <p className="text-xs font-bold text-blue-300">Total tarjeta</p>
          <p className="mt-1 text-2xl font-black text-white">214 €</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#D9B766]/10 p-4">
          <p className="text-xs font-bold text-[#D9B766]">Total por Kevin</p>
          <p className="mt-1 text-2xl font-black text-white">214 €</p>
        </div>
      </div>
    </GlassCard>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07080C] text-white">
      <style>{`
        @keyframes landingFade {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .landing-fade { animation: landingFade .75s ease-out both; }
        .landing-delay-1 { animation-delay: .08s; }
        .landing-delay-2 { animation-delay: .16s; }
        .landing-delay-3 { animation-delay: .24s; }
      `}</style>

      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute left-[-10%] top-[-12%] h-[420px] w-[420px] rounded-full bg-[#D9B766]/20 blur-[120px]" />
        <div className="absolute right-[-12%] top-[8%] h-[500px] w-[500px] rounded-full bg-[#2563EB]/20 blur-[140px]" />
        <div className="absolute bottom-[4%] left-[20%] h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#07080C]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D9B766]/30 bg-[#D9B766] text-[#080A0F] shadow-[0_0_36px_rgba(217,183,102,0.28)]">
              <Scissors size={20} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
                BarberíaOS
              </p>
              <p className="text-xs font-semibold text-white/45">
                Sistema operativo para barberías
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold text-white/55 lg:flex">
            <a href="#caja" className="transition hover:text-white">Caja</a>
            <a href="#barberos" className="transition hover:text-white">Barberos</a>
            <a href="#reservas" className="transition hover:text-white">Reservas</a>
            <a href="#fundadores" className="transition hover:text-white">Fundadores</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-bold text-white/60 transition hover:text-white sm:inline-flex">
              Entrar
            </Link>
            <a href="#registro" className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#07080C] transition hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(255,255,255,0.18)]">
              Probar gratis
            </a>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-20">
          <div className="landing-fade landing-delay-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9B766]/20 bg-[#D9B766]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#D9B766]">
              <Sparkles size={14} />
              Reservas, caja y control de barberos en un solo panel
            </div>

            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.92] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Deja de perder dinero por culpa de una agenda desordenada.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/64 sm:text-xl">
              Reservas, caja, control de barberos y clientes en un solo sistema pensado SOLO para barberías.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/48">
              Mira quién reservó, quién cobró, qué servicio se hizo y cuánto genera cada barbero.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {heroBullets.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-white/78 backdrop-blur">
                  <CheckCircle2 size={17} className="shrink-0 text-[#D9B766]" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#registro" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#D9B766] px-7 py-4 text-sm font-black text-[#07080C] shadow-[0_0_48px_rgba(217,183,102,0.28)] transition hover:-translate-y-0.5 hover:bg-[#F1CD77]">
                Probar BarberíaOS gratis
                <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
              </a>
              <a href="#demo-producto" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.055] px-7 py-4 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white/24 hover:bg-white/[0.085]">
                Ver demo de caja y agenda
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-white/45">
              <span>Sin tarjeta.</span>
              <span>Sin compromiso.</span>
              <span>Solo para barberías.</span>
            </div>
          </div>

          <DashboardMockup />
        </div>
      </section>

      <section className="relative z-10 border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {footerTrust.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-black text-white/65">
              <ShieldCheck size={17} className="text-[#D9B766]" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="El problema real"
            title="Tu barbería no necesita otra agenda. Necesita control."
            text="Si no sabes dónde se escapa el dinero, cada día lleno puede seguir siendo un caos."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {painCards.map(({ icon: Icon, title, text }) => (
              <GlassCard key={title} className="group p-5 transition duration-300 hover:-translate-y-2 hover:border-[#D9B766]/30 hover:bg-white/[0.075]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#D9B766] transition group-hover:scale-105">
                  <Icon size={19} />
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{text}</p>
              </GlassCard>
            ))}
          </div>

          <p className="mt-10 text-center text-2xl font-black text-white">
            BarberíaOS nació para solucionar eso.
          </p>
        </div>
      </section>

      <section id="caja" className="relative z-10 border-y border-white/10 bg-white/[0.025] px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D9B766]">
              Asistente de caja
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
              Abre caja, controla cobros y cierra el día sin perder dinero.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/60">
              Controla importe inicial, servicios cobrados, quién cobró, métodos de pago y cierre diario desde el mismo panel.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Apertura de caja", "Importe inicial", "Métodos de pago", "Cierre diario"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-white/72">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <CashAssistantMockup />
        </div>
      </section>

      <section id="demo-producto" className="relative z-10 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Huecos disponibles"
            title="Llena mejor la agenda sin adivinar quién está libre."
            text="Si un barbero está lleno, BarberíaOS te muestra quién tiene huecos disponibles para vender mejor el día."
          />

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {availabilityRows.map((row) => (
              <GlassCard key={row.name} className="p-5 transition hover:-translate-y-2 hover:border-white/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${row.tone}`} />
                    <div>
                      <p className="text-xl font-black text-white">{row.name}</p>
                      <p className="text-sm font-bold text-white/45">{row.state}</p>
                    </div>
                  </div>
                  <CalendarClock size={20} className="text-[#D9B766]" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {row.slots.map((slot) => (
                    <span key={slot} className="rounded-full border border-[#D9B766]/25 bg-[#D9B766]/10 px-3 py-1.5 text-sm font-black text-[#D9B766]">
                      {slot}
                    </span>
                  ))}
                </div>
                <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/60">
                  Hoy tenemos huecos disponibles con {row.name} a las {row.slots.slice(0, 2).join(", ")}. Reserva tu corte ahora.
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section id="barberos" className="relative z-10 border-y border-white/10 bg-white/[0.025] px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D9B766]">
              Ventas por barbero
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
              Mira quién produce más, qué servicios generan más dinero y cómo crece tu barbería.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/60">
              Ranking diario de barberos, tickets realizados, ventas y servicios top. Para dirigir el negocio con datos, no con intuición.
            </p>
          </div>

          <GlassCard className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-white">Ranking de hoy</p>
                <p className="text-xs text-white/40">Ventas, tickets y servicios</p>
              </div>
              <BarChart3 size={21} className="text-[#D9B766]" />
            </div>
            <div className="space-y-4">
              {barberSales.map((barber, index) => (
                <div key={barber.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9B766] text-sm font-black text-[#07080C]">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-black text-white">{barber.name}</p>
                        <p className="text-xs text-white/40">{barber.tickets}</p>
                      </div>
                    </div>
                    <p className="text-xl font-black text-[#D9B766]">{barber.sales}</p>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full bg-[#D9B766] ${barber.progress}`} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      <section id="reservas" className="relative z-10 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D9B766]">
              QR y reservas online
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
              Tus clientes reservan solos desde Instagram, Google o WhatsApp.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/60">
              Comparte un link, imprime el QR o ponlo en la bio. El cliente elige servicio, barbero y hora sin perseguirte por chat.
            </p>
          </div>

          <GlassCard className="grid gap-5 p-5 md:grid-cols-[0.75fr_1fr] md:items-center">
            <div className="rounded-[24px] border border-white/10 bg-white p-6 text-[#07080C]">
              <div className="grid aspect-square grid-cols-5 gap-2">
                {Array.from({ length: 25 }).map((_, index) => (
                  <span
                    key={index}
                    className={`rounded-md ${index % 3 === 0 || index % 7 === 0 ? "bg-[#07080C]" : "bg-[#D9B766]/25"}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-center text-sm font-black">barberiaos.com/r/tu-barberia</p>
            </div>
            <div>
              <div className="rounded-[28px] border border-white/10 bg-[#090B10] p-4">
                <div className="rounded-2xl bg-white p-4 text-[#07080C]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">
                    Reserva móvil
                  </p>
                  <p className="mt-2 text-2xl font-black">Corte + barba</p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {["13:00", "15:30", "17:00"].map((slot) => (
                      <span key={slot} className="rounded-xl bg-[#07080C] px-3 py-2 text-center text-sm font-black text-white">
                        {slot}
                      </span>
                    ))}
                  </div>
                  <button className="mt-4 w-full rounded-xl bg-[#D9B766] px-4 py-3 text-sm font-black text-[#07080C]">
                    Confirmar reserva
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section id="fundadores" className="relative z-10 border-y border-[#D9B766]/20 bg-[#D9B766]/10 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D9B766]/30 bg-[#D9B766]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#D9B766]">
            <Crown size={15} />
            Oferta fundadores
          </div>
          <h2 className="mt-5 text-5xl font-black leading-tight text-white md:text-6xl">
            Primeras 50 barberías gratis
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/65">
            Queremos ayudar a las barberías a crecer antes de subir precios.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {founderBenefits.map((benefit) => (
              <GlassCard key={benefit} className="p-5">
                <CheckCircle2 size={20} className="mx-auto text-[#D9B766]" />
                <p className="mt-3 text-sm font-black text-white">{benefit}</p>
              </GlassCard>
            ))}
          </div>

          <a href="#registro" className="mt-10 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#D9B766] px-8 py-4 text-sm font-black text-[#07080C] shadow-[0_0_58px_rgba(217,183,102,0.3)] transition hover:-translate-y-0.5 hover:bg-[#F1CD77]">
            Entrar como barbería fundadora <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section id="registro" className="relative z-10 px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#D9B766]">
              Registro
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">
              Entra antes de que BarberíaOS sea de pago.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/60">
              Déjanos tus datos y te damos acceso al panel para probar reservas, caja y control de barberos.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                ["Sin tarjeta", LockKeyhole],
                ["Configuración rápida", Zap],
                ["Acceso desde móvil", Smartphone],
              ].map(([label, Icon]) => {
                const TypedIcon = Icon as typeof LockKeyhole;
                return (
                  <div key={label as string} className="flex items-center gap-3 text-sm font-bold text-white/65">
                    <TypedIcon size={17} className="text-[#D9B766]" />
                    {label as string}
                  </div>
                );
              })}
            </div>
          </div>

          <GlassCard className="p-5 md:p-7">
            <form className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-white/70">
                  Nombre barbería
                </label>
                <input
                  name="barbershop_name"
                  placeholder="Ej: Black Crown Barbers"
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm font-bold text-white outline-none transition placeholder:text-white/25 focus:border-[#D9B766]/60 focus:ring-4 focus:ring-[#D9B766]/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-white/70">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm font-bold text-white outline-none transition placeholder:text-white/25 focus:border-[#D9B766]/60 focus:ring-4 focus:ring-[#D9B766]/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-white/70">
                  WhatsApp
                </label>
                <input
                  name="whatsapp"
                  placeholder="+34 600 000 000"
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm font-bold text-white outline-none transition placeholder:text-white/25 focus:border-[#D9B766]/60 focus:ring-4 focus:ring-[#D9B766]/10"
                />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#D9B766] px-7 py-4 text-sm font-black text-[#07080C] shadow-[0_0_48px_rgba(217,183,102,0.22)] transition hover:-translate-y-0.5 hover:bg-[#F1CD77]"
              >
                Quiero probar BarberíaOS <ArrowRight size={18} />
              </button>
              <p className="text-center text-xs font-semibold text-white/38">
                Sin tarjeta. Sin compromiso. Acceso limitado para barberías seleccionadas.
              </p>
            </form>
          </GlassCard>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D9B766] text-[#07080C]">
              <Scissors size={18} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                BarberíaOS
              </p>
              <p className="text-xs text-white/40">
                Reservas, caja y control de barberos.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.12em] text-white/38">
            {footerTrust.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
