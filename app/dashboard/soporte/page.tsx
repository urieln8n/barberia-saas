import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  LifeBuoy,
  MessageCircle,
  Rocket,
  Shield,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Soporte | BarberíaOS",
  description: "Centro de ayuda, guías rápidas y contacto de soporte para BarberíaOS.",
};

const helpCards = [
  {
    icon: BookOpen,
    title: "Guía rápida",
    description: "Aprende a configurar tu barbería, añadir barberos, crear servicios y recibir tu primera reserva en menos de 10 minutos.",
    cta: "Ver guía",
    href: "https://docs.barberiaos.com/guia-rapida",
    color: "blue",
  },
  {
    icon: MessageCircle,
    title: "Contactar soporte",
    description: "¿Tienes un problema o una pregunta? Escríbenos directamente por WhatsApp y te respondemos en menos de 24 horas.",
    cta: "Abrir chat",
    href: "https://wa.me/34645466308?text=Hola%2C%20necesito%20ayuda%20con%20Barber%C3%ADaOS",
    color: "green",
    external: true,
  },
  {
    icon: HelpCircle,
    title: "Preguntas frecuentes",
    description: "Respuestas a las dudas más comunes: reservas, pagos, barberos, fidelización, QR y configuración de la cuenta.",
    cta: "Ver FAQ",
    href: "https://docs.barberiaos.com/faq",
    color: "gold",
  },
  {
    icon: Shield,
    title: "Estado del sistema",
    description: "Consulta el estado en tiempo real de todos los servicios de BarberíaOS: reservas, pagos, notificaciones y API.",
    cta: "Ver estado",
    href: "https://status.barberiaos.com",
    color: "slate",
    external: true,
  },
  {
    icon: Rocket,
    title: "Novedades y mejoras",
    description: "Descubre las últimas funciones añadidas: fidelización digital, reagendar citas, reportes y mejoras de la agenda.",
    cta: "Ver novedades",
    href: "https://docs.barberiaos.com/novedades",
    color: "purple",
  },
  {
    icon: LifeBuoy,
    title: "Solicitar mejora",
    description: "¿Falta algo que mejoraría tu barbería? Cuéntanos y lo añadimos al roadmap. Tu opinión define el producto.",
    cta: "Enviar idea",
    href: "https://wa.me/34645466308?text=Hola%2C%20tengo%20una%20idea%20para%20BarberíaOS%3A%20",
    color: "orange",
    external: true,
  },
];

const colorMap: Record<string, { icon: string; border: string; bg: string; cta: string }> = {
  blue:   { icon: "text-blue-600",    border: "border-blue-100",   bg: "bg-blue-50",   cta: "text-blue-700 hover:bg-blue-100 border-blue-200"   },
  green:  { icon: "text-emerald-600", border: "border-emerald-100",bg: "bg-emerald-50",cta: "text-emerald-700 hover:bg-emerald-100 border-emerald-200" },
  gold:   { icon: "text-[#C9922A]",   border: "border-[#D4AF37]/20",bg:"bg-[#D4AF37]/5",cta:"text-[#C9922A] hover:bg-[#D4AF37]/12 border-[#D4AF37]/25" },
  slate:  { icon: "text-slate-600",   border: "border-slate-200",  bg: "bg-slate-50",  cta: "text-slate-700 hover:bg-slate-100 border-slate-200" },
  purple: { icon: "text-violet-600",  border: "border-violet-100", bg: "bg-violet-50", cta: "text-violet-700 hover:bg-violet-100 border-violet-200" },
  orange: { icon: "text-orange-600",  border: "border-orange-100", bg: "bg-orange-50", cta: "text-orange-700 hover:bg-orange-100 border-orange-200" },
};

const quickLinks = [
  { label: "Cómo añadir un barbero",    href: "https://docs.barberiaos.com/barberos" },
  { label: "Crear un servicio",          href: "https://docs.barberiaos.com/servicios" },
  { label: "Activar fidelización",       href: "https://docs.barberiaos.com/fidelizacion" },
  { label: "Compartir mi QR",            href: "https://docs.barberiaos.com/qr" },
  { label: "Cobrar una cita",            href: "https://docs.barberiaos.com/caja" },
  { label: "Exportar clientes",          href: "https://docs.barberiaos.com/clientes" },
];

export default function SoportePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">

      {/* Header */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C9922A]">Soporte</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Centro de ayuda</h1>
        <p className="mt-1 text-sm text-slate-500">
          Encuentra guías, resuelve dudas o contacta con nuestro equipo.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {helpCards.map((card) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <article
              key={card.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${c.border} ${c.bg}`}>
                <Icon size={18} className={c.icon} />
              </div>
              <h2 className="text-sm font-black text-slate-900">{card.title}</h2>
              <p className="mt-2 flex-1 text-xs leading-5 text-slate-500">{card.description}</p>
              <a
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className={`mt-4 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black transition ${c.cta}`}
              >
                {card.cta}
                {card.external ? <ExternalLink size={11} /> : <ArrowRight size={11} />}
              </a>
            </article>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-[#D4AF37]" />
          <h2 className="text-sm font-black text-slate-900">Accesos rápidos</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
            >
              <CheckCircle2 size={13} className="shrink-0 text-slate-400" />
              {link.label}
              <ExternalLink size={10} className="ml-auto shrink-0 text-slate-300" />
            </a>
          ))}
        </div>
      </div>

      {/* Direct contact */}
      <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#FDFAF3] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-slate-900">¿Necesitas ayuda personalizada?</p>
            <p className="mt-1 text-xs text-slate-500">
              Nuestro equipo responde en menos de 24 horas, de lunes a viernes.
            </p>
          </div>
          <a
            href="https://wa.me/34645466308?text=Hola%2C%20necesito%20ayuda%20con%20BarberíaOS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-700"
          >
            <MessageCircle size={15} />
            Contactar por WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}
