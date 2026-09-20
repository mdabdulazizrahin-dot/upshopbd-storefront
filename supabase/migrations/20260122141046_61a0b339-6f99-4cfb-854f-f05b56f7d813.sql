-- Create table for abandoned/incomplete checkouts
CREATE TABLE public.abandoned_checkouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    delivery_address TEXT,
    district_id UUID REFERENCES public.districts(id),
    upazila_id UUID REFERENCES public.upazilas(id),
    delivery_type TEXT,
    order_note TEXT,
    cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC DEFAULT 0,
    delivery_charge NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    is_converted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.abandoned_checkouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert abandoned checkouts"
ON public.abandoned_checkouts
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update their own abandoned checkout by session"
ON public.abandoned_checkouts
FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all abandoned checkouts"
ON public.abandoned_checkouts
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete abandoned checkouts"
ON public.abandoned_checkouts
FOR DELETE
USING (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_abandoned_checkouts_updated_at
BEFORE UPDATE ON public.abandoned_checkouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();