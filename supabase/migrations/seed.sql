-- Seed data for WaterLife application
-- Run via: supabase db seed
-- This file contains reference/lookup data required for the app to function.
-- It is safe to re-run (ON CONFLICT DO NOTHING).

-- Categories
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

-- Manufacturers
INSERT INTO manufacturers (name) VALUES
  ('Viessmann'),
  ('Buderus'),
  ('Vaillant'),
  ('Junkers')
ON CONFLICT (name) DO NOTHING;
