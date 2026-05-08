import { notFound } from "next/navigation";
import { Scissors, ShieldCheck, Star } from "lucide-react";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { ReviewForm } from "./ReviewForm";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    token: string;
  };
};

type ReviewRow = {
  public_token: string;
  status: string;
  rating: number | null;
  barbershops:
    | {
        name: string;
        google_review_url: string | null;
        google_business_url: string | null;
      }
    | {
        name: string;
        google_review_url: string | null;
        google_business_url: string | null;
      }[]
    | null;
};

function firstRelation<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default async function PublicReviewPage({ params }: Props) {
  const token = params.token?.trim();
  if (!token) notFound();

  const supabase = createServiceRoleClient();
  const { data: review, error } = await supabase
    .from("reviews")
    .select(
      `
      public_token,
      status,
      rating,
      barbershops (
        name,
        google_review_url,
        google_business_url
      )
    `
    )
    .eq("public_token", token)
    .maybeSingle();

  if (error || !review) {
    notFound();
  }

  const reviewRow = review as ReviewRow;
  const barbershop = firstRelation(reviewRow.barbershops);

  if (!barbershop) {
    notFound();
  }

  const googleReviewUrl =
    barbershop.google_review_url ?? barbershop.google_business_url ?? null;

  return (
    <main className="premium-grid-bg min-h-screen px-4 py-8 text-slate-950 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-[0.8fr_1fr] md:items-center">
        <section className="rounded-[28px] border border-[#E7E2D8] bg-[#111111] p-6 text-white shadow-xl shadow-slate-900/10 md:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Scissors size={22} />
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#D9B766]">
            BarberiaOS Reviews
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-normal">
            Tu opinión ayuda a cuidar la experiencia.
          </h2>
          <div className="mt-6 grid gap-3 text-sm text-white/70">
            <p className="flex gap-2">
              <Star size={16} className="mt-0.5 shrink-0 text-[#D9B766]" />
              Si todo fue bien, podrás dejar reseña pública en Google.
            </p>
            <p className="flex gap-2">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#D9B766]" />
              Si algo falló, tu feedback queda privado para la barbería.
            </p>
          </div>
        </section>

        <ReviewForm
          token={token}
          barbershopName={barbershop.name}
          initialStatus={reviewRow.status}
          initialRating={reviewRow.rating}
          googleReviewUrl={googleReviewUrl}
        />
      </div>
    </main>
  );
}
