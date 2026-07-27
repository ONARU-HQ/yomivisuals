import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

import portrait1 from "@/assets/portrait-1.jpg";
import wedding1 from "@/assets/wedding-1.jpg";
import fashion1 from "@/assets/fashion-1.jpg";
import maternity1 from "@/assets/maternity-1.jpg";
import family1 from "@/assets/family-1.jpg";
import brand1 from "@/assets/brand-1.jpg";
import heroWedding from "@/assets/hero-wedding.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Yomi Visuals" },
      {
        name: "description",
        content:
          "A curated archive of weddings, portraits, fashion, brand and family memories preserved by Yomi Visuals.",
      },
      { property: "og:title", content: "Portfolio — Yomi Visuals" },
      {
        property: "og:description",
        content: "A curated exhibition of cinematic memories.",
      },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioPage,
});

type Cat = "All" | "Portraits" | "Weddings" | "Fashion" | "Brands" | "Family";

const works: { title: string; client: string; cat: Exclude<Cat, "All">; image: string; year: string; ratio: string }[] = [
  { title: "Cathedral Vows", client: "Adaeze & Tolu", cat: "Weddings", image: heroWedding, year: "2025", ratio: "aspect-[3/4]" },
  { title: "Amara — Studio Sitting", client: "Amara O.", cat: "Portraits", image: portrait1, year: "2025", ratio: "aspect-[3/4]" },
  { title: "Rooftop Golden Hour", client: "Adaeze & Tolu", cat: "Weddings", image: wedding1, year: "2025", ratio: "aspect-[4/3]" },
  { title: "House of Alára SS25", client: "House of Alára", cat: "Fashion", image: fashion1, year: "2024", ratio: "aspect-[3/4]" },
  { title: "Silhouette in Waiting", client: "Anonymous", cat: "Family", image: maternity1, year: "2024", ratio: "aspect-[4/3]" },
  { title: "Small Hands", client: "The Okonkwo Family", cat: "Family", image: family1, year: "2024", ratio: "aspect-[4/5]" },
  { title: "Lumière Noire", client: "Maison Éclat", cat: "Brands", image: brand1, year: "2024", ratio: "aspect-[4/3]" },
  { title: "The Craftsman", client: "Yomi Visuals Studio", cat: "Portraits", image: aboutPortrait, year: "2024", ratio: "aspect-[3/4]" },
];

const tabs: Cat[] = ["All", "Portraits", "Weddings", "Fashion", "Brands", "Family"];

function PortfolioPage() {
  const [cat, setCat] = useState<Cat>("All");
  const filtered = cat === "All" ? works : works.filter((w) => w.cat === cat);

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto max-w-[1400px] px-5 md:px-10">
        <p className="text-eyebrow mb-5">The Archive</p>
        <h1 className="text-display text-4xl leading-[1] text-primary md:text-7xl">
          Every image is <br />
          <span className="text-editorial text-gold-warm">a memory kept.</span>
        </h1>
        <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
          A curated selection from the studio archive. Tap any memory to open its story.
        </p>

        {/* Filter tabs */}
        <div
          className="mt-10 -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setCat(t)}
              className={`shrink-0 rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.22em] transition-all duration-300 ${
                cat === t
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {filtered.map((w) => (
            <a
              key={w.title}
              href="#"
              className="group image-reveal hover-lift block"
            >
              <div className={`relative overflow-hidden ${w.ratio}`} style={{ borderRadius: "14px" }}>
                <img src={w.image} alt={w.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-gold-warm">
                      {w.cat} · {w.year}
                    </p>
                    <h3 className="mt-1 text-display text-xl text-primary md:text-2xl">
                      {w.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{w.client}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-primary/70 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold-warm" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center gap-6 text-center">
          <p className="text-editorial text-2xl text-primary md:text-4xl">
            Ready to make yours?
          </p>
          <Link
            to="/book"
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-primary-foreground transition-all duration-500 hover:bg-gold-warm"
          >
            Book a session
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="mt-24" />
      <SiteFooter />
    </div>
  );
}
