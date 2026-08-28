
-- Pipeline + classification enums
CREATE TYPE public.project_stage AS ENUM (
  'new_brief','reviewing','qualified','discovery','proposal','approved',
  'pre_production','production','post_production','client_review','delivered','completed','archived'
);
CREATE TYPE public.project_size AS ENUM ('small','medium','large','enterprise');

-- CRM: one record per client/company
CREATE TABLE public.client_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  company text,
  role text,
  phone text,
  website text,
  instagram text,
  industry text,
  brief_count integer NOT NULL DEFAULT 0,
  last_brief_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_records TO authenticated;
GRANT ALL ON public.client_records TO service_role;
ALTER TABLE public.client_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage client records" ON public.client_records FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Project briefs (the project engine record)
CREATE TABLE public.project_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL UNIQUE,
  client_id uuid REFERENCES public.client_records(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  project_types text[] NOT NULL DEFAULT '{}',
  objective text,
  brand text,
  industry text,
  website text,
  instagram text,
  capabilities text[] NOT NULL DEFAULT '{}',
  recommended text[] NOT NULL DEFAULT '{}',
  timeline text,
  production_date date,
  budget text,
  location text,

  name text NOT NULL,
  company text,
  role text,
  email text NOT NULL,
  phone text,

  category text NOT NULL DEFAULT 'other',
  size public.project_size NOT NULL DEFAULT 'small',
  workflow text NOT NULL DEFAULT 'standard',
  stage public.project_stage NOT NULL DEFAULT 'new_brief',
  summary text,
  reference_file text,
  source text,
  internal_notes text,
  last_contacted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_briefs TO authenticated;
GRANT INSERT ON public.project_briefs TO anon;
GRANT ALL ON public.project_briefs TO service_role;
ALTER TABLE public.project_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a brief" ON public.project_briefs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff read briefs" ON public.project_briefs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Clients read their own briefs" ON public.project_briefs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Staff update briefs" ON public.project_briefs FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete briefs" ON public.project_briefs FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE INDEX project_briefs_stage_idx ON public.project_briefs (stage, created_at DESC);
CREATE INDEX project_briefs_email_idx ON public.project_briefs (email);

CREATE TRIGGER project_briefs_touch BEFORE UPDATE ON public.project_briefs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER client_records_touch BEFORE UPDATE ON public.client_records
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Assign a human project id (YV-XXXX) and upsert the CRM record
CREATE OR REPLACE FUNCTION public.handle_new_project_brief()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq_val bigint;
  crm_id uuid;
BEGIN
  IF NEW.project_id IS NULL OR NEW.project_id = '' THEN
    SELECT nextval('public.project_brief_seq') INTO seq_val;
    NEW.project_id := 'YV-' || lpad(seq_val::text, 4, '0');
  END IF;

  INSERT INTO public.client_records (email, name, company, role, phone, website, instagram, industry, brief_count, last_brief_at)
  VALUES (lower(NEW.email), NEW.name, NEW.company, NEW.role, NEW.phone, NEW.website, NEW.instagram, NEW.industry, 1, now())
  ON CONFLICT (email) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, public.client_records.name),
    company = COALESCE(EXCLUDED.company, public.client_records.company),
    role = COALESCE(EXCLUDED.role, public.client_records.role),
    phone = COALESCE(EXCLUDED.phone, public.client_records.phone),
    website = COALESCE(EXCLUDED.website, public.client_records.website),
    instagram = COALESCE(EXCLUDED.instagram, public.client_records.instagram),
    industry = COALESCE(EXCLUDED.industry, public.client_records.industry),
    brief_count = public.client_records.brief_count + 1,
    last_brief_at = now()
  RETURNING id INTO crm_id;

  NEW.client_id := crm_id;
  RETURN NEW;
END;
$$;

CREATE SEQUENCE IF NOT EXISTS public.project_brief_seq START 1001;
GRANT USAGE ON SEQUENCE public.project_brief_seq TO anon, authenticated, service_role;

CREATE TRIGGER project_briefs_before_insert BEFORE INSERT ON public.project_briefs
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_project_brief();
