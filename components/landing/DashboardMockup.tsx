import {
  ArrowUp,
  Bot,
  CalendarCheck2,
  Gauge,
  PackageCheck,
  QrCode,
  Scissors,
  Star,
  WalletCards,
} from "lucide-react";
import { ProductMockupCard } from "@/components/ui/ProductMockupCard";

const appointments = [
  { time: "09:30", service: "Corte + barba", barber: "Dani", status: "Confirmada" },
  { time: "10:45", service: "Degradado", barber: "Leo", status: "En silla" },
  { time: "12:00", service: "Hueco libre", barber: "Marco", status: "Compartir" },
] as const;

const miniStats = [
  { label: "Reservas", value: "31", Icon: CalendarCheck2 },
  { label: "Productos", value: "186 €", Icon: PackageCheck },
  { label: "Ocupación", value: "87%", Icon: Gauge },
  { label: "Servicios", value: "24 €", Icon: WalletCards },
] as const;

export function DashboardMockup() {
  return (
    <ProductMockupCard dark className="premium-mockup relative mx-auto w-full max-w-4xl rounded-[30px] transition-transform duration-500 hover:-translate-y-1">
      <div className="rounded-[24px] border border-white/[0.08] bg-[#0b1019]/[0.92] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_1px_0_rgba(0,0,0,0.4)] md:p-5">

        {/* Browser-style chrome bar */}
        <div className="mb-4 flex items-center gap-1.5 pb-3 opacity-80">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/70" />
          <span className="ml-3 truncate text-[10px] font-bold text-white/25">
            app.barberiaos.com/panel
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D5A84C] to-[#C9922A] shadow-[0_8px_20px_rgba(213,168,76,0.28)]">
              <Scissors size={15} className="text-[#080A0F]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-[#D5A84C]/80">BarberíaOS</p>
              <h3 className="text-base font-black text-white md:text-lg">Panel del dueño</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.60)]" />
            <span className="rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/[0.10] px-2.5 py-0.5 text-[10px] font-black text-[#D5A84C]">
              Demo
            </span>
          </div>
        </div>

        {/* Featured revenue metric */}
        <div className="mt-4 rounded-2xl border border-[#D5A84C]/[0.18] bg-gradient-to-r from-[#D5A84C]/[0.07] via-[#D5A84C]/[0.03] to-transparent p-4 shadow-[inset_0_1px_0_rgba(213,168,76,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-[#D5A84C]/70">Ingresos estimados hoy</p>
              <p className="mt-1 text-3xl font-black text-white md:text-4xl">1.248 €</p>
              <p className="mt-1 text-[10px] text-white/38">Caja + productos · martes</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-400">
                <ArrowUp size={11} />
                +12%
              </div>
              <p className="mt-1.5 text-[10px] text-white/38">vs. semana pasada</p>
              <p className="mt-3 text-[10px] font-black uppercase text-[#D5A84C]/55">0% comisión</p>
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {miniStats.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 transition-colors duration-300 hover:border-[#D5A84C]/[0.20] hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-1">
                <p className="text-[9px] font-black uppercase text-white/[0.35]">{label}</p>
                <Icon size={11} className="shrink-0 text-white/40 transition-colors duration-300 group-hover:text-[#D5A84C]/80" />
              </div>
              <p className="mt-1.5 text-sm font-black text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Agenda */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#07111f]/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black text-white">Agenda conectada</p>
              <QrCode size={14} className="text-[#38BDF8]/80" />
            </div>
            <div className="space-y-1.5">
              {appointments.map(({ time, service, barber, status }) => (
                <div
                  key={`${time}-${service}`}
                  className="grid grid-cols-[48px_1fr_auto] items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 transition-colors duration-300 hover:border-white/[0.14] hover:bg-white/[0.06]"
                >
                  <p className="text-sm font-black text-[#38BDF8]">{time}</p>
                  <div>
                    <p className="text-xs font-black text-white">{service}</p>
                    <p className="text-[10px] text-white/40">{barber}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-black ${
                      status === "En silla"
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                        : status === "Compartir"
                        ? "border-[#D5A84C]/25 bg-[#D5A84C]/10 text-[#D5A84C]"
                        : "border-white/10 bg-white/[0.05] text-white/55"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Side metrics */}
          <div className="grid gap-3">
            {/* Barbero top */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#07111f]/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-white">Barbero top · hoy</p>
                <Star size={13} className="text-[#D5A84C]" />
              </div>
              <p className="mt-2 text-base font-black text-white">Dani · 12 citas</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.08]">
                <div className="h-1.5 w-[78%] rounded-full bg-gradient-to-r from-[#D5A84C] to-[#38BDF8] shadow-[0_0_8px_rgba(213,168,76,0.35)]" />
              </div>
              <p className="mt-1 text-[10px] text-white/38">78% ocupación · 3 barberos activos</p>
            </div>

            {/* IA */}
            <div className="rounded-2xl border border-[#D5A84C]/[0.18] bg-gradient-to-br from-[#D5A84C]/[0.06] to-[#2563EB]/[0.04] p-4 shadow-[inset_0_1px_0_rgba(213,168,76,0.08)]">
              <div className="flex items-center gap-2">
                <Bot size={13} className="text-[#D5A84C]" />
                <p className="text-xs font-black text-[#D5A84C]">IA del dueño</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/62">
                "Huecos 16–18h. Lanza oferta corte + barba y escríbele a 3 clientes de alta frecuencia."
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProductMockupCard>
  );
}
