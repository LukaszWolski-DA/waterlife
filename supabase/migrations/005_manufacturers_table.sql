-- Migration: Manufacturers table for product manufacturers management
-- Migracja: Tabela producentów produktów
-- Author: Migration from localStorage to Supabase
-- Date: 2026-02-04

-- Tworzenie tabeli manufacturers
CREATE TABLE IF NOT EXISTS manufacturers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index dla wyszukiwania po nazwie
CREATE INDEX IF NOT EXISTS idx_manufacturers_name ON manufacturers(name);

-- Trigger dla automatycznej aktualizacji updated_at
DROP TRIGGER IF EXISTS update_manufacturers_updated_at ON manufacturers;
CREATE TRIGGER update_manufacturers_updated_at
  BEFORE UPDATE ON manufacturers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read (każdy może czytać producentów na stronie publicznej)
DROP POLICY IF EXISTS "Allow public read access to manufacturers" ON manufacturers;
CREATE POLICY "Allow public read access to manufacturers"
  ON manufacturers FOR SELECT
  USING (true);

-- RLS Policy: Authenticated insert (zalogowani mogą dodawać - TODO: zmienić na admin only)
DROP POLICY IF EXISTS "Allow authenticated users to insert manufacturers" ON manufacturers;
CREATE POLICY "Allow authenticated users to insert manufacturers"
  ON manufacturers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated update (zalogowani mogą edytować - TODO: zmienić na admin only)
DROP POLICY IF EXISTS "Allow authenticated users to update manufacturers" ON manufacturers;
CREATE POLICY "Allow authenticated users to update manufacturers"
  ON manufacturers FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated delete (zalogowani mogą usuwać - TODO: zmienić na admin only)
DROP POLICY IF EXISTS "Allow authenticated users to delete manufacturers" ON manufacturers;
CREATE POLICY "Allow authenticated users to delete manufacturers"
  ON manufacturers FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert initial manufacturers (4 główni producenci WaterLife)
INSERT INTO manufacturers (name) VALUES
  ('Viessmann'),
  ('Buderus'),
  ('Vaillant'),
  ('Junkers')
ON CONFLICT (name) DO NOTHING;

-- Comment
COMMENT ON TABLE manufacturers IS 'Producenci produktów - zarządzane przez panel admina';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Manufacturers table created successfully with 4 initial manufacturers';
END $$;
