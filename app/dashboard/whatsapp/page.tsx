"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Copy,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";

function buildTemplates(bookingUrl: string) {
  return [
    {
      title: "Precios",
      text: `Hola, estos son nuestros servicios principales: corte, barba y combo corte + barba. Puedes reservar aqui cuando quieras: ${bookingUrl}`,
    },
    {
      title: "Horarios",
      text: `Abrimos de lunes a sabado. Dime que dia te viene bien y revisamos huecos disponibles. Tambien puedes reservar aqui: ${bookingUrl}`,
    },
    {
      title: "Ubicación",
      text: `Estamos en el centro. Te paso la ubicacion y el enlace para reservar sin esperas: ${bookingUrl}`,
    },
    {
      title: "Reservar cita",
      text: "Puedes elegir barbero, servicio y hora desde nuestro enlace de reservas.",
    },
    {
      title: "Confirmar cita",
      text: "Tu cita queda pendiente de confirmación. Te esperamos unos minutos antes para preparar el servicio.",
    },
    {
      title: "Recordar cita",
      text: "Te recordamos tu cita de barbería. Si necesitas cambiarla, avísanos con tiempo.",
    },
    {
      title: "Recuperar cliente",
      text: "Hace tiempo que no pasas por la barbería. Tenemos huecos esta semana para dejarte el corte al día.",
    },
  ];
}

export default function WhatsAppAssistantPage() {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const bookingUrl = `${getConfiguredSiteUrl()}/r/tu-barberia`;
  const templates = buildTemplates(bookingUrl);
  const welcomeMessage =
    "Hola, soy el asistente de la barberia. Puedo ayudarte con precios, horarios, ubicacion y reservas. Si quieres cita, te paso el enlace para elegir servicio, barbero y hora.";
  const whatsappMessage = encodeURIComponent(
    `Hola, quiero reservar cita en la barbería. He visto el enlace: ${bookingUrl}`
  );

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedTemplate(label);
    window.setTimeout(() => setCopiedTemplate(null), 1800);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        section="Crecimiento"
        title="Asistente WhatsApp"
        description="Convierte conversaciones repetidas en reservas: precios, horarios, ubicación, confirmaciones y recordatorios preparados para responder rápido desde WhatsApp."
        action={
          <div className="flex flex-wrap gap-2">
            <span className="badge-gold">MVP</span>
            <span className="badge-teal">Growth</span>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Mensajes respondidos" value="186" description="estimación mensual" icon={MessageCircle} />
        <StatCard label="Reservas generadas" value="42" description="desde conversaciones" icon={CalendarCheck} iconBg="bg-emerald-500/[0.10]" iconColor="text-emerald-400" />
        <StatCard label="Tiempo ahorrado" value="9h" description="en respuestas repetidas" icon={Clock3} iconBg="bg-amber-500/[0.10]" iconColor="text-amber-400" />
        <StatCard label="Clientes recuperados" value="14" description="con mensajes directos" icon={RotateCcw} iconBg="bg-[#C89B3C]/10" iconColor="text-[#8A641F]" />
      </div>

      <section className="section-band overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37] to-[#D4AF37]/20" />
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-5 md:p-7">
            <div className="flex items-center gap-3">
              <div className="metric-icon bg-emerald-500/[0.10]">
                <Bot size={17} className="text-emerald-400" />
              </div>
              <div>
                <p className="label-section">Estado del asistente</p>
                <h2 className="section-heading">Listo para operar manualmente</h2>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-500">
              Esta primera versión permite vender el módulo como asistente premium sin conectar todavía WhatsApp Business API. El equipo puede usar plantillas, compartir el enlace de reserva y medir el impacto comercial de forma visual.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark"
              >
                Abrir WhatsApp <Send size={15} />
              </a>
              <button
                type="button"
                onClick={() => copyText("Mensaje bienvenida", welcomeMessage)}
                className="btn-outline"
              >
                Copiar bienvenida <Copy size={15} />
              </button>
              <Link href="/dashboard/qr" className="btn-outline">
                Ver link público <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
          <div className="border-t border-[#E7E2D8] bg-[#FDFBF7] p-5 md:p-7 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
              Mensaje de bienvenida
            </p>
            <div className="mt-3 rounded-[18px] border border-[#E7E2D8] bg-white p-4 shadow-sm">
              <p className="text-sm leading-6 text-neutral-700">
                {welcomeMessage}
              </p>
            </div>
            <div className="mt-4 rounded-[18px] border border-[#DDE7FB] bg-[#EFF6FF] p-4">
              <p className="text-sm font-bold text-[#1D4ED8]">Enlace público de reserva</p>
              <p className="mt-1 break-all font-mono text-xs text-[#2459bd]">{bookingUrl}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-section">Plantillas rápidas</p>
            <h2 className="section-heading">Respuestas de barbería listas para enviar</h2>
          </div>
          <span className="badge-neutral w-fit">Editable próximamente</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article key={template.title} className="metric-card">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-black text-[#111827]">{template.title}</h3>
                <span className="badge-gold">WhatsApp</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{template.text}</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => copyText(template.title, template.text)}
                  className="btn-outline flex-1"
                >
                  {copiedTemplate === template.title ? "Copiado" : "Copiar"} <Copy size={14} />
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(template.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark flex-1"
                >
                  Abrir <Send size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[18px] border border-[#DDE7FB] bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="metric-icon bg-[#2563EB]/10">
              <Sparkles size={16} className="text-[#2563EB]" />
            </div>
            <div>
              <p className="font-black text-[#111827]">Próximamente WhatsApp Business API</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
                Conexión de número oficial, respuestas automáticas, recordatorios de cita y recuperación de clientes desde eventos reales del sistema.
              </p>
              <div className="mt-3 grid gap-2 text-xs font-semibold text-neutral-500 sm:grid-cols-3">
                <span className="inline-flex items-center gap-1"><CheckCircle2 size={13} className="text-emerald-700" /> Webhook</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 size={13} className="text-emerald-700" /> Opt-in cliente</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 size={13} className="text-emerald-700" /> Logs de envio</span>
              </div>
            </div>
          </div>
          <span className="badge-teal w-fit">Próximamente</span>
        </div>
      </section>
    </div>
  );
}
