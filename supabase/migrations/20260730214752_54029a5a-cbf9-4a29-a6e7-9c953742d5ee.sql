-- ROLES
CREATE TYPE public.app_role AS ENUM ('super_admin','admin','editor','marketing','writer','developer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));

-- first user becomes super_admin, everyone gets a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.user_roles) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- CONTENT TABLES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  overview text,
  icon text,
  hero_image text,
  process jsonb NOT NULL DEFAULT '[]'::jsonb,
  pricing jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  gallery text[] NOT NULL DEFAULT '{}',
  seo_title text, seo_description text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client text, industry text, location text,
  project_date date,
  services text[] NOT NULL DEFAULT '{}',
  description text, challenge text, solution text, results text,
  cover_image text,
  images text[] NOT NULL DEFAULT '{}',
  videos text[] NOT NULL DEFAULT '{}',
  behind_the_scenes text[] NOT NULL DEFAULT '{}',
  credits jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_title text, seo_description text, og_image text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  author text,
  featured_image text,
  seo_title text, seo_description text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, role text, company text,
  quote text NOT NULL, avatar text,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL, answer text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL, department text, location text, employment_type text,
  description text, requirements text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.studio_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, description text,
  price text, size text,
  amenities text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, description text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.nav_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL, href text NOT NULL,
  location text NOT NULL DEFAULT 'header',
  group_name text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);

CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL, name text, folder text, mime_type text,
  size_bytes bigint, tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- BUSINESS TABLES
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, company text, email text NOT NULL, phone text,
  service text, budget text, message text, source text DEFAULT 'contact',
  status text NOT NULL DEFAULT 'new',
  notes text, assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL, phone text, company text,
  service text, budget text, preferred_date date, preferred_time text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'subscribed',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid, action text NOT NULL, entity text, entity_id text, meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- GRANTS + RLS for public-readable content
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['services','projects','articles','testimonials','faqs','careers','studio_spaces','industries','site_settings','nav_links','media'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "%s_public_read" ON public.%I FOR SELECT USING (true)', t, t);
    EXECUTE format('CREATE POLICY "%s_staff_write" ON public.%I FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()))', t, t);
    EXECUTE format('CREATE TRIGGER touch_%I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', t, t)
      ;
  END LOOP;
EXCEPTION WHEN undefined_column THEN NULL;
END $$;

-- private tables
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "leads_staff_all" ON public.leads FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_public_insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_staff_all" ON public.bookings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

GRANT INSERT ON public.subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subs_public_insert" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "subs_staff_all" ON public.subscribers FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_staff" ON public.audit_logs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER touch_leads BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_bookings BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- SEED
INSERT INTO public.site_settings (key, value) VALUES
('company', '{"name":"Yomi Visuals","tagline":"Building Brands Through Creative Experiences.","description":"Yomi Visuals is a multidisciplinary creative agency helping businesses and brands communicate through strategy, design, visual storytelling, content production and digital experiences.","email":"hello@yomivisuals.com","phone":"+234 800 000 0000","whatsapp":"+2348000000000","address":"Lagos, Nigeria","hours":"Mon – Fri, 9:00 – 18:00 WAT","maps":"https://www.google.com/maps?q=Lagos%20Nigeria&output=embed"}'),
('social', '{"instagram":"https://instagram.com/yomi.visuals","linkedin":"https://linkedin.com","x":"https://x.com","behance":"https://behance.net","youtube":"https://youtube.com"}'),
('home_hero', '{"eyebrow":"Creative Agency — Lagos","headline":"We Build Brands Through Creative Experiences.","subline":"Strategy, design, visual storytelling and content production for brands that refuse to be forgettable.","primary_cta":"Book Consultation","primary_href":"/book","secondary_cta":"View Our Work","secondary_href":"/projects"}'),
('home_cta', '{"headline":"Let''s Build Something Incredible.","subline":"Tell us where your brand is going. We''ll design the way there.","cta":"Book Consultation","href":"/book"}'),
('clients', '{"logos":["Arla","Fidelity","Sterling","Nordic House","Lagos Fashion Week","Zenith","Alara","Kuramo"]}'),
('process', '{"steps":[{"title":"Discover","body":"We interrogate the business, the market and the audience until the real problem shows itself."},{"title":"Strategy","body":"Positioning, narrative and creative territory — the thinking that makes the work inevitable."},{"title":"Create","body":"Design, photography, film and content produced to an obsessive standard."},{"title":"Launch","body":"Rollout across every channel, with the assets and systems to keep it consistent."},{"title":"Grow","body":"Measure, iterate and compound. Brands are built over years, not campaigns."}]}');

INSERT INTO public.industries (name, sort_order) VALUES
('Fashion',1),('Corporate',2),('Hospitality',3),('Technology',4),('Real Estate',5),('Healthcare',6),('Restaurants',7),('Luxury',8),('Personal Brands',9),('Education',10),('Government',11);

INSERT INTO public.services (slug,title,excerpt,overview,icon,sort_order,process,pricing,faqs) VALUES
('creative-direction','Creative Direction','The idea that holds everything together.','We set the creative territory for your brand — the concept, tone, art direction and standards every asset is measured against.','Compass',1,
 '[{"title":"Immersion","body":"Brand audit, market and audience research."},{"title":"Concept","body":"Creative territories and visual language."},{"title":"Direction","body":"Art direction across every touchpoint."}]',
 '[{"name":"Project Direction","price":"From ₦850,000","features":["Creative concept","Art direction","Asset guidelines"]},{"name":"Retainer","price":"From ₦2,500,000 / quarter","features":["Ongoing direction","Monthly reviews","Priority production"]}]',
 '[{"q":"How long does a direction engagement take?","a":"Typically three to six weeks from immersion to final direction."}]'),
('brand-strategy','Brand Strategy','Positioning that makes you the obvious choice.','Research-led positioning, messaging architecture and brand narrative built to move a business, not just to look good.','Target',2,
 '[{"title":"Research","body":"Stakeholder interviews, category and competitor analysis."},{"title":"Positioning","body":"Proposition, values, personality."},{"title":"Narrative","body":"Messaging house and tone of voice."}]',
 '[{"name":"Strategy Sprint","price":"From ₦1,200,000","features":["Research","Positioning","Messaging"]}]','[]'),
('photography','Photography','Images with intent.','Editorial, commercial and campaign photography produced with the craft and control of a global studio.','Camera',3,
 '[{"title":"Brief","body":"Objectives, references, deliverables."},{"title":"Pre-production","body":"Casting, styling, location, shot list."},{"title":"Shoot","body":"Full crew, lighting and direction."},{"title":"Post","body":"Selection, retouching, delivery."}]',
 '[{"name":"Half Day","price":"From ₦350,000","features":["4 hours","1 location","20 retouched images"]},{"name":"Full Day","price":"From ₦650,000","features":["8 hours","2 locations","45 retouched images"]}]','[]'),
('videography','Videography','Film that carries feeling.','Brand films, documentaries and social-first video from concept through to final grade.','Video',4,'[]',
 '[{"name":"Brand Film","price":"From ₦1,500,000","features":["Concept","Production","Edit, grade & sound"]}]','[]'),
('campaign-production','Campaign Production','End-to-end campaigns, delivered.','Full-service production: concept, casting, locations, crew, shoot, post and rollout across every channel.','Clapperboard',5,'[]',
 '[{"name":"Integrated Campaign","price":"From ₦4,500,000","features":["Strategy & concept","Stills & motion","Full rollout kit"]}]','[]'),
('content-production','Content Production','Volume without losing the standard.','Always-on content systems that keep brands publishing at a consistent, premium level.','Layers',6,'[]',
 '[{"name":"Monthly Content","price":"From ₦900,000 / month","features":["Monthly shoot day","30+ assets","Content calendar"]}]','[]'),
('product-photography','Product Photography','Product as object of desire.','Studio and lifestyle product imagery engineered for e-commerce conversion and campaign impact.','Package',7,'[]',
 '[{"name":"Studio Pack","price":"From ₦250,000","features":["Up to 15 products","White & lifestyle","E-commerce ready"]}]','[]'),
('corporate-photography','Corporate Photography','Leadership, seen properly.','Executive portraits, team libraries, annual report and workplace imagery for corporates.','Building2',8,'[]',
 '[{"name":"Corporate Day","price":"From ₦550,000","features":["On-site studio","Unlimited team members","Retouched library"]}]','[]'),
('events','Events','Coverage that reads like a story.','Conferences, launches, galas and activations documented in stills and motion.','CalendarDays',9,'[]',
 '[{"name":"Event Coverage","price":"From ₦450,000","features":["Up to 6 hours","Photo & video","48h highlight edit"]}]','[]'),
('studio-rental','Studio Rental','A room built for good light.','YV Studios — cyclorama, daylight and blackout spaces available by the hour or day.','Warehouse',10,'[]',
 '[{"name":"Hourly","price":"₦35,000 / hour","features":["Lighting kit","Backdrops","Wi-Fi"]},{"name":"Full Day","price":"₦220,000 / day","features":["10 hours","Crew access","Parking"]}]','[]'),
('social-media-content','Social Media Content','Built for the feed, made to last.','Platform-native content programmes: short form, stills, motion and community-ready copy.','Share2',11,'[]',
 '[{"name":"Social Retainer","price":"From ₦750,000 / month","features":["Content calendar","Shoot day","Editing & delivery"]}]','[]'),
('digital-design','Digital Design','Interfaces that behave like the brand.','Websites, landing pages and digital products designed and built with the same rigour as the brand itself.','MonitorSmartphone',12,'[]',
 '[{"name":"Website","price":"From ₦2,000,000","features":["UX & UI","Build","CMS & handover"]}]','[]');

INSERT INTO public.projects (slug,title,client,industry,location,project_date,services,description,challenge,solution,results,featured,sort_order) VALUES
('alara-ss26','Alara SS26 Campaign','Alara','Fashion','Lagos','2026-03-01',ARRAY['Creative Direction','Photography','Campaign Production'],
 'A seasonal campaign repositioning Alara for a younger, globally-minded luxury audience.',
 'Alara owned prestige but was losing relevance with buyers under 35 who discovered fashion on their phones.',
 'We rebuilt the campaign around movement and texture — a stills and motion system shot in one production, cut for editorial, retail and social.',
 '+142% engagement, 3.1x traffic to the flagship store page, and the first sell-out season in four years.',true,1),
('fidelity-forward','Fidelity Forward','Fidelity Bank','Corporate','Lagos','2026-01-15',ARRAY['Brand Strategy','Videography','Content Production'],
 'A corporate narrative platform and film series for a bank modernising its customer promise.',
 'A trusted institution reading as conservative to the market it needed most.',
 'We built a messaging house around momentum and delivered a three-film series plus an always-on content system.',
 '9.4M views across channels and a 27% lift in brand consideration among 25–34s.',true,2),
('nordic-house','Nordic House','Nordic House Lagos','Hospitality','Lagos','2025-11-20',ARRAY['Photography','Digital Design','Social Media Content'],
 'Full visual identity rollout and digital presence for a Scandinavian-inspired hospitality brand.',
 'A beautiful space with no visual language and no way to book it.',
 'Photography library, art direction and a booking-first website designed around the room itself.',
 'Direct bookings up 68% within one quarter.',true,3),
('kuramo-tech','Kuramo Technology Summit','Kuramo','Technology','Lagos','2025-09-05',ARRAY['Events','Videography','Campaign Production'],
 'Two-day summit coverage plus a post-event campaign for West Africa''s largest technology gathering.',
 'A high-density event with dozens of simultaneous moments and a 48-hour publishing window.',
 'A six-person crew, live edit bay on site and a same-day delivery pipeline.',
 '340 assets delivered in 48 hours; 2.2M impressions in the first week.',true,4);

INSERT INTO public.testimonials (name,role,company,quote,featured,sort_order) VALUES
('Adaeze Okonkwo','Marketing Director','Alara','Yomi Visuals think like a business first and a studio second. That is rarer than it should be.',true,1),
('Tunde Bakare','Head of Brand','Fidelity Bank','They took a brief we had been circling for a year and made it obvious in three weeks.',true,2),
('Sofia Lindqvist','Founder','Nordic House','Every asset arrived better than the reference. That never happens.',true,3),
('Emeka Nwosu','CEO','Kuramo','Three hundred and forty assets in forty-eight hours, and not one of them looked rushed.',false,4);

INSERT INTO public.faqs (question,answer,category,sort_order) VALUES
('What kind of clients do you work with?','We work with corporates, funded startups, luxury and hospitality brands, institutions and established personal brands — anywhere the standard of the work actually matters.','General',1),
('How do engagements start?','Every engagement starts with a consultation. We''ll discuss objectives, scope and budget, then send a proposal within five working days.','General',2),
('What are your typical budgets?','Projects generally start at ₦850,000 for single-service work and ₦4,500,000 for integrated campaigns. Retainers are quoted quarterly.','Pricing',3),
('How long does a project take?','Single-service projects run two to four weeks. Integrated campaigns run six to twelve weeks from kickoff to rollout.','Process',4),
('Do you work outside Lagos?','Yes. We produce across Nigeria and travel internationally for campaign work; travel is quoted separately.','General',5),
('Do you rent the studio to other teams?','Yes — YV Studios is available hourly or daily to external productions, subject to availability.','Studio',6);

INSERT INTO public.studio_spaces (name,description,price,size,amenities,sort_order) VALUES
('Studio A — Cyclorama','A 6m infinity cove built for full-body fashion, motion and product work.','₦45,000 / hour','120 sqm',ARRAY['6m cyclorama','Profoto lighting','Blackout capability','Makeup room','Client lounge'],1),
('Studio B — Daylight','North-facing daylight studio with full diffusion control for editorial and portraiture.','₦35,000 / hour','80 sqm',ARRAY['Natural light','Diffusion system','Styling rail','Kitchenette'],2),
('The Set Room','A configurable set space for interiors, tabletop and product storytelling.','₦28,000 / hour','60 sqm',ARRAY['Modular flats','Prop library','Tabletop rigs'],3);

INSERT INTO public.careers (slug,title,department,location,employment_type,description,requirements,sort_order) VALUES
('senior-art-director','Senior Art Director','Creative','Lagos (Hybrid)','Full-time','Lead creative territories across campaign, brand and content work for our largest accounts.','6+ years agency or in-house creative experience. A portfolio of work you would defend in public.',1),
('producer','Producer','Production','Lagos','Full-time','Own budgets, schedules, crew and logistics across simultaneous productions.','4+ years producing stills and motion. Calm under pressure.',2),
('content-editor','Content Editor','Post-Production','Remote (WAT)','Contract','Cut short-form and long-form content for brand and social channels.','Premiere/Resolve fluency, strong sense of rhythm.',3);

INSERT INTO public.articles (slug,title,excerpt,content,category,tags,author,published,published_at) VALUES
('brand-is-not-a-logo','Your Brand Is Not a Logo','Identity is what people expect from you before you speak. Here is how we build that.','A logo is the smallest, loudest part of a brand and the least responsible for its performance.

Brand is the accumulated expectation an audience holds about you. It is set by what you make, how consistently you make it, and whether the experience matches the promise.

## Start with the expectation
Before touching design, we define what we want the audience to assume. Everything downstream — photography, tone, interface, packaging — is then judged against that single expectation.

## Consistency beats novelty
Most brands do not have a creativity problem. They have a repetition problem. The work that compounds is the work that looks like itself for years.','Strategy',ARRAY['brand','strategy'],'Yomi Visuals',true,now()),
('production-standard','The Production Standard','Why we over-prepare, and what it saves on shoot day.','Every hour spent in pre-production saves three on set.

## The shot list is the contract
No production leaves our office without an agreed shot list, a lighting plan and a delivery schedule.

## Crew size is a creative decision
The right crew is the smallest one that can execute without compromise.','Production',ARRAY['production','craft'],'Yomi Visuals',true,now()),
('content-that-compounds','Content That Compounds','Always-on content only works when it is built as a system, not a scramble.','Brands that publish well are not more creative. They are better organised.

## Shoot in batches
One production day, thirty assets, six weeks of calendar.

## Design for the platform, not despite it
Format-native from the brief, never cropped as an afterthought.','Content',ARRAY['content','social'],'Yomi Visuals',true,now());

INSERT INTO public.nav_links (label,href,location,sort_order) VALUES
('Work','/projects','header',1),('Services','/services','header',2),('Studio','/studio','header',3),('About','/about','header',4),('Articles','/articles','header',5),('Contact','/contact','header',6),
('Services','/services','footer',1),('Projects','/projects','footer',2),('Studio','/studio','footer',3),('Articles','/articles','footer',4),('Careers','/careers','footer',5),('Testimonials','/testimonials','footer',6),('FAQs','/faqs','footer',7),('Contact','/contact','footer',8),('Privacy Policy','/privacy','footer',9),('Terms','/terms','footer',10);