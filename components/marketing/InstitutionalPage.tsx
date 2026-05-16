import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  CircleDollarSign,
  Compass,
  HeartHandshake,
  MessageCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BUSINESS_CONFIG } from "@/src/lib/site-config";
import type { InstitutionalPage as InstitutionalPageData } from "@/src/lib/institutional-pages";
import { getInstitutionalPageJsonLd, institutionalPages } from "@/src/lib/institutional-pages";

const companyLinks = [
  ["Visión", institutionalPages.vision.path],
  ["Misión", institutionalPages.mision.path],
  ["Propósito", institutionalPages.proposito.path],
  ["Movimiento", institutionalPages.movimiento.path],
  ["Impacto", institutionalPages.impacto.path],
  ["Academia", institutionalPages.academia.path],
  ["Historias", institutionalPages.historias.path],
] as const;

const iconCycle = [
  CalendarCheck2,
  Users,
  CircleDollarSign,
  BarChart3,
  ShieldCheck,
  BookOpenCheck,
  HeartHandshake,
  BadgeCheck,
] as const;

function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/85 px-5 backdrop-blur-xl lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-3" aria-label="Ir a inicio">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#080A0F]">
            <Scissors size={18} />
          </span>
          <span className="font-black tracking-tight text-white">BarberíaOS</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-white/54 md:flex" aria-label="Navegación institucional">
          <Link href="/proposito" className="transition hover:text-white">
            Propósito
          </Link>
          <Link href="/movimiento" className="transition hover:text-white">
            Movimiento
          </Link>
          <Link href="/academia" className="transition hover:text-white">
            Academy
          </Link>
          <Link href="/demo" className="transition hover:text-white">
            Demo
          </Link>
        </nav>
        <a
          href={BUSINESS_CONFIG.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-300 transition hover:bg-emerald-400/20 sm:inline-flex"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}

function SectionShell({ children, variant = "dark" }: { children: React.ReactNode; variant?: "dark" | "graphite" }) {
  return (
    <section
      className={`px-5 py-16 md:py-24 lg:px-8 ${
        variant === "dark" ? "landing-section-dark" : "landing-section-graphite"
      }`}
    >
      {children}
    </section>
  );
}

function FeatureCard({
  title,
  text,
  index,
}: {
  title: string;
  text: string;
  index: number;
}) {
  const Icon = iconCycle[index % iconCycle.length];

  return (
    <article className="premium-dark-card rounded-[24px] p-5">
      <Icon size={22} className="text-[#D5A84C]" />
      <h3 className="mt-5 text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/56">{text}</p>
    </article>
  );
}

function FounderStatement() {
  return (
    <SectionShell variant="graphite">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-[#D5A84C]/30 bg-[#D5A84C]/[0.12] p-7 shadow-[0_28px_90px_rgba(213,168,76,0.12)] md:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D5A84C] text-[#080A0F]">
            <Compass size={26} />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-[#D5A84C]">Declaración del fundador</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
              Construir para ayudar a personas reales.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-white/66">
              <p>
                BarberíaOS nace de una convicción sencilla: la tecnología debe ayudar a personas reales. No queremos crear solo una herramienta de reservas; queremos construir un sistema que dé orden, claridad y crecimiento a negocios que trabajan duro cada día.
              </p>
              <p>
                Mi deseo es que este proyecto sirva para abrir puertas, ayudar a familias, fortalecer pequeños negocios y demostrar que se puede construir con fe, disciplina y excelencia.
              </p>
              <p>
                La provisión, los recursos y las oportunidades llegarán en el tiempo correcto. Nuestra parte es trabajar con honestidad, servir bien y construir algo que realmente aporte valor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-br from-[#05070d] via-[#07111f] to-[#02030a] px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#080A0F]">
              <Scissors size={18} />
            </span>
            <span className="font-black tracking-tight text-white">BarberíaOS</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-white/48">
            Software para barberías con reservas, agenda, caja, clientes, productos, marketing e IA del dueño.
          </p>
        </div>
        <div className="grid gap-7 sm:grid-cols-3">
          <div>
            <p className="text-xs font-black uppercase text-white/32">Empresa</p>
            <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Enlaces de empresa">
              <ul className="flex flex-col gap-2">
                {companyLinks.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-white/32">Producto</p>
            <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Enlaces de producto">
              <ul className="flex flex-col gap-2">
                <li><Link href="/software-para-barberias" className="hover:text-white">Software para barberías</Link></li>
                <li><Link href="/reservas-online-barberia" className="hover:text-white">Reservas online</Link></li>
                <li><Link href="/software-barberias-sin-comision" className="hover:text-white">Sin comisión</Link></li>
                <li><Link href="/caja-para-barberias" className="hover:text-white">Caja para barberías</Link></li>
              </ul>
            </nav>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-white/32">Acciones</p>
            <nav className="mt-3 text-sm font-bold text-white/52" aria-label="Acciones comerciales">
              <ul className="flex flex-col gap-2">
                <li><Link href="/demo" className="hover:text-white">Ver demo</Link></li>
                <li><Link href={BUSINESS_CONFIG.demoBookingUrl} className="hover:text-white">Reserva de prueba</Link></li>
                <li><Link href="/login" className="hover:text-white">Entrar al panel</Link></li>
                <li>
                  <a href={BUSINESS_CONFIG.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    WhatsApp
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/35">
        © {new Date().getFullYear()} BarberíaOS. Contacto: {BUSINESS_CONFIG.legalEmail}
      </div>
    </footer>
  );
}

export function InstitutionalPage({ page }: { page: InstitutionalPageData }) {
  const jsonLd = getInstitutionalPageJsonLd(page);

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="landing-canvas">
        <PublicHeader />

        <section className="relative overflow-hidden px-5 pb-16 pt-12 md:pb-24 md:pt-20 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D5A84C]/50 to-transparent" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black text-white/70">
                <Sparkles size={14} className="text-[#D5A84C]" />
                {page.eyebrow}
              </div>
              <h1 className="mt-6 text-4xl font-black leading-[1.02] text-white md:text-6xl">
                {page.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">{page.intro}</p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/52">{page.lead}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/demo" variant="gold" className="min-h-12 bg-gradient-to-r from-[#E8C675] via-[#D5A84C] to-[#B98526] px-7 shadow-[0_18px_44px_rgba(213,168,76,0.30)]">
                  {page.primaryCta} <ArrowRight size={17} />
                </PrimaryButton>
                <a
                  href={BUSINESS_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-cta-glass inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] px-7 text-sm font-black transition hover:bg-white/[0.12] hover:text-white"
                >
                  <MessageCircle size={17} />
                  {page.secondaryCta}
                </a>
              </div>
            </div>

            <div className="premium-mockup rounded-[30px] border p-5 md:p-6">
              <div className="rounded-[24px] border border-[#D5A84C]/[0.15] bg-[#07111f]/[0.78] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-black uppercase text-[#D5A84C]">BarberíaOS</p>
                    <h2 className="mt-1 text-2xl font-black text-white">Sistema propio para barberías</h2>
                  </div>
                  <Building2 size={28} className="text-[#D5A84C]" />
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    "Agenda y reservas para barberías",
                    "Clientes propios y seguimiento",
                    "Caja diaria y productos conectados",
                    "Marketing, reseñas e IA del dueño",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.065] p-4">
                      <CheckCircle2 size={17} className="shrink-0 text-[#D5A84C]" />
                      <span className="text-sm font-bold text-white/76">{item}</span>
                    </div>
                  ))}
                </div>
                {page.stats && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {page.stats.map((stat) => (
                      <div key={stat.value} className="rounded-2xl border border-[#D5A84C]/20 bg-[#D5A84C]/10 p-4">
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                        <p className="mt-1 text-xs leading-5 text-white/50">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <SectionShell variant="graphite">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
            {page.sections.map((section) => (
              <article key={section.title} className="premium-blue-card rounded-[28px] p-6">
                {section.eyebrow && <p className="text-xs font-black uppercase text-[#D5A84C]">{section.eyebrow}</p>}
                <h2 className="mt-3 text-2xl font-black leading-tight text-white">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/58">{section.text}</p>
                {section.items && (
                  <ul className="mt-6 space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-white/72">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#D5A84C]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </SectionShell>

        <SectionShell>
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase text-[#D5A84C]">BarberíaOS</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
                {page.featureGridTitle}
              </h2>
              {page.featureGridText && <p className="mt-5 text-base leading-8 text-white/60">{page.featureGridText}</p>}
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {page.features.map((feature, index) => (
                <FeatureCard key={feature.title} title={feature.title} text={feature.text} index={index} />
              ))}
            </div>
          </div>
        </SectionShell>

        {page.highlight && (
          <SectionShell variant="graphite">
            <div className="mx-auto max-w-5xl rounded-[32px] border border-[#D5A84C]/30 bg-[#D5A84C]/[0.12] p-7 text-center shadow-[0_28px_90px_rgba(213,168,76,0.12)] md:p-12">
              <HeartHandshake className="mx-auto text-[#D5A84C]" size={36} />
              <p className="mt-5 text-xs font-black uppercase text-[#D5A84C]">{page.highlight.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
                {page.highlight.title}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/64">{page.highlight.text}</p>
            </div>
          </SectionShell>
        )}

        {page.founderStatement && <FounderStatement />}

        <SectionShell>
          <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-white/[0.06] p-7 text-center shadow-[0_28px_90px_rgba(0,0,0,0.16)] md:p-12">
            <p className="text-xs font-black uppercase text-[#D5A84C]">Siguiente paso</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
              Mira BarberíaOS aplicado a una barbería real.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/58">
              Revisa reservas, agenda, caja, clientes, productos, QR, reseñas, Marketing Studio e IA del dueño en una demo corta.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <PrimaryButton href="/demo" variant="gold" className="min-h-12 bg-gradient-to-r from-[#E8C675] via-[#D5A84C] to-[#B98526] px-8">
                Ver demo <ArrowRight size={17} />
              </PrimaryButton>
              <a
                href={BUSINESS_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-cta-glass inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] px-8 text-sm font-black transition hover:bg-white/[0.12] hover:text-white"
              >
                <MessageCircle size={17} />
                Hablar por WhatsApp
              </a>
            </div>
          </div>
        </SectionShell>

        <PublicFooter />
      </div>
    </main>
  );
}
