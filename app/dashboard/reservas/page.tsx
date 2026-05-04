import { CalendarCheck, Clock, Bell, Users, Smartphone, CheckCircle2 } from "lucide-react";

export default function ReservasPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-1">
        <p className="text-sm text-neutral-500">Panel de control</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-black">Reservas</h1>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-500">
            Starter · En desarrollo
          </span>
        </div>
        <p className="mt-1 max-w-xl text-neutral-500">
          Vista centralizada de todas las reservas recibidas desde cualquier canal: QR, link público, Instagram o WhatsApp.
        </p>
      </div>

      {/* Vista previa del módulo */}
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
          <CalendarCheck size={28} className="text-neutral-400" />
        </div>
        <h2 className="text-xl font-black text-neutral-800">Módulo en desarrollo</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
          Aquí verás todas las reservas recibidas, su origen, estado y podrás gestionarlas desde un solo lugar.
        </p>
        <p className="mt-4 text-xs font-semibold text-neutral-400">
          Mientras tanto, gestiona tus citas desde{" "}
          <a href="/dashboard/agenda" className="text-red-600 underline underline-offset-2">
            Agenda
          </a>
        </p>
      </div>

      {/* Funcionalidades previstas */}
      <div>
        <h2 className="mb-4 text-lg font-black text-neutral-800">Qué incluirá este módulo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: CalendarCheck, title: "Todas las reservas en un lugar",    text: "Sin importar si vinieron por QR, link, Instagram o WhatsApp." },
            { icon: Clock,         title: "Historial por fecha y estado",       text: "Filtra por día, semana, mes o estado: pendiente, confirmada, completada." },
            { icon: Bell,          title: "Confirmación por email automática",  text: "El cliente recibe su confirmación al instante, sin que hagas nada." },
            { icon: Users,         title: "Origen de cada reserva",             text: "Sabe si la cita vino de tu QR del local, Instagram o link directo." },
            { icon: Smartphone,    title: "Gestión desde el móvil",             text: "Confirma, cancela o reprograma citas desde cualquier dispositivo." },
            { icon: CheckCircle2,  title: "Anti doble reserva",                 text: "Las horas ya ocupadas se bloquean automáticamente. Ya funciona." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
                <Icon size={18} className="text-neutral-600" />
              </div>
              <h3 className="font-bold text-neutral-900">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral-500">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plan */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="text-sm font-bold text-neutral-700">Incluido en el plan</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Starter — 49 €/mes", "Growth — 149 €/mes", "Premium — 299 €/mes"].map((plan) => (
            <span key={plan} className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
              {plan}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
