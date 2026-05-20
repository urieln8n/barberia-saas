import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/src/lib/supabase/service-role";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const DEFAULT_BATCH_SIZE = 10;

type AutomationEventRow = {
  id: string;
  barbershop_id: string;
  event_type: string;
  payload: unknown;
  attempts: number;
  idempotency_key: string;
  created_at: string;
};

function getAutomationSecret() {
  return process.env.N8N_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET || "";
}

function getBearerToken(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  if (!auth.toLowerCase().startsWith("bearer ")) return null;
  return auth.slice("bearer ".length).trim();
}

function isAuthorized(request: Request) {
  const secret = getAutomationSecret();
  const provided =
    getBearerToken(request) || request.headers.get("x-webhook-secret") || "";

  return Boolean(secret) && provided === secret;
}

function getN8nWebhookUrl() {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const isLocal =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname.endsWith(".local");

    if (isLocal) return null;
    return url;
  } catch {
    return null;
  }
}

async function markFailed({
  event,
  error,
}: {
  event: AutomationEventRow;
  error: string;
}) {
  const supabase = createServiceRoleClient();
  const nextAttempts = event.attempts + 1;

  await supabase
    .from("automation_events")
    .update({
      status: nextAttempts >= MAX_ATTEMPTS ? "failed" : "pending",
      attempts: nextAttempts,
      last_error: error.slice(0, 1000),
    })
    .eq("id", event.id);
}

async function dispatchEvent(event: AutomationEventRow, webhookUrl: string) {
  const secret = getAutomationSecret();
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-webhook-secret": secret,
      "x-idempotency-key": event.idempotency_key,
    },
    body: JSON.stringify({
      id: event.id,
      event_type: event.event_type,
      barbershop_id: event.barbershop_id,
      payload: event.payload,
      idempotency_key: event.idempotency_key,
      created_at: event.created_at,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `n8n responded ${response.status}${body ? `: ${body.slice(0, 300)}` : ""}`
    );
  }
}

export async function POST(request: Request) {
  if (!getAutomationSecret()) {
    return NextResponse.json(
      { error: "Missing N8N_WEBHOOK_SECRET or WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhookUrl = getN8nWebhookUrl();
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Missing valid N8N_WEBHOOK_URL production URL" },
      { status: 500 }
    );
  }

  const supabase = createServiceRoleClient();
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    Number(searchParams.get("limit") ?? DEFAULT_BATCH_SIZE) || DEFAULT_BATCH_SIZE,
    25
  );

  const { data, error } = await supabase
    .from("automation_events")
    .select("id, barbershop_id, event_type, payload, attempts, idempotency_key, created_at")
    .in("status", ["pending", "failed"])
    .lt("attempts", MAX_ATTEMPTS)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("automation dispatch query failed", { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const events = (data ?? []) as AutomationEventRow[];
  const results: Array<{ id: string; status: "processed" | "failed"; error?: string }> = [];

  for (const event of events) {
    const nextAttempts = event.attempts + 1;

    await supabase
      .from("automation_events")
      .update({ status: "processing", attempts: nextAttempts, last_error: null })
      .eq("id", event.id)
      .in("status", ["pending", "failed"]);

    try {
      await dispatchEvent(event, webhookUrl);

      await supabase
        .from("automation_events")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("id", event.id);

      console.info("automation event dispatched", {
        eventId: event.id,
        eventType: event.event_type,
      });
      results.push({ id: event.id, status: "processed" });
    } catch (dispatchError) {
      const message =
        dispatchError instanceof Error
          ? dispatchError.message
          : "Unknown dispatch error";

      await markFailed({
        event: { ...event, attempts: nextAttempts - 1 },
        error: message,
      });

      console.error("automation event dispatch failed", {
        eventId: event.id,
        eventType: event.event_type,
        error: message,
      });
      results.push({ id: event.id, status: "failed", error: message });
    }
  }

  return NextResponse.json({
    ok: true,
    dispatched: results.filter((result) => result.status === "processed").length,
    failed: results.filter((result) => result.status === "failed").length,
    results,
  });
}
