import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const BASE = "https://yomivisuals.lovable.app";

/** Static, indexable public routes. Private/portal/admin routes are excluded. */
const STATIC_ROUTES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/work", priority: "0.9", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/how-we-work", priority: "0.7", changefreq: "monthly" },
  { path: "/ecosystem", priority: "0.7", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/about/founder", priority: "0.6", changefreq: "yearly" },
  { path: "/studio", priority: "0.6", changefreq: "monthly" },
  { path: "/start-a-project", priority: "0.9", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "yearly" },
  { path: "/faqs", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms", priority: "0.2", changefreq: "yearly" },
];

function url(loc: string, lastmod: string | null, changefreq: string, priority: string) {
  return [
    "  <url>",
    `    <loc>${BASE}${loc}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : "",
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function buildSitemap() {
  const entries = STATIC_ROUTES.map((r) => url(r.path, null, r.changefreq, r.priority));

  const [{ data: services }, { data: projects }, { data: divisions }] = await Promise.all([
    supabase.from("services").select("slug, updated_at").eq("published", true),
    supabase.from("projects").select("slug, updated_at, visibility, published").eq("published", true),
    Promise.resolve({ data: [] as { slug: string }[] }),
  ]);

  for (const s of services ?? []) {
    entries.push(url(`/services/${s.slug}`, s.updated_at, "monthly", "0.8"));
  }
  for (const p of projects ?? []) {
    if (p.visibility && p.visibility !== "public") continue;
    entries.push(url(`/work/${p.slug}`, p.updated_at, "monthly", "0.8"));
  }
  void divisions;

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = await buildSitemap();
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
