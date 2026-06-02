import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  QrCode,
  Scissors,
  Smartphone,
  Stamp,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: "Tarjeta de puntos digital para barberías | BarberíaOS",
  description:
    "Tarjeta de sellos digital para barberías sin app. Tus clientes acumulan puntos por cada visita y los ven desde su móvil con un QR o link. BarberíaOS gestiona todo desde el panel.",
  keywords: [
    "tarjeta puntos digital barbería",
    "tarjeta sellos barbería",
    "fidelización clientes barbería",
    "programa puntos barbería",
    "tarjeta fidelidad barbería digital",
    "sellos digitales barbería",
  ],
  alternates: {
    canonical: `${BUSINESS_CONFIG.siteUrl}/tarjeta-puntos-digital-barberia`,
  },
  openGraph: {
    title: "Tarjeta de puntos digital para barberías | BarberíaOS",
    description:
      "Sellos automáticos, recompensas y progreso visible desde el móvil sin descargar ninguna app. Sistema de fidelización para barberías integrado con agenda y caja.",
    url: `${BUSINESS_CONFIG.siteUrl}/tarjeta-puntos-digital-barberia`,
    siteName: BUSINESS_CONFIG.commercialName,
    type: "website",
    locale: "es_ES",
  },
};

const features = [
  {
    icon: Stamp,
    title: "Sellos automáticos",
    text: "Cada cita completada suma un sello sin que el barbero tenga que hacer nada. El sistema lo registra solo al cerrar la cita.",
    color: "gold",
  },
  {
    icon: Gift,
    title: "Recompensas configurables",
    text: "Tú decides cuántos sellos equivalen a un corte gratis, un descuento o un servicio especial. Lo cambias cuando quieras.",
    color: "blue",
  },
  {
    icon: QrCode,
    title: "QR o link directo",
    text: "El cliente ve su tarjeta y sus puntos desde un link o escaneando el QR. Sin app, sin descarga, sin fricción.",
    color: "green",
  },
  {
    icon: Smartphone,
    title: "Progreso en la ficha",
    text: "El barbero ve cuántos sellos lleva el cliente antes de cada cita. Sabe si está cerca de una recompensa y puede mencionarlo.",
    color: "amber",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "El cliente reserva y viene",
    text: "La cita se crea en la agenda de BarberíaOS como siempre.",
  },
  {
    step: "02",
    title: "La cita se completa",
    text: "Al marcar la cita como completada, el sistema suma automáticamente un sello al cliente.",
  },
  {
    step: "03",
    title: "El cliente ve su progreso",
    text: "Recibe un link o escanea el QR del mostrador y ve su tarjeta actualizada al momento.",
  },
  {
    step: "04",
    title: "Llega a la recompensa",
    text: "Cuando alcanza el número de sellos configurado, la recompensa se activa y el barbero lo ve en la ficha.",
  },
];

const benefits = [
  "Sin app que instalar para el cliente",
  "Sellos automáticos al completar cita",
  "Recompensas personalizadas por barbería",
  "QR del mostrador para ver el progreso",
  "Progreso visible en la ficha del cliente",
  "Conexión directa con la caja",
  "Sin coste adicional por fidelización",
  "Historial completo de canjes",
];

