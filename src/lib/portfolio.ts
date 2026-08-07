import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PortfolioImage = {
  id: string;
  url: string;
  thumb_url: string | null;
  blur_data: string | null;
  original_filename: string | null;
  title: string;
  category: string;
  tags: string[];
  orientation: "portrait" | "landscape" | "square";
  width: number | null;
  height: number | null;
  priority: "pinned" | "featured" | "standard";
  featured: boolean;
  homepage: boolean;
  in_portfolio: boolean;
  hero: boolean;
  hero_order: number;
  focal_x: number;
  focal_y: number;
  quality_score: number;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export const PORTFOLIO_CATEGORIES = [
  "Weddings",
  "Portraits",
  "Fashion",
  "Beauty",
  "Editorial",
  "Corporate",
  "Events",
  "Lifestyle",
  "Commercial",
  "Product",
  "Creative",
];

export const PRIORITIES = ["pinned", "featured", "standard"] as const;

const table = () => (supabase as any).from("portfolio_images");

/** Public: active images only. */
export const portfolioQuery = queryOptions({
  queryKey: ["portfolio_images"],
  queryFn: async (): Promise<PortfolioImage[]> => {
    const { data, error } = await table()
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as PortfolioImage[];
  },
});

/** Admin: every image, hidden included. */
export const portfolioAdminQuery = queryOptions({
  queryKey: ["admin", "portfolio_images"],
  queryFn: async (): Promise<PortfolioImage[]> => {
    const { data, error } = await table().select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as PortfolioImage[];
  },
});

export function focalStyle(img: Pick<PortfolioImage, "focal_x" | "focal_y">) {
  return { objectPosition: `${Math.round(img.focal_x * 100)}% ${Math.round(img.focal_y * 100)}%` };
}

export function heroSlides(images: PortfolioImage[]) {
  return images
    .filter((i) => i.hero)
    .sort((a, b) => a.hero_order - b.hero_order)
    .slice(0, 10);
}

/**
 * Curated rotation: pinned images always keep their slot, the rest of the pool
 * rotates on a slow, stable cycle (changes daily) so the site never feels static
 * and never shows two frames from the same shoot back to back.
 */
export function rotatedFeatured(images: PortfolioImage[], count: number, seed = daySeed()) {
  const pool = images.filter((i) => i.featured || i.priority !== "standard");
  const pinned = pool.filter((i) => i.priority === "pinned").sort((a, b) => a.sort_order - b.sort_order);
  const rest = pool.filter((i) => i.priority !== "pinned").sort((a, b) => a.sort_order - b.sort_order);
  const offset = rest.length ? seed % rest.length : 0;
  const rotated = [...rest.slice(offset), ...rest.slice(0, offset)];

  const out: PortfolioImage[] = [];
  const shoots = new Set<string>();
  const shootOf = (i: PortfolioImage) => i.title.split(" — ")[0];

  for (const img of [...pinned, ...rotated]) {
    if (out.length >= count) break;
    const key = shootOf(img);
    if (shoots.has(key)) continue;
    shoots.add(key);
    out.push(img);
  }
  // top up if the variety filter left us short
  for (const img of [...pinned, ...rotated]) {
    if (out.length >= count) break;
    if (!out.includes(img)) out.push(img);
  }
  return out;
}

export function daySeed() {
  return Math.floor(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) / 86400000);
}

/** Smart placement: pick imagery whose category/tags match a page's subject. */
const SERVICE_CATEGORY_HINTS: { match: RegExp; categories: string[]; tags?: string[] }[] = [
  { match: /wedding|bridal|matrimon/i, categories: ["Weddings", "Events"], tags: ["bridal", "couple"] },
  { match: /portrait|headshot|personal/i, categories: ["Portraits", "Beauty"] },
  { match: /fashion|look ?book|style/i, categories: ["Fashion", "Editorial"] },
  { match: /beauty|makeup|skin/i, categories: ["Beauty", "Portraits"] },
  { match: /editorial|magazine|story/i, categories: ["Editorial", "Fashion"] },
  { match: /corporate|business|brand|company|profile/i, categories: ["Corporate", "Editorial"] },
  { match: /event|conference|gala|party|birthday/i, categories: ["Events", "Lifestyle"] },
  { match: /lifestyle|family|content/i, categories: ["Lifestyle", "Portraits"] },
  { match: /product|commercial|advert|campaign/i, categories: ["Commercial", "Product", "Editorial"] },
  { match: /creative|concept|art/i, categories: ["Creative", "Editorial"] },
];

export function imagesForSubject(images: PortfolioImage[], subject: string, count = 6) {
  const hint = SERVICE_CATEGORY_HINTS.find((h) => h.match.test(subject));
  const score = (i: PortfolioImage) => {
    let s = i.quality_score;
    if (hint) {
      const ci = hint.categories.indexOf(i.category);
      if (ci >= 0) s += 200 - ci * 40;
      if (hint.tags?.some((t) => i.tags.includes(t))) s += 30;
    }
    if (i.priority === "pinned") s += 25;
    return s;
  };
  const seen = new Set<string>();
  return [...images]
    .sort((a, b) => score(b) - score(a))
    .filter((i) => {
      const key = i.title.split(" — ")[0];
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, count);
}
