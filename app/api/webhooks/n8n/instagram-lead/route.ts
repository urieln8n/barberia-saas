import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

const InstagramLeadSchema = z.object({
  name: z.string().trim().optional().or(z.literal("")),
  contactName: z.string().trim().optional().or(z.literal("")),
  barbershopName: z.string().trim().min(2, "barbershopName es obligatorio"),
  city: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  instagramUsername: z.string().trim().optional().or(z.literal("")),
  barbersCount: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["new", "contacted", "demo_booked", "closed", "lost"]).optional(),
  temperature: z.enum(["cold", "warm", "hot"]).optional(),
  keyword: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  utmCampaign: z.string().trim().optional().or(z.literal("")),
  sourceEvent: z.string().trim().optional().or(z.literal("")),
});

function clean(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isAuthorized(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!secret) return false;

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headerSecret = request.headers.get("x-n8n-secret");
  return bearer === secret || headerSecret === secret;
}

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = InstagramLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Payload no válido" },
      { status: 400 },
    );
  }

  const lead = parsed.data;
  const phone = clean(lead.whatsapp) ?? clean(lead.phone);
  const email = clean(lead.email);
  const contactName = clean(lead.contactName) ?? clean(lead.name) ?? clean(lead.instagramUsername);
  const notes = [
    "Lead capturado por n8n Instagram.",
    clean(lead.keyword) ? `Keyword: ${clean(lead.keyword)}` : null,
    clean(lead.sourceEvent) ? `Evento: ${clean(lead.sourceEvent)}` : null,
    clean(lead.message) ? `Mensaje: ${clean(lead.message)}` : null,
    clean(lead.barbersCount) ? `Barberos: ${clean(lead.barbersCount)}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const supabase = createServiceRoleClient();
  const duplicateFilters = [
    phone ? `phone.eq.${phone}` : null,
    email ? `email.eq.${email}` : null,
    clean(lead.instagramUsername) ? `instagram_username.eq.${clean(lead.instagramUsername)}` : null,
  ].filter(Boolean) as string[];

  if (duplicateFilters.length > 0) {
    const { data: existing, error: lookupError } = await supabase
      .from("crm_leads")
      .select("id")
      .or(duplicateFilters.join(","))
      .limit(1);

    if (lookupError) {
      return NextResponse.json({ error: "No se pudo comprobar duplicados" }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ ok: true, duplicated: true, id: existing[0].id });
    }
  }

  const { data, error } = await supabase
    .from("crm_leads")
    .insert({
      business_name: lead.barbershopName,
      barbershop_name: lead.barbershopName,
      contact_name: contactName,
      phone,
      whatsapp: phone,
      email,
      city: clean(lead.city),
      country: "ES",
      source: "instagram",
      status: lead.status ?? "new",
      potential_mrr: 0,
      barbers_count: clean(lead.barbersCount),
      instagram_username: clean(lead.instagramUsername),
      lead_temperature: lead.temperature ?? "warm",
      keyword: clean(lead.keyword),
      message: clean(lead.message),
      utm_source: "instagram",
      utm_medium: "organic_social",
      utm_campaign: clean(lead.utmCampaign),
      landing_path: "/instagram",
      notes,
    })
    .select("id, business_name")
    .single();

  if (error) {
    return NextResponse.json({ error: "No se pudo guardar el lead" }, { status: 500 });
  }

  if ((lead.temperature ?? "warm") === "hot") {
    await supabase.from("crm_tasks").insert({
      title: `Seguimiento lead caliente: ${lead.barbershopName}`,
      description: `Lead de Instagram. ${phone ? `WhatsApp: ${phone}. ` : ""}${notes}`,
      priority: "alta",
      status: "pendiente",
      related_type: "lead",
      related_id: data.id,
      due_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
  }

  return NextResponse.json({ ok: true, duplicated: false, id: data.id });
}
