-- ==============================================================================
-- UPSHIFT PLATFORM — ADD LOCAL BUSINESS CLASSIFICATION TO GIGS
-- Migration: 015_add_is_local_business_to_gigs.sql
-- Description:
--   1. Adds `is_local_business` BOOLEAN column to public.gigs defaulting to FALSE.
--   2. Ensures existing records are safely backfilled to FALSE.
--   3. Adds index for performance on local business filtering.
--   4. Reloads PostgREST schema cache.
-- ==============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'is_local_business'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN is_local_business BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- Ensure existing rows are safely backfilled to FALSE
UPDATE public.gigs
SET is_local_business = FALSE
WHERE is_local_business IS NULL;

-- Performance index for local business filtering
CREATE INDEX IF NOT EXISTS idx_gigs_is_local_business 
  ON public.gigs(is_local_business) 
  WHERE is_local_business = TRUE;

-- Explicitly notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
