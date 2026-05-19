-- Align public marketplace profiles with /barberias/[city]/[slug].
-- Non destructive: no drops, no renames, no old migration edits.

ALTER TABLE public.barbershop_public_profiles
  ADD COLUMN IF NOT EXISTS public_slug text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS marketplace_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS profile_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Keep legacy/current slug intact, but make public_slug available for the
-- new city + slug public URL. This only backfills empty public_slug values.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'barbershops'
      AND column_name = 'slug'
  ) THEN
    UPDATE public.barbershop_public_profiles AS bpp
    SET public_slug = bs.slug
    FROM public.barbershops AS bs
    WHERE bpp.barbershop_id = bs.id
      AND NULLIF(btrim(bpp.public_slug), '') IS NULL
      AND NULLIF(btrim(bs.slug), '') IS NOT NULL;
  END IF;
END $$;

-- Optional compatibility backfill when the historical profile slug exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'barbershop_public_profiles'
      AND column_name = 'slug'
  ) THEN
    UPDATE public.barbershop_public_profiles
    SET public_slug = slug
    WHERE NULLIF(btrim(public_slug), '') IS NULL
      AND NULLIF(btrim(slug), '') IS NOT NULL;
  END IF;
END $$;

-- Mirror existing public copy into the new richer copy fields without
-- overwriting explicit values.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'barbershop_public_profiles'
      AND column_name = 'description'
  ) THEN
    UPDATE public.barbershop_public_profiles
    SET short_description = COALESCE(NULLIF(btrim(short_description), ''), description),
        long_description = COALESCE(NULLIF(btrim(long_description), ''), description)
    WHERE description IS NOT NULL
      AND (
        NULLIF(btrim(short_description), '') IS NULL
        OR NULLIF(btrim(long_description), '') IS NULL
      );
  END IF;
END $$;

-- Compatibility with the older "featured" flag. Do not rename it; copy only
-- into empty/default is_featured rows.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'barbershop_public_profiles'
      AND column_name = 'featured'
  ) THEN
    UPDATE public.barbershop_public_profiles
    SET is_featured = featured
    WHERE featured = true
      AND is_featured = false;
  END IF;
END $$;

-- Safe unique index for published city URLs. If duplicates already exist,
-- the migration does not fail; it reports the issue so it can be resolved
-- before re-running the index creation manually.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.barbershop_public_profiles
    WHERE NULLIF(btrim(city), '') IS NOT NULL
      AND NULLIF(btrim(public_slug), '') IS NOT NULL
    GROUP BY lower(btrim(city)), lower(btrim(public_slug))
    HAVING count(*) > 1
  ) THEN
    RAISE NOTICE 'Skipping idx_bpp_city_public_slug_unique: duplicate city + public_slug values exist.';
  ELSE
    CREATE UNIQUE INDEX IF NOT EXISTS idx_bpp_city_public_slug_unique
      ON public.barbershop_public_profiles (
        lower(btrim(city)),
        lower(btrim(public_slug))
      )
      WHERE NULLIF(btrim(city), '') IS NOT NULL
        AND NULLIF(btrim(public_slug), '') IS NOT NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bpp_city_public_slug_published
  ON public.barbershop_public_profiles (
    lower(btrim(city)),
    lower(btrim(public_slug)),
    profile_score DESC,
    updated_at DESC
  )
  WHERE is_published = true
    AND marketplace_enabled = true
    AND NULLIF(btrim(city), '') IS NOT NULL
    AND NULLIF(btrim(public_slug), '') IS NOT NULL;
