
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- RLS policies for product-images bucket
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));

-- RLS policies for site-assets bucket
CREATE POLICY "Anyone can view site assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-assets' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update site assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete site assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets' AND public.is_admin(auth.uid()));

-- Seed courier settings data
INSERT INTO public.courier_settings (courier_name, display_name, is_enabled, is_default, default_weight)
VALUES 
  ('steadfast', 'Steadfast Courier', false, true, 0.5),
  ('pathao', 'Pathao Courier', false, false, 0.5),
  ('redx', 'RedX Courier', false, false, 0.5)
ON CONFLICT DO NOTHING;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