const faqs = [
  {
    q: "¿El cliente tiene que descargar una app para ver sus puntos?",
    a: "No. El cliente accede a su tarjeta de puntos desde un link o escaneando el QR del mostrador con la cámara del móvil. No hay descarga, no hay registro adicional.",
  },
  {
    q: "¿Cómo se suman los sellos?",
    a: "Los sellos se suman automáticamente cuando el barbero marca la cita como completada en la agenda. No requiere ninguna acción extra.",
  },
  {
    q: "¿Puedo elegir cuántos sellos son necesarios para una recompensa?",
    a: "Sí. Desde el panel de BarberíaOS configuras el número de visitas necesarias y el tipo de recompensa: corte gratis, descuento en porcentaje o servicio a elegir.",
  },
  {
    q: "¿Funciona con varios barberos?",
    a: "Sí. El sello se suma independientemente de qué barbero haya atendido la cita. El historial registra quién la realizó para que el seguimiento sea completo.",
  },
  {
    q: "¿La tarjeta de puntos está conectada con la caja?",
    a: "Sí. Cuando se canjea una recompensa queda registrada en la caja con el valor correspondiente para que el cierre diario sea exacto.",
  },
  {
    q: "¿Tiene coste adicional la fidelización?",
    a: "No. La tarjeta de puntos digital forma parte del plan de BarberíaOS sin coste adicional. Es parte del sistema, no un complemento de pago.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

function StampCard() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="rounded-[28px] border border-[#D4AF66]/30 bg-gradient-to-br from-[#0F1A2E] via-[#0B1220] to-[#050A14] p-6 shadow-[0_24px_80px_rgba(212,175,102,0.18)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#D4AF66]">
              Tarjeta de fidelización
            </p>
            <p className="mt-0.5 text-base font-black text-white">Carlos Mendoza</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D4AF66]/15">
            <Scissors size={18} className="text-[#D4AF66]" />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-xl border text-[10px] ${
                i < 7
                  ? "border-[#D4AF66]/60 bg-[#D4AF66]/20 text-[#D4AF66]"
                  : "border-white/10 bg-white/5 text-white/20"
              }`}
            >
              {i < 7 ? <Star size={12} fill="currentColor" /> : <Star size={12} />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-[11px] text-white/50">Próxima recompensa</p>
            <p className="text-sm font-black text-white">3 visitas para corte gratis</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/50">Progreso</p>
            <p className="text-lg font-black tabular-nums text-[#D4AF66]">7/10</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <QrCode size={14} className="text-white/40" />
          <p className="text-[11px] text-white/40">barberiaos.com/fidelidad/carlos</p>
        </div>
      </div>

      <div className="absolute -right-3 -top-3 rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1.5">
        <p className="text-xs font-black text-[#10B981]">+1 sello automático</p>
      </div>
    </div>
  );
}

const accentColor: Record<string, string> = {
  gold: "text-[#D4AF66] bg-[#D4AF66]/10 border-[#D4AF66]/20",
  blue: "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20",
  green: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20",
  amber: "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/20",
};

export default function TarjetaPuntosDigitalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#FAFBFF] text-[#080A0F]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <Link href="/" className="flex items-center gap-3" aria-label="Volver a BarberíaOS">
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

        {/* Hero */}
        <section className="bg-[#050A14] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#D4AF66]">
                  Fidelización digital para barberías
                </p>
                <h1 className="mt-4 text-4xl font-black leading-[1.1] md:text-5xl">
                  Tarjeta de puntos digital.
                  <br />
                  <span className="text-[#D4AF66]">Sin app. Sin fricción.</span>
                </h1>
                <p className="mt-6 max-w-lg text-base leading-8 text-white/65">
                  Sellos automáticos al completar cita, recompensas personalizadas y progreso visible
                  desde el móvil con un link o QR. El cliente vuelve solo.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <PrimaryButton href="/pedir-demo" variant="gold" className="min-h-12 px-7">
                    Pedir demo <ArrowRight size={17} />
                  </PrimaryButton>
                  <PrimaryButton href="/programa-fidelizacion-barberias" variant="secondary" className="min-h-12 px-7">
                    Ver programa completo
                  </PrimaryButton>
                </div>
                <p className="mt-5 text-xs text-white/35">
                  Sin tarjeta · Sin permanencia · Setup en 48h
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <StampCard />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#C9922A]">
                Cómo funciona
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#080A0F] md:text-4xl">
                Sistema automático de sellos y recompensas
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
                Sin botones que pulsar, sin hojas de papel y sin apps que instalar. El sello se suma
                solo cuando la cita termina.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => {
                const Icon = f.icon;
                const classes = accentColor[f.color];
                return (
                  <article
                    key={f.title}
                    className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(5,10,20,0.04),0_18px_50px_rgba(15,23,42,0.07)]"
                  >
                    <div className={`mb-4 inline-flex rounded-2xl border p-2.5 ${classes}`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-black text-[#080A0F]">{f.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{f.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works timeline */}
        <section className="bg-[#050A14] px-5 py-20 text-white lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#D4AF66]">
                Paso a paso
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                De la cita al sello en cero pasos
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step) => (
                <div
                  key={step.step}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-3xl font-black tabular-nums text-[#D4AF66]/40">{step.step}</p>
                  <h3 className="mt-3 text-base font-black text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/55">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits list */}
        <section className="px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#C9922A]">
                  Por qué BarberíaOS
                </p>
                <h2 className="mt-3 text-3xl font-black text-[#080A0F] md:text-4xl">
                  Fidelización sin complicaciones
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  La mayoría de sistemas de puntos obligan al cliente a descargar una app o al barbero a
                  pulsar botones extra. En BarberíaOS el sello es una consecuencia automática de completar
                  la cita.
                </p>
                <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                  {benefits.map((b) => (
                    <div key={b} className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#C9922A]"
                      />
                      <span className="text-sm font-bold text-slate-700">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_1px_2px_rgba(5,10,20,0.04),0_24px_70px_rgba(15,23,42,0.10)]">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D4AF66]/10">
                    <TrendingUp size={18} className="text-[#D4AF66]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#080A0F]">Impacto en repetición</p>
                    <p className="text-xs text-slate-400">Barberías con programa activo</p>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Clientes que vuelven en 30 días", value: "+34%", icon: Zap },
                    { label: "Ticket medio con recompensa activa", value: "+12%", icon: TrendingUp },
                    { label: "Coste de adquisición vs nuevo cliente", value: "−80%", icon: Gift },
                  ].map((stat) => {
                    const I = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <I size={15} className="text-[#C9922A]" />
                          <span className="text-sm text-slate-600">{stat.label}</span>
                        </div>
                        <span className="text-base font-black tabular-nums text-[#080A0F]">
                          {stat.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-[11px] text-slate-400">
                  Datos orientativos basados en métricas de fidelización en comercio local.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-50 px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-black text-[#080A0F] md:text-4xl">
              Preguntas frecuentes
            </h2>
            <div className="divide-y divide-slate-200 rounded-[28px] border border-slate-200 bg-white overflow-hidden">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-6">
                  <p className="font-black text-[#080A0F]">{faq.q}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-[32px] border border-[#D4AF66]/25 bg-[#050A14] p-8 text-center text-white md:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#D4AF66]">
              Empieza hoy
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Activa la tarjeta de puntos digital.
              <br />
              <span className="text-[#D4AF66]">Que el cliente vuelva solo.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/60">
              Sin app, sin papel y sin complicaciones. Tu barbería fideliza desde el primer día.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <PrimaryButton href="/pedir-demo" variant="gold" className="min-h-12 px-8">
                Pedir demo gratis <ArrowRight size={17} />
              </PrimaryButton>
            </div>
            <p className="mt-4 text-xs text-white/35">
              Sin tarjeta · Sin permanencia · Setup en 48h
            </p>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white px-5 py-8 text-center text-xs text-slate-400 lg:px-8">
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/" className="font-bold text-slate-600 hover:text-[#080A0F]">
              ← BarberíaOS
            </Link>
            <Link
              href="/programa-fidelizacion-barberias"
              className="font-bold text-slate-600 hover:text-[#080A0F]"
            >
              Programa de fidelización
            </Link>
            <Link href="/software-para-barberias" className="font-bold text-slate-600 hover:text-[#080A0F]">
              Software para barberías
            </Link>
          </div>
          <p className="mt-2">
            © {new Date().getFullYear()} BarberíaOS — Tarjeta de puntos digital para barberías.
          </p>
        </footer>
      </main>
    </>
  );
}
