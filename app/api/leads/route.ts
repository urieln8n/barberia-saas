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
  currentSystem: z.string().trim().min(1, "Indica tu sistema actual"),
  mainProblem: z.string().trim().min(1, "Indica el principal problema"),
  interest: z.string().trim().min(1, "Indica tu interés"),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
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
    `Sistema actual: ${lead.currentSystem}`,
    `Problema principal: ${lead.mainProblem}`,
    `Interés: ${lead.interest}`,
    `Barberos: ${lead.barbersCount}`,
    message ? `Mensaje: ${message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await supabase.from("crm_leads").insert({
    business_name: lead.barbershopName,
    contact_name: lead.name,
    phone: lead.whatsapp,
    email,
    city: lead.city,
    country: "ES",
    source: "barberiaos.com",
    status: "new",
    potential_mrr: 0,
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
