-- ==============================================================================
-- UPSHIFT PLATFORM — PHASE 10: SINGLE COMPLETE PROGRAM ARCHITECTURE
-- Migration: 004_upshift_complete_program.sql
-- Description: Establishes public.programs, public.program_courses, enhances
--              public.enrollments with program_id, payment_status, and seeds
--              the authoritative UpShift Complete Program (4999 INR).
-- ==============================================================================

-- 1. CREATE TABLE: PROGRAMS (Commercial Product Entities)
CREATE TABLE IF NOT EXISTS public.programs (
  id TEXT PRIMARY KEY,                       -- e.g. 'upshift-complete-program'
  slug TEXT NOT NULL UNIQUE,                 -- URL/Identifier slug
  name TEXT NOT NULL,                        -- e.g. 'UpShift Complete Applied AI Program'
  description TEXT,                          -- Marketing/Curriculum summary
  price NUMERIC(10, 2) NOT NULL DEFAULT 4999.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_type TEXT NOT NULL DEFAULT 'one_time' CHECK (billing_type IN ('one_time', 'recurring', 'cohort')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. CREATE TABLE: PROGRAM_COURSES (Program to Included Curriculum Tracks)
CREATE TABLE IF NOT EXISTS public.program_courses (
  program_id TEXT NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 1,
  PRIMARY KEY (program_id, course_id)
);

-- 3. ENHANCE TABLE: ENROLLMENTS (Support Single Complete Program Enrollment)
-- Add program_id, payment_status, amount_paid, currency, and payment_reference
DO $$
BEGIN
  -- 3a. Add program_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'program_id'
  ) THEN
    ALTER TABLE public.enrollments 
      ADD COLUMN program_id TEXT REFERENCES public.programs(id) ON DELETE SET NULL;
  END IF;

  -- 3b. Make course_id nullable to support program-level enrollments cleanly
  ALTER TABLE public.enrollments 
    ALTER COLUMN course_id DROP NOT NULL;

  -- 3c. Add payment_status column with comprehensive status states
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.enrollments 
      ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'active' 
      CHECK (payment_status IN ('pending', 'payment_pending', 'paid', 'active', 'cancelled'));
  END IF;

  -- 3d. Add amount_paid column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'amount_paid'
  ) THEN
    ALTER TABLE public.enrollments 
      ADD COLUMN amount_paid NUMERIC(10, 2) DEFAULT 4999.00;
  END IF;

  -- 3e. Add currency column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.enrollments 
      ADD COLUMN currency TEXT DEFAULT 'INR';
  END IF;

  -- 3f. Add payment_reference column (for future Razorpay order_id/payment_id)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'enrollments' AND column_name = 'payment_reference'
  ) THEN
    ALTER TABLE public.enrollments 
      ADD COLUMN payment_reference TEXT;
  END IF;
END $$;

-- Performance indexes for program enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_program_id ON public.enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_status ON public.enrollments(payment_status);
CREATE INDEX IF NOT EXISTS idx_program_courses_program_id ON public.program_courses(program_id);

-- Ensure a user cannot have duplicate active enrollments in the same program
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_program_unique_enrollment 
  ON public.enrollments(user_id, program_id) 
  WHERE program_id IS NOT NULL;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES FOR PROGRAMS & PROGRAM_COURSES
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_courses ENABLE ROW LEVEL SECURITY;

-- Public can read active programs and included courses
DROP POLICY IF EXISTS "programs_select_public" ON public.programs;
CREATE POLICY "programs_select_public" ON public.programs
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "program_courses_select_public" ON public.program_courses;
CREATE POLICY "program_courses_select_public" ON public.program_courses
  FOR SELECT USING (true);

-- Admins can modify programs and program_courses
DROP POLICY IF EXISTS "programs_admin_all" ON public.programs;
CREATE POLICY "programs_admin_all" ON public.programs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "program_courses_admin_all" ON public.program_courses;
CREATE POLICY "program_courses_admin_all" ON public.program_courses
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. SEED DATA: UPSHIFT COMPLETE PROGRAM (₹4,999 One-Time)
INSERT INTO public.programs (id, slug, name, description, price, currency, billing_type, is_active)
VALUES (
  'upshift-complete-program',
  'upshift-complete-program',
  'UpShift Complete Applied AI Program',
  'Master all 6 applied AI tracks: AI Video, Visual Creation, Data & Evaluation, Assisted Code, Growth Marketing, and Autonomous Agents.',
  4999.00,
  'INR',
  'one_time',
  true
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  billing_type = EXCLUDED.billing_type,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- 6. LINK ALL 6 COURSES TO UPSHIFT COMPLETE PROGRAM
INSERT INTO public.program_courses (program_id, course_id, sort_order)
VALUES
  ('upshift-complete-program', 'reelrush-ai', 1),
  ('upshift-complete-program', 'visualforge-ai', 2),
  ('upshift-complete-program', 'deepannotator', 3),
  ('upshift-complete-program', 'vibe-coder', 4),
  ('upshift-complete-program', 'brandbuzz-ai', 5),
  ('upshift-complete-program', 'agenthandlers', 6)
ON CONFLICT (program_id, course_id) DO UPDATE SET
  sort_order = EXCLUDED.sort_order;

-- 7. BACKWARD COMPATIBILITY: BACKFILL EXISTING LEARNERS INTO COMPLETE PROGRAM
-- Any existing profile with learner role that does not yet have a program enrollment
-- is granted active enrollment in the UpShift Complete Program.
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

-- 8. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
