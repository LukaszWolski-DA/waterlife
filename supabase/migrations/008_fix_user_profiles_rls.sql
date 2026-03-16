-- Migration 008: Fix infinite recursion in user_profiles RLS
-- Problem: "Admins can read all profiles" policy checks user_profiles from within
-- a user_profiles SELECT policy → infinite recursion on every profile load.
-- Fix: drop the policy. Admins read profiles via service role (bypasses RLS).

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.user_profiles;
