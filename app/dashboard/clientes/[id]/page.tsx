import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
  MessageSquareText,
  Phone,
  Scissors,
  Star,
  User,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildRetentionMessage } from "@/src/lib/retention/messages";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import { CustomerCopyMessageButton } from "./CustomerCopyMessageButton";
import { createCustomerReviewAction, saveClientCrmAction } from "./actions";
import { ClientLoyaltyCard } from "@/components/loyalty/ClientLoyaltyCard";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    id: string;
  };
};

type ClientRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  preferences: string | null;
  favorite_barber_id: string | null;
  last_service_id: string | null;
  visit_count: number | null;
  last_visit_at: string | null;
  next_recommended_visit_at: string | null;
  no_show_count: number | null;
  created_at: string | null;
};

type AppointmentRow = {
  id: string;
  appointment_date: string;
  start_time: string;
  status: string;
  notes: string | null;
  service_id: string | null;
  barber_id: string | null;
  services:
    | {
        id: string;
        name: string;
      }
    | {
        id: string;
        name: string;
      }[]
    | null;
  barbers:
    | {
        id: string;
        name: string;
      }
    | {
        id: string;
        name: string;
      }[]
    | null;
};

type BarberRow = {
  id: string;
  name: string;
  active: boolean | null;
};

type BarbershopRow = {
  id: string;
  name: string;
  slug: string;
  google_review_url: string | null;
  google_business_url: string | null;
};

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function getPublicBaseUrl() {
  return getConfiguredSiteUrl();
}

