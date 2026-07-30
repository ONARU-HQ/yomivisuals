import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import commercial from "@/assets/commercial-1.jpg";
import corporate from "@/assets/corporate-1.jpg";
import editorial from "@/assets/editorial-1.jpg";
import event from "@/assets/event-1.jpg";
import fashion from "@/assets/fashion-1.jpg";
import lifestyle from "@/assets/lifestyle-1.jpg";
import architecture from "@/assets/architecture-1.jpg";
import brand from "@/assets/brand-1.jpg";
import portrait from "@/assets/portrait-1.jpg";
import studioPortrait from "@/assets/about-portrait.jpg";

export const imagePool = [
  fashion,
  corporate,
  editorial,
  commercial,
  event,
  lifestyle,
  architecture,
  brand,
  portrait,
  studioPortrait,
];

export const studioPortraitImage = studioPortrait;

/** Deterministic fallback image so every card has art even before uploads. */
export function imageFor(seed: string, offset = 0) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return imagePool[(hash + offset) % imagePool.length];
}

export function coverFor(row: { slug?: string | null; cover_image?: string | null; hero_image?: string | null; featured_image?: string | null; images?: string[] | null }, offset = 0) {
  return (
    row.cover_image ||
    row.hero_image ||
    row.featured_image ||
    row.images?.[0] ||
    imageFor(row.slug ?? "yomi", offset)
  );
}

export type Json = Record<string, unknown>;

async function rows<T>(table: string, build: (q: any) => any): Promise<T[]> {
  const { data, error } = await build(supabase.from(table).select("*"));
  if (error) throw new Error(error.message);
  return (data ?? []) as T[];
}

/* ---------- Public content ---------- */

export type Service = {
  id: string; slug: string; title: string; excerpt: string | null; overview: string | null;
  icon: string | null; hero_image: string | null; process: any; pricing: any; faqs: any;
  gallery: string[]; seo_title: string | null; seo_description: string | null;
  sort_order: number; published: boolean;
};

export type Project = {
  id: string; slug: string; title: string; client: string | null; industry: string | null;
  location: string | null; project_date: string | null; services: string[];
  description: string | null; challenge: string | null; solution: string | null; results: string | null;
  cover_image: string | null; images: string[]; videos: string[]; behind_the_scenes: string[];
  credits: any; seo_title: string | null; seo_description: string | null; og_image: string | null;
  featured: boolean; published: boolean; sort_order: number;
};

export type Article = {
  id: string; slug: string; title: string; excerpt: string | null; content: string | null;
  category: string | null; tags: string[]; author: string | null; featured_image: string | null;
  seo_title: string | null; seo_description: string | null; published: boolean; published_at: string | null;
};

export type Testimonial = {
  id: string; name: string; role: string | null; company: string | null; quote: string;
  avatar: string | null; featured: boolean; sort_order: number; published: boolean;
};

export type Faq = { id: string; question: string; answer: string; category: string; sort_order: number; published: boolean };
export type Career = { id: string; slug: string; title: string; department: string | null; location: string | null; employment_type: string | null; description: string | null; requirements: string | null; published: boolean; sort_order: number };
export type StudioSpace = { id: string; name: string; description: string | null; price: string | null; size: string | null; amenities: string[]; images: string[]; sort_order: number; published: boolean };
export type Industry = { id: string; name: string; description: string | null; sort_order: number };
export type Setting = { key: string; value: any };

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => rows<Service>("services", (q) => q.eq("published", true).order("sort_order")),
});

export const serviceQuery = (slug: string) =>
  queryOptions({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return data as Service | null;
    },
  });

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => rows<Project>("projects", (q) => q.eq("published", true).order("sort_order")),
});

export const projectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return data as Project | null;
    },
  });

export const articlesQuery = queryOptions({
  queryKey: ["articles"],
  queryFn: () => rows<Article>("articles", (q) => q.eq("published", true).order("published_at", { ascending: false })),
});

export const articleQuery = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return data as Article | null;
    },
  });

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: () => rows<Testimonial>("testimonials", (q) => q.eq("published", true).order("sort_order")),
});

export const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: () => rows<Faq>("faqs", (q) => q.eq("published", true).order("sort_order")),
});

export const careersQuery = queryOptions({
  queryKey: ["careers"],
  queryFn: () => rows<Career>("careers", (q) => q.eq("published", true).order("sort_order")),
});

export const studioSpacesQuery = queryOptions({
  queryKey: ["studio_spaces"],
  queryFn: () => rows<StudioSpace>("studio_spaces", (q) => q.eq("published", true).order("sort_order")),
});

export const industriesQuery = queryOptions({
  queryKey: ["industries"],
  queryFn: () => rows<Industry>("industries", (q) => q.eq("published", true).order("sort_order")),
});

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) throw new Error(error.message);
    const map: Record<string, any> = {};
    for (const row of (data ?? []) as Setting[]) map[row.key] = row.value;
    return map;
  },
});

/* ---------- Admin collections ---------- */

export const adminListQuery = (table: string, orderBy = "created_at", ascending = false) =>
  queryOptions({
    queryKey: ["admin", table],
    queryFn: () => rows<any>(table, (q) => q.order(orderBy, { ascending })),
  });
