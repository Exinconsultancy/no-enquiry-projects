-- Create storage bucket for property media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('property-media', 'property-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- Create policies for property media bucket
CREATE POLICY "Anyone can view property media"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-media');

CREATE POLICY "Authenticated users can upload property media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admins and builders can update property media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admins and builders can delete property media"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-media' AND auth.role() = 'authenticated');