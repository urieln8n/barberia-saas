-- ============================================================
-- Migracion 024: Horarios reales por barbero
-- ============================================================
-- No destructiva: crea una tabla nueva y no modifica reservas.
-- Permite configurar ventanas semanales por barbero.
-- weekday usa ISO simple para UI: 0 domingo, 1 lunes ... 6 sabado.
-- ============================================================

create table if not exists public.barber_schedules (
  id uuid primary key default gen_random_uuid(),
  barbershop_id uuid not null references public.barbershops(id) on delete cascade,
  barber_id uuid not null references public.barbers(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint barber_schedules_valid_time check (start_time < end_time),
  constraint barber_schedules_unique_window unique (barber_id, weekday, start_time, end_time)
);

create index if not exists idx_barber_schedules_barbershop_weekday
  on public.barber_schedules(barbershop_id, weekday)
  where active = true;

create index if not exists idx_barber_schedules_barber_weekday
  on public.barber_schedules(barber_id, weekday)
  where active = true;

alter table public.barber_schedules enable row level security;

create policy "Members can manage barber schedules"
  on public.barber_schedules
  for all
  using (public.is_barbershop_member(barbershop_id))
  with check (
    public.is_barbershop_member(barbershop_id)
    and exists (
      select 1
      from public.barbers b
      where b.id = barber_schedules.barber_id
        and b.barbershop_id = barber_schedules.barbershop_id
    )
  );

create policy "Public booking can read active barber schedules"
  on public.barber_schedules
  for select
  using (
    active = true
    and exists (
      select 1
      from public.barbershops bs
      where bs.id = barber_schedules.barbershop_id
        and bs.public_booking_enabled = true
    )
  );

create or replace function public.touch_barber_schedules_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_barber_schedules_updated_at on public.barber_schedules;

create trigger trg_barber_schedules_updated_at
before update on public.barber_schedules
for each row
execute function public.touch_barber_schedules_updated_at();
