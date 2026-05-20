-- ============================================================
-- Migración 027: Reforzar aislamiento de tenant en services y barbers
-- ============================================================
-- Problema: Las policies "Public can read active services/barbers"
-- de la migración 001 permiten leer TODOS los servicios y barberos
-- activos de TODAS las barberías, sin filtro por barbería.
-- Esto permite enumerar precios y equipos de clientes competidores.
--
-- Fix: Reemplazar con policies que sólo exponen servicios/barberos
-- de barberías que tienen public_booking_enabled = true.
-- La página pública /r/[slug] ya filtra por barbershop_id, por lo
-- que este cambio no altera el comportamiento de reservas públicas.
--
-- No destructivo: no elimina datos, no modifica tablas.
-- Compatible con datos existentes.
-- ============================================================

-- ── services ────────────────────────────────────────────────

DROP POLICY IF EXISTS "Public can read active services" ON public.services;

CREATE POLICY "Public booking: read active services from public barbershops"
  ON public.services
  FOR SELECT
  USING (
    active = true
    AND EXISTS (
      SELECT 1
      FROM public.barbershops bs
      WHERE bs.id = services.barbershop_id
        AND bs.public_booking_enabled = true
    )
  );

-- ── barbers ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "Public can read active barbers" ON public.barbers;

CREATE POLICY "Public booking: read active barbers from public barbershops"
  ON public.barbers
  FOR SELECT
  USING (
    active = true
    AND EXISTS (
      SELECT 1
      FROM public.barbershops bs
      WHERE bs.id = barbers.barbershop_id
        AND bs.public_booking_enabled = true
    )
  );

-- ── Índice de soporte para el subquery EXISTS ───────────────
-- Evita seq-scan en barbershops al resolver las policies.

CREATE INDEX IF NOT EXISTS idx_barbershops_public_booking_enabled
  ON public.barbershops(id)
  WHERE public_booking_enabled = true;
