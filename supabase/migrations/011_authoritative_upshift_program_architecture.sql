-- ==============================================================================
-- UPSHIFT PLATFORM — PHASE 11: AUTHORITATIVE ONE-PROGRAM ARCHITECTURE
-- Migration: 011_authoritative_upshift_program_architecture.sql
-- Description: Non-destructive, idempotent migration establishing the authoritative
--              domain model:
--              1. public.programs ('upshift-complete-program')
--              2. public.tracks (Authoritative M1-M6 tracks table)
--              3. public.program_tracks (Links 6 tracks to UpShift program)
--              4. public.enrollments (program_id authoritative, course_id/track_id nullable)
--              5. public.gigs (track_id + is_active + structured columns)
--              6. RLS policies and PostgREST schema cache reload
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE: PROGRAMS (One Program: UpShift)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,
  title TEXT,
  name TEXT,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  overview TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 4999.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_type TEXT NOT NULL DEFAULT 'one_time',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all expected columns exist if table already existed with alternate schema
DO $$
BEGIN
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS title TEXT;
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS name TEXT;
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS slug TEXT;
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS tagline TEXT;
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS description TEXT;
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS overview TEXT;
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 4999.00;
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS billing_type TEXT DEFAULT 'one_time';
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
  ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
END $$;

-- Seed Authoritative UpShift Complete Program
INSERT INTO public.programs (id, title, name, slug, tagline, description, overview, price, currency, billing_type, is_active)
VALUES (
  'upshift-complete-program',
  'UpShift AI Career Accelerator',
  'UpShift Complete Applied AI Program',
  'upshift-complete-program',
  'One Program. Six Applied AI Specialization Tracks.',
  'Master all 6 applied AI tracks: AI Video, Visual Creation, Data & Evaluation, Assisted Code, Growth Marketing, and Autonomous Agents.',
  'Comprehensive end-to-end program equipping learners with applied AI skills, proof of work, and paid commercial opportunities.',
  4999.00,
  'INR',
  'one_time',
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  overview = EXCLUDED.overview,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  billing_type = EXCLUDED.billing_type,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- ==============================================================================
-- 3. TABLE: TRACKS (Authoritative Specialization Tracks M1-M6)
-- ==============================================================================
DO $$
BEGIN
  -- Safe transition: If courses exists and tracks does not, rename courses to tracks
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

-- Ensure tracks has all necessary columns including backward-compatibility presentation fields
DO $$
BEGIN
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS code TEXT;
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS name TEXT;
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS slug TEXT;
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS tagline TEXT;
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#E11D48';
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#FFF1F1';
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS category TEXT;
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) DEFAULT 4999.00;
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
  ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
END $$;

-- Seed the 6 Canonical Tracks
INSERT INTO public.tracks (id, code, name, slug, tagline, color, bg_color, category, is_active)
VALUES 
  ('reelrush-ai', 'M1', 'ReelRush AI', 'reelrush-ai', 'Short-form AI video creation & viral pipelines', '#E11D48', '#FFF1F1', 'AI Video / Short-Form Content', true),
  ('visualforge-ai', 'M2', 'VisualForge AI', 'visualforge-ai', 'Generative visual assets & brand identity generation', '#7C3AED', '#F5F3FF', 'Generative Visuals & Design', true),
  ('deepannotator', 'M3', 'DeepAnnotator', 'deepannotator', 'High-value LLM training data & multimodal annotation', '#059669', '#ECFDF5', 'Data Quality & AI Evaluation', true),
  ('vibe-coder', 'M4', 'Vibe Coder', 'vibe-coder', 'Rapid full-stack AI prototyping & application building', '#2563EB', '#EFF6FF', 'Full-Stack Apps & AI Coding', true),
  ('brandbuzz-ai', 'M5', 'BrandBuzz AI', 'brandbuzz-ai', 'End-to-end AI marketing campaigns & growth automation', '#D97706', '#FFFBEB', 'Growth Campaigns & Viral Copy', true),
  ('agenthandlers', 'M6', 'AgentHandlers', 'agenthandlers', 'Autonomous multi-agent workflows & enterprise execution', '#4F46E5', '#F0FDFA', 'Autonomous Multi-Agent Systems', true)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  tagline = EXCLUDED.tagline,
  color = EXCLUDED.color,
  bg_color = EXCLUDED.bg_color,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- ==============================================================================
-- 4. TABLE: PROGRAM_TRACKS (Program to Included Tracks)
-- ==============================================================================
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

-- If column course_id exists on program_tracks, rename to track_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'program_tracks' AND column_name = 'course_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'program_tracks' AND column_name = 'track_id'
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
ON CONFLICT (program_id, track_id) DO UPDATE SET
  sequence_order = EXCLUDED.sequence_order;

