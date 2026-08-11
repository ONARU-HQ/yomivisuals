ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS reference_file text;

CREATE POLICY "Anyone can attach a reference to an enquiry"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'references');

CREATE POLICY "Staff can view enquiry references"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'references' AND public.is_staff(auth.uid()));