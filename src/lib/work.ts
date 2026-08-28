import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { imageFor } from "@/lib/cms";

/* ------------------------------------------------------------------ */
/* Taxonomy — the flexible category system for the YV work archive     */
/* ------------------------------------------------------------------ */

export const WORK_CATEGORIES = [
  { key: "Campaigns", body: "Integrated visual campaigns." },
  { key: "Film", body: "Brand films, commercials, cinematic and documentary content." },
  { key: "Photography", body: "Campaign, fashion, portrait, editorial and product photography." },
  { key: "Brand Content", body: "Social campaigns, digital and launch content." },
  { key: "Production", body: "Large-scale, creative and set production." },
  { key: "Experimental", body: "Self-initiated work and creative experiments." },
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number]["key"];

export const WORK_SERVICES = [
  "Creative Direction",
  "Photography",
  "Film",
  "Production",
  "Campaigns",
  "Content",
] as const;

export const CREDIT_ROLES = [
  "Creative Direction",
  "Director",
  "Producer",
  "Photographer",
  "DOP",
  "Editor",
  "Stylist",
  "Makeup",
  "Set Design",
  "Models",
  "Production",
  "Post-Production",
] as const;

export const CASE_SECTIONS = [
  { key: "brief", label: "The Brief", field: "description" },
  { key: "idea", label: "The Idea", field: "idea" },
  { key: "approach", label: "The Approach", field: "approach" },
  { key: "production", label: "The Production", field: "production" },
  { key: "outcome", label: "The Outcome", field: "outcome" },
] as const;

export const VISIBILITIES = ["public", "unlisted", "private"] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export const MEDIA_LAYOUTS = ["full", "half", "portrait", "text"] as const;
export type MediaLayout = (typeof MEDIA_LAYOUTS)[number];

/** Maps a work category into the project engine's project type. */
export const CATEGORY_TO_PROJECT_TYPE: Record<string, string> = {
  Campaigns: "campaign",
  Film: "brand-film",
  Photography: "photography",
  "Brand Content": "social",
  Production: "studio",
  Experimental: "not-sure",
};

/** Services page → work archive context (smart service context). */
export const SERVICE_CONTEXT: { match: RegExp; category: WorkCategory }[] = [
  { match: /film|motion|commercial|video/i, category: "Film" },
  { match: /campaign/i, category: "Campaigns" },
  { match: /photo|portrait|fashion|product/i, category: "Photography" },
  { match: /content|social|digital/i, category: "Brand Content" },
  { match: /production|studio|set/i, category: "Production" },
];

export function categoryForContext(context?: string | null): string {
  if (!context) return "All";
  const hit = SERVICE_CONTEXT.find((s) => s.match.test(context));
  return hit?.category ?? "All";
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ProjectMedia = {
  id: string;
  project_id: string;
  type: "image" | "video";
  url: string;
  provider: string | null;
  filename: string | null;
  alt: string | null;
  caption: string | null;
  layout: MediaLayout;
  sort_order: number;
};

export type WorkProject = {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  industry: string | null;
  category: string;
  categories: string[];
  project_type: string | null;
  location: string | null;
  project_date: string | null;
  year: number | null;
  services: string[];
  description: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  idea: string | null;
  approach: string | null;
  production: string | null;
  outcome: string | null;
  cover_image: string | null;
  hero_video: string | null;
  images: string[];
  videos: string[];
  credits: Record<string, string> | null;
  sections: Record<string, boolean> | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  featured: boolean;
  featured_order: number;
  published: boolean;
  visibility: Visibility;
  sort_order: number;
};

const table = () => (supabase as any).from("projects");
const media = () => (supabase as any).from("project_media");

/* ------------------------------------------------------------------ */
/* Queries                                                             */
/* ------------------------------------------------------------------ */

/** Public archive: published, non-private, non-unlisted projects. */
export const workQuery = queryOptions({
  queryKey: ["work", "public"],
  queryFn: async (): Promise<WorkProject[]> => {
    const { data, error } = await table()
      .select("*")
      .eq("published", true)
      .eq("visibility", "public")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as WorkProject[];
  },
});

export const workProjectQuery = (slug: string) =>
  queryOptions({
    queryKey: ["work", "project", slug],
    queryFn: async (): Promise<WorkProject | null> => {
      const { data, error } = await table().select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return (data ?? null) as WorkProject | null;
    },
  });

export const projectMediaQuery = (projectId: string | undefined) =>
  queryOptions({
    queryKey: ["work", "media", projectId ?? "none"],
    queryFn: async (): Promise<ProjectMedia[]> => {
      if (!projectId) return [];
      const { data, error } = await media()
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as ProjectMedia[];
    },
  });

/** Admin: every project, drafts and private included. */
export const workAdminQuery = queryOptions({
  queryKey: ["admin", "work"],
  queryFn: async (): Promise<WorkProject[]> => {
    const { data, error } = await table().select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as WorkProject[];
  },
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function workCover(p: Pick<WorkProject, "cover_image" | "images" | "slug">, offset = 0) {
  return p.cover_image || p.images?.[0] || imageFor(p.slug ?? "yomi", offset);
}

export function workYear(p: WorkProject) {
  return p.year ?? (p.project_date ? new Date(p.project_date).getFullYear() : null);
}

export function tagsOf(p: WorkProject): string[] {
  return Array.from(new Set([p.category, ...(p.categories ?? [])].filter(Boolean)));
}

export function sectionEnabled(p: WorkProject, key: string) {
  const flags = p.sections ?? {};
  return flags[key] !== false;
}

export function matchesSearch(p: WorkProject, term: string) {
  if (!term) return true;
  const haystack = [
    p.title,
    p.client,
    p.project_type,
    ...tagsOf(p),
    String(workYear(p) ?? ""),
    ...(p.services ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
}

/**
 * Editorial layout rhythm: featured projects get the large treatment, the rest
 * alternate so the grid never reads as a uniform card wall.
 */
export type GridSlot = { span: string; ratio: string; large: boolean };

export function gridSlot(p: WorkProject, index: number): GridSlot {
  if (p.featured && index % 4 === 0) {
    return { span: "md:col-span-12", ratio: "aspect-[4/5] md:aspect-[16/9]", large: true };
  }
  const pattern = index % 5;
  if (pattern === 0) return { span: "md:col-span-12", ratio: "aspect-[4/5] md:aspect-[16/9]", large: true };
  if (pattern === 3) return { span: "md:col-span-7", ratio: "aspect-[4/3]", large: false };
  if (pattern === 4) return { span: "md:col-span-5", ratio: "aspect-[3/4] md:aspect-[4/5]", large: false };
  return { span: "md:col-span-6", ratio: "aspect-[3/4] md:aspect-[4/5]", large: false };
}

/** Sorting: featured first (by featured_order), then curated sort order. */
export function curate(projects: WorkProject[]) {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.featured && b.featured && a.featured_order !== b.featured_order)
      return a.featured_order - b.featured_order;
    return a.sort_order - b.sort_order;
  });
}

/** Turns a YouTube/Vimeo/file URL into an embeddable player source. */
export function videoEmbed(url: string) {
  const yt = url.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (yt) return { kind: "iframe" as const, src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "iframe" as const, src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { kind: "file" as const, src: url };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
