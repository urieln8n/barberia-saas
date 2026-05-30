import { NextResponse } from "next/server";
import { isPlatformAdmin } from "@/src/lib/permissions/admin";
import { createClient } from "@/src/lib/supabase/server";

const ALLOWED_STATUSES = ["new", "contacted", "demo_booked", "closed", "lost"] as const;
const ALLOWED_SOURCES = [
  "directo",
  "instagram",
  "referido",
  "google",
  "linkedin",
  "feria",
  "otro",
  "barberiaos.com",
  "pedir-demo",
  "calculadora-booksy",
  "barberias-fundadoras",
  "whatsapp",
  "manual",
  "test",
  "web",
  "landing",
  "seo",
  "organic",
] as const;

function isLeadStatus(value: string): value is (typeof ALLOWED_STATUSES)[number] {
  return (ALLOWED_STATUSES as readonly string[]).includes(value);
}

function isLeadSource(value: string): value is (typeof ALLOWED_SOURCES)[number] {
  return (ALLOWED_SOURCES as readonly string[]).includes(value);
}

export async function GET(request: Request) {
  if (!(await isPlatformAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const source = searchParams.get("source");

  const supabase = await createClient();
  let query = supabase
    .from("crm_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    if (!isLeadStatus(status)) {
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
    }
    query = query.eq("status", status);
  }

  if (source) {
    if (!isLeadSource(source)) {
      return NextResponse.json({ error: "Origen no válido" }, { status: 400 });
    }
    query = query.eq("source", source);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: data ?? [] });
}
