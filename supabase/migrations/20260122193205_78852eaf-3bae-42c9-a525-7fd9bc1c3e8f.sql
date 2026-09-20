-- Fix abandoned_checkouts insert policy for public access
DROP POLICY IF EXISTS "Anyone can insert abandoned checkouts" ON public.abandoned_checkouts;
DROP POLICY IF EXISTS "Public can insert abandoned checkouts" ON public.abandoned_checkouts;

CREATE POLICY "Anyone can insert abandoned checkouts"
ON public.abandoned_checkouts
FOR INSERT
TO public
WITH CHECK (true);

-- Also add update policy for abandoned checkouts (needed to update existing sessions)
DROP POLICY IF EXISTS "Anyone can update abandoned checkouts" ON public.abandoned_checkouts;

CREATE POLICY "Anyone can update abandoned checkouts"
ON public.abandoned_checkouts
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);