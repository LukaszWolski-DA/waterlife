-- ================================================
-- 000_initial_schema.sql
-- WaterLife - Pełny schemat bazy danych
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. CATEGORIES TABLE
-- ================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_name ON categories(name);

-- ================================================
-- 2. MANUFACTURERS TABLE
-- ================================================
CREATE TABLE manufacturers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_manufacturers_name ON manufacturers(name);

-- ================================================
-- 3. PRODUCTS TABLE
-- ================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE SET NULL,
  images JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_manufacturer ON products(manufacturer_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_search ON products
  USING gin(to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, '')));

-- ================================================
-- 4. HOMEPAGE_CONTENT TABLE
-- ================================================
CREATE TABLE homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_homepage_section ON homepage_content(section);

-- ================================================
-- 5. ORDERS TABLE
-- ================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_info JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  )),
  notes TEXT,
  is_guest BOOLEAN DEFAULT FALSE,
  cart_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_is_guest ON orders(is_guest);

-- ================================================
-- 6. ORDER_ITEMS TABLE
-- ================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ================================================
-- 7. CONTACT_MESSAGES TABLE
-- ================================================
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_info JSONB NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_contact_created ON contact_messages(created_at DESC);

-- ================================================
-- 8. ADMIN_USERS TABLE
-- ================================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);

-- ================================================
-- 9. USER_PROFILES TABLE
-- ================================================
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company TEXT,
  nip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON COLUMN user_profiles.first_name IS 'Imię użytkownika';
COMMENT ON COLUMN user_profiles.last_name IS 'Nazwisko użytkownika';
COMMENT ON COLUMN user_profiles.phone IS 'Numer telefonu użytkownika';
COMMENT ON COLUMN user_profiles.company IS 'Nazwa firmy (opcjonalnie dla klientów B2B)';
COMMENT ON COLUMN user_profiles.nip IS 'NIP firmy (opcjonalnie dla klientów B2B)';

CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_user_profiles_nip ON user_profiles(nip);

-- ================================================
-- 10. CART_ITEMS TABLE
-- ================================================
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

COMMENT ON TABLE cart_items IS 'Koszyk zakupowy dla zalogowanych użytkowników';
COMMENT ON COLUMN cart_items.user_id IS 'ID użytkownika (FK do auth.users)';
COMMENT ON COLUMN cart_items.product_id IS 'ID produktu (FK do products)';
COMMENT ON COLUMN cart_items.quantity IS 'Ilość produktu w koszyku (min: 1)';
COMMENT ON COLUMN cart_items.price IS 'Cena produktu w momencie dodania do koszyka';

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ================================================
-- TRIGGERS
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manufacturers_updated_at
  BEFORE UPDATE ON manufacturers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON homepage_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Categories
CREATE POLICY "Public can view categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL TO authenticated USING (true);

-- Manufacturers
CREATE POLICY "Public can view manufacturers" ON manufacturers FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage manufacturers" ON manufacturers FOR ALL TO authenticated USING (true);

-- Products
CREATE POLICY "Public can view active products" ON products FOR SELECT TO public USING (status = 'active');
CREATE POLICY "Authenticated users can view all products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE TO authenticated USING (true);

-- Homepage content
CREATE POLICY "Public can view homepage content" ON homepage_content FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage homepage content" ON homepage_content FOR ALL TO authenticated USING (true);

-- Orders
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Authenticated users can view all orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update orders" ON orders FOR UPDATE TO authenticated USING (true);

-- Order items
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Authenticated users can view order items" ON order_items FOR SELECT TO authenticated USING (true);

-- Contact messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Authenticated users can manage contact messages" ON contact_messages FOR ALL TO authenticated USING (true);

-- Admin users
CREATE POLICY "Admins can view admin users" ON admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage admin users" ON admin_users FOR ALL TO authenticated USING (true);

-- User profiles
CREATE POLICY "Users can read own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Cart items
DROP POLICY IF EXISTS "Users can view own cart" ON cart_items;
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own cart" ON cart_items;
CREATE POLICY "Users can insert own cart" ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own cart" ON cart_items;
CREATE POLICY "Users can update own cart" ON cart_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own cart" ON cart_items;
CREATE POLICY "Users can delete own cart" ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- ================================================
-- SEED DATA
-- ================================================
INSERT INTO categories (name, description, keywords) VALUES
  ('Technika Grzewcza', 'Kotły, grzejniki i systemy ogrzewania', ARRAY['kotły', 'grzejniki', 'ogrzewanie']),
  ('Systemy Sanitarne', 'Armatura łazienkowa i sanitarna', ARRAY['baterie', 'umywalki', 'WC']),
  ('Nawadnianie', 'Systemy nawadniania ogrodów', ARRAY['zraszacze', 'nawadnianie', 'ogród']);

INSERT INTO manufacturers (name, description) VALUES
  ('Vaillant', 'Producent kotłów grzewczych'),
  ('Viessmann', 'Systemy grzewcze'),
  ('Grohe', 'Armatura sanitarna premium');

INSERT INTO homepage_content (section, content) VALUES
  ('hero', '{
    "companyName": "Waterlife s.c.",
    "mainTitle": "Profesjonalne Rozwiązania Hydrauliczne i Grzewcze",
    "subtitle": "Kompleksowa obsługa instalacji wodnych, kanalizacyjnych i systemów ogrzewania dla Twojego domu i firmy.",
    "ctaButtonPrimary": "Zobacz produkty",
    "ctaButtonSecondary": "Skontaktuj się",
    "benefits": [
      {"title": "Szybka Dostawa", "description": "Realizacja w 24h"},
      {"title": "Gwarancja Jakości", "description": "Certyfikowane produkty"},
      {"title": "Wsparcie Techniczne", "description": "Pomoc ekspertów"}
    ]
  }'::jsonb);