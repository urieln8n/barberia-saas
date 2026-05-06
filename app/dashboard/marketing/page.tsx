import Link from "next/link";
import { Megaphone, Instagram, Globe, Star, BarChart3, FileImage, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function MarketingPage() {
  return (
    <div className="space-y-5">

      <PageHeader
        section="Marketing"
        title="Marketing digital"
        description="Herramientas para que tu barbería aparezca en Google, Instagram y WhatsApp — y convierta visitas en reservas reales."
        action={
          <span className="rounded-full border border-[#00C2A8]/30 bg-[#00C2A8]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#009e88]">
            Growth · Próximamente
          </span>
        }
      />

      {/* Banner plan */}
      <div className="overflow-hidden rounded-3xl bg-[#0D0D0D] text-white shadow-lg">
        <div className="h-px w-full bg-gradient-to-r from-[#C89B3C]/60 via-[#00C2A8] to-[#C89B3C]/60" />
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Plan Growth y Premium</p>
            <p className="mt-1 font-black text-white">Marketing digital local incluido</p>
            <p className="mt-1 text-sm text-white/60">
              Sin contratar agencias externas. Incluido en tu suscripción mensual.
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

      {/* Módulos de marketing */}
      <div>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Incluido en Growth</p>
          <h2 className="mt-0.5 text-lg font-black text-[#0D0D0D]">Módulos disponibles</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Globe,      plan: "Growth",   title: "Google Business optimizado",  text: "Configuramos tu perfil de Google para que aparezcas cuando busquen 'barbería en [tu ciudad]'. Fotos, horarios, reseñas." },
            { icon: Instagram,  plan: "Growth",   title: "Instagram optimizado",         text: "Bio con link de reserva, highlights, estética de perfil y primeros posts con tu identidad de marca." },
            { icon: FileImage,  plan: "Growth",   title: "8 posts al mes",               text: "Diseños con tu logo y colores para publicar cada semana. Sin que tengas que pensar en qué publicar." },
            { icon: Star,       plan: "Growth",   title: "Reporte mensual",              text: "Resumen de reservas, ingresos, clientes nuevos y rendimiento de marketing. En menos de 1 página." },
            { icon: Megaphone,  plan: "Premium",  title: "Campañas de anuncios locales", text: "Anuncios en Meta e Instagram segmentados a personas cerca de tu barbería. Presupuesto de anuncios aparte." },
            { icon: BarChart3,  plan: "Premium",  title: "Análisis avanzado",            text: "Qué canales traen más clientes, qué servicios funcionan mejor, cuándo llenar la agenda." },
          ].map(({ icon: Icon, plan, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C89B3C]/10">
                  <Icon size={18} className="text-[#C89B3C]" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  plan === "Growth"
                    ? "border border-[#00C2A8]/30 bg-[#00C2A8]/10 text-[#009e88]"
                    : "bg-[#0D0D0D] text-white"
                }`}>
                  {plan}
                </span>
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
          <span className="rounded-full border border-[#00C2A8]/30 bg-[#00C2A8]/10 px-3 py-1 text-xs font-semibold text-[#009e88]">
            Growth — 149 €/mes
          </span>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
            Premium — 299 €/mes
          </span>
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          El presupuesto de anuncios (Google Ads, Meta Ads) se factura aparte y lo decides tú.
        </p>
      </div>

    </div>
  );
}
