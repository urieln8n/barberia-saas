-- ============================================================
-- Migración 005: Super admin flag para el creador de la plataforma
-- ============================================================
-- EJECUTAR MANUALMENTE en Supabase SQL Editor.
-- No destructiva: solo añade una columna con DEFAULT FALSE.
-- ============================================================

-- 1. Añadir campo is_super_admin a profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN profiles.is_super_admin IS
  'Flag de plataforma. Solo el creador/fundador tiene TRUE. Nunca exponer en frontend de barberías.';

-- 2. Activar el flag para el creador (reemplaza con tu email real)
-- INSTRUCCIÓN: Ejecuta esta línea después de desplegar, con tu email:
--
--   UPDATE profiles SET is_super_admin = TRUE WHERE email = 'tu@email.com';
--
-- IMPORTANTE: No incluyas emails reales en este archivo.
-- ============================================================
