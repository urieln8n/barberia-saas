import Link from "next/link";
import { CalendarCheck, Clock, Bell, Users, Smartphone, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function ReservasPage() {
  return (
    <div className="space-y-5">

      <PageHeader
        section="Reservas"
        title="Gestión de reservas"
        description="Vista centralizada de todas las reservas recibidas desde cualquier canal: QR, link público, Instagram o WhatsApp."
        action={
          <span className="rounded-full border border-[#E5E2D9] bg-[#F5F2EA] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500">
            En desarrollo
          </span>
        }
      />

      {/* Módulo en desarrollo */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E5E2D9] bg-[#F5F2EA]/60 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C89B3C]/10">
          <CalendarCheck size={26} className="text-[#C89B3C]" />
        </div>
        <p className="mt-4 font-semibold text-neutral-600">Módulo en desarrollo</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
          Aquí verás todas las reservas recibidas, su origen, estado y podrás gestionarlas desde un solo lugar.
        </p>
        <p className="mt-4 text-xs font-semibold text-neutral-400">
          Mientras tanto, gestiona tus citas desde{" "}
          <Link href="/dashboard/agenda" className="font-bold text-[#0D0D0D] underline underline-offset-2">
            Agenda
          </Link>
        </p>
      </div>

      {/* Funcionalidades previstas */}
      <div>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Próximamente</p>
          <h2 className="mt-0.5 text-lg font-black text-[#0D0D0D]">Qué incluirá este módulo</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: CalendarCheck, title: "Todas las reservas en un lugar",   text: "Sin importar si vinieron por QR, link, Instagram o WhatsApp." },
            { icon: Clock,         title: "Historial por fecha y estado",      text: "Filtra por día, semana, mes o estado: pendiente, confirmada, completada." },
            { icon: Bell,          title: "Confirmación por email automática", text: "El cliente recibe su confirmación al instante, sin que hagas nada." },
            { icon: Users,         title: "Origen de cada reserva",            text: "Sabe si la cita vino de tu QR del local, Instagram o link directo." },
            { icon: Smartphone,    title: "Gestión desde el móvil",            text: "Confirma, cancela o reprograma citas desde cualquier dispositivo." },
            { icon: CheckCircle2,  title: "Anti doble reserva",                text: "Las horas ya ocupadas se bloquean automáticamente. Ya funciona." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C89B3C]/10">
                <Icon size={18} className="text-[#C89B3C]" />
              </div>
              <h3 className="font-bold text-[#0D0D0D]">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plan */}
      <div className="rounded-2xl border border-[#E5E2D9] bg-[#F5F2EA] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Planes</p>
        <p className="mt-1 text-sm font-bold text-neutral-700">Incluido en el plan</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Starter — 49 €/mes", "Growth — 149 €/mes", "Premium — 299 €/mes"].map((plan) => (
            <span
              key={plan}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700"
            >
              {plan}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
