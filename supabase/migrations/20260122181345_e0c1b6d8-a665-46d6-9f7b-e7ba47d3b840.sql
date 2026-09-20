-- Add courier fields to orders table
ALTER TABLE orders 
ADD COLUMN courier_name text,
ADD COLUMN tracking_number text;