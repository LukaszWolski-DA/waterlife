-- Migration: Rozszerzenie tabeli user_profiles o dane osobowe i firmowe
-- Data: 2026-02-04
-- Opis: Dodanie kolumn dla danych kontaktowych i firmowych użytkownika

-- ============================================
-- 1. DODANIE NOWYCH KOLUMN
-- ============================================

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS nip TEXT;

-- Komentarze do kolumn
COMMENT ON COLUMN user_profiles.first_name IS 'Imię użytkownika';
COMMENT ON COLUMN user_profiles.last_name IS 'Nazwisko użytkownika';
COMMENT ON COLUMN user_profiles.phone IS 'Numer telefonu użytkownika';
COMMENT ON COLUMN user_profiles.company IS 'Nazwa firmy (opcjonalnie dla klientów B2B)';
COMMENT ON COLUMN user_profiles.nip IS 'NIP firmy (opcjonalnie dla klientów B2B)';

-- ============================================
-- 2. OPCJONALNIE: WYPEŁNIENIE first_name i last_name z full_name
-- ============================================
-- Jeśli full_name ma format "Imię Nazwisko", możemy je rozdzielić
-- To jest jednorazowa operacja dla istniejących użytkowników

UPDATE user_profiles
SET 
  first_name = SPLIT_PART(full_name, ' ', 1),
  last_name = CASE 
    WHEN POSITION(' ' IN full_name) > 0 
    THEN SUBSTRING(full_name FROM POSITION(' ' IN full_name) + 1)
    ELSE NULL
  END
WHERE first_name IS NULL AND full_name IS NOT NULL;

-- ============================================
-- 3. INDEKSY (opcjonalnie, dla wydajności wyszukiwania)
-- ============================================

-- Index dla wyszukiwania po telefonie (jeśli będzie używany)
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);

-- Index dla wyszukiwania po NIP (jeśli będzie używany w админке)
CREATE INDEX IF NOT EXISTS idx_user_profiles_nip ON user_profiles(nip);

-- ============================================
-- 4. POLITYKI RLS (Row Level Security)
-- ============================================
-- Użytkownicy mogą widzieć i edytować tylko swoje dane

-- Policy: Użytkownicy widzą tylko swój profil
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Użytkownicy mogą aktualizować swój profil
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- KONIEC MIGRACJI
-- ============================================

-- Wyświetl potwierdzenie
DO $$ 
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Extended user_profiles table with: first_name, last_name, phone, company, nip';
  RAISE NOTICE 'Added RLS policies for user profile access';
END $$;
