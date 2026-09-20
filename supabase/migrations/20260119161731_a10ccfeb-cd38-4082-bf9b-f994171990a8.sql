-- Update product-images bucket to allow larger files (50MB)
UPDATE storage.buckets 
SET file_size_limit = 52428800 
WHERE id = 'product-images';