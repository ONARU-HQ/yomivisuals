import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { categories } from "@/lib/portfolio-data";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Yomi Visuals" },
      {
        name: "description",
        content:
          "Explore the Yomi Visuals portfolio across ten disciplines — portraits, weddings, fashion, commercial, corporate, events, products, architecture, lifestyle and editorial.",
      },
      { property: "og:title", content: "Portfolio — Yomi Visuals" },
      { property: "og:description", content: "Ten disciplines. One agency. Explore the work." },
      { property: "og:url", content: "https://yomivisuals.lovable.app/portfolio" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/portfolio" }],
  }),
  component: PortfolioIndex,
});

function PortfolioIndex() {
  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <section className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="text-eyebrow mb-5">Portfolio</p>
        <h1 className="text-display text-4xl leading-[1] text-primary md:text-7xl">
          Ten disciplines. <br />
          <span className="text-editorial text-gold-warm">One agency.</span>
        </h1>
        <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
          Every category is its own world. Tap to enter.
        </p>
      </section>

      <section className="mx-auto mt-14 max-w-[1500px] px-5 md:mt-20 md:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/portfolio/$category"
              params={{ category: c.slug }}
              className={`group image-reveal hover-lift block ${
                i === 0 ? "sm:col-span-2 md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  i === 0 ? "aspect-[16/12] md:aspect-[16/13]" : "aspect-[4/5]"
                }`}
                style={{ borderRadius: "14px" }}
              >
                <img
                  src={c.cover}
                  alt={c.name}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-gold-warm">
                      {c.images.length} frames
                    </p>
                    <h2 className="mt-2 text-display text-2xl text-primary md:text-4xl">{c.name}</h2>
                    <p className="mt-1 text-editorial text-sm text-primary/80 md:text-base">{c.tagline}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-primary/70 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold-warm" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-24" />
      <SiteFooter />
    </div>
  );
}
