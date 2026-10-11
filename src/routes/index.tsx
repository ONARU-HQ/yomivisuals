import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { servicesQuery, testimonialsQuery } from "@/lib/cms";
import { ContactLinks } from "@/components/ContactLinks";
import { imageProjectType } from "@/lib/image-library";
import { portfolioQuery, heroSlides, rotatedFeatured, focalStyle, type PortfolioImage } from "@/lib/portfolio";
import { HeroFilm } from "@/components/HeroFilm";
import { track } from "@/lib/analytics";
import { Container, Section, SectionHeading, Reveal, TextLink, Eyebrow } from "@/components/site/ui";
import { ScrollCue, useHeroScroll } from "@/components/motion";
import { STAGGER } from "@/lib/motion";
import { PROJECT_TYPES } from "@/lib/project-engine";
import { PILLARS, PROCESS_STAGES, DIVISIONS } from "@/lib/ecosystem";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const [, , photos] = await Promise.all([
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
      context.queryClient.ensureQueryData(portfolioQuery),
    ]);
    return { ogImage: heroSlides(photos)[0]?.url ?? photos[0]?.url ?? null };
  },

  head: ({ loaderData }) => ({
    meta: [
      { title: "Yomi Visuals — Creative Production Company in Lagos, Nigeria" },
      {
        name: "description",
        content:
          "Yomi Visuals is a creative production company in Lagos, Nigeria producing campaigns, brand films, commercials, photography and visual content for ambitious brands.",
      },
      { property: "og:title", content: "Yomi Visuals — Creative Production Company in Lagos, Nigeria" },
      {
        property: "og:description",
        content:
          "We make ideas real. Campaigns, brand films, commercials, photography and content production from Lagos, Nigeria.",
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
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Yomi Visuals",
          url: "https://yomivisuals.lovable.app/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://yomivisuals.lovable.app/work?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: HOME_FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});

/** Homepage FAQs — real buyer questions, mirrored into FAQ schema above. */
const HOME_FAQS = [
  {
    q: "What does Yomi Visuals do?",
    a: "Yomi Visuals is a creative production company based in Lagos, Nigeria. We develop the creative idea, produce the campaign, film or photography, and deliver finished visual content brands can run across every channel.",
  },
  {
    q: "Do you work with brands outside Lagos?",
    a: "Yes. We are based in Lagos and produce across Nigeria and internationally, building local crews and logistics around each production.",
  },
  {
    q: "How much does a project cost?",
    a: "Every project is scoped individually. Start a project brief and we return a scoped proposal with a clear budget range before anything is confirmed.",
  },
  {
    q: "How long does a project take?",
    a: "A single production day can be delivered in one to two weeks. Full campaigns typically run four to eight weeks from brief to final delivery.",
  },
  {
    q: "Can you handle creative direction and production together?",
    a: "Yes. Most clients use us end to end — idea, creative direction, production and delivery — but we also produce work directed by in-house or agency teams.",
  },
] as const;




function HomePage() {
  const hero = useHeroScroll();
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: photos } = useSuspenseQuery(portfolioQuery);

  const featuredPhotos = rotatedFeatured(photos, 8);
  const quotes = testimonials.filter((t) => t.featured);

  return (
    <>
      {/* Hero film — the lights go down, the film starts */}
      <HeroFilm mediaStyle={hero.media}>
        {({ soundOn, toggleSound }: { soundOn: boolean; toggleSound: () => void }) => (
          <Container>
            <div className="fade-up max-w-3xl pb-16 md:pb-10" style={hero.headline}>
              <div style={{ animation: `fade-up var(--motion-dramatic) var(--ease-out-expo) both`, animationDelay: `${STAGGER.label}ms` }}>
                <Eyebrow>Yomi Visuals — Creative Production Company</Eyebrow>
              </div>
              <h1
                className="text-display mt-5 text-[clamp(2.4rem,8.5vw,6.2rem)]"
                style={{ animation: "fade-up var(--motion-dramatic) var(--ease-out-expo) both", animationDelay: `${STAGGER.headline}ms` }}
              >
                We make
                <br />
                ideas real.
              </h1>
              <p
                className="mt-6 max-w-xl text-[15px] leading-relaxed text-subtle md:text-lg"
                style={{ ...hero.support, animation: "fade-up var(--motion-dramatic) var(--ease-out-expo) both", animationDelay: `${STAGGER.body}ms` }}
              >
                Creative direction, campaigns and production for ambitious brands.
              </p>
              <div
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                style={{ animation: "fade-up var(--motion-dramatic) var(--ease-out-expo) both", animationDelay: `${STAGGER.action}ms` }}
              >
                <Link
                  to="/start-a-project"
                  search={{ source: "homepage" }}
                  onClick={() => track("START_PROJECT", { source: "hero" })}
                  className="press group inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-7 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] text-primary-foreground transition-opacity duration-[var(--motion-fast)] hover:opacity-90"
                >
                  Start a Project
                  <ArrowUpRight className="arrow-nudge-diagonal h-4 w-4" />
                </Link>
                <Link
                  to="/work"
                  onClick={() => track("VIEW_WORK", { source: "hero" })}
                  className="press inline-flex items-center justify-center gap-2 rounded-sm border border-border-strong px-7 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] transition-colors duration-[var(--motion-fast)] hover:bg-elevated"
                >
                  View Our Work
                </Link>
              </div>
              {!soundOn && (
                <button
                  type="button"
                  onClick={toggleSound}
                  className="tap mt-7 inline-flex min-h-11 items-center gap-2 text-[10.5px] uppercase tracking-[0.26em] text-muted-foreground transition-colors duration-[var(--motion-fast)] hover:text-foreground"
                >
                  Watch film with sound
                </button>
              )}
              <div className="mt-6">
                <ScrollCue targetId="intro" />
              </div>
            </div>
          </Container>
        )}
      </HeroFilm>

      {/* Brand introduction */}
      <section id="intro" className="border-t border-border py-16 md:py-28">
        <Container>
          <Eyebrow>Yomi Visuals</Eyebrow>
          <h2 className="text-display mt-6 max-w-4xl text-[clamp(1.6rem,5.5vw,3.4rem)] leading-[1.08]">
            From idea to final frame.
          </h2>
          <p className="mt-7 max-w-2xl text-[15.5px] leading-relaxed text-subtle md:text-[17px]">
            Yomi Visuals is a creative production company based in Lagos, Nigeria. We develop the creative idea, build
            the production and deliver the finished work — campaigns, brand films, commercials, photography and
            content — for brands that need their visuals to sell as well as they look.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
            {["Creative", "Production", "Campaigns"].map((pillar) => (
              <div key={pillar} className="bg-background p-6 md:p-8">
                <p className="text-[13px] uppercase tracking-[0.22em] text-gold">{pillar}</p>
              </div>
            ))}
          </div>
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
        <FallbackShowcase photos={featuredPhotos} />
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


      {/* FAQ — buyer questions, indexed */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Questions"
          title="What brands ask before they start."
          action={<TextLink to="/faqs">All FAQs</TextLink>}
        />
        <div className="divide-y divide-border border-y border-border">
          {HOME_FAQS.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[15.5px] font-medium tracking-tight md:text-[17px]">
                <h3 className="font-medium">{f.q}</h3>
                <span aria-hidden className="mt-1 text-gold transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
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
              search={{ source: "homepage-footer" }}
              onClick={() => track("START_PROJECT", { source: "footer-cta" })}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-8 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a Project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/work"
              onClick={() => track("VIEW_WORK", { source: "footer-cta" })}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-border-strong px-8 py-4 text-[12.5px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-elevated"
            >
              View Selected Work
            </Link>
          </div>
          <div className="mt-10 flex justify-center"><ContactLinks /></div>
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
              alt={`${imageProjectType(img)} photography by Yomi Visuals`}
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
