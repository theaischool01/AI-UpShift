-- ==============================================================================
-- UPSHIFT PLATFORM — DOMAIN REFACTOR: ONE PROGRAM + SIX TRACKS
-- Migration: 010_refactor_courses_to_tracks.sql
-- Description: Refactors course-centric schema to proper domain architecture:
--              1. public.courses -> public.tracks
--              2. public.program_courses -> public.program_tracks (course_id -> track_id)
--              3. public.enrollments: course_id -> track_id
--              4. public.gigs: course_id -> track_id
--              5. Renames indexes, updates RLS policies, reloads schema cache.
-- ==============================================================================

-- 1. RENAME COURSES TABLE TO TRACKS (Safe, In-Place Table Rename)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'courses'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'tracks'
  ) THEN
    ALTER TABLE public.courses RENAME TO tracks;
  END IF;
END $$;

-- 2. RENAME PROGRAM_COURSES TABLE TO PROGRAM_TRACKS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'program_courses'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'program_tracks'
  ) THEN
    ALTER TABLE public.program_courses RENAME TO program_tracks;
  END IF;
END $$;

-- 3. RENAME COLUMN IN PROGRAM_TRACKS: course_id -> track_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'program_tracks' AND column_name = 'course_id'
  ) THEN
    ALTER TABLE public.program_tracks RENAME COLUMN course_id TO track_id;
  END IF;
END $$;

-- 4. RENAME COLUMN IN ENROLLMENTS: course_id -> track_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'course_id'
  ) THEN
    ALTER TABLE public.enrollments RENAME COLUMN course_id TO track_id;
  END IF;
END $$;

-- 5. RENAME COLUMN IN GIGS: course_id -> track_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'course_id'
  ) THEN
    ALTER TABLE public.gigs RENAME COLUMN course_id TO track_id;
  END IF;
END $$;

-- 6. ENSURE FOREIGN KEYS & INDEXES ARE CONSISTENT
DO $$
BEGIN
  -- Program Tracks FK to Tracks
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'program_tracks'
  ) THEN
    -- Recreate index on track_id
    CREATE INDEX IF NOT EXISTS idx_program_tracks_track_id ON public.program_tracks(track_id);
    CREATE INDEX IF NOT EXISTS idx_program_tracks_program_id ON public.program_tracks(program_id);
  END IF;

  -- Enrollments FK & Index
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'enrollments'
  ) THEN
    DROP INDEX IF EXISTS public.idx_enrollments_course;
    CREATE INDEX IF NOT EXISTS idx_enrollments_track_id ON public.enrollments(track_id);
  END IF;

  -- Gigs FK & Index
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'gigs'
  ) THEN
    DROP INDEX IF EXISTS public.idx_gigs_course_id;
    DROP INDEX IF EXISTS public.idx_gigs_course;
    CREATE INDEX IF NOT EXISTS idx_gigs_track_id ON public.gigs(track_id);
  END IF;
END $$;

-- 7. UPDATE RLS POLICIES FOR TRACKS & PROGRAM_TRACKS
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_tracks ENABLE ROW LEVEL SECURITY;

-- Tracks RLS policies
DROP POLICY IF EXISTS "courses_select_public" ON public.tracks;
DROP POLICY IF EXISTS "courses_select_all" ON public.tracks;
DROP POLICY IF EXISTS "tracks_select_public" ON public.tracks;
CREATE POLICY "tracks_select_public" ON public.tracks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "courses_admin_all" ON public.tracks;
DROP POLICY IF EXISTS "tracks_admin_all" ON public.tracks;
CREATE POLICY "tracks_admin_all" ON public.tracks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Program Tracks RLS policies
DROP POLICY IF EXISTS "program_courses_select_public" ON public.program_tracks;
DROP POLICY IF EXISTS "program_tracks_select_public" ON public.program_tracks;
CREATE POLICY "program_tracks_select_public" ON public.program_tracks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "program_courses_admin_all" ON public.program_tracks;
DROP POLICY IF EXISTS "program_tracks_admin_all" ON public.program_tracks;
CREATE POLICY "program_tracks_admin_all" ON public.program_tracks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. NOTIFY POSTGREST SCHEMA CACHE RELOAD
NOTIFY pgrst, 'reload schema';
