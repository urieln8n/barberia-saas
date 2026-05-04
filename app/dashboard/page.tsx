import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("slug")
    .eq("id", barbershopId)
    .single();

  const today = new Date().toISOString().split("T")[0];

  // Lunes de la semana actual
  const now = new Date();
  const daysToMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToMonday);
  const startOfWeek = monday.toISOString().split("T")[0];

  // Hace 30 días para servicio top
  const monthAgo = new Date(now);
  monthAgo.setDate(now.getDate() - 30);
  const monthAgoStr = monthAgo.toISOString().split("T")[0];

  const [
    { data: todayAppts },
    { data: todayPayments },
    { data: newClients },
    { data: recentAppts },
    { data: upcoming },
  ] = await Promise.all([
    // Citas de hoy (sin canceladas)
    supabase
      .from("appointments")
      .select("id, status")
      .eq("barbershop_id", barbershopId)
      .eq("appointment_date", today)
      .not("status", "in", '("cancelled","no_show")'),

    // Ingresos de hoy
    supabase
      .from("payments")
      .select("amount")
      .eq("barbershop_id", barbershopId)
      .eq("status", "paid")
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),

    // Clientes nuevos esta semana
    supabase
      .from("clients")
      .select("id")
      .eq("barbershop_id", barbershopId)
      .gte("created_at", `${startOfWeek}T00:00:00`),

    // Citas últimos 30 días para calcular servicio top
    supabase
      .from("appointments")
      .select("services(name)")
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", monthAgoStr)
      .not("status", "in", '("cancelled","no_show")'),

    // Próximas 5 citas desde hoy
    supabase
      .from("appointments")
      .select("id, appointment_date, start_time, clients(name), services(name), barbers(name)")
      .eq("barbershop_id", barbershopId)
      .gte("appointment_date", today)
      .not("status", "in", '("cancelled","no_show")')
      .order("appointment_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(5),
  ]);

  // Métricas calculadas
  const citasHoy = todayAppts?.length ?? 0;
  const pendientes = todayAppts?.filter((a) => a.status === "scheduled").length ?? 0;

  const ingresosHoy = todayPayments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

  const clientesNuevos = newClients?.length ?? 0;

  // Servicio más reservado: contar en JS
  let servicioTop = "Sin datos";
  if (recentAppts && recentAppts.length > 0) {
    const counts: Record<string, number> = {};
    for (const a of recentAppts) {
      const name = (a as any).services?.name as string | undefined;
      if (name) counts[name] = (counts[name] ?? 0) + 1;
    }
    const top = Object.entries(counts).sort((x, y) => y[1] - x[1])[0];
    if (top) servicioTop = top[0];
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-neutral-500">Panel de control</p>
          <h1 className="text-4xl font-black">Dashboard</h1>
        </div>
        {barbershop?.slug && (
          <a
            href={`/r/${barbershop.slug}`}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            Ver página de reservas
          </a>
        )}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Citas de hoy"
          value={String(citasHoy)}
          hint={pendientes > 0 ? `${pendientes} pendiente${pendientes !== 1 ? "s" : ""} por confirmar` : "Al día"}
        />
        <StatCard
          title="Ingresos de hoy"
          value={`${ingresosHoy.toFixed(0)} €`}
          hint="Pagos manuales registrados"
        />
        <StatCard
          title="Clientes nuevos"
          value={String(clientesNuevos)}
          hint="Esta semana"
        />
        <StatCard
          title="Servicio top"
          value={servicioTop}
          hint="Más reservado (30 días)"
        />
      </div>

      <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="text-xl font-bold">Próximas citas</h2>
        {!upcoming || upcoming.length === 0 ? (
          <p className="mt-5 text-sm text-neutral-400">No hay citas próximas.</p>
        ) : (
          <div className="mt-5 divide-y divide-neutral-100">
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-bold">{(a as any).clients?.name ?? "—"}</p>
                  <p className="text-sm text-neutral-500">
                    {(a as any).services?.name ?? "—"}
                    {(a as any).barbers?.name ? ` · ${(a as any).barbers.name}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold">
                    {a.start_time.slice(0, 5)}
                  </span>
                  <p className="mt-1 text-xs text-neutral-400">{a.appointment_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
