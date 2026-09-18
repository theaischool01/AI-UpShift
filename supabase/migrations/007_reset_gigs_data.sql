-- Migration 007: Reset all gigs data for clean CSV structure testing
-- Cleans public.gigs while preserving courses, profiles, enrollments, payments, etc.

DELETE FROM public.gigs;
