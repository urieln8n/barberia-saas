import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Crown,
  Euro,
  Mail,
  MessageSquareText,
  Phone,
  Scissors,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { createClient as createServerClient } from "@/src/lib/supabase/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { buildRetentionMessage } from "@/src/lib/retention/messages";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import { CustomerCopyMessageButton } from "./CustomerCopyMessageButton";
import { createCustomerReviewAction, saveClientCrmAction } from "./actions";
import { ClientLoyaltyCard } from "@/components/loyalty/ClientLoyaltyCard";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

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
  services: { id: string; name: string; price: number | null } | { id: string; name: string; price: number | null }[] | null;
  barbers: { id: string; name: string } | { id: string; name: string }[] | null;
};

type BarberRow   = { id: string; name: string; active: boolean | null };
type BarbershopRow = { id: string; name: string; slug: string; google_review_url: string | null; google_business_url: string | null };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function firstRelation<T>(v: T | T[] | null | undefined): T | null {
  if (!v) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

function formatDate(d?: string | null) {
  if (!d) return "Sin fecha";
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(t?: string | null) {
  if (!t) return "--:--";
  return t.slice(0, 5);
}

function daysSince(d: string | null): number | null {
  if (!d) return null;
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}

// ─── Segment badge ────────────────────────────────────────────────────────────

function getSegmentBadge(opts: {
  totalAppointments: number;
  totalRevenue: number;
  lastVisitAt: string | null;
}) {
  const { totalAppointments, totalRevenue, lastVisitAt } = opts;
  if (totalAppointments >= 10 || totalRevenue >= 200)
    return { label: "VIP",       cls: "border-[#D4AF37]/35 bg-[#D4AF37]/[0.10] text-[#D4AF37]",       Icon: Crown };
  if (totalAppointments === 0)
    return { label: "Nuevo",     cls: "border-[#D4AF37]/30 bg-[#D4AF37]/[0.08] text-[#D4AF37]",       Icon: Star };
  const days = daysSince(lastVisitAt);
  if (days !== null && days > 75)
    return { label: "Perdido",   cls: "border-red-500/25 bg-red-500/[0.08] text-red-400",              Icon: CalendarDays };
  if (days !== null && days > 45)
    return { label: "En Riesgo", cls: "border-amber-500/25 bg-amber-500/[0.08] text-amber-400",        Icon: Clock };
  return   { label: "Activo",    cls: "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-400",  Icon: TrendingUp };
}

// ─── Appointment status ───────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  scheduled: { label: "Pendiente",  cls: "border-amber-500/20 bg-amber-500/[0.08] text-amber-300" },
  confirmed:  { label: "Confirmada", cls: "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300" },
  completed:  { label: "Completada", cls: "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-300" },
  cancelled:  { label: "Cancelada",  cls: "border-red-500/20 bg-red-500/[0.08] text-red-300" },
  no_show:    { label: "No show",    cls: "border-rose-500/20 bg-rose-500/[0.08] text-rose-300" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CustomerDetailPage({ params }: Props) {
  const clientId = params.id?.trim();
  if (!clientId) notFound();

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);
  if (!barbershopId) redirect("/onboarding");

  const dc = createServiceRoleClient();

  const [
    { data: client, error: clientError },
    { data: appointments, error: appointmentsError },
    { data: barbers },
    { data: barbershop },
  ] = await Promise.all([
    dc.from("clients")
      .select("id,name,phone,email,notes,preferences,favorite_barber_id,last_service_id,visit_count,last_visit_at,next_recommended_visit_at,no_show_count,created_at")
      .eq("id", clientId)
      .eq("barbershop_id", barbershopId)
      .maybeSingle(),
    dc.from("appointments")
      .select("id,appointment_date,start_time,status,notes,service_id,barber_id,services(id,name,price),barbers(id,name)")
      .eq("barbershop_id", barbershopId)
      .eq("client_id", clientId)
      .order("appointment_date", { ascending: false })
      .order("start_time",       { ascending: false }),
    dc.from("barbers")
      .select("id,name,active")
      .eq("barbershop_id", barbershopId)
      .order("name", { ascending: true }),
    dc.from("barbershops")
      .select("id,name,slug,google_review_url,google_business_url")
      .eq("id", barbershopId)
      .maybeSingle(),
  ]);

  if (clientError || appointmentsError || !client || !barbershop) notFound();

  const cr   = client     as ClientRow;
  const apts = (appointments ?? []) as AppointmentRow[];
  const brs  = (barbers ?? [])      as BarberRow[];
  const bsp  = barbershop           as BarbershopRow;

  const visitCount  = cr.visit_count ?? apts.filter(a => a.status !== "cancelled").length;
  const noShowCount = cr.no_show_count ?? apts.filter(a => a.status === "no_show").length;
  const totalRevenue = apts
    .filter(a => a.status === "completed")
    .reduce((sum, a) => sum + (firstRelation(a.services)?.price ?? 0), 0);

  const lastVisitAt = cr.last_visit_at ?? null;
  const nextVisitAt = cr.next_recommended_visit_at ??
    (lastVisitAt ? new Date(new Date(lastVisitAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null);

  const inferredBarberId = cr.favorite_barber_id ?? (() => {
    const counts = new Map<string, number>();
    for (const a of apts) {
      if (!a.barber_id || a.status === "cancelled") continue;
      counts.set(a.barber_id, (counts.get(a.barber_id) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  })();

  const favoriteBarber =
    brs.find(b => b.id === inferredBarberId) ??
    firstRelation(apts[0]?.barbers) ?? null;

  const lastServiceId = cr.last_service_id ?? apts[0]?.service_id ?? null;
  const lastService   = firstRelation(apts[0]?.services);

  const baseUrl = getConfiguredSiteUrl();
  const bookingUrl = (() => {
    const url = new URL(`/r/${bsp.slug}`, baseUrl);
    if (lastServiceId) url.searchParams.set("service", lastServiceId);
    if (favoriteBarber?.id) url.searchParams.set("barber", favoriteBarber.id);
    return url.toString();
  })();

  const retentionMessage = buildRetentionMessage({ name: cr.name, bookingUrl });
  const segment = getSegmentBadge({ totalAppointments: visitCount, totalRevenue, lastVisitAt });

  return (
    <div className="space-y-6">
      <PageHeader
        section="Clientes"
        title={cr.name}
        description="Ficha completa del cliente — historial, hábitos y CRM."
        action={
          <Link
            href="/dashboard/clientes"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.10] bg-white/[0.04] px-4 py-2.5 text-sm font-black text-white/60 transition hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white/85"
          >
            <ArrowLeft size={15} /> Volver
          </Link>
        }
      />

      {/* ── KPIs ── */}
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Visitas totales" value={visitCount}    description="citas registradas" icon={Users} />
        <StatCard
          label="Total gastado"
          value={totalRevenue > 0 ? `€${totalRevenue}` : "—"}
          description="en servicios completados"
          icon={Euro}
          variant={totalRevenue > 0 ? "highlight" : "default"}
        />
        <StatCard label="No-shows" value={noShowCount} description="faltas sin avisar" icon={CalendarDays} />
        <StatCard
          label="Próxima visita"
          value={nextVisitAt ? formatDate(nextVisitAt) : "Pendiente"}
          description={lastVisitAt ? `Última: ${formatDate(lastVisitAt)}` : "Sin visitas aún"}
          icon={Clock}
        />
      </section>

      {/* ── Main grid ── */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        {/* Left column */}
        <div className="space-y-6">

          {/* Client data card */}
          <div className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04]">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-5 py-4 md:px-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/30">Resumen</p>
                <h2
                  className="mt-1 font-black text-white/85"
                  style={{ fontSize: "clamp(1.05rem, 2vw, 1.25rem)", letterSpacing: "-0.02em" }}
                >
                  Datos del cliente
                </h2>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black ${segment.cls}`}>
                <segment.Icon size={11} />
                {segment.label}
              </span>
            </div>

            <div className="grid gap-6 p-5 md:grid-cols-[1fr_1fr] md:p-6">
              {/* Info grid */}
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoBox label="Nombre"         value={cr.name} />
                  <InfoBox label="Cliente desde"  value={formatDate(cr.created_at)} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoBox label="Teléfono"       value={cr.phone ?? "Sin teléfono"} />
                  <InfoBox label="Email"           value={cr.email ?? "Sin email"} mono />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoBox label="Barbero favorito" value={favoriteBarber?.name ?? "No inferido"} />
                  <InfoBox label="Servicio base"    value={lastService?.name   ?? "Sin servicio"} />
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/30">Acciones rápidas</p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-4 py-2.5 text-sm font-black text-[#0B0F19] transition hover:bg-[#C9A832]"
                  >
                    Crear nueva reserva <Scissors size={15} />
                  </Link>

                  <CustomerCopyMessageButton message={retentionMessage} />

                  <form action={createCustomerReviewAction}>
                    <input type="hidden" name="client_id" value={cr.id} />
                    <button
                      type="submit"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/[0.08] px-4 py-2.5 text-sm font-black text-[#D4AF37] transition hover:bg-[#D4AF37]/[0.16]"
                    >
                      Pedir reseña Google <Star size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment timeline */}
          <div className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04]">
            <div className="border-b border-white/[0.06] bg-white/[0.03] px-5 py-4 md:px-6">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/30">Timeline</p>
              <h2
                className="mt-1 font-black text-white/85"
                style={{ fontSize: "clamp(1.05rem, 2vw, 1.25rem)", letterSpacing: "-0.02em" }}
              >
                Historial de citas
              </h2>
            </div>

            {apts.length === 0 ? (
              <div className="p-6">
                <div className="rounded-2xl border border-dashed border-white/[0.10] bg-white/[0.02] p-8 text-center">
                  <CalendarDays size={24} className="mx-auto text-white/15" />
                  <p className="mt-3 font-semibold text-white/55">Todavía no hay citas</p>
                  <p className="mt-1 text-sm text-white/30">El historial aparecerá aquí cuando empiece a reservar.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {apts.map((apt) => {
                  const svc    = firstRelation(apt.services);
                  const barber = firstRelation(apt.barbers);
                  const badge  = STATUS_MAP[apt.status] ?? { label: apt.status, cls: "border-white/[0.10] bg-white/[0.05] text-white/50" };
                  return (
                    <article key={apt.id} className="px-5 py-4 transition-colors hover:bg-white/[0.02] md:px-6">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-black text-white/85">
                            {formatDate(apt.appointment_date)}
                            <span className="ml-2 font-normal text-white/40">{formatTime(apt.start_time)}</span>
                          </p>
                          <p className="mt-0.5 text-sm text-white/50">
                            {svc?.name ?? "Servicio"}
                            {barber?.name && <span className="ml-1.5 text-white/30">· {barber.name}</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {svc?.price != null && svc.price > 0 && (
                            <span className="flex items-center gap-0.5 text-sm font-black text-[#D4AF37]">
                              <Euro size={11} />
                              {svc.price}
                            </span>
                          )}
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                      {apt.notes && (
                        <p className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/45">
                          {apt.notes}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <aside className="space-y-6">

          {/* CRM notes */}
          <div className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04]">
            <div className="border-b border-white/[0.06] bg-white/[0.03] px-5 py-4 md:px-6">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/30">CRM</p>
              <h2
                className="mt-1 font-black text-white/85"
                style={{ fontSize: "clamp(1.05rem, 2vw, 1.25rem)", letterSpacing: "-0.02em" }}
              >
                Notas técnicas
              </h2>
            </div>

            <form action={saveClientCrmAction} className="space-y-4 p-5 md:p-6">
              <input type="hidden" name="client_id" value={cr.id} />

              <div>
                <label className="text-xs font-black uppercase tracking-wide text-white/35">Notas privadas</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={cr.notes ?? ""}
                  placeholder="laterales al 0.5, no usar navaja..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.10] bg-[#0F1219] px-4 py-3 text-sm text-white/80 placeholder:text-white/20 outline-none transition focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/15"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wide text-white/35">Preferencias</label>
                <textarea
                  name="preferences"
                  rows={3}
                  defaultValue={cr.preferences ?? ""}
                  placeholder="arriba tijera, no usar cera fuerte..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.10] bg-[#0F1219] px-4 py-3 text-sm text-white/80 placeholder:text-white/20 outline-none transition focus:border-[#D4AF37]/40 focus:ring-1 focus:ring-[#D4AF37]/15"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wide text-white/35">Barbero favorito</label>
                <select
                  name="favorite_barber_id"
                  defaultValue={cr.favorite_barber_id ?? inferredBarberId ?? ""}
                  className="mt-1.5 w-full rounded-xl border border-white/[0.10] bg-[#0F1219] px-4 py-3 text-sm text-white/75 outline-none transition focus:border-[#D4AF37]/40"
                >
                  <option value="">Sin definir</option>
                  {brs.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-4 py-2.5 text-sm font-black text-[#0B0F19] transition hover:bg-[#C9A832]"
              >
                Guardar CRM
              </button>
            </form>
          </div>

          {/* Quick read */}
          <div className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-white/[0.04]">
            <div className="border-b border-white/[0.06] bg-white/[0.03] px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/30">Lectura rápida</p>
            </div>
            <div className="space-y-3 p-5">
              <p className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 shrink-0 text-white/25" />
                <span className="text-sm text-white/55">{cr.email ?? "Sin email"}</span>
              </p>
              <p className="flex items-start gap-2">
                <Phone size={14} className="mt-0.5 shrink-0 text-white/25" />
                <span className="text-sm text-white/55">{cr.phone ?? "Sin teléfono"}</span>
              </p>
              <p className="flex items-start gap-2">
                <MessageSquareText size={14} className="mt-0.5 shrink-0 text-white/25" />
                <span className="text-sm text-white/55">
                  Última visita: {lastVisitAt ? formatDate(lastVisitAt) : "Sin visitas"}
                </span>
              </p>
              {totalRevenue > 0 && (
                <p className="flex items-start gap-2">
                  <Euro size={14} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                  <span className="text-sm font-black text-[#D4AF37]">€{totalRevenue} gastados en total</span>
                </p>
              )}
            </div>
          </div>

          <ClientLoyaltyCard
            clientId={cr.id}
            barbershopId={barbershopId}
            clientName={cr.name}
            phone={cr.phone}
          />
        </aside>
      </section>
    </div>
  );
}

// ─── InfoBox helper ───────────────────────────────────────────────────────────

function InfoBox({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
      <p className="text-[10px] font-black uppercase tracking-wide text-white/30">{label}</p>
      <p className={`mt-1 font-semibold text-white/75 ${mono ? "text-xs break-all" : "text-sm"}`}>{value}</p>
    </div>
  );
}
