
CREATE OR REPLACE FUNCTION public.submit_project_brief(payload jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id text;
BEGIN
  IF coalesce(trim(payload->>'name'),'') = '' OR payload->>'email' NOT LIKE '%@%' THEN
    RAISE EXCEPTION 'A name and a valid email address are required';
  END IF;

  INSERT INTO public.project_briefs (
    project_types, objective, brand, industry, website, instagram, capabilities, recommended,
    timeline, production_date, budget, location, name, company, role, email, phone,
    category, size, workflow, summary, reference_file, source, user_id
  ) VALUES (
    coalesce((SELECT array_agg(value::text) FROM jsonb_array_elements_text(coalesce(payload->'project_types','[]'::jsonb)) AS value), '{}'),
    left(payload->>'objective', 4000),
    left(payload->>'brand', 200),
    left(payload->>'industry', 200),
    left(payload->>'website', 300),
    left(payload->>'instagram', 200),
    coalesce((SELECT array_agg(value::text) FROM jsonb_array_elements_text(coalesce(payload->'capabilities','[]'::jsonb)) AS value), '{}'),
    coalesce((SELECT array_agg(value::text) FROM jsonb_array_elements_text(coalesce(payload->'recommended','[]'::jsonb)) AS value), '{}'),
    left(payload->>'timeline', 100),
    nullif(payload->>'production_date','')::date,
    left(payload->>'budget', 100),
    left(payload->>'location', 200),
    left(trim(payload->>'name'), 200),
    left(payload->>'company', 200),
    left(payload->>'role', 200),
    lower(left(trim(payload->>'email'), 320)),
    left(payload->>'phone', 60),
    coalesce(left(payload->>'category', 50), 'other'),
    coalesce((payload->>'size')::public.project_size, 'small'),
    coalesce(left(payload->>'workflow', 40), 'standard'),
    left(payload->>'summary', 8000),
    left(payload->>'reference_file', 400),
    'website',
    auth.uid()
  )
  RETURNING project_id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_project_brief(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_project_brief(jsonb) TO anon, authenticated;
