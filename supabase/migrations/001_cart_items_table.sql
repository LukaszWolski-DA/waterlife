-- Migration: Utworzenie tabeli cart_items i aktualizacja orders
-- Data: 2026-02-03
-- Opis: Hybrydowy system koszyka zakupowego

-- ============================================
-- 1. TABELA CART_ITEMS
-- ============================================

-- Utworzenie tabeli cart_items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Komentarze do kolumn
COMMENT ON TABLE cart_items IS 'Koszyk zakupowy dla zalogowanych użytkowników';
COMMENT ON COLUMN cart_items.user_id IS 'ID użytkownika (FK do auth.users)';
COMMENT ON COLUMN cart_items.product_id IS 'ID produktu (FK do products)';
COMMENT ON COLUMN cart_items.quantity IS 'Ilość produktu w koszyku (min: 1)';
COMMENT ON COLUMN cart_items.price IS 'Cena produktu w momencie dodania do koszyka';

-- Index dla szybszych zapytań
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ============================================
-- 2. AKTUALIZACJA TABELI ORDERS
-- ============================================

-- Dodanie kolumn dla integracji z koszykiem (jeśli nie istnieją)
DO $$ 
BEGIN
  -- user_id - link do auth.users dla zalogowanych użytkowników
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    COMMENT ON COLUMN orders.user_id IS 'ID użytkownika (NULL dla gości)';
  END IF;

  -- is_guest - flaga czy zamówienie złożone przez gościa
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'is_guest'
  ) THEN
    ALTER TABLE orders ADD COLUMN is_guest BOOLEAN DEFAULT FALSE;
    COMMENT ON COLUMN orders.is_guest IS 'Czy zamówienie złożone przez gościa (bez konta)';
  END IF;

  -- cart_snapshot - JSON snapshot koszyka w momencie zamówienia
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'cart_snapshot'
  ) THEN
    ALTER TABLE orders ADD COLUMN cart_snapshot JSONB;
    COMMENT ON COLUMN orders.cart_snapshot IS 'Snapshot koszyka w momencie składania zamówienia';
  END IF;
END $$;

-- ============================================
-- 3. FUNKCJE POMOCNICZE
-- ============================================

-- Funkcja automatycznego update'u updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla cart_items
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Włączenie RLS dla cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Policy: Użytkownicy widzą tylko swój koszyk
DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Użytkownicy mogą dodawać do swojego koszyka
DROP POLICY IF EXISTS "Users can insert own cart" ON cart_items;
CREATE POLICY "Users can insert own cart"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Użytkownicy mogą aktualizować swój koszyk
DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Użytkownicy mogą usuwać ze swojego koszyka
DROP POLICY IF EXISTS "Users can delete own cart" ON cart_items;
CREATE POLICY "Users can delete own cart"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. DODATKOWE INDEXY DLA WYDAJNOŚCI
-- ============================================

-- Index dla orders.user_id
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Index dla orders.is_guest
CREATE INDEX IF NOT EXISTS idx_orders_is_guest ON orders(is_guest);

-- ============================================
-- KONIEC MIGRACJI
-- ============================================

-- Wyświetl potwierdzenie
DO $$ 
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Created: cart_items table with RLS policies';
  RAISE NOTICE 'Updated: orders table with user_id, is_guest, cart_snapshot columns';
END $$;
