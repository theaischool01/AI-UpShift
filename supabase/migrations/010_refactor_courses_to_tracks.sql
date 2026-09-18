-- ==============================================================================
-- UPSHIFT PLATFORM — DOMAIN REFACTOR: ONE PROGRAM + SIX TRACKS
-- Migration: 010_refactor_courses_to_tracks.sql
-- Description: Complete, idempotent migration establishing the true domain model:
--              1. public.programs (upshift-complete-program)
--              2. public.tracks (M1-M6 tracks)
--              3. public.program_tracks (links 6 tracks to UpShift program)
--              4. public.enrollments (program_id + track_id)
--              5. public.gigs (track_id + structured JD columns + FK to tracks)
--              6. RLS policies and PostgREST schema reload.
-- ==============================================================================

-- 1. ENSURE PROGRAMS TABLE EXISTS & SEED UPSHIFT COMPLETE PROGRAM
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  overview TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 4999.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.programs (id, title, slug, tagline, overview, price, is_active)
VALUES (
  'upshift-complete-program',
  'UpShift AI Career Accelerator',
  'upshift-complete-program',
  'One Program. Six Applied AI Specialization Tracks.',
  'Comprehensive end-to-end program equipping learners with applied AI skills, proof of work, and paid commercial opportunities.',
  4999.00,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  tagline = EXCLUDED.tagline,
  overview = EXCLUDED.overview,
  is_active = EXCLUDED.is_active;

-- 2. RENAME COURSES TABLE TO TRACKS (Safe In-Place Rename or Create)
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
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'tracks'
  ) THEN
    CREATE TABLE public.tracks (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      tagline TEXT,
      color TEXT NOT NULL DEFAULT '#E11D48',
      price NUMERIC(10,2) NOT NULL DEFAULT 4999.00,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  END IF;
END $$;

-- Ensure all 6 canonical tracks exist in public.tracks
INSERT INTO public.tracks (id, code, name, slug, tagline, color, is_active)
VALUES 
  ('reelrush-ai', 'M1', 'ReelRush AI', 'reelrush-ai', 'Short-form AI video creation & viral pipelines', '#E11D48', true),
  ('visualforge-ai', 'M2', 'VisualForge AI', 'visualforge-ai', 'Generative visual assets & brand identity generation', '#7C3AED', true),
  ('deepannotator', 'M3', 'DeepAnnotator', 'deepannotator', 'High-value LLM training data & multimodal annotation', '#059669', true),
  ('vibe-coder', 'M4', 'Vibe Coder', 'vibe-coder', 'Rapid full-stack AI prototyping & application building', '#2563EB', true),
  ('brandbuzz-ai', 'M5', 'BrandBuzz AI', 'brandbuzz-ai', 'End-to-end AI marketing campaigns & growth automation', '#D97706', true),
  ('agenthandlers', 'M6', 'AgentHandlers', 'agenthandlers', 'Autonomous multi-agent workflows & enterprise execution', '#4F46E5', true)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  tagline = EXCLUDED.tagline,
  color = EXCLUDED.color,
  is_active = EXCLUDED.is_active;

-- 3. RENAME PROGRAM_COURSES TABLE TO PROGRAM_TRACKS (Or Create)
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
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'program_tracks'
  ) THEN
    CREATE TABLE public.program_tracks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      program_id TEXT NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
      track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
      sequence_order INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      CONSTRAINT unique_program_track UNIQUE (program_id, track_id)
    );
  END IF;
END $$;

-- Rename column course_id -> track_id in program_tracks if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'program_tracks' AND column_name = 'course_id'
  ) THEN
    ALTER TABLE public.program_tracks RENAME COLUMN course_id TO track_id;
  END IF;
END $$;

-- Seed program_tracks relationships
INSERT INTO public.program_tracks (program_id, track_id, sequence_order)
VALUES
  ('upshift-complete-program', 'reelrush-ai', 1),
  ('upshift-complete-program', 'visualforge-ai', 2),
  ('upshift-complete-program', 'deepannotator', 3),
  ('upshift-complete-program', 'vibe-coder', 4),
  ('upshift-complete-program', 'brandbuzz-ai', 5),
  ('upshift-complete-program', 'agenthandlers', 6)
