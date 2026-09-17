-- ==============================================================================
-- UPSHIFT PLATFORM — ADMIN ENHANCEMENTS MIGRATION
-- Migration: 002_admin_enhancements.sql
-- Description: Adds unique constraint on gigs.external_gig_id for batch upsert
--              and performance index on profiles.college for analytics/filters.
-- ==============================================================================

-- 1. Enable formal uniqueness on external_gig_id for PostgREST onConflict upserts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'gigs_external_gig_id_key' 
      AND conrelid = 'public.gigs'::regclass
  ) THEN
    ALTER TABLE public.gigs 
      ADD CONSTRAINT gigs_external_gig_id_key UNIQUE (external_gig_id);
  END IF;
END $$;

-- 2. Performance index on profiles.college for student directory and analytics
CREATE INDEX IF NOT EXISTS idx_profiles_college 
  ON public.profiles(college);
