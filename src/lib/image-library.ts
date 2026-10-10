export const IMAGE_PROJECT_TYPES = ["Campaigns", "Fashion & Editorial", "Products", "Portraits", "Corporate & Headshots", "Hospitality & Spaces", "Events", "Commercial Content", "Film & Motion"] as const;
export const MARKETING_USES = ["Social media", "Paid advertising", "Website", "Email", "Pitch decks"] as const;

export function imageProjectType(image: { project_type?: string; category: string }) {
  if (image.project_type && IMAGE_PROJECT_TYPES.includes(image.project_type as typeof IMAGE_PROJECT_TYPES[number])) return image.project_type;
  const legacy: Record<string, string> = { Fashion: "Fashion & Editorial", Corporate: "Corporate & Headshots", Hospitality: "Hospitality & Spaces", Commercial: "Commercial Content", "Brand Photography": "Commercial Content", Studio: "Portraits" };
  return legacy[image.category] ?? (IMAGE_PROJECT_TYPES.includes(image.category as typeof IMAGE_PROJECT_TYPES[number]) ? image.category : "Portraits");
}

/** Consolidate duplicate records for browsing without deleting source data. */
export function uniqueImages<T extends { url: string }>(images: T[]): T[] {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}