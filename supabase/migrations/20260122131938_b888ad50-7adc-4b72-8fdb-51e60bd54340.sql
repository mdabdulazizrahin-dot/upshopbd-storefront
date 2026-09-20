-- Create language_preferences table to store user language settings
CREATE TABLE public.language_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  admin_language TEXT NOT NULL DEFAULT 'en',
  frontend_language TEXT NOT NULL DEFAULT 'bn',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.language_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own language preferences"
ON public.language_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own language preferences"
ON public.language_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own language preferences"
ON public.language_preferences
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_language_preferences_updated_at
BEFORE UPDATE ON public.language_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add global site language setting for non-logged in users
INSERT INTO public.site_settings (setting_key, setting_group, setting_value)
VALUES ('default_language', 'general', '"bn"')
ON CONFLICT (setting_key) DO NOTHING;