-- ==============================================================================
-- 5. TABLE: ENROLLMENTS (Learner to UpShift Program Relational Association)
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'enrollments'
  ) THEN
    -- 5a. Add program_id if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'program_id'
    ) THEN
      ALTER TABLE public.enrollments ADD COLUMN program_id TEXT REFERENCES public.programs(id) DEFAULT 'upshift-complete-program';
    END IF;

    -- Backfill program_id on any existing records
    UPDATE public.enrollments SET program_id = 'upshift-complete-program' WHERE program_id IS NULL;

    -- 5b. Add track_id if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'track_id'
    ) THEN
      ALTER TABLE public.enrollments ADD COLUMN track_id TEXT REFERENCES public.tracks(id) ON DELETE SET NULL;
      -- Copy over course_id to track_id if course_id exists
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'course_id'
      ) THEN
        UPDATE public.enrollments SET track_id = course_id WHERE track_id IS NULL;
      END IF;
    END IF;

    -- 5c. Drop NOT NULL on course_id and track_id so neither is required
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'course_id'
    ) THEN
      ALTER TABLE public.enrollments ALTER COLUMN course_id DROP NOT NULL;
    END IF;

    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'track_id'
    ) THEN
      ALTER TABLE public.enrollments ALTER COLUMN track_id DROP NOT NULL;
    END IF;

    -- 5d. Add payment and status columns if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'payment_status'
    ) THEN
      ALTER TABLE public.enrollments ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'active';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'amount_paid'
    ) THEN
      ALTER TABLE public.enrollments ADD COLUMN amount_paid NUMERIC(10,2) DEFAULT 4999.00;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'currency'
    ) THEN
      ALTER TABLE public.enrollments ADD COLUMN currency TEXT DEFAULT 'INR';
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'payment_reference'
    ) THEN
      ALTER TABLE public.enrollments ADD COLUMN payment_reference TEXT;
    END IF;

    -- 5e. Drop obsolete strict user_course unique constraint if present
    ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS unique_user_course_enrollment;

    -- 5f. Add unique constraint on (user_id, program_id)
    CREATE UNIQUE INDEX IF NOT EXISTS idx_user_program_unique_enrollment 
      ON public.enrollments(user_id, program_id) 
      WHERE program_id IS NOT NULL;
  END IF;
END $$;

-- Backfill any existing learner profiles that don't have an enrollment into UpShift Program
INSERT INTO public.enrollments (user_id, program_id, status, payment_status, amount_paid, currency, enrolled_at)
SELECT 
  p.id AS user_id,
  'upshift-complete-program' AS program_id,
  'active' AS status,
  'active' AS payment_status,
  4999.00 AS amount_paid,
  'INR' AS currency,
  p.created_at AS enrolled_at
FROM public.profiles p
WHERE p.role = 'learner'
  AND NOT EXISTS (
    SELECT 1 FROM public.enrollments e 
    WHERE e.user_id = p.id AND e.program_id = 'upshift-complete-program'
  )
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 6. TABLE: GIGS (Commercial Opportunities linked to Tracks)
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'gigs'
  ) THEN
    -- Ensure track_id exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'track_id'
    ) THEN
      ALTER TABLE public.gigs ADD COLUMN track_id TEXT REFERENCES public.tracks(id) ON DELETE RESTRICT;
      -- Backfill track_id from course_id if course_id exists
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'course_id'
      ) THEN
        UPDATE public.gigs SET track_id = course_id WHERE track_id IS NULL;
      END IF;
    END IF;

    -- Drop NOT NULL on course_id if present
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'course_id'
    ) THEN
      ALTER TABLE public.gigs ALTER COLUMN course_id DROP NOT NULL;
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

    -- Backfill overview from long_description if present
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'gigs' AND column_name = 'long_description'
    ) THEN
      UPDATE public.gigs
      SET overview = long_description
      WHERE (overview IS NULL OR overview = '') AND long_description IS NOT NULL;
    END IF;

    -- Ensure unique constraint on external_gig_id for upserts
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'gigs_external_gig_id_key' AND table_name = 'gigs'
    ) THEN
      ALTER TABLE public.gigs ADD CONSTRAINT gigs_external_gig_id_key UNIQUE (external_gig_id);
    END IF;
  END IF;
END $$;

-- ==============================================================================
-- 7. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_enrollments_program_id ON public.enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON public.enrollments(enrolled_at DESC);
CREATE INDEX IF NOT EXISTS idx_program_tracks_program_id ON public.program_tracks(program_id);
CREATE INDEX IF NOT EXISTS idx_program_tracks_track_id ON public.program_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_gigs_track_id ON public.gigs(track_id);
CREATE INDEX IF NOT EXISTS idx_gigs_is_active ON public.gigs(is_active);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

-- Programs: Public Read, Admin Write
DROP POLICY IF EXISTS "programs_select_public" ON public.programs;
CREATE POLICY "programs_select_public" ON public.programs FOR SELECT USING (true);

DROP POLICY IF EXISTS "programs_admin_all" ON public.programs;
CREATE POLICY "programs_admin_all" ON public.programs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Tracks: Public Read, Admin Write
DROP POLICY IF EXISTS "tracks_select_public" ON public.tracks;
CREATE POLICY "tracks_select_public" ON public.tracks FOR SELECT USING (true);

DROP POLICY IF EXISTS "tracks_admin_all" ON public.tracks;
CREATE POLICY "tracks_admin_all" ON public.tracks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Program Tracks: Public Read, Admin Write
DROP POLICY IF EXISTS "program_tracks_select_public" ON public.program_tracks;
CREATE POLICY "program_tracks_select_public" ON public.program_tracks FOR SELECT USING (true);

DROP POLICY IF EXISTS "program_tracks_admin_all" ON public.program_tracks;
CREATE POLICY "program_tracks_admin_all" ON public.program_tracks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Enrollments: User Read Own, Admin Full Access
DROP POLICY IF EXISTS "enrollments_select_own" ON public.enrollments;
CREATE POLICY "enrollments_select_own" ON public.enrollments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "enrollments_admin_all" ON public.enrollments;
CREATE POLICY "enrollments_admin_all" ON public.enrollments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Gigs: Public / Learner Read Active, Admin Full Access
DROP POLICY IF EXISTS "gigs_select_all" ON public.gigs;
DROP POLICY IF EXISTS "gigs_select_public" ON public.gigs;
CREATE POLICY "gigs_select_public" ON public.gigs FOR SELECT USING (true);

DROP POLICY IF EXISTS "gigs_admin_all" ON public.gigs;
CREATE POLICY "gigs_admin_all" ON public.gigs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 9. RELOAD POSTGREST SCHEMA CACHE
-- ==============================================================================
NOTIFY pgrst, 'reload schema';
