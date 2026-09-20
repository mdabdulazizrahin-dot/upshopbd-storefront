-- Add courier_tracking_link column to orders table for flexible tracking
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS courier_tracking_link TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.orders.courier_tracking_link IS 'Manual or auto-generated courier tracking URL. Can be set manually by admin or automatically via courier API integration.';