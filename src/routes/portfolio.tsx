import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Container, PageHero, TextLink } from "@/components/site/ui";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { portfolioQuery, focalStyle, type PortfolioImage } from "@/lib/portfolio";

export const Route = createFileRoute("/portfolio")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(portfolioQuery);
  },
  head: () => ({
    meta: [
      { title: "Portfolio — Photography Archive | Yomi Visuals" },
      {
        name: "description",
        content:
          "Browse the Yomi Visuals photography archive: portraits, fashion, beauty, editorial, corporate, events and lifestyle work shot in Lagos.",
      },
      { property: "og:title", content: "Portfolio — Photography Archive | Yomi Visuals" },
      {
        property: "og:description",
        content: "Portraits, fashion, beauty, editorial, corporate and event photography by Yomi Visuals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/portfolio" }],
  }),
  errorComponent: () => (
    <div className="grid min-h-[60svh] place-items-center text-[13px] text-muted-foreground">
      We couldn't load the archive. Please refresh.
    </div>
  ),
  notFoundComponent: () => <div className="grid min-h-[60svh] place-items-center">Not found</div>,
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data: images } = useSuspenseQuery(portfolioQuery);
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const gallery = useMemo(() => images.filter((i) => i.in_portfolio), [images]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of gallery) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
    return ["All", ...[...counts.keys()].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))];
  }, [gallery]);

  const visible = useMemo(
    () => (category === "All" ? gallery : gallery.filter((i) => i.category === category)),
    [gallery, category],
  );

  return (
    <>
      <PageHero
        eyebrow="The Archive"
        title="Every frame we've been trusted to make."
        body="Portraits, fashion, beauty, editorial, corporate and celebration photography — shot in Lagos, delivered worldwide."
      >
        <TextLink to="/book">Book a session</TextLink>
      </PageHero>

      <Container className="sticky top-[68px] z-30 -mx-0 border-b border-border bg-background/95 py-3 backdrop-blur">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] transition-colors ${
                c === category
                  ? "border-border-strong bg-elevated text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Container>

      <Container className="py-10 md:py-16">
        <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
          {visible.map((img, i) => (
            <GalleryTile key={img.id} img={img} onOpen={() => setLightbox(i)} eager={i < 6} />
          ))}
        </div>
        {!visible.length ? (
          <p className="py-24 text-center text-[13px] text-muted-foreground">No images in this category yet.</p>
        ) : null}
      </Container>

      <PhotoLightbox images={visible} index={lightbox} onClose={() => setLightbox(null)} onIndexChange={setLightbox} />
    </>
  );
}

function GalleryTile({ img, onOpen, eager }: { img: PortfolioImage; onOpen: () => void; eager: boolean }) {
  const ratio = img.width && img.height ? img.height / img.width : 1.4;
  return (
    <button
      onClick={onOpen}
      className="image-reveal group mb-3 block w-full overflow-hidden rounded-[10px] border border-border bg-elevated md:mb-4"
      aria-label={`Open ${img.title}`}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          paddingBottom: `${ratio * 100}%`,
          backgroundImage: img.blur_data ? `url(${img.blur_data})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={img.thumb_url ?? img.url}
          srcSet={img.thumb_url ? `${img.thumb_url} 760w, ${img.url} 1600w` : undefined}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          alt={`${img.title} — ${img.category} photography by Yomi Visuals`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          style={focalStyle(img)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
      </div>
      <span className="flex items-center justify-between gap-3 px-3.5 py-3 text-left">
        <span className="truncate text-[12.5px] font-medium tracking-tight">{img.title}</span>
        <span className="shrink-0 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{img.category}</span>
      </span>
    </button>
  );
}
