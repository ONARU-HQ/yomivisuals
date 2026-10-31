/**
 * Layer 01 — Content. Typed access to the portfolio manifest built by
 * scripts/build-portfolio.mjs from the Pixieset export. Set names are the
 * original Pixieset collections; nothing here is invented.
 */
import manifest from "@/content/portfolio.manifest.json";

export type SetSlug = "yv-portraits" | "weddings" | "studio-work" | "brands" | "aso-ebi-look" | "lifestyle";

export type Asset = {
  id: string;
  set: SetSlug;
  original: string;
  w: number;
  h: number;
  ratio: number;
  blur: string;
  focal: [number, number];
  status: string;
};

export type PortfolioSet = {
  slug: SetSlug;
  name: string;
  count: number;
  /** Plain description of what the set contains. Reviewed by the creative director. */
  blurb: string;
  cover: string;
};

export const ASSETS = manifest.assets as Asset[];
const byId = new Map(ASSETS.map((a) => [a.id, a]));

const BLURBS: Record<SetSlug, { blurb: string; cover: string }> = {
  "yv-portraits": { blurb: "Portrait sessions: styled, lit and directed one frame at a time.", cover: "yv-portraits-041" },
  weddings: { blurb: "Traditional ceremonies, white weddings, bridal portraits and the details in between.", cover: "weddings-007" },
  "studio-work": { blurb: "Studio portraiture and concept shoots built around colour, light and attitude.", cover: "studio-work-045" },
  brands: { blurb: "Fashion, accessories and brand imagery made for campaigns and launches.", cover: "brands-021" },
  "aso-ebi-look": { blurb: "Aso-ebi styling and event looks, photographed for the people wearing them.", cover: "aso-ebi-look-005" },
  lifestyle: { blurb: "On-location and street portraits with the city as backdrop.", cover: "lifestyle-004" },
};

export const SETS: PortfolioSet[] = (manifest.sets as { slug: SetSlug; name: string; count: number }[]).map((s) => ({
  ...s,
  ...BLURBS[s.slug],
}));

export const getSet = (slug: string) => SETS.find((s) => s.slug === slug);
export const getAsset = (id: string) => {
  const a = byId.get(id);
  if (!a) throw new Error(`Unknown portfolio asset: ${id}`);
  return a;
};
export const assetsInSet = (slug: string) => ASSETS.filter((a) => a.set === slug);
export const src = (id: string, size: 800 | 1600 = 1600) => `/portfolio/${id}-${size}.webp`;
export const srcSet = (id: string) => `${src(id, 800)} 800w, ${src(id, 1600)} 1600w`;
export const altFor = (a: Asset) => `${getSet(a.set)?.name ?? "Portfolio"} photograph ${Number(a.id.split("-").pop())} by Yomi Visuals`;

/** Curated selections (recommended; pending creative-director approval). */
export const PICKS = {
  hero: "yv-portraits-041",
  act1: ["yv-portraits-004", "weddings-007", "yv-portraits-015", "weddings-016"],
  layers: "studio-work-045",
  creator: "yv-portraits-053",
  gallery: [
    "yv-portraits-004",
    "weddings-006",
    "brands-021",
    "studio-work-007",
    "aso-ebi-look-005",
    "weddings-016",
    "yv-portraits-050",
    "brands-017",
    "lifestyle-004",
  ],
  finale: ["yv-portraits-041", "weddings-016", "brands-021", "studio-work-045", "aso-ebi-look-005", "yv-portraits-004"],
} as const;
