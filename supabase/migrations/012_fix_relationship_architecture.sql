-- ==============================================================================
-- UPSHIFT ARCHITECTURE REPAIR: FIX DATABASE RELATIONSHIP AMBIGUITY
-- Migration: 012_fix_relationship_architecture.sql
-- Description:
--   Removes legacy foreign-key constraints (gigs_course_id_fkey and 
--   enrollments_course_id_fkey) that survived the courses -> tracks table rename.
--   Restores clean, unambiguous 1-to-many relationship graph:
--     - public.gigs.track_id -> public.tracks(id) [1 FK path only]
--     - public.enrollments.program_id -> public.programs(id) [Authoritative membership]
--     - public.enrollments.track_id -> public.tracks(id) [Optional specialization only]
--   Zero data loss: retains all gig rows, enrollment rows, and historical data.
-- ==============================================================================

-- 1. FIX PUBLIC.GIGS RELATIONSHIPS
-- Drop the legacy course_id foreign key that points to tracks(id)
ALTER TABLE public.gigs DROP CONSTRAINT IF EXISTS gigs_course_id_fkey;

-- Ensure track_id column exists and is populated from course_id if any row missed it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'course_id'
  ) THEN
    UPDATE public.gigs 
    SET track_id = course_id 
    WHERE track_id IS NULL AND course_id IS NOT NULL;
    
    -- Ensure legacy course_id is nullable
    ALTER TABLE public.gigs ALTER COLUMN course_id DROP NOT NULL;
  END IF;
END $$;

-- Ensure canonical gigs_track_id_fkey foreign key exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'gigs_track_id_fkey'
  ) THEN
    ALTER TABLE public.gigs
      ADD CONSTRAINT gigs_track_id_fkey
      FOREIGN KEY (track_id) REFERENCES public.tracks(id)
      ON DELETE RESTRICT;
  END IF;
END $$;


-- 2. FIX PUBLIC.ENROLLMENTS RELATIONSHIPS
-- Drop the legacy course_id foreign key that points to tracks(id)
ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey;

-- Ensure legacy course_id is nullable and has no foreign key constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'course_id'
  ) THEN
    ALTER TABLE public.enrollments ALTER COLUMN course_id DROP NOT NULL;
  END IF;
END $$;

-- Ensure program_id foreign key exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enrollments_program_id_fkey'
  ) THEN
    ALTER TABLE public.enrollments
      ADD CONSTRAINT enrollments_program_id_fkey
      FOREIGN KEY (program_id) REFERENCES public.programs(id)
      ON DELETE RESTRICT;
  END IF;
END $$;

-- Ensure track_id is strictly nullable (not required for UpShift program membership)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'track_id'
  ) THEN
    ALTER TABLE public.enrollments ALTER COLUMN track_id DROP NOT NULL;
  END IF;
END $$;


-- 3. RELOAD POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
