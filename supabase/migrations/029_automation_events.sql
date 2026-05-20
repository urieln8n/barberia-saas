-- ============================================================
-- Migracion 029: Outbox segura para automatizaciones externas
-- ============================================================
-- n8n nunca necesita SUPABASE_SERVICE_ROLE_KEY.
-- BarberiaOS escribe eventos internos y un endpoint server-side
-- autenticado los despacha a la Production URL de n8n.
-- ============================================================

create table if not exists public.automation_events (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'processed', 'failed')),
  attempts int not null default 0 check (attempts >= 0),
  last_error text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  idempotency_key text not null,
  constraint automation_events_idempotency_key_unique unique (idempotency_key)
);

create index if not exists idx_automation_events_pending
  on public.automation_events(status, created_at)
  where status in ('pending', 'failed');

create index if not exists idx_automation_events_barbershop_created
  on public.automation_events(barbershop_id, created_at desc);

alter table public.automation_events enable row level security;

create policy "Members can read their automation events"
  on public.automation_events
  for select
  using (public.is_barbershop_member(barbershop_id));

-- No insert/update/delete policies for anon/authenticated clients.
-- Writes and dispatch updates happen only from server-side code with service role.
