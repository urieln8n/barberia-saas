import "server-only";

import { createServiceRoleClient } from "@/src/lib/supabase/service-role";
import type { ShieldAdminAudit, ShieldAdminRequest, ReviewStatus } from "./types";

type RawBarbershop = {
  id: string;
  name: string;
  slug: string | null;
  phone: string | null;
  city: string | null;
};

type RawShieldRequest = {
  id: string;
  url: string;
  status: ReviewStatus;
  notes: string | null;
  created_at: string;
  barbershop_id: string;
  barbershops: RawBarbershop | RawBarbershop[] | null;
};

type RawAudit = {
  id: string;
  barbershop_id: string;
  website_url: string;
  score: number | null;
  created_at: string;
  report: ShieldAdminAudit["report"];
};

function getBarbershop(value: RawShieldRequest["barbershops"]) {
  return Array.isArray(value) ? value[0] ?? null : value;
}

function auditKey(barbershopId: string, url: string) {
  return `${barbershopId}::${url}`;
}

function attachLatestAudits(requests: RawShieldRequest[], audits: RawAudit[]): ShieldAdminRequest[] {
  const latestByRequest = new Map<string, ShieldAdminAudit>();

  audits.forEach((audit) => {
    const key = auditKey(audit.barbershop_id, audit.website_url);
    if (latestByRequest.has(key)) return;

    latestByRequest.set(key, {
      id: audit.id,
      score: audit.score,
      created_at: audit.created_at,
      report: audit.report,
    });
  });

  return requests.map((request) => ({
    id: request.id,
    url: request.url,
    status: request.status,
    notes: request.notes,
    created_at: request.created_at,
    barbershop_id: request.barbershop_id,
    barbershop: getBarbershop(request.barbershops),
    latestAudit: latestByRequest.get(auditKey(request.barbershop_id, request.url)) ?? null,
  }));
}

export async function getShieldManualReviewRequests(limit = 100) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("shield_manual_review_requests")
    .select(`
      id,
      url,
      status,
      notes,
      created_at,
      barbershop_id,
      barbershops:barbershop_id (
        id,
        name,
        slug,
        phone,
        city
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[admin/shield] Failed to load manual review requests:", error.message);
    return { requests: [] as ShieldAdminRequest[], error };
  }

  const rawRequests = (data ?? []) as RawShieldRequest[];
  const barbershopIds = Array.from(new Set(rawRequests.map((request) => request.barbershop_id)));
  const urls = Array.from(new Set(rawRequests.map((request) => request.url)));

  if (barbershopIds.length === 0 || urls.length === 0) {
    return { requests: attachLatestAudits(rawRequests, []), error: null };
  }

  const { data: audits, error: auditsError } = await supabase
    .from("security_audits")
    .select("id, barbershop_id, website_url, score, created_at, report")
    .in("barbershop_id", barbershopIds)
    .in("website_url", urls)
    .eq("status", "done")
    .order("created_at", { ascending: false });

  if (auditsError) {
    console.error("[admin/shield] Failed to load linked audits:", auditsError.message);
  }

  return {
    requests: attachLatestAudits(rawRequests, ((audits ?? []) as RawAudit[])),
    error: null,
  };
}

export async function getShieldManualReviewRequest(id: string) {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("shield_manual_review_requests")
    .select(`
      id,
      url,
      status,
      notes,
      created_at,
      barbershop_id,
      barbershops:barbershop_id (
        id,
        name,
        slug,
        phone,
        city
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    if (error) console.error("[admin/shield] Failed to load manual review request:", error.message);
    return null;
  }

  const request = data as RawShieldRequest;
  const { data: audit, error: auditError } = await supabase
    .from("security_audits")
    .select("id, barbershop_id, website_url, score, created_at, report")
    .eq("barbershop_id", request.barbershop_id)
    .eq("website_url", request.url)
    .eq("status", "done")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (auditError) {
    console.error("[admin/shield] Failed to load linked audit:", auditError.message);
  }

  return attachLatestAudits([request], audit ? [audit as RawAudit] : [])[0] ?? null;
}
