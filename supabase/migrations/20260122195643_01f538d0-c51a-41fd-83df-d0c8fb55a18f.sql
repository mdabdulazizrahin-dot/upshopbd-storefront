-- Remove overly permissive UPDATE policy for abandoned_checkouts
-- This prevents malicious users from modifying any checkout record
DROP POLICY IF EXISTS "Anyone can update abandoned checkouts" ON public.abandoned_checkouts;
DROP POLICY IF EXISTS "Anyone can update their own abandoned checkout by session" ON public.abandoned_checkouts;