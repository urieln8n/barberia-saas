export function buildSuggestedReviewResponse(rating: number | null) {
  if (!rating) return null;

  if (rating >= 4) {
    return "Muchas gracias por tu reseña. Nos alegra saber que saliste contento con el servicio. Te esperamos cuando quieras mantener el corte al día.";
  }

  return "Gracias por contarnos lo ocurrido. Sentimos que la experiencia no haya estado a la altura y vamos a revisar internamente lo que nos comentas.";
}
