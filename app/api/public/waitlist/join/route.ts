import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import { checkRateLimit, getClientIp } from "@/src/lib/rate-limit/in-memory";

const WAITLIST_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora
const WAITLIST_RATE_LIMIT_MAX_BY_IP = 10;
const WAITLIST_RATE_LIMIT_MAX_BY_EMAIL = 3;

const WaitlistSchema = z.object({
  barbershopId: z.string().trim().uuid("Barbería no válida."),
  clientName: z.string().trim().min(2, "Añade tu nombre.").max(80),
  clientEmail: z.string().trim().email("Email no válido.").max(120),
  clientPhone: z
    .string()
    .trim()
    .max(25)
    .nullable()
    .optional()
    .or(z.literal("")),
  preferredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida."),
  serviceId: z.string().trim().uuid("Servicio no válido.").nullable().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Datos no válidos" },
      { status: 400 }
    );
  }

  const { barbershopId, clientName, clientEmail, clientPhone, preferredDate, serviceId } =
    parsed.data;

  // Rate limit por IP y por email — mitiga spam aunque el barbershopId sea válido.
  const clientIp = getClientIp(request);
  const normalizedEmail = clientEmail.trim().toLowerCase();
  const ipAllowed = checkRateLimit(
    `waitlist:ip:${clientIp}`,
    WAITLIST_RATE_LIMIT_MAX_BY_IP,
    WAITLIST_RATE_LIMIT_WINDOW_MS
  );
  const emailAllowed = checkRateLimit(
    `waitlist:email:${normalizedEmail}`,
    WAITLIST_RATE_LIMIT_MAX_BY_EMAIL,
    WAITLIST_RATE_LIMIT_WINDOW_MS
  );

  if (!ipAllowed || !emailAllowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Inténtalo más tarde." },
      { status: 429 }
    );
  }

  const supabase = createServiceRoleClient();

  // Defensa de diseño: el barbershopId llega crudo desde el cliente (sin sesión).
  // En vez de confiar en él a ciegas, comprobamos que corresponde a una barbería
  // que de verdad tiene las reservas públicas activas — el mismo criterio que ya
  // usa /r/[slug]/page.tsx y createPublicBooking() para servir la página y crear
  // citas. Esto reduce el vector de "adivinar un UUID ajeno" a "solo puedo afectar
  // barberías que aceptan público de todas formas", que es el mismo riesgo ya
  // aceptado para el flujo de reservas.
  const { data: barbershop, error: barbershopError } = await supabase
    .from("barbershops")
    .select("id, public_booking_enabled")
    .eq("id", barbershopId)
    .eq("public_booking_enabled", true)
    .maybeSingle();

  if (barbershopError || !barbershop) {
    return NextResponse.json({ error: "Barbería no encontrada" }, { status: 404 });
  }

  // Si se indica servicio, comprobar que pertenece a esa barbería y está activo.
  if (serviceId) {
    const { data: service } = await supabase
      .from("services")
      .select("id")
      .eq("id", serviceId)
      .eq("barbershop_id", barbershopId)
      .eq("active", true)
      .maybeSingle();

    if (!service) {
      return NextResponse.json({ error: "Servicio no disponible" }, { status: 400 });
    }
  }

  // biome-ignore lint: waitlist_entries not yet in generated types
  const { error } = await (supabase as any).from("waitlist_entries").insert({
    barbershop_id: barbershopId,
    client_name: clientName,
    client_email: normalizedEmail,
    client_phone: clientPhone || null,
    preferred_date: preferredDate,
    service_id: serviceId || null,
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo guardar la solicitud." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
