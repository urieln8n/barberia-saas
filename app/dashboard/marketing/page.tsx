import Link from "next/link";
import { Megaphone, Instagram, Globe, Star, BarChart3, FileImage, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function MarketingPage() {
  return (
    <div className="space-y-5">

      <PageHeader
        section="Marketing"
        title="Marketing asistido"
        description="Acciones comerciales que se preparan contigo cuando el flujo de reservas ya esta funcionando."
        action={
          <span className="rounded-full border border-[#2F6FEB]/30 bg-[#2F6FEB]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#2459bd]">
            Servicio gestionado
          </span>
        }
      />

      {/* Banner plan */}
      <div className="overflow-hidden rounded-2xl border border-[#DDE7FB] bg-white shadow-sm">
        <div className="h-px w-full bg-gradient-to-r from-[#2F6FEB]/60 via-[#2F6FEB] to-[#2F6FEB]/60" />
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">Plan Pro y Premium</p>
            <p className="mt-1 font-black text-[#111827]">Marketing local con acompanamiento</p>
            <p className="mt-1 text-sm text-slate-500">
              Primero validamos reservas, agenda y clientes. Despues priorizamos las acciones que pueden traer citas.
            </p>
          </div>
          <Link
            href="/#precios"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#2F6FEB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#2459bd]"
          >
            Ver planes <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Módulos de marketing */}
      <div>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">Servicio asistido</p>
          <h2 className="mt-0.5 text-lg font-black text-[#111827]">Acciones recomendadas</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Globe,      plan: "Asistido", title: "Google Business",              text: "Revisamos que tu perfil tenga telefono, horario, direccion y enlace de reservas correcto." },
            { icon: Instagram,  plan: "Asistido", title: "Instagram con reservas",       text: "Preparamos la bio y el enlace para que los seguidores puedan reservar sin escribir por privado." },
            { icon: FileImage,  plan: "Asistido", title: "Material basico",              text: "Creamos piezas simples para comunicar el QR o link de reservas en el local y redes." },
            { icon: Star,       plan: "Asistido", title: "Seguimiento mensual",          text: "Revisamos citas, clientes nuevos e ingresos para decidir que accion comercial hacer despues." },
            { icon: Megaphone,  plan: "Gestionado", title: "Campanas locales",           text: "Si el flujo base esta validado, se pueden preparar campanas locales con presupuesto aparte." },
            { icon: BarChart3,  plan: "Gestionado", title: "Analisis de crecimiento",    text: "Usamos los datos de reservas y pagos para detectar oportunidades de agenda y servicios." },
          ].map(({ icon: Icon, plan, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6FEB]/10">
                  <Icon size={18} className="text-[#2F6FEB]" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  plan === "Asistido"
                    ? "border border-[#2F6FEB]/30 bg-[#2F6FEB]/10 text-[#2459bd]"
                    : "border border-slate-200 bg-slate-100 text-slate-700"
                }`}>
                  {plan}
                </span>
              </div>
              <h3 className="font-bold text-[#111827]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Servicio */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">MVP asistido</p>
        <p className="mt-1 text-sm font-bold text-neutral-700">Se activa segun necesidad</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#2F6FEB]/30 bg-[#2F6FEB]/10 px-3 py-1 text-xs font-semibold text-[#2459bd]">
            Configuracion inicial
          </span>
          <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
            Gestion mensual opcional
          </span>
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          Las acciones de marketing no se activan solas: se preparan y validan contigo para no prometer resultados sin datos.
        </p>
      </div>

    </div>
  );
}
