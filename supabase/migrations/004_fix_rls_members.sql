-- BarberíaOS — Fix RLS barbershop_members
-- Migración: 004_fix_rls_members.sql
-- EJECUTAR en Supabase SQL Editor
--
-- Problema: el onboarding inserta en barbershop_members con el cliente del usuario,
-- pero la policy FOR INSERT requiere is_barbershop_member() → chicken-and-egg.
-- El INSERT fallaba silenciosamente y el owner nunca quedaba registrado.
-- is_barbershop_member() devolvía false → RLS bloqueaba cualquier INSERT posterior.
--
-- Fix 1: Backfill — añadir owners existentes que no están en barbershop_members
-- Fix 2: Actualizar is_barbershop_member() para incluir owner_id como fallback
-- Fix 3: Policy INSERT permisiva para que el owner pueda añadirse como primer miembro


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 1 — Backfill: insertar owners existentes en barbershop_members
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.barbershop_members (barbershop_id, user_id, role)
SELECT id, owner_id, 'owner'
FROM public.barbershops
WHERE owner_id IS NOT NULL
ON CONFLICT (barbershop_id, user_id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 2 — Actualizar is_barbershop_member para incluir owner_id como fallback
-- Esto hace la función robusta ante futuros gaps en barbershop_members.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_barbershop_member(target_barbershop_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.barbershop_members bm
    WHERE bm.barbershop_id = target_barbershop_id
      AND bm.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.barbershops bs
    WHERE bs.id = target_barbershop_id
      AND bs.owner_id = auth.uid()
  );
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- FIX 3 — Policy INSERT en barbershop_members para el owner de la barbería
-- Permite que el dueño se añada como primer miembro sin chicken-and-egg.
-- ─────────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Owner can join as first member" ON public.barbershop_members;
CREATE POLICY "Owner can join as first member" ON public.barbershop_members
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.barbershops bs
      WHERE bs.id = barbershop_id
        AND bs.owner_id = auth.uid()
    )
  );
