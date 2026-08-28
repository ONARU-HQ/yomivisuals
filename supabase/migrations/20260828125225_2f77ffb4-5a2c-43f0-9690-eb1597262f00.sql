-- Align the six public service pages with the YV service architecture + SEO copy.

update public.services set
  slug = 'creative-direction',
  title = 'Creative Direction',
  excerpt = 'The idea, the visual language and the creative system a brand is built on.',
  overview = 'Creative direction at Yomi Visuals starts before a camera is switched on. We interrogate the objective, define the message, build the visual world and set the standard every frame is judged against. The output is a creative direction your marketing, production and content teams can execute against consistently.',
  seo_title = 'Creative Direction Agency in Lagos — Yomi Visuals',
  seo_description = 'Creative direction for brands in Lagos, Nigeria. Concept development, visual language, art direction and campaign thinking by Yomi Visuals.',
  faqs = '[{"question":"What does creative direction include?","answer":"Objective and message definition, concept development, references and moodboards, visual language, art direction on set and creative quality control through delivery."},{"question":"Can you direct a project another team produces?","answer":"Yes. We can lead creative direction only, or take the project through full production and delivery."}]'::jsonb,
  sort_order = 1, published = true
where slug = 'creative-direction';

update public.services set
  slug = 'campaigns',
  title = 'Campaigns',
  excerpt = 'Full campaign worlds — concept, assets and rollout across every channel.',
  overview = 'We build campaigns end to end: the platform idea, the asset matrix, the shoot, and the rollout plan across social, digital, retail and out of home. Every deliverable is planned against how and where it will actually run, so nothing is reshot or reformatted late.',
  seo_title = 'Brand Campaign Production in Lagos — Yomi Visuals',
  seo_description = 'Campaign concepting and production for brands in Lagos, Nigeria. Campaign platforms, asset systems, shoots and multi-channel rollout by Yomi Visuals.',
  faqs = '[{"question":"How long does a campaign take?","answer":"Most campaigns run four to eight weeks from brief to final delivery, depending on scope, locations and cast."},{"question":"Do you handle media buying?","answer":"We build the creative and the assets. We work alongside your media or agency partners on rollout."}]'::jsonb,
  sort_order = 2, published = true
where slug = 'campaign-creative';

update public.services set
  slug = 'film-production',
  title = 'Film Production',
  excerpt = 'Brand films, commercials and motion built for screens that matter.',
  overview = 'From brand films and commercials to founder stories and event films, we handle treatment, crew, direction, shooting, edit, grade and sound. Films are built for the platform they will live on — cinema, broadcast, YouTube or vertical social.',
  seo_title = 'Film & Commercial Production Company in Lagos — Yomi Visuals',
  seo_description = 'Brand films, commercials and video production in Lagos, Nigeria. Treatment, crew, direction, edit, grade and sound by Yomi Visuals.',
  faqs = '[{"question":"Do you write the treatment?","answer":"Yes. Every film begins with a written treatment covering story, look, structure and delivery formats."},{"question":"Do you deliver social cutdowns?","answer":"Yes. Vertical and square cutdowns are planned into the shoot rather than salvaged afterwards."}]'::jsonb,
  sort_order = 3, published = true
where slug = 'visual-brand-direction';

update public.services set
  slug = 'photography',
  title = 'Photography',
  excerpt = 'Campaign, product, brand and portrait photography built around your brand.',
  overview = 'Photography with an art-directed point of view: campaign imagery, product and e-commerce, brand libraries, lifestyle and portraiture. Styling, set, lighting and retouching are directed as one system so the whole set feels like one brand.',
  seo_title = 'Brand & Commercial Photography in Lagos — Yomi Visuals',
  seo_description = 'Commercial, campaign, product and brand photography in Lagos, Nigeria. Art-directed shoots, styling, lighting and retouching by Yomi Visuals.',
  faqs = '[{"question":"How many images do we receive?","answer":"Deliverables are agreed per project — a final selection is retouched to campaign standard and delivered in web and print formats."},{"question":"Do you shoot on location?","answer":"Yes. We shoot in studio, on location across Lagos and beyond, or both within a single production."}]'::jsonb,
  sort_order = 4, published = true
where slug = 'brand-photography';

update public.services set
  slug = 'content-production',
  title = 'Content Production',
  excerpt = 'Always-on content systems that keep brands visible between campaigns.',
  overview = 'Content production covers the ongoing work: monthly shoot days, social-first video, UGC-style content, product drops and channel libraries. We build a repeatable production rhythm so your brand never goes quiet between campaigns.',
  seo_title = 'Content Production for Brands in Lagos — Yomi Visuals',
  seo_description = 'Social-first content production in Lagos, Nigeria. Monthly shoot days, video content, product content and channel libraries by Yomi Visuals.',
  faqs = '[{"question":"Can we work on a retainer?","answer":"Yes. Monthly and quarterly content retainers are our most common structure for always-on brands."},{"question":"Do you edit and deliver formats per platform?","answer":"Yes. Every content set is delivered in the aspect ratios and specs of the channels it runs on."}]'::jsonb,
  sort_order = 5, published = true
where slug = 'commercial-content';

update public.services set
  slug = 'production',
  title = 'Production',
  excerpt = 'Producing, crew, logistics and delivery — the machine behind the work.',
  overview = 'Production is where ideas survive contact with reality: budgeting, scheduling, crew, casting, locations, permits, equipment, on-set management and post. We can produce our own creative or execute a direction developed elsewhere.',
  seo_title = 'Production Company in Lagos, Nigeria — Yomi Visuals',
  seo_description = 'Full-service production in Lagos, Nigeria. Producing, crew, casting, locations, equipment, on-set management and post-production by Yomi Visuals.',
  faqs = '[{"question":"Can you produce a shoot for another agency?","answer":"Yes. We regularly execute production for agencies and in-house brand teams working to their own creative."},{"question":"What does a production budget cover?","answer":"Crew, cast, equipment, locations, permits, styling, logistics, post-production and delivery — itemised before anything is confirmed."}]'::jsonb,
  sort_order = 6, published = true
where slug = 'production';
