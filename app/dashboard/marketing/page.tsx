import { Megaphone, Instagram, Globe, Star, BarChart3, FileImage, ArrowRight } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-neutral-500">Panel de control</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-black">Marketing</h1>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
            Growth · Próximamente
          </span>
        </div>
        <p className="mt-1 max-w-xl text-neutral-500">
          Herramientas para que tu barbería aparezca en Google, Instagram y WhatsApp — y convierta visitas en reservas reales.
        </p>
      </div>

      {/* Banner plan */}
      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-blue-900">Disponible en el plan Growth y Premium</p>
            <p className="mt-1 text-sm text-blue-700">
              Marketing digital local incluido en tu suscripción mensual. Sin contratar agencias externas.
            </p>
          </div>
          <a
            href="/#precios"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            Ver planes <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* Módulos de marketing */}
      <div>
        <h2 className="mb-4 text-lg font-black text-neutral-800">Módulos incluidos en Growth</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Globe,
              plan: "Growth",
              title: "Google Business optimizado",
              text: "Configuramos tu perfil de Google para que aparezcas cuando busquen 'barbería en [tu ciudad]'. Fotos, horarios, reseñas.",
            },
            {
              icon: Instagram,
              plan: "Growth",
              title: "Instagram optimizado",
              text: "Bio con link de reserva, highlights, estética de perfil y primeros posts con tu identidad de marca.",
            },
            {
              icon: FileImage,
              plan: "Growth",
              title: "8 posts al mes",
              text: "Diseños con tu logo y colores para publicar cada semana. Sin que tengas que pensar en qué publicar.",
            },
            {
              icon: Star,
              plan: "Growth",
              title: "Reporte mensual",
              text: "Resumen de reservas, ingresos, clientes nuevos y rendimiento de marketing. En menos de 1 página.",
            },
            {
              icon: Megaphone,
              plan: "Premium",
              title: "Campañas de anuncios locales",
              text: "Anuncios en Meta e Instagram segmentados a personas cerca de tu barbería. Presupuesto de anuncios aparte.",
            },
            {
              icon: BarChart3,
              plan: "Premium",
              title: "Análisis avanzado",
              text: "Qué canales traen más clientes, qué servicios funcionan mejor, cuándo llenar la agenda.",
            },
          ].map(({ icon: Icon, plan, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                  <Icon size={18} className="text-neutral-600" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  plan === "Growth" ? "bg-blue-50 text-blue-700" : "bg-neutral-100 text-neutral-500"
                }`}>
                  {plan}
                </span>
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
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Growth — 149 €/mes</span>
          <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">Premium — 299 €/mes</span>
        </div>
        <p className="mt-3 text-xs text-neutral-400">El presupuesto de anuncios (Google Ads, Meta Ads) se factura aparte y lo decides tú.</p>
      </div>
    </div>
  );
}
