import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, TextLink, Eyebrow } from "@/components/site/ui";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { portfolioQuery, focalStyle, type PortfolioImage } from "@/lib/portfolio";
import { projectsQuery, coverFor } from "@/lib/cms";

export const Route = createFileRoute("/portfolio")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(portfolioQuery);
    await context.queryClient.ensureQueryData(projectsQuery);
  },
  head: () => ({
    meta: [
      { title: "Selected Work — Yomi Visuals | Creative Agency Lagos" },
      {
        name: "description",
        content:
          "A selection of campaigns, commercial productions and visual stories created by Yomi Visuals for brands, people and experiences in Lagos and beyond.",
      },
      { property: "og:title", content: "Selected Work — Yomi Visuals" },
      {
        property: "og:description",
        content: "Campaigns, brand photography, commercial productions and visual stories by Yomi Visuals.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://yomivisuals.lovable.app/portfolio" },
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
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const featuredProjects = useMemo(() => projects.filter((p) => p.featured), [projects]);
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
        eyebrow="Selected Work"
        title="Visual stories, built to move brands."
        body="A selection of campaigns, commercial productions and visual stories created for brands, people and experiences."
      >
        <TextLink to="/book">Start a project</TextLink>
      </PageHero>

      {/* Featured case studies */}
      {featuredProjects.length ? (
        <Container className="py-10 md:py-14">
          <div className="grid gap-5 md:grid-cols-2">
            {featuredProjects.map((p, i) => (
              <Link
                key={p.id}
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="image-reveal group block overflow-hidden rounded-[14px] border border-border bg-elevated"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={coverFor(p)}
                    alt={`${p.title}${p.client ? ` for ${p.client}` : ""} — by Yomi Visuals`}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 p-5 md:p-6">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] text-muted-foreground">
                      {[p.client, p.industry].filter(Boolean).join(" · ")}
                    </p>
                    <h2 className="mt-1.5 truncate text-[16px] font-medium tracking-tight md:text-[17px]">{p.title}</h2>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      ) : null}

      {/* Archive */}
      <Container className="sticky top-[60px] z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-5 overflow-x-auto py-4">
          <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Archive</span>
          <div className="flex gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] transition-colors ${
                  c === category
                    ? "border-border-strong bg-elevated text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Container>

      <Container className="py-8 md:py-14">
        <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
          {visible.map((img, i) => (
            <GalleryTile key={img.id} img={img} onOpen={() => setLightbox(i)} eager={i < 6} />
          ))}
        </div>
        {!visible.length ? (
          <p className="py-24 text-center text-[13px] text-muted-foreground">No work in this category yet.</p>
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
          alt={`${img.title} — ${img.category} by Yomi Visuals`}
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
