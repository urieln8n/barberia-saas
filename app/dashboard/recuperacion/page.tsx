"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  Clock3,
  Copy,
  MessageCircle,
  PiggyBank,
  RotateCcw,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

const inactiveClients = [
  {
    name: "Andrés Molina",
    phone: "+34 611 234 890",
    lastVisit: "Hace 74 días",
    lastService: "Corte + barba",
    value: "42 EUR",
    segment: "Cliente recurrente",
  },
  {
    name: "Sergio Navarro",
    phone: "+34 622 801 442",
    lastVisit: "Hace 58 días",
    lastService: "Degradado",
    value: "24 EUR",
    segment: "Alta probabilidad",
  },
  {
    name: "Iván Torres",
    phone: "+34 633 590 118",
    lastVisit: "Hace 91 días",
    lastService: "Barba premium",
    value: "18 EUR",
    segment: "Necesita seguimiento",
  },
];

const templates = [
  {
    title: "Hace tiempo que no pasas",
    text: "Hola, hace tiempo que no pasas por la barbería. Si quieres dejar el corte al día, tenemos huecos esta semana.",
  },
  {
    title: "Promo corte + barba",
    text: "Esta semana tenemos combo corte + barba para clientes habituales. Si te encaja, te buscamos un hueco.",
  },
  {
    title: "Huecos disponibles hoy",
    text: "Hoy se han liberado algunos huecos en la barbería. Si quieres venir, te paso las horas disponibles.",
  },
  {
    title: "Recordatorio mensual",
    text: "Ya toca repasar el corte. Te dejamos listo en menos de una hora y puedes reservar por WhatsApp.",
  },
];

export default function RecuperacionPage() {
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const recoveryMessage = encodeURIComponent(
    "Hola, hace tiempo que no pasas por la barbería. Tenemos huecos esta semana si quieres dejar el corte al día."
  );

  async function copyTemplate(title: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedTemplate(title);
    window.setTimeout(() => setCopiedTemplate(null), 1800);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        section="Crecimiento"
        title="Recuperación de clientes"
        description="Detecta clientes que llevan semanas sin volver y activa mensajes de WhatsApp para recuperar citas, frecuencia e ingresos sin automatización compleja todavía."
        action={
          <div className="flex flex-wrap gap-2">
            <span className="badge-gold">MVP</span>
            <span className="badge-teal">Growth</span>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Clientes inactivos" value="27" description="más de 45 días" icon={Users} />
        <StatCard label="Mensajes enviados" value="63" description="campañas manuales" icon={MessageCircle} iconBg="bg-[#2563EB]/10" iconColor="text-[#2563EB]" />
        <StatCard label="Reservas recuperadas" value="11" description="últimos 30 días" icon={CalendarClock} iconBg="bg-emerald-50" iconColor="text-emerald-700" />
        <StatCard label="Ingresos recuperados" value="418 EUR" description="estimación mensual" icon={PiggyBank} iconBg="bg-[#C89B3C]/10" iconColor="text-[#8A641F]" />
      </div>

      <section className="section-band overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-[#2563EB]/40 via-[#C89B3C] to-[#111111]/70" />
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-5 md:p-7">
            <div className="flex items-center gap-3">
              <div className="metric-icon bg-[#D4AF37]/10">
                <RotateCcw size={17} className="text-[#D4AF37]" />
              </div>
              <div>
                <p className="label-section">Motor de recuperación</p>
                <h2 className="section-heading">Más citas desde clientes que ya confiaron</h2>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
              Antes de invertir en anuncios, una barbería puede recuperar facturación hablando con clientes que ya han venido. Esta versión prioriza una lista accionable, mensajes listos y métricas comerciales para vender el módulo Growth.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${recoveryMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark"
              >
                Enviar mensaje por WhatsApp <Send size={15} />
              </a>
              <a href="/dashboard/whatsapp" className="btn-outline">
                Ver asistente WhatsApp <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="border-t border-white/[0.06] bg-[#0A0A0D] p-5 md:p-7 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
              Criterio MVP
            </p>
            <div className="mt-3 rounded-[18px] border border-white/[0.06] bg-white/[0.04] p-4">
              <p className="text-sm leading-6 text-white/55">
                Cliente con teléfono, sin visita reciente y con historial suficiente para una invitación comercial. En esta fase la lista es mock porque la última visita real depende de reservas/citas y no se modifica esa lógica.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-white/[0.06] bg-white/[0.04] p-4">
                <Clock3 size={16} className="text-[#D4AF37]" />
                <p className="mt-2 text-sm font-black text-white">45+ días</p>
                <p className="text-xs text-white/35">umbral sugerido</p>
              </div>
              <div className="rounded-[18px] border border-white/[0.06] bg-white/[0.04] p-4">
                <MessageCircle size={16} className="text-blue-400" />
                <p className="mt-2 text-sm font-black text-white">WhatsApp</p>
                <p className="text-xs text-white/35">canal inicial</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel p-0">
          <div className="border-b border-white/[0.06] bg-[#0A0A0D] px-5 py-4">
            <p className="label-section">Clientes inactivos</p>
            <h2 className="section-heading">Lista priorizada para recuperar</h2>
            <p className="section-subtext">Mock visual hasta conectar última visita real de forma segura.</p>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {inactiveClients.map((client) => (
              <article key={client.phone} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-white">{client.name}</h3>
                    <span className="badge-warning">{client.segment}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/45">
                    {client.lastService} · {client.lastVisit} · ticket medio {client.value}
                  </p>
                  <p className="mt-1 text-xs text-white/30">{client.phone}</p>
                </div>
                <a
                  href={`https://wa.me/${client.phone.replace(/\D/g, "")}?text=${recoveryMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full sm:w-auto"
                >
                  WhatsApp <Send size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <p className="label-section">Plantillas</p>
            <h2 className="section-heading">Mensajes de recuperación</h2>
          </div>
          <div className="grid gap-4">
            {templates.map((template) => (
              <article key={template.title} className="metric-card">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-black text-white">{template.title}</h3>
                  <span className="badge-gold">WhatsApp</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/45">{template.text}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => copyTemplate(template.title, template.text)}
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
        </div>
      </section>

      <section className="rounded-[18px] border border-white/[0.08] bg-white/[0.03] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="metric-icon bg-blue-500/10">
              <Sparkles size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="font-black text-white">Automatización futura</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/45">
                Próxima fase: detectar inactividad desde citas reales, excluir clientes con reserva futura, programar cadencias y medir reservas recuperadas por plantilla.
              </p>
            </div>
          </div>
          <span className="badge-teal w-fit">Próximamente</span>
        </div>
      </section>
    </div>
  );
}
