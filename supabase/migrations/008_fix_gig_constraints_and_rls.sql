-- ==============================================================================
-- UPSHIFT PLATFORM — GIGS CONSTRAINTS & RLS POLICY REPAIR
-- Migration: 008_fix_gig_constraints_and_rls.sql
-- Description: Adds explicit UNIQUE constraint on public.gigs(external_gig_id)
--              to support PostgREST ON CONFLICT upsert, and ensures open SELECT
--              RLS policy for authenticated learners and public viewers.
-- ==============================================================================

-- 1. Ensure external_gig_id has an explicit UNIQUE constraint
DO $$
BEGIN
  -- Drop existing partial index if present to prevent naming conflicts
  DROP INDEX IF EXISTS public.idx_gigs_external_id_unique;
  
  -- Drop constraint if already exists to ensure clean idempotency
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'gigs_external_gig_id_key' AND table_name = 'gigs'
  ) THEN
    ALTER TABLE public.gigs DROP CONSTRAINT gigs_external_gig_id_key;
  END IF;

  -- Add explicit unique constraint on external_gig_id
  ALTER TABLE public.gigs 
    ADD CONSTRAINT gigs_external_gig_id_key UNIQUE (external_gig_id);
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Constraint adjustment notice: %', SQLERRM;
END $$;

-- 2. Ensure explicit foreign key constraint to courses table
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
    RAISE NOTICE 'Foreign key adjustment notice: %', SQLERRM;
END $$;

-- 3. Ensure SELECT policy on public.gigs is globally available to learners & public
DROP POLICY IF EXISTS "gigs_select_authenticated" ON public.gigs;
DROP POLICY IF EXISTS "gigs_select_all" ON public.gigs;

CREATE POLICY "gigs_select_all" ON public.gigs
  FOR SELECT USING (true);

-- 4. Ensure admin full management policy on public.gigs
DROP POLICY IF EXISTS "gigs_admin_all" ON public.gigs;
CREATE POLICY "gigs_admin_all" ON public.gigs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';
