"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { buildSuggestedReviewResponse } from "@/src/lib/reviews/suggested-response";

type SubmitReviewInput = {
  token: string;
  rating: number;
  comment: string;
};

type SubmitReviewResult = {
  error: string | null;
  rating: number | null;
  googleReviewUrl: string | null;
  barbershopName: string | null;
};

export async function submitPublicReview(
  input: SubmitReviewInput
): Promise<SubmitReviewResult> {
  const token = input.token.trim();
  const rating = Number(input.rating);
  const comment = input.comment.trim();

  if (!token || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      error: "Selecciona una valoración del 1 al 5.",
      rating: null,
      googleReviewUrl: null,
      barbershopName: null,
    };
  }

  const supabase = createServiceRoleClient();

  const { data: existingReview, error: loadError } = await supabase
    .from("reviews")
    .select(
      `
      id,
      business_id,
      status,
      barbershops (
        name,
        google_review_url,
        google_business_url
      )
    `
    )
    .eq("public_token", token)
    .maybeSingle();

  if (loadError || !existingReview) {
    return {
      error: "Este enlace de valoración no está disponible.",
      rating: null,
      googleReviewUrl: null,
      barbershopName: null,
    };
  }

  if (existingReview.status !== "pending") {
    const barbershop = Array.isArray(existingReview.barbershops)
      ? existingReview.barbershops[0]
      : existingReview.barbershops;

    return {
      error: null,
      rating: null,
      googleReviewUrl:
        barbershop?.google_review_url ?? barbershop?.google_business_url ?? null,
      barbershopName: barbershop?.name ?? null,
    };
  }

  const status = rating >= 4 ? "google_redirect_ready" : "private_feedback";
  const isPublic = rating >= 4;

  const { error: updateError } = await supabase
    .from("reviews")
    .update({
      rating,
      comment: comment || null,
      is_public: isPublic,
      status,
      respuesta_sugerida: buildSuggestedReviewResponse(rating),
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingReview.id);

  if (updateError) {
    return {
      error: "No se pudo guardar la valoración. Inténtalo de nuevo.",
      rating: null,
      googleReviewUrl: null,
      barbershopName: null,
    };
  }

  const barbershop = Array.isArray(existingReview.barbershops)
    ? existingReview.barbershops[0]
    : existingReview.barbershops;

  revalidatePath("/dashboard/resenas");

  return {
    error: null,
    rating,
    googleReviewUrl:
      barbershop?.google_review_url ?? barbershop?.google_business_url ?? null,
    barbershopName: barbershop?.name ?? null,
  };
}
