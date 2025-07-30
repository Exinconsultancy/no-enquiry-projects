-- Create properties table for real-time property management
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  type TEXT NOT NULL,
  builder TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  category TEXT NOT NULL DEFAULT 'property',
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  brochures TEXT[] DEFAULT '{}',
  bedrooms TEXT DEFAULT '2-3 BHK',
  bathrooms TEXT DEFAULT '2-3 Bath',
  area TEXT DEFAULT '1200-1800 sq ft',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for property access
CREATE POLICY "Properties are viewable by everyone" 
ON public.properties 
FOR SELECT 
USING (true);

CREATE POLICY "Admin and builders can create properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin and builders can update properties" 
ON public.properties 
FOR UPDATE 
USING (true);

CREATE POLICY "Admin can delete properties" 
ON public.properties 
FOR DELETE 
USING (true);

-- Add trigger for timestamps
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for properties table
ALTER TABLE public.properties REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;