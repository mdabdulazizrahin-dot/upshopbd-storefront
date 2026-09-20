-- Remove overly permissive SELECT policy for abandoned_checkouts
-- Keep admin-only SELECT for viewing abandoned checkouts in admin panel
DROP POLICY IF EXISTS "Anyone can select their own session" ON public.abandoned_checkouts;
DROP POLICY IF EXISTS "Admins can view all abandoned checkouts" ON public.abandoned_checkouts;

-- Admin-only SELECT policy
CREATE POLICY "Admins can view all abandoned checkouts"
ON public.abandoned_checkouts
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));