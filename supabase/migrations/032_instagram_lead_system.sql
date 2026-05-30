-- ============================================================
-- Migracion 032: Instagram Lead System para BarberiaOS
-- ============================================================
-- No destructiva:
-- - Extiende crm_leads como tabla unica de leads comerciales.
-- - Anade tracking UTM/origen Instagram.
-- - Amplia estados canonicos: new, contacted, demo_booked, closed, lost.
-- - Mantiene compatibilidad con estados historicos del Founder CRM.
-- ============================================================

alter table public.crm_leads
  add column if not exists whatsapp text,
  add column if not exists barbershop_name text,
  add column if not exists barbers_count text,
  add column if not exists current_system text,
  add column if not exists main_problem text,
  add column if not exists interest text,
  add column if not exists message text,
  add column if not exists instagram_username text,
  add column if not exists lead_temperature text default 'warm',
  add column if not exists keyword text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists landing_path text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

update public.crm_leads
set whatsapp = phone
where whatsapp is null
  and phone is not null;

update public.crm_leads
set barbershop_name = business_name
where barbershop_name is null
  and business_name is not null;

update public.crm_leads
set utm_source = source
where utm_source is null
  and source is not null;

update public.crm_leads
set lead_temperature = 'warm'
where lead_temperature is null
   or lead_temperature not in ('cold', 'warm', 'hot');

update public.crm_leads
set status = 'demo_booked'
where status = 'demo_agendada';

update public.crm_leads
set status = 'closed'
where status in ('ganado', 'won');

update public.crm_leads
set status = 'lost'
where status in ('perdido');

update public.crm_leads
set source = 'instagram'
where utm_source = 'instagram'
  and (source is null or source = 'barberiaos.com');

do $$
declare
  r record;
begin
  for r in
    select conname
    from pg_constraint
    where conrelid = to_regclass('public.crm_leads')
      and contype = 'c'
      and (
        conname in ('crm_leads_source_check', 'crm_leads_status_check', 'crm_leads_temperature_check')
        or pg_get_constraintdef(oid) ilike '%source in%'
        or pg_get_constraintdef(oid) ilike '%status in%'
        or pg_get_constraintdef(oid) ilike '%lead_temperature in%'
      )
  loop
    execute format('alter table public.crm_leads drop constraint if exists %I', r.conname);
  end loop;
end $$;

alter table public.crm_leads
  add constraint crm_leads_source_check
  check (
    source is null
    or source in (
      'directo',
      'instagram',
      'referido',
      'google',
      'linkedin',
      'feria',
      'otro',
      'barberiaos.com',
      'pedir-demo',
      'calculadora-booksy',
      'barberias-fundadoras',
      'whatsapp',
      'manual',
      'test',
      'web',
      'landing',
      'seo',
      'organic'
    )
  );

alter table public.crm_leads
  add constraint crm_leads_status_check
  check (
    status is null
    or status in (
      'new',
      'contacted',
      'demo_booked',
      'closed',
      'lost',
      'nuevo',
      'contactado',
      'audit_generated',
      'demo_agendada',
      'proposal_sent',
      'propuesta_enviada',
      'trial_activo',
      'won',
      'ganado',
      'perdido',
      'follow_up'
    )
  );

alter table public.crm_leads
  add constraint crm_leads_temperature_check
  check (lead_temperature is null or lead_temperature in ('cold', 'warm', 'hot'));

create index if not exists idx_crm_leads_instagram_username
  on public.crm_leads(instagram_username);

create index if not exists idx_crm_leads_utm_source_created
  on public.crm_leads(utm_source, created_at desc);

create index if not exists idx_crm_leads_temperature_created
  on public.crm_leads(lead_temperature, created_at desc);

comment on column public.crm_leads.utm_source is
  'Origen UTM capturado desde landings comerciales como /instagram.';

comment on column public.crm_leads.lead_temperature is
  'Temperatura comercial usada por n8n para priorizar seguimiento.';
