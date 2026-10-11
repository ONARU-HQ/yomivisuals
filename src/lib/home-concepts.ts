import { imageProjectType, uniqueImages } from "@/lib/image-library";
import type { PortfolioImage } from "@/lib/portfolio";

export const HOME_CONCEPTS = [
  { id: "cinema", name: "01 / Cinema", description: "Full-frame rotating photography → capabilities → work → enquiry." },
  { id: "editorial", name: "02 / Editorial", description: "An oversized agency masthead → portrait-led editorial → work → process." },
  { id: "mosaic", name: "03 / Mosaic", description: "A multi-frame visual opening → work grid → services → enquiry." },
  { id: "archive", name: "04 / Contact sheet", description: "A compact commercial opening → browsable project types → capabilities." },
  { id: "narrative", name: "05 / Journey", description: "A cinematic opening → idea, creative, production and delivery chapters." },
] as const;
export type HomeConceptId = typeof HOME_CONCEPTS[number]["id"];
export const HERO_INTERVAL = 7000;

/** Use only imported source photography; no seeded project fallback pool. */
export function conceptPhotos(images: PortfolioImage[]) {
  return uniqueImages(images.filter(image => image.active && image.original_filename && image.url))
    .sort((a, b) => Number(b.hero) - Number(a.hero) || b.quality_score - a.quality_score);
}
export function photoLabel(image: Pick<PortfolioImage, "category" | "project_type">) {
  return imageProjectType(image);
}