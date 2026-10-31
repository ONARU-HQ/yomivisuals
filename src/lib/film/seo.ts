import { SITE_URL } from "@/content/site";

type Seo = { title: string; description: string; path: string; image?: string; noindex?: boolean; type?: "website" | "article" };

/** Layer 07 — page metadata (title, description, canonical, Open Graph, Twitter). */
export function seo({ title, description, path, image = "/portfolio/yv-portraits-041-1600.webp", noindex, type = "website" }: Seo) {
  const url = `${SITE_URL}${path}`;
  const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: img },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: img },
      { name: "robots", content: noindex ? "noindex,nofollow" : "index,follow" },
    ],
    links: noindex ? [] : [{ rel: "canonical", href: url }],
  };
}
