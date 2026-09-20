-- Create site_settings table for all CMS configurations
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL DEFAULT '{}',
    setting_group TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete site settings" 
ON public.site_settings 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create pages table for CMS content
CREATE TABLE public.pages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for pages
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
CREATE POLICY "Anyone can view published pages" 
ON public.pages 
FOR SELECT 
USING (status = 'published');

-- Only admins can manage pages
CREATE POLICY "Admins can insert pages" 
ON public.pages 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update pages" 
ON public.pages 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete pages" 
ON public.pages 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Add trigger for pages updated_at
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create home_sections table for section management
CREATE TABLE public.home_sections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for home_sections
ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;

-- Public can read sections
CREATE POLICY "Anyone can view home sections" 
ON public.home_sections 
FOR SELECT 
USING (true);

-- Only admins can manage sections
CREATE POLICY "Admins can insert home sections" 
ON public.home_sections 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update home sections" 
ON public.home_sections 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete home sections" 
ON public.home_sections 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Add trigger for home_sections updated_at
CREATE TRIGGER update_home_sections_updated_at
BEFORE UPDATE ON public.home_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create banners table
CREATE TABLE public.banners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Enable RLS for banners
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public can read active banners
CREATE POLICY "Anyone can view active banners" 
ON public.banners 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage banners
CREATE POLICY "Admins can insert banners" 
ON public.banners 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update banners" 
ON public.banners 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete banners" 
ON public.banners 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Add trigger for banners updated_at
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create menu_items table for navigation
CREATE TABLE public.menu_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_location TEXT NOT NULL DEFAULT 'header',
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Public can read active menu items
CREATE POLICY "Anyone can view active menu items" 
ON public.menu_items 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage menu items
CREATE POLICY "Admins can insert menu items" 
ON public.menu_items 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update menu items" 
ON public.menu_items 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete menu items" 
ON public.menu_items 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Add trigger for menu_items updated_at
CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_group) VALUES
-- Typography
('typography', '{"fontFamily": "Hind Siliguri", "headingSize": "2.5rem", "bodySize": "1rem", "lineHeight": "1.6"}', 'typography'),
-- Colors
('colors', '{"primary": "346 77% 50%", "secondary": "346 60% 40%", "buttonColor": "346 77% 50%", "hoverColor": "346 77% 45%", "textColor": "0 0% 20%", "backgroundColor": "0 0% 100%"}', 'colors'),
-- Header
('header', '{"logoUrl": "", "backgroundColor": "0 0% 100%", "isSticky": true}', 'header'),
-- Footer
('footer', '{"backgroundColor": "0 0% 10%", "textColor": "0 0% 100%", "copyrightText": "© 2026 ShopBD. All rights reserved.", "columns": []}', 'footer'),
-- General
('general', '{"siteName": "ShopBD", "tagline": "Your One-Stop Shop", "phone": "+880 1234-567890", "email": "info@shopbd.com", "address": "Dhaka, Bangladesh", "faviconUrl": ""}', 'general'),
-- Social Media
('social', '{"facebook": "", "instagram": "", "twitter": "", "youtube": "", "linkedin": ""}', 'social');

-- Insert default home sections
INSERT INTO public.home_sections (section_key, title, is_visible, sort_order, settings) VALUES
('hero_banner', 'Hero Banner', true, 1, '{}'),
('categories', 'Top Categories', true, 2, '{"title": "Top Categories"}'),
('featured_products', 'Featured Products', true, 3, '{"title": "Featured Products", "limit": 12}'),
('features', 'Features', true, 4, '{}');