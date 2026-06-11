-- ============================================================
-- Migración 040: Campos de perfil público para barberos
-- ============================================================
-- bio, specialty e instagram_url permiten que cada barbero
-- tenga un perfil visible en la página pública de reservas,
-- similar al perfil de profesionales de Booksy.
-- ============================================================

ALTER TABLE public.barbers
  ADD COLUMN IF NOT EXISTS bio          TEXT,
  ADD COLUMN IF NOT EXISTS specialty    TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url TEXT;

-- Permite que la página pública muestre valoraciones de barberos.
-- Sin esta política, el cliente anónimo no puede leer ninguna reseña.
DROP POLICY IF EXISTS "Public can read published reviews" ON public.reviews;
CREATE POLICY "Public can read published reviews"
  ON public.reviews
  FOR SELECT
  USING (is_public = true);

-- ============================================================
-- END OF MIGRATION
-- ============================================================
