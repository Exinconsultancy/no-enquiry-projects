-- Create storage bucket for property media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-media',
  'property-media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create policies for property media storage
CREATE POLICY "Property media is publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-media');

CREATE POLICY "Admin can upload property media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'property-media' 
  AND auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE role = 'admin'
  )
);

CREATE POLICY "Admin can update property media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'property-media' 
  AND auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE role = 'admin'
  )
);

CREATE POLICY "Admin can delete property media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'property-media' 
  AND auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE role = 'admin'
  )
);