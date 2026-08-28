import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { projectsQuery, servicesQuery, testimonialsQuery, coverFor } from "@/lib/cms";
import { portfolioQuery, heroSlides, rotatedFeatured, focalStyle, type PortfolioImage } from "@/lib/portfolio";
import { HeroRotator } from "@/components/HeroRotator";
import { Container, Section, SectionHeading, Reveal, TextLink, Eyebrow } from "@/components/site/ui";
import { ScrollCue, useHeroScroll } from "@/components/motion";
import { STAGGER } from "@/lib/motion";
import { PROJECT_TYPES } from "@/lib/project-engine";
import { PILLARS, PROCESS_STAGES, DIVISIONS } from "@/lib/ecosystem";

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
      { title: "Yomi Visuals — Creative Production Company, Lagos" },
      {
        name: "description",
        content:
          "Yomi Visuals is a creative production company in Lagos developing ideas, campaigns and visual experiences for ambitious brands — creative direction, campaign development and full production.",
      },
      { property: "og:title", content: "Yomi Visuals — Creative Production Company" },
      {
        property: "og:description",
        content: "We make ideas real. Creative direction, campaign development and production from Lagos, Nigeria.",
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


function HomePage() {
  const hero = useHeroScroll();
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
        <div className="absolute inset-0" style={hero.media}>
          {slides.length ? <HeroRotator slides={slides} /> : <div className="absolute inset-0 bg-surface" />}
        </div>

        <Container className="relative">
          <div className="fade-up" style={hero.headline}>
            <div style={{ animation: `fade-up var(--motion-dramatic) var(--ease-out-expo) both`, animationDelay: `${STAGGER.label}ms` }}>
              <Eyebrow>Yomi Visuals — Creative Production Company</Eyebrow>
            </div>
            <h1
              className="text-display mt-5 max-w-5xl text-[clamp(2.4rem,8.5vw,6.2rem)]"
              style={{ animation: "fade-up var(--motion-dramatic) var(--ease-out-expo) both", animationDelay: `${STAGGER.headline}ms` }}
            >
              We make ideas real.
            </h1>
            <p
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-subtle md:text-lg"
              style={{ ...hero.support, animation: "fade-up var(--motion-dramatic) var(--ease-out-expo) both", animationDelay: `${STAGGER.body}ms` }}
            >
              Yomi Visuals is a creative production company developing ideas, campaigns and visual experiences for
              ambitious brands.
            </p>
            <div
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              style={{ animation: "fade-up var(--motion-dramatic) var(--ease-out-expo) both", animationDelay: `${STAGGER.action}ms` }}
            >
              <Link
                to="/start-a-project"
                className="press group inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-7 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] text-primary-foreground transition-opacity duration-[var(--motion-fast)] hover:opacity-90"
              >
                Start a Project
                <ArrowUpRight className="arrow-nudge-diagonal h-4 w-4" />
              </Link>
              <Link
                to="/work"
                className="press inline-flex items-center justify-center gap-2 rounded-sm border border-border-strong px-7 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] transition-colors duration-[var(--motion-fast)] hover:bg-elevated"
              >
                View Our Work
              </Link>
            </div>
            <div className="mt-10">
              <ScrollCue targetId="intro" />
            </div>
          </div>
        </Container>
      </section>

      {/* Brand introduction */}
      <section id="intro" className="border-t border-border py-16 md:py-28">
        <Container>
          <Eyebrow>Yomi Visuals</Eyebrow>
          <p className="text-display mt-6 max-w-4xl text-[clamp(1.6rem,5.5vw,3.4rem)] leading-[1.08]">
            We are a creative production company.
          </p>
          <p className="mt-7 max-w-2xl text-[15.5px] leading-relaxed text-subtle md:text-[17px]">
            We develop ideas, direct creative and build the production required to bring ambitious visions to life —
            from a single production to a full brand campaign.
          </p>
        </Container>
      </section>

      {/* Objective-led entry — turns a visitor into a brief in one click */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Start Here"
          title="What are you trying to make?"
          body="Pick the closest one. We'll build the brief around it and recommend the production scope."
        />
        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PROJECT_TYPES.map((t) => (
            <Link
              key={t.key}
              to="/start-a-project"
              search={{ type: t.key }}
              className="group flex flex-col justify-between gap-6 bg-background p-6 transition-colors duration-[var(--motion-fast)] hover:bg-elevated md:p-8"
            >
              <div>
                <h3 className="text-[16px] font-medium tracking-tight md:text-[17px]">{t.label}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-[11.5px] uppercase tracking-[0.16em] text-subtle">
                Start a brief
                <ArrowUpRight className="h-3.5 w-3.5 text-gold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>



      {/* Selected work */}

      <Section>
        <SectionHeading
          eyebrow="Selected Work"
          title="Campaigns, productions and visual stories."
          body="A selection of campaigns, commercial productions and visual stories created for brands, people and experiences."
          action={<TextLink to="/work">View all work</TextLink>}
        />
        {featuredProjects.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 80} className={i % 4 === 3 ? "md:mt-14" : ""}>
                <Link
                  to="/work/$slug"
                  params={{ slug: p.slug }}
                  className="image-reveal group block overflow-hidden rounded-sm border border-border bg-elevated"
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

      {/* Three pillars */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="How We're Built"
          title="Ideas first. Production second."
          body="Three pillars carry every project — the thinking, the making, and the campaign that ties them together."
          action={<TextLink to="/services">All capabilities</TextLink>}
        />
        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.code} delay={i * 80}>
              <div className="flex h-full flex-col bg-background p-7 md:p-9">
                <span className="text-index">0{i + 1}</span>
                <h3 className="text-headline mt-5 text-[clamp(1.3rem,3vw,1.8rem)]">{p.code}</h3>
                <p className="text-serif mt-2 text-[1.05rem] normal-case text-gold">{p.title}</p>
                <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">{p.body}</p>
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {p.items.slice(0, 6).map((s) => (
                    <li key={s} className="border border-border px-2.5 py-1.5 text-[11.5px] text-muted-foreground">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="The Process"
          title="Seven stages, brief to rollout."
          action={<TextLink to="/how-we-work">See how we work</TextLink>}
        />
        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STAGES.map((step) => (
            <div key={step.code} className="bg-background p-6 md:p-7">
              <span className="text-index">{step.code}</span>
              <h3 className="mt-4 text-[15px] font-medium uppercase tracking-[0.08em]">{step.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Ecosystem teaser */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="The Ecosystem"
          title="One master brand. Connected divisions."
          body="Creative, production, campaigns, studios, entertainment, management and a curated creators network — assembled per project."
          action={<TextLink to="/ecosystem">Explore the ecosystem</TextLink>}
        />
        <ul className="flex flex-wrap gap-2">
          {DIVISIONS.map((d) => (
            <li key={d.name} className="border border-border px-4 py-2.5 text-[12.5px] text-subtle">
              {d.name}
            </li>
          ))}
        </ul>
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

      {/* Founder */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Leadership"
          title="Yomi Onalaru — Founder & Creative Producer."
          body="Yomi leads the creative vision, develops ideas, builds production teams and oversees execution. The company delivers the work."
          action={<TextLink to="/about/founder">Meet the founder</TextLink>}
        />
      </Section>

      {/* Final CTA */}
      <section className="border-t border-border py-24 md:py-36">
        <Container className="text-center">
          <h2 className="text-display mx-auto max-w-4xl text-[clamp(2rem,6.5vw,4.4rem)]">
            Have an idea? Let's make it real.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            Tell us what you're building, what you want people to feel, and where you want your brand to go.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/start-a-project"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-8 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a Project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-border-strong px-8 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-elevated"
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
          to="/work"
          className="image-reveal group mb-3 block w-full overflow-hidden rounded-sm border border-border bg-elevated md:mb-4"
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
