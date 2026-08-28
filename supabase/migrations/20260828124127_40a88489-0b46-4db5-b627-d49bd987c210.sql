
-- 1. Extend projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Photography',
  ADD COLUMN IF NOT EXISTS categories text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS project_type text,
  ADD COLUMN IF NOT EXISTS year integer,
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'public',
  ADD COLUMN IF NOT EXISTS featured_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hero_video text,
  ADD COLUMN IF NOT EXISTS idea text,
  ADD COLUMN IF NOT EXISTS approach text,
  ADD COLUMN IF NOT EXISTS production text,
  ADD COLUMN IF NOT EXISTS outcome text,
  ADD COLUMN IF NOT EXISTS sections jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_visibility_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_visibility_check CHECK (visibility IN ('public','unlisted','private'));

UPDATE public.projects SET year = EXTRACT(year FROM project_date)::int WHERE year IS NULL AND project_date IS NOT NULL;
UPDATE public.projects SET category = 'Campaigns' WHERE industry ILIKE '%campaign%';
UPDATE public.projects SET project_type = COALESCE(project_type, industry);

DROP POLICY IF EXISTS projects_public_read ON public.projects;
CREATE POLICY projects_public_read ON public.projects FOR SELECT
  USING (published = true AND visibility <> 'private');
CREATE POLICY projects_staff_read ON public.projects FOR SELECT
  USING (public.is_staff(auth.uid()));

-- 2. Media library
CREATE TABLE IF NOT EXISTS public.project_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  provider text,
  filename text,
  alt text,
  caption text,
  layout text NOT NULL DEFAULT 'full',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.project_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_media TO authenticated;
GRANT ALL ON public.project_media TO service_role;

ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY project_media_public_read ON public.project_media FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.published AND p.visibility <> 'private'));
CREATE POLICY project_media_staff_all ON public.project_media FOR ALL
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE INDEX IF NOT EXISTS project_media_project_idx ON public.project_media(project_id, sort_order);

-- 3. Every portfolio image belongs to a project
ALTER TABLE public.portfolio_images ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

-- 4. Curated series projects from the existing library
INSERT INTO public.projects (slug, title, client, industry, category, project_type, location, year, project_date, services, description, idea, production, outcome, published, visibility, featured, sort_order)
VALUES
 ('fashion-editorial-series','Fashion Editorial Series','Yomi Visuals','Fashion','Photography','Editorial & Lookbook','Lagos, Nigeria',2025,'2025-05-01',ARRAY['Creative Direction','Photography','Styling Support'],'A rolling body of fashion and editorial photography produced for designers, stylists and personal brands across Lagos.','A single visual language across many wardrobes: sculptural light, deep contrast and confident stillness.','Studio and on-location production with lighting design, art direction and full retouch.','A consistent editorial catalogue brands reference when briefing new campaigns.',true,'public',false,20),
 ('portrait-studio-series','Portrait Studio Series','Yomi Visuals','Portraits','Photography','Portraiture','Lagos, Nigeria',2025,'2025-03-01',ARRAY['Creative Direction','Photography','Post-Production'],'Portrait work for founders, celebrants and public figures — made to be used across profiles, press and brand platforms.','Portraits that read as brand assets, not snapshots.','Controlled lighting, deliberate framing and colour grading built for print and digital.','Portrait libraries clients reuse across a full year of communication.',true,'public',false,21),
 ('brand-content-series','Brand & Product Content','Yomi Visuals','Commercial','Brand Content','Content Production','Lagos, Nigeria',2025,'2025-07-01',ARRAY['Creative Direction','Photography','Content Production'],'Commercial and product content produced for brand channels, launches and always-on social.','Content built for the feed first, without losing campaign-grade craft.','Fast-turnaround studio production with repeatable set-ups and consistent grading.','Content libraries that keep brand channels active between campaigns.',true,'public',false,22),
 ('corporate-leadership-series','Corporate & Leadership','Yomi Visuals','Corporate','Photography','Corporate Portraiture','Lagos, Nigeria',2025,'2025-02-01',ARRAY['Creative Direction','Photography'],'Leadership and company photography for organisations that need credible, modern visual identity assets.','Authority without stiffness.','On-site and studio production designed around executive schedules.','Consistent leadership imagery across web, press and investor material.',true,'public',false,23),
 ('hospitality-events-series','Hospitality & Experiences','Yomi Visuals','Hospitality','Production','Event & Experience Production','Lagos, Nigeria',2025,'2025-08-01',ARRAY['Production','Photography','Coverage'],'Experience and hospitality productions — milestones, gatherings and branded experiences documented as visual stories.','Document the room the way it felt, not the way it looked on a schedule.','Multi-shooter coverage, ambient lighting design and same-week edits.','Story-led galleries brands and hosts publish immediately.',true,'public',false,24)
ON CONFLICT (slug) DO NOTHING;

-- Map library images to their series project
UPDATE public.portfolio_images pi SET project_id = p.id
FROM public.projects p
WHERE pi.project_id IS NULL AND p.slug = CASE pi.category
  WHEN 'Fashion' THEN 'fashion-editorial-series'
  WHEN 'Portraits' THEN 'portrait-studio-series'
  WHEN 'Commercial' THEN 'brand-content-series'
  WHEN 'Brand Photography' THEN 'brand-content-series'
  WHEN 'Corporate' THEN 'corporate-leadership-series'
  WHEN 'Hospitality' THEN 'hospitality-events-series'
  ELSE 'fashion-editorial-series' END;

-- Seed media rows for the series projects from the curated library (best images first)
INSERT INTO public.project_media (project_id, type, url, alt, layout, sort_order)
SELECT pi.project_id, 'image', pi.url, pi.title,
  CASE WHEN pi.orientation = 'landscape' THEN 'full' ELSE 'half' END,
  row_number() OVER (PARTITION BY pi.project_id ORDER BY pi.quality_score DESC, pi.sort_order)
FROM public.portfolio_images pi
WHERE pi.project_id IS NOT NULL AND pi.active
  AND NOT EXISTS (SELECT 1 FROM public.project_media m WHERE m.project_id = pi.project_id AND m.url = pi.url);

-- Covers for the series projects
UPDATE public.projects p SET cover_image = m.url
FROM (SELECT DISTINCT ON (project_id) project_id, url FROM public.project_media ORDER BY project_id, sort_order) m
WHERE m.project_id = p.id AND p.cover_image IS NULL;

-- Seed media for the existing flagship case studies from their images array
INSERT INTO public.project_media (project_id, type, url, alt, layout, sort_order)
SELECT p.id, 'image', img.url, p.title, CASE WHEN img.ord % 3 = 1 THEN 'full' ELSE 'half' END, img.ord
FROM public.projects p
CROSS JOIN LATERAL unnest(p.images) WITH ORDINALITY AS img(url, ord)
WHERE NOT EXISTS (SELECT 1 FROM public.project_media m WHERE m.project_id = p.id AND m.url = img.url);
