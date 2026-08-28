import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { settingsQuery, industriesQuery, studioPortraitImage } from "@/lib/cms";
import { Container, PageHero, Section, SectionHeading, ButtonLink, Reveal, Eyebrow } from "@/components/site/ui";
import { DIVISIONS, PROCESS_STAGES, TEAM_STRUCTURE } from "@/lib/ecosystem";

export const Route = createFileRoute("/about")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(industriesQuery),
    ]);
  },
  head: () => ({
    meta: [
      { title: "About Yomi Visuals — Creative Production Company, Lagos" },
      {
        name: "description",
        content:
          "The story, philosophy, people and network behind Yomi Visuals — a Lagos creative production company developing ideas, campaigns and visual experiences for ambitious brands.",
      },
      { property: "og:title", content: "About Yomi Visuals — Creative Production Company" },
      { property: "og:description", content: "Ideas first. Production second. The company behind the work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://yomivisuals.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://yomivisuals.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: industries } = useSuspenseQuery(industriesQuery);

  return (
    <>
      <PageHero
        eyebrow="The Company"
        title="A creative production company, not a portfolio."
        body="Yomi Visuals develops ideas, builds campaigns and produces the work that carries them — assembling the right creative and production team for every brief."
      >
        <ButtonLink to="/book">Start a Project</ButtonLink>
      </PageHero>

      {/* YV Story */}
      <Container className="py-14 md:py-20">
        <Eyebrow>YV Story</Eyebrow>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="image-reveal overflow-hidden border border-border">
            <img
              src={studioPortraitImage}
              alt="Yomi Visuals production team on set in Lagos"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-5 text-[15.5px] leading-relaxed text-subtle">
            <p>
              Yomi Visuals began as a photography practice and grew into what clients kept asking for: a company that
              could think the idea, build the team and produce the campaign without three agencies in between.
            </p>
            <p>
              Today we operate as a creative production company across creative direction, campaign development, film,
              photography, content and post-production — with a studio and a curated network of specialists behind it.
            </p>
            <p>
              We sell creative thinking and execution, not camera time. The standard belongs to the company, not to any
              one person on set.
            </p>
          </div>
        </div>
      </Container>

      {/* Philosophy */}
      <Section className="border-t border-border">
        <Eyebrow>Our Philosophy</Eyebrow>
        <h2 className="text-display mt-5 max-w-4xl text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.05]">
          Ideas first.
          <br />
          <span className="text-muted-foreground">Production second.</span>
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Good production without an idea is expensive decoration. We start with the business problem, define the
          creative direction, and only then decide what needs to be made.
        </p>
      </Section>

      {/* How we work */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="How We Work" title="Seven stages, brief to rollout." />
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STAGES.map((s) => (
            <div key={s.code} className="bg-background p-6 md:p-7">
              <span className="text-index">{s.code}</span>
              <h3 className="mt-4 text-[15px] font-medium uppercase tracking-[0.08em]">{s.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <Link
          to="/how-we-work"
          className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-foreground transition-colors hover:text-gold"
        >
          Explore the full process
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </Section>

      {/* Our people */}
      <Section className="border-t border-border">
        <SectionHeading eyebrow="Our People" title="Structured like a production company." />
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_1.3fr] md:gap-16">
          <div className="border border-border p-7">
            <p className="text-index">Founder</p>
            <h3 className="text-headline mt-4 text-[clamp(1.4rem,3.4vw,2rem)]">Yomi Onalaru</h3>
            <p className="text-serif mt-2 text-[1.05rem] normal-case text-gold">Founder &amp; Creative Producer</p>
            <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
              Creative vision, concept and campaign development, production oversight, client relationships and final
              creative quality control — building the teams that deliver the work.
            </p>
          </div>
          <ul className="grid gap-px self-start border border-border bg-border sm:grid-cols-2">
            {TEAM_STRUCTURE.map((t) => (
              <li key={t.group} className="bg-background p-5">
                <p className="text-[13px] font-medium uppercase tracking-[0.1em]">{t.group}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Our network */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Our Network"
          title="We assemble the team the project needs."
          body="Photographers, directors, editors, stylists, makeup artists, models, set designers, producers, writers and motion designers — briefed and directed by YV, held to one standard."
        />
        <ul className="flex flex-wrap gap-2">
          {DIVISIONS[6].services.map((s) => (
            <li key={s} className="border border-border px-4 py-2.5 text-[12.5px] text-subtle">
              {s}
            </li>
          ))}
        </ul>
      </Section>

      {/* Ecosystem */}
      <Section className="border-t border-border">
        <SectionHeading
          eyebrow="Our Ecosystem"
          title="Divisions under one master brand."
          body="Yomi Visuals is the parent company. Each division carries its own remit while sharing the same creative standard."
        />
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {DIVISIONS.map((d, i) => (
            <Reveal key={d.name} delay={(i % 4) * 60}>
              <div className="h-full bg-background p-6">
                <span className="text-index">{d.code}</span>
                <p className="mt-3 text-[13.5px] font-medium uppercase tracking-[0.1em]">{d.name}</p>
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">{d.tagline}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Link
          to="/ecosystem"
          className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-foreground transition-colors hover:text-gold"
        >
          View the ecosystem
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </Section>

      <Section className="border-t border-border">
        <SectionHeading eyebrow="Sectors" title="Who we work with." />
        <div className="flex flex-wrap gap-2.5">
          {industries.map((i) => (
            <span key={i.id} className="border border-border px-4 py-2 text-[13px] text-subtle">
              {i.name}
            </span>
          ))}
        </div>
      </Section>
    </>
  );
}
