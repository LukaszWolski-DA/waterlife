-- Migration 006: Fix overly permissive RLS policies
-- Problem: any authenticated user could write to categories, manufacturers, and homepage_content
-- Fix: remove permissive write policies; admin writes go through service role (bypasses RLS)

-- Categories: remove permissive write policies
DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON categories;

-- Manufacturers: remove permissive write policies
DROP POLICY IF EXISTS "Allow authenticated users to insert manufacturers" ON manufacturers;
DROP POLICY IF EXISTS "Allow authenticated users to update manufacturers" ON manufacturers;
DROP POLICY IF EXISTS "Allow authenticated users to delete manufacturers" ON manufacturers;

-- Homepage content: remove permissive update policy
DROP POLICY IF EXISTS "Allow authenticated users to update homepage content" ON homepage_content;

-- Products: enable RLS + allow public read (writes handled by service role)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);
