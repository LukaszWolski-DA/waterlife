-- Migration: Categories table for product categories management
-- Migracja: Tabela kategorii produktów
-- Author: Migration from localStorage to Supabase
-- Date: 2026-02-04

-- Tworzenie tabeli categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  keywords TEXT[], -- Array słów kluczowych dla wyszukiwarki
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index dla wyszukiwania po nazwie
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Index dla wyszukiwania po keywords (GIN index dla array)
CREATE INDEX IF NOT EXISTS idx_categories_keywords ON categories USING GIN(keywords);

-- Trigger dla automatycznej aktualizacji updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read (każdy może czytać kategorie na stronie publicznej)
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  USING (true);

-- RLS Policy: Authenticated insert (zalogowani mogą dodawać - TODO: zmienić na admin only)
DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON categories;
CREATE POLICY "Allow authenticated users to insert categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated update (zalogowani mogą edytować - TODO: zmienić na admin only)
DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON categories;
CREATE POLICY "Allow authenticated users to update categories"
  ON categories FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated delete (zalogowani mogą usuwać - TODO: zmienić na admin only)
DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON categories;
CREATE POLICY "Allow authenticated users to delete categories"
  ON categories FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert initial categories (3 główne kategorie WaterLife)
INSERT INTO categories (name, description, keywords) VALUES
  (
    'Technika Grzewcza',
    'Kotły gazowe, kondensacyjne, piece CO i akcesoria grzewcze',
    ARRAY['kotły', 'grzewcze', 'piece', 'ogrzewanie', 'kondensacyjne', 'CO', 'gazowe']
  ),
  (
    'Systemy Sanitarne',
    'Podgrzewacze wody, bojlery, pompy i instalacje sanitarne',
    ARRAY['podgrzewacze', 'bojlery', 'woda', 'sanitarne', 'pompy', 'instalacje']
  ),
  (
    'Nawadnianie',
    'Systemy nawadniania ogrodów, trawników i terenów zielonych',
    ARRAY['nawadnianie', 'ogród', 'trawnik', 'zraszacze', 'systemy', 'zieleń']
  )
ON CONFLICT (name) DO NOTHING;

-- Comment
COMMENT ON TABLE categories IS 'Kategorie produktów - zarządzane przez panel admina';
COMMENT ON COLUMN categories.keywords IS 'Słowa kluczowe dla wyszukiwarki (array)';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Categories table created successfully with 3 initial categories';
END $$;
