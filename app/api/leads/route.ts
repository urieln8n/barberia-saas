import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

const LeadSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio"),
  whatsapp: z.string().trim().min(6, "El WhatsApp es obligatorio"),
  email: z.string().trim().email("Email no válido").optional().or(z.literal("")),
  barbershopName: z.string().trim().min(2, "El nombre de la barbería es obligatorio"),
  city: z.string().trim().min(2, "La ciudad es obligatoria"),
  barbersCount: z.string().trim().min(1, "Indica el número de barberos"),
  currentSystem: z.string().trim().optional().or(z.literal("")),
  mainProblem: z.string().trim().optional().or(z.literal("")),
  interest: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
  source: z.string().trim().optional().or(z.literal("")),
  utmSource: z.string().trim().optional().or(z.literal("")),
  utmMedium: z.string().trim().optional().or(z.literal("")),
  utmCampaign: z.string().trim().optional().or(z.literal("")),
  utmContent: z.string().trim().optional().or(z.literal("")),
  landingPath: z.string().trim().optional().or(z.literal("")),
});

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function envReady() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function normalizeSource(value: string | undefined) {
  const source = clean(value)?.toLowerCase();
  if (source === "instagram") return "instagram";
  if (source === "pedir-demo") return "pedir-demo";
  if (source === "barberiaos.com") return "barberiaos.com";
  return "barberiaos.com";
}

export async function POST(request: Request) {
  if (!envReady()) {
    return NextResponse.json(
      {
        error:
          "La captación está configurada, pero falta la conexión segura con Supabase.",
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = LeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Datos no válidos" },
      { status: 400 }
    );
  }

  const lead = parsed.data;
  const supabase = createServiceRoleClient();
  const email = clean(lead.email);
  const message = clean(lead.message);
  const source = normalizeSource(lead.source || lead.utmSource);
  const currentSystem = clean(lead.currentSystem) ?? "No indicado";
  const mainProblem = clean(lead.mainProblem) ?? "Solicitud de demo desde landing";
  const interest = clean(lead.interest) ?? "Pedir demo";

  const duplicateFilters = [`phone.eq.${lead.whatsapp}`];
  if (email) duplicateFilters.push(`email.eq.${email}`);

  const { data: existing, error: lookupError } = await supabase
    .from("crm_leads")
    .select("id")
    .or(duplicateFilters.join(","))
    .limit(1);

  if (lookupError) {
    return NextResponse.json(
      { error: "No se pudo comprobar el lead. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  if (existing && existing.length > 0) {
    return NextResponse.json({ ok: true, duplicated: true });
  }

  const notes = [
    `Sistema actual: ${currentSystem}`,
    `Problema principal: ${mainProblem}`,
    `Interés: ${interest}`,
    `Barberos: ${lead.barbersCount}`,
    `Origen: ${source}`,
    clean(lead.utmCampaign) ? `Campaña UTM: ${clean(lead.utmCampaign)}` : null,
    message ? `Mensaje: ${message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await supabase.from("crm_leads").insert({
    business_name: lead.barbershopName,
    barbershop_name: lead.barbershopName,
    contact_name: lead.name,
    phone: lead.whatsapp,
    whatsapp: lead.whatsapp,
    email,
    city: lead.city,
    country: "ES",
    source,
    status: "new",
    potential_mrr: 0,
    barbers_count: lead.barbersCount,
    current_system: currentSystem,
    main_problem: mainProblem,
    interest,
    message,
    utm_source: clean(lead.utmSource) ?? source,
    utm_medium: clean(lead.utmMedium),
    utm_campaign: clean(lead.utmCampaign),
    utm_content: clean(lead.utmContent),
    landing_path: clean(lead.landingPath) ?? "/instagram",
    notes,
  });

  if (error) {
    return NextResponse.json(
      { error: "No se pudo guardar el lead. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, duplicated: false });
}
