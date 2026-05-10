import Link from "next/link";
import { ArrowRight, CalendarCheck, QrCode, Scissors, Users } from "lucide-react";

const welcomeCards = [
  {
    title: "Configura tus servicios",
    text: "Cortes, barba, combos, precios y duración.",
    href: "/dashboard/servicios",
    icon: Scissors,
  },
  {
    title: "Añade tus barberos",
    text: "Crea tu equipo para ordenar la agenda.",
    href: "/dashboard/barberos",
    icon: Users,
  },
  {
    title: "Genera tu QR",
    text: "Compártelo en mostrador, Instagram y WhatsApp.",
    href: "/dashboard/qr",
    icon: QrCode,
  },
  {
    title: "Prueba una reserva",
    text: "Comprueba cómo lo verá un cliente.",
    href: "/dashboard/agenda",
    icon: CalendarCheck,
  },
];

export function WelcomePanel() {
  return (
    <section className="section-band overflow-hidden">
      <div className="grid gap-6 p-5 md:p-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5A84C]/25 bg-[#D5A84C]/10 px-3 py-1 text-xs font-black text-[#8A641F]">
            Primeros pasos
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#080A0F]">
            Bienvenido a BarberíaOS
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Vamos a dejar tu barbería lista para recibir reservas online. Empieza por lo básico: servicios, barberos, QR y una reserva de prueba.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/servicios" className="btn-gold">
              Empezar configuración <ArrowRight size={14} />
            </Link>
            <Link href="/demo" className="btn-outline">
              Explorar demo
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {welcomeCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 hover:bg-white"
              >
                <Icon size={18} className="text-[#C9922A]" />
                <p className="mt-3 text-sm font-black text-[#080A0F]">{card.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{card.text}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
