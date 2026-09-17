-- ==============================================================================
-- UPSHIFT PLATFORM — INITIAL RELATIONAL SCHEMA & RLS MIGRATION
-- Migration: 001_initial_schema.sql
-- Description: Establishes courses, profiles, enrollments, gigs, audit_logs,
--              automated profile sync, updated_at triggers, is_admin() helper,
--              strict Row Level Security policies, and authoritative course seeds.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE: COURSES (Authoritative Flagship Tracks)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,                       -- Slug format: 'reelrush-ai', 'vibe-coder', etc.
  code TEXT NOT NULL UNIQUE,                 -- Track code: 'M1' through 'M6'
  name TEXT NOT NULL,                        -- e.g. 'ReelRush AI'
  category TEXT NOT NULL,                    -- e.g. 'AI Video / Short-Form Content'
  tagline TEXT,                              -- e.g. 'Create. Edit. Go Viral.'
  color TEXT,                                -- Hex color: '#E93B3B'
  bg_color TEXT,                             -- Light tint: '#FFF1F1'
  is_active BOOLEAN NOT NULL DEFAULT true,   -- Availability toggle
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. TABLE: PROFILES (Application User Entities)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'learner')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  college_email TEXT,
  college TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. TABLE: ENROLLMENTS (Learner to Course Relational Association)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  CONSTRAINT unique_user_course_enrollment UNIQUE (user_id, course_id)
);

-- ==============================================================================
-- 5. TABLE: GIGS (Aggregated External Commercial Opportunities)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_gig_id TEXT,                      -- External scraper/platform ID if provided
  title TEXT NOT NULL,                       -- Opportunity title
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
  short_description TEXT NOT NULL,           -- Initial card snippet view
  long_description TEXT NOT NULL,            -- Detailed description for 'Read More'
  origin_site TEXT NOT NULL,                 -- e.g. 'Upwork', 'Contra', 'RemoteOK'
  origin_url TEXT NOT NULL,                  -- External apply URL
  organization TEXT,                         -- Optional commissioning client/brand
  location TEXT,                             -- Optional location / 'Remote'
  engagement_type TEXT,                      -- Optional engagement format
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Duplicate Prevention Strategy for Gigs:
-- 1. Partial unique index on external_gig_id when present:
CREATE UNIQUE INDEX IF NOT EXISTS idx_gigs_external_id_unique 
  ON public.gigs(external_gig_id) 
  WHERE external_gig_id IS NOT NULL AND external_gig_id <> '';

-- 2. Composite index on (origin_site, origin_url) for fast batch-deduplication:
-- Note: A rigid DB unique constraint on origin_url alone is intentionally avoided 
-- because legitimate external aggregators occasionally post different roles leading 
-- to the same general company career gateway.
CREATE INDEX IF NOT EXISTS idx_gigs_site_url 
  ON public.gigs(origin_site, origin_url);

-- ==============================================================================
-- 6. TABLE: AUDIT_LOGS (Administrative Action Tracking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,                      -- e.g. 'SINGLE_LEARNER_CREATED', 'BULK_IMPORT'
  details JSONB,                             -- Context metadata (row count, status, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 7. PERFORMANCE INDEXES
-- ==============================================================================
-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enrollments indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrolled_at ON public.enrollments(enrolled_at DESC);

-- Gigs indexes
CREATE INDEX IF NOT EXISTS idx_gigs_course_id ON public.gigs(course_id);
CREATE INDEX IF NOT EXISTS idx_gigs_created_at ON public.gigs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gigs_origin_site ON public.gigs(origin_site);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.audit_logs(admin_id);

-- ==============================================================================
-- 8. TRIGGER: PROFILES.UPDATED_AT
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 9. HELPER FUNCTION: IS_ADMIN()
-- Security definer function with explicit search_path avoiding recursive RLS loops.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ==============================================================================
-- 10. AUTH TRIGGER: AUTOMATED PROFILE CREATION FROM AUTH.USERS
-- Synchronizes new Supabase Auth signups into public.profiles cleanly.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, college, college_email)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'learner'),
    NEW.raw_user_meta_data->>'college',
    NEW.raw_user_meta_data->>'college_email'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all 5 application tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- COURSES POLICIES
