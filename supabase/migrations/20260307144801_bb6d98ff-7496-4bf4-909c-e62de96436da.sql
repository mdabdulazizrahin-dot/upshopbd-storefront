
DROP POLICY "Users can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (
  (auth.uid() = user_id) OR (user_id IS NULL)
);

DROP POLICY "Users can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND ((orders.user_id = auth.uid()) OR (orders.user_id IS NULL))
  )
);
