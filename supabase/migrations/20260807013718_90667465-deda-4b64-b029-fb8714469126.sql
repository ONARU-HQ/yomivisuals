CREATE TABLE public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  thumb_url text,
  blur_data text,
  original_filename text,
  title text not null default 'Untitled',
  category text not null default 'Portraits',
  tags text[] not null default '{}',
  orientation text not null default 'portrait',
  width integer,
  height integer,
  priority text not null default 'standard',
  featured boolean not null default false,
  homepage boolean not null default false,
  in_portfolio boolean not null default true,
  hero boolean not null default false,
  hero_order integer not null default 0,
  focal_x numeric not null default 0.5,
  focal_y numeric not null default 0.4,
  quality_score numeric not null default 0,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.portfolio_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_images TO authenticated;
GRANT ALL ON public.portfolio_images TO service_role;

ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY portfolio_images_public_read ON public.portfolio_images FOR SELECT USING (active = true);
CREATE POLICY portfolio_images_staff_all ON public.portfolio_images FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER touch_portfolio_images BEFORE UPDATE ON public.portfolio_images FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX portfolio_images_category_idx ON public.portfolio_images (category);
CREATE INDEX portfolio_images_sort_idx ON public.portfolio_images (sort_order);