-- ------------------------------------------------------------------------------
-- Public catalog reading: All authenticated users and unauthenticated visitors can view
DROP POLICY IF EXISTS "courses_select_public" ON public.courses;
CREATE POLICY "courses_select_public" ON public.courses
  FOR SELECT USING (true);

-- Admin only modifications
DROP POLICY IF EXISTS "courses_admin_all" ON public.courses;
CREATE POLICY "courses_admin_all" ON public.courses
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own profile; admins can view all profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- Profile updates: Users can update their own profile; Admins can update any profile.
-- Critical Security Guard: Learners cannot change their own 'role' to 'admin'.
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (
    public.is_admin() OR (
      id = auth.uid()
      AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
    )
  );

-- Admin insert into profiles directly if needed (otherwise handled by trigger)
DROP POLICY IF EXISTS "profiles_admin_insert" ON public.profiles;
CREATE POLICY "profiles_admin_insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- ENROLLMENTS POLICIES
-- ------------------------------------------------------------------------------
-- Learners can view their own enrollments; admins can view all enrollments
DROP POLICY IF EXISTS "enrollments_select_policy" ON public.enrollments;
CREATE POLICY "enrollments_select_policy" ON public.enrollments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Only admins can create/modify/delete enrollments
DROP POLICY IF EXISTS "enrollments_admin_all" ON public.enrollments;
CREATE POLICY "enrollments_admin_all" ON public.enrollments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- GIGS POLICIES
-- ------------------------------------------------------------------------------
-- Authenticated users (learners and admins) can view gigs
DROP POLICY IF EXISTS "gigs_select_authenticated" ON public.gigs;
CREATE POLICY "gigs_select_authenticated" ON public.gigs
  FOR SELECT TO authenticated
  USING (true);

-- Only admins can insert, update, or delete gigs
DROP POLICY IF EXISTS "gigs_admin_all" ON public.gigs;
CREATE POLICY "gigs_admin_all" ON public.gigs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- AUDIT LOGS POLICIES
-- ------------------------------------------------------------------------------
-- Only admins can view audit logs
DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Only admins can insert audit logs
DROP POLICY IF EXISTS "audit_logs_insert_admin" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_admin" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 12. SEED DATA: 6 AUTHORITATIVE UPSHIFT TRACKS
-- Sourced directly from src/data/programsData.js (Idempotent upsert)
-- ==============================================================================
INSERT INTO public.courses (id, code, name, category, tagline, color, bg_color, is_active)
VALUES
  (
    'reelrush-ai',
    'M1',
    'ReelRush AI',
    'AI Video / Short-Form Content',
    'Create. Edit. Go Viral.',
    '#E93B3B',
    '#FFF1F1',
    true
  ),
  (
    'visualforge-ai',
    'M2',
    'VisualForge AI',
    'AI Design / Visual Creation',
    'Design. Generate. Bring Ideas to Life.',
    '#2563EB',
    '#EFF6FF',
    true
  ),
  (
    'deepannotator',
    'M3',
    'DeepAnnotator',
    'AI Data / Evaluation',
    'Work with AI. Power Better Data.',
    '#059669',
    '#ECFDF5',
    true
  ),
  (
    'vibe-coder',
    'M4',
    'Vibe Coder',
    'AI-Assisted Development',
    'Build. Automate. Ship Faster.',
    '#4F46E5',
    '#EEF2FF',
    true
  ),
  (
    'brandbuzz-ai',
    'M5',
    'BrandBuzz AI',
    'AI Marketing / Growth',
    'Market Smarter. Grow Brands.',
    '#EA580C',
    '#FFF7ED',
    true
  ),
  (
    'agenthandlers',
    'M6',
    'AgentHandlers',
    'AI Agents / Automation',
    'Build & Deploy AI Agents.',
    '#0D9488',
    '#F0FDFA',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  tagline = EXCLUDED.tagline,
  color = EXCLUDED.color,
  bg_color = EXCLUDED.bg_color,
  is_active = EXCLUDED.is_active;
