import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { AlertTriangle, Crown, Mail, Phone, StickyNote, UserPlus, Users, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
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

  const totalCrmRevenue = clients.reduce((sum, c) => sum + c.totalRevenue, 0);
  const clientsWithRevenue = clients.filter((c) => c.totalRevenue > 0);
  const avgTicket = clientsWithRevenue.length > 0
    ? Math.round(totalCrmRevenue / clientsWithRevenue.length)
    : 0;
  const retentionRate = clients.length > 0
    ? Math.round((recurringClients / clients.length) * 100)
    : 0;
  const activeClientsCount = clients.filter((c) => {
    if (!c.lastAppointmentDate) return true;
    const d = Math.floor((Date.now() - new Date(`${c.lastAppointmentDate}T00:00:00`).getTime()) / 86400000);
    return d <= 45;
  }).length;
  const activeRate = clients.length > 0
    ? Math.round((activeClientsCount / clients.length) * 100)
    : 0;

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
        <StatCard label="Frecuentes" value={recurringClients} description="Más de una visita" icon={TrendingUp} iconBg="bg-[#D4AF37]/10" iconColor="text-[#D4AF37]" />
        <StatCard label="Nuevos este mes" value={newClientsThisMonth} description="Registrados este mes" icon={UserPlus} iconBg="bg-emerald-500/[0.10]" iconColor="text-emerald-400" />
        <StatCard label="Clientes VIP" value={vipClients} description="Top 20% por visitas" icon={Crown} iconBg="bg-[#D4AF37]/10" iconColor="text-[#D4AF37]" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E1C]">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-r border-white/[0.06] px-5 py-4 lg:border-b-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Retención</p>
            <p className="mt-2 text-3xl font-black tabular-nums text-white">{retentionRate}<span className="text-lg text-white/40">%</span></p>
            <p className="mt-1 text-xs text-white/40">clientes que repiten</p>
          </div>
          <div className="border-b border-white/[0.06] px-5 py-4 lg:border-b-0 lg:border-r">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Revenue CRM</p>
            <p className="mt-2 text-3xl font-black tabular-nums text-[#D4AF37]">€{totalCrmRevenue}</p>
            <p className="mt-1 text-xs text-white/40">generado en total</p>
          </div>
          <div className="border-r border-white/[0.06] px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Ticket medio</p>
            <p className="mt-2 text-3xl font-black tabular-nums text-white">€{avgTicket}</p>
            <p className="mt-1 text-xs text-white/40">por cliente con visitas</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Base activa</p>
            <p className="mt-2 text-3xl font-black tabular-nums text-emerald-400">{activeRate}<span className="text-lg text-emerald-400/50">%</span></p>
            <p className="mt-1 text-xs text-white/40">sin riesgo ni pérdida</p>
          </div>
        </div>
      </section>

      {lostClients > 0 && (
        <section className="flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-5 py-4 sm:flex-row sm:items-center">
          <AlertTriangle size={16} className="shrink-0 text-amber-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-amber-300">
              {lostClients} clientes perdidos · actívalos con una campaña
            </p>
            <p className="mt-0.5 text-xs text-amber-400/60">Sin visita en más de 45 días</p>
          </div>
          <Link href="/dashboard/marketing" className="shrink-0 rounded-xl border border-amber-500/25 bg-amber-500/[0.10] px-4 py-2 text-xs font-black text-amber-300 hover:bg-amber-500/20 transition">
            Crear campaña →
          </Link>
        </section>
      )}

      <section className="space-y-4">
        {/* Formulario colapsable */}
        <CollapsibleSection
          title="Añadir cliente manual"
          icon={UserPlus}
          badge="Manual"
          badgeCls="border-white/[0.10] bg-white/[0.06] text-white/40"
          defaultOpen={false}
        >
          <form action={createClientAction} className="grid gap-4 sm:grid-cols-2 px-5 pb-5">
            <div className="sm:col-span-2">
              <label className="form-label">Nombre *</label>
              <input name="name" required placeholder="Ej: Carlos Pérez" className="input py-3" />
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5"><Phone size={13} /> Teléfono</label>
              <input name="phone" placeholder="600123123" className="input py-3" />
            </div>
            <div>
              <label className="form-label flex items-center gap-1.5"><Mail size={13} /> Email</label>
              <input name="email" type="email" placeholder="cliente@email.com" className="input py-3" />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label flex items-center gap-1.5"><StickyNote size={13} /> Notas</label>
              <textarea name="notes" rows={2} placeholder="Ej: Le gusta degradado bajo." className="input resize-none py-3" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary w-full sm:w-auto">Guardar cliente</button>
            </div>
          </form>
        </CollapsibleSection>

        {/* Lista de clientes */}
        <ClientesClient clients={clients} barbershopId={barbershopId} />
      </section>
    </div>
  );
}
