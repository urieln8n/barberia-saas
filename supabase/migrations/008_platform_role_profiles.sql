-- ============================================================
-- Migracion 008: Roles de plataforma en profiles
-- ============================================================
-- EJECUTAR MANUALMENTE en Supabase SQL Editor.
-- No destructiva: anade una columna nullable y mantiene is_super_admin.
-- Compatibilidad: is_super_admin = TRUE sigue dando acceso.
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS platform_role text;

COMMENT ON COLUMN public.profiles.platform_role IS
  'Rol de plataforma. Valores admitidos: super_admin, creator, admin. NULL para usuarios normales de barberia.';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_platform_role_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_platform_role_check
      CHECK (
        platform_role IS NULL
        OR platform_role IN ('super_admin', 'creator', 'admin')
      )
      NOT VALID;
  END IF;
END $$;

-- Backfill seguro para mantener coherencia sin eliminar el flag legacy.
UPDATE public.profiles
SET platform_role = 'super_admin'
WHERE is_super_admin = TRUE
  AND platform_role IS NULL;

-- Helper usado por las RLS de CRM y suscripciones.
-- El nombre se conserva por compatibilidad con migraciones anteriores.
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT
        is_super_admin = TRUE
        OR platform_role IN ('super_admin', 'creator', 'admin')
      FROM public.profiles
      WHERE id = auth.uid()
    ),
    FALSE
  );
$$;
