import { redirect } from "next/navigation";
import {
  ExternalLink,
  Link as LinkIcon,
  MessageSquareText,
  ShieldAlert,
  Star,
  ThumbsUp,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { createClient } from "@/src/lib/supabase/server";
import { getCurrentBarbershopId } from "@/src/lib/barbershop/get-current";
import { getConfiguredSiteUrl } from "@/src/lib/site-url";
import {
  createReviewLinkAction,
  saveGoogleReviewUrlAction,
} from "./actions";

export const dynamic = "force-dynamic";

type ReviewRow = {
  id: string;
  public_token: string;
  rating: number | null;
  comment: string | null;
  source: string;
  is_public: boolean;
  status: string;
  respuesta_sugerida: string | null;
  created_at: string;
  appointments:
    | {
        appointment_date: string | null;
        start_time: string | null;
      }
    | {
        appointment_date: string | null;
        start_time: string | null;
      }[]
    | null;
  clients:
    | {
        name: string;
        phone: string | null;
      }
    | {
        name: string;
        phone: string | null;
      }[]
    | null;
};

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function getPublicBaseUrl() {
  return getConfiguredSiteUrl();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAppointmentDate(date?: string | null, time?: string | null) {
  if (!date) return "Sin reserva vinculada";

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return time ? `${formattedDate} · ${time.slice(0, 5)}h` : formattedDate;
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    google_redirect_ready: "Positiva",
    private_feedback: "Feedback privado",
    archived: "Archivada",
  };

  return labels[status] ?? status;
}

function statusClass(status: string) {
  const classes: Record<string, string> = {
    pending: "border-amber-100 bg-amber-50 text-amber-700",
    google_redirect_ready: "border-emerald-100 bg-emerald-50 text-emerald-700",
    private_feedback: "border-red-100 bg-red-50 text-red-700",
    archived: "border-neutral-200 bg-neutral-100 text-neutral-600",
  };

  return classes[status] ?? "border-neutral-200 bg-neutral-100 text-neutral-600";
}

function buildReviewUrl(baseUrl: string, token: string) {
  return `${baseUrl}/review/${token}`;
}

export default async function ReviewsDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const barbershopId = await getCurrentBarbershopId(supabase, user.id);

  if (!barbershopId) {
    redirect("/onboarding");
  }

  const [{ data: barbershop }, { data: reviewsData, error: reviewsError }] =
    await Promise.all([
      supabase
        .from("barbershops")
        .select("name, google_review_url, google_business_url")
        .eq("id", barbershopId)
        .maybeSingle(),
      supabase
        .from("reviews")
        .select(
          `
          id,
          public_token,
          rating,
          comment,
          source,
          is_public,
          status,
          respuesta_sugerida,
          created_at,
          appointments (
            appointment_date,
            start_time
          ),
          clients (
            name,
            phone
          )
        `
        )
        .eq("business_id", barbershopId)
        .order("created_at", { ascending: false }),
    ]);

  const reviews = (reviewsData ?? []) as ReviewRow[];
  const completedReviews = reviews.filter((review) => review.rating !== null);
  const total = completedReviews.length;
  const average =
    total > 0
      ? completedReviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / total
      : 0;
  const positive = completedReviews.filter((review) => (review.rating ?? 0) >= 4).length;
  const privateFeedback = completedReviews.filter(
    (review) => (review.rating ?? 0) <= 3
  ).length;
  const pending = reviews.filter((review) => review.status === "pending").length;
  const baseUrl = getPublicBaseUrl();
  const googleReviewUrl =
    barbershop?.google_review_url ?? barbershop?.google_business_url ?? "";

  return (
    <div className="space-y-6">
      <PageHeader
        section="Crecimiento"
        title="Reseñas"
        description="Protege la reputación: clientes satisfechos van a Google; feedback delicado queda privado para el equipo."
        action={
          <form action={createReviewLinkAction}>
            <button type="submit" className="btn-dark">
              Crear enlace <LinkIcon size={15} />
            </button>
          </form>
        }
      />

      {reviewsError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error leyendo reseñas: {reviewsError.message}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Valoración media"
          value={total > 0 ? average.toFixed(1).replace(".", ",") : "—"}
          description={`${total} valoraciones`}
          icon={Star}
          iconBg="bg-amber-50"
          iconColor="text-amber-700"
        />
        <StatCard
          label="Total"
          value={String(total)}
          description="recibidas"
          icon={MessageSquareText}
        />
        <StatCard
          label="Positivas"
          value={String(positive)}
          description="4-5 estrellas"
          icon={ThumbsUp}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-700"
        />
        <StatCard
          label="Privadas"
          value={String(privateFeedback)}
          description="1-3 estrellas"
          icon={ShieldAlert}
          iconBg="bg-red-50"
          iconColor="text-red-700"
        />
      </section>

      <section className="section-band p-5 md:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="label-section">Google Reviews</p>
            <h2 className="section-heading">Destino para clientes satisfechos</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Si una valoración es de 4 o 5 estrellas, la página pública muestra un botón para dejar reseña en Google. No se publica nada automáticamente.
            </p>
          </div>

          <form action={saveGoogleReviewUrlAction} className="space-y-3">
            <label className="form-label">URL directa de reseñas de Google</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                name="google_review_url"
                defaultValue={googleReviewUrl}
                placeholder="https://g.page/r/..."
                className="input py-3"
              />
              <button type="submit" className="btn-outline shrink-0">
                Guardar
              </button>
            </div>
            {googleReviewUrl ? (
              <a
                href={googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#8A641F] transition hover:text-[#111827]"
              >
                Abrir enlace configurado <ExternalLink size={13} />
              </a>
            ) : (
              <p className="text-xs text-neutral-500">
                Sin URL de Google configurada. Las valoraciones positivas mostrarán solo el agradecimiento.
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-neutral-950">Lista de reseñas</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {pending > 0
                ? `${pending} enlaces pendientes de responder.`
                : "Valoraciones y feedback recibidos por enlaces públicos."}
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
            <Star size={24} className="mx-auto text-neutral-300" />
            <p className="mt-3 font-bold text-neutral-800">Todavía no hay reseñas</p>
            <p className="mx-auto mt-1 max-w-xl text-sm leading-6 text-neutral-500">
              Crea tu primer enlace y envíalo manualmente por WhatsApp después de una cita. Las respuestas aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {reviews.map((review) => {
              const client = firstRelation(review.clients);
              const appointment = firstRelation(review.appointments);
              const reviewUrl = buildReviewUrl(baseUrl, review.public_token);

              return (
                <article
                  key={review.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(review.status)}`}>
                          {statusLabel(review.status)}
                        </span>
                        <span className="text-xs font-semibold text-neutral-500">
                          {formatDate(review.created_at)}
                        </span>
                      </div>

                      <h3 className="mt-3 font-black text-[#111827]">
                        {client?.name ?? "Cliente sin vincular"}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {formatAppointmentDate(
                          appointment?.appointment_date,
                          appointment?.start_time
                        )}
                      </p>

                      {review.rating ? (
                        <p className="mt-3 text-sm font-bold text-[#111827]">
                          {review.rating}/5 estrellas
                        </p>
                      ) : (
                        <p className="mt-3 text-sm font-semibold text-neutral-500">
                          Enlace pendiente de valoración
                        </p>
                      )}

                      {review.comment && (
                        <p className="mt-3 max-w-3xl rounded-2xl bg-neutral-50 p-3 text-sm leading-6 text-neutral-600">
                          {review.comment}
                        </p>
                      )}

                      {review.respuesta_sugerida && (
                        <p className="mt-3 max-w-3xl rounded-2xl border border-[#DDE7FB] bg-[#EFF6FF] p-3 text-xs leading-5 text-blue-800">
                          <span className="font-bold">Respuesta sugerida futura:</span>{" "}
                          {review.respuesta_sugerida}
                        </p>
                      )}
                    </div>

                    <div className="lg:w-80">
                      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                        Enlace privado
                      </p>
                      <a
                        href={reviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block break-all rounded-2xl border border-[#E7E2D8] bg-[#FDFBF7] p-3 text-xs font-semibold text-neutral-600 transition hover:border-[#C89B3C]"
                      >
                        {reviewUrl}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
