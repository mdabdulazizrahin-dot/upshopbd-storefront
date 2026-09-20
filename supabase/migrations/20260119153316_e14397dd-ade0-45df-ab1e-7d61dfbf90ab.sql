-- ============================================
-- ShopBD E-commerce Database Schema
-- ============================================

-- 1. Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');
CREATE TYPE public.product_type AS ENUM ('simple', 'variable');
CREATE TYPE public.product_status AS ENUM ('active', 'inactive');
CREATE TYPE public.category_status AS ENUM ('active', 'inactive');
CREATE TYPE public.payment_method AS ENUM ('cod');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.delivery_type AS ENUM ('inside_dhaka', 'outside_dhaka');

-- 2. Create profiles table (for additional user info)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 4. Create categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    status category_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    product_type product_type NOT NULL DEFAULT 'simple',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    sale_price DECIMAL(10, 2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    status product_status NOT NULL DEFAULT 'active',
    seo_title TEXT,
    seo_description TEXT,
    seo_slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Create product_images table
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    is_main BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Create product_variations table
CREATE TABLE public.product_variations (
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

-- 8. Create districts table (Bangladesh 64 districts)
CREATE TABLE public.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    division TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Create upazilas table
CREATE TABLE public.upazilas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Create delivery_settings table
CREATE TABLE public.delivery_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_type delivery_type NOT NULL UNIQUE,
    charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    district_id UUID REFERENCES public.districts(id),
    upazila_id UUID REFERENCES public.upazilas(id),
    order_note TEXT,
    delivery_type delivery_type NOT NULL,
    delivery_charge DECIMAL(10, 2) NOT NULL DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_method payment_method NOT NULL DEFAULT 'cod',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    order_status order_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Create order_items table
CREATE TABLE public.order_items (
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

-- 13. Create visitors table (for analytics)
CREATE TABLE public.visitors (
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

-- 14. Create daily_analytics table (aggregated analytics)
CREATE TABLE public.daily_analytics (
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
-- Security Definer Functions
-- ============================================

-- Function to check user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'admin')
$$;

-- ============================================
-- Triggers
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_variations_updated_at BEFORE UPDATE ON public.product_variations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_delivery_settings_updated_at BEFORE UPDATE ON public.delivery_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_daily_analytics_updated_at BEFORE UPDATE ON public.daily_analytics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'SBD-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
    EXECUTE FUNCTION public.generate_order_number();

-- ============================================
-- Row Level Security
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upazilas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin(auth.uid()));

-- User roles policies (only admins can manage roles)
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (status = 'active' OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.is_admin(auth.uid()));

-- Products policies (public read active, admin write)
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active' OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.is_admin(auth.uid()));

-- Product images policies
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL USING (public.is_admin(auth.uid()));

-- Product variations policies
CREATE POLICY "Anyone can view product variations" ON public.product_variations FOR SELECT USING (true);
CREATE POLICY "Admins can manage product variations" ON public.product_variations FOR ALL USING (public.is_admin(auth.uid()));

-- Districts policies (public read)
CREATE POLICY "Anyone can view districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Admins can manage districts" ON public.districts FOR ALL USING (public.is_admin(auth.uid()));

-- Upazilas policies (public read)
CREATE POLICY "Anyone can view upazilas" ON public.upazilas FOR SELECT USING (true);
CREATE POLICY "Admins can manage upazilas" ON public.upazilas FOR ALL USING (public.is_admin(auth.uid()));

-- Delivery settings policies (public read, admin write)
CREATE POLICY "Anyone can view delivery settings" ON public.delivery_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage delivery settings" ON public.delivery_settings FOR ALL USING (public.is_admin(auth.uid()));

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.is_admin(auth.uid()));

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin(auth.uid())))
);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all order items" ON public.order_items FOR ALL USING (public.is_admin(auth.uid()));

-- Visitors policies (insert by anyone, read by admin)
CREATE POLICY "Anyone can log visits" ON public.visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all visits" ON public.visitors FOR SELECT USING (public.is_admin(auth.uid()));

-- Daily analytics policies (admin only)
CREATE POLICY "Admins can view analytics" ON public.daily_analytics FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage analytics" ON public.daily_analytics FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================
-- Storage Bucket for Product Images
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- Storage policies
CREATE POLICY "Anyone can view product images storage" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can upload product images storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update product images storage" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete product images storage" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));