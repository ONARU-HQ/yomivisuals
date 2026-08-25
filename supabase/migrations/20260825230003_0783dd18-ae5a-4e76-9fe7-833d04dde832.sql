
with pick as (
  select split_part(title,' — ',1) as shoot, url, sort_order
  from public.portfolio_images where active
)
insert into public.projects (slug, title, client, industry, location, project_date, services, description, challenge, solution, results, cover_image, images, featured, published, sort_order, seo_title, seo_description)
select * from (
  values
  ('valora','Valora','Valora','Luxury Perfume Campaign','Lagos, Nigeria','2025-09-01'::date,
   array['Creative Direction','Photography','Film','Post Production'],
   'We built the campaign around light and skin — a low-key, high-contrast set where the bottle behaves like jewellery and the model carries the fragrance rather than presents it. One shoot day, two set-ups, stills and motion captured together so the campaign and the social cutdowns share the same grade.',
   'Valora was launching a luxury fragrance into a market where perfume is sold on discount, not desire. They needed a campaign that made the bottle feel like an object worth owning before a single note was described.',
   'Scent as presence. Instead of showing the product, we shot the effect of the product — the way a room turns when someone wearing it walks in. Gold, shadow and stillness.',
   'A campaign that repositioned Valora from a product launch into a luxury brand moment.',
   (select url from pick where shoot = 'Midnight Sequins' order by sort_order limit 1),
   array(select url from pick where shoot in ('Midnight Sequins','Gold on the Steps','Gala Gold','Sculpted in Black') order by sort_order limit 6),
   true, true, 1,
   'Valora — Luxury Perfume Campaign | Yomi Visuals Case Study',
   'How Yomi Visuals developed and produced the Valora luxury fragrance campaign — creative direction, photography, film and post production in Lagos.'),

  ('cld-ng','cld.ng','cld.ng','Brand Campaign','Lagos, Nigeria','2025-06-01'::date,
   array['Creative Direction','Film','Photography'],
   'We produced a brand campaign built around the people using the platform: real environments, natural light shaped on set, a monochrome grade to keep attention on faces and gesture. Film and stills were captured in parallel across two locations.',
   'cld.ng had strong product traction and almost no brand. Every asset looked like a screenshot. They needed visual language that made a young technology company feel established and credible.',
   'Build the brand on people, not interfaces. We wrote the campaign around competence — the quiet confidence of people who are good at what they do — and gave it a restrained monochrome treatment.',
   'A single visual system now running across brand, product and social.',
   (select url from pick where shoot = 'Monochrome' order by sort_order limit 1),
   array(select url from pick where shoot in ('Monochrome','Women Who Build','The CEO','Quiet Confidence') order by sort_order limit 6),
   true, true, 2,
   'cld.ng — Brand Campaign | Yomi Visuals Case Study',
   'Creative direction, film and photography for the cld.ng brand campaign, produced by Yomi Visuals in Lagos.'),

  ('rahs-luxe','Rahs Luxe','Rahs Luxe','Fashion Campaign','Lagos, Nigeria','2025-04-01'::date,
   array['Creative Direction','Photography','Film','Post Production'],
   'Sculptural styling, hard directional light and a deliberately narrow palette. We art-directed the set, produced the shoot end to end and finished the campaign in-house so the stills, the film and the social assets all share one colour identity.',
   'Rahs Luxe was entering a crowded ready-to-wear market where every brand shoots the same way. The collection deserved a campaign with a point of view, not another lookbook.',
   'Treat the garment as form. We stripped the frame down to silhouette, texture and shadow so the tailoring reads before the styling does.',
   'The campaign carried the collection through launch and sold through ahead of schedule.',
   (select url from pick where shoot = 'Sculpted in Black' order by sort_order limit 1),
   array(select url from pick where shoot in ('Sculpted in Black','Lady in Green','Blue Tulle','Boss Beauty') order by sort_order limit 6),
   true, true, 3,
   'Rahs Luxe — Fashion Campaign | Yomi Visuals Case Study',
   'A fashion campaign developed and produced by Yomi Visuals for Rahs Luxe — creative direction, photography, film and post production.'),

  ('yomi-casual','Yomi Casual','Yomi Casual','Fashion Campaign','Lagos, Nigeria','2025-11-01'::date,
   array['Creative Direction','Photography','Film','Post Production'],
   'A two-part campaign: a tailored editorial chapter shot in controlled studio light, and a getting-ready story shot handheld to give the brand warmth and movement. Delivered as a campaign film, stills and a full social cutdown package.',
   'Yomi Casual is a household name in Nigerian menswear. The challenge was not awareness — it was making a heritage brand feel current to a younger customer without abandoning the tailoring it is known for.',
   'Occasion over product. We built the campaign around the hour before an event, when the clothes matter most, and let the tailoring carry the frame.',
   'A campaign that spoke to a new customer without losing the existing one.',
   (select url from pick where shoot = 'Black Tie' order by sort_order limit 1),
   array(select url from pick where shoot in ('Black Tie','The Getting-Ready Story','Best Dressed','Aso-Oke, but Iconic') order by sort_order limit 6),
   true, true, 4,
   'Yomi Casual — Fashion Campaign | Yomi Visuals Case Study',
   'Creative direction, photography, film and post production for the Yomi Casual fashion campaign by Yomi Visuals.')
) as v
on conflict (slug) do update set
  title = excluded.title, client = excluded.client, industry = excluded.industry,
  services = excluded.services, description = excluded.description, challenge = excluded.challenge,
  solution = excluded.solution, results = excluded.results, cover_image = excluded.cover_image,
  images = excluded.images, featured = true, published = true, sort_order = excluded.sort_order;
