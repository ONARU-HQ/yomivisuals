import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { projectsQuery, servicesQuery, testimonialsQuery, coverFor } from "@/lib/cms";
import { portfolioQuery, heroSlides, rotatedFeatured, focalStyle, type PortfolioImage } from "@/lib/portfolio";
import { HeroRotator } from "@/components/HeroRotator";
import { Container, Section, SectionHeading, Reveal, TextLink, Eyebrow } from "@/components/site/ui";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const [, , , photos] = await Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
      context.queryClient.ensureQueryData(portfolioQuery),
    ]);
    return { ogImage: heroSlides(photos)[0]?.url ?? photos[0]?.url ?? null };
  },

  head: ({ loaderData }) => ({
    meta: [
      { title: "Yomi Visuals — Creative Agency in Lagos, Nigeria" },
      {
        name: "description",
        content:
          "Yomi Visuals is a premium creative agency in Lagos specializing in campaign creative, commercial photography, brand photography, creative direction and visual production.",
      },
      { property: "og:title", content: "Yomi Visuals — Creative Agency in Lagos, Nigeria" },
      {
        property: "og:description",
        content: "We build visuals that move brands. Campaign creative, photography and visual production from Lagos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://yomivisuals.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(loaderData?.ogImage
        ? [
            { property: "og:image", content: loaderData.ogImage },
            { name: "twitter:image", content: loaderData.ogImage },
          ]
        : []),
    ],
    links: [
      { rel: "canonical", href: "https://yomivisuals.lovable.app/" },
      ...(loaderData?.ogImage
        ? [{ rel: "preload", as: "image", href: loaderData.ogImage, fetchpriority: "high" } as const]
        : []),
    ],
  }),
  component: HomePage,
});

const PROCESS = [
  { title: "Discover", body: "Understand the brand, audience, objective and desired perception." },
  { title: "Concept", body: "Develop the creative concept and visual direction." },
  { title: "Produce", body: "Photography, film, styling, lighting, art direction and production." },
  { title: "Deliver", body: "Premium final assets ready for campaigns, websites, advertising and digital platforms." },
];

function HomePage() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: photos } = useSuspenseQuery(portfolioQuery);

  const slides = heroSlides(photos);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 8);
  const featuredPhotos = rotatedFeatured(photos, 8);
  const quotes = testimonials.filter((t) => t.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-14 pt-28 md:pb-20">
        {slides.length ? (
          <HeroRotator slides={slides} />
        ) : (
          <div className="absolute inset-0 bg-surface" />
        )}

        <Container className="relative">
          <div className="fade-up">
            <Eyebrow>Yomi Visuals — Creative Agency, Lagos</Eyebrow>
            <h1 className="text-display mt-5 max-w-5xl text-[clamp(2.4rem,8.5vw,6.2rem)]">
              We build visuals that move brands.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-subtle md:text-lg">
              Campaign creative, brand photography and visual production for brands that refuse to be forgotten.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/book"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start a Project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong px-7 py-4 text-[13.5px] font-medium transition-colors hover:bg-elevated"
              >
                View Selected Work
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Selected work */}
      <Section>
        <SectionHeading
          eyebrow="Selected Work"
          title="Campaigns, productions and visual stories."
          body="A selection of campaigns, commercial productions and visual stories created for brands, people and experiences."
          action={<TextLink to="/portfolio">View all work</TextLink>}
        />
        {featuredProjects.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 80} className={i % 4 === 3 ? "md:mt-14" : ""}>
                <Link
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
                      <h3 className="mt-1.5 truncate text-[16px] font-medium tracking-tight md:text-[17px]">{p.title}</h3>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <FallbackShowcase photos={featuredPhotos} />
        )}
      </Section>

      {/* What we do */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="What We Do" title="One studio. Every visual discipline." />
        <div className="border-t border-border">
          {services.map((s, i) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border-b border-border py-6 transition-colors hover:bg-elevated/40 md:gap-8 md:py-8"
            >
              <span className="w-8 text-[12px] text-muted-foreground">0{i + 1}</span>
              <div className="min-w-0">
                <h3 className="text-display text-[clamp(1.25rem,3.4vw,2rem)]">{s.title}</h3>
                <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted-foreground md:text-[14px]">
                  {s.excerpt}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </Section>

      {/* Creative process */}
      <Section className="border-t border-border">
        <h2 className="text-display max-w-4xl text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.05]">
          Good visuals get attention.
          <br />
          <span className="text-muted-foreground">Great visuals build perception.</span>
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {PROCESS.map((step, i) => (
            <div key={step.title} className="bg-background p-6 md:p-7">
              <span className="text-[12px] text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-4 text-[15px] font-medium uppercase tracking-[0.08em]">{step.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials — only rendered when real ones exist */}
      {quotes.length ? (
        <Section className="border-t border-border">
          <SectionHeading eyebrow="Clients" title="What they said afterwards." />
          <div className="grid gap-5 md:grid-cols-3">
            {quotes.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <figure className="panel flex h-full flex-col justify-between p-7">
                  <blockquote className="text-[16px] leading-relaxed tracking-tight">“{t.quote}”</blockquote>
                  <figcaption className="mt-8 text-[12.5px] text-muted-foreground">
                    {t.name}
                    {t.role || t.company ? ` — ${[t.role, t.company].filter(Boolean).join(", ")}` : ""}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Final CTA */}
      <section className="border-t border-border py-24 md:py-36">
        <Container className="text-center">
          <h2 className="text-display mx-auto max-w-4xl text-[clamp(2rem,6.5vw,4.4rem)]">
            Let's build something people remember.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            Tell us what you're building, what you want people to feel, and where you want your brand to go.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/book"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a Project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong px-8 py-4 text-[13.5px] font-medium transition-colors hover:bg-elevated"
            >
              View Selected Work
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Real-photo fallback shown until the first case studies are published. */
function FallbackShowcase({ photos }: { photos: PortfolioImage[] }) {
  if (!photos.length) return null;
  return (
    <div className="columns-2 gap-3 md:columns-4 md:gap-4">
      {photos.map((img, i) => (
        <Link
          key={img.id}
          to="/portfolio"
          className="image-reveal group mb-3 block w-full overflow-hidden rounded-[10px] border border-border bg-elevated md:mb-4"
        >
          <div
            className="relative w-full"
            style={{
              paddingBottom: `${(img.width && img.height ? img.height / img.width : 1.4) * 100}%`,
              backgroundImage: img.blur_data ? `url(${img.blur_data})` : undefined,
              backgroundSize: "cover",
            }}
          >
            <img
              src={img.thumb_url ?? img.url}
              alt={`${img.title} — ${img.category} by Yomi Visuals`}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              style={focalStyle(img)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
