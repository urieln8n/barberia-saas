-- ============================================================
-- Migracion 013: Marketplace público y Auditoría de Seguridad Web
-- ============================================================
-- Ejecutar manualmente en Supabase SQL Editor o con Supabase CLI.
-- No modifica tablas ni migraciones anteriores.
-- Añade dos módulos independientes con aislamiento multi-tenant
-- por barbershop_id y políticas RLS consistentes con el proyecto.
--
-- Dependencias (ya deben existir antes de ejecutar):
--   · public.barbershops           (migración 001)
--   · public.is_barbershop_member  (migración 004, actualizada en 004)
--   · public.set_updated_at        (migración 012)
-- ============================================================


-- ============================================================
-- MÓDULO 1: barbershop_public_profiles
-- ============================================================
-- Perfil público enriquecido de cada barbería para el marketplace.
-- Relación 1:1 con barbershops (UNIQUE en barbershop_id).
-- Las columnas is_published y marketplace_enabled controlan
-- la visibilidad pública de forma independiente:
--   · is_published = true          → perfil visible en /tienda/[slug]
--   · is_published + marketplace_enabled = true → aparece en /marketplace
--   · featured = true              → destacado en portada (solo super_admin)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.barbershop_public_profiles (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tenant: relación 1:1 con la barbería propietaria
  barbershop_id       uuid        NOT NULL
                                  REFERENCES public.barbershops(id)
                                  ON DELETE CASCADE,

  -- URL slug del perfil público.
  -- Debe coincidir con barbershops.slug para coherencia de URLs
  -- (/tienda/[slug] y /r/[slug] usarán el mismo identificador).
  slug                text        NOT NULL,

  -- Datos de presentación pública
  public_name         text        NOT NULL,
  city                text,
  neighborhood        text,
  address             text,
  phone               text,
  whatsapp            text,
  instagram           text,
  website_url         text,
  description         text,
  cover_image_url     text,
  logo_url            text,

  -- Control de visibilidad
  is_published        boolean     NOT NULL DEFAULT false,
  marketplace_enabled boolean     NOT NULL DEFAULT false,
  featured            boolean     NOT NULL DEFAULT false,

  -- Auditoría de fila
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  -- Una sola fila por barbería
  CONSTRAINT barbershop_public_profiles_barbershop_unique
    UNIQUE (barbershop_id),

  -- Slug único en toda la plataforma
  CONSTRAINT barbershop_public_profiles_slug_unique
    UNIQUE (slug),

  -- Slug: solo minúsculas, dígitos y guiones, entre 2 y 80 caracteres
  CONSTRAINT barbershop_public_profiles_slug_format
    CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,78}[a-z0-9]$' OR slug ~ '^[a-z0-9]{2}$'),

  -- Marketplace solo puede activarse si el perfil está publicado
  CONSTRAINT barbershop_public_profiles_marketplace_requires_published
    CHECK (
      marketplace_enabled = false
      OR (marketplace_enabled = true AND is_published = true)
    ),

  -- Featured solo puede activarse si el marketplace está habilitado
  CONSTRAINT barbershop_public_profiles_featured_requires_marketplace
    CHECK (
      featured = false
      OR (featured = true AND marketplace_enabled = true AND is_published = true)
    )
);

COMMENT ON TABLE public.barbershop_public_profiles IS
  'Perfil público enriquecido de cada barbería para el marketplace BarberíaOS. '
  'Relación 1:1 con barbershops. Controlado por is_published y marketplace_enabled.';

COMMENT ON COLUMN public.barbershop_public_profiles.barbershop_id IS
  'Tenant propietario. Único por barbería (1:1 con barbershops). '
  'La eliminación de la barbería elimina el perfil en cascada.';

COMMENT ON COLUMN public.barbershop_public_profiles.slug IS
  'Slug URL del perfil público. Debe coincidir con barbershops.slug. '
  'Formato: solo letras minúsculas, dígitos y guiones (2-80 chars).';

COMMENT ON COLUMN public.barbershop_public_profiles.is_published IS
  'TRUE cuando el perfil está activo y visible en /tienda/[slug]. '
  'Requerido para activar marketplace_enabled.';

