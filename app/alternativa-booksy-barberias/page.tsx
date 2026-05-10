import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Minus,
  Scissors,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SITE_URL } from "@/src/lib/site-url";

export const metadata: Metadata = {
  title: "Alternativa a Booksy para Barberías | BarberíaOS",
  description:
    "BarberíaOS es la alternativa a Booksy sin comisión por reserva. Reservas, caja, clientes y página propia — tus datos son tuyos. Sin depender de ninguna plataforma.",
  alternates: { canonical: `${SITE_URL}/alternativa-booksy-barberias` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/alternativa-booksy-barberias`,
    title: "Alternativa a Booksy para Barberías | BarberíaOS",
    description:
      "Alternativa a Booksy sin comisión: reservas, caja, clientes y página propia. Tus datos son tuyos.",
    siteName: "BarberíaOS",
  },
};

const comparison = [
  { feature: "Reservas online 24h", booksy: true, barberiaos: true },
  { feature: "Comisión por reserva", booksy: true, barberiaos: false, invert: true },
  { feature: "Datos de clientes propios", booksy: false, barberiaos: true },
  { feature: "Página pública propia", booksy: false, barberiaos: true },
  { feature: "QR descargable", booksy: false, barberiaos: true },
  { feature: "Caja y ventas por barbero", booksy: false, barberiaos: true },
  { feature: "Auditoría web incluida", booksy: false, barberiaos: true },
  { feature: "Widget para tu web", booksy: false, barberiaos: true },
  { feature: "Directorio local opcional", booksy: true, barberiaos: true },
  { feature: "Sin permanencia", booksy: false, barberiaos: true },
  { feature: "Precio fijo mensual", booksy: false, barberiaos: true },
];

const whySwitch = [
  {
    title: "Tus clientes son tuyos",
    text: "En Booksy, la relación con el cliente es de la plataforma. Si te vas, pierdes el historial y el acceso. En BarberíaOS, construyes tu propia base de datos que te llevas siempre.",
  },
  {
    title: "Sin comisión por cita",
    text: "Booksy cobra por cada reserva o tiene cuotas vinculadas al volumen. BarberíaOS es precio fijo mensual — cuantas más reservas tengas, más rentable te sale.",
  },
  {
    title: "Tu página, tu marca",
    text: "En Booksy tu perfil está dentro de la plataforma de ellos. En BarberíaOS tienes /r/tu-barberia, tu enlace propio que puedes compartir donde quieras sin depender de nadie.",
  },
  {
    title: "Caja y gestión completa",
    text: "Booksy es solo agenda. BarberíaOS añade caja diaria, ventas por barbero, clientes frecuentes, auditoría web y widget — todo en un panel pensado para barberías.",
  },
];

function Mark({ value, invert = false }: { value: boolean; invert?: boolean }) {
  const positive = invert ? !value : value;
  if (positive) {
    return <div className="flex justify-center text-emerald-600"><Check size={18} strokeWidth={2.5} /></div>;
  }
  return <div className="flex justify-center text-slate-300"><Minus size={18} /></div>;
}

const faqs = [
  {
    q: "¿Por qué BarberíaOS es mejor que Booksy para mi barbería?",
    a: "BarberíaOS no cobra comisión por reserva, tus datos de clientes son siempre tuyos, tienes tu propia página /r/tu-barberia y además incluye caja, gestión de barberos y QR — todo en uno y a precio fijo.",
  },
  {
    q: "¿Puedo migrar mis clientes de Booksy a BarberíaOS?",
    a: "Sí. Puedes importar tu base de datos de clientes y empezar a trabajar con BarberíaOS sin perder el historial.",
  },
  {
    q: "¿Tengo que dejar Booksy para probar BarberíaOS?",
    a: "No. Puedes usar ambos en paralelo durante la transición. BarberíaOS no requiere que abandones Booksy de golpe.",
  },
  {
    q: "¿Cuánto me ahorro con BarberíaOS frente a Booksy?",
    a: "Booksy cobra comisiones por reserva o cuotas variables según el volumen. BarberíaOS es precio fijo mensual — cuantas más citas tengas, más rentable te sale el cambio.",
  },
];

export default function AlternativaBooksyPage() {
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
            Alternativa a Booksy
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
            La alternativa a Booksy donde tus clientes y tus datos son tuyos.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
            BarberíaOS ofrece reservas online, caja, clientes y página pública propia —
            sin comisión por reserva y sin depender de ninguna plataforma.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/login" variant="gold" className="min-h-12 px-7">
              Pasarme a BarberíaOS <ArrowRight size={17} />
            </PrimaryButton>
          </div>
          <p className="mt-5 text-xs text-white/35">Sin tarjeta · Sin permanencia · Setup en 48h</p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black text-[#080A0F] md:text-4xl">
            BarberíaOS vs Booksy
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500">
            Comparativa directa de las funciones que más importan a una barbería
          </p>
          <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1.8fr_1fr_1fr] border-b border-slate-100 bg-slate-50 px-5 py-3 text-center text-xs font-black uppercase text-slate-400">
              <span className="text-left">Función</span>
              <span>Booksy</span>
              <span className="text-[#C9922A]">BarberíaOS</span>
            </div>
            {comparison.map(({ feature, booksy, barberiaos, invert }, i) => (
              <div
                key={feature}
                className={`grid grid-cols-[1.8fr_1fr_1fr] items-center px-5 py-3 ${
                  i < comparison.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <span className="text-sm font-bold text-slate-700">{feature}</span>
                <Mark value={booksy} invert={invert} />
                <Mark value={barberiaos} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            Comparativa orientativa basada en información pública disponible. Puede variar según el plan de Booksy.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-black text-[#080A0F] md:text-3xl">
            ¿Por qué las barberías se pasan a BarberíaOS?
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {whySwitch.map((item) => (
              <article
                key={item.title}
                className="rounded-[24px] border border-slate-200 bg-[#F6F8FB] p-6"
              >
                <CheckCircle2 size={20} className="text-[#C9922A]" />
                <h3 className="mt-4 text-lg font-black text-[#080A0F]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black text-[#080A0F] md:text-3xl">
            Preguntas frecuentes sobre la alternativa a Booksy
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
            Empieza con BarberíaOS gratis.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/65">
            Puedes mantener Booksy durante la transición. BarberíaOS no requiere que abandones nada de golpe.
          </p>
          <PrimaryButton href="/login" variant="gold" className="mt-8 min-h-12 px-8">
            Probar BarberíaOS gratis <ArrowRight size={17} />
          </PrimaryButton>
          <p className="mt-4 text-xs text-white/35">Sin tarjeta · Sin permanencia · Configuración en 48h</p>
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
        <p className="mt-2">© {new Date().getFullYear()} BarberíaOS — Alternativa a Booksy para barberías.</p>
      </footer>
    </main>
  );
}
