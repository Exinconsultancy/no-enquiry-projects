-- Update existing policies for property media storage
DROP POLICY IF EXISTS "Property media is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload property media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update property media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete property media" ON storage.objects;

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