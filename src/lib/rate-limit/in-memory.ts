/**
 * Rate limiting en memoria para endpoints públicos del MVP.
 *
 * LIMITACIÓN CONOCIDA: en Vercel serverless cada invocación puede arrancar
 * en una instancia/lambda distinta, por lo que el Map no persiste de forma
 * garantizada entre requests. Esto es aceptable como mitigación de "fricción"
 * frente a abuso casual/bots simples (no es una defensa robusta contra un
 * atacante decidido). Si el abuso real se vuelve un problema, migrar el
 * contador a una tabla en Supabase (p.ej. `rate_limit_counters`) para que
 * persista entre invocaciones serverless.
 *
 * Mismo patrón ya usado en app/r/[slug]/actions.ts para createPublicBooking;
 * se extrae aquí para reutilizar en otros endpoints públicos sin duplicar
 * la lógica de Map + pruning.
 */

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

/** Elimina buckets ya expirados para evitar crecimiento ilimitado del Map. */
function pruneExpired(now: number) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

/**
 * Comprueba y consume un intento para `key` dentro de la ventana `windowMs`.
 * Devuelve `true` si el intento está permitido, `false` si se superó `maxAttempts`.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  const now = Date.now();
  pruneExpired(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= maxAttempts) {
    return false;
  }

  existing.count += 1;
  return true;
}

/** Extrae la IP del cliente a partir de los headers estándar de proxy/Vercel. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";
}
