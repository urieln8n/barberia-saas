-- ============================================================
-- Migracion 030: Conversion comercial, leads publicos y demo premium
-- ============================================================
-- No destructiva:
-- - Amplia checks de crm_leads para leads web.
-- - Prepara indices de deduplicacion basica.
-- - Limpia/crea la demo publica demo-barber con datos profesionales.
-- ============================================================

create extension if not exists "pgcrypto";

do $$
declare
  constraint_name text;
begin
  select conname
  into constraint_name
  from pg_constraint
  where conrelid = 'public.crm_leads'::regclass
    and pg_get_constraintdef(oid) ilike '%source in%';

  if constraint_name is not null then
    execute format('alter table public.crm_leads drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.crm_leads
  add constraint crm_leads_source_check
  check (source in ('directo','instagram','referido','google','linkedin','feria','otro','barberiaos.com'));

do $$
declare
  constraint_name text;
begin
  select conname
  into constraint_name
  from pg_constraint
  where conrelid = 'public.crm_leads'::regclass
    and pg_get_constraintdef(oid) ilike '%status in%';

  if constraint_name is not null then
    execute format('alter table public.crm_leads drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.crm_leads
  add constraint crm_leads_status_check
  check (status in ('new','nuevo','contactado','demo_agendada','propuesta_enviada','trial_activo','ganado','perdido'));

create index if not exists idx_crm_leads_phone on public.crm_leads(phone);
create index if not exists idx_crm_leads_email on public.crm_leads(email);
create index if not exists idx_crm_leads_source_created on public.crm_leads(source, created_at desc);

insert into public.barbershops (
  name,
  slug,
  phone,
  address,
  city,
  public_booking_enabled
)
values (
  'Barbería Demo Studio Barcelona',
  'demo-barber',
  '+34 600 123 456',
  'Carrer de la Marina 123',
  'Barcelona',
  true
)
on conflict (slug) do update
set
  name = excluded.name,
  phone = excluded.phone,
  address = excluded.address,
  city = excluded.city,
  public_booking_enabled = true;

insert into public.barbershop_public_profiles (
  barbershop_id,
  slug,
  public_slug,
  city,
  neighborhood,
  description,
  short_description,
  long_description,
  whatsapp,
  is_published,
  marketplace_enabled
)
select
  bs.id,
  'demo-barber',
  'demo-barber',
  'Barcelona',
  'Marina',
  'Reservas online, cortes premium y atención sin esperas.',
  'Reservas online, cortes premium y atención sin esperas.',
  'Demo interactiva de BarberíaOS para ver cómo una barbería puede recibir reservas desde Instagram, Google, WhatsApp o QR sin que el cliente descargue ninguna app.',
  '+34 600 123 456',
  true,
  false
from public.barbershops bs
where bs.slug = 'demo-barber'
on conflict (barbershop_id) do update
set
  slug = excluded.slug,
  public_slug = excluded.public_slug,
  city = excluded.city,
  neighborhood = excluded.neighborhood,
  description = excluded.description,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  whatsapp = excluded.whatsapp,
  is_published = true,
  marketplace_enabled = false;

with demo as (
  select id from public.barbershops where slug = 'demo-barber'
),
desired_services(name, duration_minutes, price, sort_order) as (
  values
    ('Corte clásico', 30, 18::numeric, 1),
    ('Degradado premium', 40, 24::numeric, 2),
    ('Corte + barba', 45, 28::numeric, 3),
    ('Arreglo de barba', 25, 15::numeric, 4),
    ('Perfilado + cejas', 20, 12::numeric, 5),
    ('Pack premium', 60, 39::numeric, 6)
)
update public.services s
set active = false
from demo
where s.barbershop_id = demo.id
  and s.name not in (select name from desired_services);

with demo as (
  select id from public.barbershops where slug = 'demo-barber'
),
desired_services(name, duration_minutes, price, sort_order) as (
  values
    ('Corte clásico', 30, 18::numeric, 1),
    ('Degradado premium', 40, 24::numeric, 2),
    ('Corte + barba', 45, 28::numeric, 3),
    ('Arreglo de barba', 25, 15::numeric, 4),
    ('Perfilado + cejas', 20, 12::numeric, 5),
    ('Pack premium', 60, 39::numeric, 6)
)
insert into public.services (barbershop_id, name, duration_minutes, price, active, created_at)
select demo.id, ds.name, ds.duration_minutes, ds.price, true, now() + (ds.sort_order || ' seconds')::interval
from demo
cross join desired_services ds
where not exists (
  select 1
  from public.services s
  where s.barbershop_id = demo.id
    and s.name = ds.name
)
on conflict do nothing;

with demo as (
  select id from public.barbershops where slug = 'demo-barber'
),
desired_services(name, duration_minutes, price, sort_order) as (
  values
    ('Corte clásico', 30, 18::numeric, 1),
    ('Degradado premium', 40, 24::numeric, 2),
    ('Corte + barba', 45, 28::numeric, 3),
    ('Arreglo de barba', 25, 15::numeric, 4),
    ('Perfilado + cejas', 20, 12::numeric, 5),
    ('Pack premium', 60, 39::numeric, 6)
)
update public.services s
set
  duration_minutes = ds.duration_minutes,
  price = ds.price,
  active = true
from demo
join desired_services ds on ds.name = s.name
where s.barbershop_id = demo.id;

with demo as (
  select id from public.barbershops where slug = 'demo-barber'
),
desired_barbers(name, sort_order) as (
  values ('Dani', 1), ('Leo', 2), ('Marco', 3)
)
update public.barbers b
set active = false
from demo
where b.barbershop_id = demo.id
  and b.name not in (select name from desired_barbers);

with demo as (
  select id from public.barbershops where slug = 'demo-barber'
),
desired_barbers(name, sort_order) as (
  values ('Dani', 1), ('Leo', 2), ('Marco', 3)
)
insert into public.barbers (barbershop_id, name, active, created_at)
select demo.id, db.name, true, now() + (db.sort_order || ' seconds')::interval
from demo
cross join desired_barbers db
where not exists (
  select 1
  from public.barbers b
  where b.barbershop_id = demo.id
    and b.name = db.name
)
on conflict do nothing;

with demo as (
  select id from public.barbershops where slug = 'demo-barber'
),
desired_barbers(name) as (
  values ('Dani'), ('Leo'), ('Marco')
)
update public.barbers b
set active = true
from demo
join desired_barbers db on db.name = b.name
where b.barbershop_id = demo.id;

with demo_barbers as (
  select b.id as barber_id, b.barbershop_id
  from public.barbers b
  join public.barbershops bs on bs.id = b.barbershop_id
  where bs.slug = 'demo-barber'
    and b.name in ('Dani', 'Leo', 'Marco')
),
weekdays as (
  select generate_series(1, 6) as weekday
)
insert into public.barber_schedules (barbershop_id, barber_id, weekday, start_time, end_time, active)
select db.barbershop_id, db.barber_id, weekdays.weekday, '10:00'::time, '20:00'::time, true
from demo_barbers db
cross join weekdays
on conflict (barber_id, weekday, start_time, end_time) do update
set active = true;
