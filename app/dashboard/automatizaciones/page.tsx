import Link from "next/link";
import { Bell, MessageCircle, RefreshCw, Gift, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AutomatizacionesPage() {
  return (
    <div className="space-y-5">

      <PageHeader
        section="Automatizaciones"
        title="Automatizaciones"
        description="Confirmaciones, recordatorios, recuperación de clientes y seguimientos — todo automático, sin que hagas nada."
        action={
          <span className="rounded-full bg-[#0D0D0D] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            Premium · Próximamente
          </span>
        }
      />

      {/* Banner plan */}
      <div className="overflow-hidden rounded-3xl bg-[#0D0D0D] text-white shadow-lg">
        <div className="h-px w-full bg-gradient-to-r from-[#C89B3C]/60 via-[#00C2A8] to-[#C89B3C]/60" />
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Plan Premium</p>
            <p className="mt-1 font-black text-white">Automatizaciones activas incluidas</p>
            <p className="mt-1 text-sm text-white/60">
              Sin configurar ni mantener nada tú. Incluido en tu suscripción.
            </p>
          </div>
          <Link
            href="/#precios"
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#00C2A8] px-5 py-2.5 text-sm font-bold text-[#0D0D0D] transition-colors hover:bg-[#009e88]"
          >
            Ver planes <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Automatizaciones previstas */}
      <div>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Roadmap</p>
          <h2 className="mt-0.5 text-lg font-black text-[#0D0D0D]">Automatizaciones incluidas</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Bell,          plan: "Starter",  status: "En desarrollo",  title: "Email de confirmación",       text: "El cliente recibe su confirmación por email al instante cuando hace una reserva. Sin que toques nada." },
            { icon: Bell,          plan: "Growth",   status: "Próximamente",   title: "Recordatorio 24h antes",      text: "Email automático al cliente el día antes de su cita. Reduce los no-shows sin llamar a nadie." },
            { icon: MessageCircle, plan: "Premium",  status: "Próximamente",   title: "Recordatorio por WhatsApp",   text: "Mensaje automático por WhatsApp 24h antes de la cita. Mayor tasa de apertura que el email." },
            { icon: RefreshCw,     plan: "Growth",   status: "Próximamente",   title: "Recuperación de inactivos",   text: "Clientes que llevan +60 días sin venir reciben un mensaje automático con incentivo para volver." },
            { icon: MessageCircle, plan: "Premium",  status: "Próximamente",   title: "Asistente WhatsApp",          text: "Responde preguntas frecuentes y toma reservas directamente por WhatsApp, sin que estés disponible." },
            { icon: Gift,          plan: "Premium",  status: "Próximamente",   title: "Fidelización automática",     text: "Detecta clientes frecuentes y les envía beneficios VIP. Más retención, menos trabajo manual." },
          ].map(({ icon: Icon, plan, status, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C89B3C]/10">
                  <Icon size={18} className="text-[#C89B3C]" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    plan === "Starter"
                      ? "border border-[#C89B3C]/30 bg-[#C89B3C]/10 text-[#C89B3C]"
                      : plan === "Growth"
                      ? "border border-[#00C2A8]/30 bg-[#00C2A8]/10 text-[#009e88]"
                      : "bg-[#0D0D0D] text-white"
                  }`}>
                    {plan}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-400">{status}</span>
                </div>
              </div>
              <h3 className="font-bold text-[#0D0D0D]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Planes */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-[#F5F2EA] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Precios</p>
        <p className="mt-1 text-sm font-bold text-neutral-700">Incluido en</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
            Starter — 49 €/mes (email confirmación)
          </span>
          <span className="rounded-full border border-[#00C2A8]/30 bg-[#00C2A8]/10 px-3 py-1 text-xs font-semibold text-[#009e88]">
            Growth — 149 €/mes (recordatorios + inactivos)
          </span>
          <span className="rounded-full bg-[#0D0D0D] px-3 py-1 text-xs font-semibold text-white">
            Premium — 299 €/mes (WhatsApp + fidelización)
          </span>
        </div>
      </div>

    </div>
  );
}
