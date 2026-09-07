import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE = "https://yomivisuals.lovable.app";

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
        const entries: SitemapEntry[] = [...STATIC_ROUTES];

        const { createClient } = await import("@supabase/supabase-js");
        const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
        const supabase = createClient(process.env['SUPABASE_URL']!, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              // Opaque sb_ keys are not JWTs; send apikey without the default bearer.
              if (key.startsWith("sb_") && headers.get("Authorization") === "Bearer " + key) {
                headers.delete("Authorization");
              }
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const pageSize = 1000;

        for (let offset = 0; ; offset += pageSize) {
          const { data, error } = await supabase
            .from("services")
            .select("slug, updated_at")
            .eq("published", true)
            .order("slug")
            .range(offset, offset + pageSize - 1);
          if (error) throw error;
          entries.push(
            ...(data ?? []).map((s: { slug: string; updated_at: string | null }) => ({
              path: `/services/${encodeURIComponent(s.slug)}`,
              lastmod: s.updated_at ?? undefined,
              changefreq: "monthly",
              priority: "0.8",
            })),
          );
          if (!data || data.length < pageSize) break;
        }

        for (let offset = 0; ; offset += pageSize) {
          const { data, error } = await supabase
            .from("projects")
            .select("slug, updated_at, visibility")
            .eq("published", true)
            .order("slug")
            .range(offset, offset + pageSize - 1);
          if (error) throw error;
          entries.push(
            ...(data ?? [])
              .filter((p: { visibility: string | null }) => !p.visibility || p.visibility === "public")
              .map((p: { slug: string; updated_at: string | null }) => ({
                path: `/work/${encodeURIComponent(p.slug)}`,
                lastmod: p.updated_at ?? undefined,
                changefreq: "monthly",
                priority: "0.8",
              })),
          );
          if (!data || data.length < pageSize) break;
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map(renderUrl),
          `</urlset>`,
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
