-- Migration 009: Fix homepage_content write access
-- Problem: 42501 RLS error when admin tries to update homepage_content
-- Cause: migration 007 removed all write policies; service_role BYPASSRLS should work
--        but explicit policy added as belt-and-suspenders fallback
-- Fix: add explicit ALL policy for service_role role

CREATE POLICY "Service role can manage homepage content"
  ON homepage_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
