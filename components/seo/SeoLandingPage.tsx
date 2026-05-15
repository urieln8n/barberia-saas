import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Scissors } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";

type SeoLandingPageProps = {
  eyebrow: string;
  h1: string;
  intro: string;
  benefits: string[];
  sections: Array<{
    title: string;
    text: string;
  }>;
  faq: Array<{
    q: string;
    a: string;
  }>;
};

export function SeoLandingPage({ eyebrow, h1, intro, benefits, sections, faq }: SeoLandingPageProps) {
  return (
    <main className="min-h-screen bg-[#FAFBFF] text-[#080A0F]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Volver a BarberíaOS">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#080A0F] text-[#C9922A]">
              <Scissors size={19} />
            </span>
            <span className="font-black tracking-tight">BarberíaOS</span>
          </Link>
          <nav aria-label="Navegación comercial">
            <ul className="flex items-center gap-3">
              <li>
                <Link href="/demo" className="text-sm font-black text-slate-600 hover:text-[#080A0F]">
                  Demo
                </Link>
              </li>
              <li>
                <a
                  href={BUSINESS_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden text-sm font-black text-emerald-700 hover:text-emerald-800 sm:inline"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="bg-[#080A0F] px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.06em] text-[#C9922A]">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{h1}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">{intro}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/demo" variant="gold" className="min-h-12 px-7">
              Ver demo comercial <ArrowRight size={17} />
            </PrimaryButton>
            <a
              href={BUSINESS_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-emerald-300/25 bg-emerald-400/10 px-7 text-sm font-black text-emerald-200 transition hover:bg-emerald-400/20"
            >
              <MessageCircle size={17} />
              Pedir demo por WhatsApp
            </a>
          </div>
          <p className="mt-5 text-xs text-white/35">Sin comisión por reserva · Clientes propios · Pensado para barberías</p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black md:text-4xl">Qué resuelve BarberíaOS</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                <span className="text-sm font-bold leading-6 text-slate-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {sections.map((section) => (
            <article key={section.title} className="rounded-[24px] border border-slate-200 bg-[#F6F8FB] p-6">
              <h2 className="text-xl font-black">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-black md:text-3xl">Preguntas frecuentes</h2>
          <div className="mt-8 divide-y divide-slate-100 rounded-[28px] border border-slate-200 bg-white">
            {faq.map((item) => (
              <div key={item.q} className="p-5 md:p-6">
                <h3 className="font-black">{item.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#C9922A]/25 bg-[#080A0F] p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-black md:text-4xl">Prueba BarberíaOS con una reserva real.</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/65">
            Abre la demo, revisa el panel y crea una reserva de prueba desde el enlace público de reservas.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/demo" variant="gold" className="min-h-12 px-8">
              Ver demo <ArrowRight size={17} />
            </PrimaryButton>
            <PrimaryButton href={BUSINESS_CONFIG.demoBookingUrl} variant="ghost" className="min-h-12 px-8 text-white/80 hover:bg-white/10 hover:text-white">
              Crear reserva de prueba
            </PrimaryButton>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 text-center text-xs text-slate-400 lg:px-8">
        <nav aria-label="Enlaces internos SEO">
          <ul className="flex flex-wrap justify-center gap-5">
            <li>
              <Link href="/" className="font-bold text-slate-600 hover:text-[#080A0F]">Inicio</Link>
            </li>
            <li>
              <Link href="/demo" className="font-bold text-slate-600 hover:text-[#080A0F]">Demo</Link>
            </li>
            <li>
              <Link href={BUSINESS_CONFIG.demoBookingUrl} className="font-bold text-slate-600 hover:text-[#080A0F]">
                Reserva de prueba
              </Link>
            </li>
          </ul>
        </nav>
        <p className="mt-3">© {new Date().getFullYear()} BarberíaOS.</p>
      </footer>
    </main>
  );
}
