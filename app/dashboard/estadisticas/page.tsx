import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarClock, Scissors, TrendingUp, Users, XCircle } from "lucide-react";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatCard } from "@/components/ui/StatCard";

export const dynamic = "force-dynamic";

type Relation<T> = T | T[] | null | undefined;

type AppointmentRow = {
  id: string;
  status: string | null;
  barber_id: string | null;
  service_id: string | null;
  barbers?: Relation<{ id: string; name: string | null }>;
  services?: Relation<{ id: string; name: string | null; price: number | null }>;
};

type BarberRow = {
  id: string;
  name: string;
};

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function getMadridDateISO() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function EstadisticasPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const today = getMadridDateISO();

  const [barbersResult, appointmentsResult] = await Promise.all([
    supabase
      .from("barbers")
      .select("id, name")
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .order("name", { ascending: true }),
    supabase
      .from("appointments")
      .select(
        `
        id,
        status,
        barber_id,
        service_id,
        barbers (id, name),
        services (id, name, price)
      `,
      )
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today),
  ]);

  const barbers = ((barbersResult.data as BarberRow[] | null) ?? []).map((barber) => ({
    id: barber.id,
    name: barber.name,
  }));
  const appointments = ((appointmentsResult.data as AppointmentRow[] | null) ?? []).map((appointment) => ({
    id: appointment.id,
    status: appointment.status ?? "scheduled",
    barberId: appointment.barber_id,
    serviceId: appointment.service_id,
    barber: firstRelation(appointment.barbers),
    service: firstRelation(appointment.services),
  }));

  const activeAppointments = appointments.filter((appointment) =>
    ["pending", "scheduled", "confirmed"].includes(appointment.status),
  );
  const completedAppointments = appointments.filter((appointment) => appointment.status === "completed");
  const cancelledAppointments = appointments.filter((appointment) =>
    ["cancelled", "no_show"].includes(appointment.status),
  );
  const revenueBase = appointments.filter((appointment) =>
    !["cancelled", "no_show"].includes(appointment.status),
  );
  const estimatedRevenue = revenueBase.reduce(
    (sum, appointment) => sum + Number(appointment.service?.price ?? 0),
    0,
  );
  const averageTicket =
    revenueBase.length > 0 ? Math.round(estimatedRevenue / revenueBase.length) : 0;
  const cancellationRate =
    appointments.length > 0 ? Math.round((cancelledAppointments.length / appointments.length) * 100) : 0;

  const barberStats = barbers.map((barber) => {
    const barberAppointments = appointments.filter((appointment) => appointment.barberId === barber.id);
    const activeCount = barberAppointments.filter((appointment) =>
      ["pending", "scheduled", "confirmed"].includes(appointment.status),
    ).length;
    const completedCount = barberAppointments.filter((appointment) => appointment.status === "completed").length;
    const revenue = barberAppointments
      .filter((appointment) => !["cancelled", "no_show"].includes(appointment.status))
      .reduce((sum, appointment) => sum + Number(appointment.service?.price ?? 0), 0);

    return {
      barber,
      total: barberAppointments.length,
      activeCount,
      completedCount,
      revenue,
    };
  });

  const serviceCounts = appointments.reduce(
    (acc, appointment) => {
      if (!appointment.serviceId || ["cancelled", "no_show"].includes(appointment.status)) return acc;
      const key = appointment.serviceId;
      const current = acc.get(key) ?? {
        name: appointment.service?.name ?? "Servicio sin nombre",
        count: 0,
        revenue: 0,
      };
      current.count += 1;
      current.revenue += Number(appointment.service?.price ?? 0);
      acc.set(key, current);
      return acc;
    },
    new Map<string, { name: string; count: number; revenue: number }>(),
  );
  const topServices = Array.from(serviceCounts.values())
    .sort((a, b) => b.count - a.count || b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      <PageHeader
        section="Estadisticas"
        title="Rendimiento del negocio"
        description="Analiza reservas, ingresos y rendimiento del equipo. Para actuar sobre huecos de hoy, usa la pantalla operativa de Huecos libres."
        action={
          <Link href="/dashboard/huecos" className="btn-outline">
            Ver Huecos libres
            <ArrowRight size={15} />
          </Link>
        }
      />

      {(barbersResult.error || appointmentsResult.error) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
          No se pudieron cargar todas las estadisticas. Revisa la conexion o permisos de lectura.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Reservas activas hoy"
          value={activeAppointments.length}
          description="Pendientes, programadas y confirmadas"
          icon={CalendarClock}
        />
        <StatCard
          label="Ingresos estimados"
          value={formatMoney(estimatedRevenue)}
          description="Reservas no canceladas de hoy"
          icon={TrendingUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <StatCard
          label="Ticket medio"
          value={formatMoney(averageTicket)}
          description="Sobre reservas con precio"
          icon={Scissors}
          iconBg="bg-[#D5A84C]/10"
          iconColor="text-[#8A641F]"
        />
        <StatCard
          label="Cancelacion / no-show"
          value={`${cancellationRate}%`}
          description={`${cancelledAppointments.length} incidencias hoy`}
          icon={XCircle}
          iconBg="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Rendimiento por barbero"
          description="Vista analitica del dia. No muestra huecos operativos ni acciones de ultima hora."
        >
          {barberStats.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No hay barberos activos"
              description="Activa barberos para analizar rendimiento por equipo."
            />
          ) : (
            <div className="grid gap-3">
              {barberStats.map((item) => (
                <article key={item.barber.id} className="panel-compact">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="font-black text-[#080A0F]">{item.barber.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.total} reservas · {item.completedCount} completadas · {item.activeCount} activas
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                      <p className="text-[10px] font-black uppercase text-slate-500">Ingresos estimados</p>
                      <p className="mt-1 text-lg font-black text-[#080A0F]">{formatMoney(item.revenue)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Servicios mas vendidos"
          description="Ranking del dia para entender demanda y ticket."
        >
          {topServices.length === 0 ? (
            <EmptyState
              icon={Scissors}
              title="Sin servicios vendidos hoy"
              description="Cuando haya reservas con servicio, apareceran aqui."
            />
          ) : (
            <div className="grid gap-3">
              {topServices.map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-xs font-black uppercase text-[#C9922A]">#{index + 1}</p>
                    <p className="font-black text-slate-950">{service.name}</p>
                    <p className="text-sm text-slate-500">{service.count} reservas</p>
                  </div>
                  <p className="font-black text-slate-950">{formatMoney(service.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Separacion de funciones"
        description="Estadisticas analiza el negocio. Huecos libres sirve para actuar en segundos."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-black text-slate-950">Analisis</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Usa esta pagina para revisar rendimiento, ingresos y patrones.
            </p>
          </div>
          <div className="rounded-2xl border border-[#D5A84C]/25 bg-[#D5A84C]/10 p-4">
            <p className="font-black text-slate-950">Accion inmediata</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Usa Huecos libres para crear reservas, copiar mensajes y llenar agenda hoy.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-black text-slate-950">Agenda</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Usa Agenda para gestionar citas, estados y calendario operativo.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