function formatDate(date?: string | null) {
  if (!date) return "Sin fecha";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date?: string | null) {
  if (!date) return "Sin fecha";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(time?: string | null) {
  if (!time) return "--:--";
  return time.slice(0, 5);
}

function getCustomerState({
  visitCount,
  lastVisitAt,
}: {
  visitCount: number;
  lastVisitAt: string | null;
}) {
  if (!visitCount) {
    return { label: "Cliente nuevo", tone: "active" as const };
  }

  if (!lastVisitAt) {
    return { label: "Cliente nuevo", tone: "active" as const };
  }

  const diffDays = Math.floor(
    (Date.now() - new Date(lastVisitAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays >= 90) {
    return { label: "Cliente perdido", tone: "inactive" as const };
  }

  if (visitCount >= 2) {
    return { label: "Cliente frecuente", tone: "active" as const };
  }

  return { label: "Cliente nuevo", tone: "active" as const };
}

function getStateBadgeClass(tone: "active" | "inactive") {
  return tone === "active"
    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
    : "border-red-100 bg-red-50 text-red-700";
}

function buildPublicBookingUrl({
  baseUrl,
  slug,
  serviceId,
  barberId,
}: {
  baseUrl: string;
  slug: string;
  serviceId: string | null;
  barberId: string | null;
}) {
  const url = new URL(`/r/${slug}`, baseUrl);
  if (serviceId) url.searchParams.set("service", serviceId);
  if (barberId) url.searchParams.set("barber", barberId);
  return url.toString();
}

function buildReviewGoogleUrl(barbershop: BarbershopRow) {
  return barbershop.google_review_url ?? barbershop.google_business_url ?? null;
}

export default async function CustomerDetailPage({ params }: Props) {
  const clientId = params.id?.trim();
  if (!clientId) notFound();

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const dataClient = createServiceRoleClient();

  const [
    { data: client, error: clientError },
    { data: appointments, error: appointmentsError },
    { data: barbers },
    { data: barbershop },
  ] = await Promise.all([
    dataClient
      .from("clients")
      .select(
        "id, name, phone, email, notes, preferences, favorite_barber_id, last_service_id, visit_count, last_visit_at, next_recommended_visit_at, no_show_count, created_at"
      )
      .eq("id", clientId)
      .eq("barbershop_id", barbershopId)
      .maybeSingle(),
    dataClient
      .from("appointments")
      .select(
        `
        id,
        appointment_date,
        start_time,
        status,
        notes,
        service_id,
        barber_id,
        services (
          id,
          name
        ),
        barbers (
          id,
          name
        )
      `
      )
      .eq("barbershop_id", barbershopId)
      .eq("client_id", clientId)
      .order("appointment_date", { ascending: false })
      .order("start_time", { ascending: false }),
    dataClient
      .from("barbers")
      .select("id, name, active")
      .eq("barbershop_id", barbershopId)
      .order("name", { ascending: true }),
    dataClient
      .from("barbershops")
      .select("id, name, slug, google_review_url, google_business_url")
      .eq("id", barbershopId)
      .maybeSingle(),
  ]);

  if (clientError || appointmentsError || !client || !barbershop) {
    notFound();
  }

  const clientRow = client as ClientRow;
  const appointmentRows = (appointments ?? []) as AppointmentRow[];
  const barberRows = (barbers ?? []) as BarberRow[];
  const barbershopRow = barbershop as BarbershopRow;
  const activeBarberRows = barberRows.filter((item) => item.active !== false);
  const visitCount = clientRow.visit_count ?? appointmentRows.filter((item) => item.status !== "cancelled").length;
  const noShowCount = clientRow.no_show_count ?? appointmentRows.filter((item) => item.status === "no_show").length;
  const lastAppointment = appointmentRows[0] ?? null;
  const lastService = firstRelation(lastAppointment?.services);
  const lastVisitAt = clientRow.last_visit_at ?? null;
  const nextRecommendedVisitAt =
    clientRow.next_recommended_visit_at ??
    (lastVisitAt ? new Date(new Date(lastVisitAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null);

  const inferredFavoriteBarberId = clientRow.favorite_barber_id ?? (() => {
    const counts = new Map<string, number>();
    for (const appointment of appointmentRows) {
      if (!appointment.barber_id || appointment.status === "cancelled") continue;
      counts.set(appointment.barber_id, (counts.get(appointment.barber_id) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  })();

  const favoriteBarber =
    activeBarberRows.find((barber) => barber.id === inferredFavoriteBarberId) ??
    barberRows.find((barber) => barber.id === inferredFavoriteBarberId) ??
    firstRelation(lastAppointment?.barbers) ??
    null;

  const lastServiceId = clientRow.last_service_id ?? lastAppointment?.service_id ?? null;
  const publicBookingUrl = buildPublicBookingUrl({
    baseUrl: getPublicBaseUrl(),
    slug: barbershopRow.slug,
    serviceId: lastServiceId,
    barberId: favoriteBarber?.id ?? firstRelation(lastAppointment?.barbers)?.id ?? null,
  });

  const reviewUrl = buildReviewGoogleUrl(barbershopRow);
  const state = getCustomerState({
    visitCount,
    lastVisitAt,
  });

  const retentionMessage = buildRetentionMessage({
    name: clientRow.name,
    bookingUrl: publicBookingUrl,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        section="Clientes"
        title={clientRow.name}
        description="Ficha privada del cliente con historial, hábitos y acciones de retención."
        action={
          <Link href="/dashboard/clientes" className="btn-outline">
            <ArrowLeft size={15} /> Volver
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Visitas"
          value={visitCount}
          description="registradas"
          icon={Users}
        />
        <StatCard
          label="No-shows"
          value={noShowCount}
          description="faltas"
          icon={CalendarDays}
          iconBg="bg-red-50"
          iconColor="text-red-700"
        />
        <StatCard
          label="Última cita"
          value={lastVisitAt ? formatDate(lastVisitAt) : "Sin citas"}
          description={lastVisitAt ? formatDateTime(lastVisitAt) : "todavía"}
          icon={Clock}
        />
        <StatCard
          label="Próxima recomendada"
          value={nextRecommendedVisitAt ? formatDate(nextRecommendedVisitAt) : "Pendiente"}
          description="heurística interna"
          icon={Star}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="panel overflow-hidden p-0">
            <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="label-section">Resumen</p>
                  <h2 className="section-heading">Datos básicos</h2>
                </div>
                <StatusBadge status={state.tone}>{state.label}</StatusBadge>
              </div>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[1fr_1fr] md:p-6">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Nombre</p>
                    <p className="mt-1 font-black text-[#111827]">{clientRow.name}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E7E2D8] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Cliente desde</p>
                    <p className="mt-1 font-semibold text-[#111827]">{formatDate(clientRow.created_at)}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#E7E2D8] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Teléfono</p>
                    <p className="mt-1 font-semibold text-[#111827]">{clientRow.phone ?? "Sin teléfono"}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E7E2D8] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Email</p>
                    <p className="mt-1 font-semibold text-[#111827]">{clientRow.email ?? "Sin email"}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#E7E2D8] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Barbero favorito</p>
                    <p className="mt-1 font-semibold text-[#111827]">{favoriteBarber?.name ?? "No inferido"}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E7E2D8] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">Servicio base</p>
                    <p className="mt-1 font-semibold text-[#111827]">{lastService?.name ?? "Sin servicio"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-4">
                <p className="label-section">Acciones</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href={publicBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#111827] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#0F172A]"
                  >
                    Crear nueva reserva <Scissors size={15} />
                  </Link>

                  <CustomerCopyMessageButton message={retentionMessage} />

                  <form action={createCustomerReviewAction}>
                    <input type="hidden" name="client_id" value={clientRow.id} />
                    <button
                      type="submit"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#D9B766]/40 bg-[#FFFBEB] px-4 py-2.5 text-sm font-black text-[#8A641F] transition hover:bg-[#FEF3C7]"
                    >
                      Pedir reseña <Star size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="panel overflow-hidden p-0">
            <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
              <p className="label-section">Timeline</p>
              <h2 className="section-heading">Historial de citas</h2>
            </div>

            {appointmentRows.length === 0 ? (
              <div className="p-6">
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
                  <CalendarDays size={24} className="mx-auto text-neutral-300" />
                  <p className="mt-3 font-semibold text-neutral-800">Todavía no hay citas</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Cuando empiece a reservar, la ficha irá guardando el historial aquí.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#E7E2D8]">
                {appointmentRows.map((appointment) => {
                  const service = firstRelation(appointment.services);
                  const barber = firstRelation(appointment.barbers);

                  return (
                    <article key={appointment.id} className="p-5 md:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-black text-[#111827]">
                            {formatDate(appointment.appointment_date)} · {formatTime(appointment.start_time)}
                          </p>
                          <p className="mt-1 text-sm text-neutral-500">
                            {service?.name ?? "Servicio"} · {barber?.name ?? "Sin barbero"}
                          </p>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>

                      {appointment.notes && (
                        <p className="mt-3 rounded-2xl bg-[#F8FAFC] p-3 text-sm text-neutral-600">
                          {appointment.notes}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="panel overflow-hidden p-0">
            <div className="border-b border-[#E7E2D8] bg-[#FDFBF7] px-5 py-4 md:px-6">
              <p className="label-section">CRM</p>
              <h2 className="section-heading">Notas técnicas</h2>
            </div>

            <form action={saveClientCrmAction} className="space-y-4 p-5 md:p-6">
              <input type="hidden" name="client_id" value={clientRow.id} />

              <div>
                <label className="form-label">Notas privadas</label>
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={clientRow.notes ?? ""}
                  placeholder="laterales al 0.5"
                  className="input resize-none py-3"
                />
              </div>

              <div>
                <label className="form-label">Preferencias</label>
                <textarea
                  name="preferences"
                  rows={4}
                  defaultValue={clientRow.preferences ?? ""}
                  placeholder="arriba tijera, no usar cera fuerte"
                  className="input resize-none py-3"
                />
              </div>

              <div>
                <label className="form-label">Barbero favorito</label>
                <select
                  name="favorite_barber_id"
                  defaultValue={clientRow.favorite_barber_id ?? inferredFavoriteBarberId ?? ""}
                  className="input py-3"
                >
                  <option value="">Sin definir</option>
                  {barberRows.map((barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-dark w-full">
                Guardar CRM
              </button>
            </form>
          </section>

          <section className="rounded-[28px] border border-[#E7E2D8] bg-white p-5 shadow-sm">
            <p className="label-section">Lectura rápida</p>
            <div className="mt-4 space-y-3 text-sm text-neutral-600">
              <p className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0 text-neutral-400" />
                <span>{clientRow.email ?? "Sin email"}</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0 text-neutral-400" />
                <span>{clientRow.phone ?? "Sin teléfono"}</span>
              </p>
              <p className="flex items-start gap-2">
                <MessageSquareText size={15} className="mt-0.5 shrink-0 text-neutral-400" />
                <span>Última cita: {lastVisitAt ? formatDateTime(lastVisitAt) : "Sin visitas"}</span>
              </p>
            </div>
          </section>

          <ClientLoyaltyCard
            clientId={clientRow.id}
            barbershopId={barbershopId}
            clientName={clientRow.name}
            phone={clientRow.phone}
          />
        </aside>
      </section>
    </div>
  );
}
