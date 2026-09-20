-- Create courier_notes table for storing courier timeline events
CREATE TABLE public.courier_notes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    source TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'courier', 'system'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.courier_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all courier notes"
ON public.courier_notes
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can insert courier notes"
ON public.courier_notes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view courier notes for their orders"
ON public.courier_notes
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = courier_notes.order_id
        AND (orders.user_id = auth.uid() OR orders.user_id IS NULL OR is_admin(auth.uid()))
    )
);

-- Create index for faster queries
CREATE INDEX idx_courier_notes_order_id ON public.courier_notes(order_id);
CREATE INDEX idx_courier_notes_created_at ON public.courier_notes(created_at DESC);