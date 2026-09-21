-- ==============================================================================
-- UPSHIFT PLATFORM — CANONICAL GIGS COMPENSATION & MARKETPLACE SCHEMA
-- Migration: 014_ensure_gigs_compensation_and_marketplace_schema.sql
-- Description:
--   1. Ensures all canonical columns exist on public.gigs:
--      - compensation_type (TEXT, default 'fixed')
--      - payment_amount (TEXT)
--      - min_amount (NUMERIC(12,2))
--      - max_amount (NUMERIC(12,2))
--      - currency (TEXT, default 'INR')
--      - priority (INTEGER, default 0)
--      - is_featured (BOOLEAN, default false)
--      - posted_at (TIMESTAMPTZ)
--      - updated_at (TIMESTAMPTZ, default now())
--      - overview (TEXT)
--      - responsibilities (JSONB)
--      - deliverables (JSONB)
--      - requirements (JSONB)
--      - proof_spec (TEXT)
--   2. Adds check constraints safely and idempotently.
--   3. Reloads PostgREST schema cache.
-- ==============================================================================

DO $$
BEGIN
  -- 1. compensation_type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'compensation_type'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN compensation_type TEXT DEFAULT 'fixed';
  END IF;

  -- 2. payment_amount
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'payment_amount'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN payment_amount TEXT;
  END IF;

  -- 3. min_amount & max_amount
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

  -- 4. currency
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN currency TEXT DEFAULT 'INR';
  END IF;

  -- 5. priority
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN priority INTEGER NOT NULL DEFAULT 0;
  END IF;

  -- 6. is_featured
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;
  END IF;

  -- 7. posted_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'posted_at'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN posted_at TIMESTAMPTZ NULL;
  END IF;

  -- 8. updated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;

  -- 9. structured JD fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'overview'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN overview TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'responsibilities'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN responsibilities JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'deliverables'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN deliverables JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'requirements'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN requirements JSONB DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'proof_spec'
  ) THEN
    ALTER TABLE public.gigs ADD COLUMN proof_spec TEXT;
  END IF;
END $$;

-- 10. Constraints & Validation
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
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Constraint notice: %', SQLERRM;
END $$;

-- 11. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_gigs_active_priority_created 
  ON public.gigs(is_active, is_featured DESC, priority DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gigs_track_id 
  ON public.gigs(track_id);

CREATE INDEX IF NOT EXISTS idx_gigs_compensation_type 
  ON public.gigs(compensation_type);

-- 12. Explicitly notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
