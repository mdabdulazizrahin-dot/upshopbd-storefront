-- Create storage bucket for site assets (logo, favicon, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view site assets (public bucket)
CREATE POLICY "Anyone can view site assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

-- Allow admins to upload site assets
CREATE POLICY "Admins can upload site assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-assets' AND public.is_admin(auth.uid()));

-- Allow admins to update site assets
CREATE POLICY "Admins can update site assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-assets' AND public.is_admin(auth.uid()));

-- Allow admins to delete site assets
CREATE POLICY "Admins can delete site assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-assets' AND public.is_admin(auth.uid()));