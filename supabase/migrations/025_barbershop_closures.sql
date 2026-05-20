-- ============================================================
-- Migracion 025: Cierres y festivos de barberia
-- ============================================================
-- No destructiva: crea una tabla nueva y no modifica reservas.
-- Un cierre con start_time/end_time en null bloquea el dia completo.
-- Un cierre con horas bloquea solo esa franja.
-- ============================================================

create table if not exists public.barbershop_closures (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  closure_date date not null,
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint barbershop_closures_valid_time check (
    (start_time is null and end_time is null)
    or (start_time is not null and end_time is not null and start_time < end_time)
  ),
  constraint barbershop_closures_unique_window unique (barbershop_id, closure_date, start_time, end_time)
);

create index if not exists idx_barbershop_closures_barbershop_date
  on public.barbershop_closures(barbershop_id, closure_date);

alter table public.barbershop_closures enable row level security;

create policy "Members can manage barbershop closures"
  on public.barbershop_closures
  for all
  using (public.is_barbershop_member(barbershop_id))
  with check (public.is_barbershop_member(barbershop_id));

create policy "Public booking can read closures from public barbershops"
  on public.barbershop_closures
  for select
  using (
    exists (
      select 1
      from public.barbershops bs
      where bs.id = barbershop_closures.barbershop_id
        and bs.public_booking_enabled = true
    )
  );

create or replace function public.touch_barbershop_closures_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_barbershop_closures_updated_at on public.barbershop_closures;

create trigger trg_barbershop_closures_updated_at
before update on public.barbershop_closures
for each row
execute function public.touch_barbershop_closures_updated_at();