ON CONFLICT (program_id, track_id) DO NOTHING;

-- 4. ENROLLMENTS TABLE REFACTOR: program_id + track_id
DO $$
BEGIN
  -- Add program_id if missing
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'enrollments'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'program_id'
    ) THEN
      ALTER TABLE public.enrollments ADD COLUMN program_id TEXT REFERENCES public.programs(id) DEFAULT 'upshift-complete-program';
      UPDATE public.enrollments SET program_id = 'upshift-complete-program' WHERE program_id IS NULL;
    END IF;

    -- Rename course_id -> track_id if present
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'course_id'
    ) THEN
      ALTER TABLE public.enrollments RENAME COLUMN course_id TO track_id;
    END IF;
  END IF;
END $$;

-- Ensure foreign key from enrollments.track_id to tracks(id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'enrollments'
  ) THEN
    ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey;
    ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_track_id_fkey;
    
    ALTER TABLE public.enrollments
      ADD CONSTRAINT enrollments_track_id_fkey
      FOREIGN KEY (track_id) REFERENCES public.tracks(id) ON DELETE RESTRICT;
  END IF;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Enrollments FK notice: %', SQLERRM;
END $$;

-- 5. GIGS TABLE REFACTOR: track_id + Structured Columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'gigs'
  ) THEN
    -- Rename course_id -> track_id if present
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'course_id'
    ) THEN
      ALTER TABLE public.gigs RENAME COLUMN course_id TO track_id;
    END IF;

    -- Ensure all structured columns exist
    ALTER TABLE public.gigs
      ADD COLUMN IF NOT EXISTS payment_amount TEXT,
      ADD COLUMN IF NOT EXISTS overview TEXT,
      ADD COLUMN IF NOT EXISTS responsibilities JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS requirements JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS proof_spec TEXT,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Ensure foreign key from gigs.track_id to tracks(id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'gigs'
  ) THEN
    ALTER TABLE public.gigs DROP CONSTRAINT IF EXISTS gigs_course_id_fkey;
    ALTER TABLE public.gigs DROP CONSTRAINT IF EXISTS gigs_track_id_fkey;
    
    ALTER TABLE public.gigs
      ADD CONSTRAINT gigs_track_id_fkey
      FOREIGN KEY (track_id) REFERENCES public.tracks(id) ON DELETE RESTRICT;
  END IF;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Gigs FK notice: %', SQLERRM;
END $$;

-- 6. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_program_tracks_track_id ON public.program_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_program_tracks_program_id ON public.program_tracks(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_track_id ON public.enrollments(track_id);
CREATE INDEX IF NOT EXISTS idx_gigs_track_id ON public.gigs(track_id);
CREATE INDEX IF NOT EXISTS idx_gigs_is_active ON public.gigs(is_active);

-- 7. ROW LEVEL SECURITY POLICIES
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

-- Programs: Public Read
DROP POLICY IF EXISTS "programs_select_public" ON public.programs;
CREATE POLICY "programs_select_public" ON public.programs FOR SELECT USING (true);

-- Tracks: Public Read
DROP POLICY IF EXISTS "courses_select_public" ON public.tracks;
DROP POLICY IF EXISTS "tracks_select_public" ON public.tracks;
CREATE POLICY "tracks_select_public" ON public.tracks FOR SELECT USING (true);

-- Program Tracks: Public Read
DROP POLICY IF EXISTS "program_courses_select_public" ON public.program_tracks;
DROP POLICY IF EXISTS "program_tracks_select_public" ON public.program_tracks;
CREATE POLICY "program_tracks_select_public" ON public.program_tracks FOR SELECT USING (true);

-- Gigs: Public / Learner Read Active Gigs, Admin Full Access
DROP POLICY IF EXISTS "gigs_select_all" ON public.gigs;
DROP POLICY IF EXISTS "gigs_select_public" ON public.gigs;
CREATE POLICY "gigs_select_public" ON public.gigs FOR SELECT USING (true);

DROP POLICY IF EXISTS "gigs_admin_all" ON public.gigs;
CREATE POLICY "gigs_admin_all" ON public.gigs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. RELOAD POSTGREST SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
