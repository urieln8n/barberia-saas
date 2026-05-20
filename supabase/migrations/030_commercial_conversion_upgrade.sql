-- ============================================================
-- Migracion 030: Conversion comercial, leads publicos y demo premium
-- Version corregida / idempotente
-- ============================================================
-- No destructiva:
-- - Amplia checks de crm_leads para leads web.
-- - Elimina constraints existentes antes de recrearlos.
-- - Prepara indices de deduplicacion basica.
-- - Limpia/crea la demo publica demo-barber con datos profesionales.
-- - Evita ON CONFLICT en schedules por si no existe constraint unique.
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- 1) Preparar crm_leads para captacion web
-- ============================================================

alter table public.crm_leads
  add column if not exists source text,
  add column if not exists status text default 'new',
  add column if not exists phone text,
  add column if not exists whatsapp text,
  add column if not exists email text,
  add column if not exists barbershop_name text,
  add column if not exists city text,
  add column if not exists barbers_count text,
  add column if not exists current_system text,
  add column if not exists main_problem text,
  add column if not exists interest text,
  add column if not exists message text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table public.crm_leads
  alter column status set default 'new';

alter table public.crm_leads
  alter column source set default 'barberiaos.com';

-- Backfill basico entre phone y whatsapp
update public.crm_leads
set phone = whatsapp
where phone is null
  and whatsapp is not null;

update public.crm_leads
set whatsapp = phone
where whatsapp is null
  and phone is not null;

-- Normalizar source vacio
update public.crm_leads
set source = 'barberiaos.com'
where source is null
   or btrim(source) = '';

-- Normalizar status vacio o variantes comunes
update public.crm_leads
set status = 'new'
where status is null
   or btrim(status) = ''
   or status in ('pending', 'pendiente', 'Nueva');

-- Limpiar valores source no permitidos antes del check
update public.crm_leads
set source = 'otro'
where source is not null
  and source not in (
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
  );

-- Limpiar valores status no permitidos antes del check
update public.crm_leads
set status = 'new'
where status is not null
  and status not in (
    'new',
    'nuevo',
    'contacted',
    'contactado',
    'audit_generated',
    'demo_agendada',
    'proposal_sent',
    'propuesta_enviada',
    'trial_activo',
    'won',
    'ganado',
    'lost',
    'perdido',
    'follow_up'
  );

-- ============================================================
-- 2) Eliminar constraints previos de source/status
-- ============================================================

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
        conname = 'crm_leads_source_check'
        or pg_get_constraintdef(oid) ilike '%source in%'
        or pg_get_constraintdef(oid) ilike '%source = any%'
      )
  loop
    execute format('alter table public.crm_leads drop constraint if exists %I', r.conname);
  end loop;
end $$;

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
        conname = 'crm_leads_status_check'
        or pg_get_constraintdef(oid) ilike '%status in%'
        or pg_get_constraintdef(oid) ilike '%status = any%'
      )
  loop
    execute format('alter table public.crm_leads drop constraint if exists %I', r.conname);
  end loop;
end $$;

-- ============================================================
-- 3) Crear constraints nuevos y ampliados
-- ============================================================

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
      'nuevo',
      'contacted',
      'contactado',
      'audit_generated',
      'demo_agendada',
      'proposal_sent',
      'propuesta_enviada',
      'trial_activo',
      'won',
      'ganado',
      'lost',
      'perdido',
      'follow_up'
    )
  );

-- ============================================================
-- 4) Indices para busqueda/deduplicacion basica
-- ============================================================

create index if not exists idx_crm_leads_phone
  on public.crm_leads(phone);

create index if not exists idx_crm_leads_whatsapp
  on public.crm_leads(whatsapp);

create index if not exists idx_crm_leads_email
  on public.crm_leads(email);

create index if not exists idx_crm_leads_source_created
  on public.crm_leads(source, created_at desc);

create index if not exists idx_crm_leads_status_created
  on public.crm_leads(status, created_at desc);

-- ============================================================
-- 5) Crear / actualizar barberia demo premium
-- ============================================================

