-- BarberíaOS initial schema
-- Run in Supabase SQL editor or with Supabase CLI.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz default now()
);

create table if not exists public.barbershops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text unique not null,
  phone text,
  address text,
  city text,
  instagram_url text,
  google_business_url text,
  public_booking_enabled boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.barbershop_members (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','admin','staff')),
  created_at timestamptz default now(),
  unique(barbershop_id, user_id)
);

create table if not exists public.barbers (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  name text not null,
  phone text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  duration_minutes int not null default 30,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  notes text,
  last_visit_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  barber_id uuid references public.barbers(id) on delete set null,
  service_id uuid not null references public.services(id) on delete restrict,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'scheduled' check (status in ('scheduled','confirmed','completed','cancelled','no_show')),
  source text default 'dashboard' check (source in ('dashboard','public_booking','qr','instagram','google','whatsapp','other')),
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  amount numeric(10,2) not null,
  method text not null default 'cash' check (method in ('cash','card','bizum','transfer','other')),
  status text not null default 'paid' check (status in ('paid','pending','refunded','cancelled')),
  created_at timestamptz default now()
);

create index if not exists idx_barbershops_slug on public.barbershops(slug);
create index if not exists idx_services_barbershop on public.services(barbershop_id);
create index if not exists idx_clients_barbershop on public.clients(barbershop_id);
create index if not exists idx_appointments_barbershop_date on public.appointments(barbershop_id, appointment_date);
create index if not exists idx_appointments_barber_date on public.appointments(barber_id, appointment_date);
create index if not exists idx_payments_barbershop_created on public.payments(barbershop_id, created_at);

alter table public.profiles enable row level security;
alter table public.barbershops enable row level security;
alter table public.barbershop_members enable row level security;
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.payments enable row level security;

-- Helper: user belongs to barbershop
create or replace function public.is_barbershop_member(target_barbershop_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.barbershop_members bm
    where bm.barbershop_id = target_barbershop_id
    and bm.user_id = auth.uid()
  );
$$;

-- Basic policies. Review before production.
create policy "Users can read own profile" on public.profiles
for select using (id = auth.uid());

create policy "Users can update own profile" on public.profiles
for update using (id = auth.uid());

create policy "Members can read their barbershops" on public.barbershops
for select using (public.is_barbershop_member(id) or public_booking_enabled = true);

create policy "Members can manage barbers" on public.barbers
for all using (public.is_barbershop_member(barbershop_id))
with check (public.is_barbershop_member(barbershop_id));

create policy "Members can manage services" on public.services
for all using (public.is_barbershop_member(barbershop_id))
with check (public.is_barbershop_member(barbershop_id));

create policy "Public can read active services" on public.services
for select using (active = true);

create policy "Public can read active barbers" on public.barbers
for select using (active = true);

create policy "Members can manage clients" on public.clients
for all using (public.is_barbershop_member(barbershop_id))
with check (public.is_barbershop_member(barbershop_id));

create policy "Members can manage appointments" on public.appointments
for all using (public.is_barbershop_member(barbershop_id))
with check (public.is_barbershop_member(barbershop_id));

create policy "Members can manage payments" on public.payments
for all using (public.is_barbershop_member(barbershop_id))
with check (public.is_barbershop_member(barbershop_id));
