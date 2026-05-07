import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, MessageCircle, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function AutomatizacionesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        section="Servicio asistido"
        title="Acompañamiento y seguimiento"
        description="BarberiaOS se entrega como MVP asistido: primero dejamos reservas, agenda y clientes funcionando; despues activamos seguimientos de forma controlada segun tu plan."
        action={
          <Link
            href="/dashboard"
            className="btn-outline"
          >
            Volver al dashboard <ArrowRight size={14} />
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[#DDE7FB] bg-white shadow-sm">
        <div className="h-px w-full bg-gradient-to-r from-[#2F6FEB]/60 via-[#2F6FEB] to-[#2F6FEB]/60" />
        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2F6FEB]">
            Operacion real
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#111827]">
            Nada se activa sin revisarlo contigo
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Los mensajes, recuperacion de clientes y acciones comerciales se
            preparan como parte del servicio asistido. Asi evitamos enviar
            comunicaciones incorrectas y mantenemos el control de la experiencia
            del cliente.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: Bell,
            title: "Confirmaciones manuales",
            text: "Gestiona cada cita desde la agenda y usa el telefono del cliente para confirmar cuando lo necesites.",
          },
          {
            icon: MessageCircle,
            title: "WhatsApp asistido",
            text: "Preparamos mensajes y procesos contigo antes de activar cualquier comunicacion recurrente.",
          },
          {
            icon: RefreshCw,
            title: "Recuperacion controlada",
            text: "La deteccion de clientes inactivos se revisa primero de forma operativa para validar que aporta ventas.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F6FEB]/10">
              <Icon size={18} className="text-[#2F6FEB]" />
            </div>
            <h3 className="font-bold text-[#111827]">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#2F6FEB]" />
          <div>
            <p className="font-bold text-[#111827]">Incluido en el lanzamiento asistido</p>
            <p className="mt-1 text-sm leading-6 text-neutral-500">
              El objetivo inicial es que la barberia reciba reservas, ordene su
              agenda y controle clientes e ingresos. Las automatizaciones se
              incorporan despues de validar el flujo base con datos reales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
