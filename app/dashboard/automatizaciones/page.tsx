import { Zap, Bell, MessageCircle, RefreshCw, Gift, ArrowRight } from "lucide-react";

export default function AutomatizacionesPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-neutral-500">Panel de control</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-black">Automatizaciones</h1>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
            Premium · Próximamente
          </span>
        </div>
        <p className="mt-1 max-w-xl text-neutral-500">
          Confirmaciones, recordatorios, recuperación de clientes y seguimientos — todo automático, sin que hagas nada.
        </p>
      </div>

      {/* Banner plan */}
      <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-red-900">Disponible en el plan Premium</p>
            <p className="mt-1 text-sm text-red-700">
              Automatizaciones activas incluidas en tu suscripción. Sin configurar ni mantener nada tú.
            </p>
          </div>
          <a
            href="/#precios"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            Ver planes <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* Automatizaciones previstas */}
      <div>
        <h2 className="mb-4 text-lg font-black text-neutral-800">Automatizaciones incluidas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Bell,
              plan: "Starter",
              status: "En desarrollo",
              title: "Email de confirmación",
              text: "El cliente recibe su confirmación por email al instante cuando hace una reserva. Sin que toques nada.",
            },
            {
              icon: Bell,
              plan: "Growth",
              status: "Próximamente",
              title: "Recordatorio 24h antes",
              text: "Email automático al cliente el día antes de su cita. Reduce los no-shows sin llamar a nadie.",
            },
            {
              icon: MessageCircle,
              plan: "Premium",
              status: "Próximamente",
              title: "Recordatorio por WhatsApp",
              text: "Mensaje automático por WhatsApp 24h antes de la cita. Mayor tasa de apertura que el email.",
            },
            {
              icon: RefreshCw,
              plan: "Growth",
              status: "Próximamente",
              title: "Recuperación de inactivos",
              text: "Clientes que llevan +60 días sin venir reciben un mensaje automático con incentivo para volver.",
            },
            {
              icon: MessageCircle,
              plan: "Premium",
              status: "Próximamente",
              title: "Asistente WhatsApp",
              text: "Responde preguntas frecuentes y toma reservas directamente por WhatsApp, sin que estés disponible.",
            },
            {
              icon: Gift,
              plan: "Premium",
              status: "Próximamente",
              title: "Fidelización automática",
              text: "Detecta clientes frecuentes y les envía beneficios VIP. Más retención, menos trabajo manual.",
            },
          ].map(({ icon: Icon, plan, status, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                  <Icon size={18} className="text-neutral-600" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    plan === "Starter" ? "bg-neutral-100 text-neutral-600"
                    : plan === "Growth" ? "bg-blue-50 text-blue-700"
                    : "bg-red-50 text-red-700"
                  }`}>
                    {plan}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-400">{status}</span>
                </div>
              </div>
              <h3 className="font-bold text-neutral-900">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Planes */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-sm font-bold text-neutral-700">Incluido en</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">Starter — 49 €/mes (email confirmación)</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Growth — 149 €/mes (recordatorios + inactivos)</span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">Premium — 299 €/mes (WhatsApp + fidelización)</span>
        </div>
      </div>
    </div>
  );
}