COMMENT ON COLUMN public.barbershop_public_profiles.marketplace_enabled IS
  'TRUE cuando la barbería aparece en el listado global /marketplace. '
  'Requiere is_published = true (enforced por CHECK constraint). '
  'Gate de plan recomendado: growth | premium.';

COMMENT ON COLUMN public.barbershop_public_profiles.featured IS
  'TRUE para barberías destacadas en portada del marketplace. '
  'Solo debe activarse desde el panel de super_admin. '
  'Requiere marketplace_enabled = true (enforced por CHECK constraint).';


-- ── Índices ──────────────────────────────────────────────────

-- FK sin índice implícito (el UNIQUE es sobre barbershop_id pero lo cubrimos explícitamente)
CREATE INDEX IF NOT EXISTS idx_bpp_barbershop_id
  ON public.barbershop_public_profiles(barbershop_id);

-- Listado público del marketplace: filtra por ciudad, ordena por reciente.
-- Consulta más frecuente: /marketplace?ciudad=Madrid
CREATE INDEX IF NOT EXISTS idx_bpp_marketplace_city_created
  ON public.barbershop_public_profiles(city, created_at DESC)
  WHERE is_published = true AND marketplace_enabled = true;

-- Barberías destacadas para portada del marketplace
CREATE INDEX IF NOT EXISTS idx_bpp_featured_active
  ON public.barbershop_public_profiles(created_at DESC)
  WHERE featured = true AND is_published = true AND marketplace_enabled = true;


-- ── Trigger updated_at ────────────────────────────────────────

DROP TRIGGER IF EXISTS trg_barbershop_public_profiles_updated_at
  ON public.barbershop_public_profiles;

CREATE TRIGGER trg_barbershop_public_profiles_updated_at
  BEFORE UPDATE ON public.barbershop_public_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE public.barbershop_public_profiles ENABLE ROW LEVEL SECURITY;

-- Lectura pública: cualquier usuario (anon o authenticated) puede leer
-- perfiles que estén publicados y habilitados para el marketplace.
-- Este es el único caso de acceso anónimo en este módulo.
DROP POLICY IF EXISTS "Public can read published marketplace profiles"
  ON public.barbershop_public_profiles;
CREATE POLICY "Public can read published marketplace profiles"
  ON public.barbershop_public_profiles
  FOR SELECT
  USING (is_published = true AND marketplace_enabled = true);

-- Gestión completa: CRUD restringido a miembros autorizados de esa barbería.
-- La función is_barbershop_member verifica barbershop_members + owner fallback.
-- Esta policy cubre también la lectura del propio perfil aunque no esté publicado.
DROP POLICY IF EXISTS "Members can manage their public profile"
  ON public.barbershop_public_profiles;
CREATE POLICY "Members can manage their public profile"
  ON public.barbershop_public_profiles
  FOR ALL
  USING  (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));


-- ============================================================
-- MÓDULO 2: security_audits
-- ============================================================
-- Registra auditorías de seguridad web pasivas por barbería.
-- Cada fila representa un análisis puntual de una URL externa.
-- El campo report (jsonb) almacena el resultado estructurado
-- de los checks: cabeceras HTTP, SSL, datos expuestos, etc.
-- Su estructura exacta se define en src/lib/audit/schemas.ts.
--
-- Ciclo de vida del status:
--   pending → running → done
--                    ↘ error
--
-- Acceso: exclusivamente miembros autorizados de esa barbería.
-- Sin lectura pública. Sin acceso anónimo.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.security_audits (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tenant: necesario para RLS eficiente (desnormalizado intencionalmente,
  -- siguiendo el patrón de cash_movements y otras tablas del proyecto).
  barbershop_id uuid        NOT NULL
                            REFERENCES public.barbershops(id)
                            ON DELETE CASCADE,

  -- URL que se audita (sitio web de la barbería, no la URL de BarberíaOS)
  website_url   text        NOT NULL,

  -- Puntuación global 0-100. NULL mientras el análisis está en curso.
  score         smallint,

  -- Estado del ciclo de vida del análisis
  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'running', 'done', 'error')),

  -- Resultado detallado del análisis en formato JSON.
  -- Estructura esperada definida en src/lib/audit/schemas.ts:
  -- {
  --   checks: [{ name, severity, detail, recommendation }],
  --   summary: { critical, warn, ok },
  --   completed_at: ISO8601
  -- }
  report        jsonb,

  -- Auditoría de fila
  created_at    timestamptz NOT NULL DEFAULT now(),

  -- Validaciones de integridad
  CONSTRAINT security_audits_score_range
    CHECK (score IS NULL OR (score >= 0 AND score <= 100)),

  CONSTRAINT security_audits_url_not_empty
    CHECK (trim(website_url) <> ''),

  -- Previene URLs de esquemas peligrosos (file://, javascript://, etc.)
  -- La validación completa de SSRF se hace en la capa de aplicación.
  CONSTRAINT security_audits_url_scheme
    CHECK (
      website_url LIKE 'https://%'
      OR website_url LIKE 'http://%'
    ),

  -- score solo puede estar presente cuando el análisis está completo
  CONSTRAINT security_audits_score_requires_done
    CHECK (
      score IS NULL
      OR status = 'done'
    )
);

