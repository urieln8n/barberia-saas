-- Add location fields to barbershop_public_profiles for the marketplace map
ALTER TABLE barbershop_public_profiles
  ADD COLUMN IF NOT EXISTS latitude        numeric,
  ADD COLUMN IF NOT EXISTS longitude       numeric,
  ADD COLUMN IF NOT EXISTS google_maps_url text,
  ADD COLUMN IF NOT EXISTS map_visible     boolean NOT NULL DEFAULT true;

-- Validate lat/lng ranges only when values are provided
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_bbp_latitude' AND conrelid = 'barbershop_public_profiles'::regclass
  ) THEN
    ALTER TABLE barbershop_public_profiles
      ADD CONSTRAINT chk_bbp_latitude
        CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_bbp_longitude' AND conrelid = 'barbershop_public_profiles'::regclass
  ) THEN
    ALTER TABLE barbershop_public_profiles
      ADD CONSTRAINT chk_bbp_longitude
        CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
  END IF;
END $$;

-- Index for map queries filtering by published + marketplace_enabled shops with coordinates
CREATE INDEX IF NOT EXISTS idx_bbp_location
  ON barbershop_public_profiles (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    AND is_published = true
    AND marketplace_enabled = true
    AND map_visible = true;