insert into public.barbershops (
  name,
  slug,
  phone,
  address,
  city,
  public_booking_enabled
)
select
  'Barbería Demo Studio Barcelona',
  'demo-barber',
  '+34 600 123 456',
  'Carrer de la Marina 123',
  'Barcelona',
  true
where not exists (
  select 1
  from public.barbershops
  where slug = 'demo-barber'
);

update public.barbershops
set
  name = 'Barbería Demo Studio Barcelona',
  phone = '+34 600 123 456',
  address = 'Carrer de la Marina 123',
  city = 'Barcelona',
  public_booking_enabled = true
where slug = 'demo-barber';

-- ============================================================
-- 6) Perfil publico premium demo-barber
-- ============================================================

update public.barbershop_public_profiles p
set
  slug = 'demo-barber',
  public_slug = 'demo-barber',
  city = 'Barcelona',
  neighborhood = 'Marina',
  description = 'Reservas online, cortes premium y atención sin esperas.',
  short_description = 'Reservas online, cortes premium y atención sin esperas.',
  long_description = 'Demo interactiva de BarberíaOS para ver cómo una barbería puede recibir reservas desde Instagram, Google, WhatsApp o QR sin que el cliente descargue ninguna app.',
  whatsapp = '+34 600 123 456',
  is_published = true,
  marketplace_enabled = false
from public.barbershops bs
where bs.id = p.barbershop_id
  and bs.slug = 'demo-barber';

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
  and not exists (
    select 1
    from public.barbershop_public_profiles p
    where p.barbershop_id = bs.id
  );

-- ============================================================
-- 7) Servicios demo premium
-- ============================================================

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
update public.services s
set
  duration_minutes = ds.duration_minutes,
  price = ds.price,
  active = true
from demo, desired_services ds
where s.barbershop_id = demo.id
  and s.name = ds.name;

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
insert into public.services (
  barbershop_id,
  name,
  duration_minutes,
  price,
  active,
  created_at
)
select
  demo.id,
  ds.name,
  ds.duration_minutes,
  ds.price,
  true,
  now() + (ds.sort_order || ' seconds')::interval
from demo
cross join desired_services ds
where not exists (
  select 1
  from public.services s
  where s.barbershop_id = demo.id
    and s.name = ds.name
);

-- ============================================================
-- 8) Barberos demo premium
-- ============================================================

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
update public.barbers b
set active = true
from demo, desired_barbers db
where b.barbershop_id = demo.id
  and b.name = db.name;

with demo as (
  select id from public.barbershops where slug = 'demo-barber'
),
desired_barbers(name, sort_order) as (
  values ('Dani', 1), ('Leo', 2), ('Marco', 3)
)
insert into public.barbers (
  barbershop_id,
  name,
  active,
  created_at
)
select
  demo.id,
  db.name,
  true,
  now() + (db.sort_order || ' seconds')::interval
from demo
cross join desired_barbers db
where not exists (
  select 1
  from public.barbers b
  where b.barbershop_id = demo.id
    and b.name = db.name
);

-- ============================================================
-- 9) Horarios demo sin depender de ON CONFLICT
-- ============================================================

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
update public.barber_schedules s
set
  start_time = '10:00'::time,
  end_time = '20:00'::time,
  active = true
from demo_barbers db, weekdays
where s.barbershop_id = db.barbershop_id
  and s.barber_id = db.barber_id
  and s.weekday = weekdays.weekday
  and s.start_time = '10:00'::time
  and s.end_time = '20:00'::time;

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
insert into public.barber_schedules (
  barbershop_id,
  barber_id,
  weekday,
  start_time,
  end_time,
  active
)
select
  db.barbershop_id,
  db.barber_id,
  weekdays.weekday,
  '10:00'::time,
  '20:00'::time,
  true
from demo_barbers db
cross join weekdays
where not exists (
  select 1
  from public.barber_schedules s
  where s.barbershop_id = db.barbershop_id
    and s.barber_id = db.barber_id
    and s.weekday = weekdays.weekday
    and s.start_time = '10:00'::time
    and s.end_time = '20:00'::time
);