COMMENT ON TABLE public.security_audits IS
  'Auditorías de seguridad web pasivas por barbería. '
  'Cada fila es un análisis puntual de una URL externa con score y detalle JSON. '
  'Solo visible para miembros autorizados de la barbería propietaria.';

COMMENT ON COLUMN public.security_audits.barbershop_id IS
  'Tenant propietario. Desnormalizado para RLS eficiente sin JOIN adicional. '
  'Siguiendo el patrón de cash_movements (migración 012).';

COMMENT ON COLUMN public.security_audits.website_url IS
  'URL del sitio web de la barbería que se audita. '
  'La validación completa de SSRF se realiza en src/lib/audit/scanner.ts '
  'antes de ejecutar el fetch externo.';

COMMENT ON COLUMN public.security_audits.score IS
  'Puntuación global 0-100. NULL mientras status != done. '
  'Enforced por CHECK constraint security_audits_score_requires_done.';

COMMENT ON COLUMN public.security_audits.status IS
  'Ciclo de vida: pending → running → done | error. '
  'La capa de aplicación es responsable de las transiciones de estado.';

COMMENT ON COLUMN public.security_audits.report IS
  'JSON estructurado con el resultado detallado del análisis. '
  'Estructura: { checks: [{name, severity, detail, recommendation}], '
  'summary: {critical, warn, ok}, completed_at }. '
  'Definido en src/lib/audit/schemas.ts.';


-- ── Índices ──────────────────────────────────────────────────

-- Listado de auditorías de una barbería, más reciente primero.
-- Query principal del dashboard /dashboard/auditoria.
CREATE INDEX IF NOT EXISTS idx_security_audits_barbershop_created
  ON public.security_audits(barbershop_id, created_at DESC);

-- Auditorías en proceso (para polling de estado desde la UI).
-- Índice parcial: solo filas activas, mínima superficie.
CREATE INDEX IF NOT EXISTS idx_security_audits_pending_running
  ON public.security_audits(barbershop_id, created_at DESC)
  WHERE status IN ('pending', 'running');

-- Historial de auditorías completadas con score para comparativa.
CREATE INDEX IF NOT EXISTS idx_security_audits_done_score
  ON public.security_audits(barbershop_id, score DESC, created_at DESC)
  WHERE status = 'done';


-- ── Row Level Security ────────────────────────────────────────

ALTER TABLE public.security_audits ENABLE ROW LEVEL SECURITY;

-- Sin lectura pública. Solo miembros autorizados de esa barbería
-- pueden ver y gestionar sus propias auditorías.
DROP POLICY IF EXISTS "Members can manage security audits"
  ON public.security_audits;
CREATE POLICY "Members can manage security audits"
  ON public.security_audits
  FOR ALL
  USING  (public.is_barbershop_member(barbershop_id))
  WITH CHECK (public.is_barbershop_member(barbershop_id));


-- ============================================================
-- NOTA: Gates de plan (implementar en src/lib/plans/limits.ts)
-- ============================================================
-- marketplace_enabled: plan growth | premium
-- security_audits:     plan pro | growth | premium
-- La lógica de gates no vive en SQL sino en la capa de aplicación.
-- Ver src/lib/plans/limits.ts → PlanLimits.modules para el patrón.
-- ============================================================
