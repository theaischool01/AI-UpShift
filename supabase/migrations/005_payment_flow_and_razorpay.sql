-- ==============================================================================
-- UPSHIFT PLATFORM — PHASE 11: RAZORPAY PAYMENT & ACCOUNT ACTIVATION SCHEMA
-- Migration: 005_payment_flow_and_razorpay.sql
-- Description: Creates public.payments table, sets up RLS, indexes, and ensures
--              support for verified payment records and account activation.
-- ==============================================================================

-- 1. CREATE TABLE: PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,
  program_id TEXT REFERENCES public.programs(id) DEFAULT 'upshift-complete-program',
  
  -- Razorpay order & transaction identifiers
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  
  -- Financial details
  amount NUMERIC(10, 2) NOT NULL DEFAULT 4999.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'failed', 'refunded')),
  
  -- Customer details at the time of checkout
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Metadata for cohort / marketing / track preferences
  metadata JSONB DEFAULT '{}'::jsonb,
  
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. INDEXES FOR PERFORMANCE & IDEMPOTENCY
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_email ON public.payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON public.payments(razorpay_payment_id) WHERE razorpay_payment_id IS NOT NULL;

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 3a. Users can view their own payment receipts
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 3b. Admins can view all payments
DROP POLICY IF EXISTS "payments_admin_all" ON public.payments;
CREATE POLICY "payments_admin_all" ON public.payments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
