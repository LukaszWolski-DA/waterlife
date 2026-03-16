-- Migration 007: Security hardening — fix Security Advisor warnings
-- 1. Fix mutable search_path in functions
-- 2. Remove overly permissive RLS policies (writes go through service role)

-- ================================================
-- 1. Fix mutable search_path
-- ================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'user'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ================================================
-- 2. Remove overly permissive RLS policies
-- ================================================

-- admin_users
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- categories
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;

-- contact_messages
DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON contact_messages;

-- homepage_content
DROP POLICY IF EXISTS "Authenticated users can manage homepage content" ON homepage_content;

-- manufacturers
DROP POLICY IF EXISTS "Authenticated users can manage manufacturers" ON manufacturers;

-- order_items
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;

-- orders
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;

-- products
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;
