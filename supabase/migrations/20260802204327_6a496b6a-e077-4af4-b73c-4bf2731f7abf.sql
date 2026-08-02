-- 1. bookings extensions
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reference text,
  ADD COLUMN IF NOT EXISTS amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'NGN',
  ADD COLUMN IF NOT EXISTS stage text NOT NULL DEFAULT 'requested';

CREATE UNIQUE INDEX IF NOT EXISTS bookings_reference_key ON public.bookings(reference);
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_email_idx ON public.bookings(lower(email));

CREATE OR REPLACE FUNCTION public.set_booking_reference()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.reference IS NULL THEN
    NEW.reference := 'YV-' || to_char(now(), 'YYMM') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''), 1, 5));
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS bookings_reference ON public.bookings;
CREATE TRIGGER bookings_reference BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_booking_reference();

DROP TRIGGER IF EXISTS bookings_touch ON public.bookings;
CREATE TRIGGER bookings_touch BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

UPDATE public.bookings
SET reference = 'YV-' || to_char(created_at, 'YYMM') || '-' || upper(substr(replace(id::text,'-',''), 1, 5))
WHERE reference IS NULL;

DROP POLICY IF EXISTS bookings_client_read ON public.bookings;
CREATE POLICY bookings_client_read ON public.bookings
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS bookings_client_claim ON public.bookings;
CREATE POLICY bookings_client_claim ON public.bookings
  FOR UPDATE TO authenticated
  USING (user_id IS NULL AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
  WITH CHECK (user_id = auth.uid());

-- 2. invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  number text NOT NULL UNIQUE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  description text,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'unpaid',
  issued_at date NOT NULL DEFAULT current_date,
  due_at date,
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.invoices TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY invoices_client_read ON public.invoices
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR lower(client_email) = lower(coalesce(auth.jwt() ->> 'email','')) OR is_staff(auth.uid()));
CREATE POLICY invoices_staff_write ON public.invoices
  FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

DROP TRIGGER IF EXISTS invoices_touch ON public.invoices;
CREATE TRIGGER invoices_touch BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. deliverables
CREATE TABLE IF NOT EXISTS public.deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  label text NOT NULL,
  description text,
  url text NOT NULL,
  kind text NOT NULL DEFAULT 'file',
  size_bytes bigint,
  released boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.deliverables TO authenticated;
GRANT ALL ON public.deliverables TO service_role;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY deliverables_client_read ON public.deliverables
  FOR SELECT TO authenticated
  USING (
    is_staff(auth.uid())
    OR (released AND EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = deliverables.booking_id
        AND (b.user_id = auth.uid() OR lower(b.email) = lower(coalesce(auth.jwt() ->> 'email','')))
    ))
  );
CREATE POLICY deliverables_staff_write ON public.deliverables
  FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));

DROP TRIGGER IF EXISTS deliverables_touch ON public.deliverables;
CREATE TRIGGER deliverables_touch BEFORE UPDATE ON public.deliverables
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4. global search
CREATE OR REPLACE FUNCTION public.search_site(q text)
RETURNS TABLE (kind text, slug text, title text, excerpt text, image text, rank real)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH term AS (SELECT websearch_to_tsquery('english', coalesce(q,'')) AS tsq, coalesce(q,'') AS raw)
  SELECT 'project', p.slug, p.title, coalesce(p.description, p.challenge), p.cover_image,
         ts_rank(to_tsvector('english', coalesce(p.title,'') || ' ' || coalesce(p.description,'') || ' ' || coalesce(p.client,'') || ' ' || coalesce(p.industry,'')), term.tsq)
  FROM public.projects p, term
  WHERE p.published AND (term.tsq @@ to_tsvector('english', coalesce(p.title,'') || ' ' || coalesce(p.description,'') || ' ' || coalesce(p.client,'') || ' ' || coalesce(p.industry,'')) OR p.title ILIKE '%' || term.raw || '%')
  UNION ALL
  SELECT 'service', s.slug, s.title, coalesce(s.excerpt, s.overview), s.hero_image,
         ts_rank(to_tsvector('english', coalesce(s.title,'') || ' ' || coalesce(s.excerpt,'') || ' ' || coalesce(s.overview,'')), term.tsq)
  FROM public.services s, term
  WHERE s.published AND (term.tsq @@ to_tsvector('english', coalesce(s.title,'') || ' ' || coalesce(s.excerpt,'') || ' ' || coalesce(s.overview,'')) OR s.title ILIKE '%' || term.raw || '%')
  UNION ALL
  SELECT 'article', a.slug, a.title, coalesce(a.excerpt, left(a.content, 200)), a.featured_image,
         ts_rank(to_tsvector('english', coalesce(a.title,'') || ' ' || coalesce(a.excerpt,'') || ' ' || coalesce(a.content,'')), term.tsq)
  FROM public.articles a, term
  WHERE a.published AND (term.tsq @@ to_tsvector('english', coalesce(a.title,'') || ' ' || coalesce(a.excerpt,'') || ' ' || coalesce(a.content,'')) OR a.title ILIKE '%' || term.raw || '%')
  ORDER BY 6 DESC NULLS LAST
  LIMIT 40;
$$;

GRANT EXECUTE ON FUNCTION public.search_site(text) TO anon, authenticated;