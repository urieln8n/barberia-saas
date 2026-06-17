import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { Mail, Phone, StickyNote, UserPlus, Users, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ClientesClient } from "./ClientesClient";

export const revalidate = 60;

type Relation<T> = T | T[] | null | undefined;

type ClientRow = {
  id: string;
  name: string;
  phone: string | null;
  email?: string | null;
  notes?: string | null;
  created_at?: string | null;
  barbershop_id?: string | null;
};

type AppointmentRow = {
  id: string;
  appointment_date: string;
  start_time: string;
  status: string;
  client_id: string | null;
  service_id: string | null;
  barber_id: string | null;
  clients: ClientRow | ClientRow[] | null;
  services: { name: string; active?: boolean | null; price?: number | null } | { name: string; active?: boolean | null; price?: number | null }[] | null;
  barbers: { name: string; active?: boolean | null } | { name: string; active?: boolean | null }[] | null;
};

type ClientWithStats = ClientRow & {
  totalAppointments: number;
  totalRevenue: number;
  lastAppointmentDate: string | null;
  lastAppointmentTime: string | null;
  lastServiceName: string | null;
  lastServiceId: string | null;
  lastServiceActive: boolean;
  lastBarberName: string | null;
  lastBarberId: string | null;
  lastBarberActive: boolean;
  lastStatus: string | null;
};

function firstRelation<T>(value: Relation<T>): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function getLocalDateISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


async function getDataClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRoleKey) {
    return createServiceClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return createServerClient();
}

async function createClientAction(formData: FormData) {
  "use server";

  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);

  if (!barbershopId) {
    redirect("/onboarding");
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) {
    redirect("/dashboard/clientes");
  }

  const dataClient = await getDataClient();

  const existingClientQuery = dataClient
    .from("clients")
    .select("id")
    .eq("barbershop_id", barbershopId)
    .ilike("name", name);

  if (phone) {
    existingClientQuery.eq("phone", phone);
  }

  const { data: existingClient } = await existingClientQuery.maybeSingle();

  if (!existingClient) {
    await dataClient.from("clients").insert({
      barbershop_id: barbershopId,
      name,
      phone: phone || null,
      email: email || null,
      notes: notes || null,
    });
  }

  revalidatePath("/dashboard/clientes");
  redirect("/dashboard/clientes");
}

