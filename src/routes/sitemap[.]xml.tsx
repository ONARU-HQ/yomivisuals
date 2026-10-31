import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE = "https://yomivisuals.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

/** Static, indexable public routes. Private/portal/admin routes are excluded. */
const STATIC_ROUTES: SitemapEntry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/work", priority: "0.9", changefreq: "weekly" },
  ...["yv-portraits", "weddings", "studio-work", "brands", "aso-ebi-look", "lifestyle"].map((s) => ({ path: `/work/${s}`, priority: "0.8", changefreq: "monthly" })),
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/lab", priority: "0.7", changefreq: "monthly" },
  { path: "/lab/layers", priority: "0.6", changefreq: "monthly" },
  { path: "/journal", priority: "0.5", changefreq: "monthly" },
  { path: "/collaborate", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "yearly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
];

function renderUrl(e: SitemapEntry) {
  return [
    "  <url>",
    `    <loc>${BASE}${e.path}</loc>`,
    e.lastmod ? `    <lastmod>${new Date(e.lastmod).toISOString().slice(0, 10)}</lastmod>` : null,
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
    e.priority ? `    <priority>${e.priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Static by design: every listed route is real, published content.
        const entries: SitemapEntry[] = [...STATIC_ROUTES];
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map(renderUrl),
          "</urlset>",
        ].join("\n");
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
