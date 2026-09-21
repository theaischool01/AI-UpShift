-- ==============================================================================
-- UPSHIFT OPPORTUNITY MARKETPLACE ARCHITECTURE: SORTING, TELEMETRY & PRIORITY
-- Migration: 013_opportunity_marketplace_sorting.sql
-- Description:
--   1. Adds structured sorting & ranking attributes to public.gigs:
--      - priority (INTEGER >= 0)
--      - is_featured (BOOLEAN)
--      - compensation_type (hourly, monthly, fixed, milestone, unspecified)
--      - min_amount & max_amount (NUMERIC for deterministic pay sorting)
--      - currency (TEXT)
--      - posted_at (TIMESTAMPTZ for external publication recency)
--      - updated_at (TIMESTAMPTZ with auto-update trigger)
--   2. Establishes public.gig_interactions for real behavioral telemetry:
--      - Records 'view', 'detail_open', 'apply_click', and 'share' events
--      - Strict RLS ensuring append-only telemetry with immutable historical logs
--   3. RPC function public.get_trending_gigs() for 7-day weighted popularity scores
--   4. Targeted performance indexes for marketplace sort modes
--   5. Safe backfill for existing gigs with deterministic compensation
--   6. Reloads PostgREST schema cache
-- ==============================================================================

-- 1. ADD STRUCTURED MARKETPLACE ATTRIBUTES TO PUBLIC.GIGS
DO $$
BEGIN
  -- Priority ranking integer (0 = Standard, 10 = Elevated, 20 = High, 30 = Urgent)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN priority INTEGER NOT NULL DEFAULT 0;
  END IF;

  -- Featured badge toggle
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
  END IF;

  -- Compensation type enum-like classification
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'compensation_type'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN compensation_type TEXT DEFAULT 'fixed';
  END IF;

  -- Normalized numeric compensation ranges
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'min_amount'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN min_amount NUMERIC(12,2) NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'max_amount'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN max_amount NUMERIC(12,2) NULL;
  END IF;

  -- ISO Currency code (e.g. INR, USD)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN currency TEXT DEFAULT 'INR';
  END IF;

  -- External publication timestamp (distinct from import created_at)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'posted_at'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN posted_at TIMESTAMPTZ NULL;
  END IF;

  -- Updated_at audit timestamp
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

-- Add check constraints idempotently
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gigs_priority_non_negative'
  ) THEN
    ALTER TABLE public.gigs ADD CONSTRAINT gigs_priority_non_negative CHECK (priority >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gigs_compensation_type_valid'
  ) THEN
    ALTER TABLE public.gigs ADD CONSTRAINT gigs_compensation_type_valid 
      CHECK (compensation_type IN ('hourly', 'monthly', 'fixed', 'milestone', 'unspecified'));
  END IF;
END $$;

-- 2. CREATE TABLE: PUBLIC.GIG_INTERACTIONS (TELEMETRY)
CREATE TABLE IF NOT EXISTS public.gig_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'detail_open', 'apply_click', 'share')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_gigs_active_priority_created 
  ON public.gigs(is_active, is_featured DESC, priority DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gigs_active_pay_sort 
  ON public.gigs(is_active, max_amount DESC NULLS LAST, min_amount DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_gigs_active_posted_sort 
  ON public.gigs(is_active, posted_at DESC NULLS LAST, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gig_interactions_gig_recent 
  ON public.gig_interactions(gig_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gig_interactions_event_recent 
  ON public.gig_interactions(event_type, created_at DESC);

-- 4. ROW LEVEL SECURITY FOR GIG_INTERACTIONS
ALTER TABLE public.gig_interactions ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated clients to insert interaction events (Append-Only Telemetry)
DROP POLICY IF EXISTS "gig_interactions_insert_all" ON public.gig_interactions;
CREATE POLICY "gig_interactions_insert_all" ON public.gig_interactions
  FOR INSERT WITH CHECK (true);

-- Restrict direct selection to Admins and event owners (Aggregations handled via RPC)
DROP POLICY IF EXISTS "gig_interactions_select_policy" ON public.gig_interactions;
CREATE POLICY "gig_interactions_select_policy" ON public.gig_interactions
  FOR SELECT USING (public.is_admin() OR auth.uid() = user_id);

-- Explicitly disallow client updates and deletes on telemetry logs
DROP POLICY IF EXISTS "gig_interactions_update_none" ON public.gig_interactions;
DROP POLICY IF EXISTS "gig_interactions_delete_none" ON public.gig_interactions;

-- 5. RPC FUNCTION: 7-DAY WEIGHTED TRENDING SCORES
CREATE OR REPLACE FUNCTION public.get_trending_gigs(
  days_window INT DEFAULT 7,
  result_limit INT DEFAULT 100
)
RETURNS TABLE (
  gig_id UUID,
  interaction_score BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    gi.gig_id,
    SUM(
      CASE 
        WHEN gi.event_type = 'apply_click' THEN 5
        WHEN gi.event_type = 'share' THEN 3
        WHEN gi.event_type = 'detail_open' THEN 2
        WHEN gi.event_type = 'view' THEN 1
        ELSE 1
      END
    )::BIGINT AS interaction_score
  FROM public.gig_interactions gi
  JOIN public.gigs g ON g.id = gi.gig_id
  WHERE g.is_active = true 
    AND gi.created_at >= (now() - (days_window || ' days')::INTERVAL)
  GROUP BY gi.gig_id
  ORDER BY interaction_score DESC
  LIMIT result_limit;
$$;

-- 6. TRIGGER FOR GIGS.UPDATED_AT
DROP TRIGGER IF EXISTS trigger_gigs_updated_at ON public.gigs;
CREATE TRIGGER trigger_gigs_updated_at
  BEFORE UPDATE ON public.gigs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. SAFE BACKFILL FOR EXISTING GIGS
UPDATE public.gigs
SET 
  compensation_type = 'hourly',
  min_amount = 25.00,
  max_amount = 25.00,
  currency = 'USD'
WHERE payment_amount ILIKE '%$25/hr%' AND min_amount IS NULL;

UPDATE public.gigs
SET 
  compensation_type = 'hourly',
  min_amount = 35.00,
  max_amount = 35.00,
  currency = 'USD'
WHERE payment_amount ILIKE '%$35/hr%' AND min_amount IS NULL;

UPDATE public.gigs
SET 
  compensation_type = 'hourly',
  min_amount = 30.00,
  max_amount = 30.00,
  currency = 'USD'
WHERE payment_amount ILIKE '%$30/hr%' AND min_amount IS NULL;

-- 8. RELOAD POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
