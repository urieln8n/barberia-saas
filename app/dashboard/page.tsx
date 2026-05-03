import { StatCard } from "@/components/dashboard/StatCard";

const appointments = [
  { time: "10:00", client: "Carlos", service: "Corte + barba", barber: "Miguel" },
  { time: "11:30", client: "Juan", service: "Degradado", barber: "Andrés" },
  { time: "13:00", client: "Pedro", service: "Barba", barber: "Miguel" }
];

export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-neutral-500">Panel de control</p>
          <h1 className="text-4xl font-black">Dashboard</h1>
        </div>
        <a href="/r/demo-barber" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Ver página de reservas</a>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Citas de hoy" value="12" hint="3 pendientes por confirmar" />
        <StatCard title="Ingresos de hoy" value="340 €" hint="Pagos manuales registrados" />
        <StatCard title="Clientes nuevos" value="4" hint="Esta semana" />
        <StatCard title="Servicio top" value="Corte + barba" hint="Más reservado" />
      </div>

      <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="text-xl font-bold">Próximas citas</h2>
        <div className="mt-5 divide-y divide-neutral-100">
          {appointments.map((appointment) => (
            <div key={appointment.time} className="flex items-center justify-between py-4">
              <div>
                <p className="font-bold">{appointment.client}</p>
                <p className="text-sm text-neutral-500">{appointment.service} · {appointment.barber}</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold">{appointment.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
