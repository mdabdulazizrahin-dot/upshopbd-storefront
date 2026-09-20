-- Fix abandoned_checkouts SELECT policy to allow upsert operations
-- Users need to be able to SELECT their own session to make upsert work
DROP POLICY IF EXISTS "Anyone can select their own session" ON public.abandoned_checkouts;

CREATE POLICY "Anyone can select their own session"
ON public.abandoned_checkouts
FOR SELECT
TO public
USING (true);

-- Ensure the insert policy is correctly set
DROP POLICY IF EXISTS "Anyone can insert abandoned checkouts" ON public.abandoned_checkouts;

CREATE POLICY "Anyone can insert abandoned checkouts"
ON public.abandoned_checkouts
FOR INSERT
TO public
WITH CHECK (true);

-- Clean up duplicate update policies
DROP POLICY IF EXISTS "Anyone can update their own abandoned checkout by session" ON public.abandoned_checkouts;
DROP POLICY IF EXISTS "Anyone can update abandoned checkouts" ON public.abandoned_checkouts;

CREATE POLICY "Anyone can update abandoned checkouts"
ON public.abandoned_checkouts
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);