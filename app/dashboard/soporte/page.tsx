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
import { PageHeader } from "@/components/ui/PageHeader";

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
    tone: "gold",
  },
  {
    icon: MessageCircle,
    title: "Contactar soporte",
    description: "¿Tienes un problema o una pregunta? Escríbenos directamente por WhatsApp y te respondemos en menos de 24 horas.",
    cta: "Abrir chat",
    href: "https://wa.me/34645466308?text=Hola%2C%20necesito%20ayuda%20con%20Barber%C3%ADaOS",
    tone: "success",
    external: true,
  },
  {
    icon: HelpCircle,
    title: "Preguntas frecuentes",
    description: "Respuestas a las dudas más comunes: reservas, pagos, barberos, fidelización, QR y configuración de la cuenta.",
    cta: "Ver FAQ",
    href: "https://docs.barberiaos.com/faq",
    tone: "gold",
  },
  {
    icon: Shield,
    title: "Estado del sistema",
    description: "Consulta el estado en tiempo real de todos los servicios de BarberíaOS: reservas, pagos, notificaciones y API.",
    cta: "Ver estado",
    href: "https://status.barberiaos.com",
    tone: "neutral",
    external: true,
  },
  {
    icon: Rocket,
    title: "Novedades y mejoras",
    description: "Descubre las últimas funciones añadidas: fidelización digital, reagendar citas, reportes y mejoras de la agenda.",
    cta: "Ver novedades",
    href: "https://docs.barberiaos.com/novedades",
    tone: "neutral",
  },
  {
    icon: LifeBuoy,
    title: "Solicitar mejora",
    description: "¿Falta algo que mejoraría tu barbería? Cuéntanos y lo añadimos al roadmap. Tu opinión define el producto.",
    cta: "Enviar idea",
    href: "https://wa.me/34645466308?text=Hola%2C%20tengo%20una%20idea%20para%20BarberíaOS%3A%20",
    tone: "success",
    external: true,
  },
];

// Design system: 3 tonos semánticos únicamente
const toneMap: Record<string, { icon: string; border: string; bg: string; cta: string }> = {
  gold:    {
    icon: "text-[#C9922A]",
    border: "border-[#D4AF37]/25",
    bg: "bg-[#D4AF37]/5",
    cta: "text-[#8A641F] hover:bg-[#D4AF37]/12 border-[#D4AF37]/30",
  },
  success: {
    icon: "text-emerald-600",
    border: "border-emerald-100",
    bg: "bg-emerald-50",
    cta: "text-emerald-700 hover:bg-emerald-100 border-emerald-200",
  },
  neutral: {
    icon: "text-slate-500",
    border: "border-slate-200",
    bg: "bg-slate-50",
    cta: "text-slate-600 hover:bg-slate-100 border-slate-200",
  },
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
    <div className="mx-auto max-w-4xl space-y-6">

      <PageHeader
        section="Sistema"
        title="Centro de ayuda"
        description="Encuentra guías, resuelve dudas o contacta con nuestro equipo."
        variant="compact"
      />

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {helpCards.map((card) => {
          const Icon = card.icon;
          const t = toneMap[card.tone ?? "neutral"];
          return (
            <article
              key={card.title}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-md"
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border ${t.border} ${t.bg}`}>
                <Icon size={18} className={t.icon} />
              </div>
              <h2 className="text-sm font-black text-slate-900">{card.title}</h2>
              <p className="mt-2 flex-1 text-xs leading-5 text-slate-500">{card.description}</p>
              <a
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className={`mt-4 inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black transition ${t.cta}`}
              >
                {card.cta}
                {card.external ? <ExternalLink size={11} /> : <ArrowRight size={11} />}
              </a>
            </article>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center gap-2">
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
              className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-[#D4AF37]/30 hover:bg-[#FDFAF3] hover:text-slate-900"
            >
              <CheckCircle2 size={13} className="shrink-0 text-slate-400" />
              {link.label}
              <ExternalLink size={10} className="ml-auto shrink-0 text-slate-300" />
            </a>
          ))}
        </div>
      </div>

      {/* Direct contact */}
      <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#FDFAF3] p-6 shadow-card">
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
            className="btn-dark btn-sm shrink-0"
          >
            <MessageCircle size={14} />
            Contactar por WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}
