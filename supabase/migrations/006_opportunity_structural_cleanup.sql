-- ==============================================================================
-- UPSHIFT PLATFORM — OPPORTUNITY STRUCTURAL CLEANUP
-- Migration: 006_opportunity_structural_cleanup.sql
-- Description: Adds structured Job Description columns (overview, responsibilities,
--              deliverables, requirements, proof_spec), backfills overview from
--              long_description, and removes obsolete organization, origin_site,
--              and engagement_type columns.
-- ==============================================================================

-- 1. Add structured Job Description columns to public.gigs
ALTER TABLE public.gigs
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS proof_spec TEXT;

-- 2. Backfill overview from existing long_description where overview is null
UPDATE public.gigs
SET overview = long_description
WHERE overview IS NULL OR overview = '';

-- 3. Drop obsolete indexes if they exist
DROP INDEX IF EXISTS public.idx_gigs_origin_site;
DROP INDEX IF EXISTS public.idx_gigs_site_url;

-- 4. Safely drop obsolete columns (organization, origin_site, engagement_type)
-- Note: location is retained in schema as an optional admin attribute.
ALTER TABLE public.gigs
  DROP COLUMN IF EXISTS organization,
  DROP COLUMN IF EXISTS origin_site,
  DROP COLUMN IF EXISTS engagement_type;

-- 5. Notify PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';
