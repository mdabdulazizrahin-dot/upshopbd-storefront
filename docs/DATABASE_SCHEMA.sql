-- ============================================
-- ShopBD E-commerce Database Schema
-- Complete PostgreSQL Schema for Self-Hosting
-- ============================================
-- 
-- This schema is compatible with PostgreSQL 14+
-- For MySQL compatibility, see MYSQL_SCHEMA.sql
--
-- Run this file to set up the complete database:
-- psql -U postgres -d shopbd -f DATABASE_SCHEMA.sql
-- ============================================

-- ============================================
-- 1. Create ENUM Types
-- ============================================

DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.product_type AS ENUM ('simple', 'variable');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.product_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.category_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_method AS ENUM ('cod');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status AS ENUM ('pending', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.delivery_type AS ENUM ('inside_dhaka', 'outside_dhaka');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. Users Table (For non-Supabase deployments)
-- ============================================
-- Note: If using Supabase, this table is managed by auth.users
-- For self-hosted, use this table

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_confirmed_at TIMESTAMP WITH TIME ZONE,
    raw_user_meta_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 3. Profiles Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key if users table exists
-- ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- ============================================
-- 4. User Roles Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role public.app_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- ============================================
-- 5. Categories Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    status public.category_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 6. Products Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    product_type public.product_type NOT NULL DEFAULT 'simple',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(10, 2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    status public.product_status NOT NULL DEFAULT 'active',
    seo_title TEXT,
    seo_description TEXT,
    seo_slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_seo_slug ON public.products(seo_slug);

-- ============================================
-- 7. Product Images Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    is_main BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- ============================================
-- 8. Product Variations Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.product_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    sku TEXT,
    attributes JSONB NOT NULL DEFAULT '{}',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(10, 2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variations_product ON public.product_variations(product_id);

-- ============================================
-- 9. Districts Table (Bangladesh 64 Districts)
-- ============================================

CREATE TABLE IF NOT EXISTS public.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    division TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 10. Upazilas Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.upazilas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_upazilas_district ON public.upazilas(district_id);

-- ============================================
-- 11. Delivery Settings Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.delivery_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_type public.delivery_type NOT NULL UNIQUE,
    charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 12. Orders Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    district_id UUID REFERENCES public.districts(id),
    upazila_id UUID REFERENCES public.upazilas(id),
    order_note TEXT,
    delivery_type public.delivery_type NOT NULL,
    delivery_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_method public.payment_method NOT NULL DEFAULT 'cod',
    payment_status public.payment_status NOT NULL DEFAULT 'pending',
    order_status public.order_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- ============================================
-- 13. Order Items Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variation_id UUID REFERENCES public.product_variations(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variation_attributes JSONB,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ============================================
-- 14. Visitors Table (Analytics)
-- ============================================

CREATE TABLE IF NOT EXISTS public.visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    visited_page TEXT NOT NULL,
    referrer TEXT,
    visit_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visitors_session ON public.visitors(session_id);
CREATE INDEX IF NOT EXISTS idx_visitors_visit_time ON public.visitors(visit_time DESC);

-- ============================================
-- 15. Daily Analytics Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.daily_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_visits INTEGER NOT NULL DEFAULT 0,
    unique_visitors INTEGER NOT NULL DEFAULT 0,
    total_orders INTEGER NOT NULL DEFAULT 0,
    total_sales DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 16. Site Settings Table (CMS)
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL DEFAULT '{}',
    setting_group TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 17. Pages Table (CMS)
-- ============================================

CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 18. Home Sections Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.home_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 19. Banners Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    button_text TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 20. Menu Items Table
-- ============================================

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_location TEXT NOT NULL DEFAULT 'header',
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================
-- 21. Database Functions
-- ============================================

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
    SELECT public.has_role(_user_id, 'admin')
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate order number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'SBD-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 22. Triggers
-- ============================================

-- Updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_variations_updated_at ON public.product_variations;
CREATE TRIGGER update_product_variations_updated_at 
    BEFORE UPDATE ON public.product_variations 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_delivery_settings_updated_at ON public.delivery_settings;
CREATE TRIGGER update_delivery_settings_updated_at 
    BEFORE UPDATE ON public.delivery_settings 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_analytics_updated_at ON public.daily_analytics;
CREATE TRIGGER update_daily_analytics_updated_at 
    BEFORE UPDATE ON public.daily_analytics 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON public.site_settings 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON public.pages 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_home_sections_updated_at ON public.home_sections;
CREATE TRIGGER update_home_sections_updated_at 
    BEFORE UPDATE ON public.home_sections 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_banners_updated_at ON public.banners;
CREATE TRIGGER update_banners_updated_at 
    BEFORE UPDATE ON public.banners 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON public.menu_items 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Order number trigger
DROP TRIGGER IF EXISTS set_order_number ON public.orders;
CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
    EXECUTE FUNCTION public.generate_order_number();

-- ============================================
-- Schema Complete
-- ============================================
-- Now run SEED_DATA.sql to populate initial data
