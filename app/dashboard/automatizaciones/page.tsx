import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  MessageCircle,
  RefreshCw,
  Star,
  Workflow,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

const modules = [
  {
    href: "/dashboard/whatsapp",
    icon: MessageCircle,
    title: "Asistente WhatsApp",
    state: "Manual operativo",
    text: "Plantillas, enlace wa.me y textos listos para copiar. Sin WhatsApp Cloud API todavia.",
  },
  {
    href: "/dashboard/resenas",
    icon: Star,
    title: "Asistente de Reseñas",
    state: "Manual operativo",
    text: "Mensaje de reseña, link de Google Reviews guardado localmente y respuesta sugerida.",
  },
  {
    href: "/dashboard/recuperacion",
    icon: RefreshCw,
    title: "Recuperacion de Clientes",
    state: "Mock visual",
    text: "Lista priorizada y campañas manuales preparadas para conectar citas reales despues.",
  },
];

const roadmap = [
  "Guardar configuracion por barberia",
  "Crear eventos internos de reserva completada y no-show",
  "Conectar WhatsApp Cloud API con opt-in y logs",
  "Conectar Google Business Profile para reseñas",
  "Exponer webhooks para n8n cuando el flujo base este validado",
];

export default function AutomatizacionesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        section="Centro de automatizaciones"
        title="Automatizaciones manuales listas para vender"
        description="Primera version operativa para activar crecimiento sin APIs externas: WhatsApp asistido, reseñas y recuperacion con plantillas, enlaces y metricas visuales."
        action={
          <Link
            href="/dashboard/whatsapp"
            className="btn-dark"
          >
            Empezar por WhatsApp <ArrowRight size={14} />
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Modulos preparados" value="3" description="WhatsApp, reseñas y recuperacion" icon={Workflow} />
        <StatCard label="APIs externas" value="0" description="fase manual segura" icon={Bot} iconBg="bg-emerald-50" iconColor="text-emerald-700" />
        <StatCard label="Plantillas listas" value="15" description="copiar o abrir WhatsApp" icon={MessageCircle} iconBg="bg-[#C89B3C]/10" iconColor="text-[#8A641F]" />
        <StatCard label="Tiempo a activar" value="1 dia" description="operativo comercial" icon={Clock3} iconBg="bg-amber-50" iconColor="text-amber-700" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ href, icon: Icon, title, state, text }) => (
          <Link key={title} href={href} className="metric-card block">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="metric-icon bg-[#2563EB]/10">
                <Icon size={18} className="text-[#2563EB]" />
              </div>
              <span className={state.includes("Mock") ? "badge-warning" : "badge-success"}>{state}</span>
            </div>
            <h3 className="font-bold text-[#111827]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#2563EB]">
              Abrir modulo <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="section-band overflow-hidden">
          <div className="h-px w-full bg-gradient-to-r from-[#C89B3C]/30 via-[#2563EB] to-[#111111]/70" />
          <div className="p-5 md:p-6">
            <p className="label-section">Regla de seguridad MVP</p>
            <h2 className="section-heading">No se envia nada automaticamente</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              El sistema prepara mensajes y decisiones operativas, pero el equipo decide cuando copiar, abrir WhatsApp o pedir una reseña. Esto evita tocar reservas, disponibilidad, auth o datos criticos mientras se valida el producto vendible.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Sin WhatsApp Cloud API", "Sin Google Business API", "Sin n8n", "Sin cambios de SQL"].map((item) => (
                <div key={item} className="rounded-[16px] border border-[#E7E2D8] bg-[#FDFBF7] p-3 text-sm font-bold text-neutral-700">
                  <CheckCircle2 size={15} className="mb-2 text-emerald-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <p className="label-section">Preparado para despues</p>
          <h2 className="section-heading">Estructura futura</h2>
          <div className="mt-4 space-y-3">
            {roadmap.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-[16px] border border-[#E7E2D8] bg-white p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-black text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold leading-6 text-neutral-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
