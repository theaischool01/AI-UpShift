-- ==============================================================================
-- UPSHIFT PLATFORM — PHASE 9 MIGRATION: GIG PAYMENT AMOUNT
-- Migration: 003_add_gig_payment_amount.sql
-- Description: Adds payment_amount text column to public.gigs for flexible compensation
--              structures (e.g. $25/hr, $500/project, $20–35/hr).
-- ==============================================================================

-- 1. Add payment_amount column to public.gigs if it does not already exist
ALTER TABLE public.gigs
ADD COLUMN IF NOT EXISTS payment_amount text;

-- 2. Notify PostgREST to reload its schema cache immediately
NOTIFY pgrst, 'reload schema';
