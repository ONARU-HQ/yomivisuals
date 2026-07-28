import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { Lightbox } from "@/components/Lightbox";
import { getCategory, categories } from "@/lib/portfolio-data";

import type { Category } from "@/lib/portfolio-data";

export const Route = createFileRoute("/portfolio/$category")({
  loader: ({ params }): Category => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return cat;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category — Yomi Visuals" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.name} — Yomi Visuals` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.name} — Yomi Visuals` },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://yomivisuals.lovable.app/portfolio/${params.category}` },
      ],
      links: [{ rel: "canonical", href: `https://yomivisuals.lovable.app/portfolio/${params.category}` }],
    };
  },
  component: CategoryPage,
});

const RATIO_CLASS: Record<string, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  tall: "aspect-[2/3]",
};

function CategoryPage() {
  const cat = Route.useLoaderData();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const otherCats = categories.filter((c) => c.slug !== cat.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative h-[70svh] min-h-[500px] w-full overflow-hidden">
        <img
          src={cat.cover}
          alt={cat.name}
          className="h-full w-full object-cover drift"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/60" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-14 md:px-10 md:pb-20">
          <Link
            to="/portfolio"
            className="mb-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> All disciplines
          </Link>
          <p className="text-eyebrow mb-4">Portfolio · {cat.name}</p>
          <h1 className="text-display text-5xl leading-[1] text-primary md:text-8xl">
            {cat.name}
            <span className="text-gold">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-editorial text-xl text-primary/80 md:text-2xl">{cat.tagline}</p>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">{cat.description}</p>
        </div>
      </section>

      {/* MASONRY */}
      <section className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <div className="columns-1 gap-4 sm:columns-2 md:columns-3 md:gap-6">
          {cat.images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(i)}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden md:mb-6"
              style={{ borderRadius: "12px" }}
            >
              <div className={`image-reveal relative overflow-hidden ${RATIO_CLASS[img.ratio]}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/10" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* BOOK CTA */}
      <section className="border-y border-border bg-surface py-20 md:py-28">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-end md:px-10">
          <div>
            <p className="text-eyebrow mb-4">Book this service</p>
            <h2 className="text-display text-3xl leading-[1.05] text-primary md:text-5xl">
              Reserve a <span className="text-editorial text-gold-warm">{cat.name.toLowerCase()}</span> commission.
            </h2>
          </div>
          <div className="flex gap-3">
            <Link
              to="/services/$service"
              params={{ service: cat.service }}
              className="inline-flex items-center gap-2 border border-border px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-primary hover:border-gold hover:text-gold-warm"
              style={{ borderRadius: "12px" }}
            >
              View service
            </Link>
            <Link
              to="/book"
              search={{ exp: cat.service }}
              className="inline-flex items-center gap-2 bg-gold px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-primary-foreground hover:bg-gold-warm"
              style={{ borderRadius: "12px" }}
            >
              Book now
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* OTHER CATEGORIES */}
      <section className="mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
        <p className="text-eyebrow mb-8">Continue exploring</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {otherCats.map((c) => (
            <Link
              key={c.slug}
              to="/portfolio/$category"
              params={{ category: c.slug }}
              className="group image-reveal block"
            >
              <div className="relative aspect-[4/5] overflow-hidden" style={{ borderRadius: "12px" }}>
                <img src={c.cover} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/85 to-transparent p-4">
                  <p className="text-display text-sm text-primary md:text-lg">{c.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />

      {lightbox !== null && (
        <Lightbox
          images={cat.images.map((i) => ({ src: i.src, alt: i.alt }))}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={(i) => setLightbox(i)}
        />
      )}
    </div>
  );
}
