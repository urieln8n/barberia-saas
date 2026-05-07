import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { Mail, Phone, StickyNote } from "lucide-react";

export const dynamic = "force-dynamic";

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
  clients: ClientRow | ClientRow[] | null;
  services: { name: string } | { name: string }[] | null;
  barbers: { name: string } | { name: string }[] | null;
};

type ClientWithStats = ClientRow & {
  totalAppointments: number;
  lastAppointmentDate: string | null;
  lastAppointmentTime: string | null;
  lastServiceName: string | null;
  lastBarberName: string | null;
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

function formatDate(date?: string | null) {
  if (!date) return "Sin visitas";
  return new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time?: string | null) {
  if (!time) return "";
  return time.slice(0, 5);
}

function statusLabel(status?: string | null) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    scheduled: "Programada",
    confirmed: "Confirmada",
    completed: "Completada",
    cancelled: "Cancelada",
    no_show: "No apareció",
  };

  return status ? labels[status] ?? status : "Sin estado";
}

function statusBadgeClass(status?: string | null): string {
  const classes: Record<string, string> = {
    pending:   "bg-amber-50 text-amber-700 border-amber-100",
    scheduled: "bg-amber-50 text-amber-700 border-amber-100",
    confirmed: "bg-blue-50  text-blue-700  border-blue-100",
    completed: "bg-green-50 text-green-700 border-green-100",
    cancelled: "bg-red-50   text-red-700   border-red-100",
    no_show:   "bg-red-50   text-red-700   border-red-100",
  };
  return classes[status ?? ""] ?? "bg-neutral-100 text-neutral-600 border-neutral-200";
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
            name
          ),
          barbers (
            name
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
      lastAppointmentDate: string | null;
      lastAppointmentTime: string | null;
      lastServiceName: string | null;
      lastBarberName: string | null;
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

    if (!current) {
      statsMap.set(clientId, {
        totalAppointments: 1,
        lastAppointmentDate: appointment.appointment_date,
        lastAppointmentTime: appointment.start_time,
        lastServiceName: service?.name ?? null,
        lastBarberName: barber?.name ?? null,
        lastStatus: appointment.status ?? null,
      });
    } else {
      current.totalAppointments += 1;
    }
  }

  const clients: ClientWithStats[] = Array.from(clientsMap.values())
    .map((client) => {
      const stats = statsMap.get(client.id);

      return {
        ...client,
        totalAppointments: stats?.totalAppointments ?? 0,
        lastAppointmentDate: stats?.lastAppointmentDate ?? null,
        lastAppointmentTime: stats?.lastAppointmentTime ?? null,
        lastServiceName: stats?.lastServiceName ?? null,
        lastBarberName: stats?.lastBarberName ?? null,
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

  const errorMessage =
    clientsResult.error?.message ??
    appointmentsResult.error?.message ??
    barbershopResult.error?.message ??
    null;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[#DDE7FB] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label-section">
              Clientes
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#111827] md:text-4xl">
              Clientes de {barbershopResult.data?.name ?? "tu barbería"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Aquí aparecen los clientes creados manualmente y también los que
              llegan desde reservas públicas.
            </p>
          </div>

          <a
            href="/dashboard/agenda"
            className="btn-primary"
          >
            Ver agenda
          </a>
        </div>
      </section>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error leyendo clientes: {errorMessage}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Total clientes</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">
            {clients.length}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Con teléfono</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">
            {clientsWithPhone}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Nuevos este mes</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">
            {newClientsThisMonth}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Recurrentes</p>
          <p className="mt-2 text-3xl font-black text-neutral-950">
            {recurringClients}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.6fr]">
        <div className="panel overflow-hidden p-0">
          <div className="border-b border-[#E5E7EB] bg-[linear-gradient(180deg,rgba(47,111,235,0.06),rgba(255,255,255,0))] px-5 py-5 md:px-6">
            <p className="label-section">Clientes</p>
            <h2 className="mt-2 text-xl font-black text-[#111827]">
              Crear cliente manual
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-neutral-500">
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

            <div className="flex flex-col gap-3 border-t border-[#E5E7EB] pt-5 sm:flex-row">
              <button
                type="submit"
                className="btn-primary flex-1"
              >
                Guardar cliente
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-neutral-950">
                Lista de clientes
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Clientes reales vinculados a reservas y citas.
              </p>
            </div>
          </div>

          {clients.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <p className="font-semibold text-neutral-700">
                Todavía no hay clientes
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                Cuando alguien reserve desde el QR o link público, aparecerá
                aquí.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 hidden overflow-hidden rounded-2xl border border-neutral-200 md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
                    <tr>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Teléfono</th>
                      <th className="px-4 py-3">Última visita</th>
                      <th className="px-4 py-3">Servicio</th>
                      <th className="px-4 py-3">Citas</th>
                      <th className="px-4 py-3">Estado</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-100">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-4">
                          <p className="font-bold text-neutral-950">
                            {client.name}
                          </p>
                          {client.email && (
                            <p className="text-xs text-neutral-400">
                              {client.email}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-neutral-600">
                          {client.phone || "Sin teléfono"}
                        </td>

                        <td className="px-4 py-4 text-neutral-600">
                          <p>{formatDate(client.lastAppointmentDate)}</p>
                          {client.lastAppointmentTime && (
                            <p className="text-xs text-neutral-400">
                              {formatTime(client.lastAppointmentTime)}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-neutral-600">
                          {client.lastServiceName || "Sin servicio"}
                        </td>

                        <td className="px-4 py-4 font-semibold text-neutral-950">
                          {client.totalAppointments}
                        </td>

                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(client.lastStatus)}`}>
                            {statusLabel(client.lastStatus)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid gap-3 md:hidden">
                {clients.map((client) => (
                  <article
                    key={client.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-neutral-950">
                          {client.name}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {client.phone || "Sin teléfono"}
                        </p>
                      </div>

                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
                        {client.totalAppointments} citas
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-neutral-600">
                      <p>
                        <span className="font-semibold text-neutral-950">
                          Última visita:
                        </span>{" "}
                        {formatDate(client.lastAppointmentDate)}
                      </p>

                      <p>
                        <span className="font-semibold text-neutral-950">
                          Servicio:
                        </span>{" "}
                        {client.lastServiceName || "Sin servicio"}
                      </p>

                      <p>
                        <span className="font-semibold text-neutral-950">
                          Barbero:
                        </span>{" "}
                        {client.lastBarberName || "Sin barbero"}
                      </p>

                      <p className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-950">Estado:</span>
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadgeClass(client.lastStatus)}`}>
                          {statusLabel(client.lastStatus)}
                        </span>
                      </p>
                    </div>

                    {client.notes && (
                      <p className="mt-3 rounded-2xl bg-neutral-50 p-3 text-xs text-neutral-500">
                        {client.notes}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
