import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  projectsQuery,
  servicesQuery,
  testimonialsQuery,
  settingsQuery,
  industriesQuery,
  coverFor,
} from "@/lib/cms";
import { portfolioQuery, heroSlides, rotatedFeatured, focalStyle } from "@/lib/portfolio";
import { HeroRotator } from "@/components/HeroRotator";
import { PhotoLightbox } from "@/components/PhotoLightbox";
import { Container, Section, SectionHeading, Reveal, TextLink, Eyebrow } from "@/components/site/ui";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(projectsQuery),
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(industriesQuery),
      context.queryClient.ensureQueryData(portfolioQuery),
    ]);
  },

  head: () => ({
    meta: [
      { title: "Yomi Visuals — Creative Agency in Lagos" },
      {
        name: "description",
        content:
          "Yomi Visuals is a Lagos creative agency building brands through strategy, design, photography, film and content production. Book a consultation.",
      },
      { property: "og:title", content: "Yomi Visuals — Creative Agency in Lagos" },
      {
        property: "og:description",
        content:
          "Strategy, design, visual storytelling and content production for brands that refuse to be forgettable.",
      },
      { property: "og:url", content: "https://yomivisuals.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: projects } = useSuspenseQuery(projectsQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: industries } = useSuspenseQuery(industriesQuery);
  const { data: photos } = useSuspenseQuery(portfolioQuery);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const hero = settings.home_hero ?? {};
  const clients: string[] = settings.clients?.logos ?? [];
  const process: { title: string; body: string }[] = settings.process?.steps ?? [];
  const cta = settings.home_cta ?? {};
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  const slides = heroSlides(photos);
  const homepagePhotos = photos.filter((p) => p.homepage);
  const showcase = (homepagePhotos.length >= 6 ? homepagePhotos : rotatedFeatured(photos, 9)).slice(0, 9);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24">
        {slides.length ? (
          <HeroRotator slides={slides} />
        ) : (
          <div className="absolute inset-0">
            <img
              src={coverFor(featured[0] ?? { slug: "hero" })}
              alt="Yomi Visuals campaign work"
              className="drift h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
          </div>
        )}

        <Container className="relative">
          <div className="fade-up">
            <Eyebrow>{hero.eyebrow ?? "Creative Agency — Lagos"}</Eyebrow>
            <h1 className="text-display mt-6 max-w-5xl text-[clamp(2.6rem,8vw,6.2rem)]">
              {hero.headline ?? "We Build Brands Through Creative Experiences."}
            </h1>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-subtle md:text-lg">
              {hero.subline}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {hero.primary_cta ?? "Book Consultation"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-7 py-4 text-[13.5px] font-medium transition-colors hover:bg-elevated"
              >
                {hero.secondary_cta ?? "View Our Work"}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Client marquee */}
      <div className="overflow-hidden border-y border-border py-6">
        <div className="marquee flex w-max gap-14 pr-14">
          {[...clients, ...clients].map((c, i) => (
            <span key={i} className="text-[13px] tracking-[0.16em] text-muted-foreground uppercase">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Photography showcase */}
      {showcase.length ? (
        <Section>
          <SectionHeading
            eyebrow="The Archive"
            title="Photography that outlives the moment."
            body="A rotating cut from the studio archive — portraits, fashion, beauty, editorial and celebration work."
            action={<TextLink to="/portfolio">Full archive</TextLink>}
          />
          <div className="columns-2 gap-3 md:columns-3 md:gap-4">
            {showcase.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightbox(i)}
                aria-label={`Open ${img.title}`}
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
                    alt={`${img.title} — ${img.category} photography by Yomi Visuals`}
                    loading="lazy"
                    decoding="async"
                    style={focalStyle(img)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
                  />
                </div>
              </button>
            ))}
          </div>
          <PhotoLightbox
            images={showcase}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onIndexChange={setLightbox}
          />
        </Section>
      ) : null}


      {/* Featured work */}
      <Section>
        <SectionHeading
          eyebrow="Selected Work"
          title="Campaigns, identities and films that moved a number."
          action={<TextLink to="/projects">All projects</TextLink>}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="image-reveal group block overflow-hidden rounded-[14px] border border-border bg-elevated"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={coverFor(p, i)} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="flex items-start justify-between gap-4 p-6">
                  <div>
                    <p className="text-[12px] text-muted-foreground">{p.client} · {p.industry}</p>
                    <h3 className="mt-1.5 text-[17px] font-medium tracking-tight">{p.title}</h3>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="What We Do"
          title="One studio. Every discipline the brand needs."
          action={<TextLink to="/services">All services</TextLink>}
        />
        <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col justify-between gap-8 bg-background p-7 transition-colors hover:bg-elevated"
            >
              <div>
                <h3 className="text-[16px] font-medium tracking-tight">{s.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.excerpt}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="How We Work" title="A process built to remove guesswork." />
        <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border md:grid-cols-5">
          {process.map((step, i) => (
            <div key={step.title} className="bg-background p-7">
              <span className="text-[12px] text-muted-foreground">0{i + 1}</span>
              <h3 className="mt-4 text-[16px] font-medium tracking-tight">{step.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Clients"
          title="What they said afterwards."
          action={<TextLink to="/testimonials">All testimonials</TextLink>}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.filter((t) => t.featured).map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <figure className="panel flex h-full flex-col justify-between p-7">
                <blockquote className="text-[16px] leading-relaxed tracking-tight">“{t.quote}”</blockquote>
                <figcaption className="mt-8 text-[12.5px] text-muted-foreground">
                  {t.name} — {t.role}, {t.company}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Industries */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="Industries" title="Where our work lives." />
        <div className="flex flex-wrap gap-2.5">
          {industries.map((ind) => (
            <span
              key={ind.id}
              className="rounded-full border border-border px-4 py-2 text-[13px] text-subtle"
            >
              {ind.name}
            </span>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="border-t border-border py-24 md:py-36">
        <Container className="text-center">
          <h2 className="text-display mx-auto max-w-3xl text-[clamp(2.2rem,6vw,4.4rem)]">
            {cta.headline ?? "Let's build something incredible."}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] text-muted-foreground">{cta.subline}</p>
          <Link
            to="/book"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[13.5px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {cta.cta ?? "Book Consultation"}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
