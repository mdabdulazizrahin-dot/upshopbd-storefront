-- Create courier_settings table for storing API credentials and configuration
CREATE TABLE public.courier_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  courier_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  access_token TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  is_default BOOLEAN NOT NULL DEFAULT false,
  default_weight NUMERIC NOT NULL DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courier_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage courier settings
CREATE POLICY "Admins can manage courier settings"
ON public.courier_settings
FOR ALL
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_courier_settings_updated_at
BEFORE UPDATE ON public.courier_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add courier_status column to orders table
ALTER TABLE public.orders 
ADD COLUMN courier_status TEXT DEFAULT NULL,
ADD COLUMN courier_consignment_id TEXT DEFAULT NULL,
ADD COLUMN courier_booked_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Insert default courier options
INSERT INTO public.courier_settings (courier_name, display_name, is_enabled, is_default) VALUES
('steadfast', 'স্টিডফাস্ট (Steadfast)', false, true),
('pathao', 'পাঠাও (Pathao)', false, false),
('redx', 'রেডএক্স (RedX)', false, false);