export default async function ClientesPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);

  if (!barbershopId) {
    redirect("/onboarding");
  }

  const dataClient = await getDataClient();
  const today = getLocalDateISO();

  const [clientsResult, appointmentsResult, barbershopResult] =
    await Promise.all([
      dataClient
        .from("clients")
        .select("id, name, phone, email, notes, created_at, barbershop_id")
        .eq("barbershop_id", barbershopId)
        .order("created_at", { ascending: false }),

      dataClient
        .from("appointments")
        .select(
          `
          id,
          appointment_date,
          start_time,
          status,
          client_id,
          service_id,
          barber_id,
          clients (
            id,
            name,
            phone,
            email,
            notes,
            created_at,
            barbershop_id
          ),
          services (
            name,
            active,
            price
          ),
          barbers (
            name,
            active
          )
        `
        )
        .eq("barbershop_id", barbershopId)
        .order("appointment_date", { ascending: false })
        .order("start_time", { ascending: false }),

      dataClient
        .from("barbershops")
        .select("id, name, slug")
        .eq("id", barbershopId)
        .maybeSingle(),
    ]);

  const directClients = (clientsResult.data as ClientRow[]) ?? [];
  const appointments = (appointmentsResult.data as AppointmentRow[]) ?? [];

  const clientsMap = new Map<string, ClientRow>();

  for (const client of directClients) {
    if (client.id) {
      clientsMap.set(client.id, client);
    }
  }

  for (const appointment of appointments) {
    const client = firstRelation(appointment.clients);

    if (client?.id && !clientsMap.has(client.id)) {
      clientsMap.set(client.id, client);
    }
  }

  const statsMap = new Map<
    string,
    {
      totalAppointments: number;
      totalRevenue: number;
      lastAppointmentDate: string | null;
      lastAppointmentTime: string | null;
      lastServiceName: string | null;
      lastServiceId: string | null;
      lastServiceActive: boolean;
      lastBarberName: string | null;
      lastBarberId: string | null;
      lastBarberActive: boolean;
      lastStatus: string | null;
    }
  >();

  for (const appointment of appointments) {
    const client = firstRelation(appointment.clients);
    const service = firstRelation(appointment.services);
    const barber = firstRelation(appointment.barbers);

    const clientId = appointment.client_id ?? client?.id;

    if (!clientId) continue;

    const current = statsMap.get(clientId);

    const servicePrice = firstRelation(appointment.services)?.price ?? 0;

    if (!current) {
      statsMap.set(clientId, {
        totalAppointments: 1,
        totalRevenue: ["completed"].includes(appointment.status) ? Number(servicePrice) : 0,
        lastAppointmentDate: appointment.appointment_date,
        lastAppointmentTime: appointment.start_time,
        lastServiceName: service?.name ?? null,
        lastServiceId: appointment.service_id ?? null,
        lastServiceActive: service?.active !== false,
        lastBarberName: barber?.name ?? null,
        lastBarberId: appointment.barber_id ?? null,
        lastBarberActive: barber?.active !== false,
        lastStatus: appointment.status ?? null,
      });
    } else {
      current.totalAppointments += 1;
      if (["completed"].includes(appointment.status)) {
        current.totalRevenue += Number(servicePrice);
      }
    }
  }

  const clients: ClientWithStats[] = Array.from(clientsMap.values())
    .map((client) => {
      const stats = statsMap.get(client.id);

      return {
        ...client,
        totalAppointments: stats?.totalAppointments ?? 0,
        totalRevenue: stats?.totalRevenue ?? 0,
        lastAppointmentDate: stats?.lastAppointmentDate ?? null,
        lastAppointmentTime: stats?.lastAppointmentTime ?? null,
        lastServiceName: stats?.lastServiceName ?? null,
        lastServiceId: stats?.lastServiceId ?? null,
        lastServiceActive: stats?.lastServiceActive ?? false,
        lastBarberName: stats?.lastBarberName ?? null,
        lastBarberId: stats?.lastBarberId ?? null,
        lastBarberActive: stats?.lastBarberActive ?? false,
        lastStatus: stats?.lastStatus ?? null,
      };
    })
    .sort((a, b) => {
      const dateA = a.lastAppointmentDate ?? a.created_at ?? "";
      const dateB = b.lastAppointmentDate ?? b.created_at ?? "";
      return dateB.localeCompare(dateA);
    });

  const clientsWithPhone = clients.filter((client) => client.phone).length;

  const newClientsThisMonth = clients.filter((client) => {
    if (!client.created_at) return false;
    return client.created_at.slice(0, 7) === today.slice(0, 7);
  }).length;

  const recurringClients = clients.filter(
    (client) => client.totalAppointments > 1
  ).length;
  const lostClients = clients.filter((client) => {
    if (!client.lastAppointmentDate) return false;
    const days = Math.floor(
      (Date.now() - new Date(`${client.lastAppointmentDate}T00:00:00`).getTime()) / 86400000
    );
    return days >= 45;
  }).length;
  const vipClients = clients.filter((client) => client.totalAppointments >= 8).length;
  const withoutNextAppointment = clients.filter((client) => {
    const hasFuture = appointments.some(
      (appointment) =>
        (appointment.client_id ?? firstRelation(appointment.clients)?.id) === client.id &&
        appointment.appointment_date >= today &&
        !["cancelled", "completed", "no_show"].includes(appointment.status ?? "")
    );
    return !hasFuture;
  }).length;
  const errorMessage =
    clientsResult.error?.message ??
    appointmentsResult.error?.message ??
    barbershopResult.error?.message ??
    null;

  return (
    <div className="space-y-8">
      <PageHeader
        section="Clientes"
        title={`CRM de ${barbershopResult.data?.name ?? "tu barbería"}`}
        description="Segmenta nuevos, frecuentes, perdidos y VIP. Acciones rápidas para reservar, pedir reseñas y abrir WhatsApp."
        action={
          <a href="/dashboard/agenda" className="btn-primary">
            Crear reserva
          </a>
        }
      />

      {errorMessage && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-400">
          Error leyendo clientes: {errorMessage}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total clientes" value={clients.length} description="En tu base de datos" icon={Users} />
        <StatCard label="Con teléfono" value={clientsWithPhone} description="Puedes contactarlos" icon={Phone} />
        <StatCard label="Nuevos este mes" value={newClientsThisMonth} description="Registrados este mes" icon={UserPlus} iconBg="bg-emerald-50" iconColor="text-emerald-700" />
        <StatCard label="Frecuentes" value={recurringClients} description="Más de una visita" icon={TrendingUp} iconBg="bg-amber-50" iconColor="text-amber-700" />
      </section>

      <section
        className="rounded-2xl border border-white/[0.10] bg-[#0E0E1C] p-5"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)" }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label-section">Filtros CRM</p>
            <h2 className="section-heading mt-1">Segmentos listos para actuar</h2>
            <p className="section-subtext">Usa estos segmentos como lectura operativa. La persistencia avanzada de etiquetas queda preparada para una siguiente iteracion.</p>
          </div>
          <Link href="/dashboard/marketing" className="btn-outline">
            Crear promoción
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            ["Todos", clients.length],
            ["Nuevos", newClientsThisMonth],
            ["Frecuentes", recurringClients],
            ["Perdidos", lostClients],
            ["Reactivados", 0],
            ["VIP", vipClients],
            ["Sin próxima cita", withoutNextAppointment],
          ].map(([label, value]) => (
            <span key={String(label)} className="rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-xs font-black text-white/70">
              {label} · {value}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div id="crear-cliente" className="panel overflow-hidden p-0">
          <div className="border-b border-white/[0.07] bg-[linear-gradient(180deg,rgba(109,40,217,0.08),transparent)] px-5 py-5 md:px-6">
            <p className="label-section">Clientes</p>
            <h2 className="mt-2 text-xl font-black text-white/90">
              Crear cliente manual
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/50">
              Añade clientes que todavía no han reservado online con una ficha
              limpia y lista para usar en agenda.
            </p>
          </div>

          <form action={createClientAction} className="space-y-5 px-5 py-5 md:px-6">
            <div>
              <label className="form-label">
                Nombre *
              </label>
              <input
                name="name"
                required
                placeholder="Ej: Carlos Pérez"
                className="input py-3"
              />
            </div>

            <div className="form-grid">
              <div>
                <label className="form-label flex items-center gap-1.5">
                  <Phone size={13} /> Teléfono
                </label>
                <input
                  name="phone"
                  placeholder="Ej: 600123123"
                  className="input py-3"
                />
              </div>

              <div>
                <label className="form-label flex items-center gap-1.5">
                  <Mail size={13} /> Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="cliente@email.com"
                  className="input py-3"
                />
              </div>
            </div>

            <div>
              <label className="form-label flex items-center gap-1.5">
                <StickyNote size={13} /> Notas
              </label>
              <textarea
                name="notes"
                rows={4}
                placeholder="Ej: Le gusta degradado bajo y barba marcada."
                className="input resize-none py-3"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row">
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Guardar cliente
              </button>
            </div>
          </form>
        </div>

        <div className="min-w-0">
          <ClientesClient clients={clients} barbershopId={barbershopId} />
        </div>
      </section>
    </div>
  );
}
