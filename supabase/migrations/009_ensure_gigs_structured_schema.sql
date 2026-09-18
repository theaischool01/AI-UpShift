-- ==============================================================================
-- UPSHIFT PLATFORM — ENSURE GIGS STRUCTURED SCHEMA & COLUMNS
-- Migration: 009_ensure_gigs_structured_schema.sql
-- Description: Adds all missing structured job description columns (overview,
--              responsibilities, deliverables, requirements, proof_spec, payment_amount)
--              to public.gigs, cleans obsolete columns, ensures unique constraint
--              for external_gig_id, and reloads PostgREST schema cache.
-- ==============================================================================

-- 1. Add missing structured Job Description & payment columns to public.gigs
ALTER TABLE public.gigs
  ADD COLUMN IF NOT EXISTS payment_amount TEXT,
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS proof_spec TEXT;

-- 2. Backfill overview from long_description if long_description exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'long_description'
  ) THEN
    UPDATE public.gigs
    SET overview = long_description
    WHERE (overview IS NULL OR overview = '') AND long_description IS NOT NULL;
  END IF;
END $$;

-- 3. Safely drop obsolete columns if they still exist
ALTER TABLE public.gigs
  DROP COLUMN IF EXISTS long_description,
  DROP COLUMN IF EXISTS organization,
  DROP COLUMN IF EXISTS origin_site,
  DROP COLUMN IF EXISTS engagement_type,
  DROP COLUMN IF EXISTS location;

-- 4. Ensure external_gig_id has an explicit UNIQUE constraint for PostgREST upsert
DO $$
BEGIN
  -- Drop partial index if present
  DROP INDEX IF EXISTS public.idx_gigs_external_id_unique;
  
  -- Recreate unique constraint idempotently
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gigs_external_gig_id_key' AND table_name = 'gigs'
  ) THEN
    ALTER TABLE public.gigs DROP CONSTRAINT gigs_external_gig_id_key;
  END IF;

  ALTER TABLE public.gigs 
    ADD CONSTRAINT gigs_external_gig_id_key UNIQUE (external_gig_id);
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Constraint notice: %', SQLERRM;
END $$;

-- 5. Ensure explicit foreign key constraint to courses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gigs_course_id_fkey' AND table_name = 'gigs'
  ) THEN
    ALTER TABLE public.gigs
      ADD CONSTRAINT gigs_course_id_fkey 
      FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE RESTRICT;
  END IF;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Foreign key notice: %', SQLERRM;
END $$;

-- 6. Ensure open SELECT RLS policy for learners and public viewers
DROP POLICY IF EXISTS "gigs_select_authenticated" ON public.gigs;
DROP POLICY IF EXISTS "gigs_select_all" ON public.gigs;

CREATE POLICY "gigs_select_all" ON public.gigs
  FOR SELECT USING (true);

-- 7. Ensure admin full management policy on public.gigs
DROP POLICY IF EXISTS "gigs_admin_all" ON public.gigs;
CREATE POLICY "gigs_admin_all" ON public.gigs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. Explicitly notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
