-- Fix orders table RLS policies - make INSERT permissive for guest checkout
-- The issue is that policies are RESTRICTIVE (default is PERMISSIVE but was changed)

-- First drop existing policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;

-- Recreate as PERMISSIVE policies (which is the default)
-- Guest checkout: Allow anyone to INSERT orders
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (true);

-- Users can view their own orders (by user_id match or admin)
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO public
USING ((auth.uid() = user_id) OR (user_id IS NULL) OR is_admin(auth.uid()));

-- Admins can manage all orders (UPDATE, DELETE)
CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
TO authenticated
USING (is_admin(auth.uid()));

-- Also fix order_items table
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

-- Recreate order_items policies as PERMISSIVE
CREATE POLICY "Anyone can create order items"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Users can view their own order items"
ON public.order_items
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND ((orders.user_id = auth.uid()) OR (orders.user_id IS NULL) OR is_admin(auth.uid()))
  )
);

CREATE POLICY "Admins can manage all order items"
ON public.order_items
FOR ALL
TO authenticated
USING (is_admin(auth.uid()));